import { prisma } from '../prismaClient';
import { Product } from '@prisma/client';

export const productService = {
  async getOrFetchProduct(barcode: string): Promise<Product | null> {
    const existingProduct = await prisma.product.findUnique({
      where: { id: barcode },
    });

    if (existingProduct) {
      console.log(`product ${barcode} found in local DB.`);
      return existingProduct;
    }

    return null;
  },

  async getAllProducts() {
    return await prisma.product.findMany();
  },
};
