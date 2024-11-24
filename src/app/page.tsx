'use client'

import axios from 'axios';
import { useState, useEffect } from 'react';
import TelegramLoginButton from 'react-telegram-login';
import { useRouter } from 'next/navigation'

export default function App() {
  const router = useRouter()
  const [jwt, setJWT] = useState('');

  async function fetchJWT(data) {
    if (data) {
      let res = await axios.post('/api/login', data)
      if (res.status >= 400)
        return
      setJWT(res.data.token)
    }
  }

  useEffect(() => {
    if (!jwt && window.Telegram && window.Telegram.WebApp) {
      const userData = window.Telegram.WebApp.initData;
      fetchJWT({ initData: userData })
    }
  }, []);

  if (jwt) {
    const queryParams = new URLSearchParams({
      jwt: jwt,
    }).toString();
    router.push(`/wallet?${queryParams}`)
  }

  return (
    <div className="App">
      <h1>Web3 Mini App</h1>
      <div className="home-container">
        <TelegramLoginButton
          botName='web3mini9bot'
          dataOnauth={fetchJWT}
          buttonSize="large"
        />
      </div>
    </div>
  );
}
