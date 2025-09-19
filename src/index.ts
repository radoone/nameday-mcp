import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMCPServer } from "./server.js";
import http from "http";
import { htmlContent } from "./html.js";
import { createStreamableHttpHandler } from "./streamable-http.js";

// Environment configuration
const port = Number(process.env.PORT) || 3000;
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

const streamableHandler = createStreamableHttpHandler();

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id, mcp-protocol-version');
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const content = htmlContent.replace('server-placeholder', isVercel ? 'vercel-serverless' : 'nameday-mcp-server');
        res.end(content);
    }

    if (req.url === '/health') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id, mcp-protocol-version');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            server: isVercel ? 'vercel-serverless' : 'nameday-mcp-server',
            version: '1.1.0'
        }));
        return;
    }

    if (req.url && req.url.startsWith('/mcp')) {
        await streamableHandler.handleRequest(req, res);
        return;
    }

    res.writeHead(404);
    res.end();
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
