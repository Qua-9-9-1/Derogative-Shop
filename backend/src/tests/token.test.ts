import { tokenService } from '../services/tokenService';

describe('tokenService', () => {
	it('should generate and verify a token', () => {
		const payload = { userId: '123', email: 'test@example.com' };
		const token = tokenService.generateToken(payload);
		const decoded: any = tokenService.verifyToken(token);
		expect(decoded.userId).toBe('123');
		expect(decoded.email).toBe('test@example.com');
	});

	it('should return false for a non-revoked token', async () => {
		const payload = { userId: '456', email: 'neverrevoked@example.com' };
		const token = tokenService.generateToken(payload);
		const revoked = await tokenService.isTokenRevoked(token);
		expect(revoked).toBe(false);
	});
});
