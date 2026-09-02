import { HotspotItem, MosqueConfig } from '../types';

export const DEFAULT_CONFIG: MosqueConfig = {
  safMale: 4,
  safFemale: 5,
  width: 16,
  depth: 24,
  height: 6.5,
  doorGap: 3.6,
  toaCount: 2,
  acCount: 3,
  minaretVisible: true,
  timeOfDay: 'day',
  showQibla: false,
  showTabir: true,
  roofMode: 'solid',
  autoRotate: false,
  fanSpeed: 1,
  showHotspots: false,
  showDimensions: false,
};

export const INITIAL_HOTSPOTS: HotspotItem[] = [
  {
    id: 'pintu-belakang-tengah',
    pos: [0, 1.7, -12.0],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Belakang Tengah (Pintu Ayun 2 Daun)',
    category: 'access',
    rows: [
      ['Tipe', 'Pintu Kaca Ayun/Engsel (Double Swing Glass Door)'],
      ['Konfigurasi', '2 Daun Kaca Ayun (Engsel Pinggir) + Handle Stainless Vertikal'],
      ['Sisi Samping', 'Panel Kaca Tetap (Fixed) di Kiri & Kanan Pintu'],
      ['Transom', 'Jendela Transom Atas Kaca Terbagi 4 Panel Horizontal'],
      ['Kusen/Frame', 'Frame Putih Minimalis Bersih'],
      ['Letak', 'Poros tengah dinding belakang (-Z), berlawanan dari mihrab']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Portal Lengkap (2 Daun Ayun + 2 Fixed + Transom 4 Panel)',
    lastInspection: '2026-08-30',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu masuk utama bagian belakang dengan daun pintu kaca ayun, kusen putih, dan panel transom 4 segmen.'
  },
  {
    id: 'pintu-kiri',
    pos: [-8.0, 1.7, -3.5],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Samping Kiri (Pintu Ayun 2 Daun)',
    category: 'access',
    rows: [
      ['Tipe', 'Pintu Kaca Ayun/Engsel (Double Swing Glass Door)'],
      ['Konfigurasi', '2 Daun Kaca Ayun + Pull Handle Stainless Vertikal'],
      ['Sisi Samping', 'Panel Kaca Tetap (Fixed) di Kiri & Kanan Pintu'],
      ['Transom', 'Jendela Transom Atas 4 Panel Horizontal'],
      ['Kusen/Frame', 'Frame Putih Minimalis Bersih'],
      ['Letak', 'Dinding kiri (-X), area belakang-tengah bangunan']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Portal Lengkap (2 Daun Ayun + 2 Fixed + Transom 4 Panel)',
    lastInspection: '2026-08-30',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu samping kiri untuk akses sirkulasi jamaah dan arah tempat wudhu.'
  },
  {
    id: 'pintu-kanan',
    pos: [8.0, 1.7, -3.5],
    tag: 'Akses & Pintu',
    title: 'Pintu Kaca Samping Kanan (Pintu Ayun 2 Daun)',
    category: 'access',
    rows: [
      ['Tipe', 'Pintu Kaca Ayun/Engsel (Double Swing Glass Door)'],
      ['Konfigurasi', '2 Daun Kaca Ayun + Pull Handle Stainless Vertikal'],
      ['Sisi Samping', 'Panel Kaca Tetap (Fixed) di Kiri & Kanan Pintu'],
      ['Transom', 'Jendela Transom Atas 4 Panel Horizontal'],
      ['Kusen/Frame', 'Frame Putih Minimalis Bersih'],
      ['Letak', 'Dinding kanan (+X), area belakang-tengah (sejajar pintu kiri)']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '1 Portal Lengkap (2 Daun Ayun + 2 Fixed + Transom 4 Panel)',
    lastInspection: '2026-08-30',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pintu samping kanan sejajar dengan pintu kiri memberikan sirkulasi udara silang yang optimal.'
  },
  {
    id: 'jalur-keramik-putih',
    pos: [0, 0.1, -2.5],
    tag: 'Lantai & Sirkulasi',
    title: 'Jalur Akses Lantai Keramik Putih',
    category: 'structure',
    rows: [
      ['Material', 'Granit / Keramik Putih Polished 60×60 cm'],
      ['Cakupan', 'Area sekitar 3 pintu masuk dan lorong sirkulasi tengah'],
      ['Penataan', 'Keramik putih membentang di koridor pintu, karpet di kiri-kanan'],
      ['Kondisi', 'Bersih, Rata & Bebas Licin']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: 'Area Koridor Pintu',
    lastInspection: '2026-08-30',
    pic: 'Divisi Kebersihan',
    note: 'Area lantai di sekitar tiap pintu menggunakan keramik putih, diapit karpet saf hijau di kiri-kanannya.'
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
    note: 'Kubah depan menandai posisi mimbar dan arah kiblat dari luar bangunan.'
  },
  {
    id: 'dinding-kaca',
    pos: [-8.0, 3.2, 3.0],
    tag: 'Arsitektur & Dinding',
    title: 'Dinding Kaca Panoramik (Glass Curtain Wall)',
    category: 'structure',
    rows: [
      ['Tipe', 'Curtain Wall Kaca Transparan Tembus Pandang'],
      ['Material', 'Double-Glazed Low-E Glass 12mm & Kusen Hijau Tua Emas'],
      ['Cakupan', 'Dinding Samping Kiri, Kanan, Belakang & Depan'],
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
    pos: [-1.3, 0.6, 9.0],
    tag: 'Mimbar & Mihrab',
    title: 'Mimbar Kayu Ukir & Garis Bertingkat Dinding Mihrab',
    category: 'mihrab',
    rows: [
      ['Posisi Mimbar', 'Agak ke Kolom Kiri-Tengah dari Sudut Pandang Menghadap Kiblat'],
      ['Material', 'Kayu Jati Ukir Jepara Kaligrafi Emas'],
      ['Ornamen Dinding', 'Dinding/Plafon Bertingkat (Stepped Decorative Wall Niche & Arch)'],
      ['Dinaungi', 'Tepat di bawah Kubah Depan'],
      ['Fasilitas Pendukung', 'Mic Gooseneck Condenser, Podium Mushaf Khutbah']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit Mimbar Jati',
    lastInspection: '2026-08-30',
    pic: 'Ustadz Ahmad (Imam Rawatib)',
    note: 'Mimbar bergeser sedikit ke kiri-tengah arah kiblat, berlatar dinding dekoratif garis bertingkat berlapis lis emas.'
  },
  {
    id: 'karpet-pria',
    pos: [0, 0.3, 5.0],
    tag: 'Karpet & Saf',
    title: 'Karpet Depan — Jamaah Laki-laki (4 Saf)',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '4 Baris Saf Depan'],
      ['Kapasitas', '± 88 Jamaah (22 orang/saf)'],
      ['Jenis Karpet', 'Rajut Tebal 14mm Premium Hijau Lumut & Lis Emas'],
      ['Kondisi', 'Bersih & Terawat']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '4 Saf Pria',
    lastInspection: '2026-08-30',
    pic: 'Divisi Kebersihan',
    note: 'Saf depan khusus jamaah laki-laki sebanyak 4 baris saf.'
  },
  {
    id: 'karpet-wanita',
    pos: [0, 0.3, -6.5],
    tag: 'Karpet & Saf',
    title: 'Karpet Belakang — Jamaah Perempuan (5 Saf)',
    category: 'carpet',
    rows: [
      ['Jumlah Saf', '5 Baris Saf Belakang (Total 4+5 = 9 Saf)'],
      ['Kapasitas', '± 110 Jamaah (22 orang/saf)'],
      ['Jenis Karpet', 'Rajut Tebal 14mm Hijau Lumut / Burgundy'],
      ['Catatan Saf', 'Total pernah disebut 10 saf, saat ini terpasang 9 saf (4 depan + 5 belakang) — perlu konfirmasi DKM'],
      ['Batas Area', 'Dilengkapi Tabir Pembatas Saf Hijab']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '5 Saf Wanita (Total 9 Saf)',
    lastInspection: '2026-08-30',
    pic: 'Divisi Keputrian DKM',
    note: 'Saf belakang untuk jamaah perempuan sebanyak 5 saf (Total aula saat ini 9 saf).'
  },
  {
    id: 'toa-speaker-l',
    pos: [-7.6, 5.8, 0],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa 1 (Dinding Kiri Tengah)',
    category: 'audio',
    rows: [
      ['Jumlah', '1 Unit TOA Dinding Kiri'],
      ['Tipe', 'Horn Ceiling/Wall Speaker 50W Impedansi Tinggi'],
      ['Letak', 'Menempel tinggi dekat langit-langit di dinding kiri area tengah bangunan'],
      ['Kabel', 'Instalasi kabel audio menjuntai rapi ke bawah'],
      ['Kondisi', 'Baik & Jernih']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-30',
    pic: 'Pak Gunawan (Teknisi Audio)',
    note: 'Toa unit 1 terpasang di dinding kiri tengah menyebarkan suara adzan dan kajian ke aula tengah-belakang.'
  },
  {
    id: 'toa-speaker-f',
    pos: [-2.5, 5.8, 9.2],
    tag: 'Tata Suara',
    title: 'Horn Speaker / Toa 2 (Area Depan Dekat Mimbar)',
    category: 'audio',
    rows: [
      ['Jumlah', '1 Unit TOA Area Depan'],
      ['Tipe', 'Horn Ceiling/Wall Speaker 50W Impedansi Tinggi'],
      ['Letak', 'Plafon langit-langit aula depan sisi mimbar/mihrab'],
      ['Kabel', 'Instalasi kabel audio menjuntai ke mixer central ruang imam'],
      ['Kondisi', 'Baik & Jernih']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-30',
    pic: 'Pak Gunawan (Teknisi Audio)',
    note: 'Toa unit 2 di area depan melayani artikulasi suara imam sholat dan khutbah.'
  },
  {
    id: 'kipas-angin-dinding',
    pos: [-7.7, 3.2, 3.5],
    tag: 'Tata Udara',
    title: 'Kipas Angin Dinding (Wall Fan 3 Unit)',
    category: 'cooling',
    rows: [
      ['Jumlah', 'Total 3 Unit Wall Fan Heavy Duty (Bukan AC)'],
      ['Sebaran', '1 Unit Depan (Mihrab), 1 Unit Dinding Kiri Tengah, 1 Unit Samping Belakang'],
      ['Tipe', 'Wall Fan 18 Inch 3-Speed Oscillation'],
      ['Fitur', 'Osilasi 90°, Tarikan Tali Kecepatan, Jaring Pengaman'],
      ['Kondisi', 'Bersih, Berputar Halus & Tenang']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '3 Unit Kipas Dinding',
    lastInspection: '2026-08-30',
    pic: 'Divisi Sarana & Prasarana',
    note: 'Pendingin alami ruangan menggunakan 3 unit kipas angin dinding di posisi depan, tengah, dan samping.'
  },
  {
    id: 'jam-jadwal-sholat',
    pos: [0, 4.8, 11.8],
    tag: 'Elektronik & Jadwal',
    title: 'Jam Digital Jadwal Sholat & Running Text',
    category: 'other',
    rows: [
      ['Jumlah', '1 unit Display LED Grand'],
      ['Fitur', 'Jadwal 5 Waktu Otomatis, Hitung Mundur Iqomah, Pesan DKM'],
      ['Letak', 'Dinding Header Depan Aula Utama'],
      ['Kondisi', 'Akurat & Menyala Normal']
    ],
    interiorOnly: true,
    condition: 'Baik',
    quantity: '1 Unit',
    lastInspection: '2026-08-30',
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
    pos: [2.5, 0.5, -9.5],
    tag: 'Keuangan & Infaq',
    title: 'Kotak Infaq Tromol Stainless',
    category: 'furniture',
    rows: [
      ['Jumlah', '2 unit (Dekat Pintu Belakang & Lorong Pintu Samping)'],
      ['Material', 'Stainless Steel Anti Karat dengan Gembok Ganda'],
      ['Letak', 'Sisi dekat pintu masuk belakang dan jalur keramik'],
      ['Kondisi', 'Aman & Terkunci']
    ],
    interiorOnly: false,
    condition: 'Baik',
    quantity: '2 Unit',
    lastInspection: '2026-08-30',
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


