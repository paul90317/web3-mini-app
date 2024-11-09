
import { useState, useEffect } from 'react';
import { Turnkey, DEFAULT_ETHEREUM_ACCOUNTS } from "@turnkey/sdk-server"
import Wallet from './Wallet'

// Interface for Home component props
interface HomeProps {
  orgId: string;
  publicKey: string;
  privateKey: string;
  onLogout: () => void;
}

function Home({ orgId, publicKey, privateKey, onLogout }: HomeProps) {
  const [walletIdx, setWalletIdx] = useState(-1);
  const [wallets, setWallets] = useState<{
    id: string;
    name: string;
  }[] | undefined>(undefined);
  const [newWalletName, setNewWalletName] = useState('')
  const turnkey = new Turnkey({
    apiBaseUrl: "https://api.turnkey.com",
    apiPrivateKey: privateKey,
    apiPublicKey: publicKey,
    defaultOrganizationId: orgId,
  });
  const apiClient = turnkey.apiClient();
  async function fetchWallets() {
    try {
      const { wallets } = await apiClient.getWallets();
      setWallets(wallets.map(wallet => ({
        id: wallet.walletId,
        name: wallet.walletName,
      })));
    } catch {
      onLogout()
      return
    }
  }
  async function addWallet() {
    await apiClient.createWallet({
      walletName: newWalletName,
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    });
    setNewWalletName('')
    setWallets(undefined)
  }

  useEffect(() => {
    if (wallets === undefined)
      fetchWallets()
  })

  if (wallets === undefined)
    return (
      <div className="home-container">
        <h2>{orgId}</h2>
        <p>Loading...</p>
      </div>
    )

  if (walletIdx < 0 || walletIdx >= wallets.length)
    return (
      <div className="home-container">
        <h2>{orgId}</h2>
        {wallets.map((wallet, idx) => (
          <button onClick={() => setWalletIdx(idx)}>
            {wallet.name} ({wallet.id})
          </button>
        ))}
        <div className="token-row">
          <input
            type="text"
            placeholder="New Wallet Name"
            value={newWalletName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setNewWalletName(e.target.value)}}
          />
          <button onClick={() => { addWallet(); }}>Add</button>
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>
    );

  return (
    <Wallet apiClientArgs={{
      orgId, publicKey, privateKey
    }} id={wallets[walletIdx].id} name={wallets[walletIdx].name} reset={() => {
      setWalletIdx(-1)
    }} />
  );
}

export default Home;