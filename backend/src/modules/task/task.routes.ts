import { Router } from 'express';
import taskController from './controllers/task.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

// @route   POST /api/v1/tasks
// @desc    Create task
// @access  Private
router.post('/', authenticate, taskController.create.bind(taskController));

// @route   GET /api/v1/tasks?projectId=xxx
// @desc    Get all tasks in project
// @access  Private
router.get('/', authenticate, taskController.getAll.bind(taskController));

// @route   GET /api/v1/tasks/my-tasks
// @desc    Get my assigned tasks
// @access  Private
router.get('/my-tasks', authenticate, taskController.getMyTasks.bind(taskController));

// @route   GET /api/v1/tasks/:publicId
// @desc    Get task by publicId
// @access  Private
router.get('/:publicId', authenticate, taskController.getOne.bind(taskController));

// @route   PUT /api/v1/tasks/:publicId
// @desc    Update task
// @access  Private
router.put('/:publicId', authenticate, taskController.update.bind(taskController));

// @route   DELETE /api/v1/tasks/:publicId
// @desc    Delete task
// @access  Private
router.delete('/:publicId', authenticate, taskController.delete.bind(taskController));

export default router;