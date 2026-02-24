import { Request, Response } from "express";
import * as orderService from "@/services/orderService";

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user as { id: string; email: string };

    const result = await orderService.createOrder(user.id);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const captureOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user as { id: string; email: string };
    const { paypalOrderId } = req.body;

    const order = await orderService.captureOrder(
      user.id,
      paypalOrderId
    );

    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
