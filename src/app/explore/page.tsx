'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ExploreCanvas = dynamic(
  () => import('@/explore/scene/ExploreCanvas').then((mod) => mod.ExploreCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#E8F1FC]">
        <div className="flex items-center gap-2.5 text-slate-600 font-semibold text-sm bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
          Loading MediCity Campus 3D Scene...
        </div>
      </div>
    ),
  }
);

const ExploreControls = dynamic(
  () => import('@/explore/ui/ExploreControls').then((mod) => mod.ExploreControls),
  { ssr: false }
);

export default function ExplorePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#E8F1FC] select-none">
      {/* 3D Realistic Campus Canvas */}
      <div className="absolute inset-0 z-0">
        <ExploreCanvas />
      </div>

      {/* Explore UI Controls & Overlays */}
      <ExploreControls />
    </main>
  );
}
