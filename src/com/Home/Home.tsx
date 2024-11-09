
import { useState, useEffect } from 'react';
import { Turnkey } from "@turnkey/sdk-server"
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

  async function fetchWallets() {
    const turnkey = new Turnkey({
      apiBaseUrl: "https://api.turnkey.com",
      apiPrivateKey: privateKey,
      apiPublicKey: publicKey,
      defaultOrganizationId: orgId,
    });
    try {
      const apiClient = turnkey.apiClient();
      var { wallets } = await apiClient.getWallets();
    } catch {
      onLogout()
      return
    }

    setWallets(wallets.map(wallet => ({
      id: wallet.walletId,
      name: wallet.walletName,
    })));
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
        <button onClick={onLogout}>Logout</button>
      </div>
    );

    return (
      <Wallet apiClientArgs={{
        orgId, publicKey, privateKey
      }} id={wallets[walletIdx].id} name={wallets[walletIdx].name} reset={()=>{
        setWalletIdx(-1)
      }} />
    );
}

export default Home;