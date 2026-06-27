import { Router } from 'express';
import projectController from './controllers/project.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// @route   POST /api/v1/projects
// @desc    Create project
// @access  Private
router.post('/', authenticate, projectController.create.bind(projectController));

// @route   GET /api/v1/projects?workspaceId=xxx
// @desc    Get all projects in workspace
// @access  Private
router.get('/', authenticate, projectController.getAll.bind(projectController));

// @route   GET /api/v1/projects/:publicId
// @desc    Get project by publicId
// @access  Private
router.get('/:publicId', authenticate, projectController.getOne.bind(projectController));

// @route   PUT /api/v1/projects/:publicId
// @desc    Update project
// @access  Private
router.put('/:publicId', authenticate, projectController.update.bind(projectController));

// @route   DELETE /api/v1/projects/:publicId
// @desc    Delete project
// @access  Private
router.delete('/:publicId', authenticate, projectController.delete.bind(projectController));

export default router;