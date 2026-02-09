import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  let token: string;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testEmail);
  });

  it('should not register with existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('should refresh a valid token', async () => {
    const res = await request(app).post('/auth/refresh').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should logout a user', async () => {
    const res = await request(app).post('/auth/logout').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should not refresh a revoked token', async () => {
    const res = await request(app).post('/auth/refresh').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
