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

const app = express();

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

export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${env.PORT} is already in use by another process.`);
      console.error(`👉 Run in PowerShell to free port ${env.PORT}:`);
      console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${env.PORT}).OwningProcess -Force`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
}
