import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";

import {
  findDateByName,
  findNamesByDate,
  formatDate,
  getTodayNameDays,
} from "./meniny-data.js";

// Define the tools available in this MCP server
const TOOLS: Tool[] = [
  {
    name: "find_name_day",
    description: "Find when a specific name has its name day in Slovak calendar",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name to search for (e.g., 'Peter', 'Mária')",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "find_names_by_date",
    description: "Find which names have their name day on a specific date",
    inputSchema: {
      type: "object",
      properties: {
        month: {
          type: "number",
          description: "Month (1-12)",
          minimum: 1,
          maximum: 12,
        },
        day: {
          type: "number",
          description: "Day of the month (1-31)",
          minimum: 1,
          maximum: 31,
        },
      },
      required: ["month", "day"],
    },
  },
  {
    name: "get_today_name_days",
    description: "Get the names that have their name day today",
    inputSchema: {
      type: "object",
      properties: {
        random_string: {
          type: "string",
          description: "Dummy parameter for no-parameter tools",
        },
      },
      required: ["random_string"],
    },
  },
];

// Helper function to handle tool requests
async function handleToolRequest(toolName: string, args: any) {
  try {
    switch (toolName) {
      case "find_name_day": {
        const { name: searchName } = z
          .object({ name: z.string() })
          .parse(args);

        const result = findDateByName(searchName);
        if (result) {
          return {
            content: [
              {
                type: "text",
                text: `${searchName} má meniny ${formatDate(result.month, result.day)}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Meno "${searchName}" nebolo nájdené v slovenskom kalendári menín.`,
              },
            ],
          };
        }
      }

      case "find_names_by_date": {
        const { month, day } = z
          .object({ month: z.number(), day: z.number() })
          .parse(args);

        const names = findNamesByDate(month, day);
        if (names.length > 0) {
          return {
            content: [
              {
                type: "text",
                text: `${formatDate(month, day)} má meniny: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Na ${formatDate(month, day)} nemá nikto meniny.`,
              },
            ],
          };
        }
      }

      case "get_today_name_days": {
        const { names, date } = getTodayNameDays();
        
        if (names.length > 0) {
          return {
            content: [
              {
                type: "text",
                text: `Dnes ${date} má meniny: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Dnes ${date} nemá nikto meniny.`,
              },
            ],
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Chyba pri spracovaní požiadavky: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

// Create the server
const server = new Server(
  {
    name: "meniny-mcp-server",
    version: "1.0.0",
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return await handleToolRequest(name, args);
});

// Check if we should run in SSE mode (for online deployment)
const isSSEMode = process.env.MCP_TRANSPORT === "sse";
const port = Number(process.env.PORT) || 3000;

if (isSSEMode) {
  // SSE mode for online deployment using Fastify
  const fastify: FastifyInstance = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    }
  });

  // Register CORS plugin
  await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Health check endpoint
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'fastify',
      version: '1.0.0'
    };
  });

  // List available tools
  fastify.get('/api/tools', async (request: FastifyRequest, reply: FastifyReply) => {
    return { tools: TOOLS };
  });

  // Execute a tool
  fastify.post('/api/tools', async (request: FastifyRequest, reply: FastifyReply) => {
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
  fastify.get('/sse', async (request: FastifyRequest, reply: FastifyReply) => {
    const transport = new SSEServerTransport('/messages', reply.raw);
    server.connect(transport);
  });

  // Messages endpoint for client-to-server communication
  fastify.post('/messages', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(405);
    return { error: 'Use SSE transport for message handling' };
  });

  // Start the Fastify server
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 MCP server running in SSE mode on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔌 SSE endpoint: http://localhost:${port}/sse`);
    console.log(`🛠️  API endpoints: http://localhost:${port}/api/tools`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  
} else {
  // Standard stdio mode for local use
  const transport = new StdioServerTransport();
  server.connect(transport);
  
  // This ensures the server keeps running and listening for requests
  server.onerror = (error) => console.error("[MCP Error]", error);
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });
} 