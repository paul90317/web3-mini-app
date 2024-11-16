// src/App.tsx

import React, { useState } from 'react';
import axios from 'axios';
import config from '../config'
import Wallet from './Wallet'
import './App.css';
import TelegramLoginButton from 'react-telegram-login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 檢查是否已經登入
  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 登出處理函數
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('telegramUser');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Web3 Mini App</h1>
      <div className="home-container">
        <TelegramLoginButton
          botName={config.BOT_NAME}
          dataOnauth={async data => {
            let res = await axios.post(`${config.WALLET_URL}/login`, data)
            if (res.status >= 400)
              return alert('Login fail!')
            localStorage.setItem('jwt', res.data.token)
            setIsLoggedIn(true)
          }}
          buttonSize="large"
        />
        {isLoggedIn ? (
          <Wallet reset={handleLogout} />
        ) : (
          <div></div>
        )}
      </div>

    </div>
  );
};

export default App;
