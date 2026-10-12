'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TopNav } from '@/ui/TopNav';
import { KpiDeck } from '@/ui/KpiDeck';
import { TransferTrackingCard } from '@/ui/TransferTrackingCard';
import { AgentInspector } from '@/ui/AgentInspector';
import { DockStatusDrawer } from '@/ui/DockStatusDrawer';
import { FloatingCameraControls } from '@/ui/FloatingCameraControls';
import { DebugHud } from '@/ui/DebugHud';
import { simEngine } from '@/sim/engine';
import { useSimStore } from '@/store/useSimStore';
import { startDevInvariantsMonitor, stopDevInvariantsMonitor } from '@/sim/invariants';

// Dynamic import with ssr: false for Three.js WebGL canvas
const CampusCanvas = dynamic(
  () => import('@/scene/CampusCanvas').then((mod) => mod.CampusCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#E6EBFA]">
        <div className="flex items-center gap-3 text-slate-700 font-bold text-sm bg-white/90 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-xl border border-white/80">
          <span className="w-3 h-3 rounded-full bg-[#1E60F3] animate-ping" />
          Initializing MediTrack Hospital Campus 3D Simulation...
        </div>
      </div>
    ),
  }
);

export default function MediTrackMainPage() {
  const [mounted, setMounted] = useState(false);
  const updateStats = useSimStore((s) => s.updateStats);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tick simulation engine at ~4 Hz (250ms) to update stats and telemetry
  useEffect(() => {
    if (!mounted) return;

    startDevInvariantsMonitor(simEngine);

    const interval = setInterval(() => {
      simEngine.tick(0.25);
      updateStats(simEngine.stats, simEngine.events);
    }, 250);

    return () => {
      clearInterval(interval);
      stopDevInvariantsMonitor();
    };
  }, [mounted, updateStats]);

  if (!mounted) {
    return (
      <main className="w-screen h-screen overflow-hidden bg-[#E6EBFA] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-500 font-semibold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          Loading MediTrack Simulation...
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#E6EBFA] select-none">
      {/* 3D High-Fidelity Isometric Simulation Canvas */}
      <div className="absolute inset-0 z-0">
        <CampusCanvas />
      </div>

      {/* Top Glassmorphic Navigation Bar */}
      <TopNav />

      {/* Top Left KPI Deck (Beds free, Ambulances on site, Response Target) */}
      <KpiDeck />

      {/* Bottom Left Emergency Transfer Tracking Stepper (Matching Video) */}
      <TransferTrackingCard />

      {/* Floating Vertical Camera & Speed Controls */}
      <FloatingCameraControls />

      {/* Right Telemetry Inspector Drawer */}
      <AgentInspector />

      {/* Bottom Right 4-Tab Status Drawer (Bays, Tugs, Fleet, Supplies) */}
      <DockStatusDrawer />

      {/* Developer Telemetry HUD (Press 'D' to toggle) */}
      <DebugHud />
    </main>
  );
}
