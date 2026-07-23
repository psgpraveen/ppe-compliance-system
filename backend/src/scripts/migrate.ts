import fs from 'fs';
import path from 'path';
import { dbPool } from '../shared/database/db';

async function runMigration() {
  console.log('🚀 Starting Automated Database Migration...');
  const client = await dbPool.connect();
  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const seedPath = path.join(__dirname, '../../../database/seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('📄 Executing database/schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✅ Schema created successfully!');
    } else {
      console.warn('⚠️ schema.sql not found at:', schemaPath);
    }

    if (fs.existsSync(seedPath)) {
      console.log('🌱 Executing database/seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
      console.log('✅ Seed data inserted successfully!');
    } else {
      console.warn('⚠️ seed.sql not found at:', seedPath);
    }

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await dbPool.end();
  }
}

runMigration();
