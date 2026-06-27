import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import Task, { TaskStatus } from '../task.model';

export class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(Task);
  }

  async findByPublicId(publicId: string): Promise<Task | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.findAll({
      where: { projectId } as WhereOptions,
      order: [['order', 'ASC']],
    });
  }

  async findByAssignee(assigneeId: number): Promise<Task[]> {
    return this.findAll({
      where: { assigneeId } as WhereOptions,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStatus(projectId: number, status: TaskStatus): Promise<Task[]> {
    return this.findAll({
      where: { projectId, status } as WhereOptions,
      order: [['order', 'ASC']],
    });
  }

  async createTask(data: any): Promise<Task> {
    return this.create(data);
  }

  async getMaxOrder(projectId: number): Promise<number> {
    const task = await Task.findOne({
      where: { projectId } as WhereOptions,
      order: [['order', 'DESC']],
    });
    return task ? task.order + 1 : 0;
  }
}

export default new TaskRepository();