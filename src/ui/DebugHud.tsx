'use client';

import React, { useEffect, useState, useRef } from 'react';
import { simEngine } from '@/sim/engine';
import { useSimStore } from '@/store/useSimStore';

export function DebugHud() {
  const simSpeed = useSimStore((s) => s.simSpeed);
  const [fps, setFps] = useState(60);
  const [, setFrameTrigger] = useState(0);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animId: number;
    const loop = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      // Re-render HUD at ~4 Hz for live position readouts
      if (frameCountRef.current % 15 === 0) {
        setFrameTrigger((n) => n + 1);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const totalAgents =
    simEngine.ambulances.length +
    simEngine.supplyVans.length +
    simEngine.orderlies.length +
    simEngine.patients.length;

  const movingAgents =
    simEngine.ambulances.filter((a) => a.state !== 'UNLOADING').length +
    simEngine.supplyVans.filter((v) => v.state !== 'UNLOADING').length +
    simEngine.orderlies.filter((o) => o.state !== 'IDLE' && o.state !== 'REST').length;

  // First 3 agents for position verification
  const first3 = [
    ...simEngine.ambulances.map((a) => ({ id: a.id, type: 'amb', x: a.position.x, z: a.position.z, state: a.state })),
    ...simEngine.supplyVans.map((v) => ({ id: v.id, type: 'van', x: v.position.x, z: v.position.z, state: v.state })),
    ...simEngine.orderlies.map((o) => ({ id: o.id, type: 'ord', x: o.position.x, z: o.position.z, state: o.state })),
  ].slice(0, 3);

  const clockHours = Math.floor((simEngine.simClock / 3600) % 24);
  const clockMins = Math.floor((simEngine.simClock % 3600) / 60);
  const clockSecs = Math.floor(simEngine.simClock % 60);
  const clockStr = `${clockHours.toString().padStart(2, '0')}:${clockMins
    .toString()
    .padStart(2, '0')}:${clockSecs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none select-none bg-slate-900/90 text-white font-mono text-[10px] p-2.5 rounded-xl border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-xs">
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
        <span className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          SIM DEBUG HUD
        </span>
        <span className="text-sky-400">{fps} FPS</span>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-300">
        <div>
          Ticks: <strong className="text-white">{simEngine.tickCount}</strong>
        </div>
        <div>
          Clock: <strong className="text-white">{clockStr}</strong>
        </div>
        <div>
          Speed: <strong className="text-white">{simSpeed === 0 ? 'PAUSED' : `${simSpeed}x`}</strong>
        </div>
        <div>
          Agents: <strong className="text-white">{movingAgents}/{totalAgents} moving</strong>
        </div>
      </div>

      <div className="mt-1.5 pt-1 border-t border-slate-800 text-[9px] text-slate-400">
        <div className="font-semibold text-slate-300 mb-0.5">Live Agent Positions:</div>
        {first3.map((a) => (
          <div key={a.id} className="flex justify-between text-slate-300">
            <span className="font-bold text-sky-400">{a.id}</span>
            <span>[{a.state}]</span>
            <span className="text-slate-400 font-mono">
              x:{a.x.toFixed(1)}, z:{a.z.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
