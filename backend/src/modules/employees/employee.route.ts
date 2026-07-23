import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createEmployeeValidation, updateEmployeeValidation, bulkImportValidation } from './employee.validation';

const router = Router();
const employeeController = new EmployeeController();

router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPERVISOR']));

router.get('/', employeeController.getAll);
router.get('/roles', employeeController.getRoles);
router.get('/:id', employeeController.getById);
router.post('/bulk-import', authorize(['ADMIN']), ...bulkImportValidation, employeeController.bulkImport);
router.post('/', authorize(['ADMIN', 'SUPERVISOR']), ...createEmployeeValidation, employeeController.create);
router.put('/:id', authorize(['ADMIN', 'SUPERVISOR']), ...updateEmployeeValidation, employeeController.update);
router.delete('/:id', authorize(['ADMIN', 'SUPERVISOR']), employeeController.delete);

export default router;
