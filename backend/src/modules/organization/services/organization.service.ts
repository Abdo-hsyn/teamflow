import { randomUUID } from 'crypto';
import organizationRepository from '../repositories/organization.repository';
import { CreateOrganizationDTO, UpdateOrganizationDTO, OrganizationResponseDTO } from '../dto/organization.dto';
import { MemberRole, MemberStatus } from '../organization-member.model';
import { NotFoundError, ConflictError, ForbiddenError } from '../../../shared/errors/AppError';

class OrganizationService {

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private formatOrganization(org: any): OrganizationResponseDTO {
    return {
      publicId: org.publicId,
      name: org.name,
      slug: org.slug,
      description: org.description,
      logo: org.logo,
      website: org.website,
      isActive: org.isActive,
      createdAt: org.createdAt,
    };
  }

  async createOrganization(
    userId: number,
    data: CreateOrganizationDTO
  ): Promise<OrganizationResponseDTO> {
    // Generate slug
    let slug = this.generateSlug(data.name);

    // Check if slug exists and make it unique
    const slugExists = await organizationRepository.slugExists(slug);
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create organization
    const organization = await organizationRepository.createOrganization({
      publicId: randomUUID(),
      name: data.name.trim(),
      slug,
      description: data.description || null,
      website: data.website || null,
      ownerId: userId,
      isActive: true,
    });

    // Add creator as Owner
    await organizationRepository.addMember(
      organization.id,
      userId,
      MemberRole.OWNER,
      MemberStatus.ACTIVE
    );

    return this.formatOrganization(organization);
  }

  async getUserOrganizations(userId: number): Promise<OrganizationResponseDTO[]> {
    const organizations = await organizationRepository.findUserOrganizations(userId);
    return organizations.map(org => this.formatOrganization(org));
  }

  async getOrganizationByPublicId(
    publicId: string,
    userId: number
  ): Promise<OrganizationResponseDTO> {
    const organization = await organizationRepository.findByPublicId(publicId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is member
    const member = await organizationRepository.findMember(organization.id, userId);
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    return this.formatOrganization(organization);
  }

  async updateOrganization(
    publicId: string,
    userId: number,
    data: UpdateOrganizationDTO
  ): Promise<OrganizationResponseDTO> {
    const organization = await organizationRepository.findByPublicId(publicId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is owner or admin
    const member = await organizationRepository.findMember(organization.id, userId);
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to update this organization');
    }

    await organization.update(data);

    return this.formatOrganization(organization);
  }

  async deleteOrganization(publicId: string, userId: number): Promise<void> {
    const organization = await organizationRepository.findByPublicId(publicId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Only owner can delete
    if (organization.ownerId !== userId) {
      throw new ForbiddenError('Only the owner can delete this organization');
    }

    await organization.destroy();
  }

  async getMembers(publicId: string, userId: number): Promise<any[]> {
    const organization = await organizationRepository.findByPublicId(publicId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is member
    const member = await organizationRepository.findMember(organization.id, userId);
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    return organizationRepository.findMembers(organization.id);
  }
}

export default new OrganizationService();