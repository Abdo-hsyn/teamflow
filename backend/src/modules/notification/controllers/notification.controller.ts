import { Response, NextFunction } from 'express';
import notificationService from '../services/notification.service';
import { successResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class NotificationController {

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await notificationService.getUserNotifications(
        req.user!.userId
      );

      res.status(200).json(
        successResponse('Notifications fetched successfully', notifications)
      );
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await notificationService.getUnreadCount(req.user!.userId);

      res.status(200).json(
        successResponse('Unread count fetched successfully', { count })
      );
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
      await notificationService.markAsRead(req.user!.userId, publicId);

      res.status(200).json(
        successResponse('Notification marked as read')
      );
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAllAsRead(req.user!.userId);

      res.status(200).json(
        successResponse('All notifications marked as read')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();