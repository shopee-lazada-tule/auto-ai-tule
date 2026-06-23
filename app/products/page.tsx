import { DataTable } from '@/components/DataTable';
import { SearchBar } from '@/components/SearchBar';
import { Shell } from '@/components/Shell';
import { products } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';

export default function ProductsPage() {
  return <Shell title="商品登録" subtitle="ASINベースで大量登録し、商品マスタとして管理します。ここで商品を登録してから各国の出品候補へ進みます。">
    <div className="grid cols-3">
      <div className="card"><h3>ASIN / Amazon URL</h3><div className="field"><label>入力</label><input placeholder="B00XXXXXXX または Amazon URL" /></div><div className="actions"><button className="btn primary">商品を追加</button></div></div>
      <div className="card"><h3>CSV一括登録</h3><p>大量ASINはCSVで登録します。ASIN、商品名、価格、重量、画像URLをまとめて取り込めます。</p><div className="actions"><button className="btn">CSVを選択</button><button className="btn primary">取込</button></div></div>
      <div className="card"><h3>取得モード</h3><p>SP-API / Keepa / 手入力を商品単位で切り替えできます。</p><div className="form-grid"><label><input type="checkbox" defaultChecked /> SP-API</label><label><input type="checkbox" /> Keepa</label><label><input type="checkbox" /> 手入力</label><label><input type="checkbox" defaultChecked /> Primeなしは在庫0</label></div></div>
    </div>
    <SearchBar placeholder="ASIN / 商品名 / ブランド / 取得元で検索" />
    <DataTable headers={['選択','ASIN','商品名','価格','取得元','Prime','在庫','重量','画像','状態','操作']}>
      {products.map(p => <tr key={p.asin}><td><input type="checkbox" /></td><td>{p.asin}</td><td>{p.title}</td><td>¥{p.price.toLocaleString()}</td><td>{p.source}</td><td>{p.prime ? 'あり' : 'なし'}</td><td>{p.stock ? 'あり' : 'なし'}</td><td>{p.weight}kg</td><td>{p.imageCount}枚</td><td><StatusBadge value={p.stock ? 'READY' : 'NEED_CHECK'} /></td><td><button className="btn">詳細</button></td></tr>)}
    </DataTable>
  </Shell>;
}
