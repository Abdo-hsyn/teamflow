import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import Comment from '../comment.model';
import User from '../../user/user.model';

export class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(Comment);
  }

  async findByPublicId(publicId: string): Promise<Comment | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findByTask(taskId: number): Promise<Comment[]> {
    return Comment.findAll({
      where: { taskId } as WhereOptions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['publicId', 'firstName', 'lastName', 'avatar'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async createComment(data: any): Promise<Comment> {
    return this.create(data);
  }
}

export default new CommentRepository();