import React, { useState, useEffect } from 'react';
import { getTodayPrayerTimes, getCountdownToNextPrayer } from '../utils/prayerTimes';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { Clock, Compass, BellRing, Calendar } from 'lucide-react';

export const PrayerTimesSection: React.FC = () => {
  const [prayers, setPrayers] = useState(getTodayPrayerTimes());
  const [countdown, setCountdown] = useState(getCountdownToNextPrayer(prayers));

  useEffect(() => {
    const timer = setInterval(() => {
      const currentPrayers = getTodayPrayerTimes();
      setPrayers(currentPrayers);
      setCountdown(getCountdownToNextPrayer(currentPrayers));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="jadwal" className="scroll-mt-24 sm:scroll-mt-28 py-10 sm:py-16 bg-[#0F2A25] bg-gradient-to-b from-[#0F2A25] via-[#143731] to-[#0F2A25] text-white border-b border-[#1E4D40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10382E] text-emerald-200 text-[10px] sm:text-xs font-bold border border-emerald-600/60 mb-2">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F3D063]" />
              <span>ESTIMASI WAKTU SHOLAT WILAYAH SUPPA (WITA)</span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
              Jadwal Sholat Fardhu
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Perkiraan waktu sholat wilayah Desa Lero, Kecamatan Suppa, Kabupaten Pinrang (WITA). Jadwal ini merupakan estimasi awal dan menunggu kalibrasi resmi dari Kemenag Pinrang.
            </p>
          </div>

          {/* Active Countdown Card */}
          <div className="bg-[#091F1A] border-2 border-[#D4AF37] rounded-2xl p-3.5 sm:px-5 sm:py-3 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 shrink-0 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143B33] flex items-center justify-center text-[#F3D063] shrink-0 border border-[#D4AF37]/50">
                <BellRing className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-200 font-semibold block">
                  Menuju {countdown.prayerName} (WITA)
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-[#F3D063]">
                  {countdown.remainingText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Prayer Times Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {prayers.map((prayer) => {
            const isNext = prayer.isNext;
            return (
              <div
                key={prayer.id}
                className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 flex flex-col justify-between ${
                  isNext
                    ? 'bg-gradient-to-b from-[#1E5043] to-[#12382F] border-2 border-[#F3D063] shadow-xl shadow-emerald-950/70 scale-[1.02]'
                    : 'bg-[#0B211C] hover:bg-[#12362E] border border-[#1E4D40] shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] sm:text-xs uppercase font-bold text-emerald-200 tracking-wide truncate">
                      {prayer.name}
                    </span>
                    {isNext && (
                      <span className="text-[8px] sm:text-[9px] bg-[#F3D063] text-[#0F2A25] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                        Berikutnya
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-serif text-[#F3D063] font-semibold block mb-1.5 sm:mb-2">
                    {prayer.arabic}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-800/60 flex items-baseline justify-between">
                  <span className={`text-base sm:text-xl font-bold font-mono tracking-tight block ${isNext ? 'text-[#F3D063]' : 'text-white'}`}>
                    {prayer.timeStr.replace(' WITA', '')}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-sans font-semibold">
                    WITA
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Qibla & Friday Announcement Bar */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
          {/* Qibla Direction Banner */}
          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3.5 sm:p-4 flex items-start sm:items-center gap-3 shadow-md">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 mt-0.5 sm:mt-0 border border-[#2D6A4F]/60">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Arah Kiblat Estimasi Suppa</span>
              <p className="text-slate-200 text-[11px] mt-0.5 leading-relaxed">
                Azimuth <strong>~{MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°</strong> (22.5° Barat ke Utara) — Menunggu kalibrasi resmi BHR Kemenag Pinrang.
              </p>
            </div>
          </div>

          {/* Friday Prayer Banner */}
          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3.5 sm:p-4 flex items-start sm:items-center gap-3 shadow-md">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 mt-0.5 sm:mt-0 border border-[#2D6A4F]/60">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Sholat Jum'at Berjamaah</span>
              <p className="text-slate-200 text-[11px] mt-0.5 leading-relaxed">
                Adzan Awal: <strong>11.55 WITA</strong> • Khutbah & Sholat Berjamaah: <strong>12.15 WITA</strong>.
              </p>
            </div>
          </div>

          {/* Daily Rawatib Info */}
          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3.5 sm:p-4 flex items-start sm:items-center gap-3 shadow-md">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 mt-0.5 sm:mt-0 border border-[#2D6A4F]/60">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Iqomah Sholat Fardhu</span>
              <p className="text-slate-200 text-[11px] mt-0.5 leading-relaxed">
                Jeda Iqomah: <strong>10 menit</strong> setelah adzan Subuh & Isya, <strong>7 menit</strong> setelah Dzuhur, Ashar, & Maghrib.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
