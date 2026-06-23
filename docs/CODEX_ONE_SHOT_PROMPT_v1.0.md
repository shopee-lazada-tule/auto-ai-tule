# Codex一括構築プロンプト v1.0

このリポジトリは「Shopee・LAZADA出品支援ツール」です。AGENTS.mdを必ず読み、そのルールを守ってください。

## 目的
現在のモック実装を、Next.js + Prisma + Neon PostgreSQLで実DB保存できるMVPへ置き換えてください。

## 最優先
1. npm run qa:text と npm run smoke が通る状態を維持する。
2. トップページでは処理操作を増やさない。
3. 商品登録、国別出品候補、出品中、販売済み、売上管理、CSV、自動更新、メッセージ、設定は各専用ページに分ける。
4. 受取方法は PAYONEER / WORLD_FIRST / OTHER のみ。
5. 為替上乗せ項目は作らず、注文時または発送時の為替で利益予測を固定する。

## 実装順
1. Prisma generate / migrate が通るように調整
2. seed.ts を実DBへ投入できるようにする
3. products API をDB保存へ置換
4. listing-drafts API をDB保存へ置換
5. fee/fx/country settings API をDB保存へ置換
6. CSV export をDBデータから出力
7. active-listings / sold-items / sales summary をDBデータから取得
8. automation dry-run をDBデータで判定
9. message draft API を安全分類付きで実装
10. 最後に npm run qa:text、npm run smoke、npm run build を実行

## 完了条件
- 商品登録が保存される
- 出品候補が全対象国で生成される
- ユーザーが選んだ国だけが出品対象になる
- CSV出力が選択済み商品ベースで出る
- 自動アップロード停止条件が効く
- 売上・着金差額を保存できる
- トップページに処理操作が追加されていない
