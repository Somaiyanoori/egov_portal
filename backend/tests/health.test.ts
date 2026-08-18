import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import createApp from '../src/app.js';

describe('Health Endpoints', () => {
  let server: Server;
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 and success', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
    });
  });

  describe('GET /api/v1/health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app).get('/api/v1/health/detailed');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data.services).toHaveProperty('database');
      expect(response.body.data.services).toHaveProperty('redis');
      expect(response.body.data).toHaveProperty('system');
    });
  });

  describe('GET /', () => {
    it('should return API info', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('documentation');
    });
  });

  describe('GET /invalid-route', () => {
    it('should return 404 for invalid routes', async () => {
      const response = await request(app).get('/api/v1/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
