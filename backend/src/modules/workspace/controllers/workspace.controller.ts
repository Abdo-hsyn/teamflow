import { Response, NextFunction } from 'express';
import workspaceService from '../services/workspace.service';
import { validateCreateWorkspace, validateUpdateWorkspace } from '../validations/workspace.validation';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class WorkspaceController {

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateWorkspace(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const workspace = await workspaceService.createWorkspace(
        req.user!.userId,
        req.body
      );

      res.status(201).json(
        successResponse('Workspace created successfully', workspace)
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationPublicId = req.query.organizationId as string;

      if (!organizationPublicId) {
        res.status(422).json(errorResponse('Organization ID is required'));
        return;
      }

      const workspaces = await workspaceService.getWorkspaces(
        req.user!.userId,
        organizationPublicId
      );

      res.status(200).json(
        successResponse('Workspaces fetched successfully', workspaces)
      );
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      const workspace = await workspaceService.getWorkspace(
        publicId,
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Workspace fetched successfully', workspace)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      const validation = validateUpdateWorkspace(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const workspace = await workspaceService.updateWorkspace(
        publicId,
        req.user!.userId,
        req.body
      );

      res.status(200).json(
        successResponse('Workspace updated successfully', workspace)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      await workspaceService.deleteWorkspace(
        publicId,
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Workspace deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkspaceController();