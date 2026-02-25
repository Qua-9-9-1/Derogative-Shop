import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as orderController from '@/controllers/orderController';

const router = Router();

router.post('/create', authenticate, orderController.createOrder);
router.post('/capture', authenticate, orderController.captureOrder);
router.get('/', authenticate, orderController.getUserOrders);

export default router;
