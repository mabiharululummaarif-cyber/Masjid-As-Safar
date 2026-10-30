import React, { useState, useEffect } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { getTodayPrayerTimes, getCountdownToNextPrayer, getIndonesianDateString } from '../utils/prayerTimes';
import { 
  Building2, Compass, Clock, ShieldCheck, Share2, 
  Menu, X, Sparkles, FileText, Phone, HeartHandshake, Eye
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
    { id: 'tur-3d', label: 'Tur 3D Visualizer' },
    { id: 'simas', label: 'Profil & Legalitas SIMAS' },
    { id: 'jadwal', label: 'Jadwal & Kajian' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'dkm', label: 'Pengurus DKM' },
    { id: 'infaq', label: 'Kas & Infaq' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F2A25]/95 backdrop-blur-md border-b border-emerald-800/60 shadow-lg text-white">
      {/* 1. TOP ANNOUNCEMENT & PRAYER TICKER BAR */}
      <div className="bg-[#091D1A] text-emerald-100/90 text-[11px] px-3 sm:px-6 py-1.5 border-b border-emerald-900/80 flex flex-wrap items-center justify-between gap-2">
        {/* Left: SIMAS Verification Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-900/80 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-600/40 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>ID SIMAS: {MASJID_SIMAS_DATA.idSimas}</span>
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-300">
            Terdata di SIMAS Ditjen Bimas Islam Kemenag RI
          </span>
        </div>

        {/* Center: Hijri & Masehi Date */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300">
          <span>{dates.masehi}</span>
          <span>•</span>
          <span className="text-[#D4AF37] font-medium">{dates.hijri}</span>
        </div>

        {/* Right: Live Next Prayer Countdown */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0 font-medium">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-slate-300">Menuju {countdown.prayerName}:</span>
          <span className="font-mono font-bold text-[#D4AF37] tracking-wider bg-black/30 px-1.5 py-0.5 rounded">
            {countdown.remainingText}
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Emblem & Mosque Title */}
        <div 
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Mosque Dome Gold Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-[#0F2A25] border border-[#D4AF37]/50 flex items-center justify-center shadow-md group-hover:border-[#D4AF37] transition-all">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black tracking-wider text-base sm:text-lg text-white group-hover:text-[#D4AF37] transition-colors">
                MASJID AS-SAFAR
              </span>
              <span className="text-[10px] bg-[#D4AF37] text-[#0F2A25] font-extrabold px-1.5 py-0.2 rounded font-sans uppercase">
                Resmi
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/80 tracking-wide font-sans line-clamp-1">
              Masjid Jami' & Tempat Publik • Bimas Islam Kemenag
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
                    ? 'bg-emerald-800/80 text-[#D4AF37] shadow-sm' 
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* SIMAS Sheet Button */}
          <button
            onClick={onOpenSimasDossier}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Buka Dokumen Resmi SIMAS Kemenag"
          >
            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Format SIMAS</span>
          </button>

          {/* Fullscreen 3D Launch Button */}
          <button
            onClick={onLaunchFullscreen3D}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer transform active:scale-95"
            title="Masuk ke Tur 3D Layar Penuh"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Jelajah</span> 3D Fullscreen
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Bagikan Tautan Website Masjid"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU COLLAPSIBLE */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0F2A25] border-t border-emerald-800/80 px-4 py-3 space-y-1.5 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="pb-2 border-b border-emerald-900/80 flex items-center justify-between text-xs text-slate-300">
            <span>ID SIMAS: <strong className="text-emerald-300">{MASJID_SIMAS_DATA.idSimas}</strong></span>
            <span className="text-[#D4AF37]">{dates.hijri}</span>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    isActive 
                      ? 'bg-emerald-800 text-[#D4AF37]' 
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-emerald-900/80 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimasDossier();
              }}
              className="flex-1 py-2 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Format SIMAS Kemenag</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchFullscreen3D();
              }}
              className="flex-1 py-2 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#0F2A25] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tur 3D Penuh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
