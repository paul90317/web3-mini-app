import { useState } from 'react';
import './App.css';
import Home from './Home/Home'
import Login from './Login'

function App() {
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);

  const handleLogin = (orgId: string, publicKey: string, privateKey: string) => {
    setOrgId(orgId);
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  };

  const handleLogout = () => {
    setOrgId(undefined);
    setPublicKey(undefined);
    setPrivateKey(undefined);
  };

  return (
    <div className="app">
      {orgId && publicKey && privateKey ? (
        <Home orgId={orgId} publicKey={publicKey} privateKey={privateKey} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;