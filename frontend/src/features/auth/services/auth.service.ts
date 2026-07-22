import { api } from '@/services/api';
import { AuthResponse, User } from '../types';
import { LoginFormData, UpdateProfileFormData, ChangePasswordFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../validation';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const authService = {
  /**
   * Authenticates a user and stores their JWT token locally.
   * @param {LoginCredentials} credentials - Email and password payload
   * @returns {Promise<AuthResponse>} The authentication response containing user data and tokens
   */
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (res.data.data.accessToken) {
      localStorage.setItem('accessToken', res.data.data.accessToken);
    }
    return res.data.data;
  },

  /**
   * Invalidates the current session on the server and clears local tokens.
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('accessToken');
  },

  /**
   * Retrieves the profile data for the currently authenticated user.
   * @returns {Promise<User>} The current user object
   */
  async getMe(): Promise<User> {
    const res = await api.get(API_ENDPOINTS.AUTH.ME);
    return res.data.data;
  },

  /**
   * Updates the authenticated user's password.
   * @param {ChangePasswordData} data - Old and new password payload
   * @returns {Promise<void>}
   */
  async changePassword(data: ChangePasswordFormData): Promise<void> {
    await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  /**
   * Requests a password reset link to be sent to the user's email.
   * @param {ForgotPasswordFormData} data - Email payload
   */
  async forgotPassword(data: ForgotPasswordFormData): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  async updateProfile(data: UpdateProfileFormData): Promise<User> {
    const res = await api.put('/auth/profile', data);
    return res.data.data;
  },

  /**
   * Resets the user's password using the provided token.
   * @param {ResetPasswordFormData} data - Token and new password
   */
  async resetPassword(data: ResetPasswordFormData): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }
};
