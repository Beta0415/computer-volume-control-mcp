#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const readline = require('readline');

const execAsync = promisify(exec);

// Import Audio Control Functions
const { 
    getCurrentVolume, 
    setVolume, 
    getMuteStatus, 
    mute, 
    unmute, 
    increaseVolume, 
    decreaseVolume 
} = require('./index.js');

// Create Readline Interface for Stdin/Stdout Communication
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Handle Incoming Messages
rl.on('line', async (line) => {
    try {
        const message = JSON.parse(line);
        
        if (message.method === 'initialize') {
            const response = {
                jsonrpc: '2.0',
                id: message.id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        tools: {}
                    },
                    serverInfo: {
                        name: 'computer-volume-control-mcp',
                        version: '1.0.0'
                    }
                }
            };
            console.log(JSON.stringify(response));
        }
        else if (message.method === 'tools/list') {
            const response = {
                jsonrpc: '2.0',
                id: message.id,
                result: {
                    tools: [
                        {
                            name: 'get_current_volume',
                            description: 'Get the current computer system volume level as a percentage between 0 and 100',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        },
                        {
                            name: 'set_volume',
                            description: 'Set the computer system volume level to a specific percentage between 0 and 100',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    volume: {
                                        type: 'number',
                                        description: 'Volume level as a percentage (0-100)',
                                        minimum: 0,
                                        maximum: 100
                                    }
                                },
                                required: ['volume']
                            }
                        },
                        {
                            name: 'get_mute_status',
                            description: 'Check if the computer system is currently muted',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        },
                        {
                            name: 'mute_system',
                            description: 'Mute the computer system audio',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        },
                        {
                            name: 'unmute_system',
                            description: 'Unmute the computer system audio',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        },
                        {
                            name: 'increase_volume',
                            description: 'Increase the computer system volume level by 10%',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        },
                        {
                            name: 'decrease_volume',
                            description: 'Decrease the computer system volume level by 10%',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                                required: []
                            }
                        }
                    ]
                }
            };
            console.log(JSON.stringify(response));
        }
        else if (message.method === 'tools/call') {
            const { name, arguments: args } = message.params;
            let result;
            let structuredData = {};
            let isError = false;
            
            try {
                switch (name) {
                    case 'get_current_volume':
                        const volume = await getCurrentVolume();
                        result = `Current system volume is ${volume}%`;
                        structuredData = { volume: volume, unit: 'percentage' };
                        break;
                        
                    case 'set_volume':
                        const { volume: newVolume } = args;
                        if (typeof newVolume !== 'number' || newVolume < 0 || newVolume > 100) {
                            throw new Error('Volume must be a number between 0 and 100');
                        }
                        await setVolume(newVolume);
                        result = `Volume set to ${newVolume}%`;
                        structuredData = { volume: newVolume, unit: 'percentage', action: 'set' };
                        break;
                        
                    case 'get_mute_status':
                        const isMuted = await getMuteStatus();
                        result = `System is ${isMuted ? 'muted' : 'not muted'}`;
                        structuredData = { muted: isMuted };
                        break;
                        
                    case 'mute_system':
                        await mute();
                        result = 'System has been muted';
                        structuredData = { muted: true, action: 'mute' };
                        break;
                        
                    case 'unmute_system':
                        await unmute();
                        result = 'System has been unmuted';
                        structuredData = { muted: false, action: 'unmute' };
                        break;
                        
                    case 'increase_volume':
                        const currentVol = await getCurrentVolume();
                        await increaseVolume();
                        const newVol = await getCurrentVolume();
                        result = `Volume increased from ${currentVol}% to ${newVol}%`;
                        structuredData = { 
                            previousVolume: currentVol, 
                            newVolume: newVol, 
                            change: newVol - currentVol,
                            action: 'increase',
                            unit: 'percentage'
                        };
                        break;
                        
                    case 'decrease_volume':
                        const currentVol2 = await getCurrentVolume();
                        await decreaseVolume();
                        const newVol2 = await getCurrentVolume();
                        result = `Volume decreased from ${currentVol2}% to ${newVol2}%`;
                        structuredData = { 
                            previousVolume: currentVol2, 
                            newVolume: newVol2, 
                            change: newVol2 - currentVol2,
                            action: 'decrease',
                            unit: 'percentage'
                        };
                        break;
                        
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
                
                const response = {
                    jsonrpc: '2.0',
                    id: message.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: result
                            }
                        ],
                        structuredContent: structuredData,
                        isError: isError
                    }
                };
                console.log(JSON.stringify(response));
                
            } catch (error) {
                const errorResponse = {
                    jsonrpc: '2.0',
                    id: message.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: `Error: ${error.message}`
                            }
                        ],
                        structuredContent: { error: error.message, errorCode: -32603 },
                        isError: true
                    }
                };
                console.log(JSON.stringify(errorResponse));
            }
        }
        else {
            // Handle Other Methods
            const response = {
                jsonrpc: '2.0',
                id: message.id,
                result: {}
            };
            console.log(JSON.stringify(response));
        }
        
    } catch (error) {
        // Log Errors to stderr to avoid Interfering with MCP protocol
        process.stderr.write(`Error processing message: ${error.message}\n`);
    }
});

// MCP Server Started - Ready to Receive Messages 