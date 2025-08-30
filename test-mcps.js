#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testMCP(name, testCommand) {
    try {
        console.log(`Testing ${name}...`);
        const { stdout, stderr } = await execPromise(`claude mcp test ${name} "${testCommand}" 2>&1`);
        console.log(`✓ ${name} is working`);
        return true;
    } catch (error) {
        console.log(`✗ ${name} failed: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('\n🧪 Testing MCP Connections\n');
    
    const tests = [
        ['supabase', 'list tables'],
        ['stripe', 'list products'],
        ['resend', 'list domains'],
        ['postgres', 'SELECT version()'],
    ];
    
    for (const [mcp, command] of tests) {
        await testMCP(mcp, command);
    }
}

main();
