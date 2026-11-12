import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BillUploadModal from './components/BillUploadModal';
import RupeeMirror from './components/RupeeMirror';
import FlashMissionCard from './components/FlashMissionCard';
import SocietyLeaderboard from './components/SocietyLeaderboard';
import SolarRoiCalculator from './components/SolarRoiCalculator';
import VendorMap from './components/VendorMap';

import {
  Zap,
  Sparkles,
  TrendingDown,
  Sun,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  Leaf,
  IndianRupee,
  CheckCircle2,
  Trophy,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const { user, activeBill, setIsBillModalOpen, toast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const tariff = activeBill?.tariff_calculation;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-gray-900 border border-emerald-500/50 shadow-2xl flex items-center gap-3 max-w-md">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div className="text-xs font-semibold text-white">
              {toast.message}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Bill Upload Modal */}
      <BillUploadModal />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* OVERVIEW / DASHBOARD VIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Citizen Welcome & Peak Shaving Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/50 via-gray-900 to-indigo-950/40 border border-gray-800 p-6 sm:p-8 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <Leaf className="w-3.5 h-3.5" /> Mission LiFE Citizen Energy Engagement
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Welcome, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user.name}</span>!
                </h1>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Your residence in <strong className="text-white">{user.societyName} ({user.flatNumber})</strong> is currently competing in the Bodakdev Ward Derby. Your marginal tariff slab is <strong className="text-emerald-400 font-mono">₹{tariff?.marginal_rate.toFixed(2)}/kWh</strong>. Curtail peak afternoon load to earn LiFE Sparks!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('rupee-mirror')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5"
                  >
                    <IndianRupee className="w-4 h-4" /> Open Rupee Mirror
                  </button>

                  <button
                    onClick={() => setIsBillModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" /> Switch / Upload Bill
                  </button>

                  <button
                    onClick={() => setActiveTab('solar-roi')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition flex items-center gap-1.5"
                  >
                    <Sun className="w-4 h-4" /> PM Surya Ghar (₹78k Subsidy)
                  </button>
                </div>
              </div>

              {/* Background Glow Ornament */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-10 bottom-4 hidden lg:block opacity-20 text-emerald-400">
                <Zap className="w-64 h-64" />
              </div>
            </div>

            {/* Live Telemetry KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Active Bill Consumption */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                  <span>Current Bill</span>
                  <span className="text-emerald-400">{activeBill.discom_name}</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {activeBill.units_consumed} <span className="text-xs font-sans text-gray-400">kWh</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center justify-between">
                  <span>Total: ₹{tariff?.total_bill.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-gray-500">{activeBill.billing_period_days} days</span>
                </div>
              </div>

              {/* Effective Marginal Rate */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                  <span>Marginal Rate</span>
                  <span className="text-purple-400">GERC FY26</span>
                </div>
                <div className="text-2xl font-black font-mono text-purple-400">
                  ₹{tariff?.effective_marginal_rate.toFixed(2)} <span className="text-xs font-sans text-gray-400">/u</span>
                </div>
                <div className="text-xs text-gray-400">
                  Includes FPPPA ₹2.50 & 15% Duty
                </div>
              </div>

              {/* LiFE Sparks Balance */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                  <span>LiFE Sparks</span>
                  <span className="text-amber-300 font-bold">Reward Ledger</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-5 h-5 fill-current" />
                  {user.sparksBalance}
                </div>
                <div className="text-xs text-amber-300">
                  Shifted: {user.peakKwhShifted} kWh away from peak
                </div>
              </div>

              {/* Carbon Avoided & Tree Equivalents */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-400 uppercase">
                  <span>CO₂ Avoided</span>
                  <span className="text-teal-300">CEA Factor</span>
                </div>
                <div className="text-2xl font-black font-mono text-teal-300">
                  {user.co2SavedKg} <span className="text-xs font-sans">kg</span>
                </div>
                <div className="text-xs text-teal-400">
                  🌳 {((user.co2SavedKg * 12) / 20).toFixed(1)} mature trees annual eq.
                </div>
              </div>

            </div>

            {/* Split Section: GERC Tariff Breakdown & Flash Mission Highlight */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Tariff Telescopic Slabs (7 Cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      GERC FY26 Telescopic Slab Breakdown
                      <span className="text-xs font-normal text-gray-400 font-mono">({activeBill.discom_name})</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Residential telescopic billing with fixed charge (₹15/kW), meter rent (₹30), and FPPPA (₹2.50/u).
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBillModalOpen(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Change Bill
                  </button>
                </div>

                <div className="space-y-2">
                  {tariff?.slab_breakdown.map((slab, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{slab.slab_name}</div>
                        <div className="text-[11px] text-gray-400">{slab.slab_range} @ ₹{slab.rate_per_unit.toFixed(2)}/kWh</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400">
                          {slab.units_in_slab} units
                        </div>
                        <div className="text-[11px] text-gray-300 font-mono">
                          ₹{slab.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Charges Row */}
                <div className="p-3.5 rounded-xl bg-gray-900/40 border border-gray-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Fixed Charges</div>
                    <div className="font-mono text-gray-200 font-bold mt-0.5">₹{tariff?.fixed_charges}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">FPPPA (₹2.50/u)</div>
                    <div className="font-mono text-amber-400 font-bold mt-0.5">₹{tariff?.fpppa_charges}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Electricity Duty (15%)</div>
                    <div className="font-mono text-gray-200 font-bold mt-0.5">₹{tariff?.electricity_duty}</div>
                  </div>
                </div>
              </div>

              {/* Peak Shaving & Society Derby Highlight (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">

                {/* Active Afternoon Peak Callout */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Gujarat Peak Window
                    </span>
                    <span className="text-xs text-amber-400 font-mono font-bold">2:00 PM - 5:00 PM</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Afternoon Thermal Shaving</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Power plants in Gujarat burn high-cost gas and coal during peak afternoon. Shifting washing machines and water heaters earns <strong className="text-amber-400">+120 Sparks</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('flash-missions')}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    View Flash Missions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Society Derby Widget */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Trophy className="w-4 h-4 text-amber-400" /> Bodakdev Ward League
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">#1 Gokuldham</span>
                  </div>

                  <p className="text-xs text-gray-400">
                    Gokuldham Residency is leading Shivalik Enclave by 1,450 Sparks! Your flat is rank #3.
                  </p>

                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition flex items-center justify-center gap-1.5"
                  >
                    Open Society Derby <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

            {/* Quick PM Surya Ghar CTA Strip */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-gray-900 to-amber-900/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Sun className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Ready to Zero Out Your Electric Bill?
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Under PM Surya Ghar 2026, rooftop solar up to 3 kW gets ₹78,000 central subsidy with 3-year payback in Gujarat.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('solar-roi')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  Calculate ROI
                </button>
                <button
                  onClick={() => setActiveTab('vendor-map')}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition"
                >
                  GEDA Vendors Map
                </button>
              </div>
            </div>

          </div>
        )}

        {/* RUPEE-PER-HOUR MIRROR VIEW */}
        {activeTab === 'rupee-mirror' && <RupeeMirror />}

        {/* FLASH MISSIONS & QUESTS VIEW */}
        {activeTab === 'flash-missions' && <FlashMissionCard />}

        {/* SOCIETY LEADERBOARD / DERBY VIEW */}
        {activeTab === 'leaderboard' && <SocietyLeaderboard />}

        {/* SOLAR ROI CALCULATOR VIEW */}
        {activeTab === 'solar-roi' && (
          <SolarRoiCalculator onNavigateToVendors={() => setActiveTab('vendor-map')} />
        )}

        {/* VENDOR GIS MAP VIEW */}
        {activeTab === 'vendor-map' && <VendorMap />}

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-gray-800 bg-[#0b0f19] mt-12 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="font-bold text-emerald-400">BijliLiFE</span> • Mission LiFE Citizen Engagement Platform
            <span className="text-gray-600">|</span>
            <span>GEDA / HC26-GEDA01</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>GERC FY26 Tariff Engine</span>
            <span>PM Surya Ghar CFA Model</span>
            <span>CEA Grid Benchmark (0.716 kg CO₂/kWh)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

