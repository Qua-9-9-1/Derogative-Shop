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

  updatePassword: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { newPassword } = req.body;
      
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        res.status(400).json({ message: 'New password must be at least 6 characters long' });
        return;
      }
      
      await userService.updatePassword(id, newPassword);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error during password update',
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
