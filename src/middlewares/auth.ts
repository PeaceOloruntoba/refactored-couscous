import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Unauthorized: Invalid token');
  }
};

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden: Admin access required');
  }
  next();
};
