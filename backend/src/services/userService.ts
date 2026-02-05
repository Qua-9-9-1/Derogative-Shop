import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userService = {
  async createUser(data: any) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        billingAddress: data.billingAddress || {},
      },
    });
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        billingAddress: data.billingAddress,
      },
    });
  },

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
