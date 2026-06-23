import { DataTable } from '@/components/DataTable';
import { SearchBar } from '@/components/SearchBar';
import { Shell } from '@/components/Shell';
import { soldItems } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';

export default function SoldItemsPage() {
  return <Shell title="販売済み" subtitle="注文単位で発送状況、為替固定、予測利益、着金後利益を確認します。">
    <SearchBar placeholder="注文ID / ASIN / SKU / 商品名で検索" />
    <div className="actions"><button className="btn">発送待ち</button><button className="btn">着金待ち</button><button className="btn">差額あり</button><button className="btn primary">選択注文を確認</button></div>
    <DataTable headers={['注文ID','注文日','販売先','国','ASIN','商品名','販売額','為替固定','予測利益','実利益','状態','操作']}>
      {soldItems.map(o => <tr key={o.orderId}><td>{o.orderId}</td><td>{o.orderedAt}</td><td>{o.marketplace}</td><td>{o.country}</td><td>{o.asin}</td><td>{o.name}</td><td>{o.currency} {o.sales}</td><td>{o.lock}</td><td>¥{o.estimatedProfit.toLocaleString()}</td><td>{o.actualProfit == null ? '未着金' : `¥${o.actualProfit.toLocaleString()}`}</td><td><StatusBadge value={o.status} /></td><td><button className="btn">詳細</button></td></tr>)}
    </DataTable>
  </Shell>;
}
