// src/App.tsx

import React, { useState } from 'react';
import axios from 'axios';
import config from '../config'
import Wallet from './Home/Wallet'
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 檢查是否已經登入
  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 處理用戶名輸入變更
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // 登入處理函數
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${config.WALLET_URL}/login`, { username });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('jwt', token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  // 登出處理函數
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Login Page</h1>

      {isLoggedIn ? (
        <Wallet reset={handleLogout}/>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;
