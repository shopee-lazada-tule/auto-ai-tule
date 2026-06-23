import { Shell } from '@/components/Shell';

export default function SettingsPage() {
  return <Shell title="設定" subtitle="販売先別・国別の手数料、受取方法、為替固定、言語設定、API接続を管理します。">
    <div className="grid cols-2">
      <div className="card"><h2>手数料・受取設定</h2><div className="form-grid"><div className="field"><label>販売先</label><select><option>Shopee</option><option>LAZADA</option></select></div><div className="field"><label>国</label><select><option>SG</option><option>MY</option><option>PH</option><option>TH</option><option>TW</option><option>VN</option><option>ID</option></select></div><div className="field"><label>受取方法</label><select><option>Payoneer</option><option>World First</option><option>その他</option></select></div><div className="field"><label>受取手数料（%）</label><input placeholder="2" /></div><div className="field"><label>モール販売手数料（%）</label><input placeholder="10" /></div><div className="field"><label>決済手数料（%）</label><input placeholder="2" /></div><div className="field"><label>固定受取手数料（円）</label><input placeholder="0" /></div><div className="field"><label>その他費用（円）</label><input placeholder="100" /></div></div><div className="actions"><button className="btn primary">保存</button></div></div>
      <div className="card"><h2>為替固定</h2><p>注文時または発送時の為替で利益予測を固定します。固定した為替レートで利益予測を管理します。</p><label><input type="radio" name="fx" /> 注文発生時</label><br/><label><input type="radio" name="fx" defaultChecked /> 発送処理時</label><div className="actions"><button className="btn primary">保存</button></div></div>
    </div>
    <div className="grid cols-2" style={{ marginTop: 16 }}>
      <div className="card"><h2>タイトル・説明文生成</h2><p>国によって英語の方が良い場合があるため、国別初期設定と商品別設定の両方で切り替えます。</p><label><input type="checkbox" defaultChecked /> 英語で生成</label><br/><label><input type="checkbox" /> 現地語で生成</label><br/><label><input type="checkbox" /> 英語＋現地語で生成</label><br/><label><input type="checkbox" /> 手動編集を優先</label></div>
      <div className="card"><h2>API接続</h2><p>本番接続ではトークンは暗号化保存します。画面には登録済み/未登録のみ表示します。</p><div className="grid"><button className="btn">Amazon SP-API 接続設定</button><button className="btn">Shopee API 接続設定</button><button className="btn">LAZADA API 接続設定</button><button className="btn">Keepa取込設定</button></div></div>
    </div>
  </Shell>;
}
