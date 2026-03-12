import { Collection } from '@/types/Collection';

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <div className="relative w-full h-full bg-[#E5E1DA]">
      {/* Overlay subtil pour donner de la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#4A3728]/10 z-10" />
      
      <img 
        src={collection.presentation_pic} 
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
      />
    </div>
  );
}