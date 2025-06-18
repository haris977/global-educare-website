import { Request, Response, NextFunction } from 'express';

export function checkRole(roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      return;
    }
    next();
  };
} 