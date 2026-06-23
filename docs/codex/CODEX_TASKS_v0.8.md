# Codex Tasks v0.8

## Task 01: DB接続
Neon DATABASE_URLを設定し、Prisma generate / migrate を通す。

## Task 02: 商品登録のDB保存
`/api/products` のモックを Prisma 保存に置き換える。ASIN重複時は更新する。

## Task 03: 出品候補生成
`/api/listing-drafts/generate` を実DB保存に置き換える。全対象国分を生成し、selectedForListing は false 初期値。

## Task 04: 国別選択保存
`PATCH /api/listing-drafts` で選択状態を保存する。

## Task 05: 利益判定保存
`/api/profit-simulations` でPriceSimulationを保存する。為替バッファは禁止。

## Task 06: CSV出力
選択済み出品候補だけをCSV出力する。

## Task 07: 出品中商品
API接続前は手動登録/CSV取込からActiveListingへ保存する。

## Task 08: 販売済み・売上管理
注文データ、為替固定、着金差額を保存できるようにする。

## Task 09: 自動更新dry-run
DB上の対象商品に対し、安全停止条件を判定してログ保存する。

## Task 10: メッセージ管理
未返信、要確認、返信済みを保存し、危険分類は自動送信不可にする。
