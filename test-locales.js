#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api/tools';

// Test cases for different locales
const testCases = [
  {
    name: '🇸🇰 Slovak Tests',
    tests: [
      { tool: 'find_name_day', args: { name: 'Peter', locale: 'sk' }, expected: 'má meniny 29. jún' },
      { tool: 'find_name_day', args: { name: 'Mária', locale: 'sk' }, expected: 'má meniny' },
      { tool: 'find_names_by_date', args: { month: 6, day: 29, locale: 'sk' }, expected: 'Peter, Pavol' },
      { tool: 'find_names_by_date', args: { month: 3, day: 15, locale: 'sk' }, expected: 'Svetlana' },
      { tool: 'get_today_name_days', args: { random_string: 'test', locale: 'sk' }, expected: 'Dnes' },
    ]
  },
  {
    name: '🇨🇿 Czech Tests',
    tests: [
      { tool: 'find_name_day', args: { name: 'Petr', locale: 'cz' }, expected: 'má meniny 22. február' },
      { tool: 'find_name_day', args: { name: 'Pavel', locale: 'cz' }, expected: 'má meniny' },
      { tool: 'find_names_by_date', args: { month: 6, day: 29, locale: 'cz' }, expected: 'Petr, Pavel' },
      { tool: 'find_names_by_date', args: { month: 2, day: 22, locale: 'cz' }, expected: 'Petr' },
      { tool: 'get_today_name_days', args: { random_string: 'test', locale: 'cz' }, expected: 'Dnes' },
    ]
  },
  {
    name: '🇭🇺 Hungarian Tests',
    tests: [
      { tool: 'find_name_day', args: { name: 'Péter', locale: 'hu' }, expected: 'má meniny 21. február' },
      { tool: 'find_name_day', args: { name: 'Pál', locale: 'hu' }, expected: 'má meniny' },
      { tool: 'find_names_by_date', args: { month: 2, day: 21, locale: 'hu' }, expected: 'Péter' },
      { tool: 'find_names_by_date', args: { month: 6, day: 29, locale: 'hu' }, expected: 'Péter, Pál' },
      { tool: 'get_today_name_days', args: { random_string: 'test', locale: 'hu' }, expected: 'Dnes' },
    ]
  },
  {
    name: '🇧🇬 Bulgarian Tests',
    tests: [
      { tool: 'find_name_day', args: { name: 'Петър', locale: 'bg' }, expected: 'má meniny' },
      { tool: 'find_names_by_date', args: { month: 6, day: 29, locale: 'bg' }, expected: 'Петър, Павел' },
      { tool: 'find_names_by_date', args: { month: 1, day: 1, locale: 'bg' }, expected: 'Василий' },
      { tool: 'get_today_name_days', args: { random_string: 'test', locale: 'bg' }, expected: 'Dnes' },
    ]
  }
];

async function callAPI(tool, args) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tool, args })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing MCP Server with Multiple Calendars');
  console.log('━'.repeat(60));

  let totalTests = 0;
  let passedTests = 0;

  for (const category of testCases) {
    console.log(`\n${category.name}`);
    console.log('─'.repeat(40));

    for (const test of category.tests) {
      totalTests++;
      const result = await callAPI(test.tool, test.args);
      
      if (result.error) {
        console.log(`❌ ${test.tool}(${JSON.stringify(test.args)}): ERROR`);
        console.log(`   🔍 ${result.error}`);
      } else if (result.content && result.content[0] && result.content[0].text) {
        const response = result.content[0].text;
        const passed = response.includes(test.expected);
        
        if (passed) {
          console.log(`✅ ${test.tool}: PASSED`);
          console.log(`   📝 ${response}`);
          passedTests++;
        } else {
          console.log(`❌ ${test.tool}: FAILED`);
          console.log(`   📝 Got: ${response}`);
          console.log(`   🎯 Expected to contain: ${test.expected}`);
        }
      } else {
        console.log(`⚠️  ${test.tool}: UNKNOWN RESPONSE`);
        console.log(`   📝 ${JSON.stringify(result)}`);
      }
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! MCP server supports multiple calendars correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the server implementation.');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  process.exit(1);
}

runTests().catch(console.error); 