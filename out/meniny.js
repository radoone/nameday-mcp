"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const zod_1 = require("zod");
const meniny_data_js_1 = require("../src/meniny-data.js");
const TOOLS = [
    {
        name: 'find_name_day',
        description: 'Find when a specific name has its name day in Slovak calendar',
    },
    {
        name: 'find_names_by_date',
        description: 'Find which names have their name day on a specific date',
    },
    {
        name: 'get_today_name_days',
        description: 'Get the names that have their name day today',
    },
];
async function handleToolRequest(toolName, args) {
    switch (toolName) {
        case 'find_name_day': {
            const { name: searchName } = zod_1.z.object({ name: zod_1.z.string() }).parse(args);
            const result = (0, meniny_data_js_1.findDateByName)(searchName);
            if (result) {
                return { content: [{ type: 'text', text: `${searchName} má meniny ${(0, meniny_data_js_1.formatDate)(result.month, result.day)}.` }] };
            }
            return { content: [{ type: 'text', text: `Meno "${searchName}" nebolo nájdené v slovenskom kalendári menín.` }] };
        }
        case 'find_names_by_date': {
            const { month, day } = zod_1.z.object({ month: zod_1.z.number(), day: zod_1.z.number() }).parse(args);
            const names = (0, meniny_data_js_1.findNamesByDate)(month, day);
            if (names.length) {
                return { content: [{ type: 'text', text: `${(0, meniny_data_js_1.formatDate)(month, day)} má meniny: ${names.join(', ')}.` }] };
            }
            return { content: [{ type: 'text', text: `Na ${(0, meniny_data_js_1.formatDate)(month, day)} nemá nikto meniny.` }] };
        }
        case 'get_today_name_days': {
            const { names, date } = (0, meniny_data_js_1.getTodayNameDays)();
            if (names.length) {
                return { content: [{ type: 'text', text: `Dnes ${date} má meniny: ${names.join(', ')}.` }] };
            }
            return { content: [{ type: 'text', text: `Dnes ${date} nemá nikto meniny.` }] };
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    const { url = '/', method = 'GET' } = req;
    const pathname = url.split('?')[0];
    try {
        if (pathname === '/health' && method === 'GET') {
            return res.json({ status: 'healthy', timestamp: new Date().toISOString(), platform: 'vercel' });
        }
        if (pathname === '/api/tools' && method === 'GET') {
            return res.json({ tools: TOOLS });
        }
        if (pathname === '/api/tools' && method === 'POST') {
            const { tool, args } = req.body || {};
            if (!tool || !args) {
                return res.status(400).json({ error: 'Missing tool or args' });
            }
            const result = await handleToolRequest(tool, args);
            return res.json(result);
        }
        return res.status(404).json({ error: 'Not Found' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Error' });
    }
}
