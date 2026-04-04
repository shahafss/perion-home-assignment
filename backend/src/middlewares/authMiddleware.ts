import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedUser } from '../types/express';

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ message: 'Authorization token is required' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'JWT configuration is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    if (typeof decoded === 'string' || !decoded.sub || !decoded.email) {
      res.status(401).json({ message: 'Invalid authorization token' });
      return;
    }

    const user: AuthenticatedUser = {
      id: String(decoded.sub),
      email: String(decoded.email)
    };

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired authorization token' });
  }
};
