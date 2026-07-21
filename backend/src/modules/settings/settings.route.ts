import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const settingsController = new SettingsController();

// Only ADMIN should be able to view and modify global settings
router.use(authenticate, authorize(['ADMIN']));

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
