import React, { useState, useEffect } from 'react';
import { MosqueConfig, CameraPreset } from './types';
import { DEFAULT_CONFIG } from './data/initialHotspots';
import { MosqueCanvas3D } from './components/MosqueCanvas3D';
import { MosqueConfigModal } from './components/MosqueConfigModal';
import { ControlOverlay } from './components/ControlOverlay';

const STORAGE_CONFIG_KEY = 'masjid_as_safar_config_arch_v1';

export default function App() {
  const [config, setConfig] = useState<MosqueConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved config', e);
    }
    return DEFAULT_CONFIG;
  });

  // UI States
  const [isInterior, setIsInterior] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [focusPosition, setFocusPosition] = useState<[number, number, number] | null>(null);

  // Persist config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config', e);
    }
  }, [config]);

  // Camera presets
  const handleSelectPreset = (preset: CameraPreset) => {
    switch (preset) {
      case 'mihrab':
        setIsInterior(true);
        setFocusPosition([0, 1.8, 9.2]);
        break;
      case 'backDoor':
        setIsInterior(true);
        setFocusPosition([0, 1.8, -9.0]);
        break;
      case 'leftDoor':
        setIsInterior(true);
        setFocusPosition([-6.0, 1.8, -3.2]);
        break;
      case 'rightDoor':
        setIsInterior(true);
        setFocusPosition([6.0, 1.8, -3.2]);
        break;
      case 'topView':
        setIsInterior(false);
        setFocusPosition([0, 26, 0.1]);
        break;
      case 'exterior':
        setIsInterior(false);
        setFocusPosition([0, 2.0, 0]);
        break;
      case 'interior':
        setIsInterior(true);
        setFocusPosition([0, 1.8, 1.5]);
        break;
    }
  };

  const handleCycleTimeOfDay = () => {
    const sequence: ('day' | 'sunset' | 'night')[] = ['day', 'sunset', 'night'];
    const currIdx = sequence.indexOf(config.timeOfDay);
    const nextTime = sequence[(currIdx + 1) % sequence.length];
    setConfig(prev => ({ ...prev, timeOfDay: nextTime }));
  };

  const handleResetView = () => {
    setFocusPosition(isInterior ? [0, 2.4, 0.5] : [0, 2.0, 0]);
  };

  const handleToggleQibla = () => {
    setConfig(prev => ({ ...prev, showQibla: !prev.showQibla }));
  };

  const handleOrientQibla = () => {
    setFocusPosition([0, isInterior ? 1.8 : 2.5, 9.5]);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_CONFIG_KEY);
  };

  const handleUpdateConfig = (cfg: Partial<MosqueConfig>) => {
    setConfig(prev => ({ ...prev, ...cfg }));
  };

  return (
    <div className="w-screen h-screen bg-white font-sans relative overflow-hidden select-none">
      {/* 100% Fullscreen 3D Canvas of the Mosque Building */}
      <main className="w-full h-full relative overflow-hidden">
        <MosqueCanvas3D
          hotspots={[]}
          config={config}
          isInterior={isInterior}
          selectedHotspotId={null}
          onSelectHotspot={() => {}}
          focusPosition={focusPosition}
        />

        {/* Minimal On-Demand Controls (Hanya muncul jika diklik) */}
        <ControlOverlay
          isInterior={isInterior}
          onToggleInterior={() => setIsInterior(prev => !prev)}
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onCycleTimeOfDay={handleCycleTimeOfDay}
          onResetView={handleResetView}
          onSelectPreset={handleSelectPreset}
          onToggleQibla={handleToggleQibla}
          onOrientQibla={handleOrientQibla}
          onOpenArchSettings={() => setIsConfigModalOpen(true)}
        />
      </main>

      {/* Architecture & 3D Model Configuration Modal */}
      <MosqueConfigModal
        isOpen={isConfigModalOpen}
        config={config}
        onClose={() => setIsConfigModalOpen(false)}
        onUpdateConfig={newConfig => setConfig(newConfig)}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}


