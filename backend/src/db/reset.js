import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function reset() {
  console.log('⚠️  Resetting database — all data will be lost...');
  try {
    await pool.query(`
      DROP TABLE IF EXISTS quiz_answers CASCADE;
      DROP TABLE IF EXISTS quiz_attempts CASCADE;
      DROP TABLE IF EXISTS questions CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at CASCADE;
    `);
    console.log('✅ All tables dropped. Run npm run db:migrate and npm run db:seed to recreate.');
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

reset();
