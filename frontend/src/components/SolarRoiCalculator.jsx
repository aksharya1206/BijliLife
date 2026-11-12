import React, { useState, useEffect } from 'react';
import { Sun, IndianRupee, AreaChart as AreaChartIcon, ShieldCheck, ArrowRight, Sparkles, CloudSun, Compass, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { fetchSolarRoi, fetchSolarWeather } from '../utils/api';

export default function SolarRoiCalculator({ onNavigateToVendors }) {
  const { activeBill, awardSparks } = useApp();
  const [roofArea, setRoofArea] = useState(400);
  const [city, setCity] = useState('Ahmedabad');
  const [roiData, setRoiData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];

  // Recalculate ROI on roof area or city change
  useEffect(() => {
    let isMounted = true;
    const units = activeBill?.units_consumed || 320;
    const load = activeBill?.sanctioned_load_kw || 4.0;
    const discom = activeBill?.discom_name || 'UGVCL';

    fetchSolarRoi(roofArea, units, load, discom, city).then(data => {
      if (isMounted) setRoiData(data);
    });

    fetchSolarWeather(city).then(w => {
      if (isMounted) setWeatherData(w);
    });

    return () => { isMounted = false; };
  }, [roofArea, city, activeBill]);

  return (
    <div className="space-y-6">
      
      {/* PM Surya Ghar & Gujarat Solar Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-emerald-950/30 border border-amber-500/30 shadow-xl space-y-4 glow-amber">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sun className="w-7 h-7 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  PM Surya Ghar: Muft Bijli Yojana 2026
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Gujarat 120 kWh/kW/mo Yield
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Calculate rooftop solar capacity, central financial assistance (CFA) subsidy up to ₹78,000, and surplus export buyback at ₹2.25/unit under GUVNL regulations.
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-gray-400 font-medium">Gujarat Region:</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Weather & Solar Irradiance Telemetry */}
        {weatherData && (
          <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span className="text-gray-300 font-semibold">{weatherData.weather_condition} ({weatherData.ambient_temp_c}°C)</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px]">
              <span>GHI: <strong className="text-amber-400">{weatherData.ghi_irradiance_wm2} W/m²</strong></span>
              <span>UV Index: <strong className="text-purple-400">{weatherData.uv_index}</strong></span>
              <span>Est. Daily Yield: <strong className="text-emerald-400">{weatherData.estimated_today_generation_per_kw} kWh/kW</strong></span>
            </div>
            <span className="text-[10px] text-gray-500 italic hidden sm:inline">Source: {weatherData.source}</span>
          </div>
        )}
      </div>

      {/* Interactive Rooftop Sizing Slider */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Available Shadow-Free Rooftop Area
              <span className="text-xs text-gray-400 font-normal">
                (Rule: 1 kW requires ~100 sq.ft)
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Drag to match your terrace or roof footprint.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-amber-400">{roofArea}</span>
            <span className="text-xs text-gray-400 ml-1">sq.ft</span>
          </div>
        </div>

        <input
          type="range"
          min="150"
          max="1500"
          step="50"
          value={roofArea}
          onChange={(e) => setRoofArea(Number(e.target.value))}
          className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-mono px-1">
          <span>150 sq.ft (1.5 kW max)</span>
          <span>400 sq.ft (Typical 3 kW home terrace)</span>
          <span>1,500 sq.ft (Society rooftop)</span>
        </div>
      </div>

      {/* Key Financial Summary Cards */}
      {roiData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Recommended System</div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {roiData.recommended_kw} <span className="text-xs font-sans text-gray-300">kW</span>
            </div>
            <div className="text-[11px] text-gray-400">
              Gen: {roiData.monthly_generation_kwh} kWh/mo
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <div className="text-[10px] uppercase font-bold text-amber-400">PM Surya Ghar Subsidy</div>
            <div className="text-2xl font-black font-mono text-amber-400">
              ₹{roiData.pm_surya_ghar_subsidy.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-300">
              Direct Central Bank Transfer
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Net Consumer Investment</div>
            <div className="text-2xl font-black font-mono text-white">
              ₹{roiData.net_consumer_investment.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-gray-400">
              Gross: ₹{roiData.gross_system_cost.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-1">
            <div className="text-[10px] uppercase font-bold text-teal-400 flex items-center justify-between">
              <span>Payback Period</span>
              <span className="text-xs font-bold text-teal-300">Fast ROI</span>
            </div>
            <div className="text-2xl font-black font-mono text-teal-400">
              {roiData.payback_years} <span className="text-xs font-sans">Years</span>
            </div>
            <div className="text-[11px] text-teal-300">
              Saves ₹{roiData.annual_savings.toLocaleString('en-IN')}/year
            </div>
          </div>
        </div>
      )}

      {/* 25-Year Recharts Projection Chart */}
      {roiData && (
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                25-Year Cumulative Power Cost Comparison
              </h3>
              <p className="text-xs text-gray-400">
                Comparing grid electricity bills (with 3.5% inflation) vs PM Surya Ghar rooftop solar.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">25-Year Net Profit:</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                +₹{roiData.twenty_five_year_savings.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData.projections} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" tickFormatter={(v) => `Yr ${v}`} />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="cost_without_solar" name="Without Solar (Grid Bills)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost_with_solar" name="With PM Surya Ghar" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Environmental Offset & CTA */}
      {roiData && (
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Lifetime Carbon Offset: {roiData.lifetime_co2_offset_tonnes} Tonnes CO₂
              </div>
              <div className="text-xs text-gray-400">
                Equivalent to planting <strong>{roiData.equivalent_trees_planted.toLocaleString('en-IN')} mature trees</strong> in Gujarat.
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToVendors}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition hover:scale-105 active:scale-95"
          >
            Find GEDA-Empanelled EPC Vendors <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
