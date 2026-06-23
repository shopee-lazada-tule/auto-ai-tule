import Link from 'next/link';
import { navigation, type Marketplace } from '@/lib/constants';

export function PageGuide({ marketplace }: { marketplace: Marketplace }) {
  return (
    <div className="page-guide">
      {navigation.filter(n => n.href !== '/').map(item => <Link key={item.href} href={`${item.href}?marketplace=${marketplace}`}><b>{item.label}</b><span>{item.description}</span></Link>)}
    </div>
  );
}
