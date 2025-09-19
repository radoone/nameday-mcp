
export const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nameday MCP Server</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
            color: #333; 
            background: #f8f9fa;
        }
        .container { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #2c3e50; 
            margin-bottom: 10px; 
        }
        .subtitle { 
            color: #7f8c8d; 
            margin-bottom: 30px; 
            font-size: 1.1em; 
        }
        .highlight { 
            background: #e8f5e8; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #27ae60; 
        }
        .code-block { 
            background: #2d3748; 
            color: #e2e8f0; 
            padding: 15px; 
            border-radius: 6px; 
            overflow-x: auto; 
            font-family: 'Monaco', 'Menlo', monospace; 
            font-size: 14px; 
        }
        .endpoint { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 10px 0; 
            border: 1px solid #dee2e6; 
        }
        .method { 
            background: #007bff; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .method.post { 
            background: #28a745; 
        }
        .country-flags { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px; 
            margin: 15px 0; 
        }
        .flag { 
            background: #fff; 
            padding: 5px 10px; 
            border-radius: 20px; 
            border: 1px solid #ddd; 
            font-size: 14px; 
        }
        .github-link { 
            background: #24292e; 
            color: white; 
            padding: 10px 20px; 
            border-radius: 6px; 
            text-decoration: none; 
            display: inline-block; 
            margin: 10px 0; 
        }
        .github-link:hover { 
            background: #1a1e23; 
        }
        .status { 
            color: #28a745; 
            font-weight: bold; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Nameday MCP Server</h1>
        <p class="subtitle">A complete Model Context Protocol server with tools, resources, prompts, and logging for 11+ countries</p>
        
        <div class="highlight">
            <h3>✨ MCP Capabilities</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>🔧 Tools</strong> - 3 nameday lookup tools with validation</li>
                <li><strong>📊 Resources</strong> - Contextual information about locales and statistics</li>
                <li><strong>🎛️ Prompts</strong> - Pre-built query templates for common operations</li>
                <li><strong>📝 Logging</strong> - Comprehensive debugging and monitoring</li>
            </ul>
        </div>
        
        <div class="highlight">
            <h3>🌍 Supported Countries</h3>
            <div class="country-flags">
                <span class="flag">🇸🇰 Slovakia</span>
                <span class="flag">🇨🇿 Czech Republic</span>
                <span class="flag">🇵🇱 Poland</span>
                <span class="flag">🇭🇺 Hungary</span>
                <span class="flag">🇦🇹 Austria</span>
                <span class="flag">🇭🇷 Croatia</span>
                <span class="flag">🇮🇹 Italy</span>
                <span class="flag">🇫🇷 France</span>
                <span class="flag">🇬🇷 Greece</span>
                <span class="flag">🇷🇺 Russia</span>
                <span class="flag">🇧🇬 Bulgaria</span>
            </div>
        </div>

        <h3>🚀 How to Connect to Online Version</h3>
        <p>Add this configuration to your <strong>Claude Desktop</strong> settings:</p>
        
        <div class="code-block">
{
  "mcpServers": {
    "nameday-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://nameday-mcp.vercel.app/mcp"
      ]
    }
  }
}
        </div>

        <h3>📚 Available API Endpoints</h3>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/health</code>
            <p>Check server status and health</p>
        </div>
        
        <div class="endpoint">
            <span class="method">GET/POST</span> <code>/mcp</code>
            <p>HTTP Stream endpoint for MCP communication</p>
        </div>

        <h3>📖 More Information</h3>
        <a href="https://github.com/radoone/nameday-mcp" class="github-link">
            📂 View GitHub Repository
        </a>
        <p>For complete documentation, installation guide, and source code.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="text-align: center; color: #666; font-size: 14px;">
            <span class="status">● Online</span> | Server: server-placeholder | 
            <a href="/health" style="color: #007bff;">Health Check</a>
        </p>
    </div>
</body>
</html>
`;
