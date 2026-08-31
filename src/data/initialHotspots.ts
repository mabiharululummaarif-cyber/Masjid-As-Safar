import { HotspotItem, MosqueConfig } from '../types';

export const DEFAULT_CONFIG: MosqueConfig = {
  safMale: 4,
  safFemale: 5,
  width: 10,
  depth: 16,
  height: 5,
  doorGap: 3,
  toaCount: 2,
  acCount: 3,
  minaretVisible: true,
  timeOfDay: 'day',
  showQibla: true,
  showHotspots: true,
  showDimensions: false,
  showTabir: true,
};

export const INITIAL_HOTSPOTS: HotspotItem[] = [
  {
    id: 'mimbar',
    pos: [0, 0.45, 6.8],
    tag: 'Mimbar & Mihrab',
    title: 'Mimbar & Ruang Khutbah',
    category: 'mihrab',
    rows: [
      ['Jumlah', '1 unit'],
      ['Material', 'Kayu Jati Ukir Kaligrafi Emas'],
      ['Letak', 'Depan tengah, dinding mihrab (+Z)'],
      ['Kondisi', 'Baik'],
      ['Fasilitas Pendukung', 'Mic Podium Condenser, Stand Mushaf']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-15',
    pic: 'Ustadz Ahmad (Imam Rawatib)',
    note: 'Mimbar berada di poros tengah mihrab utama menghadap arah kiblat.'
  },
  {
    id: 'ruang-imam',
    pos: [3.5, 1.2, 6.5],
    tag: 'Ruangan',
    title: 'Ruang Imam & DKM',
    category: 'structure',
    rows: [
      ['Jumlah', '1 ruang (2m × 2.5m)'],
      ['Letak', 'Sisi kanan mimbar, dinding depan'],
      ['Perlengkapan', 'Meja DKM, Rak Jubah, Kotak P3K'],
      ['Kondisi', 'Baik']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Ruangan',
    lastInspection: '2026-08-10',
    pic: 'Sekretariat DKM',
    note: 'Ruang transit imam dan penyimpanan inventaris administrasi masjid.'
  },
  {
    id: 'karpet-pria',
    pos: [0, 0.3, 4.4],
    tag: 'Karpet & Saf',
    title: 'Karpet Depan — Jamaah Laki-laki',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '4 Baris Saf'],
      ['Kapasitas', '± 64 Jamaah (16 orang/saf)'],
      ['Jenis Karpet', 'Rajut Tebal 14mm Premium Hijau Lumut'],
      ['Kondisi', 'Baik']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '4 Saf (10m x 4.4m)',
    lastInspection: '2026-08-20',
    pic: 'Divisi Kebersihan',
    note: 'Dibersihkan vakum harian sebelum sholat Zhuhur dan Maghrib.'
  },
  {
    id: 'karpet-wanita',
    pos: [0, 0.3, -4.2],
    tag: 'Karpet & Saf',
    title: 'Karpet Belakang — Jamaah Perempuan',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '5 Baris Saf (Dapat disesuaikan)'],
      ['Kapasitas', '± 80 Jamaah (16 orang/saf)'],
      ['Jenis Karpet', 'Merah Marun Tebal 12mm'],
      ['Kondisi', 'Baik'],
      ['Batas Area', 'Dilengkapi Tabir Hijab Geser']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '5 Saf (10m x 5.5m)',
    lastInspection: '2026-08-20',
    pic: 'Divisi Keputrian DKM',
    note: 'Jumlah saf jamaah perempuan dapat disesuaikan live di menu Pengaturan Saf.'
  },
  {
    id: 'pintu-kanan',
    pos: [5.0, 1.6, 0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Kanan (Sliding Door)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Pintu Sliding (2 Panel Kaca Tempered)'],
      ['Dimensi', 'Lebar 3.0m × Tinggi 3.2m'],
      ['Mekanisme', 'Sliding / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Dinding samping kanan, poros tengah aula']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Set (2 Daun)',
    lastInspection: '2026-08-01',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu geser kaca sisi kanan untuk akses sirkulasi jamaah ke koridor samping.'
  },
  {
    id: 'pintu-kiri',
    pos: [-5.0, 1.6, 0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Kiri (Sliding Door)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Pintu Sliding (2 Panel Kaca Tempered)'],
      ['Dimensi', 'Lebar 3.0m × Tinggi 3.2m'],
      ['Mekanisme', 'Sliding / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Dinding samping kiri, simetris pintu kanan']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Set (2 Daun)',
    lastInspection: '2026-08-01',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu geser kaca sisi kiri memberikan sirkulasi udara dan akses wudhu.'
  },
  {
    id: 'pintu-depan',
    pos: [-3.1, 1.6, 8.0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Depan (Sliding Door)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Pintu Sliding (2 Panel Kaca Tempered)'],
      ['Dimensi', 'Lebar 2.4m × Tinggi 3.2m'],
      ['Mekanisme', 'Sliding / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Dinding depan (sisi mihrab/kiblat, samping mimbar)']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Set (2 Daun)',
    lastInspection: '2026-08-01',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu geser kaca depan untuk akses jamaah dari arah serambi depan tanpa menghalangi mimbar.'
  },
  {
    id: 'toa-speaker-l',
    pos: [-3.5, 4.5, 4.4],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa Kiri',
    category: 'audio',
    rows: [
      ['Jumlah', '1 unit (Kiri)'],
      ['Tipe', 'Horn Ceiling Speaker 50W Impedansi Tinggi'],
      ['Letak', 'Plafon langit-langit aula depan kiri'],
      ['Kondisi', 'Baik & Jernih']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-18',
    pic: 'Pak Gunawan (Teknisi Audio)',
    note: 'Terhubung ke Amplifier Mixer TOA ZA-2120 di ruang imam.'
  },
  {
    id: 'toa-speaker-r',
    pos: [3.5, 4.5, 4.4],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa Kanan',
    category: 'audio',
    rows: [
      ['Jumlah', '1 unit (Kanan)'],
      ['Tipe', 'Horn Ceiling Speaker 50W Impedansi Tinggi'],
      ['Letak', 'Plafon langit-langit aula depan kanan'],
      ['Kondisi', 'Baik & Jernih']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-18',
    pic: 'Pak Gunawan (Teknisi Audio)',
    note: 'Pemeriksaan kabel sinyal rutin tiap awal bulan.'
  },
  {
    id: 'ac-pendingin',
    pos: [-4.75, 3.8, -2],
    tag: 'Tata Udara',
    title: 'AC Split Inverter (Sisi Dinding Kiri)',
    category: 'cooling',
    rows: [
      ['Jumlah', '3 Unit (1 unit utama + 2 unit pendukung)'],
      ['Kapasitas', '2 PK Inverter R32'],
      ['Letak', 'Dinding samping kiri aula utama'],
      ['Kondisi', 'Dingin Optimal (Filter bersih)']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '3 Unit',
    lastInspection: '2026-08-25',
    pic: 'Teknisi Servis AC DKM',
    note: 'Servis cuci filter & cek freon terjadwal setiap 3 bulan sekali.'
  },
  {
    id: 'jam-jadwal-sholat',
    pos: [0, 4.0, 7.85],
    tag: 'Elektronik & Jadwal',
    title: 'Jam Digital Jadwal Sholat & Running Text',
    category: 'other',
    rows: [
      ['Jumlah', '1 unit Display LED'],
      ['Fitur', 'Jadwal 5 Waktu Otomatis, Hitung Mundur Iqomah, Pesan DKM'],
      ['Letak', 'Dinding Mihrab Depan Atas'],
      ['Kondisi', 'Akurat & Menyala Normal']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-28',
    pic: 'Sekretariat DKM',
    note: 'Sinkronisasi waktu via GPS/NTP internal.'
  },
  {
    id: 'rak-alquran',
    pos: [-4.6, 0.6, 2.0],
    tag: 'Perlengkapan Ibadah',
    title: 'Rak Mushaf Al-Qur\'an & Terjemahan',
    category: 'furniture',
    rows: [
      ['Jumlah', '2 Rak Jati (Kiri & Belakang)'],
      ['Isi', '± 60 Eksemplar Mushaf Standar Kemenag'],
      ['Letak', 'Menempel dinding kiri'],
      ['Kondisi', 'Lengkap & Tertata Rapi']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '2 Rak Kayu',
    lastInspection: '2026-08-22',
    pic: 'Divisi Takmir Masjid',
    note: 'Disediakan juga buku doa dan zikir pagi-petang.'
  },
  {
    id: 'kotak-infaq',
    pos: [4.0, 0.4, 0],
    tag: 'Keuangan & Infaq',
    title: 'Kotak Infaq Tromol Stainless',
    category: 'furniture',
    rows: [
      ['Jumlah', '2 unit (Pintu Masuk & Area Dalam)'],
      ['Material', 'Stainless Steel Anti Karat dengan Gembok Ganda'],
      ['Letak', 'Dekat pintu masuk utama'],
      ['Kondisi', 'Aman & Terkunci']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '2 Unit',
    lastInspection: '2026-08-29',
    pic: 'Bendahara DKM',
    note: 'Dibuka dan dihitung bersama setiap selesai sholat Jumat.'
  },
  {
    id: 'menara-masjid',
    pos: [7.0, 0, -6.5],
    tag: 'Arsitektur Luar',
    title: 'Menara / Minaret As-Safar',
    category: 'structure',
    rows: [
      ['Tinggi', '14 Meter'],
      ['Perlengkapan', '4 Horn Speaker Luar Azan 100W, Lampu Sorot'],
      ['Letak', 'Sudut Halaman Kanan Luar'],
      ['Kondisi', 'Kokoh & Berfungsi Sempurna']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Menara',
    lastInspection: '2026-07-20',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Menara pengumuman adzan untuk jangkauan warga sekitar.'
  }
];
