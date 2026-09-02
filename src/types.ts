/**
 * Data structures for Masjid As-Safar 3D Architectural Visualization
 */

export type RoofMode = 'solid' | 'transparent' | 'hidden';
export type CameraPreset = 
  | 'overview' 
  | 'exterior'
  | 'interior' 
  | 'mihrab' 
  | 'backDoor' 
  | 'leftDoor' 
  | 'rightDoor' 
  | 'topView' 
  | 'qibla';

export interface MosqueConfig {
  safMale: number;       // default: 4 saf
  safFemale: number;     // default: 5 saf
  width: number;         // 16m
  depth: number;         // 24m
  height: number;        // 6.5m
  doorGap: number;       // 3.6m
  toaCount: number;      // 2 unit
  acCount: number;       // 3 unit (wall fans)
  minaretVisible: boolean; // Menara luar
  timeOfDay: 'day' | 'sunset' | 'night';
  showQibla: boolean;
  showTabir: boolean;
  roofMode: RoofMode;
  autoRotate: boolean;
  fanSpeed: number;      // 0 (off), 1 (normal), 2 (fast)
  showDimensions: boolean;
  showHotspots?: boolean;
}

export type FacilityCategory = 
  | 'mihrab'
  | 'carpet'
  | 'audio'
  | 'cooling'
  | 'access'
  | 'structure'
  | 'sanitation'
  | 'furniture'
  | 'security'
  | 'other';

export type ItemCondition = 'Baik' | 'Perlu Pengecekan' | 'Perlu Perbaikan' | 'Rusak';

export interface HotspotItem {
  id: string;
  pos: [number, number, number];
  tag: string;
  title: string;
  category: FacilityCategory;
  rows: [string, string][];
  interiorOnly: boolean;
  note?: string;
  condition?: ItemCondition;
  pic?: string;
  lastInspection?: string;
  quantity?: number | string;
}

