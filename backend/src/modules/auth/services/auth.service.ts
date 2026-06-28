import { randomUUID } from 'crypto';
import userRepository from '../../user/repositories/user.repository';
import { hashPassword, comparePassword, generateRandomToken } from '../../../shared/helpers/password.helper';
import { generateAccessToken, generateRefreshToken } from '../../../shared/helpers/jwt.helper';
import { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, AuthResponseDTO, AuthTokensDTO } from '../dto/auth.dto';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../../shared/errors/AppError';
import emailService from '../../../shared/services/email.service';

class AuthService {

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Generate email verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await userRepository.createUser({
      publicId: randomUUID(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    await emailService.sendVerificationEmail(
  user.email,
  user.firstName,
  emailVerificationToken
);

    return {
      user: {
        publicId: user.publicId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    // Compare password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: {
        publicId: user.publicId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await userRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw new BadRequestError('Verification token has expired');
    }

    await userRepository.markEmailAsVerified(user.id);
  }

  async forgotPassword(data: ForgotPasswordDTO): Promise<void> {
    const user = await userRepository.findByEmail(data.email.toLowerCase().trim());
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await userRepository.updateByEmail(data.email, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    await emailService.sendPasswordResetEmail(
  user.email,
  user.firstName,
  resetToken
);
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const user = await userRepository.findByResetToken(data.token);
    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new BadRequestError('Reset token has expired');
    }

    const hashedPassword = await hashPassword(data.password);

    await userRepository.updateByEmail(user.email, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  private generateTokens(user: any): AuthTokensDTO {
    const payload = {
      userId: user.id,
      publicId: user.publicId,
      email: user.email,
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken({ ...payload, tokenVersion: 1 }),
    };
  }
}

export default new AuthService();