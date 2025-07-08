"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
const fastify_1 = require("fastify");
const cors_1 = require("@fastify/cors");
const meniny_data_js_1 = require("../src/meniny-data.js");
const zod_1 = require("zod");
const TOOLS = [
    {
        name: 'find_name_day',
        description: 'Find when a specific name has its name day in Slovak calendar',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: "The name to search for (e.g., 'Peter', 'Mária')" },
            },
            required: ['name'],
        },
    },
    {
        name: 'find_names_by_date',
        description: 'Find which names have their name day on a specific date',
        inputSchema: {
            type: 'object',
            properties: {
                month: { type: 'number', description: 'Month (1-12)', minimum: 1, maximum: 12 },
                day: { type: 'number', description: 'Day of the month (1-31)', minimum: 1, maximum: 31 },
            },
            required: ['month', 'day'],
        },
    },
    {
        name: 'get_today_name_days',
        description: 'Get the names that have their name day today',
        inputSchema: {
            type: 'object',
            properties: {
                random_string: { type: 'string', description: 'Dummy parameter for no-parameter tools' },
            },
            required: ['random_string'],
        },
    },
];
async function handleToolRequest(toolName, args) {
    try {
        switch (toolName) {
            case 'find_name_day': {
                const { name: searchName } = zod_1.z.object({ name: zod_1.z.string() }).parse(args);
                const result = (0, meniny_data_js_1.findDateByName)(searchName);
                if (result) {
                    return { content: [{ type: 'text', text: `${searchName} má meniny ${(0, meniny_data_js_1.formatDate)(result.month, result.day)}.` }] };
                }
                else {
                    return { content: [{ type: 'text', text: `Meno "${searchName}" nebolo nájdené v slovenskom kalendári menín.` }] };
                }
            }
            case 'find_names_by_date': {
                const { month, day } = zod_1.z.object({ month: zod_1.z.number(), day: zod_1.z.number() }).parse(args);
                const names = (0, meniny_data_js_1.findNamesByDate)(month, day);
                if (names.length > 0) {
                    return { content: [{ type: 'text', text: `${(0, meniny_data_js_1.formatDate)(month, day)} má meniny: ${names.join(', ')}.` }] };
                }
                else {
                    return { content: [{ type: 'text', text: `Na ${(0, meniny_data_js_1.formatDate)(month, day)} nemá nikto meniny.` }] };
                }
            }
            case 'get_today_name_days': {
                const { names, date } = (0, meniny_data_js_1.getTodayNameDays)();
                if (names.length > 0) {
                    return { content: [{ type: 'text', text: `Dnes ${date} má meniny: ${names.join(', ')}.` }] };
                }
                else {
                    return { content: [{ type: 'text', text: `Dnes ${date} nemá nikto meniny.` }] };
                }
            }
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text', text: `Chyba pri spracovaní požiadavky: ${errorMessage}` }], isError: true };
    }
}
const fastify = (0, fastify_1.default)();
fastify.register(cors_1.default, { origin: true });
fastify.get('/health', async (req, reply) => {
    return { status: 'healthy', timestamp: new Date().toISOString(), server: 'fastify', version: '1.0.0' };
});
fastify.get('/api/tools', async (req, reply) => {
    return { tools: TOOLS };
});
fastify.post('/api/tools', async (req, reply) => {
    try {
        const { tool, args } = req.body;
        if (!tool || !args) {
            reply.code(400);
            return { error: 'Missing tool or args in request body' };
        }
        const result = await handleToolRequest(tool, args);
        return result;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        reply.code(500);
        return { error: errorMessage };
    }
});
fastify.get('/sse', async (req, reply) => {
    reply.code(501);
    return { error: 'SSE not supported on Firebase Functions' };
});
fastify.post('/messages', async (req, reply) => {
    reply.code(405);
    return { error: 'Use /api/tools for message handling' };
});
exports.api = functions.https.onRequest((req, res) => {
    fastify.ready().then(() => {
        fastify.server.emit('request', req, res);
    });
});
