import { DataTable } from '@/components/DataTable';
import { Shell } from '@/components/Shell';
import { messageThreads } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';

export default function MessagesPage() {
  return <Shell title="メッセージ" subtitle="未返信・要確認・返信済みを分けて管理します。危険な問い合わせは自動送信しません。">
    <div className="actions"><button className="btn primary">未返信</button><button className="btn">要確認</button><button className="btn">返信済み</button></div>
    <DataTable headers={['販売先','国','購入者','分類','内容','期限','状態','操作']}>
      {messageThreads.map((m,i) => <tr key={i}><td>{m.marketplace}</td><td>{m.country}</td><td>{m.buyer}</td><td>{m.category}</td><td>{m.text}</td><td>{m.deadline}</td><td><StatusBadge value={m.status} /></td><td><button className="btn">返信案</button></td></tr>)}
    </DataTable>
    <div className="notice" style={{ marginTop: 16 }}>返品・返金・クレーム・真贋確認・値下げ交渉は自動送信せず、返信案のみ作成して要確認に止めます。</div>
  </Shell>;
}
