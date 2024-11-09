import React, { useState } from 'react';

// Interface for Login component props
interface LoginProps {
    onLogin: (orgId: string, publicKey: string, privateKey: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [orgId, setOrgId] = useState<string | undefined>(undefined);
    const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
    const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (orgId && publicKey && privateKey) {
            onLogin(orgId, publicKey, privateKey);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Organization ID"
                    value={orgId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Public Key"
                    value={publicKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPublicKey(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Private Key"
                    value={privateKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;