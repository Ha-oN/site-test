"use client";
import { Search } from 'lucide-react';
import type { Collection } from '@/types/Collection';

interface SalesHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCollection: string;
  setSelectedCollection: (value: string) => void;
  collections: Collection[];
}

export default function SalesHeader({ 
  searchTerm, 
  setSearchTerm, 
  selectedCollection, 
  setSelectedCollection, 
  collections 
}: SalesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      {/* TITRE SIMPLE SANS ICÔNE A GAUCHE */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tighter text-neutral-950 uppercase">
          Point de Vente
        </h1>
      </div>
      
      {/* BARRE DE RECHERCHE UNIFIÉE */}
      <div className="flex gap-2 w-full md:w-2/3 shadow-sm rounded-xl overflow-hidden border border-neutral-200 bg-white p-1">
        
        {/* BLOC RECHERCHE : ICÔNE MARRON + INPUT */}
        <div className="flex-1 flex gap-2 items-center bg-neutral-50 rounded-lg border border-neutral-100 p-1">
          {/* L'icône loupe marron/ocre est maintenant ICI, à côté de l'input */}
          <div className="p-2.5 bg-white rounded-lg border border-neutral-100 shadow-inner">
            <Search 
              className="text-ocre" // Utilisation de votre couleur ocre
              size={18} 
              strokeWidth={2.5}
            />
          </div>
          
          {/* L'input est simplifié, sans padding gauche excessif */}
          <input 
            type="text"
            placeholder="Désignation ou référence..."
            className="flex-1 px-1 py-2 rounded-lg bg-transparent outline-none focus:bg-white transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* SÉLECTEUR DE CATÉGORIE */}
        <select 
          className="px-3 py-2.5 rounded-lg bg-white outline-none text-sm font-bold text-neutral-700 border border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="all">Toutes Catégories</option>
          {collections.map(c => (
            <option key={c.id} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}