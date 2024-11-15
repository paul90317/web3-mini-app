import { Turnkey, DEFAULT_ETHEREUM_ACCOUNTS  } from "@turnkey/sdk-server";
import dotenv from 'dotenv';
dotenv.config();

const turnkey = new Turnkey({
  apiBaseUrl: "https://api.turnkey.com",
  apiPrivateKey: process.env.PRIVATE_KEY,
  apiPublicKey: process.env.PUBLIC_KEY,
  defaultOrganizationId: process.env.ORG_ID,
});

const apiClient = turnkey.apiClient();

const res = await apiClient.getWalletAccounts({
  walletId: process.env.WALLET_ID,
})

const accountAddress = res.accounts[0].address

import { ethers } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";

const turnkeySigner = new TurnkeySigner({
  client: apiClient,
  organizationId: process.env.ORG_ID,
  signWith: accountAddress
})

// a provider is required if you want to interact with the live network,
// i.e. broadcast transactions, fetch gas prices, etc.
const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const connectedSigner = turnkeySigner.connect(provider);

const transactionRequest = {
  to: process.env.TO_ADDRESS,
  value: ethers.parseEther('0.001'),
  type: 2
}

const transactionResult = await connectedSigner.sendTransaction(transactionRequest);

console.log(transactionResult)