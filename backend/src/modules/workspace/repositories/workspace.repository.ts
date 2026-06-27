import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import Workspace from '../workspace.model';

export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor() {
    super(Workspace);
  }

  async findByPublicId(publicId: string): Promise<Workspace | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findByOrganization(organizationId: number): Promise<Workspace[]> {
    return this.findAll({
      where: { organizationId, isActive: true } as WhereOptions,
    });
  }

  async createWorkspace(data: any): Promise<Workspace> {
    return this.create(data);
  }
}

export default new WorkspaceRepository();