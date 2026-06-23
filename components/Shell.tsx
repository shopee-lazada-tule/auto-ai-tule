'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import { marketplaceLabel, navigation, type Marketplace } from '@/lib/constants';

export function Shell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const marketplace = (params.get('marketplace') === 'LAZADA' ? 'LAZADA' : 'SHOPEE') as Marketplace;

  function switchMarket(next: Marketplace) {
    const qs = new URLSearchParams(params.toString());
    qs.set('marketplace', next);
    router.push(`${pathname}?${qs.toString()}`);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Shopee・LAZADA出品支援ツール<span>ASIN大量登録・国別出品・売上管理</span></div>
        <div className="market-tabs" aria-label="販売先切り替え">
          {(['SHOPEE','LAZADA'] as Marketplace[]).map(m => <button key={m} className={m===marketplace ? 'active' : ''} onClick={() => switchMarket(m)}>{marketplaceLabel[m]}</button>)}
        </div>
        <nav className="nav">
          {navigation.map(item => {
            const active = pathname === item.href;
            const href = `${item.href}?marketplace=${marketplace}`;
            return <Link key={item.href} href={href} className={active ? 'active' : ''}><strong>{item.label}</strong><span>{item.description}</span></Link>;
          })}
        </nav>
      </aside>
      <main className="main">
        <header className="header">
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <span className="badge">現在：{marketplaceLabel[marketplace]}</span>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
