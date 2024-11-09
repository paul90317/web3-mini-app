import { useState, useEffect } from 'react';
import { Turnkey } from "@turnkey/sdk-server"
import { ethers } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";
import config from '../../config'

// Interface for Home component props
interface WalletProps {
  apiClientArgs: {
    orgId: string;
    publicKey: string;
    privateKey: string;
  };
  id: string;
  name: string
  reset: () => void;
}

function Wallet({ apiClientArgs, id, name, reset }: WalletProps) {
  const [addresses, setAddresses] = useState<string[] | undefined>(undefined);
  const [address, setAddress] = useState('select address');
  const [addressTo, setAddressTo] = useState('');
  const [token, setToken] = useState('');
  const [balance, setBalance] = useState('');
  const turnkey = new Turnkey({
    apiBaseUrl: "https://api.turnkey.com",
    apiPrivateKey: apiClientArgs.privateKey,
    apiPublicKey: apiClientArgs.publicKey,
    defaultOrganizationId: apiClientArgs.orgId,
  });
  const apiClient = turnkey.apiClient()
  const provider = new ethers.JsonRpcProvider(config.RPC_PROVIDER_URL);

  async function fetchAddresses() {
    try {
      var { accounts } = await apiClient.getWalletAccounts({
        walletId: id,
      })
    } catch {
      reset()
      return
    }

    setAddresses(accounts.map(account => account.address))
  }

  async function sendTransaction() {
    const turnkeySigner = new TurnkeySigner({
      client: apiClient,
      organizationId: apiClientArgs.orgId,
      signWith: address
    })

    const connectedSigner = turnkeySigner.connect(provider);

    const transactionRequest = {
      to: addressTo,
      value: ethers.parseEther(token),
      type: 2
    }
    const transactionResult = await connectedSigner.sendTransaction(transactionRequest);
    alert(transactionResult)
  }

  async function getBalance() {
    try {
      const bl = await provider.getBalance(address)
      setBalance(ethers.formatEther(bl))
    } catch {
      setBalance('')
    }
  }

  useEffect(() => {
    if (addresses === undefined)
      fetchAddresses()
  })

  if (addresses === undefined)
    return (
      <div className="home-container">
        <h2>{name} (id)</h2>
        <p>Loading...</p>
      </div>
    )

  return (
    <div className="home-container">
      <h2>{name} ({id})</h2>
      <div className="address-row">
        <select value={address} onChange={event => {
          setAddress(event.target.value)
        }}>
          <option key='select address' value='select address'>
            select address
          </option>
          {addresses.map(address => (
            <option key={address} value={address}>
              {address.substring(0, 30)}
            </option>
          ))}
        </select>
        <button onClick={() => {
          navigator.clipboard.writeText(address);
        }}>Copy</button>
      </div>

      <div className="balance-row">
        <span>{balance.substring(0, 8)}</span>
        <button onClick={() => {
          console.log(address)
          getBalance()
        }}>Update</button>
      </div>

      <input
        type="text"
        placeholder="To Address"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressTo(e.target.value)}
      />
      <div className="token-row">
        <input
          type="text"
          placeholder="Token"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
        />
        <button onClick={() => { sendTransaction(); }}>Send</button>
      </div>

      <button onClick={reset}>select another wallet</button>
    </div>
  )

}

export default Wallet;