'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TopNav } from '@/ui/TopNav';
import { KpiDeck } from '@/ui/KpiDeck';
import { AgentInspector } from '@/ui/AgentInspector';
import { DockStatusDrawer } from '@/ui/DockStatusDrawer';
import { FloatingCameraControls } from '@/ui/FloatingCameraControls';
import { DebugHud } from '@/ui/DebugHud';
import { simEngine } from '@/sim/engine';
import { useSimStore } from '@/store/useSimStore';
import { startDevInvariantsMonitor, stopDevInvariantsMonitor } from '@/sim/invariants';

// Dynamic import with ssr: false to prevent WebGL canvas execution during SSR
const CampusCanvas = dynamic(
  () => import('@/scene/CampusCanvas').then((mod) => mod.CampusCanvas),
  { ssr: false }
);

export default function MediCityPage() {
  const [mounted, setMounted] = React.useState(false);
  const updateStats = useSimStore((s) => s.updateStats);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Publish aggregate stats and tick simulation engine at ~4 Hz (250ms)
  React.useEffect(() => {
    if (!mounted) return;

    // Start 1-second invariants health checker
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
      <main className="w-screen h-screen overflow-hidden bg-sky-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          Loading MediCity Campus...
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-100 select-none">
      {/* 3D Isometric View Canvas */}
      <div className="absolute inset-0 z-0">
        <CampusCanvas />
      </div>

      {/* Top Bar Navigation */}
      <TopNav />

      {/* Top Left KPI Deck (Stock on hand, Trucks on site, On-time delivery) */}
      <KpiDeck />

      {/* Floating Vertical Camera Controls Stack (Right side) */}
      <FloatingCameraControls />

      {/* Selected Agent Inspector Drawer (Top Right) */}
      <AgentInspector />

      {/* Dock Status Drawer (Bottom Right) */}
      <DockStatusDrawer />

      {/* Dev-Only Debug HUD (Bottom Left) */}
      <DebugHud />
    </main>
  );
}
