import React from 'react';
import { DKM_MEMBERS, WEEKLY_AGENDA, MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Users, Award, Calendar, BookOpen, Clock, 
  ShieldCheck, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';

export const DkmSection: React.FC = () => {
  return (
    <section id="dkm" className="py-16 bg-[#FAF8F5] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>LEGALITAS SK KUA KEMENTERIAN AGAMA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Dewan Kemakmuran Masjid (DKM)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Struktur kepengurusan resmi Masjid As-Safar Masa Bakti 2024–2027 berdasarkan Surat Keputusan Kepala KUA Kemenag RI 
            Nomor: <strong className="text-slate-900">{MASJID_SIMAS_DATA.nomorSkDkm}</strong>.
          </p>
        </div>

        {/* DKM Structure Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {DKM_MEMBERS.map((member, index) => {
            const isPimpinan = index < 2;
            return (
              <div
                key={index}
                className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                  isPimpinan
                    ? 'bg-gradient-to-br from-emerald-900 to-[#0F2A25] text-white border-emerald-700 shadow-md'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-lg ${
                  isPimpinan
                    ? 'bg-[#D4AF37] text-[#0F2A25]'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  <UserCheck className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                    isPimpinan ? 'text-[#D4AF37]' : 'text-emerald-700'
                  }`}>
                    {member.jabatan}
                  </span>
                  <h3 className={`font-bold text-sm sm:text-base truncate mt-0.5 ${
                    isPimpinan ? 'text-white' : 'text-slate-900'
                  }`}>
                    {member.nama}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      isPimpinan ? 'bg-white/10 text-emerald-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Bidang: {member.bidang}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agenda & Kajian Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                SYIAR & PROGRAM KEMAKMURAN
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#0F2A25]">
                Agenda Kajian & Program Ibadah
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Terbuka untuk umum, ikhwan, akhwat, dan musafir
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_AGENDA.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.waktu}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1 font-serif">
                    {item.judul}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 mb-2">
                    {item.hari} • {item.narasumber}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                  <span>Lokasi: Ruang Utama Masjid As-Safar</span>
                  <span className="text-[11px] text-slate-400">Gratis / Infaq Sukarela</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
