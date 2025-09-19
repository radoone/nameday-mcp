import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "http";
import { createMCPServer } from "./server.js";

export const STREAM_HELP_TEXT = `Nameday MCP Streamable HTTP endpoint\n\n` +
  `• POST /mcp with 'Accept: application/json, text/event-stream' to initialize a session.\n` +
  `• Reuse the returned mcp-session-id header on subsequent POST /mcp calls.\n` +
  `• Open GET / for human-friendly documentation.`;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-session-id, mcp-protocol-version",
};

type RequestLike = IncomingMessage & { method?: string };
type ResponseLike = ServerResponse;

type SessionEntry = {
  transport: StreamableHTTPServerTransport;
  server: ReturnType<typeof createMCPServer>;
};

const json = (data: unknown): string => JSON.stringify(data);

const bufferLength = (value: string): number => Buffer.byteLength(value, "utf8");

export function applyCorsHeaders(res: { setHeader(name: string, value: string): void }) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }
}

export function createStreamableHttpHandler() {
  const sessions = new Map<string, SessionEntry>();

  const cleanupSession = (sessionId?: string | null) => {
    if (!sessionId) {
      return;
    }
    const entry = sessions.get(sessionId);
    if (!entry) {
      return;
    }
    sessions.delete(sessionId);
    entry.server.close().catch(() => undefined);
  };

  const getSessionIdHeader = (req: RequestLike): string | undefined => {
    const value = req.headers?.["mcp-session-id"];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  const createSession = async () => {
    const server = createMCPServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: randomUUID,
      onsessioninitialized: (sessionId: string) => {
        cleanupSession(sessionId);
        sessions.set(sessionId, { transport, server });
      },
      onsessionclosed: (sessionId: string) => {
        cleanupSession(sessionId);
      },
    });

    transport.onclose = () => {
      cleanupSession(transport.sessionId);
    };

    await server.connect(transport);
    return { transport } as const;
  };

  const sendHelpResponse = (res: ResponseLike) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Length", bufferLength(STREAM_HELP_TEXT).toString());
    res.end(STREAM_HELP_TEXT);
  };

  const sendJsonResponse = (res: ResponseLike, statusCode: number, payload: unknown) => {
    const body = json(payload);
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", bufferLength(body).toString());
    res.end(body);
  };

  const handleRequest = async (req: RequestLike, res: ResponseLike): Promise<void> => {
    applyCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Content-Length", "0");
      res.end();
      return;
    }

    if (req.method === "GET") {
      const acceptHeader = (req.headers?.["accept"] || "").toString().toLowerCase();
      if (!acceptHeader.includes("text/event-stream")) {
        sendHelpResponse(res);
        return;
      }
    }

    const sessionId = getSessionIdHeader(req);

    if (sessionId) {
      const existingSession = sessions.get(sessionId);
      if (!existingSession) {
        sendJsonResponse(res, 404, {
          jsonrpc: "2.0",
          error: {
            code: -32001,
            message: "Session not found",
          },
          id: null,
        });
        return;
      }
      await existingSession.transport.handleRequest(req as IncomingMessage, res as ServerResponse);
      return;
    }

    const { transport } = await createSession();
    await transport.handleRequest(req as IncomingMessage, res as ServerResponse);
  };

  return { handleRequest };
}
