import { DataTable } from '@/components/DataTable';
import { SearchBar } from '@/components/SearchBar';
import { Shell } from '@/components/Shell';
import { StatusBadge } from '@/components/StatusBadge';
import { listingRows, products } from '@/lib/mockData';
import type { Marketplace } from '@/lib/constants';

export default function ListingDraftsPage({ searchParams }: { searchParams: { marketplace?: Marketplace } }) {
  const marketplace = searchParams.marketplace === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
  const product = products[0];
  const rows = listingRows(marketplace, product);
  return <Shell title="出品候補" subtitle="商品ごとに全対象国を表示し、出品する国をユーザーが選択します。トップでは国選択しません。">
    <SearchBar placeholder="ASIN / 商品名 / SKU / 判定で検索" />
    <div className="card">
      <h2>国別出品候補：{product.asin}</h2>
      <p>{product.title}</p>
      <div className="actions"><button className="btn">A/B判定のみ選択</button><button className="btn">NG以外を選択</button><button className="btn">選択解除</button><button className="btn primary">選択国を出品候補に確定</button></div>
    </div>
    <DataTable headers={['選択','国','通貨','推奨価格','参考利益','許容送料','判定','出品文','状態']}>
      {rows.map(r => <tr key={r.country}><td><input type="checkbox" defaultChecked={r.selected} aria-label={`${r.country}を選択`} /></td><td>{r.country}</td><td>{r.currency}</td><td>{r.recommendedPrice}</td><td>¥{r.profitJpy.toLocaleString()}</td><td>{r.allowableShippingJpy == null ? '要確認' : `¥${r.allowableShippingJpy.toLocaleString()}`}</td><td><StatusBadge value={r.judgement} /></td><td><button className="btn">英語/現地語</button></td><td>{r.status}</td></tr>)}
    </DataTable>
  </Shell>;
}
