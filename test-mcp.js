#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test cases for different locales
const testCases = [
  // Slovak tests
  { name: 'find_name_day', args: { name: 'Peter', locale: 'sk' }, desc: 'Slovak: Peter' },
  { name: 'find_name_day', args: { name: 'Mária', locale: 'sk' }, desc: 'Slovak: Mária' },
  { name: 'find_names_by_date', args: { month: 6, day: 29, locale: 'sk' }, desc: 'Slovak: 29. jún' },
  
  // Czech tests
  { name: 'find_name_day', args: { name: 'Petr', locale: 'cz' }, desc: 'Czech: Petr' },
  { name: 'find_names_by_date', args: { month: 6, day: 29, locale: 'cz' }, desc: 'Czech: 29. červen' },
  
  // Hungarian tests
  { name: 'find_name_day', args: { name: 'Péter', locale: 'hu' }, desc: 'Hungarian: Péter' },
  { name: 'find_names_by_date', args: { month: 6, day: 29, locale: 'hu' }, desc: 'Hungarian: 29. június' },
  
  // Bulgarian tests
  { name: 'find_name_day', args: { name: 'Петър', locale: 'bg' }, desc: 'Bulgarian: Петър' },
  { name: 'find_names_by_date', args: { month: 6, day: 29, locale: 'bg' }, desc: 'Bulgarian: 29. юни' },
  
  // Today's name days
  { name: 'get_today_name_days', args: { random_string: 'test', locale: 'sk' }, desc: 'Today Slovak' },
  { name: 'get_today_name_days', args: { random_string: 'test', locale: 'cz' }, desc: 'Today Czech' },
  { name: 'get_today_name_days', args: { random_string: 'test', locale: 'hu' }, desc: 'Today Hungarian' },
  { name: 'get_today_name_days', args: { random_string: 'test', locale: 'bg' }, desc: 'Today Bulgarian' },
];

console.log('🧪 Testing MCP Server with Multiple Calendars');
console.log('━'.repeat(60));

let passedTests = 0;
let totalTests = testCases.length;

function runTest(testCase) {
  return new Promise((resolve) => {
    const message = JSON.stringify({
      method: 'tools/call',
      params: {
        name: testCase.name,
        arguments: testCase.args
      }
    });

    const child = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (output.includes('content') && output.includes('text')) {
        console.log(`✅ ${testCase.desc}: PASSED`);
        try {
          const lines = output.split('\n');
          for (const line of lines) {
            if (line.includes('content') && line.includes('text')) {
              const result = JSON.parse(line);
              if (result.content && result.content[0] && result.content[0].text) {
                console.log(`   📝 ${result.content[0].text}`);
              }
              break;
            }
          }
        } catch (e) {
          console.log(`   📝 Response received but couldn't parse details`);
        }
        passedTests++;
      } else if (errorOutput.includes('Error')) {
        console.log(`❌ ${testCase.desc}: FAILED`);
        console.log(`   🔍 Error: ${errorOutput.split('\n')[0]}`);
      } else {
        console.log(`⚠️  ${testCase.desc}: UNKNOWN`);
        console.log(`   🔍 Output: ${output.substring(0, 100)}...`);
      }
      resolve();
    });

    // Send the message to stdin
    child.stdin.write(message + '\n');
    child.stdin.end();
  });
}

async function runAllTests() {
  for (const testCase of testCases) {
    await runTest(testCase);
  }
  
  console.log('━'.repeat(60));
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! MCP server supports multiple calendars correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the server implementation.');
  }
}

runAllTests().catch(console.error); 