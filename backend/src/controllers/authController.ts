import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { tokenService } from '../services/tokenService';
import { Prisma } from '@prisma/client';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(400).json({ message: 'Email and password required' });
        return;
      }

      const newUser = await userService.createUser(req.body);

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Register error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        res.status(409).json({ message: 'This email is already in use.' });
      } else {
        res
          .status(500)
          .json({ message: 'Server error during registration', error: (error as Error).message });
      }
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password required' });
        return;
      }

      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ message: 'Incorrect email or password' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
      }

      let payload: any;
      try {
        payload = tokenService.verifyToken(token);
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      if (await tokenService.isTokenRevoked(token)) {
        return res.status(401).json({ message: 'Token has been revoked' });
      }

      const { userId, email } = payload;
      const newToken = tokenService.generateToken({ userId, email });
      res.json({ token: newToken });
    } catch (error) {
      res.status(500).json({ message: 'Server error during token refresh' });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (token) {
        await tokenService.revokeToken(token);
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error during logout' });
    }
  },
};
