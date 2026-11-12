import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchBillSample, uploadBillFile } from '../utils/api';

export default function BillUploadModal() {
  const { isBillModalOpen, setIsBillModalOpen, updateBillData, activeBill } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);

  if (!isBillModalOpen) return null;

  const sampleBills = [
    {
      id: 'sample_ugvcl',
      title: 'UGVCL Residential Bill',
      subtitle: 'Gandhinagar Urban (320 Units • 4 kW)',
      badge: 'UGVCL',
      color: 'border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5'
    },
    {
      id: 'sample_pgvcl',
      title: 'PGVCL Urban Bill',
      subtitle: 'Rajkot City East (180 Units • 3 kW)',
      badge: 'PGVCL',
      color: 'border-amber-500/40 hover:border-amber-500 bg-amber-500/5'
    },
    {
      id: 'sample_torrent',
      title: 'Torrent Power Bill',
      subtitle: 'Ahmedabad Navrangpura (450 Units • 6 kW)',
      badge: 'Torrent',
      color: 'border-cyan-500/40 hover:border-cyan-500 bg-cyan-500/5'
    },
    {
      id: 'sample_dgvcl',
      title: 'DGVCL Solar Prosumer Bill',
      subtitle: 'Surat Adajan (210 Units • 3 kW)',
      badge: 'DGVCL',
      color: 'border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/5'
    }
  ];

  const simulateProcessing = async (fetchPromise) => {
    setIsProcessing(true);
    setProcessingStage('Reading binary document...');
    await new Promise(r => setTimeout(r, 400));

    setProcessingStage('Extracting DISCOM, 11-digit Consumer ID & Load (kW)...');
    await new Promise(r => setTimeout(r, 450));

    setProcessingStage('Applying GERC FY26 Telescopic Slabs & FPPPA ₹2.50/unit...');
    const result = await fetchPromise;
    await new Promise(r => setTimeout(r, 350));

    setProcessingStage('Parsing complete!');
    setIsProcessing(false);
    setParsedPreview(result);
  };

  const handleSampleClick = async (sampleId) => {
    await simulateProcessing(fetchBillSample(sampleId));
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processSelectedFile(files[0]);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await simulateProcessing(uploadBillFile(formData));
  };

  const handleApplyToDashboard = () => {
    if (parsedPreview) {
      updateBillData(parsedPreview);
    }
    setIsBillModalOpen(false);
    setParsedPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Gujarat DISCOM Bill Upload & Parser
              </h2>
              <p className="text-xs text-gray-400">
                Supports PGVCL, UGVCL, DGVCL, MGVCL, and Torrent Power (PDF / PNG / JPG)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsBillModalOpen(false);
              setParsedPreview(null);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Parsing State Screen */}
          {isProcessing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-[#111827]">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Extracting DISCOM Telemetry</h3>
                <p className="text-xs font-mono text-emerald-400 animate-pulse">{processingStage}</p>
              </div>
            </div>
          ) : parsedPreview ? (
            /* Parsed Success Preview Screen */
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Verified DISCOM Bill: {parsedPreview.discom_name}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Live Matched
                    </span>
                  </h4>
                  <p className="text-xs text-gray-300">
                    Consumer No: <span className="font-mono text-emerald-300 font-bold">{parsedPreview.consumer_number}</span> • Name: {parsedPreview.customer_name}
                  </p>
                </div>
              </div>

              {/* Extraction Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Consumption</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {parsedPreview.units_consumed} <span className="text-xs font-sans text-gray-300">kWh</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Sanctioned Load</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                    {parsedPreview.sanctioned_load_kw} <span className="text-xs font-sans text-gray-300">kW</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Calculated Total</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    ₹{parsedPreview.tariff_calculation.total_bill.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Effective Marginal</div>
                  <div className="text-lg font-bold text-purple-400 font-mono mt-0.5">
                    ₹{parsedPreview.tariff_calculation.effective_marginal_rate}/u
                  </div>
                </div>
              </div>

              {/* Slabs Breakdown Card */}
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
                <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                  <span>GERC Telescopic Slab Calculation</span>
                  <span className="text-[11px] text-emerald-400 font-normal">FPPPA: ₹2.50/u • Duty: 15%</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {parsedPreview.tariff_calculation.slab_breakdown.map((slab, idx) => (
                    <div key={idx} className="flex items-center justify-between text-gray-400 py-0.5 border-b border-gray-800/50 last:border-0">
                      <span>{slab.slab_name} ({slab.slab_range})</span>
                      <span className="font-mono text-gray-200">
                        {slab.units_in_slab} units × ₹{slab.rate_per_unit} = <span className="text-white font-semibold">₹{slab.amount}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setParsedPreview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  Choose Another
                </button>
                <button
                  onClick={handleApplyToDashboard}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition hover:scale-105"
                >
                  Apply to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload & Sample Selector Screen */
            <>
              {/* Drag and Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/40'
                }`}
              >
                <input
                  type="file"
                  id="bill-file-input"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <label htmlFor="bill-file-input" className="cursor-pointer block space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white hover:text-emerald-400 transition">
                      Drop your Gujarat DISCOM Bill here, or <span className="text-emerald-400 underline">browse files</span>
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports PDF or Image from PGVCL, UGVCL, DGVCL, MGVCL, or Torrent Power
                    </p>
                  </div>
                </label>
              </div>

              {/* Sample Quick-Load Grid */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Quick-Load Verified Gujarat Sample Bills
                  </span>
                  <span className="text-[11px] text-gray-500">1-click instant demo loading</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sampleBills.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSampleClick(sample.id)}
                      className={`text-left p-3 rounded-xl border transition-all text-xs group flex items-start justify-between ${sample.color}`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-1.5">
                          {sample.title}
                        </div>
                        <div className="text-[11px] text-gray-400">{sample.subtitle}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        {sample.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Disclaimer */}
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-start gap-2.5 text-[11px] text-gray-400">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Bill parsing executes securely using regex pattern matchers verified against GERC FY26 residential tariff order.
                </span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

