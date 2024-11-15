import { config } from 'dotenv'
import express from 'express';
import jwt from 'jsonwebtoken';
import authenticateToken from './auth.js';
import cors from 'cors'
import crypto from 'crypto'
import { fetchWallet, sendTransaction, getBalance } from './web3.js'

config()

const app = express();
app.use(express.json());
app.use(cors())

const SECRET_KEY = process.env.SECRET_KEY

function verifyTelegramData(data) {
    const secretKey = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest();
    const checkString = Object.keys(data)
        .filter((key) => key !== 'hash')
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join('\n');
    const hash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    // Verify the hash matches
    if (hash !== data.hash) {
        return false;
    }

    // Verify the authentication date
    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix seconds
    const maxAllowedTimeDifference = 86400; // 24 hours (adjust as needed)

    if (currentTime - data.auth_date > maxAllowedTimeDifference) {
        return false;
    }

    return true;
}

// login, auto register
app.post('/login', async (req, res) => {
    const telegramData = req.body;
    if (!verifyTelegramData(telegramData)) {
        res.status(401).json({ message: 'Invalid username or password' });
    }
    try {
        let { walletId, addresses } = await fetchWallet(telegramData.id)
        const username = `${telegramData.id}`
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
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
