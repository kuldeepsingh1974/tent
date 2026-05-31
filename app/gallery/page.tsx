'use client';

import Link from 'next/link';
import { ArrowLeft, Phone } from 'lucide-react';
import { gallery } from '../../landing';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F7EDF7] via-[#FFF9E9] to-[#FAD9BB]/60 px-4 pb-10 pt-28 text-black sm:px-6 sm:pt-36 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-full bg-[#FFF9E9] px-5 py-3 text-sm font-black text-black shadow-lg transition hover:bg-[#F7EDF7]">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="mt-6 text-3xl font-black text-black sm:text-5xl">Complete Gallery</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-black sm:text-lg sm:leading-8">
              Wedding stages, tent decoration, seating layouts and event setup work
            </p>
          </div>

          <a href="tel:9805448091" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FAD9BB] bg-[#FFF9E9] px-6 py-4 font-black text-black shadow-2xl shadow-[#736C7F]/15 transition hover:scale-105 hover:bg-[#F7EDF7] sm:px-7">
            <Phone className="h-5 w-5" />
            Call Now
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item, index) => (
            <figure
              key={item.title}
              className={`group overflow-hidden rounded-3xl bg-[#FFF9E9] shadow-xl ${index % 9 === 0 ? 'lg:col-span-2' : ''}`}
            >
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-72" />
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
