import { Shell } from '@/components/Shell';
import { PageGuide } from '@/components/PageGuide';
import { dashboardStats } from '@/lib/mockData';
import type { Marketplace } from '@/lib/constants';

export default function Dashboard({ searchParams }: { searchParams: { marketplace?: Marketplace } }) {
  const marketplace = searchParams.marketplace === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
  return <Shell title="ダッシュボード" subtitle="トップページは状況確認と各メニューへの入口だけです。商品選択・国選択・出力・API反映は各専用ページで行います。">
    <div className="notice">ASIN数が多い前提のため、トップでは操作ボタンを出しません。目的のメニューを開いて、そのページ内で検索・選択・確定・出力を行います。</div>
    <div className="grid cols-3" style={{ marginTop: 16 }}>
      {dashboardStats.map(s => <div className="card stat" key={s.label}><span>{s.label}</span><strong>{s.value}</strong><small>{s.note}</small></div>)}
    </div>
    <div className="card" style={{ marginTop: 18 }}>
      <h2>作業メニュー</h2>
      <p>各メニューは1画面1目的で分離しています。大量ASINの検索、国別選択、一括処理は必ず該当ページで行います。</p>
      <PageGuide marketplace={marketplace} />
    </div>
  </Shell>;
}
