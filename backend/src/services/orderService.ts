import { prisma } from "../prismaClient";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "./paypalService";


export const createOrder = async (userId: string) => {
  //récupérer panier
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  // recalcul total sécurisé
  const total = cartItems.reduce<number>(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  // créer order PayPal
  const paypalOrderId = await createPayPalOrder(total);

  return { paypalOrderId };
};

export const captureOrder = async (
  userId: string,
  paypalOrderId: string
) => {
  const captureData = await capturePayPalOrder(paypalOrderId);

  if (captureData.status !== "COMPLETED") {
    throw new Error("Payment not completed");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  const total = cartItems.reduce<number>(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const captureId =
    captureData.purchase_units[0].payments.captures[0].id;

  // créer order en DB
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      paypalOrderId,
      paypalCaptureId: captureId,
      status: "COMPLETED",
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
