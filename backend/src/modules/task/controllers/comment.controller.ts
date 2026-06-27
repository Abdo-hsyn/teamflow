import { Response, NextFunction } from 'express';
import commentService from '../services/comment.service';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { AuthRequest } from '../../../middleware/authenticate';

class CommentController {

  async addComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskPublicId = req.params.taskPublicId as string;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        res.status(422).json(errorResponse('Comment content is required'));
        return;
      }

      if (content.length > 2000) {
        res.status(422).json(errorResponse('Comment must not exceed 2000 characters'));
        return;
      }

      const comment = await commentService.addComment(
        req.user!.userId,
        taskPublicId,
        content
      );

      res.status(201).json(
        successResponse('Comment added successfully', comment)
      );
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskPublicId = req.params.taskPublicId as string;

      const comments = await commentService.getComments(
        req.user!.userId,
        taskPublicId
      );

      res.status(200).json(
        successResponse('Comments fetched successfully', comments)
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      await commentService.deleteComment(req.user!.userId, publicId);

      res.status(200).json(
        successResponse('Comment deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();