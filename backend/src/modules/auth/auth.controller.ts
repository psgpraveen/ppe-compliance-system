import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const data = await this.authService.register(firstName, lastName, email, password);
      return ApiResponse.success(res, 'Registration successful', data, 201);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      return ApiResponse.success(res, 'Login successful', data);
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // With JWT, logout is usually handled client-side by deleting the token.
      // Or server-side by blacklisting (which requires a DB/Redis). 
      // We will just send a success message.
      return ApiResponse.success(res, 'Logout successful');
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const data = await this.authService.refresh(refreshToken);
      return ApiResponse.success(res, 'Token refreshed', data);
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.authService.getMe(userId);
      return ApiResponse.success(res, 'User profile retrieved', data);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { firstName, lastName, email } = req.body;
      const data = await this.authService.updateProfile(userId, firstName, lastName, email);
      return ApiResponse.success(res, 'Profile updated successfully', data);
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { oldPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, oldPassword, newPassword);
      return ApiResponse.success(res, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      return ApiResponse.success(res, 'If your email is registered, a reset link has been sent.');
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      return ApiResponse.success(res, 'Password has been successfully reset. You can now log in.');
    } catch (err) {
      next(err);
    }
  };
}
