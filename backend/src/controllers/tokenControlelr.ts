import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/tokenService';

export const tokenController = {
  async authenticateAndCheckRevoked(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    try {
      tokenService.verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token', error: (error as Error).message });
    }
    if (await tokenService.isTokenRevoked(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }
    next();
  },

  async checkRevokedToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    if (await tokenService.isTokenRevoked(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }
    next();
  },
};
