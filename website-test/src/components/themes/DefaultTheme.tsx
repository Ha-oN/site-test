'use client';

import { Collection } from '@/types/Collection';

interface DefaultThemeProps {
  children: React.ReactNode;
  collection: Collection;
}

export default function DefaultTheme({ children, collection }: DefaultThemeProps) {
  return (
    <main className="min-h-screen pb-24">
      {/* Header organique */}
      <header className="relative pt-24 pb-16 px-8 text-center border-b border-[#D2B48C]/20 mx-auto max-w-4xl">
        <span className="text-[#A0522D] text-[10px] uppercase tracking-[0.6em] mb-4 block">
          Studio Collection
        </span>
        <h1 className="text-6xl md:text-8xl font-serif italic text-[#8B4513] mb-6 tracking-tight">
          {collection.name}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs italic">
            {collection.mots_clefs}
          </p>
        </div>
      </header>

      {/* Contenu de la collection */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
        {children}
      </div>

      <footer className="mt-32 text-center opacity-40">
        <p className="font-serif italic text-[#8B4513]">Authentique Grès Artisanal</p>
      </footer>
    </main>
  );
}