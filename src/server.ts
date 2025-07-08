import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
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
          description:
            "Calendar locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
          enum: [
            "sk",
            "cz",
            "pl",
            "hu",
            "at",
            "hr",
            "bg",
            "ru",
            "gr",
            "fr",
            "it",
          ],
          default: "sk",
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
          description: "Calendar locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
          enum: ["sk","cz","pl","hu","at","hr","bg","ru","gr","fr","it"],
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
          description: "Calendar locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
          enum: ["sk","cz","pl","hu","at","hr","bg","ru","gr","fr","it"],
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
                text: `${searchName} has name day on ${formatDate(result.month, result.day)}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Name "${searchName}" was not found in the name day calendar.`,
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
                text: `${formatDate(month, day)} has name days: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `No names have name days on ${formatDate(month, day)}.`,
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
                text: `Today ${date} has name days: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Today ${date} no names have name days.`,
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
          text: `Error processing request: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

// Create and configure the MCP server
export function createMCPServer(): Server {
  const server = new Server({
    name: "meniny-mcp-server",
    version: "1.0.0",
  }, {
    capabilities: {
      tools: {},
    },
  });

  return server;
}

// Setup handlers for the server
export function setupServerHandlers(server: Server) {
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
}

export { TOOLS, handleToolRequest }; 