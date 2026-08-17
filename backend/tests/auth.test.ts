import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import createApp from '../src/app.js';
import { prisma } from './setup.js';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  let server: Server;
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'newuser@test.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email', 'newuser@test.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should reject weak password', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'weak@test.com',
        password: 'weak',
        confirmPassword: 'weak',
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should reject mismatched passwords', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'mismatch@test.com',
        password: 'TestPass123!',
        confirmPassword: 'DifferentPass123!',
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@test.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
      };

      await request(app).post('/api/v1/auth/register').send(userData);
      const response = await request(app).post('/api/v1/auth/register').send(userData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      const hashed = await bcrypt.hash('LoginPass123!', 12);
      await prisma.user.create({
        data: {
          name: 'Login User',
          email: 'login@test.com',
          password: hashed,
          role: 'CITIZEN',
          isEmailVerified: true,
        },
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'login@test.com',
        password: 'LoginPass123!',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'login@test.com',
        password: 'WrongPass123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'TestPass123!',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should reject unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/auth/me');
      expect(response.status).toBe(401);
    });

    it('should return user profile when authenticated', async () => {
      const hashed = await bcrypt.hash('MePass123!', 12);
      await prisma.user.create({
        data: {
          name: 'Me User',
          email: 'me@test.com',
          password: hashed,
          role: 'CITIZEN',
          isEmailVerified: true,
        },
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'me@test.com', password: 'MePass123!' });

      const cookies = loginRes.headers['set-cookie'];

      const response = await request(app).get('/api/v1/auth/me').set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email', 'me@test.com');
    });
  });
});
