import { Request, Response } from 'express';
import { getRecommendations } from '../services/recommendationService';

export const recommendationController = {
  async getUserRecommendations(req: Request, res: Response) {
    try {
      const user = req as any; // 🔥 cast ici

      const recommendations = await getRecommendations(user.user.id);

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch recommendations',
        error: (error as Error).message,
      });
    }
  },
};