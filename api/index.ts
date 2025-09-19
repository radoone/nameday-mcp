import { createStreamableHttpHandler } from "../dist/streamable-http.js";

const streamableHandler = createStreamableHttpHandler();

export default async function handler(req: any, res: any) {
    await streamableHandler.handleRequest(req, res);
}
