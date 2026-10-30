import React, { useEffect, useState } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { Printer, X, ShieldCheck, Building, Copy, Check, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface SimasDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimasDossierModal: React.FC<SimasDossierModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const shareUrl = window.location.href;
      QRCode.toDataURL(shareUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0F2A25',
          light: '#FFFFFF'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(
      `Masjid As-Safar (Desa Lero, Kec. Suppa, Kab. Pinrang) - Status SIMAS: ${MASJID_SIMAS_DATA.idSimas}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto border border-emerald-900/20 print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-[#0F2A25] text-white px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
            <h2 className="font-semibold text-xs sm:text-base truncate">
              <span className="sm:hidden">Draf SIMAS Kemenag</span>
              <span className="hidden sm:inline">Draf Lembar Data SIMAS Kemenag</span>
            </h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="min-h-[34px] sm:min-h-[36px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#0F2A25] font-bold text-[11px] sm:text-xs rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Cetak Lembar SIMAS A4"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Notice of Draft / Non-Official Status */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex items-start sm:items-center gap-2 text-xs text-amber-900 font-sans print:bg-white print:border-b-2 print:border-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong>Draf Dokumen Persiapan:</strong> Lembar ini memuat rincian inventarisasi data awal untuk persiapan data profil masjid. Bukan dokumen resmi dan belum diverifikasi oleh pihak KUA Kecamatan Suppa.
          </span>
        </div>

        {/* Printable Document Body */}
        <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible font-serif">
          
          {/* Header Format Data SIMAS Kemenag */}
          <div className="border-b-4 border-double border-slate-800 pb-4 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#0F2A25] flex items-center justify-center text-white shrink-0 shadow-md">
                <Building className="w-8 h-8 sm:w-9 sm:h-9 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </p>
                <p className="text-[11px] sm:text-[12px] font-sans font-semibold text-slate-700">
                  KANTOR URUSAN AGAMA (KUA) KECAMATAN SUPPA — KABUPATEN PINRANG
                </p>
                <h1 className="text-base sm:text-xl font-bold text-[#0F2A25] font-serif uppercase tracking-tight mt-0.5">
                  FORMAT INVENTARISASI DATA SISTEM INFORMASI MASJID (SIMAS)
                </h1>
                <p className="text-[10px] font-sans text-slate-500">
                  Formulir Draf Pendaftaran & Verifikasi Lapangan Profil Masjid
                </p>
              </div>
            </div>

            {/* QR Verification Link */}
            <div className="text-center shrink-0">
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR Link Website" className="w-16 h-16 sm:w-20 sm:h-20 border border-slate-300 rounded p-1 mx-auto" />
              )}
              <span className="text-[9px] font-sans font-semibold text-amber-800 block mt-0.5">DRAF KONFIRMASI</span>
            </div>
          </div>

          {/* Banner Status ID SIMAS */}
          <div className="bg-amber-50/80 border-2 border-amber-600/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-amber-900 block">
                Nomor Identitas SIMAS Nasional (ID Kemenag):
              </span>
              <span className="text-lg sm:text-2xl font-black text-amber-950 font-mono tracking-wider block">
                {MASJID_SIMAS_DATA.idSimas}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-800 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Status: <strong>Menunggu Konfirmasi Pengurus DKM</strong></span>
              </div>
            </div>

            <button
              onClick={handleCopyId}
              className="min-h-[40px] px-3.5 py-2 bg-white border border-amber-600 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer print:hidden active:scale-95 w-full sm:w-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Keterangan'}</span>
            </button>
          </div>

          {/* Tabel Bagian I: Data Identitas Masjid */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              I. IDENTITAS & TIPOLOGI MASJID
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nama Resmi Masjid</span>
                <span className="font-bold text-slate-900">{MASJID_SIMAS_DATA.namaMasjid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Tipologi Masjid</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.tipologi}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Tahun Berdiri</span>
                <span className="font-semibold text-amber-800">{MASJID_SIMAS_DATA.tahunBerdiri}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Daya Tampung Jamaah</span>
                <span className="font-semibold text-slate-900">± {MASJID_SIMAS_DATA.kapasitasJamaah} Jamaah (Estimasi 3D)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Luas Bangunan</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.luasBangunan} m² (Dimensi Model 3D: 22m × 22m)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Luas Tanah</span>
                <span className="font-semibold text-amber-800">{MASJID_SIMAS_DATA.luasTanahDesc}</span>
              </div>
            </div>
          </div>

          {/* Tabel Bagian II: Status Hukum & Legalitas Wakaf */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              II. STATUS TANAH & DOKUMEN WAKAF
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Status Tanah</span>
                <span className="font-bold text-amber-800">{MASJID_SIMAS_DATA.statusTanah}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">No. Sertifikat Wakaf</span>
                <span className="font-mono font-semibold text-slate-600">{MASJID_SIMAS_DATA.nomorSertifikatWakaf}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">No. Akta Ikrar Wakaf (AIW)</span>
                <span className="font-mono font-semibold text-slate-600">{MASJID_SIMAS_DATA.nomorAIW}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nadzir Wakaf</span>
                <span className="font-semibold text-amber-800">{MASJID_SIMAS_DATA.nadzirWakaf}</span>
              </div>
            </div>
          </div>

          {/* Tabel Bagian III: Lokasi Geospasial & Kalibrasi Arah Kiblat */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              III. LOKASI GEOGRAFIS & KOORDINAT
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Alamat Wilayah</span>
                <span className="font-semibold text-slate-900 text-right">{MASJID_SIMAS_DATA.alamatLengkap}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Desa / Kecamatan</span>
                <span className="font-semibold text-slate-900">Desa {MASJID_SIMAS_DATA.desa}, Kec. {MASJID_SIMAS_DATA.kecamatan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Kabupaten & Provinsi</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.kabupatenKota}, {MASJID_SIMAS_DATA.provinsi} {MASJID_SIMAS_DATA.kodePos}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Titik Koordinat Referensi</span>
                <span className="font-mono font-semibold text-amber-800">{MASJID_SIMAS_DATA.koordinat.lat}, {MASJID_SIMAS_DATA.koordinat.lng} (Perkiraan)</span>
              </div>
              <div className="md:col-span-2 flex justify-between py-1 border-b border-slate-200 bg-amber-50/60 px-2 rounded">
                <span className="text-slate-700 font-medium">Azimuth Arah Kiblat</span>
                <span className="font-bold text-slate-900 text-right">{MASJID_SIMAS_DATA.koordinat.kiblatDesc}</span>
              </div>
            </div>
          </div>

          {/* Tabel Bagian IV: Legalitas SK DKM */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              IV. SURAT KEPUTUSAN (SK) PENGURUS DKM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nomor SK Pengukuhan DKM</span>
                <span className="font-mono font-semibold text-amber-800">{MASJID_SIMAS_DATA.nomorSkDkm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Masa Bakti</span>
                <span className="font-semibold text-amber-800">{MASJID_SIMAS_DATA.tanggalSkDkm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 md:col-span-2">
                <span className="text-slate-500">Instansi Yang Berwenang</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.instansiPenerbitSk}</span>
              </div>
            </div>
          </div>

          {/* Area Pengesahan / Kolom Konfirmasi */}
          <div className="pt-6 font-sans border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-600">Disiapkan Oleh,</p>
              <p className="font-bold text-slate-800">Dewan Kemakmuran Masjid (DKM)</p>
              <p className="font-semibold text-[#0F2A25]">{MASJID_SIMAS_DATA.namaMasjid}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Ruang Tanda Tangan & Stempel DKM]</span>
              </div>
              <p className="font-bold text-slate-700 underline">[Nama Ketua DKM - Dalam Konfirmasi]</p>
              <p className="text-[10px] text-slate-500">Ketua DKM</p>
            </div>

            <div>
              <p className="text-slate-600">Verifikasi Berkas Lapangan,</p>
              <p className="font-bold text-slate-800">Petugas KUA / Bimas Islam</p>
              <p className="font-semibold text-[#0F2A25]">KUA Kecamatan Suppa, Kab. Pinrang</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Ruang Verifikasi Lapangan Petugas KUA]</span>
              </div>
              <p className="font-bold text-slate-700 underline">[Menunggu Penunjukan Petugas KUA]</p>
              <p className="text-[10px] text-slate-500">NIP / Jabatan</p>
            </div>
          </div>

          {/* Catatan Kaki */}
          <div className="text-[9px] font-sans text-slate-400 border-t border-slate-200 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Draf formulir inventarisasi data profil masjid — bukan surat penetapan resmi. Menunggu konfirmasi pengurus DKM.</span>
            <span>Waktu cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          </div>

        </div>

        {/* Footer info in Modal */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 print:hidden font-sans">
          <span>Draf profil data Masjid As-Safar (Desa Lero, Kec. Suppa, Kab. Pinrang):</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold cursor-pointer"
            >
              Salin Info
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#0F2A25] hover:bg-[#1B4332] text-white rounded font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
