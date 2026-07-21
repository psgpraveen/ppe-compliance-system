import { Router } from 'express';
import { DepartmentController } from './department.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createDepartmentValidation, updateDepartmentValidation } from './department.validation';

const router = Router();
const departmentController = new DepartmentController();

router.use(authenticate);
router.use(authorize(['ADMIN'])); // Only ADMIN can manage departments

router.get('/options', departmentController.getOptions);
router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);
router.post('/', ...createDepartmentValidation, departmentController.create);
router.put('/:id', ...updateDepartmentValidation, departmentController.update);
router.delete('/:id', departmentController.delete);

export default router;
