'use client'

import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'next/navigation';

interface UserToken {
    username: string;
    nickname: string;
    walletId: string;
    addresses: string[];  // Adjust the type depending on the structure of your token
}

export default function Wallet() {
    const searchParms = useSearchParams();

    const [address, setAddress] = useState('select address');
    const [addressTo, setAddressTo] = useState('');
    const [token, setToken] = useState('');
    const [balance, setBalance] = useState('');

    const jwt = searchParms.get('jwt') ?? '';
    const decodedJwt = jwtDecode<UserToken>(jwt);
    const addresses = decodedJwt.addresses

    async function sendTransaction() {
        try {
            const response = await axios.post(
                '/api/transaction',
                { address, addressTo, token },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            if (response.status < 400) {
                console.log(response)
                alert("The transaction is sent successfully!")
            } else {
                console.log(response)
                alert("The transaction fails!")
            }
        } catch (e) {
            console.log(e)
            alert(e)
            return
        }
    }

    async function getBalance() {
        try {
            const response = await axios.post(
                '/api/balance',
                { address, }
            );
            if (response.data.balance) {
                setBalance(response.data.balance)
            } else {
                setBalance(response.data.error)
            }
        } catch {
            setBalance('')
        }
    }

    return (
        <div>
            <h1>Web3 Mini App</h1>
            <div className="home-container">
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
                        getBalance()
                    }}>Update</button>
                </div>

                <input
                    type="text"
                    placeholder="To Address"
                    value={addressTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressTo(e.target.value)}
                />
                <div className="token-row">
                    <input
                        type="text"
                        placeholder="Token"
                        value={token}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                    />
                    <button onClick={() => { sendTransaction(); }}>Send</button>
                </div>
            </div>
        </div>
    )
}
