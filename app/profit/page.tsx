import { Shell } from '@/components/Shell';
import { DataTable } from '@/components/DataTable';
import { marketPriceSamples } from '@/lib/mockData';
import { calculateProfit } from '@/lib/profit';

export default function ProfitPage() {
  const r = calculateProfit({ sellingPriceLocal: 980, exchangeRate: 4.99, amazonCostJpy: 3980, marketplaceFeeRate: 10, paymentFeeRate: 2, payoutFeeRate: 2, otherCostJpy: 100, internationalShippingJpy: null });
  return <Shell title="価格帯・利益判定" subtitle="売れている価格帯、推奨販売価格、許容送料を商品ごとに確認します。">
    <div className="grid cols-3"><div className="card stat"><span>売れ筋価格帯</span><strong>TWD 850〜1,050</strong></div><div className="card stat"><span>推奨販売価格</span><strong>TWD 980</strong></div><div className="card stat"><span>許容送料</span><strong>{r.allowableShippingJpy == null ? '要確認' : `¥${r.allowableShippingJpy.toLocaleString()}`}</strong></div></div>
    <div className="card" style={{ marginTop: 16 }}><h2>計算内訳</h2><p>注文時または発送時の為替で利益予測を固定します。出品前は現在レートで参考利益を表示し、注文時または発送時の為替で利益予測を固定します。</p><div className="grid cols-4"><div>円換算売上：¥{r.salesJpy.toLocaleString()}</div><div>モール手数料：¥{r.marketplaceFeeJpy.toLocaleString()}</div><div>受取手数料：¥{r.payoutFeeJpy.toLocaleString()}</div><div>参考利益：¥{r.profitJpy.toLocaleString()}</div></div></div>
    <DataTable headers={['販売先','国','ASIN','売れ筋価格帯','中央値','販売数','メモ']}>
      {marketPriceSamples.map(s => <tr key={`${s.marketplace}-${s.country}-${s.asin}`}><td>{s.marketplace}</td><td>{s.country}</td><td>{s.asin}</td><td>{s.range}</td><td>{s.median}</td><td>{s.soldCount}</td><td>{s.note}</td></tr>)}
    </DataTable>
  </Shell>;
}
