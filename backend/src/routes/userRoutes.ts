import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { tokenController } from '@/controllers/tokenController';

const router = Router();

router.get('/:id', tokenController.authenticateAndCheckRevoked, userController.getOne);
router.put('/:id', tokenController.authenticateAndCheckRevoked, userController.update);
router.put('/:id/password', tokenController.authenticateAndCheckRevoked, userController.updatePassword);
router.delete('/:id', tokenController.authenticateAndCheckRevoked, userController.delete);

export default router;
