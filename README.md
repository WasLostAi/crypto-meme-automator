# Crypto Meme Automator

An automated system for creating and deploying crypto meme tokens across multiple blockchain networks using Tatum API.

## Features

- Generate meme token projects with random names and symbols
- Deploy ERC-20 tokens on Ethereum, Polygon, and BSC
- Multi-chain deployment automation
- REST API for balance checks, transfers, and NFT metadata
- MCP server for extended functionality

## Setup

1. Clone this repo
2. Install dependencies: `npm install`
3. Set environment variables in `.env`:
   ```
   TATUM_API_KEY_TESTNET=your_testnet_key
   TATUM_API_KEY_MAINNET=your_mainnet_key
   ```
4. Start MCP server: `npm run mcp`
5. Start main server: `npm run dev`
6. Run demo: `node demo.js`

## API Endpoints

- `GET /balance/:chain/:address` - Get token balance
- `POST /transfer` - Send tokens
- `GET /nft/:chain/:contract/:id/metadata` - Get NFT metadata
- `GET /generate-wallet/:chain` - Generate new wallet
- `POST /deploy-token` - Deploy ERC-20 token

## Automation

The `automator.js` script generates a new meme project and deploys it to multiple chains automatically.

## Supported Chains

- Ethereum
- Polygon
- BSC
- (Add more as needed)

## License

MIT