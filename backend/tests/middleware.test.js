const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

const auth = require('../middleware/authentication');
const routeNotFound = require('../middleware/routeNotFound');
const errorHandler = require('../middleware/errorHandler');

describe('Middleware', () => {
  describe('authentication', () => {
    it('calls next with error if no Authorization header', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    it('calls next with error if Authorization header does not start with Bearer', async () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Token abc' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    it('calls next with error if JWT is invalid', async () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer invalidtoken' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      jwt.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].status).toBe(401);
    });

    it('attaches user to req and calls next if JWT is valid', async () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer validtoken' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      jwt.verify.mockReturnValue({ userId: 'abc', name: 'Test' });

      await auth(req, res, next);

      expect(req.user).toEqual({ userId: 'abc', name: 'Test' });
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('routeNotFound', () => {
    it('calls next with 404 HttpError', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      routeNotFound(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].status).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Route not found');
    });
  });

  describe('errorHandler', () => {
    it('sends error response with status and message', () => {
      const err = { status: 400, message: 'Bad request' };
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.statusCode).toBe(400);
      const data = res._getJSONData();
      expect(data.status).toBe('error');
      expect(data.data.code).toBe(400);
      expect(data.data.message).toBe('Bad request');
    });

    it('defaults to 500 and generic message if not provided', () => {
      const err = {};
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data.status).toBe('error');
      expect(data.data.code).toBeUndefined();
      expect(data.data.message).toBe('Internal server error.');
    });
  });
});
