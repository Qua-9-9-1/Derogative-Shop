import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

router.get('/', productController.getCatalogue);
router.get('/:barcode', productController.getProduct);

export default router;