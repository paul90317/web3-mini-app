'use server'

import { fetchWallet } from '@/util/web3';
import { verifyTelegramInitData, verifyOAuthData } from '@/util/tgauth';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY!

export async function POST(req: Request) {
    const telegramData = await req.json();
    try {
        const [username, nickname] = 'initData' in telegramData ? verifyTelegramInitData(telegramData.initData) : verifyOAuthData(telegramData)
        let { walletId, addresses } = await fetchWallet(username)
        const payload = { username, nickname, walletId, addresses };
        const token = jwt.sign(payload, SECRET_KEY);
        return NextResponse.json({ token });
    } catch (e) {
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
}
