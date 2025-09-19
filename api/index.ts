import { applyCorsHeaders, createStreamableHttpHandler } from "../dist/streamable-http.js";
import { htmlContent } from "../dist/html.js";

const streamableHandler = createStreamableHttpHandler();

const sendHtml = (res: any, content: string) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Length", Buffer.byteLength(content, "utf8"));
    res.end(content);
};

const sendJson = (res: any, statusCode: number, body: unknown) => {
    const payload = JSON.stringify(body);
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", Buffer.byteLength(payload, "utf8"));
    res.end(payload);
};

export default async function handler(req: any, res: any) {
    const url = req.url ?? "/";

    if (req.method === "OPTIONS") {
        applyCorsHeaders(res);
        res.statusCode = 204;
        res.setHeader("Content-Length", "0");
        res.end();
        return;
    }

    if (url === "/" || url === "/index.html") {
        sendHtml(res, htmlContent);
        return;
    }

    if (url === "/health") {
        applyCorsHeaders(res);
        sendJson(res, 200, {
            status: "healthy",
            timestamp: new Date().toISOString(),
            server: "vercel-serverless",
            version: "1.1.0",
        });
        return;
    }

    if (url.startsWith("/mcp")) {
        await streamableHandler.handleRequest(req, res);
        return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Length", "0");
    res.end();
}
