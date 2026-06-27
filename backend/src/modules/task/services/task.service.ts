import { randomUUID } from 'crypto';
import taskRepository from '../repositories/task.repository';
import projectRepository from '../../project/repositories/project.repository';
import organizationRepository from '../../organization/repositories/organization.repository';
import userRepository from '../../user/repositories/user.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from '../dto/task.dto';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/AppError';
import { MemberRole } from '../../organization/organization-member.model';
import { TaskPriority } from '../task.model';

class TaskService {

  private formatTask(task: any): TaskResponseDTO {
    return {
      publicId: task.publicId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      order: task.order,
      createdAt: task.createdAt,
    };
  }

  async createTask(
    userId: number,
    data: CreateTaskDTO
  ): Promise<TaskResponseDTO> {
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

    const project = await projectRepository.findByPublicId(
      data.projectPublicId
    );
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Get assignee if provided
    let assigneeId: number | null = null;
    if (data.assigneePublicId) {
      const assignee = await userRepository.findByPublicId(data.assigneePublicId);
      if (!assignee) {
        throw new NotFoundError('Assignee not found');
      }
      assigneeId = assignee.id;
    }

    // Get max order
    const order = await taskRepository.getMaxOrder(project.id);

    const task = await taskRepository.createTask({
      publicId: randomUUID(),
      title: data.title.trim(),
      description: data.description || null,
      priority: data.priority || TaskPriority.MEDIUM,
      projectId: project.id,
      organizationId: organization.id,
      assigneeId,
      createdBy: userId,
      dueDate: data.dueDate || null,
      estimatedHours: data.estimatedHours || null,
      order,
    });

    return this.formatTask(task);
  }

  async getTasks(
    userId: number,
    projectPublicId: string
  ): Promise<TaskResponseDTO[]> {
    const project = await projectRepository.findByPublicId(projectPublicId);
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

    const tasks = await taskRepository.findByProject(project.id);
    return tasks.map(t => this.formatTask(t));
  }

  async getTask(publicId: string, userId: number): Promise<TaskResponseDTO> {
    const task = await taskRepository.findByPublicId(publicId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const member = await organizationRepository.findMember(
      task.organizationId,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    return this.formatTask(task);
  }

  async updateTask(
    publicId: string,
    userId: number,
    data: UpdateTaskDTO
  ): Promise<TaskResponseDTO> {
    const task = await taskRepository.findByPublicId(publicId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const member = await organizationRepository.findMember(
      task.organizationId,
      userId
    );
    if (!member) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    // Get assignee if provided
    let assigneeId: number | null | undefined = undefined;
    if (data.assigneePublicId) {
      const assignee = await userRepository.findByPublicId(data.assigneePublicId);
      if (!assignee) {
        throw new NotFoundError('Assignee not found');
      }
      assigneeId = assignee.id;
    }

    await task.update({
      ...data,
      ...(assigneeId !== undefined && { assigneeId }),
    });

    return this.formatTask(task);
  }

  async deleteTask(publicId: string, userId: number): Promise<void> {
    const task = await taskRepository.findByPublicId(publicId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const member = await organizationRepository.findMember(
      task.organizationId,
      userId
    );
    if (!member || ![MemberRole.OWNER, MemberRole.ADMIN, MemberRole.PROJECT_MANAGER].includes(member.role)) {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    await task.destroy();
  }

  async getMyTasks(userId: number): Promise<TaskResponseDTO[]> {
    const tasks = await taskRepository.findByAssignee(userId);
    return tasks.map(t => this.formatTask(t));
  }
}

export default new TaskService();