import { Request, Response } from 'express';
import { userService } from '@/services/userService';

export const userController = {
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
