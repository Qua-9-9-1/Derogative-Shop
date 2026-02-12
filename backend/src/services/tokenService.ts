import { prisma } from '../prismaClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_securise_a_changer';

export const tokenService = {
  generateToken(payload: object, options?: jwt.SignOptions) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options });
  },

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  },

  async revokeToken(token: string) {
    await prisma.revokedToken.create({
      data: { token },
    });
  },

  async isTokenRevoked(token: string) {
    const revoked = await prisma.revokedToken.findUnique({ where: { token } });
    return !!revoked;
  },
};
