import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../validations/auth.validation';
import { successResponse, errorResponse } from '../../../shared/response/apiResponse';
import { ValidationError } from '../../../shared/errors/AppError';

class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const result = await authService.register(req.body);

      res.status(201).json(
        successResponse('Registration successful. Please verify your email.', result)
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      const result = await authService.login(req.body);

      res.status(200).json(
        successResponse('Login successful', result)
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token as string;

      await authService.verifyEmail(token);

      res.status(200).json(
        successResponse('Email verified successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateForgotPassword(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      await authService.forgotPassword(req.body);

      res.status(200).json(
        successResponse('If your email exists, you will receive a reset link shortly')
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateResetPassword(req.body);
      if (!validation.isValid) {
        res.status(422).json(errorResponse('Validation failed', validation.errors));
        return;
      }

      await authService.resetPassword(req.body);

      res.status(200).json(
        successResponse('Password reset successful')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();