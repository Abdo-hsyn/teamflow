import { Response, NextFunction } from 'express';
import organizationService from '../services/organization.service';
import { validateCreateOrganization, validateUpdateOrganization } from '../validations/organization.validation';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class OrganizationController {

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateOrganization(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const organization = await organizationService.createOrganization(
        req.user!.userId,
        req.body
      );

      res.status(201).json(
        successResponse('Organization created successfully', organization)
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizations = await organizationService.getUserOrganizations(
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Organizations fetched successfully', organizations)
      );
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
      const organization = await organizationService.getOrganizationByPublicId(
        publicId,
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Organization fetched successfully', organization)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateUpdateOrganization(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const publicId = req.params.publicId as string;
const organization = await organizationService.updateOrganization(
  publicId,
  req.user!.userId,
  req.body
);

      res.status(200).json(
        successResponse('Organization updated successfully', organization)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
await organizationService.deleteOrganization(
  publicId,
  req.user!.userId
);

      res.status(200).json(
        successResponse('Organization deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
const members = await organizationService.getMembers(
  publicId,
  req.user!.userId
);

      res.status(200).json(
        successResponse('Members fetched successfully', members)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationController();