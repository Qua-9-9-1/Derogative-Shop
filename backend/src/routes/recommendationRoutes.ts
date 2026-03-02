import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { recommendationController } from '../controllers/recommendationController';

const router = Router();

router.get('/', authenticate, recommendationController.getUserRecommendations);

export default router;