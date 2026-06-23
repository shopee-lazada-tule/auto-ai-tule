import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopee・LAZADA出品支援ツール',
  description: 'Amazon ASINベースでShopee・LAZADA出品、価格帯判定、売上管理、メッセージ対応を支援します。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
