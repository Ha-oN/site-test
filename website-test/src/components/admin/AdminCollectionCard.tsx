'use client';
import { Edit3, Trash2 } from 'lucide-react';
import { Collection } from '@/types/Collection';

interface AdminCollectionCardProps {
  collection: Collection;
  onEdit: (col: Collection) => void;
  onDelete: (id: number) => void;
}

export default function AdminCollectionCard({ collection, onEdit, onDelete }: AdminCollectionCardProps) {
  return (
    <div className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all">
      <div className="relative h-52 w-full overflow-hidden">
        <img 
          src={collection.presentation_pic} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
          alt={collection.name} 
        />
        {!collection.active && (
          <div className="absolute top-2 left-2 bg-black/80 text-[10px] font-bold px-2 py-1 rounded border border-zinc-700">
            INACTIF
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-black uppercase truncate text-white">{collection.name}</h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-zinc-500 font-bold">{collection.nb_pieces} PIÈCES</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(collection)}
              className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              <Edit3 size={16}/>
            </button>
            <button 
              onClick={() => { if(confirm("Supprimer cette collection ?")) onDelete(collection.id) }}
              className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}