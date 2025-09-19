import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { findNamesByDateLocale, findDateByNameLocale, getTodayNameDaysLocale, Locale } from "./locale-nameday.js";

// Valid locales
const VALID_LOCALES = ['sk', 'cz', 'pl', 'hu', 'at', 'hr', 'bg', 'ru', 'gr', 'fr', 'it'] as const;

// Helper function to format date
const formatDate = (month: number, day: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Validate month
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be between 1 and 12.`);
  }
  
  // Validate day
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Day must be between 1 and 31.`);
  }
  
  // Additional validation for specific months
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    throw new Error(`Invalid day: ${day} for month ${month}. Maximum day for this month is ${daysInMonth[month - 1]}.`);
  }
  
  return `${monthNames[month - 1]} ${day}`;
};

// Define the tools available in this MCP server
const TOOLS: Tool[] = [
  {
    name: "find_name_day",
    description: "Find when a specific name has its name day",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name to search for (e.g., 'Radovan', 'Mária')",
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
        },
        day: {
          type: "number",
          description: "Day of the month (1-31)",
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
      required: ["month", "day"],
    },
  },
  {
    name: "get_today_name_days",
    description: "Get the names that have their name day today",
    inputSchema: {
      type: "object",
      properties: {
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
        },
        random_string: {
          type: "string",
          description: "Dummy parameter for no-parameter tools",
        },
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
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be an integer between 1 and 12.`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Day must be an integer between 1 and 31.`);
  }
};

// Handle tool requests
export async function handleToolRequest(name: string, args: any) {
  // Log the incoming request
  console.log(`[MCP Server] Tool request: ${name}`, JSON.stringify(args, null, 2));
  
  try {
    switch (name) {
      case "find_name_day": {
        const { name: searchName, locale = 'sk' } = z
          .object({ name: z.string(), locale: z.string().optional() })
          .parse(args);

        // Validate locale
        if (!isValidLocale(locale)) {
          console.warn(`[MCP Server] Invalid locale requested: ${locale}`);
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        console.log(`[MCP Server] Looking up nameday for "${searchName}" in locale "${locale}"`);
        const result = await findDateByNameLocale(locale, searchName);
        
        if (result) {
          console.log(`[MCP Server] Found nameday: ${searchName} -> ${formatDate(result.month, result.day)}`);
          return {
            content: [
              {
                type: "text",
                text: `${searchName} has name day on ${formatDate(result.month, result.day)}.`,
              },
            ],
          };
        } else {
          console.log(`[MCP Server] Name not found: "${searchName}" in locale "${locale}"`);
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
          console.warn(`[MCP Server] Invalid locale requested: ${locale}`);
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        // Validate date
        validateDate(month, day);
        
        console.log(`[MCP Server] Looking up names for date ${month}/${day} in locale "${locale}"`);
        const names = await findNamesByDateLocale(locale, month, day);
        
        if (names.length > 0) {
          console.log(`[MCP Server] Found ${names.length} names for ${formatDate(month, day)}: ${names.join(', ')}`);
          return {
            content: [
              {
                type: "text",
                text: `${formatDate(month, day)} has name days: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          console.log(`[MCP Server] No names found for date ${formatDate(month, day)}`);
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
          console.warn(`[MCP Server] Invalid locale requested: ${locale}`);
          throw new Error(`Invalid locale: ${locale}. Supported locales are: ${VALID_LOCALES.join(', ')}`);
        }

        console.log(`[MCP Server] Getting today's namedays for locale "${locale}"`);
        const { names, date } = await getTodayNameDaysLocale(locale);
        
        if (names.length > 0) {
          console.log(`[MCP Server] Today's namedays (${date}): ${names.join(', ')}`);
          return {
            content: [
              {
                type: "text",
                text: `Today ${date} has name days: ${names.join(", ")}.`,
              },
            ],
          };
        } else {
          console.log(`[MCP Server] No namedays today (${date})`);
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
        console.error(`[MCP Server] Unknown tool requested: ${name}`);
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Handle validation errors and other issues
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[MCP Server] Error processing request for tool "${name}":`, errorMessage);
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
    name: "nameday-mcp-server",
    version: "1.1.0",
  }, {
    capabilities: {
      tools: {
        listChanged: false,
      },
      resources: {
        subscribe: false,
        listChanged: false,
      },
      prompts: {
        listChanged: false,
      },
      logging: {},
    },
  });

  setupServerHandlers(server);

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

  // Register resource handlers
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "nameday://supported-locales",
          name: "Supported Locales",
          description: "List of supported country locales for nameday data",
          mimeType: "application/json"
        },
        {
          uri: "nameday://locale-info/sk",
          name: "Slovakia Nameday Info",
          description: "Information about Slovakia nameday calendar",
          mimeType: "application/json"
        },
        {
          uri: "nameday://locale-info/cz",
          name: "Czech Republic Nameday Info", 
          description: "Information about Czech Republic nameday calendar",
          mimeType: "application/json"
        },
        {
          uri: "nameday://statistics",
          name: "Nameday Statistics",
          description: "Statistics about available nameday data across all locales",
          mimeType: "application/json"
        }
      ]
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    switch (uri) {
      case "nameday://supported-locales":
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify({
                locales: VALID_LOCALES.map(locale => ({
                  code: locale,
                  name: getLocaleName(locale)
                })),
                total: VALID_LOCALES.length
              }, null, 2)
            }
          ]
        };

      case "nameday://locale-info/sk":
        return {
          contents: [
            {
              uri,
              mimeType: "application/json", 
              text: JSON.stringify({
                locale: "sk",
                name: "Slovakia",
                description: "Traditional Slovak nameday calendar with Catholic saints and traditional names",
                calendar_type: "Gregorian",
                cultural_context: "Catholic tradition, widely celebrated in Slovakia"
              }, null, 2)
            }
          ]
        };

      case "nameday://locale-info/cz":
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify({
                locale: "cz", 
                name: "Czech Republic",
                description: "Traditional Czech nameday calendar with Catholic saints and traditional names",
                calendar_type: "Gregorian",
                cultural_context: "Catholic tradition, widely celebrated in Czech Republic"
              }, null, 2)
            }
          ]
        };

      case "nameday://statistics":
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify({
                total_locales: VALID_LOCALES.length,
                supported_countries: [
                  "Slovakia", "Czech Republic", "Poland", "Hungary", 
                  "Austria", "Croatia", "Bulgaria", "Russia", "Greece", 
                  "France", "Italy"
                ],
                tools_available: 3,
                features: ["name_lookup", "date_lookup", "today_namedays"]
              }, null, 2)
            }
          ]
        };

      default:
        throw new Error(`Resource not found: ${uri}`);
    }
  });

  // Register prompt handlers
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "find-nameday",
          description: "Find when a specific name has its nameday",
          arguments: [
            {
              name: "name",
              description: "The name to search for (e.g., 'Radovan', 'Mária')",
              required: true
            },
            {
              name: "locale",
              description: "Country locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
              required: false
            }
          ]
        },
        {
          name: "names-on-date",
          description: "Find which names celebrate on a specific date",
          arguments: [
            {
              name: "month",
              description: "Month number (1-12)",
              required: true
            },
            {
              name: "day", 
              description: "Day of the month (1-31)",
              required: true
            },
            {
              name: "locale",
              description: "Country locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
              required: false
            }
          ]
        },
        {
          name: "today-namedays",
          description: "Get today's nameday celebrations",
          arguments: [
            {
              name: "locale",
              description: "Country locale (sk, cz, pl, hu, at, hr, bg, ru, gr, fr, it)",
              required: false
            }
          ]
        }
      ]
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "find-nameday":
        const nameToFind = args?.name || "[NAME]";
        const locale1 = args?.locale || "sk";
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Find when the name "${nameToFind}" has its nameday in ${getLocaleName(locale1)} (locale: ${locale1}). Use the find_name_day tool to get this information.`
              }
            }
          ]
        };

      case "names-on-date":
        const month = args?.month || "[MONTH]";
        const day = args?.day || "[DAY]";
        const locale2 = args?.locale || "sk";
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Find which names have their nameday on ${month}/${day} in ${getLocaleName(locale2)} (locale: ${locale2}). Use the find_names_by_date tool with month=${month} and day=${day}.`
              }
            }
          ]
        };

      case "today-namedays":
        const locale3 = args?.locale || "sk";
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Get today's nameday celebrations in ${getLocaleName(locale3)} (locale: ${locale3}). Use the get_today_name_days tool to retrieve this information.`
              }
            }
          ]
        };

      default:
        throw new Error(`Prompt not found: ${name}`);
    }
  });
}

// Helper function to get locale display name
function getLocaleName(locale: string): string {
  const localeNames: Record<string, string> = {
    'sk': 'Slovakia',
    'cz': 'Czech Republic', 
    'pl': 'Poland',
    'hu': 'Hungary',
    'at': 'Austria',
    'hr': 'Croatia',
    'bg': 'Bulgaria',
    'ru': 'Russia',
    'gr': 'Greece',
    'fr': 'France',
    'it': 'Italy'
  };
  return localeNames[locale] || locale.toUpperCase();
}

export { TOOLS }; 
