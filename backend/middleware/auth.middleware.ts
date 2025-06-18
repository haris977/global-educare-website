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

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('Authentication required');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  // Special handling for test development token
  if (token === 'test-token-for-development') {
    (req as AuthenticatedRequest).user = {
      id: 'test-admin-id',
      email: 'admin@example.com',
      role: 'ADMIN'
    };
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as DecodedToken;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (roles: ReadonlyArray<Role> | Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(authReq.user.role as Role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};