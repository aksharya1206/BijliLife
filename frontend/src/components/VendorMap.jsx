import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star, Phone, Mail, Award, CheckCircle2, ShieldCheck, Sun, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchGedaVendors, requestSolarQuote } from '../utils/api';

// Create custom SVG Leaflet Marker icon to guarantee 100% reliable rendering without broken pngs
const createCustomMarkerIcon = (isSelected = false) => {
  const color = isSelected ? '#f59e0b' : '#10b981';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
      <path fill="${color}" stroke="#0b0f19" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
};

export default function VendorMap() {
  const { user, awardSparks } = useApp();
  const [vendors, setVendors] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeVendor, setActiveVendor] = useState(null);
  const [quoteModalVendor, setQuoteModalVendor] = useState(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchGedaVendors().then(data => {
      if (isMounted) {
        setVendors(data);
        if (data.length > 0) setActiveVendor(data[0]);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const cities = ['All', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];

  const filteredVendors = selectedCity === 'All'
    ? vendors
    : vendors.filter(v => v.city.toLowerCase() === selectedCity.toLowerCase());

  // Center coordinate for Gujarat (Ahmedabad region)
  const mapCenter = [22.8000, 72.0000];

  const handleOpenQuoteModal = (vendor) => {
    setQuoteModalVendor(vendor);
    setQuoteNotes('');
  };

  const handleSendQuote = async () => {
    if (!quoteModalVendor) return;
    setIsSubmittingQuote(true);

    const payload = {
      vendor_id: quoteModalVendor.id,
      roof_area_sqft: 400.0,
      proposed_kw: 3.0,
      consumer_notes: quoteNotes || "Please survey rooftop for 3kW PM Surya Ghar setup."
    };

    const res = await requestSolarQuote(payload);
    setIsSubmittingQuote(false);

    awardSparks(200, 5.0, 6.0, `☀️ Solar site survey booked with ${quoteModalVendor.name}! +200 LiFE Sparks credited.`);
    setQuoteModalVendor(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 to-[#111827] border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              GEDA-Empanelled Solar EPC GIS Directory
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              GEDA Verified
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Empanelled turnkey installers authorized for PM Surya Ghar subsidy disbursement across Gujarat.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCity === c
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Vendor Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Interactive Leaflet Map Container (7 Cols) */}
        <div className="lg:col-span-7 h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative">
          <MapContainer
            center={mapCenter}
            zoom={7}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            {/* CartoDB Dark Matter tiles for ultra-modern aesthetic */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {filteredVendors.map(vendor => (
              <Marker
                key={vendor.id}
                position={[vendor.latitude, vendor.longitude]}
                icon={createCustomMarkerIcon(activeVendor?.id === vendor.id)}
                eventHandlers={{
                  click: () => setActiveVendor(vendor),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-xs text-gray-100">
                    <div className="font-bold text-white flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {vendor.name}
                    </div>
                    <div className="text-[11px] text-gray-400">{vendor.city} • {vendor.geda_empanelment_id}</div>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {vendor.rating} ({vendor.installations_count}+ installs)
                    </div>
                    <button
                      onClick={() => handleOpenQuoteModal(vendor)}
                      className="w-full mt-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[11px] transition"
                    >
                      Request Free Site Survey
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-700 text-[11px] text-gray-300 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> GEDA Empanelled EPC
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Selected Installer
            </div>
          </div>
        </div>

        {/* Selected Vendor Cards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 h-[420px] sm:h-[480px] overflow-y-auto pr-1">
          {filteredVendors.map(v => {
            const isSelected = activeVendor?.id === v.id;

            return (
              <div
                key={v.id}
                onClick={() => setActiveVendor(v)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md glow-green'
                    : 'bg-[#111827] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {v.name}
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    </h3>
                    <div className="text-[11px] text-gray-400 mt-0.5">{v.address}</div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {v.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-800/80">
                  <span className="font-mono text-emerald-400">{v.installations_count}+ Verified Installs</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                    {v.geda_empanelment_id}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${v.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition text-xs flex items-center gap-1"
                    title="Call Vendor"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenQuoteModal(v);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    Request Free Site Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quote Request Modal */}
      {quoteModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Request Free Solar Rooftop Survey
                </h3>
              </div>
              <button
                onClick={() => setQuoteModalVendor(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
                <div className="text-gray-400 font-semibold">Selected GEDA EPC Vendor:</div>
                <div className="text-sm font-bold text-white">{quoteModalVendor.name}</div>
                <div className="text-[11px] text-emerald-400">{quoteModalVendor.geda_empanelment_id} • {quoteModalVendor.city}</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                <span>Citizen Incentive Reward:</span>
                <span className="font-bold flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> +200 LiFE Sparks
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Notes for Solar Engineer (Optional):</label>
                <textarea
                  rows="3"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="e.g. 400 sq.ft terrace in Bodakdev, currently on UGVCL 4 kW load. Looking for 3kW setup with net metering."
                  className="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
              <button
                onClick={() => setQuoteModalVendor(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingQuote}
                onClick={handleSendQuote}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/40"
              >
                {isSubmittingQuote ? 'Dispatching...' : 'Confirm Site Survey (+200 Sparks)'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
