"use client";
import { Plus, Minus } from 'lucide-react';
import type { Produit } from '@/types/Produit';

interface CartItemProps {
  item: { produit: Produit, quantity: number };
  onUpdateQuantity: (id: number, delta: number) => void;
}

export default function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0 group">
      <div className="flex-1 pr-2">
        <div className="font-bold text-[11px] text-neutral-800 leading-tight uppercase truncate">{item.produit.name}</div>
        <div className="text-[10px] font-bold text-neutral-400">{(item.produit.prix * item.quantity).toFixed(2)}€</div>
      </div>
      
      <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-1">
        <button onClick={() => onUpdateQuantity(item.produit.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-neutral-400 hover:text-black">
          <Minus size={12}/>
        </button>
        <span className="text-xs font-black min-w-[14px] text-center">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.produit.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-neutral-400 hover:text-black">
          <Plus size={12}/>
        </button>
      </div>
    </div>
  );
}