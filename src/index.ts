import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { createMCPServer, setupServerHandlers, TOOLS, handleToolRequest } from "./server.js";

// Environment configuration
const isSSE = process.env.MCP_TRANSPORT === 'sse';
const isVercel = process.env.VERCEL === '1';
const port = Number(process.env.PORT) || 3000;

// Create Fastify app factory
function createApp(serverName: string): FastifyInstance {
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
  app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: serverName,
      version: '1.0.0'
    };
  });

  // List available tools
  app.get('/api/tools', async (request: FastifyRequest, reply: FastifyReply) => {
    return { tools: TOOLS };
  });

  // Execute a tool
  app.post('/api/tools', async (request: FastifyRequest, reply: FastifyReply) => {
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

  return app;
}

// Create app instance for Vercel (only if needed)
export const app = isVercel ? createApp('vercel-serverless') : null;

// Main execution logic
if (isVercel) {
  // Vercel deployment handled by export above
} else if (isSSE) {
  // Local SSE mode - start HTTP server
  const localApp = createApp('mcp-sse-server');
  
  localApp.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      localApp.log.error(err);
      process.exit(1);
    }
    localApp.log.info(`MCP Server (SSE) listening on ${address}`);
  });
} else {
  // Local STDIO mode - start MCP server
  const server = createMCPServer();
  setupServerHandlers(server);
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.log("MCP Server is running in STDIO mode.");
}

// Default export for Vercel
export default async (req: any, res: any) => {
  if (!app) {
    throw new Error('App not initialized for Vercel');
  }
  await app.ready();
  app.server.emit('request', req, res);
}; 