'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Check, Building2 } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';
import { SITES } from '@/data/sites';
import { CURRENT_USER } from '@/data/user';
import { simEngine } from '@/sim/engine';
import { selectSiteSummary } from '@/sim/selectors';

export function TopNav() {
  const activeSite = useSimStore((s) => s.activeSite);
  const selectSite = useSimStore((s) => s.selectSite);
  const stats = useSimStore((s) => s.stats);

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [simTimeStr, setSimTimeStr] = useState('09:43');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const siteDropdownRef = useRef<HTMLDivElement>(null);

  // Format sim time as HH:MM
  useEffect(() => {
    const totalSeconds = stats.simTimeSeconds;
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setSimTimeStr(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }, [stats.simTimeSeconds]);

  // Global '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setSiteDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(e.target as Node)) {
        setSiteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Occupancy and bay counts derived strictly from sim engine
  const activeSummary = selectSiteSummary(simEngine, activeSite.id);
  const occupancyPct = activeSummary.occupancyPct;
  const busyBays = activeSummary.busyBaysCount;

  return (
    <header className="absolute top-3 left-4 right-4 z-40 flex items-center justify-between select-none pointer-events-none">
      {/* Left: MediCity Brand Logo & Mode Switch */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/70 shadow-lg shadow-blue-900/5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#2F5BEA] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7.5V16.5L12 22L22 16.5V7.5L12 2ZM12 4.4L18.8 8.1L12 11.9L5.2 8.1L12 4.4ZM4.2 9.8L10.9 13.5V19.8L4.2 16.1V9.8ZM13.1 19.8V13.5L19.8 9.8V16.1L13.1 19.8Z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
              MediCity
            </span>
            <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">
              Control Room
            </span>
          </div>
        </div>

        <a
          href="/explore"
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2.5 rounded-2xl shadow-md text-xs font-bold transition-all active:scale-95"
        >
          <span>Explore Campus</span>
          <span className="px-1.5 py-0.2 bg-teal-500 text-[10px] rounded-md uppercase font-extrabold">3D</span>
        </a>
      </div>

      {/* Center: Search Bar with '/' shortcut */}
      <div className="pointer-events-auto relative hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="w-full relative flex items-center bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-md px-3.5 py-2.5 text-slate-700 focus-within:ring-2 focus-within:ring-[#2F5BEA]/30 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-[#2F5BEA] mr-2.5 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sites, ambulances, staff, patients, beds..."
            className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <kbd className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-200 font-mono">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Site Selector Pill, Live Clock, Bell, User Profile */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Interactive Site Selector Pill + Dropdown */}
        <div className="relative" ref={siteDropdownRef}>
          <button
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-white/70 shadow-md text-xs font-semibold text-slate-800 hover:bg-white transition-all active:scale-98"
          >
            <span className="px-2 py-0.5 rounded-md bg-[#2F5BEA] text-white text-[11px] font-bold shadow-xs">
              {activeSite.code}
            </span>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-slate-900 font-bold text-xs">{activeSite.shortName}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {occupancyPct}% occupied · {busyBays}/{activeSite.bays.length} bays
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform ${
                siteDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Site Dropdown Menu listing all 4 sites */}
          {siteDropdownOpen && (
            <div className="absolute top-12 right-0 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2F5BEA]" /> Hospital Network (4 Sites)
              </div>
              <div className="space-y-1">
                {SITES.map((site) => {
                  const isCur = site.id === activeSite.id;
                  const siteSumm = selectSiteSummary(simEngine, site.id);
                  const siteOcc = siteSumm.occupancyPct;
                  const siteBusy = siteSumm.busyBaysCount;

                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        selectSite(site.id);
                        setSiteDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                        isCur
                          ? 'bg-blue-50/90 text-[#2F5BEA] border border-blue-200/60 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            isCur ? 'bg-[#2F5BEA] text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {site.code}
                        </span>
                        <div>
                          <p className="text-xs font-bold leading-snug">{site.shortName}</p>
                          <p className="text-[10px] text-slate-400">
                            {siteOcc}% full · {siteBusy}/{site.bays.length} bays
                          </p>
                        </div>
                      </div>
                      {isCur && <Check className="w-4 h-4 text-[#2F5BEA] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live HH:MM Pill */}
        <div className="flex items-center gap-1.5 bg-emerald-50/90 backdrop-blur-xl border border-emerald-200/80 px-3 py-2 rounded-2xl shadow-sm text-xs font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live {simTimeStr}</span>
        </div>

        {/* Notification Bell with red alert dot */}
        <button
          className="relative w-9 h-9 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User Avatar + Profile from single source of truth */}
        <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-2.5 py-1.5 rounded-2xl border border-white/70 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <span>{CURRENT_USER.initials}</span>
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-bold text-slate-900">{CURRENT_USER.name}</span>
            <span className="text-[10px] text-slate-500 font-medium">{CURRENT_USER.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
