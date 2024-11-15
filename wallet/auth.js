// auth.js
import jwt from 'jsonwebtoken';
import { config } from 'dotenv'
config()

// 環境變數中的密鑰
const SECRET_KEY = process.env.SECRET_KEY;

// JWT 驗證中間件
export default function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1]; // 提取 Bearer <token>
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // 驗證 JWT
    req.user = decoded; // 將解碼的用戶資訊存入 req
    next(); // 驗證通過，繼續處理請求
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
