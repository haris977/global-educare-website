import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define possible role types
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'STUDY_MATERIAL_ADMIN' | 'DOUBTS_SOLVING_ADMIN' | 'KEY_ACCOUNT_ADMIN' | 'TECHNICAL_ADMIN';

interface DecodedToken {
  id: string;
  role: Role;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (roles: ReadonlyArray<Role> | Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};