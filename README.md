# Shopee・LAZADA出品支援ツール v1.0 mock

Amazon ASINを大量登録し、Shopee / LAZADA の各対象国へ出品候補化、価格帯・利益判定、CSV出力、自動更新、自動アップロード、メッセージ対応、出品中商品、販売済み商品、売上管理まで一気通貫で扱うためのスターターです。

## 重要な設計方針

- トップページは状況確認とメニュー導線のみ。
- 商品選択、国選択、CSV出力、APIアップロードは各専用ページで行う。
- ASIN数が多い前提で、検索、絞り込み、ページ単位の処理を重視。
- Shopee / LAZADA はアプリ内で切り替え。
- 全対象国を判定対象にし、出品国はユーザーが選択。
- 為替バッファは使わない。
- 利益予測は注文時または発送時の為替で固定。
- 受取方法は Payoneer / World First / その他。
- 銀行受取は使わない。

## 現在できていること

- シンプルUIのページ構成
- 各メニューのページ分離
- Prisma schema
- APIルートのモック
- 商品登録、出品候補、出品中、販売済み、売上管理、利益判定、CSV、自動更新、メッセージ、設定の土台
- QAチェック用スクリプト
- Codex用作業指示

## まだ本番接続前のもの

- Amazon SP-API
- Keepa取込
- Shopee API
- LAZADA API
- 実DB保存（Neon/PostgreSQL）
- 認証
- Cron

ただし、接続口と画面構成は作ってあるため、次はモックストアを Prisma/Neon に置き換えていく段階です。

## セットアップ

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run seed
npm run dev
```

## 推奨実装順

1. Neon DB作成
2. DATABASE_URL設定
3. Prisma migrate
4. 商品登録APIをDB保存に置換
5. 出品候補生成APIをDB保存に置換
6. CSV出力をDBベースに置換
7. 自動更新dry-runをDBベースに置換
8. API接続設定の暗号化保存
9. Amazon SP-API接続
10. Shopee / LAZADA API接続
