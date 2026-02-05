import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface CreateUserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  billingAddress?: Prisma.InputJsonValue;
}

type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'password'>>;

export const userService = {
  async createUser(data: CreateUserPayload) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        billingAddress: data.billingAddress ?? {},
      },
    });
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async updateUser(id: string, data: UpdateUserPayload) {
    return await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        billingAddress:
          data.billingAddress === null ? Prisma.DbNull : (data.billingAddress ?? undefined),
      },
    });
  },

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
