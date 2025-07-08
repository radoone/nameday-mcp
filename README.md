# Nameday MCP Server

A Model Context Protocol (MCP) server that provides nameday information for multiple countries including Slovakia, Czech Republic, Poland, Hungary, and others. This server allows you to find when a specific name has its nameday or discover which names celebrate on a particular date.

## Supported Countries

- 🇸🇰 **Slovakia** (sk) - Complete Slovak nameday calendar
- 🇨🇿 **Czech Republic** (cz) - Czech nameday calendar
- 🇵🇱 **Poland** (pl) - Polish nameday calendar
- 🇭🇺 **Hungary** (hu) - Hungarian nameday calendar
- 🇦🇹 **Austria** (at) - Austrian nameday calendar
- 🇭🇷 **Croatia** (hr) - Croatian nameday calendar
- 🇮🇹 **Italy** (it) - Italian nameday calendar
- 🇫🇷 **France** (fr) - French nameday calendar
- 🇬🇷 **Greece** (gr) - Greek nameday calendar
- 🇷🇺 **Russia** (ru) - Russian nameday calendar
- 🇧🇬 **Bulgaria** (bg) - Bulgarian nameday calendar

---

## Quick Functionality Test

You can quickly verify that the server works in both online (SSE/HTTP) and offline (stdio) modes:

### Online Mode (SSE/HTTP)

1. **Start the server in online mode:**
   ```bash
   npm run dev:sse
   # or for production:
   npm run start:sse
   ```
2. **Run the test script:**
   ```bash
   node scripts/test-online.js
   ```
   - Optionally, set the SERVER_URL environment variable if testing a remote server:
     ```bash
     SERVER_URL="http://localhost:3000" node scripts/test-online.js
     ```
3. **Expected result:**
   - All tests should pass (you will see ✅ in the console).

> **Note:** The test script works only for the online (HTTP API) mode.

### Offline Mode (STDIO, for Claude Desktop)

1. **Start the server in offline mode:**
   ```bash
   npm run dev
   # or for production:
   npm start
   ```
2. **Test via Claude Desktop:**
   - In Claude Desktop settings, add a new MCP server as described below (see "Claude Desktop Configuration").
   - Connect to the server and ask questions like:
     - "When is Peter's nameday?"
     - "Who has nameday on June 29th?"
     - "What Slovak names celebrate today?"
   - If you get a correct answer, the offline mode works.

---

## Features

- **Multi-country support**: Nameday information for 11+ countries
- **Find nameday by name**: Search for when a specific name has its nameday
- **Find names by date**: Discover which names celebrate on a specific date
- **Get today's namedays**: Find out who celebrates today
- **Comprehensive calendars**: Includes traditional namedays throughout the year
- **Flexible name matching**: Supports search with and without diacritics
- **Multiple deployment options**: Local (stdio), Online (SSE), and Cloud platforms

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Usage

### Local Usage (stdio transport)

For local development and Claude Desktop integration:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

### Online Usage (SSE transport)

For web-based clients and online deployment:

```bash
npm run dev:sse
```

Or for production:

```bash
npm run start:sse
```

The server will be available at:
- Health check: `http://localhost:3000/health`
- SSE endpoint: `http://localhost:3000/sse`

## Deployment Options

### 1. Docker Deployment

Build and run using Docker:

```bash
# Build the Docker image
docker build -t nameday-mcp-server .

# Run the container
docker run -p 3000:3000 -e MCP_TRANSPORT=sse nameday-mcp-server
```

### 2. Docker Compose with Nginx

For production deployment with reverse proxy:

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Railway Deployment

Deploy to Railway.app:

1. Connect your GitHub repository to Railway
2. The `railway.toml` file will automatically configure the deployment
3. Your server will be available at `https://your-app.railway.app`

### 4. Cloudflare Workers

Deploy to Cloudflare's edge network:

1. Copy the code from `deploy/cloudflare-worker.js`
2. Go to [Cloudflare Workers](https://workers.cloudflare.com/)
3. Create a new worker and paste the code
4. Deploy and access at `https://your-worker.your-account.workers.dev`

### 5. Other Cloud Platforms

The Docker container can be deployed to:
- **AWS ECS/Fargate**: Use the provided Dockerfile
- **Google Cloud Run**: Deploy directly from the container
- **Azure Container Instances**: Use the Docker image
- **Heroku**: Deploy using the Dockerfile
- **DigitalOcean App Platform**: Connect your repository

## Configuration

### Environment Variables

- `MCP_TRANSPORT`: Set to `"sse"` for online deployment, leave unset for local stdio
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to `"production"` for production deployments

### Claude Desktop Configuration

For local stdio usage:

```json
{
  "mcpServers": {
    "nameday-mcp-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "./path/to/nameday-mcp"
    }
  }
}
```

For online SSE usage with mcp-remote:

```json
{
  "mcpServers": {
    "nameday-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://your-server.com/sse"
      ]
    }
  }
}
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and timestamp

### SSE Connection
- **GET** `/sse`
- Establishes Server-Sent Events connection for MCP communication

### Direct Tool API (for testing)
- **GET** `/api/tools` - List available tools
- **POST** `/api/tools` - Execute a tool

Example tool usage:
```bash
curl -X POST https://your-server.com/api/tools \
  -H "Content-Type: application/json" \
  -d '{"tool": "find_name_day", "args": {"name": "Peter"}}'
```

## Available Tools

### 1. find_name_day
Find when a specific name has its nameday.

**Parameters:**
- `name` (string): The name to search for

**Example:**
```json
{
  "tool": "find_name_day",
  "args": {"name": "Peter"}
}
```

### 2. find_names_by_date
Find which names celebrate on a specific date.

**Parameters:**
- `month` (number): Month (1-12)
- `day` (number): Day of the month (1-31)

**Example:**
```json
{
  "tool": "find_names_by_date",
  "args": {"month": 6, "day": 29}
}
```

### 3. get_today_name_days
Get the names that have their nameday today.

**Parameters:**
- `random_string` (string): Dummy parameter (required by MCP spec)

**Example:**
```json
{
  "tool": "get_today_name_days",
  "args": {"random_string": "dummy"}
}
```

## Security

For online deployments:
- Use HTTPS in production
- Implement authentication if needed
- Configure CORS appropriately
- Use rate limiting to prevent abuse
- Monitor and log access

## Monitoring

The server includes:
- Health check endpoint for load balancers
- Structured logging for debugging
- CORS support for web clients
- Error handling and recovery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue in the GitHub repository
- Check the health endpoint for server status
- Review logs for debugging information

---

**Note**: This MCP server provides nameday information for multiple countries with comprehensive traditional nameday calendars. The data includes all standard names throughout the year for each supported country. 