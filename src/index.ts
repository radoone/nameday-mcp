import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { findNamesByDateLocale, findDateByNameLocale, getTodayNameDaysLocale } from "./locale-meniny.js";

import { formatDate } from "./meniny-data.js";

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
        locale: {
          type: "string",
          description: "Calendar locale (sk, cz, hu, bg)",
          enum: ["sk", "cz", "hu", "bg"],
          default: "sk"
        }
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
        locale: {
          type: "string",
          description: "Calendar locale (sk, cz, hu, bg)",
          enum: ["sk", "cz", "hu", "bg"],
          default: "sk"
        }
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
        locale: {
          type: "string",
          description: "Calendar locale (sk, cz, hu, bg)",
          enum: ["sk", "cz", "hu", "bg"],
          default: "sk"
        }
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
        const { name: searchName, locale = 'sk' } = z
          .object({ name: z.string(), locale: z.string().optional() })
          .parse(args);

        const result = findDateByNameLocale(locale as any, searchName);
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
                text: `Meno "${searchName}" nebolo nájdené v kalendári menín.`,
              },
            ],
          };
        }
      }

      case "find_names_by_date": {
        const { month, day, locale = 'sk' } = z
          .object({ month: z.number(), day: z.number(), locale: z.string().optional() })
          .parse(args);

        const names = findNamesByDateLocale(locale as any, month, day);
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
        const { locale = 'sk' } = z
          .object({ locale: z.string().optional(), random_string: z.string() })
          .parse(args);

        const { names, date } = getTodayNameDaysLocale(locale as any);
        
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

// Create the MCP server instance
export const server = new Server({
  name: "meniny-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

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
  // The SDK is designed to have one transport per connection.
  // We create it here and let it handle the request.
  const transport = new SSEServerTransport('/messages', reply.raw);
  server.connect(transport);
  transport.start();
});

// Endpoint for receiving messages from the client
app.post('/messages', async (request, reply) => {
  // This is a bit of a hack to find the right transport
  // In a real app, you'd use the session ID to route this.
  const transport = server.transport as SSEServerTransport;
  if (transport) {
    await transport.handlePostMessage(request.raw, reply.raw);
  } else {
    reply.code(404).send('No active SSE transport found');
  }
});

// Main handler for Vercel
export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
}; 