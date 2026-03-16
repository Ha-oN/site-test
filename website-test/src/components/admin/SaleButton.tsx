'use client';

import { Link } from '@/i18n/routing';
import { ShoppingCart } from 'lucide-react';

export default function SaleButton() {
  return (
    <Link 
      href="/admin/sales" 
      className="px-5 py-3 rounded-full border border-blue-200 bg-blue-50 text-blue-600 flex items-center gap-2 font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
    >
      <ShoppingCart size={16}/>
      <span className="text-sm uppercase tracking-wider">Caisse</span>
    </Link>
  );
}