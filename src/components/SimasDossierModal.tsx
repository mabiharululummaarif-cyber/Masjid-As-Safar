import React, { useEffect, useState } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { Printer, X, CheckCircle2, ShieldCheck, Download, Share2, Compass, MapPin, Building, Copy, Check } from 'lucide-react';
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
    navigator.clipboard.writeText(MASJID_SIMAS_DATA.idSimas);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto border border-emerald-900/20 print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-[#0F2A25] text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-semibold text-sm sm:text-base">Dokumen Lembar Profil Resmi SIMAS Kemenag RI</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c29e2e] text-[#0F2A25] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible font-serif">
          
          {/* Header Surat Resmi Kemenag SIMAS */}
          <div className="border-b-4 border-double border-slate-800 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#0F2A25] flex items-center justify-center text-white shrink-0 shadow-md">
                <Building className="w-9 h-9 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </p>
                <p className="text-[12px] font-sans font-semibold text-slate-700">
                  DIREKTORAT JENDERAL BIMBINGAN MASYARAKAT ISLAM
                </p>
                <h1 className="text-lg sm:text-xl font-bold text-[#0F2A25] font-serif uppercase tracking-tight">
                  SISTEM INFORMASI MASJID (SIMAS)
                </h1>
                <p className="text-[10px] font-sans text-slate-500">
                  Format Lembar Verifikasi Data Registrasi Masjid & Mushalla Nasional
                </p>
              </div>
            </div>

            {/* QR Verification */}
            <div className="text-center shrink-0">
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR Validasi SIMAS" className="w-20 h-20 border border-slate-300 rounded p-1 mx-auto" />
              )}
              <span className="text-[9px] font-sans font-semibold text-emerald-800 block mt-0.5">TERVALIDASI</span>
            </div>
          </div>

          {/* Banner ID SIMAS */}
          <div className="bg-emerald-50 border-2 border-emerald-700/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-900 block">
                Nomor Identitas SIMAS Nasional (ID Kemenag):
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono tracking-wider">
                {MASJID_SIMAS_DATA.idSimas}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: <strong>Aktif & Terdaftar Resmi di Pangkalan Data Kemenag</strong></span>
              </div>
            </div>

            <button
              onClick={handleCopyId}
              className="px-3.5 py-1.5 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin ID SIMAS'}</span>
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
                <span className="text-slate-500">Tahun Berdiri / Renovasi</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.tahunBerdiri}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Daya Tampung Jamaah</span>
                <span className="font-semibold text-slate-900">± {MASJID_SIMAS_DATA.kapasitasJamaah} Jamaah</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Luas Bangunan</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.luasBangunan} m² (Dimensi 22m x 22m)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Luas Tanah Wakaf</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.luasTanah} m²</span>
              </div>
            </div>
          </div>

          {/* Tabel Bagian II: Status Hukum & Legalitas Wakaf */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              II. STATUS TANAH & DOKUMEN WAKAF KEMENAG
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Status Tanah</span>
                <span className="font-bold text-emerald-800">{MASJID_SIMAS_DATA.statusTanah}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">No. Sertifikat Wakaf</span>
                <span className="font-mono font-semibold text-slate-900">{MASJID_SIMAS_DATA.nomorSertifikatWakaf}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">No. Akta Ikrar Wakaf (AIW)</span>
                <span className="font-mono font-semibold text-slate-900">{MASJID_SIMAS_DATA.nomorAIW}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nazhir Wakaf Terdaftar</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.nadzirWakaf}</span>
              </div>
            </div>
          </div>

          {/* Tabel Bagian III: Lokasi Geospasial & Kalibrasi Arah Kiblat */}
          <div className="font-sans space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 border-l-4 border-[#0F2A25]">
              III. LOKASI GEOGRAFIS & HASIL UKUR ARAH KIBLAT (BHR KEMENAG)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Alamat Wilayah</span>
                <span className="font-semibold text-slate-900 text-right">{MASJID_SIMAS_DATA.alamatLengkap}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Kelurahan / Kecamatan</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.kelurahan}, Kec. {MASJID_SIMAS_DATA.kecamatan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Kabupaten/Kota & Provinsi</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.kabupatenKota}, {MASJID_SIMAS_DATA.provinsi} {MASJID_SIMAS_DATA.kodePos}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Titik Koordinat GPS</span>
                <span className="font-mono font-semibold text-slate-900">{MASJID_SIMAS_DATA.koordinat.lat}, {MASJID_SIMAS_DATA.koordinat.lng}</span>
              </div>
              <div className="md:col-span-2 flex justify-between py-1 border-b border-slate-200 bg-amber-50/60 px-2 rounded">
                <span className="text-slate-700 font-medium">Azimuth Arah Kiblat</span>
                <span className="font-bold text-emerald-900 text-right">{MASJID_SIMAS_DATA.koordinat.kiblatDesc}</span>
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
                <span className="font-mono font-semibold text-slate-900">{MASJID_SIMAS_DATA.nomorSkDkm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Masa Bakti & Tanggal Terbit</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.tanggalSkDkm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 md:col-span-2">
                <span className="text-slate-500">Instansi Pengesah</span>
                <span className="font-semibold text-slate-900">{MASJID_SIMAS_DATA.instansiPenerbitSk}</span>
              </div>
            </div>
          </div>

          {/* Tanda Tangan & Pengesahan KUA / DKM */}
          <div className="pt-6 font-sans border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-800">Dewan Kemakmuran Masjid (DKM)</p>
              <p className="font-semibold text-[#0F2A25]">{MASJID_SIMAS_DATA.namaMasjid}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Stempel & Tanda Tangan DKM]</span>
              </div>
              <p className="font-bold text-slate-900 underline">H. Muhammad Ridwan, S.T., M.Si.</p>
              <p className="text-[10px] text-slate-500">Ketua DKM</p>
            </div>

            <div>
              <p className="text-slate-600">Diverifikasi & Dicatatkan Oleh,</p>
              <p className="font-bold text-slate-800">Petugas SIMAS / Penyuluh Agama Islam</p>
              <p className="font-semibold text-[#0F2A25]">KUA Kementerian Agama RI</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Validasi Digital SIMAS Kemenag]</span>
              </div>
              <p className="font-bold text-slate-900 underline">Drs. H. Syarif Hidayatullah, M.H.</p>
              <p className="text-[10px] text-slate-500">NIP. 197408152002121003</p>
            </div>
          </div>

          {/* Catatan Kaki Verifikasi */}
          <div className="text-[9px] font-sans text-slate-400 border-t border-slate-200 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Dokumen ini merupakan hasil cetak resmi data profil SIMAS Ditjen Bimas Islam Kemenag RI.</span>
            <span>Dicetak otomatis pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          </div>

        </div>

        {/* Footer info in Modal */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 print:hidden font-sans">
          <span>Bagikan atau tautkan link ini pada form pendaftaran SIMAS:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold cursor-pointer"
            >
              Salin ID
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
