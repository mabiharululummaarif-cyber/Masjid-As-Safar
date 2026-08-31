import React from 'react';
import { MosqueConfig } from '../types';
import { Settings, X, Sliders, Users, Wind, Volume2, Sun, Moon, Sunset, Compass, Shield, RotateCcw } from 'lucide-react';

interface MosqueConfigModalProps {
  isOpen: boolean;
  config: MosqueConfig;
  onClose: () => void;
  onUpdateConfig: (newConfig: MosqueConfig) => void;
  onResetDefaults: () => void;
}

export const MosqueConfigModal: React.FC<MosqueConfigModalProps> = ({
  isOpen,
  config,
  onClose,
  onUpdateConfig,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const totalJamaah = (config.safMale + config.safFemale) * 16;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f2a25] border border-[#C9A227]/40 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#F7F3E8]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#C9A227]/20 flex items-center justify-between bg-[#163832]/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C9A227]" />
            <h3 className="font-serif-islamic text-lg font-bold text-[#F7F3E8]">
              Pengaturan Saf & Fasilitas 3D
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5 rounded-lg hover:bg-[#163832] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-xl bg-[#163832] border border-[#C9A227]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-[#E8DCC0]/70">Estimasi Kapasitas Jamaah Aula</p>
                <p className="font-serif-islamic text-lg font-bold text-[#C9A227]">
                  ± {totalJamaah} Orang <span className="text-xs font-normal text-[#E8DCC0]/60">({config.safMale + config.safFemale} Total Saf)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Saf Controls */}
          <div className="space-y-4 p-4 rounded-xl bg-[#163832]/60 border border-[#E8DCC0]/15">
            <h4 className="font-bold text-xs text-[#C9A227] flex items-center gap-2">
              <Users className="w-4 h-4" /> Konfigurasi Baris Saf Karpet
            </h4>

            {/* Saf Male */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#E8DCC0] font-medium">Saf Depan (Jamaah Laki-laki):</span>
                <span className="font-bold text-[#C9A227] bg-[#163832] px-2 py-0.5 rounded border border-[#C9A227]/30">
                  {config.safMale} Saf (± {config.safMale * 16} orang)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={config.safMale}
                onChange={e => onUpdateConfig({ ...config, safMale: parseInt(e.target.value) || 1 })}
                className="w-full accent-[#2F6B4F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#E8DCC0]/50">
                <span>1 Saf</span>
                <span>4 Saf (Default)</span>
                <span>8 Saf</span>
              </div>
            </div>

            {/* Saf Female */}
            <div className="space-y-1.5 pt-2 border-t border-[#E8DCC0]/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#E8DCC0] font-medium">Saf Belakang (Jamaah Perempuan):</span>
                <span className="font-bold text-[#C9A227] bg-[#163832] px-2 py-0.5 rounded border border-[#C9A227]/30">
                  {config.safFemale} Saf (± {config.safFemale * 16} orang)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={config.safFemale}
                onChange={e => onUpdateConfig({ ...config, safFemale: parseInt(e.target.value) || 1 })}
                className="w-full accent-[#7a2d24] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#E8DCC0]/50">
                <span>1 Saf</span>
                <span>5 Saf (Default)</span>
                <span>7 Saf</span>
              </div>
            </div>

            {/* Tabir Divider */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC0]/10">
              <span className="text-[#E8DCC0] font-medium">Tabir Pembatas Saf Hijab:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showTabir}
                  onChange={e => onUpdateConfig({ ...config, showTabir: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
              </label>
            </div>
          </div>

          {/* AC & Speaker Count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#163832]/60 rounded-xl border border-[#E8DCC0]/15 space-y-2">
              <label className="text-[11px] font-semibold text-[#E8DCC0] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#C9A227]" /> Jumlah Unit AC
              </label>
              <div className="flex items-center justify-between">
                <select
                  value={config.acCount}
                  onChange={e => onUpdateConfig({ ...config, acCount: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#0f2a25] border border-[#E8DCC0]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#F7F3E8]"
                >
                  <option value="1">1 Unit AC (Asumsi Awal)</option>
                  <option value="2">2 Unit AC</option>
                  <option value="3">3 Unit AC (Rekomendasi)</option>
                  <option value="4">4 Unit AC</option>
                  <option value="6">6 Unit AC (Optimal)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#163832]/60 rounded-xl border border-[#E8DCC0]/15 space-y-2">
              <label className="text-[11px] font-semibold text-[#E8DCC0] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#C9A227]" /> Jumlah Toa / Speaker
              </label>
              <div className="flex items-center justify-between">
                <select
                  value={config.toaCount}
                  onChange={e => onUpdateConfig({ ...config, toaCount: parseInt(e.target.value) || 2 })}
                  className="w-full bg-[#0f2a25] border border-[#E8DCC0]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#F7F3E8]"
                >
                  <option value="2">2 Unit (Langit-langit Depan)</option>
                  <option value="4">4 Unit (Depan & Belakang)</option>
                  <option value="6">6 Unit Surround</option>
                </select>
              </div>
            </div>
          </div>

          {/* Minaret & Visual Toggles */}
          <div className="p-3 bg-[#163832]/60 rounded-xl border border-[#E8DCC0]/15 space-y-3">
            <h4 className="font-bold text-xs text-[#C9A227]">Elemen Arsitektur & Bantuan Visual</h4>

            {/* Minaret Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[#E8DCC0]">Menara / Minaret Luar:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.minaretVisible}
                  onChange={e => onUpdateConfig({ ...config, minaretVisible: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
              </label>
            </div>

            {/* Qibla & Compass Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC0]/10">
              <span className="text-[#E8DCC0] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> Kompas & Arah Kiblat (Luar & Dalam):
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showQibla}
                  onChange={e => onUpdateConfig({ ...config, showQibla: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
              </label>
            </div>

            {/* Hotspots Marker Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC0]/10">
              <span className="text-[#E8DCC0]">Marker Titik Emas Hotspot:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showHotspots}
                  onChange={e => onUpdateConfig({ ...config, showHotspots: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]"></div>
              </label>
            </div>
          </div>

          {/* Time of Day Lighting */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#E8DCC0] block">
              Suasana Pencahayaan 3D
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateConfig({ ...config, timeOfDay: 'day' })}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  config.timeOfDay === 'day'
                    ? 'bg-[#C9A227] text-[#1B2420] border-[#C9A227] font-bold shadow-md'
                    : 'bg-[#163832] text-[#E8DCC0] border-[#E8DCC0]/20 hover:bg-[#2F6B4F]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-[10px]">Siang / Terang</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateConfig({ ...config, timeOfDay: 'sunset' })}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  config.timeOfDay === 'sunset'
                    ? 'bg-[#C9A227] text-[#1B2420] border-[#C9A227] font-bold shadow-md'
                    : 'bg-[#163832] text-[#E8DCC0] border-[#E8DCC0]/20 hover:bg-[#2F6B4F]'
                }`}
              >
                <Sunset className="w-4 h-4" />
                <span className="text-[10px]">Senja / Maghrib</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateConfig({ ...config, timeOfDay: 'night' })}
                className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  config.timeOfDay === 'night'
                    ? 'bg-[#C9A227] text-[#1B2420] border-[#C9A227] font-bold shadow-md'
                    : 'bg-[#163832] text-[#E8DCC0] border-[#E8DCC0]/20 hover:bg-[#2F6B4F]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-[10px]">Malam / Isya</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#C9A227]/20 flex items-center justify-between bg-[#163832]/80">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan semua konfigurasi ke bawaan Masjid As-Safar?')) {
                onResetDefaults();
              }
            }}
            className="flex items-center gap-1 text-[11px] text-[#E8DCC0]/60 hover:text-[#C9A227] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
