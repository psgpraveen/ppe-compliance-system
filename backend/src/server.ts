import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './shared/errors/errorHandler';
import authRoutes from './modules/auth/auth.route';
import departmentRoutes from './modules/departments/department.route';
import siteRoutes from './modules/sites/site.route';
import employeeRoutes from './modules/employees/employee.route';
import supervisorRoutes from './modules/supervisors/supervisor.route';
import violationTypeRoutes from './modules/violation-types/violation-type.route';
import settingsRoutes from './modules/settings/settings.route';
import violationRoutes from './modules/violations/violation.routes';
import dashboardRoutes from './modules/dashboard/dashboard.route';
import analyticsRoutes from './modules/analytics/analytics.route';
import { startEscalationJob } from './jobs/escalation.job';
import { query } from './shared/database/db';

const app = express();

// Auto-apply missing columns migration for employees
setTimeout(async () => {
  try {
    await query(`
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS job_profile VARCHAR(100);
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20);
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(20);
    `);
    console.log('[Auto-Migration] Employee columns verified/added.');
  } catch (err) {
    console.error('[Auto-Migration] Failed:', err);
  }
}, 1000);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/sites', siteRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/supervisors', supervisorRoutes);
app.use('/api/v1/violation-types', violationTypeRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/violations', violationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use(errorHandler);

// Start background workers
startEscalationJob();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
