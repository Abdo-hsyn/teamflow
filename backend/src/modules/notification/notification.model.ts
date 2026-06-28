import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMMENTED = 'task_commented',
  PROJECT_CREATED = 'project_created',
  MEMBER_INVITED = 'member_invited',
  MEMBER_JOINED = 'member_joined',
}

class Notification extends Model {
  public id!: number;
  public publicId!: string;
  public userId!: number;
  public type!: NotificationType;
  public title!: string;
  public message!: string;
  public isRead!: boolean;
  public data!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    publicId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { fields: ['user_id'] },
      { fields: ['is_read'] },
    ],
  }
);

export default Notification;