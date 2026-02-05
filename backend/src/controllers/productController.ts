import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const productController = {
  getProduct: async (req: Request, res: Response) => {
    try {
      const { barcode } = req.params;
      const barcodeString = Array.isArray(barcode) ? barcode[0] : barcode;
      const product = await productService.getOrFetchProduct(barcodeString);

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  getCatalogue: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};
