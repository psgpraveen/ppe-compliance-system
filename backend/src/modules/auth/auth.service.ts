import { AuthRepository } from './auth.repository';
import { AppError } from '../../shared/errors/AppError';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import { generateTokens, verifyRefreshToken } from '../../shared/utils/jwt';
import { AuthResponse } from './auth.types';
import { emailService } from '../../shared/services/email.service';
import * as jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export class AuthService {
  private authRepository = new AuthRepository();

  async register(firstName: string, lastName: string, email: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.authRepository.getUserByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered.', 400);
    }

    const hashed = await hashPassword(password);
    const user = await this.authRepository.createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: hashed,
      role: 'ADMIN'
    });

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role
    });

    await this.authRepository.updateLastLogin(user.id);

    // Send welcome email
    const subject = 'Welcome to PPE Compliance System';
    const text = `Hello ${firstName},\n\nYour Admin account has been successfully registered.\n\nYou can log in using this email address to manage the PPE Compliance System.`;
    emailService.sendEmail(email, subject, text).catch(err => {
      console.error(`Failed to send welcome email to admin ${email}`, err);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.authRepository.getUserByEmail(email);
    
    if (!user || !user.is_active) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role
    });

    await this.authRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = verifyRefreshToken(token);
      
      const user = await this.authRepository.getUserById(payload.userId);
      if (!user || !user.is_active) {
        throw new AppError('User not found or inactive.', 401);
      }

      const tokens = generateTokens({
        userId: user.id,
        role: user.role
      });

      return tokens;
    } catch (err) {
      throw new AppError('Invalid or expired refresh token.', 401);
    }
  }

  async getMe(userId: string) {
    const user = await this.authRepository.getUserById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      departmentName: user.department_name || (user.role === 'ADMIN' ? 'System Operations (All)' : 'Unassigned Department'),
      siteName: user.site_name || (user.role === 'ADMIN' ? 'All Construction Sites' : 'Unassigned Site'),
      siteLocation: user.site_location || null,
    };
  }

  async updateProfile(userId: string, firstName: string, lastName: string, email: string) {
    const existing = await this.authRepository.getUserByEmail(email);
    if (existing && existing.id !== userId) {
      throw new AppError('Email is already in use by another account.', 400);
    }
    const user = await this.authRepository.updateProfile(userId, firstName, lastName, email);
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.authRepository.getUserById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isMatch = await comparePassword(oldPass, user.password_hash);
    if (!isMatch) {
      throw new AppError('Old password is incorrect.', 400);
    }

    const hashed = await hashPassword(newPass);
    await this.authRepository.updatePassword(userId, hashed);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user || !user.is_active) {
      // Do not reveal if user exists or not
      return;
    }

    // Create a composite secret so the token is invalidated after password change
    const secret = env.JWT_SECRET + user.password_hash;
    const token = jwt.sign({ userId: user.id, purpose: 'reset' }, secret, { expiresIn: '15m' });

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const subject = 'Password Reset Request';
    const text = `Hello ${user.first_name},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetLink}\n\nThis link will expire in 15 minutes.\nIf you did not request this, please ignore this email.`;

    try {
      await emailService.sendEmail(email, subject, text);
    } catch (err) {
      console.error(`Failed to send password reset email to ${email}. Check your SMTP credentials in .env.`);
      // For local development, log the reset link if email fails
      console.log(`[DEV] Password Reset Link: ${resetLink}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // 1. Decode token to get userId (without verifying signature yet)
    const decoded = jwt.decode(token) as { userId: string, purpose: string } | null;
    if (!decoded || !decoded.userId || decoded.purpose !== 'reset') {
      throw new AppError('Invalid or malformed reset token.', 400);
    }

    // 2. Fetch user
    const user = await this.authRepository.getUserById(decoded.userId);
    if (!user || !user.is_active) {
      throw new AppError('User not found or inactive.', 400);
    }

    // 3. Verify signature using the composite secret
    const secret = env.JWT_SECRET + user.password_hash;
    try {
      jwt.verify(token, secret);
    } catch (error) {
      throw new AppError('Invalid or expired reset token.', 400);
    }

    // 4. Update password
    const hashed = await hashPassword(newPassword);
    await this.authRepository.updatePassword(user.id, hashed);
  }
}
