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

// a provider is required if you want to interact with the live network,
// i.e. broadcast transactions, fetch gas prices, etc.
const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

const money = await provider.getBalance(accountAddress)
console.log(ethers.formatEther(money))