import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { app, server } from "./index.js";

const isSSE = process.env.MCP_TRANSPORT === 'sse';
const port = Number(process.env.PORT) || 3000;

if (isSSE) {
  // Start the Fastify server for SSE
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`MCP Server (SSE) listening on ${address}`);
  });
} else {
  // Use Stdio transport for local CLI/desktop usage
  const transport = new StdioServerTransport();
  server.connect(transport);
  transport.start();
  console.log("MCP Server is running in STDIO mode.");
} 