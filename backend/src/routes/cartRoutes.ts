import { Router } from 'express';
import { cartController } from '@/controllers/cartController';
import { tokenController } from '@/controllers/tokenControlelr';

const router = Router();

router.get('/', tokenController.authenticateAndCheckRevoked, cartController.getCart);
router.put('/sync', tokenController.authenticateAndCheckRevoked, cartController.syncCart);

export default router;
