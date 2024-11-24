'use server'

import { authJWT, decodeJWT } from '@/util/auth'
import { sendTransaction } from '@/util/web3';
import { NextResponse } from 'next/server';

export const POST = authJWT(async (req: Request)=> {
    const { addresses } = decodeJWT(req);
    const { address, token, addressTo } = await req.json();
    if (!addresses.includes(address)) {
        return NextResponse.json({ message: 'Invalid address' }, { status: 403 });
    }
    try {
        var result = await sendTransaction(address, addressTo, token)
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Invalid address' }, { status: 403 });
    }
    return NextResponse.json(result)
})