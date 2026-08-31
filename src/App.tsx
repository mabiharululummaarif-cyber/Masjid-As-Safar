import React, { useState, useEffect } from 'react';
import { HotspotItem, MosqueConfig } from './types';
import { INITIAL_HOTSPOTS, DEFAULT_CONFIG } from './data/initialHotspots';
import { MosqueCanvas3D } from './components/MosqueCanvas3D';
import { HotspotDetailPanel } from './components/HotspotDetailPanel';
import { EditHotspotModal } from './components/EditHotspotModal';
import { MosqueConfigModal } from './components/MosqueConfigModal';
import { FacilityListDrawer } from './components/FacilityListDrawer';
import { ExportImportModal } from './components/ExportImportModal';
import { ControlOverlay } from './components/ControlOverlay';
import { Plus, Sliders, Layers, FileJson, Sun, Moon, Sunset, RotateCcw } from 'lucide-react';

const STORAGE_HOTSPOTS_KEY = 'masjid_as_safar_hotspots_v2';
const STORAGE_CONFIG_KEY = 'masjid_as_safar_config_v2';

export default function App() {
  // Load initial data from localStorage if available
  const [hotspots, setHotspots] = useState<HotspotItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HOTSPOTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved hotspots', e);
    }
    return INITIAL_HOTSPOTS;
  });

  const [config, setConfig] = useState<MosqueConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved config', e);
    }
    return DEFAULT_CONFIG;
  });

  // UI States
  const [isInterior, setIsInterior] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<HotspotItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Coordinate Picker state
  const [isPlacingCoordinate, setIsPlacingCoordinate] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState<[number, number, number] | null>(null);
  const [focusPosition, setFocusPosition] = useState<[number, number, number] | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HOTSPOTS_KEY, JSON.stringify(hotspots));
    } catch (e) {
      console.warn('Failed to save hotspots', e);
    }
  }, [hotspots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config', e);
    }
  }, [config]);

  // Handlers
  const handleSelectHotspot = (hotspot: HotspotItem | null) => {
    setSelectedHotspot(hotspot);
  };

  const handleFocusCamera = (pos: [number, number, number]) => {
    setFocusPosition([...pos]);
  };

  const handleOpenEdit = (hotspot: HotspotItem) => {
    setEditingHotspot(hotspot);
    setIsEditModalOpen(true);
    // If facility is inside, switch to interior view
    if (hotspot.interiorOnly && !isInterior) {
      setIsInterior(true);
    }
  };

  const handleAddNewHotspot = () => {
    setEditingHotspot(null);
    setPickedCoordinates(null);
    setIsEditModalOpen(true);
    if (!isInterior) {
      setIsInterior(true);
    }
  };

  const handleSaveHotspot = (updated: HotspotItem) => {
    setHotspots(prev => {
      const exists = prev.some(h => h.id === updated.id);
      if (exists) {
        return prev.map(h => (h.id === updated.id ? updated : h));
      } else {
        return [...prev, updated];
      }
    });

    if (selectedHotspot?.id === updated.id) {
      setSelectedHotspot(updated);
    }

    setFocusPosition(updated.pos);
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots(prev => prev.filter(h => h.id !== id));
    if (selectedHotspot?.id === id) {
      setSelectedHotspot(null);
    }
  };

  const handleRequestPickCoordinates = () => {
    setIsEditModalOpen(false);
    setIsPlacingCoordinate(true);
  };

  const handleCoordinatePlaced = (pos: [number, number, number]) => {
    setPickedCoordinates(pos);
    setIsPlacingCoordinate(false);
    setIsEditModalOpen(true);
  };

  const handleCycleTimeOfDay = () => {
    const sequence: ('day' | 'sunset' | 'night')[] = ['day', 'sunset', 'night'];
    const currIdx = sequence.indexOf(config.timeOfDay);
    const nextTime = sequence[(currIdx + 1) % sequence.length];
    setConfig(prev => ({ ...prev, timeOfDay: nextTime }));
  };

  const handleResetView = () => {
    setSelectedHotspot(null);
    setFocusPosition(isInterior ? [0, 2.4, 0.5] : [0, 2.0, 0]);
  };

  const handleResetDefaults = () => {
    setHotspots(INITIAL_HOTSPOTS);
    setConfig(DEFAULT_CONFIG);
    setSelectedHotspot(null);
    localStorage.removeItem(STORAGE_HOTSPOTS_KEY);
    localStorage.removeItem(STORAGE_CONFIG_KEY);
  };

  const handleImportData = (data: { hotspots: HotspotItem[]; config?: MosqueConfig }) => {
    if (data.hotspots) {
      setHotspots(data.hotspots);
    }
    if (data.config) {
      setConfig(data.config);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#E8DCC0] font-sans flex flex-col overflow-hidden text-[#163832] select-none">
      {/* Header Bar — Theme Styled */}
      <header className="h-16 bg-[#163832] text-[#E8DCC0] flex items-center justify-between px-5 sm:px-8 border-b-4 border-[#C9A227] z-30 shrink-0 shadow-md">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#C9A227] rounded-full flex items-center justify-center text-[#163832] font-bold text-lg shadow-sm shrink-0">
            A
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F7F3E8] leading-tight">
              Masjid As-Safar
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 text-[#E8DCC0]">
              Facility Inventory System v2.1
            </p>
          </div>
        </div>

        {/* Center / Right Navigation Tabs */}
        <div className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium">
          <button
            onClick={handleResetView}
            className="opacity-100 border-b-2 border-[#C9A227] pb-1 cursor-pointer font-bold text-[#F7F3E8] hover:text-[#C9A227] transition-colors"
          >
            Visualisasi 3D
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="opacity-75 hover:opacity-100 cursor-pointer text-[#E8DCC0] flex items-center gap-1.5 transition-opacity"
          >
            <span>Daftar Inventaris</span>
            <span className="bg-[#C9A227] text-[#163832] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {hotspots.length}
            </span>
          </button>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="opacity-75 hover:opacity-100 cursor-pointer text-[#E8DCC0] hidden md:flex items-center gap-1.5 transition-opacity"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Saf & Fasilitas</span>
          </button>

          <button
            onClick={() => setIsExportImportOpen(true)}
            className="opacity-75 hover:opacity-100 cursor-pointer text-[#E8DCC0] hidden lg:flex items-center gap-1.5 transition-opacity"
          >
            <FileJson className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Laporan & Ekspor</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={handleAddNewHotspot}
            className="bg-[#C9A227] hover:bg-[#dbb334] text-[#163832] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Fasilitas</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* 3D Scene Viewport Canvas */}
        <div className="flex-1 relative bg-gradient-to-br from-[#d9ceb2] to-[#c9bd9f] overflow-hidden">
          <MosqueCanvas3D
            hotspots={hotspots}
            config={config}
            isInterior={isInterior}
            selectedHotspotId={selectedHotspot?.id || null}
            onSelectHotspot={handleSelectHotspot}
            isPlacingHotspot={isPlacingCoordinate}
            onPlaceCoordinates={handleCoordinatePlaced}
            focusPosition={focusPosition}
          />

          {/* Top-Left & Bottom Controls Overlay */}
          <ControlOverlay
            isInterior={isInterior}
            onToggleInterior={() => setIsInterior(prev => !prev)}
            config={config}
            onOpenInventoryList={() => setIsDrawerOpen(true)}
            onOpenSafSettings={() => setIsConfigModalOpen(true)}
            onOpenAddNew={handleAddNewHotspot}
            onOpenExportImport={() => setIsExportImportOpen(true)}
            onCycleTimeOfDay={handleCycleTimeOfDay}
            onResetView={handleResetView}
            totalHotspots={hotspots.length}
          />
        </div>

        {/* Right Aside Detail Panel */}
        <HotspotDetailPanel
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          onEdit={handleOpenEdit}
          onFocusCamera={handleFocusCamera}
          onOpenInventoryList={() => setIsDrawerOpen(true)}
          totalHotspots={hotspots.length}
        />
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-[#f5f0e1] border-t border-[#163832]/10 flex items-center justify-between px-5 sm:px-8 text-[11px] font-medium text-[#163832]/70 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Status: Terhubung ke Database Lokal (Persisten)
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Lokasi: Tol Cipularang KM 88 (Arah Kiblat 295°)</span>
        </div>
        <div className="text-[10px] sm:text-[11px]">
          DKM Masjid As-Safar &bull; 2024
        </div>
      </footer>

      {/* Searchable Facility Drawer */}
      <FacilityListDrawer
        isOpen={isDrawerOpen}
        hotspots={hotspots}
        selectedHotspotId={selectedHotspot?.id || null}
        onClose={() => setIsDrawerOpen(false)}
        onSelectHotspot={hotspot => {
          setSelectedHotspot(hotspot);
          if (hotspot.interiorOnly && !isInterior) {
            setIsInterior(true);
          }
          handleFocusCamera(hotspot.pos);
          setIsDrawerOpen(false);
        }}
        onAddNew={() => {
          setIsDrawerOpen(false);
          handleAddNewHotspot();
        }}
        onEdit={hotspot => {
          setIsDrawerOpen(false);
          handleOpenEdit(hotspot);
        }}
      />

      {/* Edit / Add Facility Modal */}
      <EditHotspotModal
        isOpen={isEditModalOpen}
        hotspot={editingHotspot}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsPlacingCoordinate(false);
        }}
        onSave={handleSaveHotspot}
        onDelete={handleDeleteHotspot}
        onRequestPickCoordinates={handleRequestPickCoordinates}
        currentPickedCoords={pickedCoordinates}
      />

      {/* Mosque & Saf Configuration Modal */}
      <MosqueConfigModal
        isOpen={isConfigModalOpen}
        config={config}
        onClose={() => setIsConfigModalOpen(false)}
        onUpdateConfig={newConfig => setConfig(newConfig)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Export / Import & Print Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        hotspots={hotspots}
        config={config}
        onClose={() => setIsExportImportOpen(false)}
        onImportData={handleImportData}
      />
    </div>
  );
}

