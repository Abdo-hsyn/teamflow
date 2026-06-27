import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/authenticate';
import { successResponse } from '../../shared/response/apiResponse';
import { Response, NextFunction } from 'express';

const router = Router();

// @route   GET /api/v1/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(
      successResponse('Profile fetched successfully', {
        user: req.user,
      })
    );
  } catch (error) {
    next(error);
  }
});

export default router;