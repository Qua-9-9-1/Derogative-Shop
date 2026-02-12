import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { tokenController } from '@/controllers/tokenController';

const router = Router();

router.get('/:id', tokenController.authenticateAndCheckRevoked, userController.getOne);
router.put('/:id', tokenController.authenticateAndCheckRevoked, userController.update);
router.delete('/:id', tokenController.authenticateAndCheckRevoked, userController.delete);

export default router;
