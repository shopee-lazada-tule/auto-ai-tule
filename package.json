# AGENTS.md — Shopee・LAZADA出品支援ツール

このリポジトリでAI/Codexが作業するときの必須ルールです。

## 最重要ルール
- トップページでは商品選択・国選択・CSV出力・APIアップロード・自動更新実行をしない。
- ASIN数が多い前提。処理は必ず各専用ページ内で行う。
- Shopee対象国は SG/MY/PH/TH/TW/VN。BRは使わない。
- LAZADA対象国は SG/MY/PH/TH/VN/ID。IDは設定でON/OFF可能。
- 受取方法は PAYONEER / WORLD_FIRST / OTHER のみ。BANKは作らない。
- 表示名は「受取手数料」。Payoneer手数料という固定表記は禁止。
- 為替バッファは禁止。fx_buffer 系のDB項目・変数・表示は作らない。
- 利益予測は注文時または発送時の為替で固定する。
- 自動アップロードは停止条件を必ず通す。利益不足、送料未入力、カテゴリ未設定、画像なし、Amazon在庫なし、価格急変、禁止ワード検出時は要確認に止める。
- 返品、返金、クレーム、真贋確認、値下げ交渉は自動送信禁止。返信案だけ作る。
- UIはシンプル。1画面1目的。詳細は折りたたみ・専用ページ・詳細モーダルに分離する。

## 品質チェック
作業後は最低限以下を確認する。

```bash
npm run qa:text
npm run smoke
```

本番化時は以下も実行する。

```bash
npm run prisma:generate
npm run build
```

## 禁止語チェック
以下が出たら修正する。
- BR（国コードとして）
- BANK
- bank transfer
- fx_buffer
- 為替バッファ
- payoneer_fee
- Payoneer手数料
