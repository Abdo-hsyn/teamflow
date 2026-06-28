import { randomUUID } from 'crypto';
import Notification, { NotificationType } from '../notification.model';
import redisService from '../../../shared/services/redis.service';

class NotificationService {

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    const notification = await Notification.create({
      publicId: randomUUID(),
      userId,
      type,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
    });

    // Cache unread count
    await this.updateUnreadCount(userId);

    return notification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
  }

  async markAsRead(userId: number, publicId: string): Promise<void> {
    await Notification.update(
      { isRead: true },
      { where: { publicId, userId } }
    );
    await this.updateUnreadCount(userId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    await redisService.set(`unread_notifications:${userId}`, '0');
  }

  async getUnreadCount(userId: number): Promise<number> {
    const cached = await redisService.get(`unread_notifications:${userId}`);
    if (cached) return parseInt(cached);
    return this.updateUnreadCount(userId);
  }

  private async updateUnreadCount(userId: number): Promise<number> {
    const count = await Notification.count({
      where: { userId, isRead: false },
    });
    await redisService.set(
      `unread_notifications:${userId}`,
      count.toString(),
      300
    );
    return count;
  }
}

export default new NotificationService();