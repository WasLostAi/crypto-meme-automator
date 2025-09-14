require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const TATUM_BASE_URL = 'https://api.tatum.io/v3';

// Generate wallet
app.get('/mcp/wallet/generate', async (req, res) => {
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.post(`${TATUM_BASE_URL}/bitcoin/wallet`, {}, {
      headers: { 'x-api-key': apiKey }
    }); // Example for Bitcoin, adjust for chain
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer
app.post('/mcp/transfer', async (req, res) => {
  const { chain, fromPrivateKey, to, amount } = req.body;
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.post(`${TATUM_BASE_URL}/blockchain/token/transaction`, {
      chain,
      fromPrivateKey,
      to,
      amount
    }, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});