import { Request, Response } from 'express';
import { cartService } from '@/services/cartService';

export const cartController = {
  syncCart: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { items } = req.body;

      if (!Array.isArray(items)) {
        res.status(400).json({ message: 'Invalid cart format.' });
        return;
      }
      const updatedCart = await cartService.syncCart(userId, items);
      res.json({ message: 'Cart synchronized', cart: updatedCart });
    } catch (error) {
      console.error('Sync Cart Error:', error);
      res.status(500).json({ message: 'Server error during synchronization.' });
    }
  },

  getCart: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cart.' });
    }
  },
};
