import { randomUUID } from 'crypto';
import commentRepository from '../repositories/comment.repository';
import taskRepository from '../repositories/task.repository';
import organizationRepository from '../../organization/repositories/organization.repository';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/AppError';

class CommentService {

  async addComment(
    userId: number,
    taskPublicId: string,
    content: string
  ): Promise<any> {
    const task = await taskRepository.findByPublicId(taskPublicId);
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

    const comment = await commentRepository.createComment({
      publicId: randomUUID(),
      content: content.trim(),
      taskId: task.id,
      userId,
    });

    return {
      publicId: comment.publicId,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }

  async getComments(userId: number, taskPublicId: string): Promise<any[]> {
    const task = await taskRepository.findByPublicId(taskPublicId);
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

    return commentRepository.findByTask(task.id);
  }

  async deleteComment(
    userId: number,
    commentPublicId: string
  ): Promise<void> {
    const comment = await commentRepository.findByPublicId(commentPublicId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('You can only delete your own comments');
    }

    await comment.destroy();
  }
}

export default new CommentService();