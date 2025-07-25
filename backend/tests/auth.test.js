const express = require('express');
const request = require('supertest');
const httpMocks = require('node-mocks-http');
const { StatusCodes } = require('http-status-codes');

const { register, login } = require('../controllers/auth');
const authRouter = require('../routes/auth');
const User = require('../models/User');

jest.mock('../models/User');

// Setup Express app for integration tests
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth XSS Middleware (Integration)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sanitize malicious input in register', async () => {
    const maliciousName = `<script>alert('xss')</script>`;
    const sanitizedName = ``; // The sanitizer strips the script tag and its content

    User.create.mockResolvedValue({
      name: sanitizedName,
      email: 'xss@example.com',
      password: 'pass',
      createJWT: () => 'token',
    });

    await request(app).post('/api/auth/register').send({
      name: maliciousName,
      email: 'xss@example.com',
      password: 'pass',
    });

    expect(User.create).toHaveBeenCalledWith({
      name: sanitizedName,
      email: 'xss@example.com',
      password: 'pass',
    });
  });
});

describe('Auth Controller (Unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return name and token', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Test', email: 'test@example.com', password: 'pass' },
      });
      const res = httpMocks.createResponse();

      const fakeUser = {
        name: 'Test',
        createJWT: jest.fn().mockReturnValue('fake-jwt-token'),
      };
      User.create.mockResolvedValue(fakeUser);

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      });
      expect(fakeUser.createJWT).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.CREATED);
      const data = res._getJSONData();
      expect(data.user).toBe('Test');
      expect(data.token).toBe('fake-jwt-token');
    });
  });

  describe('login', () => {
    it('should throw error if email or password is missing', async () => {
      const req = httpMocks.createRequest({ body: {} });
      const res = httpMocks.createResponse();

      await expect(login(req, res)).rejects.toThrow(
        'Please, provide email and password',
      );
    });

    it('should throw error if user not found', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'notfound@example.com', password: 'pass' },
      });
      const res = httpMocks.createResponse();

      User.findOne.mockResolvedValue(null);

      await expect(login(req, res)).rejects.toThrow('Invalid credentials.');
    });

    it('should throw error if password is incorrect', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'test@example.com', password: 'wrongpass' },
      });
      const res = httpMocks.createResponse();

      const fakeUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(fakeUser);

      await expect(login(req, res)).rejects.toThrow('Invalid credentials.');
    });

    it('should login user and return name and token', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'test@example.com', password: 'pass' },
      });
      const res = httpMocks.createResponse();

      const fakeUser = {
        name: 'Test',
        comparePassword: jest.fn().mockResolvedValue(true),
        createJWT: jest.fn().mockReturnValue('fake-jwt-token'),
      };
      User.findOne.mockResolvedValue(fakeUser);

      await login(req, res);

      expect(fakeUser.comparePassword).toHaveBeenCalledWith('pass');
      expect(fakeUser.createJWT).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.OK);
      const data = res._getJSONData();
      expect(data.user).toBe('Test');
      expect(data.token).toBe('fake-jwt-token');
    });
  });
});
