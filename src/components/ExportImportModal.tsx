import React, { useState } from 'react';
import { HotspotItem, MosqueConfig } from '../types';
import { Download, Upload, Copy, Check, X, FileJson, Printer, RefreshCw, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  hotspots: HotspotItem[];
  config: MosqueConfig;
  onClose: () => void;
  onImportData: (data: { hotspots: HotspotItem[]; config?: MosqueConfig }) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  hotspots,
  config,
  onClose,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'print'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportPayload = {
    appName: 'Masjid As-Safar 3D Facility Inventory',
    version: '1.2',
    exportedAt: new Date().toISOString(),
    config,
    hotspots,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventaris-masjid-as-safar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        validateAndImport(parsed);
      } catch (err) {
        setErrorMsg('Format JSON tidak valid: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!importJsonText.trim()) {
      setErrorMsg('Mohon tempel teks JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(importJsonText);
      validateAndImport(parsed);
    } catch (err) {
      setErrorMsg('Gagal membaca JSON: ' + (err as Error).message);
    }
  };

  const validateAndImport = (parsed: any) => {
    if (Array.isArray(parsed)) {
      // Direct array of hotspots
      onImportData({ hotspots: parsed });
      setSuccessMsg(`Berhasil mengimpor ${parsed.length} fasilitas masjid.`);
    } else if (parsed && parsed.hotspots && Array.isArray(parsed.hotspots)) {
      onImportData({
        hotspots: parsed.hotspots,
        config: parsed.config,
      });
      setSuccessMsg(`Berhasil memuat ${parsed.hotspots.length} fasilitas & pengaturan 3D.`);
    } else {
      setErrorMsg('Format JSON tidak cocok. Harus memuat array "hotspots".');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f2a25] border border-[#C9A227]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#F7F3E8]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#C9A227]/20 flex items-center justify-between bg-[#163832]/80">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-[#C9A227]" />
            <h3 className="font-serif-islamic text-lg font-bold text-[#F7F3E8]">
              Ekspor / Impor Data Inventaris
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5 rounded-lg hover:bg-[#163832] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DCC0]/15 bg-[#163832]/50 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('export'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#C9A227] text-[#C9A227] bg-[#163832]'
                : 'border-transparent text-[#E8DCC0]/70 hover:text-[#F7F3E8]'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Data (JSON)
          </button>
          <button
            onClick={() => { setActiveTab('import'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-[#C9A227] text-[#C9A227] bg-[#163832]'
                : 'border-transparent text-[#E8DCC0]/70 hover:text-[#F7F3E8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Impor / Restore Data
          </button>
          <button
            onClick={() => { setActiveTab('print'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'print'
                ? 'border-[#C9A227] text-[#C9A227] bg-[#163832]'
                : 'border-transparent text-[#E8DCC0]/70 hover:text-[#F7F3E8]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" /> Laporan Fisik DKM
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-[#E8DCC0]/80 leading-relaxed">
                Unduh atau salin seluruh data inventaris fasilitas, posisi koordinat 3D, catatan saf, dan konfigurasi masjid dalam format JSON standar.
              </p>

              <div className="relative">
                <pre className="w-full h-52 bg-[#091714] border border-[#E8DCC0]/20 rounded-xl p-3.5 text-[11px] font-mono text-[#E8DCC0] overflow-auto select-all">
                  {jsonString}
                </pre>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#163832] hover:bg-[#2F6B4F] text-[#E8DCC0] border border-[#E8DCC0]/30 rounded-xl font-bold transition-all cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C9A227]" />}
                  {copied ? 'Tersalin ke Clipboard!' : 'Salin JSON'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-xl font-bold transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Unduh File .JSON
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-[#E8DCC0]/80 leading-relaxed">
                Pilih file JSON atau tempel kode JSON inventaris untuk memulihkan atau menyinkronkan data fasilitas Masjid As-Safar.
              </p>

              <div className="p-4 rounded-xl bg-[#163832]/60 border border-dashed border-[#C9A227]/40 flex flex-col items-center justify-center text-center">
                <Upload className="w-8 h-8 text-[#C9A227] mb-2" />
                <label className="cursor-pointer font-bold text-xs text-[#C9A227] hover:underline mb-1">
                  Pilih File JSON dari Komputer
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-[#E8DCC0]/60">Format .json yang diekspor sebelumnya</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                  Atau Tempel Teks JSON di Sini:
                </label>
                <textarea
                  rows={5}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder='{"hotspots": [...]}'
                  className="w-full bg-[#091714] border border-[#E8DCC0]/20 rounded-xl p-3 text-[11px] font-mono text-[#F7F3E8] focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <button
                type="button"
                onClick={handleManualImport}
                className="w-full py-2.5 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Proses & Terapkan Data JSON
              </button>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="p-4 bg-white text-gray-900 rounded-xl space-y-3 font-sans" id="print-area">
                <div className="text-center border-b pb-2">
                  <h2 className="font-serif text-lg font-bold">DAFTAR INVENTARIS FASILITAS MASJID AS-SAFAR</h2>
                  <p className="text-xs text-gray-500">Laporan Resmi Dewan Kemakmuran Masjid (DKM)</p>
                  <p className="text-[10px] text-gray-400">Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-b pb-2">
                  <div><strong>Kapasitas Saf Laki-laki:</strong> {config.safMale} Saf (± {config.safMale * 16} Orang)</div>
                  <div><strong>Kapasitas Saf Perempuan:</strong> {config.safFemale} Saf (± {config.safFemale * 16} Orang)</div>
                  <div><strong>Pendingin Udara (AC):</strong> {config.acCount} Unit</div>
                  <div><strong>Audio / Horn Toa:</strong> {config.toaCount} Unit</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="p-1.5 font-semibold">No</th>
                        <th className="p-1.5 font-semibold">Fasilitas</th>
                        <th className="p-1.5 font-semibold">Kategori</th>
                        <th className="p-1.5 font-semibold">Kondisi</th>
                        <th className="p-1.5 font-semibold">PIC / Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotspots.map((h, i) => (
                        <tr key={h.id} className="border-b">
                          <td className="p-1.5">{i + 1}</td>
                          <td className="p-1.5 font-medium">{h.title}</td>
                          <td className="p-1.5 text-gray-600">{h.tag}</td>
                          <td className="p-1.5">
                            <span className={`px-1 py-0.5 rounded text-[10px] ${
                              h.condition === 'Baik' || !h.condition ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {h.condition || 'Baik'}
                            </span>
                          </td>
                          <td className="p-1.5 text-gray-600">{h.pic || '-'} {h.note ? `(${h.note})` : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar Inventaris DKM
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#C9A227]/20 flex items-center justify-end bg-[#163832]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#163832] hover:bg-[#2F6B4F] text-[#E8DCC0] border border-[#E8DCC0]/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
