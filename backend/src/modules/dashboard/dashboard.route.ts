import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { DashboardRepository } from './dashboard.repository';

const router = Router();
const dashboardRepository = new DashboardRepository();

router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const { role, userId } = req.user!;
    const stats = await dashboardRepository.getStats(role, userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

export default router;
