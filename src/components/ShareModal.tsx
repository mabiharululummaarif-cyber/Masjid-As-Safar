import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Copy, Check, MessageSquare, Share2, 
  Camera, QrCode, Download, ShieldCheck, FileText, CheckCircle2
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

  const simasSubmissionText = `Yth. Petugas Verifikator SIMAS Kemenag RI / KUA Kecamatan,

Berikut kami sampaikan tautan Website Resmi & Portofolio Arsitektur Digital untuk verifikasi pendaftaran data SIMAS:
• Nama Masjid: ${MASJID_SIMAS_DATA.namaMasjid}
• Nomor ID SIMAS: ${MASJID_SIMAS_DATA.idSimas}
• Tipologi: ${MASJID_SIMAS_DATA.tipologi}
• Legalitas Wakaf: ${MASJID_SIMAS_DATA.nomorSertifikatWakaf} (AIW: ${MASJID_SIMAS_DATA.nomorAIW})
• Titik Geospasial: ${MASJID_SIMAS_DATA.koordinat.lat}, ${MASJID_SIMAS_DATA.koordinat.lng} (Kiblat: ${MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°)
• Tautan Website & Tur 3D: ${currentUrl}

Mohon dapat diverifikasi pada database SIMAS Bimas Islam Kemenag. Terima kasih.
Wassalamu'alaikum Wr. Wb.
- DKM Masjid As-Safar`;

  const generalShareText = `Assalamu'alaikum Wr. Wb. 
Kunjungi Website Resmi & Tur Virtual 3D Masjid As-Safar (Terdaftar SIMAS Kemenag RI ID: ${MASJID_SIMAS_DATA.idSimas}):
Jelajahi arsitektur 360°, interior mihrab marmer, jadwal sholat akurat, dan transparansi laporan kas DKM di: ${currentUrl}`;

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
          title: 'Website Resmi Masjid As-Safar — SIMAS Kemenag RI',
          text: `Website Resmi Masjid As-Safar (ID SIMAS: ${MASJID_SIMAS_DATA.idSimas}) & Tur Virtual 3D`,
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
        <div className="bg-gradient-to-r from-[#0F2A25] via-[#1B4332] to-[#2D6A4F] text-white p-5 relative border-b-2 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-xl shadow-inner">
                🕌
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#FFEAA7] tracking-wide font-serif">
                  Bagikan Website Masjid As-Safar
                </h3>
                <p className="text-xs text-emerald-200/90">
                  Terdaftar Resmi SIMAS Kemenag RI • ID: {MASJID_SIMAS_DATA.idSimas}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share Target Selector */}
          <div className="mt-4 flex rounded-xl bg-black/25 p-1 text-xs">
            <button
              onClick={() => setShareType('simas')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                shareType === 'simas'
                  ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Untuk SIMAS Kemenag / KUA</span>
            </button>

            <button
              onClick={() => setShareType('general')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                shareType === 'general'
                  ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Untuk Jamaah & Pengurus</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Kirim via WhatsApp</span>
            </button>

            <button
              onClick={handleCopyFormattedText}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#0F2A25] hover:bg-[#1B4332] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {copiedSimas ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4 text-[#D4AF37]" />}
              <span>{copiedSimas ? 'Format Disalin!' : 'Salin Teks Lengkap'}</span>
            </button>
          </div>

          {/* Preview of Formatted Text */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Pratinjau Teks {shareType === 'simas' ? 'Format SIMAS' : 'Pesan Jamaah'}:</span>
              <button 
                onClick={handleCopyFormattedText}
                className="text-emerald-700 hover:underline font-bold"
              >
                {copiedSimas ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <pre className="text-[11px] font-sans text-slate-700 whitespace-pre-wrap bg-white p-2.5 rounded-xl border border-slate-200 max-h-32 overflow-y-auto">
              {activeText}
            </pre>
          </div>

          {/* Screenshot capture card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2A25]">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Foto Desain 3D Ber-Watermark</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Unduh foto resolusi tinggi berstempel resmi Masjid As-Safar & ID SIMAS
              </p>
            </div>
            <button
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-700 hover:text-white text-[#0F2A25] border border-emerald-300 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isCapturing ? 'Memproses...' : 'Unduh Foto'}</span>
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tautan Website Resmi (URL)
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0F2A25] hover:bg-[#1B4332] text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code Link" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[#0F2A25] flex items-center justify-center sm:justify-start gap-1">
                <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Scan QR Code Verifikasi</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Scan menggunakan kamera smartphone untuk membuka portal resmi Masjid As-Safar dan tur virtual 3D interaktif.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
