import React, { useState } from 'react';
import { FINANCIAL_DATA, MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  HeartHandshake, QrCode, Copy, Check, TrendingUp, 
  TrendingDown, Wallet, AlertCircle, Landmark
} from 'lucide-react';

export const FinancialSection: React.FC = () => {
  const [copiedRekening, setCopiedRekening] = useState(false);

  const handleCopyRekening = () => {
    const textToCopy = `Masjid As-Safar (Desa Lero, Kec. Suppa, Kab. Pinrang) - Status Rekening Infaq: ${MASJID_SIMAS_DATA.kontak.rekeningInfaq.bank} (${MASJID_SIMAS_DATA.kontak.rekeningInfaq.nomorRekening})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  return (
    <section id="infaq" className="py-10 sm:py-16 bg-[#0F2A25] text-white border-b border-[#1E4D40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10382E] text-emerald-200 text-[10px] sm:text-xs font-bold border border-emerald-600/60 mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#F3D063] shrink-0" />
            <span>AKUNTABILITAS & AMANAH UMMAT</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black tracking-tight text-white drop-shadow-sm">
            Laporan Keuangan & Saluran Infaq
          </h2>
          <p className="text-slate-200 text-xs sm:text-base mt-2 leading-relaxed">
            Prinsip keterbukaan dan transparansi pengelolaan kas DKM Masjid As-Safar, 
            Desa Lero, Kecamatan Suppa, Kabupaten Pinrang.
          </p>
        </div>

        {/* Top 3 Financial Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          
          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="uppercase tracking-wider font-bold text-[10px] sm:text-xs">Pemasukan Kas</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg sm:text-2xl font-bold font-sans text-amber-200 block">
              Menunggu Rilis
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 block mt-1">
              Dalam proses konfirmasi Bendahara DKM
            </span>
          </div>

          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="uppercase tracking-wider font-bold text-[10px] sm:text-xs">Pengeluaran Operasional</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-lg sm:text-2xl font-bold font-sans text-amber-200 block">
              Menunggu Rilis
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 block mt-1">
              Dalam proses konfirmasi Bendahara DKM
            </span>
          </div>

          <div className="bg-[#0B211C] bg-gradient-to-br from-[#1C4E44] to-[#12362F] border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
              <span className="uppercase tracking-wider font-bold text-[#F3D063] text-[10px] sm:text-xs">Status Kas Berjalan</span>
              <Wallet className="w-4 h-4 text-[#F3D063]" />
            </div>
            <span className="text-lg sm:text-2xl font-bold font-sans text-[#F3D063] block">
              Tahap Rekonsiliasi
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-200 block mt-1">
              Pencatatan kas fisik Desa Lero
            </span>
          </div>

        </div>

        {/* 2-Columns: Detailed Breakdown Status vs Infaq Channel Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Detailed Ledger breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B211C] border border-[#1E4D40] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-6 shadow-md">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white mb-1">
                Transparansi Pembukuan Kas Masjid
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Laporan kas operasional rutin diumumkan kepada jamaah sebelum pelaksanaan Sholat Jum'at di Desa Lero.
              </p>
            </div>

            {/* Status Information Box */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#091F1A] border border-amber-500/50 text-xs text-amber-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Status Data Keuangan: Belum Terpublikasi</span>
              </div>
              <p className="leading-relaxed text-[11px] sm:text-xs text-slate-200">
                {FINANCIAL_DATA.keterangan}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                Struktur Pos Pengelolaan Dana DKM:
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#091D18] border border-[#184639] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">• Infaq Jum'at & Tromol Rutin</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-300 block truncate">Penerimaan jamaah Desa Lero & musafir</span>
                  </div>
                  <span className="text-amber-200 font-semibold text-[10px] sm:text-[11px] shrink-0">Dikelola DKM</span>
                </div>

                <div className="p-3 rounded-xl bg-[#091D18] border border-[#184639] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">• Biaya Operasional & Sarana</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-300 block truncate">Listrik, air bersih, kebersihan sarana</span>
                  </div>
                  <span className="text-amber-200 font-semibold text-[10px] sm:text-[11px] shrink-0">Dikelola DKM</span>
                </div>

                <div className="p-3 rounded-xl bg-[#091D18] border border-[#184639] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">• ZISWAF & Santunan Sosial</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-300 block truncate">Penyaluran kemakmuran warga sekitar</span>
                  </div>
                  <span className="text-amber-200 font-semibold text-[10px] sm:text-[11px] shrink-0">Dikelola DKM</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#184639] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-300">
              <span>Draf estimasi neraca — Menunggu laporan resmi pengurus DKM</span>
              <span>Wilayah: Desa Lero, Kec. Suppa</span>
            </div>
          </div>

          {/* QRIS & Infaq Bank Box (5 cols) */}
          <div className="lg:col-span-5 bg-[#0D2620] bg-gradient-to-b from-[#163E35] to-[#0E2822] border-2 border-[#D4AF37] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 text-center shadow-2xl space-y-4 sm:space-y-5">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#F3D063] text-[10px] sm:text-xs font-bold border border-[#D4AF37]/50">
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span>SALURAN INFAQ & SEDEKAH</span>
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-black text-white">
              Salurkan Infaq & Sedekah
            </h3>

            {/* QRIS Status Box */}
            <div className="bg-[#091E1A] p-4 sm:p-6 rounded-2xl border border-[#2D6A4F] text-center space-y-2 sm:space-y-3 shadow-inner">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#143B33] border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-300 shadow">
                <QrCode className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white text-xs sm:text-sm block">
                  Kanal QRIS DKM
                </span>
                <span className="text-xs text-amber-200 font-bold block">
                  Belum Tersedia — Menunggu Konfirmasi DKM
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-200 leading-relaxed max-w-xs mx-auto font-normal">
                  Kanal pembayaran QRIS saat ini belum tersedia dan belum aktif. Pembayaran digital akan dipublikasikan setelah ada konfirmasi resmi dari pengurus DKM Masjid As-Safar.
                </p>
              </div>
            </div>

            {/* Bank Transfer Details Box */}
            <div className="bg-[#091E1A] rounded-2xl p-3.5 sm:p-4 text-left border border-[#2D6A4F] space-y-2 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">
                Status Rekening Bank DKM:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs sm:text-sm block truncate">
                    {MASJID_SIMAS_DATA.kontak.rekeningInfaq.bank}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#F3D063] block truncate">
                    {MASJID_SIMAS_DATA.kontak.rekeningInfaq.nomorRekening}
                  </span>
                  <span className="text-[10px] text-slate-200 block">
                    {MASJID_SIMAS_DATA.kontak.rekeningInfaq.catatan}
                  </span>
                </div>

                <button
                  onClick={handleCopyRekening}
                  className="min-h-[44px] px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#0F2A25] font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 shrink-0"
                >
                  {copiedRekening ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRekening ? 'Tersalin' : 'Salin Info'}</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-emerald-200 italic leading-relaxed">
              "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..." (QS. Al-Baqarah: 261)
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
