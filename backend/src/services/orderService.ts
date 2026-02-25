import { prisma } from '../prismaClient';
import { createPayPalOrder, capturePayPalOrder } from './paypalService';

export const createOrder = async (userId: string) => {
  //récupérer panier
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (!cartItems.length) {
    throw new Error('Cart is empty');
  }

  // recalcul total sécurisé
  const total = cartItems.reduce<number>(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  // créer order PayPal
  const { id: paypalOrderId, approveLink } = await createPayPalOrder(total);

  return { paypalOrderId, approveLink };
};

export const captureOrder = async (userId: string, paypalOrderId: string) => {
  if (!paypalOrderId) {
    throw new Error('Missing PayPal order ID');
  }

  let captureData;
  try {
    captureData = await capturePayPalOrder(paypalOrderId);
  } catch (error: any) {
    if (error.response?.status === 404) {
      const err: any = new Error(
        `PayPal order ID "${paypalOrderId}" not found. Make sure the order was created successfully.`
      );
      err.statusCode = 404;
      throw err;
    }
    if (error.response?.status === 422) {
      const err: any = new Error(
        'Cannot capture this PayPal order. It may have already been captured or cancelled.'
      );
      err.statusCode = 422;
      throw err;
    }
    const err: any = new Error(`PayPal error: ${error.message}`);
    err.statusCode = 502;
    throw err;
  }

  if (captureData.status !== 'COMPLETED') {
    const err: any = new Error(`Payment not completed. Current status: ${captureData.status}`);
    err.statusCode = 402;
    throw err;
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  const total = cartItems.reduce<number>(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const captureId = captureData.purchase_units[0].payments.captures[0].id;

  // créer order en DB
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      paypalOrderId,
      paypalCaptureId: captureId,
      status: 'COMPLETED',
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.product.price),
        })) as any,
      },
    },
  });

  //vider panier
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return order;
};

export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};
