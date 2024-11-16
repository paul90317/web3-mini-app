// src/App.tsx

import React, { useState } from 'react';
import axios from 'axios';
import config from '../config'
import Wallet from './Wallet'
import './App.css';
import TelegramLoginButton from 'react-telegram-login';
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  username: string;
  nickname: string;
  walletId: string;
  addresses: string[];  // Adjust the type depending on the structure of your token
}

const App: React.FC = () => {
  const [jwt, setJWT] = useState('');

  // 檢查是否已經登入
  async function fetchJWT(data) {
    if (data) {
      let res = await axios.post('/api/login', data)
      if (res.status >= 400)
        return
      setJWT(res.data.token)
    }
  }
  React.useEffect(() => {
    if (!jwt && window.Telegram && window.Telegram.WebApp) {
      const userData = window.Telegram.WebApp.initData;
      fetchJWT({ initData: userData })
    }
  }, []);

  return (
    <div className="App">
      <h1>Web3 Mini App</h1>
      <div className="home-container">
        {jwt ? (
          <div>
            <p>Hello, {jwtDecode<UserToken>(jwt).nickname}</p>
            <Wallet jwt={jwt} />
          </div>
        ) : (
          <TelegramLoginButton
            botName={config.BOT_NAME}
            dataOnauth={fetchJWT}
            buttonSize="large"
          />
        )}
      </div>

    </div>
  );
};

export default App;
