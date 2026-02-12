import { Request, Response } from 'express';
import { cartService } from '@/services/cartService';

export const cartController = {
  syncCart: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId || (req as any).userId;
      const itemsRaw = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Missing userId (token invalid?)' });
      }
      if (!Array.isArray(itemsRaw)) {
        return res.status(400).json({ message: 'Invalid cart format: expected array.' });
      }
      const items = itemsRaw.map((item: any) => ({
        barcode: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.image_url,
      }));
      for (const item of items) {
        if (!item.barcode || !item.name || isNaN(item.price) || typeof item.quantity !== 'number') {
          return res.status(422).json({ message: 'Invalid item format', item });
        }
      }
      const updatedCart = await cartService.syncCart(userId, items);
      res.json({ message: 'Cart synchronized', cart: updatedCart });
    } catch (error: any) {
      console.error('Sync Cart Error:', error);
      if (error.code && typeof error.code === 'string' && error.code.startsWith('P')) {
        return res.status(500).json({ message: 'Database error', error: error.message });
      }
      res
        .status(500)
        .json({ message: 'Server error during synchronization.', error: error.message || error });
    }
  },

  getCart: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId || (req as any).userId;
      if (!userId) {
        return res.status(401).json({ message: 'Missing userId (token invalid?)' });
      }
      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: 'Error retrieving cart.', error: error.message || error });
    }
  },
};
