import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Comment extends Model {
  public id!: number;
  public publicId!: string;
  public content!: string;
  public taskId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Comment.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { fields: ['task_id'] },
      { fields: ['user_id'] },
    ],
  }
);

export default Comment;