import { HotspotItem, MosqueConfig } from '../types';

export const DEFAULT_CONFIG: MosqueConfig = {
  safMale: 5,
  safFemale: 6,
  width: 16,
  depth: 24,
  height: 6.5,
  doorGap: 3.6,
  toaCount: 4,
  acCount: 4,
  minaretVisible: true,
  timeOfDay: 'day',
  showQibla: true,
  showHotspots: true,
  showDimensions: false,
  showTabir: true,
};

export const INITIAL_HOTSPOTS: HotspotItem[] = [
  {
    id: 'pintu-depan-utama',
    pos: [0, 1.7, 12.0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Utama Depan (Main Entrance)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Portal Utama (2 Daun Sliding Kaca Tempered)'],
      ['Dimensi', 'Lebar 3.8m × Tinggi 3.4m'],
      ['Mekanisme', 'Sliding Otomatis / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Poros tengah dinding depan (+Z), entrance utama jamaah'],
      ['Material', 'Kaca Tempered Clear 12mm & Kusen Aluminium Hijau Emas']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Set Utama (2 Daun)',
    lastInspection: '2026-08-28',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu gerbang utama depan menghubungkan serambi luar dengan aula utama masjid.'
  },
  {
    id: 'kubah-depan',
    pos: [0, 8.2, 8.8],
    tag: 'Arsitektur Luar',
    title: 'Kubah Depan (Mihrab & Mimbar Dome)',
    category: 'structure',
    rows: [
      ['Tipe', 'Kubah Sekunder Penanda Arah Mihrab/Kiblat'],
      ['Diameter', 'Ø 4.8 Meter'],
      ['Letak', 'Atap bagian depan, tepat di atas area mimbar & mihrab'],
      ['Ornamen', 'Bulan Sabit Emas (Hilal) & Rusuk Kaligrafi Emas'],
      ['Warna', 'Hijau Zamrud #2F6B4F & Aksen Emas #C9A227']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Kubah Depan',
    lastInspection: '2026-08-15',
    pic: 'Divisi Arsitektur DKM',
    note: 'Kubah depan dirancang khusus untuk menandai posisi mimbar dan arah kiblat dari luar bangunan.'
  },
  {
    id: 'dinding-kaca',
    pos: [-8.0, 3.2, 0],
    tag: 'Arsitektur & Dinding',
    title: 'Dinding Kaca Panoramik (Glass Curtain Wall)',
    category: 'structure',
    rows: [
      ['Tipe', 'Full Curtain Wall Kaca Transparan'],
      ['Material', 'Double-Glazed Low-E Glass 12mm & Kusen Hijau Tua Emas'],
      ['Cakupan', 'Dinding Samping Kiri, Kanan, Depan, dan Belakang'],
      ['Fitur', 'Tembus pandang dari luar, pencahayaan alami optimal'],
      ['Kondisi', 'Bersih, Kedap Udara & Kokoh']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: 'Keliling Bangunan (16m × 24m)',
    lastInspection: '2026-08-25',
    pic: 'Divisi Kebersihan & Perawatan',
    note: 'Dinding kaca memberikan estetika modern transparan sehingga keindahan interior terlihat jelas dari luar.'
  },
  {
    id: 'ruang-imam',
    pos: [5.8, 1.4, 9.8],
    tag: 'Ruangan Depan',
    title: 'Ruang Kanan Depan — Ruang Imam & Sound System',
    category: 'structure',
    rows: [
      ['Jumlah', '1 Ruangan Simetris (3.4m × 3.6m)'],
      ['Letak', 'Bagian depan sisi kanan (+X), samping area mimbar'],
      ['Fungsi', 'Ruang Transit Imam, Kantor DKM, & Central Mixer Audio'],
      ['Perlengkapan', 'Rak Sound System TOA, Meja Kerja, Lemari Jubah, Kotak P3K'],
      ['Kondisi', 'Baik & Lengkap']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Ruangan (Sisi Kanan)',
    lastInspection: '2026-08-20',
    pic: 'Sekretariat DKM & Ustadz Ahmad',
    note: 'Ruang khusus imam rawatib dan pusat kontrol tata suara masjid.'
  },
  {
    id: 'ruang-marbot',
    pos: [-5.8, 1.4, 9.8],
    tag: 'Ruangan Depan',
    title: 'Ruang Kiri Depan — Ruang Marbot & Khazanah Inventaris',
    category: 'structure',
    rows: [
      ['Jumlah', '1 Ruangan Simetris (3.4m × 3.6m)'],
      ['Letak', 'Bagian depan sisi kiri (-X), samping area mimbar'],
      ['Fungsi', 'Ruang Marbot, Khazanah Mukena/Sarung, & Gudang Perlengkapan'],
      ['Perlengkapan', 'Lemari Mukena Tambahan, Rak Alat Kebersihan, Meja Piket'],
      ['Kondisi', 'Baik & Rapi']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Ruangan (Sisi Kiri)',
    lastInspection: '2026-08-20',
    pic: 'Divisi Takmir & Marbot Masjid',
    note: 'Ruang marbot untuk operasional harian dan penyimpanan perlengkapan ibadah jamaah.'
  },
  {
    id: 'mimbar',
    pos: [0, 0.45, 8.8],
    tag: 'Mimbar & Mihrab',
    title: 'Mimbar & Ruang Khutbah',
    category: 'mihrab',
    rows: [
      ['Jumlah', '1 unit'],
      ['Material', 'Kayu Jati Ukir Kaligrafi Emas'],
      ['Letak', 'Depan tengah, dinaungi Kubah Depan'],
      ['Kondisi', 'Baik'],
      ['Fasilitas Pendukung', 'Mic Podium Condenser, Stand Mushaf']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-15',
    pic: 'Ustadz Ahmad (Imam Rawatib)',
    note: 'Mimbar berada di poros depan menghadap kiblat tepat di bawah Kubah Depan.'
  },
  {
    id: 'karpet-pria',
    pos: [0, 0.3, 5.2],
    tag: 'Karpet & Saf',
    title: 'Karpet Depan — Jamaah Laki-laki',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '5 Baris Saf (Dapat disesuaikan)'],
      ['Kapasitas', '± 110 Jamaah (22 orang/saf)'],
      ['Jenis Karpet', 'Rajut Tebal 14mm Premium Hijau Lumut'],
      ['Kondisi', 'Baik']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '5 Saf (14m x 6.5m)',
    lastInspection: '2026-08-20',
    pic: 'Divisi Kebersihan',
    note: 'Dibersihkan vakum harian sebelum sholat Zhuhur dan Maghrib.'
  },
  {
    id: 'karpet-wanita',
    pos: [0, 0.3, -5.5],
    tag: 'Karpet & Saf',
    title: 'Karpet Belakang — Jamaah Perempuan',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '6 Baris Saf (Dapat disesuaikan)'],
      ['Kapasitas', '± 132 Jamaah (22 orang/saf)'],
      ['Jenis Karpet', 'Merah Marun Tebal 12mm'],
      ['Kondisi', 'Baik'],
      ['Batas Area', 'Dilengkapi Tabir Hijab Geser']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '6 Saf (14m x 7.5m)',
    lastInspection: '2026-08-20',
    pic: 'Divisi Keputrian DKM',
    note: 'Jumlah saf jamaah perempuan dapat disesuaikan live di menu Pengaturan Saf.'
  },
  {
    id: 'pintu-kanan',
    pos: [8.0, 1.7, 0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Samping Kanan (Sliding Door)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Pintu Sliding (2 Panel Kaca Tempered)'],
      ['Dimensi', 'Lebar 3.6m × Tinggi 3.4m'],
      ['Mekanisme', 'Sliding / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Dinding kaca samping kanan, poros tengah aula']
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
    pos: [-8.0, 1.7, 0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Samping Kiri (Sliding Door)',
    category: 'access',
    rows: [
      ['Jumlah', '1 Pintu Sliding (2 Panel Kaca Tempered)'],
      ['Dimensi', 'Lebar 3.6m × Tinggi 3.4m'],
      ['Mekanisme', 'Sliding / Tarik-Dorong (Geser Berlawanan)'],
      ['Letak', 'Dinding kaca samping kiri, simetris pintu kanan']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Set (2 Daun)',
    lastInspection: '2026-08-01',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu geser kaca sisi kiri memberikan sirkulasi udara dan akses wudhu.'
  },
  {
    id: 'toa-speaker-l',
    pos: [-6.2, 5.8, 7.5],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa Kiri Depan',
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
    pos: [6.2, 5.8, 7.5],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa Kanan Depan',
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
    pos: [-7.75, 4.8, -3.0],
    tag: 'Tata Udara',
    title: 'AC Split Inverter (Sisi Dinding Kaca Kiri)',
    category: 'cooling',
    rows: [
      ['Jumlah', '4 Unit Inverter 2.5 PK'],
      ['Kapasitas', '2.5 PK Inverter R32'],
      ['Letak', 'Struktur kolom dinding samping kiri & kanan'],
      ['Kondisi', 'Dingin Optimal (Filter bersih)']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '4 Unit',
    lastInspection: '2026-08-25',
    pic: 'Teknisi Servis AC DKM',
    note: 'Servis cuci filter & cek freon terjadwal setiap 3 bulan sekali.'
  },
  {
    id: 'jam-jadwal-sholat',
    pos: [0, 5.2, 11.85],
    tag: 'Elektronik & Jadwal',
    title: 'Jam Digital Jadwal Sholat & Running Text',
    category: 'other',
    rows: [
      ['Jumlah', '1 unit Display LED Grand'],
      ['Fitur', 'Jadwal 5 Waktu Otomatis, Hitung Mundur Iqomah, Pesan DKM'],
      ['Letak', 'Dinding Header Pintu Utama Depan'],
      ['Kondisi', 'Akurat & Menyala Normal']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-28',
    pic: 'Sekretariat DKM',
    note: 'Sinkronisasi waktu otomatis via NTP/GPS.'
  },
  {
    id: 'rak-alquran',
    pos: [-7.6, 0.8, 3.0],
    tag: 'Perlengkapan Ibadah',
    title: 'Rak Mushaf Al-Qur\'an & Terjemahan',
    category: 'furniture',
    rows: [
      ['Jumlah', '2 Rak Jati (Kiri & Belakang)'],
      ['Isi', '± 100 Eksemplar Mushaf Standar Kemenag'],
      ['Letak', 'Sisi dinding kaca kiri'],
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
    pos: [2.5, 0.5, 10.5],
    tag: 'Keuangan & Infaq',
    title: 'Kotak Infaq Tromol Stainless',
    category: 'furniture',
    rows: [
      ['Jumlah', '2 unit (Dekat Pintu Depan & Serambi)'],
      ['Material', 'Stainless Steel Anti Karat dengan Gembok Ganda'],
      ['Letak', 'Sisi kanan lorong pintu depan utama'],
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
    pos: [11.5, 0, -9.5],
    tag: 'Arsitektur Luar',
    title: 'Menara / Minaret As-Safar',
    category: 'structure',
    rows: [
      ['Tinggi', '17.5 Meter'],
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

