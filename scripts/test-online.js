#!/usr/bin/env node

// Test script for online MCP server
const SERVER_URL = process.env.SERVER_URL || 'https://nameday-mcp.vercel.app/';

// Available locales to test
const LOCALES = ['sk', 'cz', 'pl', 'hu', 'at', 'hr', 'bg', 'ru', 'gr', 'fr', 'it'];

// Test data for different locales
const TEST_NAMES = {
  'sk': 'Peter',
  'cz': 'Petr', 
  'pl': 'Piotr',
  'hu': 'Péter',
  'at': 'Peter',
  'hr': 'Petar',
  'bg': 'Петър',
  'ru': 'Петр',
  'gr': 'Petros',
  'fr': 'Pierre',
  'it': 'Pietro'
};

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

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

function logTest(testName, success, message = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
    if (message) console.log(`   ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}`);
    if (message) console.log(`   ${message}`);
  }
}

async function testMultipleLocales() {
  console.log('🌍 Testing multiple locales...');
  
  // Test find_name_day for all locales
  console.log('\n📅 Testing find_name_day across locales:');
  for (const locale of LOCALES) {
    const testName = TEST_NAMES[locale] || 'Peter';
    const result = await testEndpoint(`${SERVER_URL}/api/tools`, {
      method: 'POST',
      body: JSON.stringify({
        tool: 'find_name_day',
        args: { name: testName, locale }
      })
    });
    
    logTest(
      `find_name_day (${locale.toUpperCase()}) - ${testName}`,
      result.success,
      result.success ? result.data.content[0].text : result.error
    );
  }
  
  // Test find_names_by_date for all locales (June 29th)
  console.log('\n📆 Testing find_names_by_date across locales (June 29th):');
  for (const locale of LOCALES) {
    const result = await testEndpoint(`${SERVER_URL}/api/tools`, {
      method: 'POST',
      body: JSON.stringify({
        tool: 'find_names_by_date',
        args: { month: 6, day: 29, locale }
      })
    });
    
    logTest(
      `find_names_by_date (${locale.toUpperCase()}) - June 29th`,
      result.success,
      result.success ? result.data.content[0].text : result.error
    );
  }
  
  // Test get_today_name_days for all locales  
  console.log('\n🎯 Testing get_today_name_days across locales:');
  for (const locale of LOCALES) {
    const result = await testEndpoint(`${SERVER_URL}/api/tools`, {
      method: 'POST',
      body: JSON.stringify({
        tool: 'get_today_name_days',
        args: { random_string: 'test', locale }
      })
    });
    
    logTest(
      `get_today_name_days (${locale.toUpperCase()})`,
      result.success,
      result.success ? result.data.content[0].text : result.error
    );
  }
}

async function runTests() {
  console.log('🧪 Testing Name Days MCP Server - Multi-Language Edition');
  console.log(`🌐 Server URL: ${SERVER_URL}`);
  console.log(`🗺️  Testing ${LOCALES.length} locales: ${LOCALES.join(', ')}`);
  console.log('━'.repeat(70));
  
  // Test 1: Health check
  console.log('1️⃣ Testing health check...');
  const healthResult = await testEndpoint(`${SERVER_URL}/health`);
  logTest(
    'Health check',
    healthResult.success,
    healthResult.success ? `Status: ${healthResult.data.status} | Time: ${healthResult.data.timestamp}` : healthResult.error
  );
  
  // Test 2: List tools
  console.log('\n2️⃣ Testing tools list...');
  const toolsResult = await testEndpoint(`${SERVER_URL}/api/tools`);
  if (toolsResult.success) {
    logTest(
      'Tools list',
      true,
      `Available tools: ${toolsResult.data.tools.length}`
    );
    toolsResult.data.tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
  } else {
    logTest('Tools list', false, toolsResult.error);
  }
  
  // Test 3: Basic functionality (Slovak locale)
  console.log('\n3️⃣ Testing basic functionality (Slovak locale)...');
  
  const findNameResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_name_day',
      args: { name: 'Peter' }
    })
  });
  logTest(
    'find_name_day (Slovak)',
    findNameResult.success,
    findNameResult.success ? findNameResult.data.content[0].text : findNameResult.error
  );
  
  const findDateResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_names_by_date',
      args: { month: 6, day: 29 }
    })
  });
  logTest(
    'find_names_by_date (Slovak)',
    findDateResult.success,
    findDateResult.success ? findDateResult.data.content[0].text : findDateResult.error
  );
  
  const todayResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'get_today_name_days',
      args: { random_string: 'test' }
    })
  });
  logTest(
    'get_today_name_days (Slovak)',
    todayResult.success,
    todayResult.success ? todayResult.data.content[0].text : todayResult.error
  );
  
  // Test 4: Multi-locale testing
  console.log('\n4️⃣ Multi-locale testing...');
  await testMultipleLocales();
  
  // Test 5: Edge cases
  console.log('\n5️⃣ Testing edge cases...');
  
  // Test invalid locale
  const invalidLocaleResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_name_day',
      args: { name: 'Peter', locale: 'invalid' }
    })
  });
  
  // Check if server properly handled invalid locale
  const invalidLocaleHandled = invalidLocaleResult.success && 
    invalidLocaleResult.data.isError === true && 
    invalidLocaleResult.data.content[0].text.includes('Invalid locale');
  
  logTest(
    'Invalid locale handling',
    invalidLocaleHandled,
    invalidLocaleResult.success ? invalidLocaleResult.data.content[0].text : invalidLocaleResult.error
  );
  
  // Test invalid date
  const invalidDateResult = await testEndpoint(`${SERVER_URL}/api/tools`, {
    method: 'POST',
    body: JSON.stringify({
      tool: 'find_names_by_date',
      args: { month: 13, day: 32 }
    })
  });
  
  // Check if server properly handled invalid date
  const invalidDateHandled = invalidDateResult.success && 
    invalidDateResult.data.isError === true && 
    invalidDateResult.data.content[0].text.includes('Invalid month');
  
  logTest(
    'Invalid date handling',
    invalidDateHandled,
    invalidDateResult.success ? invalidDateResult.data.content[0].text : invalidDateResult.error
  );
  
  // Final results
  console.log('\n━'.repeat(70));
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log('━'.repeat(70));
  console.log('✨ Testing complete!');
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch');
  process.exit(1);
}

runTests().catch(console.error); 