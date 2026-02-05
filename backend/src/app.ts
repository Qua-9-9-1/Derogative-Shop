import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import productRoutes from './routes/productRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);