import express from 'express';
import cors from 'cors';
import authRoutes from '@/routes/authRoutes';
import productRoutes from '@/routes/productRoutes';
import userRoutes from '@/routes/userRoutes';
import cartRoutes from '@/routes/cartRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
}

export default app;
