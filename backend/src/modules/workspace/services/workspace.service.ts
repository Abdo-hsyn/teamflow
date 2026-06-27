import { randomUUID } from 'crypto';
import workspaceRepository from '../repositories/workspace.repository';
import organizationRepository from '../../organization/repositories/organization.repository';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO, WorkspaceResponseDTO } from '../dto/workspace.dto';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/AppError';
import { MemberRole } from '../../organization/organization-member.model';

class WorkspaceService {

  private formatWorkspace(workspace: any): WorkspaceResponseDTO {
    return {
      publicId: workspace.publicId,
      name: workspace.name,
      description: workspace.description,
      isActive: workspace.isActive,
      createdAt: workspace.createdAt,
    };
  }

  async createWorkspace(
    userId: number,
    data: CreateWorkspaceDTO
  ): Promise<WorkspaceResponseDTO> {
    // Find organization
    const organization = await organizationRepository.findByPublicId(
      data.organizationPublicId
    );
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is member and has permission
    const member = await organizationRepository.findMember(
      organization.id,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    if (![MemberRole.OWNER, MemberRole.ADMIN, MemberRole.PROJECT_MANAGER].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to create a workspace');
    }

    // Create workspace
    const workspace = await workspaceRepository.createWorkspace({
      publicId: randomUUID(),
      name: data.name.trim(),
      description: data.description || null,
      organizationId: organization.id,
      createdBy: userId,
    });

    return this.formatWorkspace(workspace);
  }

  async getWorkspaces(
    userId: number,
    organizationPublicId: string
  ): Promise<WorkspaceResponseDTO[]> {
    const organization = await organizationRepository.findByPublicId(
      organizationPublicId
    );
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const member = await organizationRepository.findMember(
      organization.id,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    const workspaces = await workspaceRepository.findByOrganization(
      organization.id
    );

    return workspaces.map(w => this.formatWorkspace(w));
  }

  async getWorkspace(
    publicId: string,
    userId: number
  ): Promise<WorkspaceResponseDTO> {
    const workspace = await workspaceRepository.findByPublicId(publicId);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const member = await organizationRepository.findMember(
      workspace.organizationId,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    return this.formatWorkspace(workspace);
  }

  async updateWorkspace(
    publicId: string,
    userId: number,
    data: UpdateWorkspaceDTO
  ): Promise<WorkspaceResponseDTO> {
    const workspace = await workspaceRepository.findByPublicId(publicId);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const member = await organizationRepository.findMember(
      workspace.organizationId,
      userId
    );
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN, MemberRole.PROJECT_MANAGER].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to update this workspace');
    }

    await workspace.update(data);

    return this.formatWorkspace(workspace);
  }

  async deleteWorkspace(publicId: string, userId: number): Promise<void> {
    const workspace = await workspaceRepository.findByPublicId(publicId);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const member = await organizationRepository.findMember(
      workspace.organizationId,
      userId
    );
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to delete this workspace');
    }

    await workspace.destroy();
  }
}

export default new WorkspaceService();