import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Workspace extends Model {
  public id!: number;
  public publicId!: string;
  public name!: string;
  public description!: string | null;
  public organizationId!: number;
  public createdBy!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Workspace.init(
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
    organizationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'workspaces',
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { fields: ['organization_id'] },
      { fields: ['created_by'] },
    ],
  }
);

export default Workspace;