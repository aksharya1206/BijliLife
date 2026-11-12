import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Building2, Trees, Sparkles, HeartHandshake, Zap, ChevronRight, Users, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchLeaderboard, cheerSociety } from '../utils/api';

export default function SocietyLeaderboard() {
  const { user, awardSparks } = useApp();
  const [activeTab, setActiveTab] = useState('derby'); // 'derby' | 'flats'
  const [data, setData] = useState(null);
  const [cheeredMap, setCheeredMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchLeaderboard().then(res => {
      if (isMounted) setData(res);
    });
    return () => { isMounted = false; };
  }, [user.sparksBalance]);

  const handleCheer = async (societyId, socName) => {
    if (cheeredMap[societyId]) return;
    setCheeredMap(prev => ({ ...prev, [societyId]: true }));
    const res = await cheerSociety(societyId);
    if (res.success) {
      awardSparks(10, 0.1, 0.15, `👏 Cheered for ${socName}! +10 LiFE Sparks awarded.`);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs flex items-center gap-1">🥇 1st</span>;
    if (rank === 2) return <span className="p-1.5 rounded-xl bg-slate-400/20 text-slate-300 border border-slate-400/40 font-bold text-xs flex items-center gap-1">🥈 2nd</span>;
    if (rank === 3) return <span className="p-1.5 rounded-xl bg-amber-700/20 text-amber-600 border border-amber-700/40 font-bold text-xs flex items-center gap-1">🥉 3rd</span>;
    return <span className="px-2.5 py-1 rounded-xl bg-gray-800 text-gray-400 font-mono text-xs font-bold">#{rank}</span>;
  };

  return (
    <div className="space-y-6">

      {/* Top Banner with Derby Metrics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/40 to-[#111827] border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Trophy className="w-7 h-7 text-amber-400 animate-bounce-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Gujarat LiFE Society Derby
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ward League FY26
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Bodakdev vs Navrangpura vs Pal vs Alkapuri. Cooperative housing societies competing to curtail peak energy and plant urban forest equivalents.
              </p>
            </div>
          </div>

          {/* User Society Status Pill */}
          <div className="px-4 py-2.5 rounded-xl bg-gray-900/90 border border-emerald-500/40 flex items-center gap-3 shrink-0">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Your Society</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                {data?.user_society_name || "Gokuldham Residency"}
                <span className="text-amber-400 font-extrabold text-xs">#1 Rank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Derby Progress Bar */}
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Cumulative Gujarat Peak Energy Curtailed:
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              32,590 kWh • ~23.3 Tonnes CO₂ Avoided
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full w-4/5 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Switchable Tabs: Inter-Society Derby vs My Society Flat Ranks */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('derby')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'derby'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
        >
          <Building2 className="w-4 h-4" /> Inter-Society Derby (Ward vs Ward)
        </button>
        <button
          onClick={() => setActiveTab('flats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'flats'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
        >
          <Users className="w-4 h-4" /> Gokuldham Residency (Flat Leaderboard)
        </button>
      </div>

      {/* Tab 1: Inter-Society Derby */}
      {activeTab === 'derby' && (
        <div className="space-y-3">
          {data?.inter_society_leagues.map((soc) => (
            <div
              key={soc.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${soc.is_user_society
                  ? 'bg-emerald-500/5 border-emerald-500/40 shadow-lg glow-green'
                  : 'bg-[#111827] border-gray-800 hover:border-gray-700'
                }`}
            >
              <div className="flex items-center gap-3.5">
                {getRankBadge(soc.rank)}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{soc.name}</h3>
                    {soc.is_user_society && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Your Society
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>Ward: <span className="text-gray-200 font-medium">{soc.ward}</span></span>
                    <span>•</span>
                    <span>City: <span className="text-gray-200 font-medium">{soc.city}</span></span>
                    <span>•</span>
                    <span>{soc.total_flats} Active Homes</span>
                  </div>
                </div>
              </div>

              {/* Society Metrics Grid */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0 justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">Total Sparks</div>
                  <div className="text-base font-black font-mono text-amber-400 flex items-center justify-end gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    {soc.total_sparks.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">Peak Shifted</div>
                  <div className="text-base font-black font-mono text-emerald-400">
                    {soc.total_kwh_shifted.toLocaleString('en-IN')} <span className="text-xs font-sans text-gray-400">kWh</span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">Forest Trees</div>
                  <div className="text-base font-black font-mono text-teal-400">
                    🌳 {soc.trees_equivalent}
                  </div>
                </div>

                {/* Cheer Button */}
                <button
                  onClick={() => handleCheer(soc.id, soc.name)}
                  disabled={cheeredMap[soc.id]}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${cheeredMap[soc.id]
                      ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30 hover:scale-105 active:scale-95'
                    }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  {cheeredMap[soc.id] ? 'Cheered!' : 'Cheer (+10)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Internal Flat Ranks */}
      {activeTab === 'flats' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
            <span>Showing top energy savers in <strong>Gokuldham Residency (Bodakdev)</strong>.</span>
            <span className="text-emerald-400 font-semibold">Your flat: B-402 (Rank #3)</span>
          </div>

          {data?.my_society_internal_ranks.map((flat) => (
            <div
              key={flat.flat_number}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${flat.is_current_user
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md glow-green'
                  : 'bg-[#111827] border-gray-800'
                }`}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(flat.rank)}
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {flat.flat_number}
                    <span className="text-xs font-normal text-gray-400">({flat.resident_name})</span>
                    {flat.is_current_user && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Shifted: <span className="font-mono text-emerald-300 font-semibold">{flat.kwh_shifted} kWh</span> • Avoided: {flat.co2_saved_kg} kg CO₂
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black font-mono text-amber-400 flex items-center gap-1 justify-end">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  {flat.sparks}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">LiFE Sparks</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

