import React, { useState, useEffect, Suspense } from 'react';
import { MosqueConfig, CameraPreset } from './types';
import { DEFAULT_CONFIG } from './data/initialHotspots';
import { CanvasLoadingFallback } from './components/CanvasLoadingFallback';

import { ControlOverlay } from './components/ControlOverlay';

const MosqueCanvas3D = React.lazy(() => import('./components/MosqueCanvas3D'));
const MosqueConfigModal = React.lazy(() => import('./components/MosqueConfigModal').then(m => ({ default: m.MosqueConfigModal })));
const ShareModal = React.lazy(() => import('./components/ShareModal').then(m => ({ default: m.ShareModal })));
const MosqueInfoModal = React.lazy(() => import('./components/MosqueInfoModal').then(m => ({ default: m.MosqueInfoModal })));
const SimasDossierModal = React.lazy(() => import('./components/SimasDossierModal').then(m => ({ default: m.SimasDossierModal })));
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { VirtualTourSection } from './components/VirtualTourSection';
import { SimasSection } from './components/SimasSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { DkmSection } from './components/DkmSection';
import { FinancialSection } from './components/FinancialSection';
import { Footer } from './components/Footer';
import { capture3DScreenshot } from './utils/screenshot';
import { Check, Eye, Maximize2, ShieldCheck, ArrowUp } from 'lucide-react';

const STORAGE_CONFIG_KEY = 'masjid_as_safar_config_arch_v3';

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'fullscreen3D'>('website');
  const [activeSection, setActiveSection] = useState('beranda');

  const [config, setConfig] = useState<MosqueConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, showQibla: false, autoRotate: false, fanSpeed: 0 };
      }
    } catch (e) {
      console.warn('Failed to load saved config', e);
    }
    return { ...DEFAULT_CONFIG, showQibla: false, autoRotate: false, fanSpeed: 0 };
  });

  // UI States for 3D fullscreen viewer
  const [isInterior, setIsInterior] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSimasDossierOpen, setIsSimasDossierOpen] = useState(false);
  const [focusPosition, setFocusPosition] = useState<[number, number, number] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFloating3dBtn, setShowFloating3dBtn] = useState(false);

  // Persist config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config', e);
    }
  }, [config]);

  // Track scroll position to hide floating 3D button when on Hero or when 3D Tour section is visible
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const tourSection = document.getElementById('tur-3d');

      // Hide when on hero (top banner has prominent 3D button)
      if (scrollY < 260) {
        setShowFloating3dBtn(false);
        return;
      }

      // Hide when #tur-3d section is currently visible in viewport
      if (tourSection) {
        const rect = tourSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
        if (inView) {
          setShowFloating3dBtn(false);
          return;
        }
      }

      setShowFloating3dBtn(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll navigation on website
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (viewMode === 'fullscreen3D') {
      setViewMode('website');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Camera presets for 3D mode
  const handleSelectPreset = (preset: CameraPreset) => {
    switch (preset) {
      case 'mihrab':
        setIsInterior(true);
        setFocusPosition([0, 1.6, 6.5]);
        break;
      case 'backDoor':
        setIsInterior(true);
        setFocusPosition([0, 1.6, -7.0]);
        break;
      case 'leftDoor':
        setIsInterior(true);
        setFocusPosition([-4.5, 1.6, -2.5]);
        break;
      case 'rightDoor':
        setIsInterior(true);
        setFocusPosition([4.5, 1.6, -2.5]);
        break;
      case 'topView':
        setFocusPosition([0, 28, 0.1]);
        break;
      case 'exterior':
        setIsInterior(false);
        setFocusPosition([0, 2.5, 0]);
        break;
      case 'interior':
        setIsInterior(true);
        setFocusPosition([0, 1.5, 0.5]);
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

  const handleTakeScreenshot = async () => {
    const res = await capture3DScreenshot();
    if (res.success) {
      setToastMessage('Foto desain 3D ber-watermark berhasil diunduh!');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F2A25] text-slate-800 font-sans selection:bg-[#D4AF37] selection:text-[#0F2A25]">
      
      {/* ============================================================== */}
      {/* MODE 1: OFFICIAL WEBSITE PORTAL (FOR SIMAS KEMENAG & PILGRIMS) */}
      {/* ============================================================== */}
      {viewMode === 'website' ? (
        <div className="flex flex-col min-h-screen">
          
          {/* Header Navigation with SIMAS Ticker & Prayer Times */}
          <HeaderNav
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onLaunchFullscreen3D={() => setViewMode('fullscreen3D')}
            onOpenSimasDossier={() => setIsSimasDossierOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
          />

          {/* Main Website Sections */}
          <main className="flex-1">
            {/* 1. Hero Welcome & Quick Stats */}
            <HeroSection
              onLaunch3D={() => {
                const el = document.getElementById('tur-3d');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenSimasDossier={() => setIsSimasDossierOpen(true)}
              onNavigateToInfaq={() => handleNavigate('infaq')}
            />

            {/* 2. Jadwal Sholat Kemenag & Countdown */}
            <PrayerTimesSection />

            {/* 3. Interactive 3D Virtual Tour Viewer */}
            <VirtualTourSection
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onLaunchFullscreen={() => setViewMode('fullscreen3D')}
              onOpenSpecsModal={() => setIsInfoModalOpen(true)}
            />

            {/* 4. Profil & Legalitas SIMAS Kemenag */}
            <SimasSection
              onOpenDossier={() => setIsSimasDossierOpen(true)}
            />

            {/* 5. Fasilitas & Sarana Ibadah */}
            <FacilitiesSection />

            {/* 6. Pengurus DKM & Agenda Kajian */}
            <DkmSection />

            {/* 7. Transparansi Kas & Infaq QRIS */}
            <FinancialSection />
          </main>

          {/* Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenSimasDossier={() => setIsSimasDossierOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
          />

          {/* Floating Action Button: Quick 3D Fullscreen Jump (Adaptive visibility, safe-area aware) */}
          <div 
            className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-3.5 sm:bottom-6 sm:right-6 z-30 transition-all duration-300 ${
              showFloating3dBtn
                ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                : 'opacity-0 translate-y-4 pointer-events-none scale-90'
            }`}
          >
            <button
              onClick={() => setViewMode('fullscreen3D')}
              className="w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-full shadow-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 border-2 border-white/80 flex items-center justify-center gap-2"
              title="Buka Mode Tur 3D Fullscreen"
              aria-label="Jelajah Tur 3D Fullscreen"
            >
              <Eye className="w-5 h-5 sm:w-4 sm:h-4 shrink-0 text-[#0F2A25]" />
              <span className="text-xs sm:text-sm hidden sm:inline">Jelajah 3D Fullscreen</span>
            </button>
          </div>

        </div>
      ) : (
        /* ============================================================== */
        /* MODE 2: FULLSCREEN 3D IMMERSIVE ARCHITECTURAL TOUR */
        /* ============================================================== */
        <div className="w-screen h-screen bg-[#D8DEE4] font-sans relative overflow-hidden select-none">
          <main className="w-full h-full relative overflow-hidden">
            <Suspense fallback={<CanvasLoadingFallback label="Membuka Mode Tur 3D Fullscreen..." />}>
              <MosqueCanvas3D
                hotspots={[]}
                config={config}
                isInterior={isInterior}
                selectedHotspotId={null}
                onSelectHotspot={() => {}}
                focusPosition={focusPosition}
              />
            </Suspense>

            {/* Controls Overlay with Back to Website Button */}
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
              onOpenShare={() => setIsShareModalOpen(true)}
              onOpenInfo={() => setIsInfoModalOpen(true)}
              onTakeScreenshot={handleTakeScreenshot}
              onBackToWebsite={() => setViewMode('website')}
            />

            {/* Toast for Actions */}
            {toastMessage && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0F2A25]/95 text-white border border-[#D4AF37] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ============================================================== */}
      {/* GLOBAL MODALS (SIMAS DOSSIER, SHARE, INFO, CONFIG) */}
      {/* ============================================================== */}

      {/* Official SIMAS Kemenag Printable Dossier Modal, Share, Info & Config */}
      <Suspense fallback={null}>
        {isSimasDossierOpen && (
          <SimasDossierModal
            isOpen={isSimasDossierOpen}
            onClose={() => setIsSimasDossierOpen(false)}
          />
        )}

        {isShareModalOpen && (
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}

        {isInfoModalOpen && (
          <MosqueInfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        )}

        {isConfigModalOpen && (
          <MosqueConfigModal
            isOpen={isConfigModalOpen}
            config={config}
            onClose={() => setIsConfigModalOpen(false)}
            onUpdateConfig={newConfig => setConfig(newConfig)}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </Suspense>

    </div>
  );
}
