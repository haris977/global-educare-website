import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('Starting IELTS schema migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../prisma/migrations/ielts_test_schema_update.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(`${statement};`);
      console.log(`Executed: ${statement.slice(0, 40)}...`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration(); 