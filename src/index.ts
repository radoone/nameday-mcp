import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { createMCPServer, setupServerHandlers, TOOLS, handleToolRequest } from "./server.js";

// Environment configuration
const isSSE = process.env.MCP_TRANSPORT === 'sse';
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
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

  // Root endpoint - Documentation page
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/html');
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nameday MCP Server</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                line-height: 1.6; 
                color: #333; 
                background: #f8f9fa;
            }
            .container { 
                background: white; 
                padding: 30px; 
                border-radius: 12px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            h1 { 
                color: #2c3e50; 
                margin-bottom: 10px; 
            }
            .subtitle { 
                color: #7f8c8d; 
                margin-bottom: 30px; 
                font-size: 1.1em; 
            }
            .highlight { 
                background: #e8f5e8; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #27ae60; 
            }
            .code-block { 
                background: #2d3748; 
                color: #e2e8f0; 
                padding: 15px; 
                border-radius: 6px; 
                overflow-x: auto; 
                font-family: 'Monaco', 'Menlo', monospace; 
                font-size: 14px; 
            }
            .endpoint { 
                background: #f8f9fa; 
                padding: 15px; 
                border-radius: 6px; 
                margin: 10px 0; 
                border: 1px solid #dee2e6; 
            }
            .method { 
                background: #007bff; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: bold; 
            }
            .method.post { 
                background: #28a745; 
            }
            .country-flags { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 10px; 
                margin: 15px 0; 
            }
            .flag { 
                background: #fff; 
                padding: 5px 10px; 
                border-radius: 20px; 
                border: 1px solid #ddd; 
                font-size: 14px; 
            }
            .github-link { 
                background: #24292e; 
                color: white; 
                padding: 10px 20px; 
                border-radius: 6px; 
                text-decoration: none; 
                display: inline-block; 
                margin: 10px 0; 
            }
            .github-link:hover { 
                background: #1a1e23; 
            }
            .status { 
                color: #28a745; 
                font-weight: bold; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 Nameday MCP Server</h1>
            <p class="subtitle">A Model Context Protocol server providing nameday information for 11+ countries</p>
            
            <div class="highlight">
                <h3>🌍 Supported Countries</h3>
                <div class="country-flags">
                    <span class="flag">🇸🇰 Slovakia</span>
                    <span class="flag">🇨🇿 Czech Republic</span>
                    <span class="flag">🇵🇱 Poland</span>
                    <span class="flag">🇭🇺 Hungary</span>
                    <span class="flag">🇦🇹 Austria</span>
                    <span class="flag">🇭🇷 Croatia</span>
                    <span class="flag">🇮🇹 Italy</span>
                    <span class="flag">🇫🇷 France</span>
                    <span class="flag">🇬🇷 Greece</span>
                    <span class="flag">🇷🇺 Russia</span>
                    <span class="flag">🇧🇬 Bulgaria</span>
                </div>
            </div>

            <h3>🚀 How to Connect to Online Version</h3>
            <p>Add this configuration to your <strong>Claude Desktop</strong> settings:</p>
            
            <div class="code-block">
{
  "mcpServers": {
    "nameday-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://nameday-mcp.vercel.app/sse"
      ]
    }
  }
}
            </div>

            <h3>📚 Available API Endpoints</h3>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/health</code>
                <p>Check server status and health</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/sse</code>
                <p>Server-Sent Events endpoint for MCP communication</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/tools</code>
                <p>List all available tools</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span> <code>/api/tools</code>
                <p>Execute a tool with parameters</p>
            </div>

            <h3>🔧 Available Tools</h3>
            <ul>
                <li><strong>find_name_day</strong> - Find when a specific name has its nameday</li>
                <li><strong>find_names_by_date</strong> - Find names celebrating on a specific date</li>
                <li><strong>get_today_name_days</strong> - Get today's nameday celebrations</li>
            </ul>

            <h3>💡 Example Usage</h3>
            <div class="code-block">
curl -X POST https://nameday-mcp.vercel.app/api/tools \\
  -H "Content-Type: application/json" \\
  -d '{"tool": "find_name_day", "args": {"name": "Peter", "locale": "sk"}}'
            </div>

            <h3>📖 More Information</h3>
            <a href="https://github.com/radoone/nameday-mcp" class="github-link">
                📂 View GitHub Repository
            </a>
            <p>For complete documentation, installation guide, and source code.</p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p style="text-align: center; color: #666; font-size: 14px;">
                <span class="status">● Online</span> | Server: ${serverName} | 
                <a href="/health" style="color: #007bff;">Health Check</a>
            </p>
        </div>
    </body>
    </html>
    `;
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

// Create app instance
const app = createApp(isVercel ? 'vercel-serverless' : 'nameday-mcp-server');

// Main execution logic
if (isVercel) {
  // For Vercel, we just create the app and export it
  console.log('Running on Vercel serverless environment');
} else if (isSSE) {
  // Local SSE mode - start HTTP server
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`MCP Server (SSE) listening on ${address}`);
  });
} else {
  // Local STDIO mode - start MCP server
  const server = createMCPServer();
  setupServerHandlers(server);
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.log("MCP Server is running in STDIO mode.");
}

// Export for Vercel
export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
}; 