import React, { useState, useEffect } from 'react';
import { IndianRupee, Thermometer, Wind, Zap, ShieldAlert, Sparkles, Check, ArrowDownRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAcOptimization, fetchApplianceBurnRates } from '../utils/api';

export default function RupeeMirror() {
  const { activeBill, awardSparks } = useApp();
  const marginalRate = activeBill?.tariff_calculation?.marginal_rate || 5.20;
  const effectiveMarginalRate = activeBill?.tariff_calculation?.effective_marginal_rate || 8.48;

  // AC Temperature Slider State
  const [acTemp, setAcTemp] = useState(24);
  const [dailyHours, setDailyHours] = useState(8);
  const [acStats, setAcStats] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [vampireCut, setVampireCut] = useState(false);

  // Recalculate AC stats on slider change
  useEffect(() => {
    let isMounted = true;
    calculateAcOptimization(acTemp, dailyHours, marginalRate).then(data => {
      if (isMounted) setAcStats(data);
    });
    return () => { isMounted = false; };
  }, [acTemp, dailyHours, marginalRate]);

  // Load Appliance List
  useEffect(() => {
    let isMounted = true;
    fetchApplianceBurnRates(marginalRate).then(data => {
      if (isMounted) setAppliances(data);
    });
    return () => { isMounted = false; };
  }, [marginalRate]);

  const handleClaimAcSparks = () => {
    if (acTemp >= 24) {
      awardSparks(80, acStats?.monthly_co2_kg_saved || 1.2, 1.4, `✨ AC locked at ${acTemp}°C! +80 LiFE Sparks added to your ledger.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header with Marginal Rate Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#111827] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <IndianRupee className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              Rupee-per-Hour Mirror
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live Tariff: {activeBill.discom_name}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Translates abstract kWh consumption into real-time ₹/hour burn rates. Every unit saved at your peak slab saves <span className="text-emerald-400 font-bold font-mono">₹{effectiveMarginalRate}/kWh</span> (including GERC FPPPA & duty).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-right">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Marginal Slab Rate</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              ₹{marginalRate.toFixed(2)} <span className="text-xs text-gray-400 font-sans">/kWh</span>
            </div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-right">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">With FPPPA + Duty</div>
            <div className="text-lg font-bold text-purple-400 font-mono">
              ₹{effectiveMarginalRate.toFixed(2)} <span className="text-xs text-gray-400 font-sans">/kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero: 24°C Mission LiFE AC Optimization Simulator */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-gray-700/80 shadow-xl space-y-6 glow-green">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                1.5T Inverter AC LiFE Optimization Simulator
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  acTemp >= 24 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {acTemp >= 24 ? 'Mission LiFE Compliant' : 'High Compressor Strain'}
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Rule of Thumb: Every 1°C increase above 18°C cuts cooling electricity draw by ~6.5%.
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setAcTemp(18)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                acTemp === 18 ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              18°C (Chill)
            </button>
            <button
              onClick={() => setAcTemp(24)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-bold transition flex items-center gap-1 ${
                acTemp === 24 ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/40' : 'bg-gray-800 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
              }`}
            >
              <Sparkles className="w-3 h-3" /> 24°C (LiFE)
            </button>
            <button
              onClick={() => setAcTemp(26)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                acTemp === 26 ? 'bg-teal-500/20 text-teal-300 border-teal-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              26°C (Eco)
            </button>
          </div>
        </div>

        {/* Temperature Interactive Slider Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400">Selected Temperature:</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black font-mono transition-colors ${
                acTemp >= 24 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {acTemp}°C
              </span>
              <span className="text-gray-400 text-xs">
                ({dailyHours} hrs/day • 30 days)
              </span>
            </div>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="16"
              max="28"
              step="1"
              value={acTemp}
              onChange={(e) => setAcTemp(Number(e.target.value))}
              className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1 px-1">
              <span>16°C (Maximum Power)</span>
              <span className="text-emerald-400 font-bold">24°C (LiFE Default)</span>
              <span>28°C (Minimal)</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Metric Cards */}
        {acStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Active Power Draw</div>
              <div className="text-xl font-black font-mono text-white flex items-baseline gap-1">
                {acStats.power_kw} <span className="text-xs font-sans text-gray-400">kW</span>
              </div>
              <div className="text-[11px] text-amber-400 font-medium">
                ₹{acStats.hourly_cost_rupees}/hour active burn
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Monthly Cooling Cost</div>
              <div className="text-xl font-black font-mono text-gray-200">
                ₹{acStats.monthly_cost_rupees.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-gray-400">
                vs ₹{(acStats.monthly_cost_rupees + acStats.monthly_savings_rupees).toFixed(0)} at 18°C
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-between">
                <span>Monthly Savings</span>
                <span className="text-xs font-black">-{acStats.percentage_savings}%</span>
              </div>
              <div className="text-xl font-black font-mono text-emerald-400">
                ₹{acStats.monthly_savings_rupees.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-300">
                {acStats.monthly_units_saved_kwh} units saved / mo
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1">
              <div className="text-[10px] uppercase font-bold text-teal-400">Carbon & Trees</div>
              <div className="text-xl font-black font-mono text-teal-300">
                {acStats.monthly_co2_kg_saved} <span className="text-xs font-sans">kg CO₂</span>
              </div>
              <div className="text-[11px] text-teal-400">
                🌳 {acStats.trees_equivalent_annual} trees annual eq.
              </div>
            </div>
          </div>
        )}

        {/* Live Recommendation & Action Bar */}
        <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{acStats?.recommendation}</span>
          </div>

          {acTemp >= 24 && (
            <button
              onClick={handleClaimAcSparks}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Lock 24°C & Claim +80 Sparks
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Appliance Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Appliance Rupee-per-Hour Matrix</h3>
            <p className="text-xs text-gray-400">
              Live burn rates calibrated against your active DISCOM marginal slab (₹{marginalRate} + ₹2.50 FPPPA).
            </p>
          </div>
          <span className="text-xs text-gray-400">{appliances.length} calibrated devices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {appliances.map((app) => (
            <div
              key={app.appliance_id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                app.is_life_optimized
                  ? 'bg-gray-900/80 border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                    {app.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{app.name}</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black font-mono text-emerald-400">
                    ₹{app.hourly_cost_rupees.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">/ hour</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-800">
                <span className="font-mono">{app.power_watts} Watts</span>
                <span className="text-[11px] font-mono text-teal-400">
                  {app.hourly_co2_kg.toFixed(3)} kg CO₂/hr
                </span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                {app.description}
              </p>

              {app.life_alternative && (
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>💡 {app.life_alternative}</span>
                  {app.hourly_savings_rupees > 0 && (
                    <span className="font-bold font-mono text-emerald-400 shrink-0 ml-1">
                      -₹{app.hourly_savings_rupees.toFixed(2)}/hr
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
