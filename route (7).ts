import { Shell } from '@/components/Shell';
import { PageGuide } from '@/components/PageGuide';
import { dashboardStats } from '@/lib/mockData';
import type { Marketplace } from '@/lib/constants';
import { checkDatabaseHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Dashboard({ searchParams }: { searchParams: { marketplace?: Marketplace } }) {
  const marketplace = searchParams.marketplace === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
  const database = await checkDatabaseHealth();
  return <Shell title="ダッシュボード" subtitle="トップページは状況確認と各メニューへの入口だけです。商品選択・国選択・出力・API反映は各専用ページで行います。">
    <div className="notice">ASIN数が多い前提のため、トップでは操作ボタンを出しません。目的のメニューを開いて、そのページ内で検索・選択・確定・出力を行います。</div>
    <div className="grid cols-3" style={{ marginTop: 16 }}>
      {dashboardStats.map(s => <div className="card stat" key={s.label}><span>{s.label}</span><strong>{s.value}</strong><small>{s.note}</small></div>)}
    </div>
    <div className="card" style={{ marginTop: 18 }}>
      <h2>DB接続状態</h2>
      <p>Neon PostgreSQLへの切り替え準備状況です。接続文字列が未設定の場合は安全なメモリ保存で動作します。</p>
      <div className="grid cols-4">
        <div className="stat"><span>保存モード</span><strong>{database.databaseMode}</strong><small>{database.message}</small></div>
        <div className="stat"><span>DB設定</span><strong>{database.databaseConfigured ? '設定済み' : '未設定'}</strong><small>DATABASE_URL</small></div>
        <div className="stat"><span>DB到達性</span><strong>{database.databaseReachable ? 'OK' : '未接続'}</strong><small>未接続でもビルド可能</small></div>
        <div className="stat"><span>ビルド準備</span><strong>{database.buildReady ? 'OK' : '要確認'}</strong><small>{database.appName}</small></div>
      </div>
    </div>
    <div className="card" style={{ marginTop: 18 }}>
      <h2>作業メニュー</h2>
      <p>各メニューは1画面1目的で分離しています。大量ASINの検索、国別選択、一括処理は必ず該当ページで行います。</p>
      <PageGuide marketplace={marketplace} />
    </div>
  </Shell>;
}
