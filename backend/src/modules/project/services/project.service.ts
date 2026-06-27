import { randomUUID } from 'crypto';
import projectRepository from '../repositories/project.repository';
import organizationRepository from '../../organization/repositories/organization.repository';
import workspaceRepository from '../../workspace/repositories/workspace.repository';
import { CreateProjectDTO, UpdateProjectDTO, ProjectResponseDTO } from '../dto/project.dto';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/AppError';
import { MemberRole } from '../../organization/organization-member.model';

class ProjectService {

  private formatProject(project: any): ProjectResponseDTO {
    return {
      publicId: project.publicId,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
    };
  }

  async createProject(
    userId: number,
    data: CreateProjectDTO
  ): Promise<ProjectResponseDTO> {
    const organization = await organizationRepository.findByPublicId(
      data.organizationPublicId
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

    if (![MemberRole.OWNER, MemberRole.ADMIN, MemberRole.PROJECT_MANAGER].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to create a project');
    }

    const workspace = await workspaceRepository.findByPublicId(
      data.workspacePublicId
    );
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const project = await projectRepository.createProject({
      publicId: randomUUID(),
      name: data.name.trim(),
      description: data.description || null,
      workspaceId: workspace.id,
      organizationId: organization.id,
      createdBy: userId,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    });

    return this.formatProject(project);
  }

  async getProjects(
    userId: number,
    workspacePublicId: string
  ): Promise<ProjectResponseDTO[]> {
    const workspace = await workspaceRepository.findByPublicId(workspacePublicId);
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

    const projects = await projectRepository.findByWorkspace(workspace.id);
    return projects.map(p => this.formatProject(p));
  }

  async getProject(
    publicId: string,
    userId: number
  ): Promise<ProjectResponseDTO> {
    const project = await projectRepository.findByPublicId(publicId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const member = await organizationRepository.findMember(
      project.organizationId,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    return this.formatProject(project);
  }

  async updateProject(
    publicId: string,
    userId: number,
    data: UpdateProjectDTO
  ): Promise<ProjectResponseDTO> {
    const project = await projectRepository.findByPublicId(publicId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const member = await organizationRepository.findMember(
      project.organizationId,
      userId
    );
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN, MemberRole.PROJECT_MANAGER].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to update this project');
    }

    await project.update(data);
    return this.formatProject(project);
  }

  async deleteProject(publicId: string, userId: number): Promise<void> {
    const project = await projectRepository.findByPublicId(publicId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const member = await organizationRepository.findMember(
      project.organizationId,
      userId
    );
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to delete this project');
    }

    await project.destroy();
  }
}

export default new ProjectService();