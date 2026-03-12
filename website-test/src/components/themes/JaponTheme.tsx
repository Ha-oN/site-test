'use client';

import { Collection } from '@/types/Collection';

export default function JaponTheme({ children, collection }: { children: React.ReactNode, collection: Collection }) {
  const petals = Array.from({ length: 15 });

  return (
    <div className="min-h-screen bg-matcha-base relative overflow-hidden text-zinc-900 p-8">
      
      {/* Background Gradient using Matcha Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-matcha-light)_0%,_transparent_50%)] opacity-70" />
      
      {/* Sakura Petals Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((_, i) => (
          <div
            key={i}
            className="sakura-petal absolute bg-[#ffb7c5] opacity-80 shadow-[0_0_8px_rgba(255,183,197,0.4)]"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 12 + 6}px`,
              height: `${Math.random() * 12 + 10}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 10 + 7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <header className="text-center py-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-100 rounded-full blur-3xl -z-10 opacity-40" />
          
          <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#ff8fa3] to-[#d64550] uppercase leading-none mb-6">
            {collection.name}
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-[1px] w-16 bg-red-200/50" />
            <span className="text-red-500 font-medium tracking-widest text-2xl serif">日本</span>
            <span className="h-[1px] w-16 bg-red-200/50" />
          </div>

          <p className="text-matcha-dark font-bold uppercase tracking-[0.4em] text-sm max-w-2xl mx-auto">
            {collection.mots_clefs}
          </p>
        </header>

        <div className="max-w-7xl mx-auto mb-20">
          {children}
        </div>
      </div>
    </div>
  );
}