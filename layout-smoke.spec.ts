import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadEnvLocal } from '../lib/server-env';
import { sanitizeDatabaseMessage } from '../lib/db';

loadEnvLocal();

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: tsx scripts/prisma-with-env.ts <prisma args>');
  process.exit(1);
}

const localPrisma = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'prisma.cmd' : 'prisma');
const command = fs.existsSync(localPrisma) ? localPrisma : (process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm');
const commandArgs = fs.existsSync(localPrisma) ? args : ['prisma', ...args];
const result = spawnSync(command, commandArgs, {
  encoding: 'utf8',
  env: process.env,
  shell: process.platform === 'win32',
});

if (result.stdout) process.stdout.write(sanitizeDatabaseMessage(result.stdout));
if (result.stderr) process.stderr.write(sanitizeDatabaseMessage(result.stderr));
if (result.error) console.error(sanitizeDatabaseMessage(result.error));
process.exit(result.status ?? 1);
