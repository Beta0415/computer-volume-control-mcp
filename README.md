# Computer Volume Control MCP Server

A Model Context Protocol (MCP) server that provides cross-platform computer volume control capabilities for AI assistants. Available as an npm package for easy installation and use.

## Features

- **Cross-platform support**: Works on Windows and macOS
- **Volume control**: Get, set, increase, and decrease system volume
- **Mute control**: Mute and unmute system audio

- **MCP integration**: Exposes audio control as tools for AI assistants

## Installation

### Install the npm package:
```bash
npm install computer-volume-control-mcp
```

### Or install locally for development:
```bash
git clone <repository-url>
cd computer-volume-control-mcp
npm install
```

## Usage

### Run the standalone audio control module:
```bash
npm start
```

### Run the MCP server:
```bash
npm run mcp
```

## Available Functions

### Core Audio Control Functions (`index.js`):
- `getCurrentVolume()` - Get current system volume (0-100%)
- `setVolume(volume)` - Set system volume to specific percentage
- `getMuteStatus()` - Check if system is muted
- `mute()` - Mute the system
- `unmute()` - Unmute the system
- `increaseVolume()` - Increase volume by 10%
- `decreaseVolume()` - Decrease volume by 10%

### MCP Tools (`mcp-server.js`):
- `get_current_volume` - Get current system volume
- `set_volume` - Set volume to specific percentage (0-100)
- `get_mute_status` - Check if system is muted
- `mute_system` - Mute the system
- `unmute_system` - Unmute the system
- `increase_volume` - Increase volume by 10%
- `decrease_volume` - Decrease volume by 10%

## MCP Configuration

Use the provided `mcp-config.json` to connect this server to MCP-compatible AI assistants:

```json
{
  "mcpServers": {
    "computer-audio-control": {
      "command": "npx",
      "args": ["computer-volume-control-mcp"],
      "env": {}
    }
  }
}
```

## Dependencies

- `loudness` - Cross-platform audio control library

## Project Structure

```
computer-volume-control-mcp/
├── index.js           # Core audio control functions
├── mcp-server.js      # MCP server implementation (executable)
├── mcp-config.json    # MCP configuration
├── package.json       # Project configuration
└── README.md         # This file
```

## Example Usage

### As a Node.js module:
```javascript
const { getCurrentVolume, setVolume, mute } = require('./index.js');

// Get current volume
const volume = await getCurrentVolume();
console.log(`Current volume: ${volume}%`);

// Set volume to 50%
await setVolume(50);

// Mute the system
await mute();
```

### As MCP tools (for AI assistants):
- "What's the current volume?"
- "Set volume to 75%"
- "Mute the system"
- "Increase volume by 10%"
- "Unmute the system"


## License

ISC 