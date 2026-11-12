import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { mockDefaultBill, fetchBillSample } from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User & Society State
  const [user, setUser] = useState({
    name: "Aarav Patel",
    email: "aarav.patel@gujarat.life.gov.in",
    flatNumber: "Flat B-402",
    societyName: "Gokuldham Residency",
    ward: "Bodakdev",
    city: "Ahmedabad",
    societyRank: 1,
    discom: "UGVCL",
    consumerNumber: "21098765432",
    sparksBalance: 420,
    peakKwhShifted: 38.5,
    co2SavedKg: 27.56,
  });

  // Active Bill State
  const [activeBill, setActiveBill] = useState(mockDefaultBill);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#06b6d4', '#3b82f6', '#ffffff']
    });
  };

  const updateBillData = (billData) => {
    setActiveBill(billData);
    setUser(prev => ({
      ...prev,
      discom: billData.discom_name || prev.discom,
      consumerNumber: billData.consumer_number || prev.consumerNumber,
    }));
    showToast(`Bill from ${billData.discom_name} loaded (${billData.units_consumed} units). Tariff calculated!`, 'success');
  };

  const awardSparks = (amount, co2Kg = 1.0, kwh = 1.4, customMsg = null) => {
    setUser(prev => ({
      ...prev,
      sparksBalance: prev.sparksBalance + amount,
      co2SavedKg: +(prev.co2SavedKg + co2Kg).toFixed(2),
      peakKwhShifted: +(prev.peakKwhShifted + kwh).toFixed(2),
    }));
    triggerConfetti();
    showToast(customMsg || `🎉 +${amount} LiFE Sparks awarded! Avoided ${co2Kg} kg CO2!`, 'success');
  };

  const switchDiscom = async (discomName) => {
    const discomSampleMap = {
      'UGVCL': 'sample_ugvcl',
      'PGVCL': 'sample_pgvcl',
      'Torrent Power': 'sample_torrent',
      'DGVCL': 'sample_dgvcl',
      'MGVCL': 'sample_ugvcl'
    };
    const sampleId = discomSampleMap[discomName] || 'sample_ugvcl';
    const sample = await fetchBillSample(sampleId);
    updateBillData(sample);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeBill,
        updateBillData,
        isBillModalOpen,
        setIsBillModalOpen,
        awardSparks,
        switchDiscom,
        showToast,
        triggerConfetti,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
