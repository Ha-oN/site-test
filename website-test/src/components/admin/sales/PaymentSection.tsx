"use client";
import { Banknote, CreditCard } from 'lucide-react';

interface PaymentSectionProps {
  total: number;
  loading: boolean;
  onFinalize: (method: 'ESPECES' | 'CARTE') => void;
  disabled: boolean;
}

export default function PaymentSection({ total, loading, onFinalize, disabled }: PaymentSectionProps) {
  return (
    <div className="p-5 bg-white border-t-2 border-neutral-100 space-y-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Net à payer</span>
        <span className="text-3xl font-black text-neutral-950">{total.toFixed(2)}€</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <button 
          onClick={() => onFinalize('ESPECES')}
          disabled={disabled || loading}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20"
        >
          <span>Règlement Espèces</span>
          <Banknote size={18} strokeWidth={2.5} />
        </button>

        <button 
          onClick={() => onFinalize('CARTE')}
          disabled={disabled || loading}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-sky-600 text-sky-600 font-black text-[11px] uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20"
        >
          <span>Paiement Carte</span>
          <CreditCard size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}