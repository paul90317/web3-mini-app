import { config } from 'dotenv'
config()
import express from 'express';
import jwt from 'jsonwebtoken';
import authenticateToken from './auth.js';
import cors from 'cors'
import { fetchWallet, sendTransaction, getBalance } from './web3.js'

const app = express();

app.use(express.json());
app.use(cors())
const SECRET_KEY = process.env.SECRET_KEY;

// login, auto register
app.post('/login', async (req, res) => {
    const { username } = req.body;
    try {
        let { walletId, addresses } = await fetchWallet(username)
        const payload = { username, walletId, addresses };
        const token = jwt.sign(payload, SECRET_KEY);
        res.json({ token });
    } catch (e) {
        console.log(e)
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.post('/balance', async (req, res) => {
    const { address } = req.body;
    try {
        let balance = await getBalance(address)
        res.json({ balance });
    } catch (e) {
        res.status(404).json({ error: "Can't connect to RPC provider" });
    }
});

app.post('/transaction', authenticateToken, async (req, res) => {
    const { addresses } = req.user;
    const { address, token, addressTo } = req.body;
    if (!addresses.includes(address)) {
        return res.status(403).json({ message: 'Invalid address' });
    }
    try {
        const result = await sendTransaction(address, addressTo, token)
        res.json(result)
    } catch (e) {
        console.log(e)
        res.status(403).json({ message: 'Invalid address' });
    }
});

// 啟動伺服器
const port = 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
