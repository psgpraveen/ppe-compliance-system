import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV ?? "development",

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:psgpraveen@798@db.ffwtjzmfaevtrnleufni.supabase.co:5432/postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'postgres',

  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "24h",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_for_dev',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  SMTP_HOST: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER || 'mailtrap_user',
  SMTP_PASS: process.env.SMTP_PASS || 'mailtrap_pass',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@psgpraveen.com',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};