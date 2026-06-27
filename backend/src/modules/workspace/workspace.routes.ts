import { Router } from 'express';
import workspaceController from './controllers/workspace.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// @route   POST /api/v1/workspaces
// @desc    Create workspace
// @access  Private
router.post('/', authenticate, workspaceController.create.bind(workspaceController));

// @route   GET /api/v1/workspaces?organizationId=xxx
// @desc    Get all workspaces in organization
// @access  Private
router.get('/', authenticate, workspaceController.getAll.bind(workspaceController));

// @route   GET /api/v1/workspaces/:publicId
// @desc    Get workspace by publicId
// @access  Private
router.get('/:publicId', authenticate, workspaceController.getOne.bind(workspaceController));

// @route   PUT /api/v1/workspaces/:publicId
// @desc    Update workspace
// @access  Private
router.put('/:publicId', authenticate, workspaceController.update.bind(workspaceController));

// @route   DELETE /api/v1/workspaces/:publicId
// @desc    Delete workspace
// @access  Private
router.delete('/:publicId', authenticate, workspaceController.delete.bind(workspaceController));

export default router;