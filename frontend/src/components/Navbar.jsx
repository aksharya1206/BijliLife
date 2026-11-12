import React, { useState } from 'react';
import { Zap, Sparkles, Building2, FileText, ChevronDown, Leaf, ShieldCheck, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, activeBill, setIsBillModalOpen, switchDiscom } = useApp();
  const [isDiscomDropdownOpen, setIsDiscomDropdownOpen] = useState(false);

  const discomList = ['UGVCL', 'PGVCL', 'DGVCL', 'MGVCL', 'Torrent Power'];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Mission LiFE / GEDA Badges */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-900/30">
              <Zap className="w-5 h-5 fill-current text-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-[#0b0f19]">
                <Leaf className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                  BijliLiFE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> GEDA Track 1
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Mission LiFE Citizen Energy Engagement • HC26-GEDA01
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'overview'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('rupee-mirror')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'rupee-mirror'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              Rupee Mirror
            </button>
            <button
              onClick={() => setActiveTab('flash-missions')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'flash-missions'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              Flash Quests
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'leaderboard'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              Society Derby
            </button>
            <button
              onClick={() => setActiveTab('solar-roi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'solar-roi'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              PM Surya Ghar
            </button>
            <button
              onClick={() => setActiveTab('vendor-map')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'vendor-map'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
            >
              GEDA GIS Map
            </button>
          </nav>

          {/* Right Action Bar: DISCOM, Sparks Badge, Upload Bill */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* DISCOM Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDiscomDropdownOpen(!isDiscomDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900/90 border border-gray-700 hover:border-emerald-500/50 text-xs text-gray-200 transition"
                title="Switch Gujarat DISCOM"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-semibold">{user.discom}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isDiscomDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-800">
                    Gujarat DISCOM
                  </div>
                  {discomList.map((disc) => (
                    <button
                      key={disc}
                      onClick={() => {
                        switchDiscom(disc);
                        setIsDiscomDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition flex items-center justify-between ${user.discom === disc
                          ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      {disc}
                      {user.discom === disc && <span className="text-emerald-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sparks Live Ledger Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/10">
              <Sparkles className="w-4 h-4 fill-amber-400 animate-bounce-subtle" />
              <div className="text-xs">
                <span className="font-extrabold text-sm text-amber-300">{user.sparksBalance}</span>
                <span className="text-[10px] ml-1 text-amber-400/80 font-medium">Sparks</span>
              </div>
            </div>

            {/* Upload Bill Trigger */}
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition hover:scale-105 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Bill</span>
            </button>

            {/* User Avatar & Flat Indicator */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                AP
              </div>
              <div className="text-left text-[11px] leading-tight">
                <div className="text-gray-200 font-medium truncate max-w-[120px]">{user.name}</div>
                <div className="text-emerald-400 flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5" />
                  {user.flatNumber}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

