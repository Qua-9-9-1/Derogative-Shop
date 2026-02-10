import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const randomPrice = () => {
  return (Math.random() * 19.5 + 0.5).toFixed(2);
};

const randomStock = () => {
  return Math.floor(Math.random() * 100);
};

async function main() {
  try {
    console.log('Starting seed process...');
    const url =
      'https://fr.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&page_size=200&json=1';
    console.log('Fetching products from OpenFoodFacts...');
    const response = await axios.get(url);
    const productsOFF = response.data.products;
    console.log(`Received ${productsOFF.length} products`);
    let count = 0;

    for (const p of productsOFF) {
      if (!p.code || !p.product_name) {
        console.log('Skipping product: missing code or name');
        continue;
      }
      console.log(`Processing product ${count + 1}: ${p.product_name}`);
      await prisma.product.upsert({
        where: { id: p.code },
        update: {},
        create: {
          id: p.code,
          name: p.product_name,
          brand: p.brands?.split(',')[0] || 'Unknown',
          imageUrl: p.image_front_url || null,
          price: parseFloat(randomPrice()),
          stockQuantity: randomStock(),
          nutritionalInfo: p.nutriments,
        },
      });
      count++;
    }
    console.log(`Seeding completed: ${count} products inserted/updated`);
  } catch (error) {
    console.error('Error during seeding', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
