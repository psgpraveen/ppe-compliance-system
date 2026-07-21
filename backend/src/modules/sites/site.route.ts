import { Router } from 'express';
import { SiteController } from './site.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createSiteValidation, updateSiteValidation } from './site.validation';

const router = Router();
const siteController = new SiteController();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/options', siteController.getOptions);
router.get('/', siteController.getAll);
router.get('/:id', siteController.getById);
router.post('/', ...createSiteValidation, siteController.create);
router.put('/:id', ...updateSiteValidation, siteController.update);
router.delete('/:id', siteController.delete);

export default router;
