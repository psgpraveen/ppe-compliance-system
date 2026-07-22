import fs from 'fs';
import path from 'path';
import { dbPool } from '../shared/database/db';

async function runMigration() {
  console.log('🚀 Connecting to Supabase Cloud Database...');
  
  try {
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    const migrationV1Path = path.resolve(__dirname, '../../../database/migration_v1.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('📦 Creating database schema & tables...');
    await dbPool.query(schemaSql);
    console.log('✅ Schema created successfully!');

    if (fs.existsSync(migrationV1Path)) {
      const migrationV1Sql = fs.readFileSync(migrationV1Path, 'utf8');
      console.log('🔄 Running migration v1 (job_profile, mobile_number, etc)...');
      await dbPool.query(migrationV1Sql).catch(err => {
        console.log('ℹ️ Migration notice:', err.message);
      });
    }

    console.log('🌱 Seeding initial admin user & site data...');
    await dbPool.query(seedSql);
    console.log('✅ Database seeded successfully!');

    console.log('🎉 Supabase Database setup complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await dbPool.end();
    process.exit(0);
  }
}

runMigration();
