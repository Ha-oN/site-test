'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

export default function CarouselControls({ onPrev, onNext }: CarouselControlsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-30 p-4 md:p-6 rounded-full border border-[#D2B48C]/30 bg-white/40 text-[#8B4513] backdrop-blur-md hover:bg-[#8B4513] hover:text-white transition-all duration-700 group shadow-sm"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-30 p-4 md:p-6 rounded-full border border-[#D2B48C]/30 bg-white/40 text-[#8B4513] backdrop-blur-md hover:bg-[#8B4513] hover:text-white transition-all duration-700 group shadow-sm"
      >
        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </>
  );
}