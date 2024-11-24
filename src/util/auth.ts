import jwt from 'jsonwebtoken';
import { config } from 'dotenv'
import { NextResponse } from 'next/server';
config()

const SECRET_KEY = process.env.SECRET_KEY!;

export function authJWT(next: (req: Request) => Promise<NextResponse>) {
  return (req: Request) => {
    let jwtoken = req.headers.get('Authorization')
    if (!jwtoken) {
      return NextResponse.json({ message: 'Token missing' }, { status: 401 });
    }

    const token = jwtoken.split(' ')[1];
    try {
      jwt.verify(token, SECRET_KEY);
      return next(req)
    } catch (err) {
      NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 })
    }
  }
};

export function decodeJWT(req: Request) {
  let payload = jwt.decode(req.headers.get('Authorization')!.split(' ')[1])
  if (payload && typeof payload === 'object')
    return payload;
  return {};
}