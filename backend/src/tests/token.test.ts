import { JwtPayload } from 'jsonwebtoken';
import { tokenService } from '../services/tokenService';

describe('tokenService', () => {
	it('should generate and verify a token', () => {
		const payload = { userId: '123', email: 'test@example.com' };
		const token = tokenService.generateToken(payload);
		const decoded: string | JwtPayload = tokenService.verifyToken(token);
		expect(decoded).toHaveProperty('userId', '123');
		expect(decoded).toHaveProperty('email', 'test@example.com');
	});

	it('should return false for a non-revoked token', async () => {
		const payload = { userId: '456', email: 'neverrevoked@example.com' };
		const token = tokenService.generateToken(payload);
		const revoked = await tokenService.isTokenRevoked(token);
		expect(revoked).toBe(false);
	});
});
