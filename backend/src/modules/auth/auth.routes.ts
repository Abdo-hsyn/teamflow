import { Router } from 'express';
import authController from './controllers/auth.controller';

const router = Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register.bind(authController));

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login.bind(authController));

// @route   GET /api/v1/auth/verify-email/:token
// @desc    Verify email
// @access  Public
router.get('/verify-email/:token', authController.verifyEmail.bind(authController));

// @route   POST /api/v1/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;