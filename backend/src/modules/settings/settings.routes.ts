import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { authorize } from '../../shared/middlewares/role.middleware';

const router = Router();
const settingsController = new SettingsController();

// Only ADMIN should be able to view and modify global settings
router.use(authenticate, authorize(['ADMIN']));

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export const settingsRoutes = router;
