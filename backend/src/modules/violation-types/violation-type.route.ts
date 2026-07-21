import { Router } from 'express';
import { ViolationTypeController } from './violation-type.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createViolationTypeValidation, updateViolationTypeValidation } from './violation-type.validation';

const router = Router();
const controller = new ViolationTypeController();

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/options', controller.getAllOptions);
router.get('/:id', controller.getById);

// Only ADMIN can manage violation types
router.post('/', authorize(['ADMIN']), ...createViolationTypeValidation, controller.create);
router.put('/:id', authorize(['ADMIN']), ...updateViolationTypeValidation, controller.update);
router.delete('/:id', authorize(['ADMIN']), controller.delete);

export default router;
