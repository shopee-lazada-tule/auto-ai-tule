import { DataTable } from '@/components/DataTable';
import { SearchBar } from '@/components/SearchBar';
import { Shell } from '@/components/Shell';
import { activeListings } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';

export default function ActiveListingsPage() {
  return <Shell title="出品中商品" subtitle="出品済み商品の価格・在庫・販売数・最終更新を確認します。大量商品は検索してから処理します。">
    <SearchBar placeholder="ASIN / SKU / 出品中商品名 / 国で検索" />
    <div className="actions"><button className="btn">価格更新CSV</button><button className="btn">在庫更新CSV</button><button className="btn">要確認のみ表示</button><button className="btn primary">選択商品をAPI更新</button></div>
    <DataTable headers={['選択','販売先','国','ASIN','SKU','商品名','価格','在庫','販売数','最終更新','状態']}>
      {activeListings.map(p => <tr key={p.sku}><td><input type="checkbox" /></td><td>{p.marketplace}</td><td>{p.country}</td><td>{p.asin}</td><td>{p.sku}</td><td>{p.name}</td><td>{p.currency} {p.price}</td><td>{p.stock}</td><td>{p.sold}</td><td>{p.lastSynced}</td><td><StatusBadge value={p.status} /></td></tr>)}
    </DataTable>
  </Shell>;
}
