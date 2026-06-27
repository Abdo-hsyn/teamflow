import User from '../modules/user/user.model';
import Organization from '../modules/organization/organization.model';
import OrganizationMember from '../modules/organization/organization-member.model';
import Comment from '../modules/task/comment.model';
import Task from '../modules/task/task.model';

export const defineAssociations = (): void => {
  // Organization <-> User (Owner)
  Organization.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
  });

  // Organization <-> OrganizationMember
  Organization.hasMany(OrganizationMember, {
    foreignKey: 'organizationId',
    as: 'members',
  });

  OrganizationMember.belongsTo(Organization, {
    foreignKey: 'organizationId',
    as: 'organization',
  });

  // OrganizationMember <-> User
  OrganizationMember.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  User.hasMany(OrganizationMember, {
    foreignKey: 'userId',
    as: 'organizationMemberships',
  });

  // Comment Associations
  Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
  Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
};