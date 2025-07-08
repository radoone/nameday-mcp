import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { findNamesByDateLocale, findDateByNameLocale, getTodayNameDaysLocale, Locale } from "./locale-meniny.js";
import { formatDate } from "./meniny-data.js";

// Valid locales
const VALID_LOCALES = ['sk', 'cz', 'pl', 'hu', 'at', 'hr', 'bg', 'ru', 'gr', 'fr', 'it'] as const;

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

// Helper function to validate locale
const isValidLocale = (locale: string): locale is Locale => {
  return VALID_LOCALES.includes(locale as Locale);
};

// Helper function to validate date
const validateDate = (month: number, day: number): void => {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be an integer between 1 and 12.`);
  }
  
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Day must be an integer between 1 and 31.`);
  }
  
  // Additional validation for specific months
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    throw new Error(`Invalid day: ${day} for month ${month}. Maximum day for this month is ${daysInMonth[month - 1]}.`);
  }
};

// Helper function to handle tool requests
async function handleToolRequest(toolName: string, args: any) {
  try {
    switch (toolName) {
      case "find_name_day": {
        const { name: searchName, locale = 'sk' } = z
          .object({ name: z.string(), locale: z.string().optional() })
          .parse(args);

        // Validate locale
        if (!isValidLocale(locale)) {
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        const result = await findDateByNameLocale(locale, searchName);
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

        // Validate locale
        if (!isValidLocale(locale)) {
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        // Validate date
        validateDate(month, day);

        const names = await findNamesByDateLocale(locale, month, day);
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

        // Validate locale
        if (!isValidLocale(locale)) {
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        const { names, date } = await getTodayNameDaysLocale(locale);
        
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