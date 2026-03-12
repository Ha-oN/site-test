'use client';

import { Collection } from '@/types/Collection';

export default function JaponTheme({ children, collection }: { children: React.ReactNode, collection: Collection }) {
  // Génération de pétales aléatoires
  const petals = Array.from({ length: 15 });

  return (
    <div className="min-h-screen bg-[#f0f7ee] relative overflow-hidden text-zinc-900 p-8">
      
      {/* BACKGROUND GRADIENT (Halo de lumière douce) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#e2f0d9_0%,_transparent_50%)] opacity-100" />
      
      {/* ANIMATION DE PÉTALES DE SAKURA */}
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
          {/* Disque solaire japonais très discret en fond (rouge pâle/estompé) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-100 rounded-full blur-3xl -z-10 opacity-60" />
          
          <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#ff8fa3] to-[#d64550] uppercase leading-none mb-6">
            {collection.name}
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-[1px] w-16 bg-red-200" />
            <span className="text-red-400 font-medium tracking-widest text-2xl serif">日本</span>
            <span className="h-[1px] w-16 bg-red-200" />
          </div>

          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-sm max-w-2xl mx-auto">
            {collection.mots_clefs}
          </p>
        </header>

        {/* Contenu (Grille de produits) */}
        <div className="max-w-7xl mx-auto mb-20">
          {children}
        </div>
      </div>

      {/* STYLES CSS POUR L'ANIMATION */}
      <style jsx>{`
        .sakura-petal {
          top: -10%;
          border-radius: 100% 0% 100% 20% / 100% 20% 100% 0%;
          transform: rotate(45deg);
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateX(100px) rotate(180deg) scale(0.8);
          }
          100% {
            top: 110%;
            transform: translateX(50px) rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}