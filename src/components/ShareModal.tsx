import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Copy, Check, MessageSquare, Share2, 
  Camera, QrCode, Download, ShieldCheck, FileText, CheckCircle2, MapPin
} from 'lucide-react';
import { capture3DScreenshot } from '../utils/screenshot';
import { MASJID_SIMAS_DATA } from '../data/simasData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedSimas, setCopiedSimas] = useState(false);
  const [shareType, setShareType] = useState<'simas' | 'general'>('simas');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureToast, setCaptureToast] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (isOpen && currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#0F2A25',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR Error:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const simasSubmissionText = `Yth. Petugas Verifikator SIMAS Kemenag Kab. Pinrang / KUA Kecamatan Suppa,

Berikut kami sampaikan tautan Website Informasi & Portofolio Arsitektur 3D Masjid As-Safar untuk keperluan inventarisasi dan verifikasi pendaftaran data SIMAS:
• Nama Masjid: ${MASJID_SIMAS_DATA.namaMasjid}
• Lokasi: Desa ${MASJID_SIMAS_DATA.desa}, Kec. ${MASJID_SIMAS_DATA.kecamatan}, Kab. ${MASJID_SIMAS_DATA.kabupatenKota}, ${MASJID_SIMAS_DATA.provinsi}
• Zona Waktu: ${MASJID_SIMAS_DATA.zonaWaktu} (UTC+8)
• Status ID SIMAS: ${MASJID_SIMAS_DATA.idSimas} (Menunggu Konfirmasi DKM / KUA Kec. Suppa)
• Titik Geospasial: Lat ${MASJID_SIMAS_DATA.koordinat.lat}, Lng ${MASJID_SIMAS_DATA.koordinat.lng} (Estimasi Wilayah Suppa — Menunggu Titik GPS Presisi)
• Estimasi Arah Kiblat: ~${MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°
• Tautan Website & Tur 3D: ${currentUrl}

Mohon dapat menjadi bahan informasi untuk proses pendaftaran resmi pada pangkalan data SIMAS Kemenag. Terima kasih.
Wassalamu'alaikum Wr. Wb.
- DKM Masjid As-Safar (Desa Lero, Kec. Suppa)`;

  const generalShareText = `Assalamu'alaikum Wr. Wb. 
Kunjungi Website Informasi & Tur Virtual 3D Masjid As-Safar (Desa Lero, Kec. Suppa, Kab. Pinrang, Sulawesi Selatan):
Jelajahi rancangan arsitektur 360°, interior mihrab marmer, jadwal sholat wilayah Suppa (WITA), dan profil persiapan SIMAS Kemenag di: ${currentUrl}`;

  const activeText = shareType === 'simas' ? simasSubmissionText : generalShareText;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleCopyFormattedText = async () => {
    try {
      await navigator.clipboard.writeText(activeText);
      setCopiedSimas(true);
      setTimeout(() => setCopiedSimas(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(activeText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Website Masjid As-Safar — Desa Lero, Kec. Suppa, Kab. Pinrang',
          text: `Website Informasi Masjid As-Safar, Desa Lero, Kec. Suppa, Kab. Pinrang & Tur Virtual 3D`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    const res = await capture3DScreenshot();
    setIsCapturing(false);
    if (res.success) {
      setCaptureToast(true);
      setTimeout(() => setCaptureToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-[#0F2A25] via-[#1B4332] to-[#2D6A4F] text-white p-4 sm:p-5 relative border-b-2 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-lg sm:text-xl shadow-inner shrink-0">
                🕌
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-lg text-[#FFEAA7] tracking-wide font-serif truncate">
                  Bagikan Website Masjid As-Safar
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-200/90 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                  <span className="truncate">Desa Lero, Kec. Suppa, Pinrang (WITA)</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share Target Selector */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row rounded-xl bg-black/25 p-1 text-xs gap-1">
            <button
              onClick={() => setShareType('simas')}
              className={`min-h-[38px] flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                shareType === 'simas'
                  ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Untuk Kemenag Pinrang / KUA</span>
            </button>

            <button
              onClick={() => setShareType('general')}
              className={`min-h-[38px] flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                shareType === 'general'
                  ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Untuk Jamaah & Warga</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>Kirim via WhatsApp</span>
            </button>

            <button
              onClick={handleCopyFormattedText}
              className="min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl sm:rounded-2xl bg-[#0F2A25] hover:bg-[#1B4332] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {copiedSimas ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />}
              <span>{copiedSimas ? 'Format Disalin!' : 'Salin Teks Lengkap'}</span>
            </button>
          </div>

          {/* Preview of Formatted Text */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Pratinjau Teks {shareType === 'simas' ? 'Format SIMAS' : 'Pesan Jamaah'}:</span>
              <button 
                onClick={handleCopyFormattedText}
                className="text-emerald-700 hover:underline font-bold min-h-[30px] flex items-center"
              >
                {copiedSimas ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <pre className="text-[11px] font-sans text-slate-700 whitespace-pre-wrap bg-white p-2.5 rounded-xl border border-slate-200 max-h-28 sm:max-h-32 overflow-y-auto">
              {activeText}
            </pre>
          </div>

          {/* Screenshot capture card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2A25]">
                <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Foto Desain 3D Ber-Watermark</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Unduh foto resolusi tinggi berstempel Masjid As-Safar (Desa Lero, Kec. Suppa)
              </p>
            </div>
            <button
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-700 hover:text-white text-[#0F2A25] border border-emerald-300 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isCapturing ? 'Memproses...' : 'Unduh Foto 3D'}</span>
            </button>
          </div>

          {captureToast && (
            <div className="p-2.5 bg-emerald-700 text-white rounded-xl text-center text-xs font-bold animate-in fade-in flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Foto arsitektur berhasil disimpan!</span>
            </div>
          )}

          {/* Direct Link Copy Box */}
          <div className="space-y-1">
            <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tautan Website (URL)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-emerald-600 transition-colors">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs text-slate-700 px-2 font-mono outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0F2A25] hover:bg-[#1B4332] text-white active:scale-95'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code Link" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[#0F2A25] flex items-center justify-center sm:justify-start gap-1">
                <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Scan QR Code Tautan</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Scan menggunakan kamera ponsel untuk membuka portal informasi Masjid As-Safar dan tur arsitektur 3D interaktif.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer active:scale-95 text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
