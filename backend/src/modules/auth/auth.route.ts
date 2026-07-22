import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { loginValidation, updateProfileValidation, refreshValidation, changePasswordValidation, forgotPasswordValidation, resetPasswordValidation } from './auth.validation';
import { loginRateLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', loginRateLimiter, ...loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', ...refreshValidation, authController.refresh);

router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, ...updateProfileValidation, authController.updateProfile);
router.put('/change-password', authenticate, ...changePasswordValidation, authController.changePassword);

router.post('/forgot-password', ...forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', ...resetPasswordValidation, authController.resetPassword);

export default router;
