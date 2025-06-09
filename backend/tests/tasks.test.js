const express = require('express');
const request = require('supertest');
const tasksRouter = require('../routes/tasks');
const {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
} = require('../controllers/tasks');
const Task = require('../models/Task');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Task');

// Integration tests for XSS sanitization
describe('Tasks XSS Middleware (Integration)', () => {
  const app = express();
  app.use(express.json());
  // Mock authentication middleware to inject user
  app.use((req, res, next) => {
    req.user = { userId: 'test-user-id' };
    next();
  });
  app.use('/api/tasks', tasksRouter);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sanitize malicious input in postTask', async () => {
    const maliciousTitle = `<script>alert('xss')</script>`;
    const sanitizedTitle = ``; // express-xss-sanitizer strips tags by default

    Task.create.mockResolvedValue({
      title: sanitizedTitle,
      createdBy: 'test-user-id',
    });

    await request(app).post('/api/tasks').send({ title: maliciousTitle });

    expect(Task.create).toHaveBeenCalledWith({
      title: sanitizedTitle,
      createdBy: 'test-user-id',
    });
  });

  it('should sanitize malicious input in patchTask', async () => {
    const maliciousTitle = `<img src=x onerror=alert(1)>`;
    const sanitizedTitle = ``;

    Task.findOneAndUpdate.mockResolvedValue({
      _id: '123',
      title: sanitizedTitle,
      createdBy: 'test-user-id',
    });

    await request(app).patch('/api/tasks/123').send({ title: maliciousTitle });

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '123', createdBy: 'test-user-id' },
      { title: sanitizedTitle },
      { new: true, runValidators: true },
    );
  });

  // These tests now encode the maliciousId so Express matches the route,
  // and expect the sanitized value (empty string) since your middleware sanitizes req.params
  it('should sanitize malicious input in getTask (id param)', async () => {
    const maliciousId = `<script>alert('xss')</script>`;
    const encodedId = encodeURIComponent(maliciousId);

    Task.findOne.mockResolvedValue({
      _id: '',
      title: 'Task',
      createdBy: 'test-user-id',
    });

    await request(app).get(`/api/tasks/${encodedId}`);

    expect(Task.findOne).toHaveBeenCalledWith({
      _id: '',
      createdBy: 'test-user-id',
    });
  });

  it('should sanitize malicious input in patchTask (id param)', async () => {
    const maliciousId = `<svg/onload=alert(1)>`;
    const encodedId = encodeURIComponent(maliciousId);

    Task.findOneAndUpdate.mockResolvedValue({
      _id: '',
      title: 'Updated',
      createdBy: 'test-user-id',
    });

    await request(app)
      .patch(`/api/tasks/${encodedId}`)
      .send({ title: 'Updated' });

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '', createdBy: 'test-user-id' },
      { title: 'Updated' },
      { new: true, runValidators: true },
    );
  });

  it('should sanitize malicious input in deleteTask (id param)', async () => {
    const maliciousId = `<iframe src="javascript:alert(1)"></iframe>`;
    const encodedId = encodeURIComponent(maliciousId);

    Task.findOneAndDelete.mockResolvedValue({
      _id: '',
      title: 'Task',
      createdBy: 'test-user-id',
    });

    await request(app).delete(`/api/tasks/${encodedId}`);

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: '',
      createdBy: 'test-user-id',
    });
  });
});

describe('Tasks Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return all tasks for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const fakeTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(fakeTasks),
      });

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ createdBy: 'test-user-id' });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data).toEqual(fakeTasks);
    });
  });

  describe('postTask', () => {
    it('should create a new task for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        body: { title: 'New Task' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const fakeTask = { title: 'New Task', createdBy: 'test-user-id' };
      Task.create.mockResolvedValue(fakeTask);

      await postTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({
        title: 'New Task',
        createdBy: 'test-user-id',
      });
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().data).toEqual(fakeTask);
    });
  });

  describe('getTask', () => {
    it('should return a task by id for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const fakeTask = { _id: '123', title: 'Task' };
      Task.findOne.mockResolvedValue(fakeTask);

      await getTask(req, res, next);

      expect(Task.findOne).toHaveBeenCalledWith({
        _id: '123',
        createdBy: 'test-user-id',
      });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data.task).toEqual(fakeTask);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if task not found for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'notfound' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      Task.findOne.mockResolvedValue(null);

      await getTask(req, res, next);

      expect(Task.findOne).toHaveBeenCalledWith({
        _id: 'notfound',
        createdBy: 'test-user-id',
      });
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('patchTask', () => {
    it('should update a task for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        body: { title: 'Updated' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const fakeTask = { _id: '123', title: 'Updated' };
      Task.findOneAndUpdate.mockResolvedValue(fakeTask);

      await patchTask(req, res, next);

      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123', createdBy: 'test-user-id' },
        { title: 'Updated' },
        { new: true, runValidators: true },
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data.task).toEqual(fakeTask);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if task not found for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'notfound' },
        body: { title: 'Updated' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      Task.findOneAndUpdate.mockResolvedValue(null);

      await patchTask(req, res, next);

      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'notfound', createdBy: 'test-user-id' },
        { title: 'Updated' },
        { new: true, runValidators: true },
      );
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteTask', () => {
    it('should delete a task for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: '123' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const fakeTask = { _id: '123', title: 'Task' };
      Task.findOneAndDelete.mockResolvedValue(fakeTask);

      await deleteTask(req, res, next);

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        createdBy: 'test-user-id',
      });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data.message).toBe('Task deleted.');
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if task not found for the authenticated user', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'notfound' },
        user: { userId: 'test-user-id' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      Task.findOneAndDelete.mockResolvedValue(null);

      await deleteTask(req, res, next);

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'notfound',
        createdBy: 'test-user-id',
      });
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
