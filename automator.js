const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const CHAINS = ['ethereum', 'polygon', 'bsc', 'solana']; // Tatum chain names

async function generateMemeProject() {
  const memeName = `MemeCoin${Math.random().toString(36).substring(7)}`;
  const symbol = memeName.substring(0, 3).toUpperCase();
  const supply = '1000000000'; // 1 billion

  console.log(`Generating project: ${memeName} (${symbol})`);

  const deployments = [];

  for (const chain of CHAINS) {
    try {
      // Generate wallet
      const walletRes = await axios.get(`${BASE_URL}/generate-wallet/${chain}`);
      const { mnemonic } = walletRes.data;

      // Derive private key
      const privRes = await axios.post(`${BASE_URL}/derive-private-key`, {
        chain,
        mnemonic,
        index: 0
      });
      const privateKey = privRes.data.key;

      // Deploy token
      const deployRes = await axios.post(`${BASE_URL}/deploy-token`, {
        chain,
        name: memeName,
        symbol,
        supply,
        privateKey
      });

      deployments.push({
        chain,
        contractAddress: deployRes.data.contractAddress,
        txId: deployRes.data.txId
      });

      console.log(`Deployed on ${chain}: ${deployRes.data.contractAddress}`);
    } catch (error) {
      console.error(`Failed on ${chain}: ${error.message}`);
    }
  }

  return {
    name: memeName,
    symbol,
    supply,
    deployments
  };
}

// Run
generateMemeProject().then(project => {
  console.log('Project created:', project);
}).catch(console.error);