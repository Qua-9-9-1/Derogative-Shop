import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
