import { Collection } from '@/types/Collection';
import { Link } from '@/i18n/routing';

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link 
      href={`/collections/${collection.id}`} 
      className="group relative block w-full aspect-[4/5] bg-[#E5E1DA] overflow-hidden"
    >
      {/* Overlay subtil pour donner de la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#4A3728]/30 z-10" />
      
      {/* Image de présentation */}
      <img 
        src={collection.presentation_pic} 
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
      />

      {/* Nom de la collection centré */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <h2 className="text-white text-2xl font-light uppercase tracking-[0.3em] drop-shadow-md transform transition-transform duration-500 group-hover:scale-110">
          {collection.name}
        </h2>
      </div>

      {/* Bordure décorative au survol (optionnel) */}
      <div className="absolute inset-4 border border-white/20 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}