import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  console.log('🌱 Seeding database...');
  try {
    // Run seed SQL (categories + questions)
    const seedPath = path.join(__dirname, '..', '..', '..', 'database', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');
    await pool.query(seedSQL);
    console.log('✅ Categories and questions seeded');

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin', 'admin@brainarena.com', adminPassword, 'admin']
    );
    console.log('✅ Default admin user created (admin@brainarena.com / admin123)');

    // Count results
    const catCount = await pool.query('SELECT COUNT(*)::int FROM categories');
    const qCount = await pool.query('SELECT COUNT(*)::int FROM questions');
    console.log(`\n📊 Database now has:`);
    console.log(`   ${catCount.rows[0].count} categories`);
    console.log(`   ${qCount.rows[0].count} questions`);
    console.log(`\n⚠️  Change the admin password in production!`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
