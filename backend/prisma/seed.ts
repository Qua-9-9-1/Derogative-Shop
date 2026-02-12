import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const randomPrice = () => (Math.random() * 19.5 + 0.5).toFixed(2);
const randomStock = () => Math.floor(Math.random() * 100);

async function cleanDatabase() {
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.revokedToken.deleteMany();
  console.log('Database cleaned');
}

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'test@user.test',
      passwordHash: hashedPassword,
      firstName: 'Testman',
      lastName: 'Tester',
      phone: '0123456789',
      billingAddress: {
        zip: '75001',
        city: 'Paris',
        street: '1 Rue de la Paix',
        country: 'France',
      },
    },
  });
  console.log('Test user created');
}

async function importProducts(targetCount = 250) {
  let importedCount = 0;
  let page = 1;
  const PAGE_SIZE = 100;
  while (importedCount < targetCount) {
    const url = `https://fr.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&page_size=${PAGE_SIZE}&page=${page}&json=1`;
    const response = await axios.get(url);
    const productsOFF = response.data.products;
    if (!productsOFF || productsOFF.length === 0) {
      console.log('No more products to import from OpenFoodFacts.');
      break;
    }
    for (const p of productsOFF) {
      if (importedCount >= targetCount) break;
      if (!p.code || !p.product_name) continue;
      await prisma.product.create({
        data: {
          id: p.code,
          name: p.product_name,
          brand: p.brands?.split(',')[0] || 'Marque inconnue',
          smallImageUrl: p.image_front_small_url || p.image_front_url || null,
          imageUrl: p.image_front_url || null,
          price: parseFloat(randomPrice()),
          stockQuantity: randomStock(),
          nutritionalInfo: p.nutriments || {},
        },
      });
      importedCount++;
      console.log(`Imported product ${importedCount}: ${p.product_name}`);
    }
    page++;
  }
  console.log(`Finished importing ${importedCount} products.`);
}

async function main() {
  try {
    await cleanDatabase();
    await createTestUser();
    await importProducts(250);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch(() => {
    console.error('Unexpected error during seeding');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
