import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMCPServer } from "./server.js";
import http from "http";
import { randomUUID } from "node:crypto";
import { htmlContent } from "./html.js";

// Environment configuration
const port = Number(process.env.PORT) || 3000;
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

// Session store for Streamable HTTP transport
type SessionEntry = {
    transport: StreamableHTTPServerTransport;
    server: ReturnType<typeof createMCPServer>;
};

const sessions = new Map<string, SessionEntry>();

const getSessionIdHeader = (req: http.IncomingMessage): string | undefined => {
    const value = req.headers['mcp-session-id'];
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

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id, mcp-protocol-version');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const content = htmlContent.replace('server-placeholder', isVercel ? 'vercel-serverless' : 'nameday-mcp-server');
        res.end(content);
    } else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            server: isVercel ? 'vercel-serverless' : 'nameday-mcp-server',
            version: '1.1.0'
        }));
    } else if (req.url && req.url.startsWith('/mcp')) {
        const sessionId = getSessionIdHeader(req);

        if (sessionId) {
            const existingSession = sessions.get(sessionId);
            if (!existingSession) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    error: {
                        code: -32001,
                        message: 'Session not found',
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
        return;
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Main execution logic
if (process.env.MCP_TRANSPORT === 'stdio') {
    const stdioServer = createMCPServer();
    const transport = new StdioServerTransport();
    stdioServer.connect(transport);
    console.log("MCP Server is running in STDIO mode.");
} else {
    // Start the HTTP server unless this is a Vercel build
    if (process.env.VERCEL_ENV === undefined) {
        server.listen(port, () => {
            console.log(`MCP Server (HTTP) listening on port ${port}`);
        });
    }
}

export default server;
