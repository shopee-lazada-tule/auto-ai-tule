<style>:root {
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
button, input, select { font: inherit; }
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
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 18px; box-shadow: 0 12px 30px rgba(15, 23, 42, .04); }
.card h2, .card h3 { margin: 0 0 10px; }
.card p { color: var(--muted); }
.stat { display: flex; flex-direction: column; gap: 6px; }
.stat strong { font-size: 26px; }
.stat span { color: var(--muted); font-size: 13px; }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
table { border-collapse: collapse; width: 100%; min-width: 760px; }
th, td { padding: 12px 14px; border-bottom: 1px solid var(--line); text-align: left; font-size: 13px; vertical-align: middle; }
th { background: #f8fafc; color: #526178; font-weight: 700; }
tr:last-child td { border-bottom: 0; }
.badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 700; background: #eef2ff; color: #3730a3; }
.badge.good { background: #dcfce7; color: var(--good); }
.badge.warn { background: #ffedd5; color: var(--warn); }
.badge.bad { background: #fee2e2; color: var(--bad); }
.actions { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 12px; }
.btn { border: 1px solid var(--line); border-radius: 11px; padding: 9px 13px; background: #fff; cursor: pointer; color: var(--text); }
.btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn.primary:hover { background: var(--accent-dark); }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.field label { display: block; font-size: 12px; font-weight: 700; color: #526178; margin-bottom: 6px; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid var(--line); border-radius: 12px; padding: 10px 11px; background: #fff; }
.field textarea { min-height: 96px; }
.notice { padding: 12px 14px; border-radius: 14px; background: var(--soft); color: #1e3a8a; font-size: 13px; }
.page-guide { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.page-guide a { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 16px; }
.page-guide a b { display: block; margin-bottom: 5px; }
.page-guide a span { color: var(--muted); font-size: 13px; }
@media (max-width: 940px) { .app-shell { grid-template-columns: 1fr; } .sidebar { position: static; height: auto; } .nav { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid.cols-3, .grid.cols-4, .page-guide { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .header { padding: 16px; align-items: flex-start; flex-direction: column; } .content { padding: 16px; } .grid.cols-2, .grid.cols-3, .grid.cols-4, .page-guide, .form-grid { grid-template-columns: 1fr; } .nav { grid-template-columns: 1fr; } table { min-width: 680px; } }
</style></head><body><div class="app-shell"><aside class="sidebar"><div class="logo">Shopee・LAZADA出品支援ツール<span>トップは状況確認のみ</span></div><div class="market-tabs"><button class="active">Shopee</button><button>LAZADA</button></div><nav class="nav"><a class="active"><strong>ダッシュボード</strong><span>状況確認のみ</span></a><a><strong>商品登録</strong><span>ASIN登録・商品マスタ</span></a><a><strong>出品候補</strong><span>国別選択・候補確定</span></a><a><strong>出品中商品</strong><span>価格・在庫更新</span></a><a><strong>販売済み</strong><span>注文・発送・利益予測</span></a><a><strong>売上管理</strong><span>着金・差額確認</span></a><a><strong>価格帯・利益判定</strong><span>売れ筋価格帯・許容送料</span></a><a><strong>自動更新</strong><span>更新・アップロード設定</span></a><a><strong>メッセージ</strong><span>未返信・返信案</span></a><a><strong>CSV</strong><span>大量出品・一括更新</span></a><a><strong>設定</strong><span>手数料・API・為替固定</span></a></nav></aside><main class="main"><header class="header"><div><h1>ダッシュボード</h1><p>トップページでは選択・CSV出力・API反映を行わず、各メニューへの入口だけにします。</p></div><span class="badge">現在：Shopee</span></header><div class="content"><div class="grid cols-3"><div class="card stat"><span>登録ASIN</span><strong>12,480</strong><small>商品登録ページで検索・処理</small></div><div class="card stat"><span>出品候補</span><strong>3,240</strong><small>出品候補ページで国別選択</small></div><div class="card stat"><span>出品中</span><strong>1,852</strong><small>価格・在庫更新対象</small></div><div class="card stat"><span>要確認</span><strong>187</strong><small>自動アップロード停止中</small></div><div class="card stat"><span>未返信</span><strong>9</strong><small>メッセージページで対応</small></div><div class="card stat"><span>今月売上</span><strong>¥1,284,600</strong><small>売上管理ページで確認</small></div></div><div class="card" style="margin-top:18px"><h2>作業は各ページで実行</h2><p>ASIN数が多いため、トップページには処理ボタンを置きません。商品選択、国選択、CSV出力、自動更新は各メニュー内で行います。</p><div class="page-guide"><a><b>商品登録</b><span>ASIN / URL / CSVで登録</span></a><a><b>出品候補</b><span>全対象国から選択</span></a><a><b>CSV</b><span>大量出品・一括更新</span></a></div></div><div class="card" style="margin-top:18px"><h2>出品候補ページの例</h2><div class="table-wrap"><table><thead><tr><th>選択</th><th>国</th><th>通貨</th><th>推奨価格</th><th>想定利益</th><th>判定</th></tr></thead><tbody><tr><td><input type="checkbox" checked></td><td>SG</td><td>SGD</td><td>32.9</td><td>¥620</td><td><span class="badge good">A</span></td></tr><tr><td><input type="checkbox"></td><td>MY</td><td>MYR</td><td>99</td><td>¥510</td><td><span class="badge good">B</span></td></tr><tr><td><input type="checkbox"></td><td>VN</td><td>VND</td><td>499000</td><td>¥430</td><td><span class="badge warn">C</span></td></tr></tbody></table></div></div></div></main></div></body></html>