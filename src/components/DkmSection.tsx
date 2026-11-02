import React from 'react';
import { DKM_MEMBERS, PEGAWAI_SYARA, WEEKLY_AGENDA, MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Award, Clock, 
  UserCheck, CheckCircle2, ShieldCheck, Users
} from 'lucide-react';

export const DkmSection: React.FC = () => {
  return (
    <section id="dkm" className="scroll-mt-24 sm:scroll-mt-28 py-10 sm:py-16 bg-[#FAF8F5] text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0F2A25] text-[10px] sm:text-xs font-bold border border-emerald-300 mb-2 shadow-sm">
            <Award className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>TATA KELOLA & PENGURUS MASJID</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Susunan Pengurus Takmir Masjid
          </h2>
          <p className="text-slate-700 text-xs sm:text-base mt-2 leading-relaxed font-normal">
            {MASJID_SIMAS_DATA.namaResmi} di Jl. Poros TPI Ujung Labuang Lero B Wiringtasi, Kec. Suppa, Kab. Pinrang. 
            Disahkan melalui <strong>SK Pengurus Nomor {MASJID_SIMAS_DATA.nomorSkDkm}</strong> untuk masa bakti <strong>Periode {MASJID_SIMAS_DATA.periodeKepengurusan}</strong>.
          </p>
        </div>

        {/* Takmir Structure Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {DKM_MEMBERS.map((member, index) => {
            const isPimpinan = index < 4; // Pengurus Harian
            return (
              <div
                key={index}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isPimpinan
                    ? 'bg-[#0F2A25] bg-gradient-to-br from-emerald-950 to-[#0F2A25] text-white border-[#D4AF37] shadow-lg'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-base ${
                      isPimpinan
                        ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                      isPimpinan
                        ? 'bg-[#0B211C] text-[#F3D063] border border-[#D4AF37]/50'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      <CheckCircle2 className={`w-3 h-3 ${isPimpinan ? 'text-[#F3D063]' : 'text-emerald-700'}`} />
                      <span>SK 2026–2030</span>
                    </span>
                  </div>

                  <span className={`text-[11px] uppercase font-bold tracking-wider block ${
                    isPimpinan ? 'text-[#F3D063]' : 'text-emerald-800'
                  }`}>
                    {member.jabatan}
                  </span>
                  
                  <h3 className={`font-bold text-sm sm:text-base truncate mt-1 ${
                    isPimpinan ? 'text-white' : 'text-slate-900'
                  }`}>
                    {member.nama}
                  </h3>
                </div>

                <div className={`mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t text-[11px] ${
                  isPimpinan ? 'border-emerald-800 text-emerald-200' : 'border-slate-100 text-slate-600'
                }`}>
                  <span className="block font-medium truncate">
                    Bidang: <strong className={isPimpinan ? 'text-white' : 'text-slate-800'}>{member.bidang}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pegawai Syara' Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold font-serif text-[#0F2A25]">
                  Pegawai Syara' Masjid As-Safar
                </h3>
                <p className="text-xs text-slate-600">
                  Petugas pelaksanaan ibadah fardhu, adzan, kebersihan, dan pelayanan jamaah harian.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full w-fit">
              Petugas Terkonfirmasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {PEGAWAI_SYARA.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{item.nama}</h4>
                  <p className="text-xs font-semibold text-emerald-800 truncate">{item.tugas}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda & Kajian Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-800 tracking-wider block">
                SYIAR & PROGRAM KEMAKMURAN
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0F2A25]">
                Agenda Sholat & Kajian
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
              Zona Waktu: WITA (UTC+8) • Terbuka untuk umum & musafir
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {WEEKLY_AGENDA.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full uppercase tracking-wider border ${
                      item.status === 'TERKONFIRMASI' 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {item.kategori}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.waktu}</span>
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 font-serif">
                    {item.judul}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 mb-2">
                    {item.hari} • {item.narasumber}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-3 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                  <span>Lokasi: Desa {MASJID_SIMAS_DATA.desa}, Kec. {MASJID_SIMAS_DATA.kecamatan}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{MASJID_SIMAS_DATA.zonaWaktu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
