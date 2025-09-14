require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const TATUM_BASE_URL = 'https://api.tatum.io/v3';

// Get balance
app.get('/balance/:chain/:address', async (req, res) => {
  const { chain, address } = req.params;
  const apiKey = process.env.TATUM_API_KEY_TESTNET; // Use testnet for now
  try {
    const response = await axios.get(`${TATUM_BASE_URL}/blockchain/token/balance/${chain}/${address}`, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer
app.post('/transfer', async (req, res) => {
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

// NFT metadata
app.get('/nft/:chain/:contract/:id/metadata', async (req, res) => {
  const { chain, contract, id } = req.params;
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.get(`${TATUM_BASE_URL}/nft/metadata/${chain}/${contract}/${id}`, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate wallet
app.get('/generate-wallet/:chain', async (req, res) => {
  const { chain } = req.params;
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.post(`${TATUM_BASE_URL}/${chain}/wallet`, {}, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    console.log('Error in generate-wallet:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate and deploy meme project
app.post('/generate-and-deploy', async (req, res) => {
  const memeName = `MemeCoin${Math.random().toString(36).substring(7)}`;
  const symbol = memeName.substring(0, 3).toUpperCase();
  const supply = '1000000000';
  const chains = ['ethereum', 'polygon', 'bsc', 'solana'];
  const deployments = [];

  for (const chain of chains) {
    try {
      // Generate wallet
      const walletRes = await axios.post(`${TATUM_BASE_URL}/${chain}/wallet`, {}, {
        headers: { 'x-api-key': process.env.TATUM_API_KEY_TESTNET }
      });
      const { mnemonic } = walletRes.data;

      // Derive private key
      const privRes = await axios.post(`${TATUM_BASE_URL}/${chain}/wallet/priv`, {
        mnemonic,
        index: 0
      }, {
        headers: { 'x-api-key': process.env.TATUM_API_KEY_TESTNET }
      });
      const privateKey = privRes.data.key;

      // Deploy token
      const deployRes = await axios.post(`${TATUM_BASE_URL}/blockchain/sc/deploy`, {
        contractType: "erc20",
        chain,
        name: memeName,
        symbol,
        totalSupply: supply,
        digits: 18,
        fromPrivateKey: privateKey,
        testnet: true
      }, {
        headers: { 'x-api-key': process.env.TATUM_API_KEY_TESTNET }
      });

      deployments.push({
        chain,
        contractAddress: deployRes.data.contractAddress,
        txId: deployRes.data.txId
      });
    } catch (error) {
      console.log(`Failed on ${chain}:`, error.response ? error.response.data : error.message);
      deployments.push({
        chain,
        error: error.message
      });
    }
  }

  res.json({
    name: memeName,
    symbol,
    supply,
    deployments
  });
});

// Derive private key
app.post('/derive-private-key', async (req, res) => {
  const { chain, mnemonic, index = 0 } = req.body;
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.post(`${TATUM_BASE_URL}/${chain}/wallet/priv`, {
      mnemonic,
      index
    }, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deploy token
app.post('/deploy-token', async (req, res) => {
  const { chain, name, symbol, supply, privateKey } = req.body;
  const apiKey = process.env.TATUM_API_KEY_TESTNET;
  try {
    const response = await axios.post(`${TATUM_BASE_URL}/blockchain/sc/deploy`, {
      contractType: "erc20",
      chain,
      name,
      symbol,
      totalSupply: supply,
      digits: 18,
      fromPrivateKey: privateKey,
      testnet: true
    }, {
      headers: { 'x-api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});