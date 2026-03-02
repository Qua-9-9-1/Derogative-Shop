import { prisma } from '../prismaClient';

export const getRecommendations = async (userId: string) => {
  // 1️⃣ récupérer produits déjà achetés
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!orders.length) {
    return [];
  }

  // 2️⃣ extraire catégories achetées
  const purchasedCategories = new Set<string>();
  const purchasedProductIds = new Set<string>();

  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.product.category) {
        purchasedCategories.add(item.product.category);
      }
      purchasedProductIds.add(item.product.id);
    });
  });

  // 3️⃣ chercher autres produits mêmes catégories
  const recommendations = await prisma.product.findMany({
    where: {
      category: {
        in: Array.from(purchasedCategories),
      },
      id: {
        notIn: Array.from(purchasedProductIds),
      },
      stockQuantity: {
        gt: 0,
      },
    },
    take: 10,
  });

  return recommendations;
};