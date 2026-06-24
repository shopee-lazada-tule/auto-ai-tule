import { checkDatabaseHealth, sanitizeDatabaseMessage } from '../lib/db';

async function main() {
  const status = await checkDatabaseHealth();

  console.log(`appName: ${status.appName}`);
  console.log(`databaseMode: ${status.databaseMode}`);
  console.log(`databaseConfigured: ${status.databaseConfigured}`);
  console.log(`databaseReachable: ${status.databaseReachable}`);
  console.log(`buildReady: ${status.buildReady}`);
  console.log(`message: ${status.message}`);

  if (!status.databaseConfigured) {
    console.log('MEMORY fallback: DATABASE_URL is empty. Set DATABASE_URL for Neon PostgreSQL.');
    process.exit(0);
  }

  if (!status.databaseReachable) {
    console.error('Database check failed. Confirm DATABASE_URL, network access, and Neon database status.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error(sanitizeDatabaseMessage(error));
  process.exit(1);
});
