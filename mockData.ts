import { PrismaClient } from '@prisma/client';
import { loadEnvLocal } from './server-env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const defaultAppName = 'Shopee・LAZADA出品支援ツール';
loadEnvLocal();

export type DatabaseHealth = {
  databaseMode: 'PRISMA' | 'MEMORY';
  databaseConfigured: boolean;
  databaseReachable: boolean;
  appName: string;
  buildReady: boolean;
  message: string;
};

export function getAppName() {
  return process.env.NEXT_PUBLIC_APP_NAME || defaultAppName;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma() {
  if (!hasDatabaseUrl()) return null;
  const prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  return prisma;
}

function extractPostgresHost(value: string | undefined) {
  if (!value) return null;
  const match = value.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.*@([^/:?]+)/) ?? value.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/([^/:?]+)/);
  return match?.[1] ?? null;
}

export function sanitizeDatabaseMessage(value: unknown) {
  let message = value instanceof Error ? value.message : String(value ?? 'Prisma database connection failed.');
  for (const raw of [process.env.DATABASE_URL, process.env.DIRECT_URL]) {
    if (raw) message = message.split(raw).join('[database-url]');
    const host = extractPostgresHost(raw);
    if (host) message = message.split(host).join('[database-host]');
  }
  return message.replace(/postgres(?:ql)?:\/\/\S+/g, '[database-url]');
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const databaseConfigured = hasDatabaseUrl();
  if (!databaseConfigured) {
    return {
      databaseMode: 'MEMORY',
      databaseConfigured,
      databaseReachable: false,
      appName: getAppName(),
      buildReady: true,
      message: 'DATABASE_URL is not set. Using MEMORY fallback.',
    };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return {
      databaseMode: 'MEMORY',
      databaseConfigured,
      databaseReachable: false,
      appName: getAppName(),
      buildReady: true,
      message: 'Prisma client is unavailable. Using MEMORY fallback.',
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      databaseMode: 'PRISMA',
      databaseConfigured,
      databaseReachable: true,
      appName: getAppName(),
      buildReady: true,
      message: 'Prisma database connection is reachable.',
    };
  } catch (error) {
    return {
      databaseMode: 'PRISMA',
      databaseConfigured,
      databaseReachable: false,
      appName: getAppName(),
      buildReady: true,
      message: sanitizeDatabaseMessage(error),
    };
  }
}
