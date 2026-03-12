'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    // ... your other links
  ];

  return (
    <>
      {links.map((link) => {
        // Check if the current path matches the link
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-ocre text-sand' // If selected: Ocre background, Sand text
                : 'text-argile hover:bg-argile/10' // If not selected: Argile text, subtle hover
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}