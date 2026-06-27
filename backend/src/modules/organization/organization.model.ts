import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Organization extends Model {
  public id!: number;
  public publicId!: string;
  public name!: string;
  public slug!: string;
  public description!: string | null;
  public logo!: string | null;
  public website!: string | null;
  public ownerId!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Organization.init(
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
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    ownerId: {
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
    tableName: 'organizations',
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['public_id'] },
      { unique: true, fields: ['slug'] },
      { fields: ['owner_id'] },
    ],
  }
);

export default Organization;