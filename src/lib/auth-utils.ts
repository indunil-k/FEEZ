import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function getUserIdFromToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userID?: string };
    return decoded.userID || null;
  } catch {
    return null;
  }
}
