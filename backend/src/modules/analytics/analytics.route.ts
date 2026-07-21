import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/auth.middleware';
import { AnalyticsController } from './analytics.controller';

const router = Router();
const controller = new AnalyticsController();

router.get('/', authenticate, authorize(['ADMIN', 'SUPERVISOR']), controller.getAnalytics);

export default router;
