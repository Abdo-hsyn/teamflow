import { Router } from 'express';
import organizationController from './controllers/organization.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// @route   POST /api/v1/organizations
// @desc    Create organization
// @access  Private
router.post('/', authenticate, organizationController.create.bind(organizationController));

// @route   GET /api/v1/organizations
// @desc    Get all user organizations
// @access  Private
router.get('/', authenticate, organizationController.getAll.bind(organizationController));

// @route   GET /api/v1/organizations/:publicId
// @desc    Get organization by publicId
// @access  Private
router.get('/:publicId', authenticate, organizationController.getOne.bind(organizationController));

// @route   PUT /api/v1/organizations/:publicId
// @desc    Update organization
// @access  Private
router.put('/:publicId', authenticate, organizationController.update.bind(organizationController));

// @route   DELETE /api/v1/organizations/:publicId
// @desc    Delete organization
// @access  Private
router.delete('/:publicId', authenticate, organizationController.delete.bind(organizationController));

// @route   GET /api/v1/organizations/:publicId/members
// @desc    Get organization members
// @access  Private
router.get('/:publicId/members', authenticate, organizationController.getMembers.bind(organizationController));

export default router;