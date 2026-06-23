import { Shell } from '@/components/Shell';
import { salesSummary, soldItems } from '@/lib/mockData';
import { DataTable } from '@/components/DataTable';

export default function SalesPage() {
  return <Shell title="売上管理" subtitle="売上・受取予定・着金後利益・予測との差額を確認します。着金登録は注文を検索してから行います。">
    <div className="grid cols-4">
      <div className="card stat"><span>今月売上</span><strong>¥{salesSummary.monthSalesJpy.toLocaleString()}</strong></div>
      <div className="card stat"><span>受取予定</span><strong>¥{salesSummary.expectedPayoutJpy.toLocaleString()}</strong></div>
      <div className="card stat"><span>粗利見込み</span><strong>¥{salesSummary.expectedProfitJpy.toLocaleString()}</strong></div>
      <div className="card stat"><span>予測との差額</span><strong>¥{salesSummary.profitDiffJpy.toLocaleString()}</strong></div>
    </div>
    <div className="card" style={{ marginTop: 16 }}><h2>着金登録</h2><p>販売済み注文を検索し、実際の着金額・実際の受取手数料を登録します。</p><div className="form-grid"><div className="field"><label>注文ID</label><input placeholder="SP-TW-10021" /></div><div className="field"><label>実際の着金額（円）</label><input placeholder="5480" /></div><div className="field"><label>実際の受取手数料（円）</label><input placeholder="120" /></div><div className="field"><label>着金日</label><input type="date" /></div></div><div className="actions"><button className="btn primary">着金情報を保存</button></div></div>
    <DataTable headers={['注文ID','販売先','国','予測利益','実利益','差額','状態']}>
      {soldItems.map(o => { const diff = o.actualProfit == null ? null : o.actualProfit - o.estimatedProfit; return <tr key={o.orderId}><td>{o.orderId}</td><td>{o.marketplace}</td><td>{o.country}</td><td>¥{o.estimatedProfit.toLocaleString()}</td><td>{o.actualProfit == null ? '未着金' : `¥${o.actualProfit.toLocaleString()}`}</td><td>{diff == null ? '-' : `¥${diff.toLocaleString()}`}</td><td>{o.status}</td></tr>; })}
    </DataTable>
  </Shell>;
}
