import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMCPServer, setupServerHandlers, TOOLS, handleToolRequest } from "./server.js";
import Fastify from "fastify";
import cors from "@fastify/cors";

const isSSE = process.env.MCP_TRANSPORT === 'sse';
const port = Number(process.env.PORT) || 3000;

if (isSSE) {
  // Create Fastify app for SSE mode
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    }
  });

  // Register CORS plugin
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Health check endpoint
  app.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'mcp-sse-server',
      version: '1.0.0'
    };
  });

  // List available tools
  app.get('/api/tools', async () => {
    return { tools: TOOLS };
  });

  // Execute a tool
  app.post('/api/tools', async (request, reply) => {
    try {
      const body = request.body as any;
      const { tool, args } = body;
      
      if (!tool || !args) {
        reply.code(400);
        return { error: 'Missing tool or args in request body' };
      }
      
      const result = await handleToolRequest(tool, args);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reply.code(500);
      return { error: errorMessage };
    }
  });

  // SSE endpoint for MCP communication
  app.get('/sse', (request, reply) => {
    const server = createMCPServer();
    setupServerHandlers(server);
    const transport = new SSEServerTransport('/message', reply.raw);
    server.connect(transport);
  });

  // Endpoint for receiving messages from the client
  app.post('/message', async (request, reply) => {
    const server = createMCPServer();
    setupServerHandlers(server);
    const transport = new SSEServerTransport('/message', reply.raw);
    server.connect(transport);
    await transport.handlePostMessage(request.raw, reply.raw);
  });

  // Start the Fastify server for SSE
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`MCP Server (SSE) listening on ${address}`);
  });
} else {
  // Use Stdio transport for local CLI/desktop usage
  const server = createMCPServer();
  setupServerHandlers(server);
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.log("MCP Server is running in STDIO mode.");
} 