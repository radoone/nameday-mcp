# 🎉 Nameday MCP Server

> A powerful Model Context Protocol (MCP) server providing comprehensive nameday information for 11+ countries. Perfect for AI assistants, chatbots, and applications needing cultural calendar data.

## 🌐 Try Online Version

**👉 [https://nameday-mcp.vercel.app/](https://nameday-mcp.vercel.app/)**

No installation required! The online version is ready to use immediately.

---

## ✨ Features

- **🌍 Multi-country support** - 11+ countries with comprehensive nameday calendars
- **🔍 Smart name search** - Find when any name celebrates with flexible matching
- **📅 Date lookup** - Discover all names celebrating on specific dates
- **⚡ Real-time queries** - Get today's nameday celebrations instantly
- **🎯 Accurate data** - Traditional and culturally authentic nameday information
- **🚀 Multiple access methods** - Online hosted version + local installation options

## 🌍 Supported Countries

| Country | Code | Calendar Coverage |
|---------|------|-------------------|
| 🇸🇰 Slovakia | `sk` | Complete yearly calendar |
| 🇨🇿 Czech Republic | `cz` | Complete yearly calendar |
| 🇵🇱 Poland | `pl` | Complete yearly calendar |
| 🇭🇺 Hungary | `hu` | Complete yearly calendar |
| 🇦🇹 Austria | `at` | Complete yearly calendar |
| 🇭🇷 Croatia | `hr` | Complete yearly calendar |
| 🇮🇹 Italy | `it` | Complete yearly calendar |
| 🇫🇷 France | `fr` | Complete yearly calendar |
| 🇬🇷 Greece | `gr` | Complete yearly calendar |
| 🇷🇺 Russia | `ru` | **Extended Orthodox calendar** |
| 🇧🇬 Bulgaria | `bg` | **Extended Orthodox calendar** |

> **Note:** Russian and Bulgarian calendars include comprehensive Orthodox feast days and traditional names.

## 🔧 Available Tools

### 1. **find_name_day**
Find when a specific name celebrates its nameday.

```json
{
  "tool": "find_name_day",
  "args": {
    "name": "Radovan",
    "locale": "sk"
  }
}
```

### 2. **find_names_by_date**
Discover which names celebrate on a specific date.

```json
{
  "tool": "find_names_by_date",
  "args": {
    "month": 6,
    "day": 29,
    "locale": "sk"
  }
}
```

### 3. **get_today_name_days**
Get today's nameday celebrations.

```json
{
  "tool": "get_today_name_days",
  "args": {
    "locale": "sk",
    "random_string": "dummy"
  }
}
```

## 🚀 Quick Start

### Option 1: Use Online Version (Recommended)

Simply add this to your **Claude Desktop** configuration:

```json
{
  "mcpServers": {
    "nameday-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://nameday-mcp.vercel.app/sse"
      ]
    }
  }
}
```

### Option 2: Local Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Add to Claude Desktop:**
   ```json
   {
     "mcpServers": {
       "nameday-mcp-server": {
         "command": "node",
         "args": ["./dist/index.js"],
         "cwd": "/path/to/nameday-mcp"
       }
     }
   }
   ```

## 📚 API Usage

### Direct API Testing

Test the online version directly:

```bash
curl -X POST https://nameday-mcp.vercel.app/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "find_name_day",
    "args": {
      "name": "Radovan",
      "locale": "sk"
    }
  }'
```

### Available Endpoints

- **GET** `/` - Interactive documentation
- **GET** `/health` - Server health check
- **GET** `/api/tools` - List available tools
- **POST** `/api/tools` - Execute tools
- **GET** `/sse` - MCP Server-Sent Events endpoint

## 💡 Example Queries

Ask your AI assistant:

- *"When is Radovan's nameday in Slovakia?"*
- *"Who celebrates nameday on June 29th in Czech Republic?"*
- *"What names have nameday today in Poland?"*
- *"Find all Hungarian names celebrating in July"*

## 🛠️ Development

### Local Development

**STDIO Mode (for Claude Desktop):**
```bash
npm run dev
```

**HTTP Mode (for testing):**
```bash
npm run dev:sse
```

### Project Structure

```
src/
├── index.ts          # Main server and HTTP endpoints
├── server.ts         # MCP server logic and tools
├── locale-nameday.ts # Nameday lookup functions
└── data/             # Nameday calendars for each country
    ├── sk.json       # Slovakia
    ├── cz.json       # Czech Republic
    └── ...           # Other countries
```

## 🎯 Use Cases

- **AI Assistants** - Add cultural calendar knowledge
- **Chatbots** - Provide nameday information in conversations
- **Applications** - Integrate nameday features
- **Personal Assistants** - Remind about friends' namedays

## 📖 More Information

- **Documentation:** Visit [https://nameday-mcp.vercel.app/](https://nameday-mcp.vercel.app/)
- **Source Code:** [GitHub Repository](https://github.com/radoone/nameday-mcp)
- **Issues:** Report bugs or request features on GitHub

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🌟 Ready to get started?** Try the [online version](https://nameday-mcp.vercel.app/) or configure it with your mcp host today! 