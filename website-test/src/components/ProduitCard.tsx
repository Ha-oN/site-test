'use client';

import { Produit } from '@/types/Produit';
import Image from 'next/image';

export default function ProduitCard({ produit }: { produit: Produit }) {
  return (
    <div className="group flex flex-col gap-4 w-full">
      {/* Container Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/50 border border-argile/5">
        <img
          src={produit.image_url}
          alt={produit.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {produit.sold_out && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand/40 backdrop-blur-[2px]">
            <span className="bg-ocre text-sand px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Infos Produit - C'est ici qu'on règle le contraste */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-black italic uppercase text-lg leading-none tracking-tighter text-argile">
            {produit.name}
          </h3>
          <span className="font-bold text-sm text-ocre">
            {produit.prix}€
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-argile/50">
            {produit.type}
          </p>
          <p className="text-[9px] italic text-argile/30 font-medium uppercase">
            {produit.exemplaires} restants
          </p>
        </div>
      </div>
    </div>
  );
}