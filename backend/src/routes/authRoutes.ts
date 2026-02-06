import { Router } from 'express';
import { authController } from '../controllers/authController';
import { tokenController } from '../controllers/tokenControlelr';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', tokenController.checkRevokedToken, authController.logout);

export default router;
