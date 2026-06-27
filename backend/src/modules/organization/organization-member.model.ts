import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

class OrganizationMember extends Model {
  public id!: number;
  public organizationId!: number;
  public userId!: number;
  public role!: MemberRole;
  public status!: MemberStatus;
  public joinedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrganizationMember.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(MemberRole)),
      allowNull: false,
      defaultValue: MemberRole.VIEWER,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MemberStatus)),
      allowNull: false,
      defaultValue: MemberStatus.PENDING,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'organization_members',
    underscored: true,
    indexes: [
      { fields: ['organization_id'] },
      { fields: ['user_id'] },
      { unique: true, fields: ['organization_id', 'user_id'] },
    ],
  }
);

export default OrganizationMember;