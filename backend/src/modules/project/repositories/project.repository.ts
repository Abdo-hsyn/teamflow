import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import Project from '../project.model';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(Project);
  }

  async findByPublicId(publicId: string): Promise<Project | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findByWorkspace(workspaceId: number): Promise<Project[]> {
    return this.findAll({
      where: { workspaceId } as WhereOptions,
    });
  }

  async findByOrganization(organizationId: number): Promise<Project[]> {
    return this.findAll({
      where: { organizationId } as WhereOptions,
    });
  }

  async createProject(data: any): Promise<Project> {
    return this.create(data);
  }
}

export default new ProjectRepository();