# v1.0 mock 完成メモ

## 目的
骨組みだけでなく、画面・ページ・APIモック・DBスキーマ・QAチェックまで一式で渡せる状態にする。

## 完了範囲
- ダッシュボードは状況確認専用
- 各メニューを専用ページ化
- 商品登録、出品候補、出品中、販売済み、売上管理、利益判定、自動更新、メッセージ、CSV、設定を実装スターターに追加
- APIモックを追加
- Prisma schema を整理
- CSV生成ロジックを追加
- 利益計算ロジックを追加
- 受取方法は Payoneer / World First / その他
- 為替は注文時または発送時で固定
- 文字崩れ・禁止語の静的QAを追加

## 本番化で置き換えるもの
- mockData.ts を Prisma DB 取得へ置換
- API route のモックレスポンスをDB保存へ置換
- Amazon SP-API 接続
- Shopee API 接続
- LAZADA API 接続
- メッセージAPI接続
- Cron実行

## QA結果
- qa-text ok
- smoke ok
- HTML文字化け検出なし
- トップページにチェックボックスなし
- トップページにCSV/API/国選択操作なし
