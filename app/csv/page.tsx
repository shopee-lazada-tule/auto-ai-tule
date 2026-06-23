import { Shell } from '@/components/Shell';

export default function CsvPage() {
  const items = ['新規出品CSV','更新CSV','価格更新CSV','在庫更新CSV','要確認のみCSV','エラーのみCSV','販売済みCSV','売上CSV'];
  return <Shell title="CSV" subtitle="大量出品・一括更新・APIエラー時の代替処理をCSVで行います。">
    <div className="notice">CSVはトップでは出力しません。このページで対象条件を選んでから出力します。</div>
    <div className="grid cols-4" style={{ marginTop: 16 }}>
      {items.map(label => <div className="card" key={label}><h3>{label}</h3><p>検索・選択済み商品を対象に出力します。</p><button className="btn primary">出力</button></div>)}
    </div>
  </Shell>;
}
