import { Router } from 'express';
import { SupervisorController } from './supervisor.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createSupervisorValidation, updateSupervisorValidation } from './supervisor.validation';

const router = Router();
const supervisorController = new SupervisorController();

router.use(authenticate);
router.get('/options', supervisorController.getOptions);
router.use(authorize(['ADMIN'])); // Only ADMIN can manage supervisors
router.get('/', supervisorController.getAll);
router.get('/:id', supervisorController.getById);
router.post('/', ...createSupervisorValidation, supervisorController.create);
router.put('/:id', ...updateSupervisorValidation, supervisorController.update);
router.delete('/:id', supervisorController.delete);

export default router;
