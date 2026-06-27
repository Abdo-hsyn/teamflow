import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import Organization from '../organization.model';
import OrganizationMember, { MemberRole, MemberStatus } from '../organization-member.model';
import User from '../../user/user.model';

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    super(Organization);
  }

  async findByPublicId(publicId: string): Promise<Organization | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.findOne({ slug } as WhereOptions);
  }

  async findUserOrganizations(userId: number): Promise<Organization[]> {
  return Organization.findAll({
    include: [
      {
        model: OrganizationMember,
        as: 'members',
        where: { userId, status: MemberStatus.ACTIVE },
        attributes: ['role', 'joinedAt'],
      },
    ],
  });
}

  async createOrganization(data: any): Promise<Organization> {
    return this.create(data);
  }

  async addMember(
    organizationId: number,
    userId: number,
    role: MemberRole,
    status: MemberStatus
  ): Promise<OrganizationMember> {
    return OrganizationMember.create({
      organizationId,
      userId,
      role,
      status,
      joinedAt: status === MemberStatus.ACTIVE ? new Date() : null,
    });
  }

  async findMember(
    organizationId: number,
    userId: number
  ): Promise<OrganizationMember | null> {
    return OrganizationMember.findOne({
      where: { organizationId, userId } as WhereOptions,
    });
  }

  async findMembers(organizationId: number): Promise<OrganizationMember[]> {
    return OrganizationMember.findAll({
      where: { organizationId } as WhereOptions,
      include: [
        {
          model: User,
          attributes: ['publicId', 'firstName', 'lastName', 'email', 'avatar'],
        },
      ],
    });
  }

  async slugExists(slug: string): Promise<boolean> {
    return this.exists({ slug } as WhereOptions);
  }
}

export default new OrganizationRepository();