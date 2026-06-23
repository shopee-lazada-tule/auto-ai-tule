import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scanDirs = ['app', 'components', 'lib', 'prisma'];
const banned = ['fx_buffer', '為替バッファ', 'payoneer_fee', 'Payoneer手数料', '銀行受取'];
const hits: string[] = [];
function walk(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(ts|tsx|prisma|css)$/.test(entry)) {
      const text = fs.readFileSync(full, 'utf8');
      for (const word of banned) if (text.includes(word)) hits.push(`${path.relative(root, full)} includes ${word}`);
    }
  }
}
for (const dir of scanDirs) walk(path.join(root, dir));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
if (/enum\s+PayoutProvider\s*{[^}]*BANK/s.test(schema)) hits.push('schema.prisma includes invalid payout provider');
if (/enum\s+Country\s*{[^}]*BR/s.test(schema)) hits.push('schema.prisma includes excluded country');
const dashboard = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
for (const word of ['CSV出力', 'APIアップロード', '選択国を出品候補に確定', 'checkbox', '商品を追加']) {
  if (dashboard.includes(word)) hits.push(`dashboard includes operation control: ${word}`);
}
if (hits.length) {
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log('qa-text ok');
