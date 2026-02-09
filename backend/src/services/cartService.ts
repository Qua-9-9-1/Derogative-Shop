import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CartItemInput {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export const cartService = {
  async syncCart(userId: string, items: CartItemInput[]) {
    return await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      for (const item of items) {
        await tx.product.upsert({
          where: { id: item.barcode },
          update: {},
          create: {
            id: item.barcode,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl || null,
          },
        });

        await tx.cartItem.create({
          data: {
            userId: userId,
            productId: item.barcode,
            quantity: item.quantity,
          },
        });
      }

      return await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });
    });
  },

  async getCart(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  },
};
