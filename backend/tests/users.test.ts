import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import createApp from '../src/app.js';
import { prisma } from './setup.js';
import bcrypt from 'bcryptjs';

describe('Users Endpoints (Admin)', () => {
  let server: Server;
  let app: ReturnType<typeof createApp>;
  let adminCookies: string[];

  beforeAll(async () => {
    app = createApp();
    server = app.listen(0);

    // Create admin user
    const hashed = await bcrypt.hash('AdminPass123!', 12);
    await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'testadmin@test.com',
        password: hashed,
        role: 'ADMIN',
        isEmailVerified: true,
      },
    });

    // Login as admin
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testadmin@test.com', password: 'AdminPass123!' });

    adminCookies = loginRes.headers['set-cookie'];
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/v1/users', () => {
    it('should list users with pagination', async () => {
      const response = await request(app).get('/api/v1/users').set('Cookie', adminCookies);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('page');
    });

    it('should reject unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const response = await request(app).post('/api/v1/users').set('Cookie', adminCookies).send({
        name: 'Created User',
        email: 'created@test.com',
        password: 'CreatedPass123!',
        role: 'CITIZEN',
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('email', 'created@test.com');
    });
  });

  describe('GET /api/v1/users/stats', () => {
    it('should return user statistics', async () => {
      const response = await request(app).get('/api/v1/users/stats').set('Cookie', adminCookies);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('byRole');
    });
  });
});
