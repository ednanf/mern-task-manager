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
