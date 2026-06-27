import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  COMPLETED = 'completed',
}

class Project extends Model {
  public id!: number;
  public publicId!: string;
  public name!: string;
  public description!: string | null;
  public status!: ProjectStatus;
  public workspaceId!: number;
  public organizationId!: number;
  public createdBy!: number;
  public startDate!: Date | null;
  public endDate!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Project.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      defaultValue: ProjectStatus.ACTIVE,
    },
    workspaceId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { fields: ['workspace_id'] },
      { fields: ['organization_id'] },
      { fields: ['created_by'] },
      { fields: ['status'] },
    ],
  }
);

export default Project;