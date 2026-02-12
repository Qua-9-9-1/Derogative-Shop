import { prisma } from '../prismaClient';
import { Product } from '@prisma/client';
import axios from 'axios';

const OFF_API_URL = 'https://world.openfoodfacts.org/api/v0/product';

export const productService = {
  async getOrFetchProduct(barcode: string): Promise<Product | null> {
    const existingProduct = await prisma.product.findUnique({
      where: { id: barcode },
    });

    if (existingProduct) {
      console.log(`product ${barcode} found in local DB.`);
      return existingProduct;
    }

    console.log(`product ${barcode} not found locally. Calling OFF...`);
    try {
      const response = await axios.get(`${OFF_API_URL}/${barcode}.json`);

      if (response.data.status === 1) {
        const offData = response.data.product;

        const newProduct = await prisma.product.create({
          data: {
            id: barcode,
            name: offData.product_name || 'Unknown product',
            brand: offData.brands || 'Unknown brand',
            smallImageUrl: offData.image_front_small_url || null,
            imageUrl: offData.image_front_url || null,
            price: 999,
            category: offData.categories_tags ? offData.categories_tags[0] : null,
            nutritionalInfo: offData.nutriments || {},
            stockQuantity: 0,
          },
        });

        return newProduct;
      }

      return null;
    } catch (error) {
      console.error('Erreur API OFF', error);
      return null;
    }
  },

  async getAllProducts() {
    return await prisma.product.findMany();
  },
};
