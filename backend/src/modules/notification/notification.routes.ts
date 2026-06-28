import { Router } from 'express';
import notificationController from './controllers/notification.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.get('/', authenticate, notificationController.getAll.bind(notificationController));
router.get('/unread-count', authenticate, notificationController.getUnreadCount.bind(notificationController));
router.put('/:publicId/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/mark-all-read', authenticate, notificationController.markAllAsRead.bind(notificationController));

export default router;