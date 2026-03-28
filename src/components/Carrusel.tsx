"use client";

import { useState } from "react";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarruselProps {
  images: string[];
  alt: string;
}

export default function Carrusel({ images, alt }: CarruselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[3/4] bg-neutral-900 w-full" />;
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group w-full overflow-hidden bg-neutral-950">
      {/* IMAGEN ACTUAL CON TRANSICIÓN DE FADE */}
      <div className="relative aspect-[3/4] w-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <NextImage
              src={img}
              alt={`${alt} - vista ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* CONTROLES (Solo si hay más de una) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          {/* INDICADORES MINIMALISTAS (Líneas finas) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-[2px] transition-all duration-500 ${
                  idx === currentIndex ? "w-8 bg-white" : "w-4 bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}