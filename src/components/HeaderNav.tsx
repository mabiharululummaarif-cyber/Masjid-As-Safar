import React, { useState, useEffect } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { getTodayPrayerTimes, getCountdownToNextPrayer, getIndonesianDateString } from '../utils/prayerTimes';
import { 
  Building2, Clock, Share2, 
  Menu, X, FileText, Eye, MapPin, ChevronRight
} from 'lucide-react';

interface HeaderNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onLaunchFullscreen3D: () => void;
  onOpenSimasDossier: () => void;
  onOpenShare: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSection,
  onNavigate,
  onLaunchFullscreen3D,
  onOpenSimasDossier,
  onOpenShare
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState<{ prayerName: string; remainingText: string }>({
    prayerName: 'Subuh',
    remainingText: '00:00:00'
  });

  const dates = getIndonesianDateString();
  const prayerTimes = getTodayPrayerTimes();

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdownToNextPrayer(prayerTimes));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tur-3d', label: 'Tur 3D' },
    { id: 'simas', label: 'Draf SIMAS' },
    { id: 'jadwal', label: 'Jadwal Sholat' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'dkm', label: 'Pengurus DKM' },
    { id: 'infaq', label: 'Keuangan & Infaq' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F2A25] border-b border-[#1B4332] shadow-xl text-white">
      {/* 1. TOP ANNOUNCEMENT & PRAYER TICKER BAR */}
      <div className="bg-[#081A16] text-emerald-100 text-[10px] sm:text-[11px] px-3 sm:px-6 py-1.5 border-b border-[#12362E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Location & SIMAS Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 bg-[#10382E] text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-600/50 text-[9px] sm:text-[10px] shrink-0">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F3D063]" />
              <span className="hidden xs:inline">Desa Lero, Suppa, Pinrang</span>
              <span className="xs:hidden">Suppa, Pinrang</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-amber-200 text-[10px] font-semibold truncate">
              Status SIMAS: Menunggu Konfirmasi DKM
            </span>
          </div>

          {/* Center: Hijri & Masehi Date (Desktop only) */}
          <div className="hidden lg:flex items-center gap-2 text-slate-200 text-xs">
            <span>{dates.masehi}</span>
            <span>•</span>
            <span className="text-[#F3D063] font-medium">{dates.hijri}</span>
          </div>

          {/* Right: Live Next Prayer Countdown in WITA */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium shrink-0 ml-auto">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F3D063]" />
            <span className="text-slate-200 hidden sm:inline">Menuju {countdown.prayerName} (WITA):</span>
            <span className="text-slate-200 sm:hidden">{countdown.prayerName}:</span>
            <span className="font-mono font-bold text-[#F3D063] tracking-wider bg-[#0A221C] border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[10px] sm:text-xs shadow-sm">
              {countdown.remainingText}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 bg-[#0F2A25]">
        {/* Brand Emblem & Mosque Title */}
        <div 
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0 flex-1"
        >
          {/* Mosque Dome Gold Icon Badge */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-[#0F2A25] border border-[#D4AF37]/60 flex items-center justify-center shadow-md group-hover:border-[#F3D063] transition-all shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F3D063]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black tracking-wide text-sm xs:text-base sm:text-lg text-white group-hover:text-[#F3D063] transition-colors truncate drop-shadow-sm">
                MASJID AS-SAFAR
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] bg-emerald-800 text-emerald-100 border border-emerald-600/60 font-bold px-1.5 py-0.2 rounded font-sans uppercase shrink-0">
                Lero
              </span>
            </div>
            <p className="text-[10px] text-emerald-300 font-medium tracking-wide font-sans truncate">
              Desa Lero, Kec. Suppa • WITA (UTC+8)
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#133E33] text-[#F3D063] font-bold border border-[#D4AF37]/50 shadow-sm' 
                    : 'text-slate-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* SIMAS Sheet Button (Hidden on Mobile) */}
          <button
            onClick={onOpenSimasDossier}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Buka Draf Format SIMAS Kemenag"
          >
            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Draf SIMAS</span>
          </button>

          {/* Fullscreen 3D Launch Button */}
          <button
            onClick={onLaunchFullscreen3D}
            className="h-10 px-2.5 sm:px-3.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer transform active:scale-95 flex items-center justify-center gap-1.5"
            title="Masuk ke Tur 3D Layar Penuh"
            aria-label="Tur 3D Fullscreen"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Tur 3D</span>
          </button>

          {/* Share Button (Min touch target 44px on mobile) */}
          <button
            onClick={onOpenShare}
            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors cursor-pointer active:scale-95"
            title="Bagikan Tautan Website Masjid"
            aria-label="Bagikan Website"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle (Min touch target 44px on mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors cursor-pointer active:scale-95"
            aria-label="Toggle Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU COLLAPSIBLE (Single-Hand & Touch Friendly) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B211C] border-t border-[#184639] px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="pb-3 border-b border-[#184639] flex items-center justify-between text-xs text-slate-200">
            <span>Status SIMAS: <strong className="text-amber-200">Menunggu Konfirmasi DKM</strong></span>
            <span className="text-[#F3D063] font-semibold">{dates.hijri}</span>
          </div>

          {/* Mobile Navigation List - Touch targets >= 44px */}
          <div className="space-y-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-[#133E33] text-[#F3D063] font-bold border border-[#D4AF37]/40 shadow-sm' 
                      : 'text-slate-100 hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#F3D063]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Action Footer in Drawer */}
          <div className="pt-3 border-t border-[#184639] flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimasDossier();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 bg-[#143B33] hover:bg-[#1A4C41] text-emerald-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#2D6A4F]"
            >
              <FileText className="w-4 h-4 text-[#F3D063]" />
              <span>Buka Draf Berkas SIMAS</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchFullscreen3D();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Eye className="w-4 h-4 text-[#0F2A25]" />
              <span>Tur 3D Layar Penuh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
