:root {
  --bg: #f6f8fb;
  --panel: #ffffff;
  --line: #e5eaf2;
  --text: #172033;
  --muted: #65738a;
  --soft: #eef4ff;
  --accent: #2563eb;
  --accent-dark: #1d4ed8;
  --good: #047857;
  --warn: #b45309;
  --bad: #b91c1c;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.app-shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.sidebar { background: #0f172a; color: #e8eef8; padding: 22px 16px; position: sticky; top: 0; height: 100vh; overflow: auto; }
.logo { font-weight: 800; font-size: 18px; line-height: 1.45; margin-bottom: 18px; }
.logo span { display: block; color: #9fb3d9; font-weight: 600; font-size: 12px; margin-top: 5px; }
.market-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0 20px; }
.market-tabs button { border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); color: #dbe7ff; border-radius: 12px; padding: 9px 8px; cursor: pointer; }
.market-tabs button.active { background: #2563eb; border-color: #4c86ff; color: #fff; }
.nav { display: grid; gap: 5px; }
.nav a { display: block; padding: 10px 11px; border-radius: 12px; color: #cbd5e1; }
.nav a strong { display: block; font-size: 14px; }
.nav a span { display: block; margin-top: 2px; color: #8ea1bd; font-size: 11px; }
.nav a.active, .nav a:hover { background: rgba(255,255,255,.09); color: #fff; }
.main { min-width: 0; }
.header { background: rgba(255,255,255,.88); border-bottom: 1px solid var(--line); backdrop-filter: blur(8px); position: sticky; top: 0; z-index: 5; padding: 18px 26px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.header h1 { margin: 0; font-size: 22px; }
.header p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
.content { padding: 24px 26px 56px; }
.grid { display: grid; gap: 16px; }
.grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 18px; box-shadow: 0 12px 30px rgba(15, 23, 42, .04); }
.card h2, .card h3 { margin: 0 0 10px; }
.card p { color: var(--muted); }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
.toolbar h2, .toolbar h3 { margin: 0; }
.summary-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.summary-strip div { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; background: #fbfdff; }
.summary-strip span { display: block; color: var(--muted); font-size: 12px; }
.summary-strip strong { display: block; margin-top: 4px; font-size: 18px; }
.stat { display: flex; flex-direction: column; gap: 6px; }
.stat strong { font-size: 26px; }
.stat span { color: var(--muted); font-size: 13px; }
.table-wrap { overflow: visible; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
table { border-collapse: collapse; width: 100%; table-layout: fixed; }
th, td { padding: 12px 14px; border-bottom: 1px solid var(--line); text-align: left; font-size: 13px; vertical-align: middle; overflow-wrap: anywhere; word-break: break-word; }
th { background: #f8fafc; color: #526178; font-weight: 700; }
tr:last-child td { border-bottom: 0; }
.badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 700; background: #eef2ff; color: #3730a3; }
.badge.good { background: #dcfce7; color: var(--good); }
.badge.warn { background: #ffedd5; color: var(--warn); }
.badge.bad { background: #fee2e2; color: var(--bad); }
.actions { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 12px; }
.btn { border: 1px solid var(--line); border-radius: 11px; padding: 9px 13px; background: #fff; cursor: pointer; color: var(--text); min-height: 38px; }
.btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn.primary:hover { background: var(--accent-dark); }
.btn:disabled { opacity: .48; cursor: not-allowed; }
.segment { display: inline-flex; flex-wrap: wrap; gap: 6px; padding: 4px; border: 1px solid var(--line); border-radius: 14px; background: #f8fafc; }
.segment button { border: 0; border-radius: 10px; padding: 8px 11px; background: transparent; color: var(--muted); cursor: pointer; }
.segment button.active { background: #fff; color: var(--accent); box-shadow: 0 1px 6px rgba(15,23,42,.08); }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.field label { display: block; font-size: 12px; font-weight: 700; color: #526178; margin-bottom: 6px; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid var(--line); border-radius: 12px; padding: 10px 11px; background: #fff; }
.field textarea { min-height: 96px; }
.field textarea.mono { min-height: 220px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.section-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 16px; }
.preset-card { width: 100%; text-align: left; color: var(--text); cursor: pointer; }
.preset-card:hover { border-color: #b7c7e4; box-shadow: 0 14px 34px rgba(15, 23, 42, .08); }
.product-group { margin-top: 16px; }
.product-group h3 { margin: 0; }
.product-group .table-wrap { margin-top: 12px; }
.notice { padding: 12px 14px; border-radius: 14px; background: var(--soft); color: #1e3a8a; font-size: 13px; }
.page-guide { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.page-guide a { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 16px; }
.page-guide a b { display: block; margin-bottom: 5px; }
.page-guide a span { color: var(--muted); font-size: 13px; }
@media (max-width: 1100px) { .grid.cols-4, .grid.cols-5, .summary-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 940px) { .app-shell { grid-template-columns: 1fr; } .sidebar { position: static; height: auto; } .nav { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid.cols-3, .page-guide { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) {
  .header { padding: 16px; align-items: flex-start; flex-direction: column; }
  .content { padding: 16px; }
  .grid.cols-2, .grid.cols-3, .grid.cols-4, .grid.cols-5, .page-guide, .form-grid, .summary-strip { grid-template-columns: 1fr; }
  .nav { grid-template-columns: 1fr; }
  .actions .btn, .actions .badge { width: 100%; justify-content: center; text-align: center; }
  .table-wrap { border: 0; background: transparent; }
  table, thead, tbody, tr, th, td { display: block; width: 100%; }
  thead { display: none; }
  tr { margin-bottom: 12px; border: 1px solid var(--line); border-radius: 14px; background: #fff; overflow: hidden; }
  td { display: grid; grid-template-columns: minmax(96px, 36%) 1fr; gap: 10px; border-bottom: 1px solid var(--line); padding: 10px 12px; }
  td::before { content: attr(data-label); color: var(--muted); font-size: 12px; font-weight: 700; }
  tr:last-child td { border-bottom: 1px solid var(--line); }
  tr td:last-child { border-bottom: 0; }
}
