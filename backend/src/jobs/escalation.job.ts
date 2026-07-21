import cron from 'node-cron';
import { SettingsRepository } from '../modules/settings/settings.repository';
import { ViolationRepository } from '../modules/violations/violation.repository';
import { AuthRepository } from '../modules/auth/auth.repository';
import { emailService } from '../shared/services/email.service';

const settingsRepository = new SettingsRepository();
const violationRepository = new ViolationRepository();
const authRepository = new AuthRepository();

export const startEscalationJob = () => {
  // Run every 1 minute
  cron.schedule('* * * * *', async () => {
    try {
      // 1. Fetch current settings to get the timeout interval
      const settingsRows = await settingsRepository.getAll();
      const settingsMap: Record<string, string> = {};
      settingsRows.forEach(row => {
        settingsMap[row.setting_key] = row.setting_value;
      });

      // Default to 30 minutes if for some reason it is missing
      const timeoutMinutes = parseInt(settingsMap['escalation_time_minutes']) || 30;

      // 2. Escalate violations in the database that are overdue
      const escalatedViolations = await violationRepository.escalateOverdueViolations(timeoutMinutes);

      // 3. Notify Admin if any were escalated
      if (escalatedViolations.length > 0) {
        const notifyAdmin = settingsMap['admin_escalation_notification'] !== 'false'; // Default to true if not set
        console.log(`[ESCALATION ENGINE] Escalated ${escalatedViolations.length} violations that exceeded the ${timeoutMinutes}-minute timeout!`);
        
        if (notifyAdmin) {
          // Fetch admins
          const admins = await authRepository.getAdmins();
          const adminEmails = admins.map(a => a.email).filter(Boolean);

          if (adminEmails.length > 0) {
            for (const v of escalatedViolations) {
              console.log(`[NOTIFICATION TO ADMIN] Violation ID: ${v.id} for Employee: ${v.employee_id} has been escalated.`);
              
              const subject = `Violation Escalated: Employee ${v.employee_id}`;
              const text = `A violation (ID: ${v.id}) for employee ${v.employee_id} has exceeded the ${timeoutMinutes}-minute timeout and has been escalated to you.\n\nPlease log in to the dashboard to review it.`;
              
              // Send email asynchronously without blocking the loop
              emailService.sendEmail(adminEmails, subject, text).catch(err => {
                console.error(`Failed to send email for violation ${v.id}`, err);
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('[ESCALATION ENGINE] Error running escalation job:', error);
    }
  });

  console.log('[ESCALATION ENGINE] Background cron job initialized.');
};
