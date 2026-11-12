import React, { useState, useEffect } from 'react';
import { Zap, Clock, Sparkles, CheckCircle2, Camera, ShieldCheck, UploadCloud, X, ArrowRight, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchChallenges, verifyChallenge } from '../utils/api';

export default function FlashMissionCard() {
  const { user, awardSparks } = useApp();
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraPhotoUrl, setCameraPhotoUrl] = useState(null);
  const [detectedTemp, setDetectedTemp] = useState(24);
  const [completedMap, setCompletedMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchChallenges().then(data => {
      if (isMounted) setChallenges(data);
    });
    return () => { isMounted = false; };
  }, []);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Local countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setChallenges(prev =>
        prev.map(ch => ({
          ...ch,
          time_remaining_seconds: Math.max(0, (ch.time_remaining_seconds || 7200) - 1)
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenVerification = (challenge) => {
    setSelectedChallenge(challenge);
    setCameraPhotoUrl(null);
    setDetectedTemp(24);
  };

  const handleSimulatePhotoSnap = () => {
    // Generate a high-tech synthetic canvas proof representing AC remote / appliance inspection
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 400, 300);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 300);

    // Simulated remote display HUD
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 40, 300, 220);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('MISSION LiFE TELEMETRY HUD', 80, 75);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 54px monospace';
    ctx.fillText(`${detectedTemp}°C`, 140, 160);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px monospace';
    ctx.fillText('ECO COOL MODE • BLDC 5-STAR', 90, 210);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '12px monospace';
    ctx.fillText(`GEO-HASH: GUJARAT_BODAKDEV_#402`, 80, 240);

    const dataUrl = canvas.toDataURL('image/png');
    setCameraPhotoUrl(dataUrl);
  };

  const handleConfirmVerification = async () => {
    if (!selectedChallenge) return;
    setIsVerifying(true);

    const res = await verifyChallenge(selectedChallenge.id, detectedTemp, cameraPhotoUrl);

    setIsVerifying(false);
    if (res.success) {
      setCompletedMap(prev => ({ ...prev, [selectedChallenge.id]: true }));
      awardSparks(res.sparks_awarded, res.co2_saved_kg, res.kwh_shifted, res.celebration_message);
      setSelectedChallenge(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Quests Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-gray-900 to-[#111827] border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Live Peak-Shaving Flash Missions</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/30">
                Peak Alert Active
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Shift high-draw appliances away from peak load hours (2 PM - 5 PM). Verify with instant photo telemetry to earn LiFE Sparks!
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] text-gray-400 uppercase font-semibold">Your Active Balance</div>
          <div className="text-xl font-extrabold text-amber-400 font-mono flex items-center justify-end gap-1">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            {user.sparksBalance} <span className="text-xs font-sans text-gray-400">Sparks</span>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((ch) => {
          const isDone = completedMap[ch.id] || ch.is_completed_today;

          return (
            <div
              key={ch.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isDone
                  ? 'bg-gray-900/40 border-gray-800 opacity-80'
                  : 'bg-[#111827] border-gray-700/80 hover:border-emerald-500/50 shadow-lg glow-green'
              }`}
            >
              <div className="space-y-3">
                
                {/* Category & Countdown */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {ch.category.replace('_', ' ')}
                  </span>
                  
                  <div className="flex items-center gap-1 font-mono text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(ch.time_remaining_seconds)}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {ch.title}
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-3">
                    {ch.description}
                  </p>
                </div>

                {/* Rewards Bar */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>+{ch.sparks_reward} Sparks</span>
                  </div>
                  <div className="text-teal-400 font-medium text-[11px]">
                    🍃 -{ch.co2_kg_reward} kg CO₂
                  </div>
                </div>

                {/* Practical Tip */}
                {ch.tips && (
                  <div className="text-[11px] text-gray-400 bg-gray-800/40 p-2 rounded-lg border border-gray-800">
                    💡 <span className="italic">{ch.tips}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                {isDone ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-gray-800 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mission Completed Today
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenVerification(ch)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition hover:scale-[1.02] active:scale-95"
                  >
                    {ch.requires_proof ? (
                      <>
                        <Camera className="w-4 h-4" /> Verify with Photo (+{ch.sparks_reward})
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Claim Mission Sparks
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Action Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Mission LiFE Optical Verification
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-gray-300">
                <span className="font-bold text-white">{selectedChallenge.title}</span>: {selectedChallenge.description}
              </div>

              {/* If AC Challenge, show temperature selector */}
              {selectedChallenge.id === 'life-ac-24' && (
                <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">AC Remote Display Temperature:</span>
                    <span className="text-lg font-black font-mono text-emerald-400">{detectedTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="28"
                    value={detectedTemp}
                    onChange={(e) => setDetectedTemp(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <p className="text-[11px] text-gray-400">
                    BEE LiFE mandate requires 24°C or above to validate rewards.
                  </p>
                </div>
              )}

              {/* Photo Snap or Upload Screen */}
              {cameraPhotoUrl ? (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 shadow-inner">
                    <img src={cameraPhotoUrl} alt="Inspection Proof" className="w-full h-44 object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Proof Captured
                    </div>
                  </div>
                  <button
                    onClick={() => setCameraPhotoUrl(null)}
                    className="text-xs text-gray-400 hover:text-white underline block"
                  >
                    Retake Photo
                  </button>
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed border-gray-700 rounded-xl text-center space-y-3 bg-gray-900/40">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-white">Capture Remote / Appliance Proof</div>
                    <p className="text-[11px] text-gray-400">
                      Snap a live photo of your remote control screen or appliance switchboard.
                    </p>
                  </div>
                  <button
                    onClick={handleSimulatePhotoSnap}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition hover:scale-105"
                  >
                    📸 Open Camera / Capture Telemetry
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={isVerifying || (selectedChallenge.requires_proof && !cameraPhotoUrl)}
                onClick={handleConfirmVerification}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition"
              >
                {isVerifying ? 'Verifying AI Proof...' : `Confirm & Earn +${selectedChallenge.sparks_reward} Sparks`}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
