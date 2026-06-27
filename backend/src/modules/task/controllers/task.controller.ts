import { Response, NextFunction } from 'express';
import taskService from '../services/task.service';
import { validateCreateTask, validateUpdateTask } from '../validations/task.validation';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class TaskController {

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateTask(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const task = await taskService.createTask(req.user!.userId, req.body);

      res.status(201).json(
        successResponse('Task created successfully', task)
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectPublicId = req.query.projectId as string;

      if (!projectPublicId) {
        res.status(422).json(errorResponse('Project ID is required'));
        return;
      }

      const tasks = await taskService.getTasks(req.user!.userId, projectPublicId);

      res.status(200).json(
        successResponse('Tasks fetched successfully', tasks)
      );
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
      const task = await taskService.getTask(publicId, req.user!.userId);

      res.status(200).json(
        successResponse('Task fetched successfully', task)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      const validation = validateUpdateTask(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const task = await taskService.updateTask(
        publicId,
        req.user!.userId,
        req.body
      );

      res.status(200).json(
        successResponse('Task updated successfully', task)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
      await taskService.deleteTask(publicId, req.user!.userId);

      res.status(200).json(
        successResponse('Task deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getMyTasks(req.user!.userId);

      res.status(200).json(
        successResponse('My tasks fetched successfully', tasks)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();