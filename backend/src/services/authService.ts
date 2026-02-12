import { prisma } from '../prismaClient';
import bcrypt from 'bcryptjs';
import { tokenService } from './tokenService';

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    const token = tokenService.generateToken({ userId: user.id, email: user.email });
    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async revokeToken(token: string) {
    await tokenService.revokeToken(token);
  },
};
