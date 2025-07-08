#!/usr/bin/env node

// Test script for online MCP server
const SERVER_URL = process.env.SERVER_URL || 'https://nameday-mcp.vercel.app/';

async function testEndpoint(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: true, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Slovak Name Days MCP Server');
  console.log(`🌐 Server URL: ${SERVER_URL}`);
  console.log('━'.repeat(50));
  
  // Test 1: Health check
  console.log('1️⃣ Testing health check...');
  const healthResult = await testEndpoint(`${SERVER_URL}/health`);
  if (healthResult.success) {
    console.log('✅ Health check passed');
    console.log(`   Status: ${healthResult.data.status}`);
    console.log(`   Time: ${healthResult.data.timestamp}`);
  } else {
    console.log('❌ Health check failed:', healthResult.error);
  }
  
  // Test 2: List tools
  console.log('\\n2️⃣ Testing tools list...');
  const toolsResult = await testEndpoint(`${SERVER_URL}/api/tools`);
  if (toolsResult.success) {
    console.log('✅ Tools list retrieved');
    console.log(`   Available tools: ${toolsResult.data.tools.length}`);
    toolsResult.data.tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
  } else {
    console.log('❌ Tools list failed:', toolsResult.error);
  }
  
  // Test 3: Find name day
  console.log('\\n3️⃣ Testing find_name_day...');
  const findNameResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_name_day',
      args: { name: 'Peter' }
    })
  });
  if (findNameResult.success) {
    console.log('✅ find_name_day works');
    console.log(`   Result: ${findNameResult.data.content[0].text}`);
  } else {
    console.log('❌ find_name_day failed:', findNameResult.error);
  }
  
  // Test 4: Find names by date
  console.log('\\n4️⃣ Testing find_names_by_date...');
  const findDateResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_names_by_date',
      args: { month: 6, day: 29 }
    })
  });
  if (findDateResult.success) {
    console.log('✅ find_names_by_date works');
    console.log(`   Result: ${findDateResult.data.content[0].text}`);
  } else {
    console.log('❌ find_names_by_date failed:', findDateResult.error);
  }
  
  // Test 5: Get today's name days
  console.log('\\n5️⃣ Testing get_today_name_days...');
  const todayResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'get_today_name_days',
      args: { random_string: 'test' }
    })
  });
  if (todayResult.success) {
    console.log('✅ get_today_name_days works');
    console.log(`   Result: ${todayResult.data.content[0].text}`);
  } else {
    console.log('❌ get_today_name_days failed:', todayResult.error);
  }
  
  console.log('\\n━'.repeat(50));
  console.log('✨ Testing complete!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch');
  process.exit(1);
}

runTests().catch(console.error); 