export function SearchBar({ placeholder = 'ASIN / SKU / 商品名で検索' }: { placeholder?: string }) {
  return <div className="card"><div className="form-grid"><div className="field"><label>検索</label><input placeholder={placeholder} /></div><div className="field"><label>ステータス</label><select><option>すべて</option><option>要確認</option><option>利益OK</option><option>エラー</option></select></div></div></div>;
}
