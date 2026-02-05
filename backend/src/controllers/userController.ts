import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  create: async (req: Request, res: Response) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'This email already exists.' });
      } else {
        res.status(500).json({ message: 'Error creating user', error });
      }
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      );
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updatedUser = await userService.updateUser(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
        req.body
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await userService.deleteUser(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  },
};
