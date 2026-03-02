import { prisma } from '../prismaClient';
import { Product } from '@prisma/client';

export const getRecommendations = async (userId: string) => {
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
    return await prisma.product.findMany({
      where: { stockQuantity: { gt: 0 } },
      take: 10,
    });
  }

  const purchasedProducts = orders.flatMap(order =>
    order.items.map(item => item.product)
  );

  const purchasedIds = purchasedProducts.map(p => p.id);

  const purchasedCategories = [
    ...new Set(
      purchasedProducts
        .map(p => p.category)
        .filter((c): c is string => !!c)
    ),
  ];

  let recommendations: Product[] = [];

  if (purchasedCategories.length > 0) {
    recommendations = await prisma.product.findMany({
      where: {
        category: { in: purchasedCategories },
        id: { notIn: purchasedIds },
        stockQuantity: { gt: 0 },
      },
      take: 10,
    });
  }

  if (recommendations.length < 10) {
    const extraProducts = await prisma.product.findMany({
      where: {
        id: { notIn: [...purchasedIds, ...recommendations.map(r => r.id)] },
        stockQuantity: { gt: 0 },
      },
      take: 10 - recommendations.length,
    });

    recommendations = [...recommendations, ...extraProducts];
  }

  return recommendations;
};