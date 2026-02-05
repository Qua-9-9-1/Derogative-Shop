import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { Prisma } from '@prisma/client';

export const userController = {
  create: async (req: Request, res: Response) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          res.status(409).json({ message: 'This email already exists.' });
          return;
        }
      }

      res.status(500).json({
        message: 'Error during creation',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const updatedUser = await userService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({
        message: 'Error during update',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error during deletion',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
