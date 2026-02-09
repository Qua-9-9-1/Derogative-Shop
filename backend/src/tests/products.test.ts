import request from 'supertest';
import app from '../app';

describe('Products API', () => {
  it('should get the catalogue', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for unknown barcode', async () => {
    const res = await request(app).get('/products/unknown-barcode');
    expect(res.status).toBe(404);
  });
});
