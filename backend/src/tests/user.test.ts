import request from 'supertest';
import app from '../app';

describe('User API', () => {
	let userId: string;
	let token: string;
	const testEmail = `apitest_${Date.now()}@example.com`;
	const testPassword = 'TestPassword123!';

	beforeAll(async () => {
		await request(app).post('/auth/register').send({ email: testEmail, password: testPassword });
		const loginRes = await request(app).post('/auth/login').send({ email: testEmail, password: testPassword });
		token = loginRes.body.token;
		const users = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
		userId = users.body[0]?.id || '';
	});

	it('should return 404 for unknown user', async () => {
		const res = await request(app)
			.get('/users/nonexistent-id')
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(404);
	});

	it('should get the user by id', async () => {
		if (!userId) return;
		const res = await request(app)
			.get(`/users/${userId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body.email).toBe(testEmail);
	});

	it('should update the user', async () => {
		if (!userId) return;
		const res = await request(app)
			.put(`/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ firstName: 'API' });
		expect(res.status).toBe(200);
		expect(res.body.firstName).toBe('API');
	});

	it('should delete the user', async () => {
		if (!userId) return;
		const res = await request(app)
			.delete(`/users/${userId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
	});
});
