import { Request, Response } from 'express';
import * as orderService from '@/services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string; email: string };

    const result = await orderService.createOrder(user.id);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string; email: string };
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.status(400).json({
        error: 'Missing paypalOrderId in request body',
        expected: { paypalOrderId: 'string' },
      });
    }

    if (typeof paypalOrderId !== 'string' || paypalOrderId.trim() === '') {
      return res.status(400).json({
        error: 'Invalid paypalOrderId format',
        message: 'paypalOrderId must be a non-empty string',
      });
    }

    const order = await orderService.captureOrder(user.id, paypalOrderId.trim());

    res.json(order);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string; email: string };

    const orders = await orderService.getUserOrders(user.id);

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string };

    const recommendations = await orderService.getRecommendations(user.id);

    res.json(recommendations);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

