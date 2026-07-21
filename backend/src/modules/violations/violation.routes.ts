import { Router } from 'express';
import { ViolationController } from './violation.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { iotReportValidation } from './violation.validation';

const router = Router();
const violationController = new ViolationController();

// IoT Webhook: Public/Internal endpoint (should ideally be protected by a static API Key in production)
router.post(
  '/iot-report',
  ...iotReportValidation,
  violationController.createFromIoT
);

// Protected routes
router.use(authenticate);

// Get paginated violations (ADMIN, SUPERVISOR)
router.get('/', authorize(['ADMIN', 'SUPERVISOR']), violationController.getAll);

// Action endpoints
router.put('/:id/acknowledge', authorize(['ADMIN', 'SUPERVISOR']), violationController.acknowledge);
router.put('/:id/resolve', authorize(['ADMIN', 'SUPERVISOR']), violationController.resolve);

export default router;
