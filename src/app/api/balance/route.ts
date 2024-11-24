'use server'

import { NextResponse } from 'next/server';
import { getBalance } from '@/util/web3'

export async function POST(req: Request) {
    const { address } = await req.json();
    try {
        let balance = await getBalance(address)
        return NextResponse.json({ balance });
    } catch (e) {
        return NextResponse.json({ message: "Can't connect to RPC provider" }, { status: 404 });
    }
};
