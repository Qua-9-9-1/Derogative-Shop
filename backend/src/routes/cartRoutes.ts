import { Router } from 'express';
import { cartController } from '@/controllers/cartController';
import { tokenController } from '@/controllers/tokenController';

const router = Router();

router.get('/', tokenController.authenticateAndCheckRevoked, cartController.getCart);
router.put('/sync', tokenController.authenticateAndCheckRevoked, cartController.syncCart);

export default router;
