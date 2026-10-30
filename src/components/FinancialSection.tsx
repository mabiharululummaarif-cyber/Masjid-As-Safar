import React, { useState, useEffect } from 'react';
import { FINANCIAL_DATA, MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  HeartHandshake, QrCode, Copy, Check, TrendingUp, 
  TrendingDown, ShieldCheck, Wallet, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';

export const FinancialSection: React.FC = () => {
  const [qrisUrl, setQrisUrl] = useState<string>('');
  const [copiedRekening, setCopiedRekening] = useState(false);

  useEffect(() => {
    // Generate QRIS string simulation for DKM Masjid As-Safar
    const qrisMockPayload = `00020101021226600016ID.CO.QRIS.WWW011893600914321098765402150000000000000000303UMI51440014ID.GO.KEMENAG01180141204010001285204581453033605802ID5920DKM MASJID AS-SAFAR6005DEPOK6105164156304ABCD`;
    QRCode.toDataURL(qrisMockPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0F2A25',
        light: '#FFFFFF'
      }
    }).then(setQrisUrl).catch(console.error);
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText(MASJID_SIMAS_DATA.kontak.rekeningInfaq.nomorRekening.replace(/-/g, ''));
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  return (
    <section id="infaq" className="py-16 bg-[#0F2A25] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-700/80 mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AKUNTABILITAS & AMANAH UMMAT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Laporan Keuangan & Infaq Digital
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base mt-2">
            Transparansi pengelolaan dana kas DKM Masjid As-Safar yang diaudit berkala serta saluran 
            infaq non-tunai resmi berbasis QRIS dan Bank Syariah Indonesia.
          </p>
        </div>

        {/* Top 3 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          
          <div className="bg-[#143730] border border-emerald-700/60 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1">
              <span className="uppercase tracking-wider font-bold">Total Pemasukan Kas</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {formatRupiah(FINANCIAL_DATA.totalPemasukan)}
            </span>
            <span className="text-[10px] text-emerald-300/70 block mt-1">
              Infaq Jum'at, QRIS, & Kotak Tromol
            </span>
          </div>

          <div className="bg-[#143730] border border-emerald-700/60 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1">
              <span className="uppercase tracking-wider font-bold">Total Pengeluaran</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-black font-mono text-rose-300">
              {formatRupiah(FINANCIAL_DATA.totalPengeluaran)}
            </span>
            <span className="text-[10px] text-rose-200/70 block mt-1">
              Operasional, Listrik, Bisyarah & Sosial
            </span>
          </div>

          <div className="bg-gradient-to-br from-[#1C4E44] to-[#12362F] border-2 border-[#D4AF37] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1">
              <span className="uppercase tracking-wider font-bold text-[#D4AF37]">Saldo Kas Berjalan</span>
              <Wallet className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-2xl font-black font-mono text-[#D4AF37]">
              {formatRupiah(FINANCIAL_DATA.saldoAkhir)}
            </span>
            <span className="text-[10px] text-emerald-200/80 block mt-1">
              Status Terverifikasi Bendahara DKM
            </span>
          </div>

        </div>

        {/* 2-Columns: Detailed Breakdown Table vs QRIS Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Detailed Ledger breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B211C] border border-emerald-800/80 rounded-3xl p-6 sm:p-7 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-white mb-1">
                Rincian Arus Kas DKM ({FINANCIAL_DATA.periode})
              </h3>
              <p className="text-xs text-slate-300">
                Pencatatan terbuka setiap Jum'at sebelum pelaksanaan Sholat Jum'at.
              </p>
            </div>

            {/* Pemasukan */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Pemasukan Bulan Berjalan:
              </span>
              <div className="space-y-1.5 text-xs">
                {FINANCIAL_DATA.rincianPemasukan.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-200">{item.label}</span>
                    <span className="font-mono font-bold text-emerald-300">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengeluaran */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block mb-2">
                Pengeluaran Operasional & Program:
              </span>
              <div className="space-y-1.5 text-xs">
                {FINANCIAL_DATA.rincianPengeluaran.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-200">{item.label}</span>
                    <span className="font-mono font-bold text-rose-200">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs text-slate-400">
              <span>Laporan disahkan oleh Bendahara DKM As-Safar</span>
              <span>Update: Tiap Pekan</span>
            </div>
          </div>

          {/* QRIS & Infaq Bank Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#163E35] to-[#0E2822] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-7 text-center shadow-2xl space-y-5">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold">
              <QrCode className="w-3.5 h-3.5" />
              <span>QRIS STANDAR BANK INDONESIA</span>
            </div>

            <h3 className="text-xl font-serif font-black text-white">
              Salurkan Infaq & Sedekah
            </h3>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl w-fit mx-auto shadow-lg border border-slate-300">
              {qrisUrl && (
                <img 
                  src={qrisUrl} 
                  alt="QRIS DKM Masjid As-Safar" 
                  className="w-48 h-48 mx-auto"
                />
              )}
              <div className="mt-2 text-center">
                <span className="text-[11px] font-sans font-bold text-[#0F2A25] uppercase tracking-wider block">
                  NMID: ID1022091432109
                </span>
                <span className="text-[10px] font-sans text-slate-500 block">
                  DKM MASJID AS-SAFAR
                </span>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-black/30 rounded-2xl p-4 text-left border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                Transfer Rekening Bank Syariah:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm block">
                    {MASJID_SIMAS_DATA.kontak.rekeningInfaq.bank}
                  </span>
                  <span className="font-mono text-base font-bold text-[#D4AF37]">
                    {MASJID_SIMAS_DATA.kontak.rekeningInfaq.nomorRekening}
                  </span>
                  <span className="text-[10px] text-slate-300 block">
                    a.n. {MASJID_SIMAS_DATA.kontak.rekeningInfaq.atasNama}
                  </span>
                </div>

                <button
                  onClick={handleCopyRekening}
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#0F2A25] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {copiedRekening ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRekening ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-emerald-200/70 italic">
              "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..." (QS. Al-Baqarah: 261)
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
