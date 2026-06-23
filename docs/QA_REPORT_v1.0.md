# QA Report v1.0

## 実施チェック
- UTF-8 HTML作成
- HTML構文パースチェック
- 置換文字「�」なし
- app/components/lib/prisma 内の禁止語チェック
- Prisma schema に除外国・銀行受取・為替上乗せ系項目なし
- トップページに処理操作なし
- 利益計算 smoke check

## 確認コマンド
```bash
npm run qa:text
npm run smoke
```

## 注意
このv1.0は本番API接続前の完成モックです。外部APIキーなしで安全に画面・処理フロー・DB設計を確認するためのものです。
