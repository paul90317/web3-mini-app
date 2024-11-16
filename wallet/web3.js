import { Turnkey, DEFAULT_ETHEREUM_ACCOUNTS } from "@turnkey/sdk-server"
import { ethers } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";
import { config } from 'dotenv'
config()

const turnkey = new Turnkey({
    apiBaseUrl: "https://api.turnkey.com",
    apiPrivateKey: process.env.PRIVATE_KEY,
    apiPublicKey: process.env.PUBLIC_KEY,
    defaultOrganizationId: process.env.ORG_ID,
});

const apiClient = turnkey.apiClient();
const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

export async function fetchWallet(walletName) {
    const { wallets } = await apiClient.getWallets();
    const wallet = wallets.find(wallet => wallet.walletName === walletName);
    if (!wallet) {
        const walletResponse = await apiClient.createWallet({
            walletName: walletName,
            accounts: DEFAULT_ETHEREUM_ACCOUNTS,
        });

        const walletId = walletResponse.walletId;
        const addresses = walletResponse.addresses;
        return { walletId, addresses }
    } else {
        const walletId = wallet.walletId
        const { accounts } = await apiClient.getWalletAccounts({
            walletId: walletId,
        });
        let addresses = accounts.map((account) => account.address);
        return { walletId, addresses }
    }
}

// 發送交易
export async function sendTransaction(address, addressTo, token) {
    const turnkeySigner = new TurnkeySigner({
        client: apiClient,
        organizationId: process.env.ORG_ID,
        signWith: address,
    });

    const connectedSigner = turnkeySigner.connect(provider);

    const transactionRequest = {
        to: addressTo,
        value: ethers.parseEther(token),
        type: 2, // EIP-1559 transaction
    };

    const transactionResult = await connectedSigner.sendTransaction(transactionRequest);
    return transactionResult
}

// 獲取餘額
export async function getBalance(address) {
    const bl = await provider.getBalance(address);
    return ethers.formatEther(bl);
}
