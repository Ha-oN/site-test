'use client';

import Image from 'next/image';
import { Collection } from '@/types/collection';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={collection.presentation_pic}
        alt={collection.name}
        fill
        className="object-cover transition-transform duration-500"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
        <p className="text-sm opacity-90">{collection.mots_clefs}</p>
      </div>
    </div>
  );
}