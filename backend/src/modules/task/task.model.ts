import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

class Task extends Model {
  public id!: number;
  public publicId!: string;
  public title!: string;
  public description!: string | null;
  public status!: TaskStatus;
  public priority!: TaskPriority;
  public projectId!: number;
  public organizationId!: number;
  public assigneeId!: number | null;
  public createdBy!: number;
  public dueDate!: Date | null;
  public estimatedHours!: number | null;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Task.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TaskStatus)),
      defaultValue: TaskStatus.TODO,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TaskPriority)),
      defaultValue: TaskPriority.MEDIUM,
    },
    projectId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    assigneeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: null,
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { fields: ['project_id'] },
      { fields: ['organization_id'] },
      { fields: ['assignee_id'] },
      { fields: ['status'] },
      { fields: ['priority'] },
    ],
  }
);

export default Task;