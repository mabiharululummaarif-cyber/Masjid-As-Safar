import React, { useState, useEffect } from 'react';
import { getTodayPrayerTimes, getCountdownToNextPrayer } from '../utils/prayerTimes';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { Clock, Compass, BellRing, Sparkles, MapPin, Calendar } from 'lucide-react';

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
    <section id="jadwal" className="py-12 bg-gradient-to-b from-[#0F2A25] via-[#143731] to-[#0F2A25] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-bold border border-emerald-700 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>STANDAR HISAB KEMENTERIAN AGAMA RI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Jadwal Sholat Fardhu & Imsakiyah
            </h2>
            <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
              Waktu sholat harian terkalibrasi untuk wilayah koordinat Masjid As-Safar ({MASJID_SIMAS_DATA.kabupatenKota})
            </p>
          </div>

          {/* Active Countdown Card */}
          <div className="bg-black/30 border border-[#D4AF37]/50 rounded-2xl px-5 py-3 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold block">
                Menuju Waktu {countdown.prayerName}
              </span>
              <span className="text-2xl font-black font-mono tracking-widest text-[#D4AF37]">
                {countdown.remainingText}
              </span>
            </div>
          </div>
        </div>

        {/* 6 Prayer Times Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {prayers.map((prayer) => {
            const isNext = prayer.isNext;
            return (
              <div
                key={prayer.id}
                className={`rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${
                  isNext
                    ? 'bg-gradient-to-b from-[#1E5043] to-[#12382F] border-2 border-[#D4AF37] shadow-xl shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 border border-emerald-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs uppercase font-bold text-emerald-200/90 tracking-wide">
                      {prayer.name}
                    </span>
                    {isNext && (
                      <span className="text-[9px] bg-[#D4AF37] text-[#0F2A25] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                        Berikutnya
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-serif text-[#D4AF37]/80 block mb-2">
                    {prayer.arabic}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className={`text-lg sm:text-xl font-bold font-mono tracking-tight block ${isNext ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {prayer.timeStr.replace(' WIB', '')}
                  </span>
                  <span className="text-[10px] text-emerald-300/70 font-sans">
                    WIB
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Qibla & Friday Announcement Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Qibla Direction Banner */}
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Arah Kiblat Resmi Kemenag</span>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">
                Azimuth <strong>{MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°</strong> (25° 12' Barat ke Utara) terverifikasi BHR Kemenag.
              </p>
            </div>
          </div>

          {/* Friday Prayer Banner */}
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Sholat Jum'at Berjamaah</span>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">
                Adzan 11:58 WIB • Disediakan jamuan makan siang Berkah Jum'at untuk jamaah & musafir.
              </p>
            </div>
          </div>

          {/* Location Calibration */}
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Koordinat Geospasial SIMAS</span>
              <p className="text-emerald-200/80 font-mono text-[11px] mt-0.5">
                Lat {MASJID_SIMAS_DATA.koordinat.lat}, Lng {MASJID_SIMAS_DATA.koordinat.lng}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
