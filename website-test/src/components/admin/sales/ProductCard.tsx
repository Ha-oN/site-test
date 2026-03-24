"use client";
import type { Produit } from '@/types/Produit';

interface ProductCardProps {
  produit: Produit;
  onAdd: (p: Produit) => void;
}

export default function ProductCard({ produit, onAdd }: ProductCardProps) {
  return (
    <button 
      onClick={() => onAdd(produit)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col border border-neutral-200 hover:border-neutral-900"
    >
      <div className="h-36 w-full bg-neutral-50 overflow-hidden border-b border-neutral-100">
        {produit.image_url ? (
          <img src={produit.image_url} alt={produit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs italic bg-neutral-100">Aucun visuel</div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between text-left">
        <div>
          <div className="font-semibold text-sm text-neutral-900 line-clamp-2 leading-tight min-h-[32px]">{produit.name}</div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">{produit.type}</div>
        </div>
        <div className="flex justify-between items-end mt-3 pt-2 border-t border-neutral-100">
          <span className="text-lg font-bold text-neutral-950">{produit.prix.toFixed(2)}€</span>
          <span className="text-[9px] font-mono font-medium bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded uppercase">Stock: {produit.exemplaires}</span>
        </div>
      </div>
    </button>
  );
}