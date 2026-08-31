/**
 * Data structures for Masjid As-Safar 3D Facility Inventory
 */

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

export interface HotspotRow {
  label: string;
  value: string;
}

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
  pic?: string; // Penanggung jawab
  lastInspection?: string;
  quantity?: number | string;
}

export interface MosqueConfig {
  safMale: number;       // default: 4 saf
  safFemale: number;     // default: 5 saf
  width: number;         // 10m
  depth: number;         // 16m
  height: number;        // 5m
  doorGap: number;       // 3m
  toaCount: number;      // 2-6 unit
  acCount: number;       // 1-6 unit
  minaretVisible: boolean; // Menara luar
  timeOfDay: 'day' | 'sunset' | 'night';
  showQibla: boolean;
  showHotspots: boolean;
  showDimensions: boolean;
  showTabir: boolean;
}
