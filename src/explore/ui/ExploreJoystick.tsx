'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Compass,
  Navigation,
  Gamepad2,
} from 'lucide-react';
import { useExploreStore } from '@/explore/store';

interface JoystickPadProps {
  mode: 'move' | 'orbit';
  title: string;
  badge: string;
  onDeltaChange: (delta: { x: number; y: number }) => void;
}

function JoystickPad({ mode, title, badge, onDeltaChange }: JoystickPadProps) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const MAX_RADIUS = 32;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(true);

    if (mode === 'orbit') {
      const autoRotate = useExploreStore.getState().autoRotate360;
      if (autoRotate) {
        useExploreStore.getState().setAutoRotate360(false);
      }
    }
  }, [mode]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !padRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const diffX = e.clientX - centerX;
    const diffY = e.clientY - centerY;
    const distance = Math.hypot(diffX, diffY);

    if (distance === 0) {
      setKnobPos({ x: 0, y: 0 });
      onDeltaChange({ x: 0, y: 0 });
      return;
    }

    const clampedDist = Math.min(distance, MAX_RADIUS);
    const normX = (diffX / distance) * clampedDist;
    const normY = (diffY / distance) * clampedDist;

    setKnobPos({ x: normX, y: normY });
    onDeltaChange({
      x: normX / MAX_RADIUS,
      y: normY / MAX_RADIUS,
    });
  }, [isDragging, onDeltaChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onDeltaChange({ x: 0, y: 0 });
  }, [onDeltaChange]);

  const isMove = mode === 'move';

  return (
    <div className="flex flex-col items-center">
      {/* Joystick Base Pad */}
      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-white/95 to-slate-100/90 backdrop-blur-2xl border-2 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all touch-none select-none ${
          isDragging
            ? isMove
              ? 'border-emerald-500 shadow-emerald-500/25 scale-105'
              : 'border-teal-500 shadow-teal-500/25 scale-105'
            : 'border-white/90 shadow-slate-900/15'
        }`}
      >
        {/* Outer Direction Guides */}
        <span className="absolute top-1 text-[8px] sm:text-[9px] font-extrabold text-slate-400">
          {isMove ? 'FWD' : 'N'}
        </span>
        <span className="absolute bottom-1 text-[8px] sm:text-[9px] font-extrabold text-slate-400">
          {isMove ? 'BACK' : 'S'}
        </span>
        <span className="absolute left-1.5 text-[8px] sm:text-[9px] font-extrabold text-slate-400">
          {isMove ? 'L' : 'W'}
        </span>
        <span className="absolute right-1.5 text-[8px] sm:text-[9px] font-extrabold text-slate-400">
          {isMove ? 'R' : 'E'}
        </span>

        {/* Concentric Guide Ring */}
        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-dashed border-slate-300/60 pointer-events-none" />

        {/* Thumb Knob */}
        <div
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          }}
          className={`absolute w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shadow-lg border border-white/40 pointer-events-none ${
            isMove
              ? 'bg-linear-to-tr from-emerald-900 via-emerald-800 to-teal-600 shadow-emerald-950/40'
              : 'bg-linear-to-tr from-slate-900 via-slate-800 to-teal-700 shadow-slate-950/40'
          }`}
        >
          {isMove ? (
            <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 rotate-45" />
          ) : (
            <Move className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
          )}
        </div>
      </div>

      {/* Pill Badge */}
      <span className="mt-1 text-[9px] sm:text-[10px] font-bold text-slate-700 bg-white/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/70 shadow-xs flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${isMove ? 'bg-emerald-500' : 'bg-teal-500'}`} />
        {badge}
      </span>
    </div>
  );
}

export function ExploreJoystick() {
  const setCameraOrbitDelta = useExploreStore((s) => s.setCameraOrbitDelta);
  const setCameraMoveDelta = useExploreStore((s) => s.setCameraMoveDelta);
  const autoRotate360 = useExploreStore((s) => s.autoRotate360);
  const toggleAutoRotate360 = useExploreStore((s) => s.toggleAutoRotate360);
  const dualSticksEnabled = useExploreStore((s) => s.dualSticksEnabled);
  const toggleDualSticks = useExploreStore((s) => s.toggleDualSticks);

  // When in single stick mode, user can toggle between 'orbit' and 'move'
  const [singleStickMode, setSingleStickMode] = useState<'orbit' | 'move'>('orbit');

  // Handle zoom in / out
  const handleZoom = useCallback((direction: number) => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.dispatchEvent(
        new WheelEvent('wheel', {
          deltaY: direction * 120,
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }, []);

  return (
    <>
      {/* LEFT JOYSTICK: World Move (rendered when Dual Sticks is ON) */}
      {dualSticksEnabled && (
        <div className="absolute bottom-20 left-4 sm:left-6 z-40 select-none pointer-events-auto flex flex-col items-center gap-2 animate-in fade-in duration-200">
          <div className="bg-white/85 backdrop-blur-xl px-2.5 py-1 rounded-2xl border border-white/80 shadow-md text-[10px] font-bold text-emerald-800 flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-600" />
            <span>Move World</span>
          </div>

          <JoystickPad
            mode="move"
            title="Move World"
            badge="Left Stick: Move"
            onDeltaChange={setCameraMoveDelta}
          />
        </div>
      )}

      {/* RIGHT JOYSTICK: 360° Orbit (or switchable Orbit/Move in single-stick mode) */}
      <div className="absolute bottom-20 right-3 sm:right-6 z-40 select-none pointer-events-auto flex flex-col items-end sm:items-center gap-2">
        {/* Quick Action Top Bar (Modes, Auto-Rotate & Zoom Buttons) */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-white/85 shadow-lg shadow-slate-900/10">
          {/* Dual Stick Toggle */}
          <button
            onClick={toggleDualSticks}
            title={dualSticksEnabled ? 'Switch to Single Stick' : 'Enable Dual Joysticks (Move + Orbit)'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
              dualSticksEnabled
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden xs:inline">{dualSticksEnabled ? 'Dual' : '2-Stick'}</span>
          </button>

          {/* If Single Stick, allow toggling between Orbit and Move */}
          {!dualSticksEnabled && (
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl">
              <button
                onClick={() => {
                  setSingleStickMode('orbit');
                  setCameraMoveDelta({ x: 0, y: 0 });
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  singleStickMode === 'orbit'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                360°
              </button>
              <button
                onClick={() => {
                  setSingleStickMode('move');
                  setCameraOrbitDelta({ x: 0, y: 0 });
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  singleStickMode === 'move'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Move
              </button>
            </div>
          )}

          {/* Auto 360° Orbit Toggle */}
          <button
            onClick={toggleAutoRotate360}
            title="Toggle Auto 360° Orbit"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
              autoRotate360
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate360 ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360°</span>
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(-1)}
            title="Zoom In"
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-all active:scale-95"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(1)}
            title="Zoom Out"
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-all active:scale-95"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Joystick Pad */}
        <JoystickPad
          mode={dualSticksEnabled ? 'orbit' : singleStickMode}
          title={
            dualSticksEnabled
              ? '360° Orbit'
              : singleStickMode === 'move'
              ? 'Move World'
              : '360° Orbit'
          }
          badge={
            dualSticksEnabled
              ? 'Right Stick: 360°'
              : singleStickMode === 'move'
              ? 'Joystick: Move World'
              : 'Joystick: 360° Orbit'
          }
          onDeltaChange={
            dualSticksEnabled
              ? setCameraOrbitDelta
              : singleStickMode === 'move'
              ? setCameraMoveDelta
              : setCameraOrbitDelta
          }
        />
      </div>
    </>
  );
}
