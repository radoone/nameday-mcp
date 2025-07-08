import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { createMCPServer, setupServerHandlers, TOOLS, handleToolRequest } from "./server.js";

// Create a Fastify app instance
export const app: FastifyInstance = Fastify({
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
    server: 'vercel-fastify',
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
  const transport = new SSEServerTransport('/messages', reply.raw);
  server.connect(transport);
});

// Endpoint for receiving messages from the client
app.post('/messages', async (request, reply) => {
  const server = createMCPServer();
  setupServerHandlers(server);
  const transport = new SSEServerTransport('/messages', reply.raw);
  server.connect(transport);
  await transport.handlePostMessage(request.raw, reply.raw);
});

// Main handler for Vercel
export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
}; 