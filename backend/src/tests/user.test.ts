import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';

describe('User API', () => {
  let userId: string;
  let token: string;
  const testEmail = `apitest_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ email: testEmail, password: testPassword });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    token = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({
        where: { email: testEmail },
      });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
    await prisma.$disconnect();
  });

  it('should return 404 for unknown user', async () => {
    const validToken = jwt.sign(
      { userId: 'unexistant-user', email: 'nothing@none.com' },
      process.env.JWT_SECRET || 'not_found',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/user/nonexistent-id-12345')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(401);
  });

  it('should get the user by id', async () => {
    const res = await request(app).get(`/user/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it('should update user firstName', async () => {
    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'UpdatedFirst' });
    
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('UpdatedFirst');
  });

  it('should update user lastName', async () => {
    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ lastName: 'UpdatedLast' });
    
    expect(res.status).toBe(200);
    expect(res.body.lastName).toBe('UpdatedLast');
  });

  it('should update user phone', async () => {
    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '+33612345678' });
    
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('+33612345678');
  });

  it('should update user billingAddress', async () => {
    const billingAddress = {
      street: '123 Test Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    };

    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ billingAddress });
    
    expect(res.status).toBe(200);
    expect(res.body.billingAddress).toEqual(billingAddress);
  });

  it('should update multiple user fields at once', async () => {
    const updates = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33698765432'
    };

    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);
    
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(updates.firstName);
    expect(res.body.lastName).toBe(updates.lastName);
    expect(res.body.phone).toBe(updates.phone);
  });

  it('should verify all updates persisted', async () => {
    const res = await request(app).get(`/user/${userId}`).set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('John');
    expect(res.body.lastName).toBe('Doe');
    expect(res.body.phone).toBe('+33698765432');
  });

  it('should delete the user', async () => {
    const res = await request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });

  it('should confirm user is deleted', async () => {
    const res = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(401);
  });
});
