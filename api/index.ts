import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import { createMCPServer } from "../dist/server.js";

type SessionEntry = {
    transport: StreamableHTTPServerTransport;
    server: ReturnType<typeof createMCPServer>;
};

const sessions = new Map<string, SessionEntry>();

const getSessionIdHeader = (req: any): string | undefined => {
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
            sessions.set(sessionId, { transport, server });
        },
        onsessionclosed: (sessionId: string) => {
            const entry = sessions.get(sessionId);
            sessions.delete(sessionId);
            entry?.server.close().catch(() => undefined);
        },
    });

    transport.onclose = () => {
        const sessionId = transport.sessionId;
        if (sessionId) {
            const entry = sessions.get(sessionId);
            sessions.delete(sessionId);
            entry?.server.close().catch(() => undefined);
        }
    };

    await server.connect(transport);
    return { transport, server } as const;
};

export default async function handler(req: any, res: any) {
    // Ensure CORS headers match local server defaults
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id, mcp-protocol-version");

    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    const sessionId = getSessionIdHeader(req);

    if (sessionId) {
        const existingSession = sessions.get(sessionId);
        if (!existingSession) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                jsonrpc: "2.0",
                error: {
                    code: -32001,
                    message: "Session not found",
                },
                id: null,
            }));
            return;
        }

        await existingSession.transport.handleRequest(req, res);
        return;
    }

    const { transport } = await createSession();
    await transport.handleRequest(req, res);
}
