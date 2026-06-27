import { Response, NextFunction } from 'express';
import projectService from '../services/project.service';
import { validateCreateProject, validateUpdateProject } from '../validations/project.validation';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class ProjectController {

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateProject(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const project = await projectService.createProject(
        req.user!.userId,
        req.body
      );

      res.status(201).json(
        successResponse('Project created successfully', project)
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspacePublicId = req.query.workspaceId as string;

      if (!workspacePublicId) {
        res.status(422).json(errorResponse('Workspace ID is required'));
        return;
      }

      const projects = await projectService.getProjects(
        req.user!.userId,
        workspacePublicId
      );

      res.status(200).json(
        successResponse('Projects fetched successfully', projects)
      );
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      const project = await projectService.getProject(
        publicId,
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Project fetched successfully', project)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      const validation = validateUpdateProject(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const project = await projectService.updateProject(
        publicId,
        req.user!.userId,
        req.body
      );

      res.status(200).json(
        successResponse('Project updated successfully', project)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      await projectService.deleteProject(
        publicId,
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Project deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();