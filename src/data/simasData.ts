export interface SimasProfile {
  idSimas: string;
  namaMasjid: string;
  tipologi: string;
  tahunBerdiri: string;
  statusTanah: string;
  nomorSertifikatWakaf: string;
  nomorAIW: string;
  nadzirWakaf: string;
  luasTanah: number; // m²
  luasBangunan: number; // m²
  kapasitasJamaah: number;
  alamatLengkap: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  koordinat: {
    lat: number;
    lng: number;
    azimuthKiblat: number; // derajat
    kiblatDesc: string;
  };
  nomorSkDkm: string;
  tanggalSkDkm: string;
  instansiPenerbitSk: string;
  kontak: {
    email: string;
    telepon: string;
    whatsapp: string;
    rekeningInfaq: {
      bank: string;
      nomorRekening: string;
      atasNama: string;
    };
  };
}

export const MASJID_SIMAS_DATA: SimasProfile = {
  idSimas: '01.4.12.04.01.000128',
  namaMasjid: 'Masjid As-Safar',
  tipologi: "Masjid Jami' / Tempat Publik (Transit Musafir & Warga)",
  tahunBerdiri: '2021 (Pengembangan Arsitektur 2026)',
  statusTanah: 'Wakaf Bersertifikat (Kementerian Agama RI)',
  nomorSertifikatWakaf: 'W.3/04.12/BPN-KEMENAG/2022',
  nomorAIW: 'W.2/AIW/08/XI/2021',
  nadzirWakaf: 'Badan Wakaf Indonesia (BWI) Perwakilan Daerah / DKM As-Safar',
  luasTanah: 1250,
  luasBangunan: 484,
  kapasitasJamaah: 350,
  alamatLengkap: 'Kawasan Transit & Permukiman Terpadu As-Safar, Koridor Lintas Utama',
  kelurahan: 'Sukamaju',
  kecamatan: 'Cilodong',
  kabupatenKota: 'Kota Depok',
  provinsi: 'Jawa Barat',
  kodePos: '16415',
  koordinat: {
    lat: -6.4184,
    lng: 106.8432,
    azimuthKiblat: 295.2,
    kiblatDesc: '295° 12\' dari Utara searah jarum jam (25° 12\' dari Barat ke Utara) — Terverifikasi Badan Hisab Rukyat Kemenag'
  },
  nomorSkDkm: '084/KUA.10.04/BA.01.1/SK-DKM/2024',
  tanggalSkDkm: '14 Januari 2024 (Masa Bakti 2024-2027)',
  instansiPenerbitSk: 'Kantor Urusan Agama (KUA) Kementerian Agama RI',
  kontak: {
    email: 'mabiharululummaarif321@gmail.com',
    telepon: '+62 812-3456-7890',
    whatsapp: '6281234567890',
    rekeningInfaq: {
      bank: 'Bank Syariah Indonesia (BSI)',
      nomorRekening: '719-8234-901',
      atasNama: 'DKM MASJID AS-SAFAR'
    }
  }
};

export interface DkmMember {
  jabatan: string;
  nama: string;
  gelar?: string;
  bidang: string;
  kontak?: string;
}

export const DKM_MEMBERS: DkmMember[] = [
  { jabatan: 'Penasihat / Pembina', nama: 'K.H. Ahmad Dahlan M.A.', gelar: 'K.H.', bidang: 'Pengarah & Syariah' },
  { jabatan: 'Ketua DKM', nama: 'H. Muhammad Ridwan, S.T., M.Si.', gelar: 'H.', bidang: 'Pimpinan Harian' },
  { jabatan: 'Wakil Ketua DKM', nama: 'Ust. H. Syamsul Arifin, Lc.', gelar: 'Ust.', bidang: 'Operasional & Peribadatan' },
  { jabatan: 'Sekretaris', nama: 'Bambang Triyono, S.Kom.', bidang: 'Administrasi & Data SIMAS' },
  { jabatan: 'Bendahara', nama: 'H. Sudirman Santoso, S.E., Ak.', gelar: 'H.', bidang: 'Keuangan & Infaq' },
  { jabatan: 'Imam Rawatib Utama', nama: 'Ust. Muhammad Hafizh Al-Hafizh', gelar: 'Al-Hafizh', bidang: 'Peribadatan' },
  { jabatan: 'Imam Rawatib 2', nama: 'Ust. Abdurrahman Wahid, S.Pd.I.', bidang: 'Peribadatan' },
  { jabatan: 'Muadzin & Marbot Utama', nama: 'Ahmad Fauzi & Tim Ri\'ayah', bidang: 'Sarana & Perawatan' },
  { jabatan: 'Ketua Bidang Idarah', nama: 'Ir. Hendra Gunawan', bidang: 'Legalitas Wakaf, Tata Kelola & Aset' },
  { jabatan: 'Ketua Bidang Imarah', nama: 'Ust. Fajar Ramadhan, M.Ag.', bidang: 'Kajian, PHBI, Remaja Masjid & ZISWAF' },
  { jabatan: 'Ketua Bidang Ri\'ayah', nama: 'Agus Setiawan, S.T.', bidang: 'Pemeliharaan Fisik, Sanitasi & Akustik' }
];

export interface AgendaItem {
  id: string;
  judul: string;
  waktu: string;
  hari: string;
  narasumber: string;
  deskripsi: string;
  kategori: 'Kajian' | 'Jumat' | 'PHBI' | 'Sosial';
}

export const WEEKLY_AGENDA: AgendaItem[] = [
  {
    id: 'ag-1',
    judul: 'Sholat Jum\'at Berjamaah',
    hari: 'Setiap Hari Jum\'at',
    waktu: '11:45 WIB - Selesai',
    narasumber: 'Khotib: Ust. Dr. H. Faisal Anwar, M.A. | Imam: Ust. Muhammad Hafizh Al-Hafizh',
    deskripsi: 'Khutbah dan Sholat Jum\'at berjamaah. Disediakan jamuan makan siang prasmanan berkah Jum\'at untuk jamaah dan musafir.',
    kategori: 'Jumat'
  },
  {
    id: 'ag-2',
    judul: 'Kajian Tafsir Al-Qur\'an Tematik',
    hari: 'Ahad Pagi (Pekan 1 & 3)',
    waktu: 'Ba\'da Subuh - 07:00 WIB',
    narasumber: 'K.H. Ahmad Dahlan M.A.',
    deskripsi: 'Kajian mendalam tafsir ayat-ayat pilihan, panduan ibadah harian, dilanjutkan sarapan bersama jamaah.',
    kategori: 'Kajian'
  },
  {
    id: 'ag-3',
    judul: 'Kajian Fiqih Ibadah & Muamalah',
    hari: 'Rabu Malam',
    waktu: 'Ba\'da Maghrib - Isya',
    narasumber: 'Ust. H. Syamsul Arifin, Lc.',
    deskripsi: 'Membedah kitab fiqih praktis safar, sholat jama\' qashar, thaharah, dan etika bermuamalah syariah.',
    kategori: 'Kajian'
  },
  {
    id: 'ag-4',
    judul: 'Layanan ZISWAF & Konsultasi Syariah',
    hari: 'Senin - Ahad (Setiap Hari)',
    waktu: '08:00 - 20:00 WIB',
    narasumber: 'Lembaga Amil Zakat DKM As-Safar',
    deskripsi: 'Penerimaan dan penyaluran Zakat Fitrah, Zakat Maal, Infaq, Shodaqoh, dan konsultasi hisab zakat.',
    kategori: 'Sosial'
  }
];

export interface FinancialSummary {
  periode: string;
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  rincianPemasukan: { label: string; amount: number }[];
  rincianPengeluaran: { label: string; amount: number }[];
}

export const FINANCIAL_DATA: FinancialSummary = {
  periode: 'Bulan Berjalan (Update Terverifikasi DKM)',
  saldoAwal: 42850000,
  totalPemasukan: 28400000,
  totalPengeluaran: 19150000,
  saldoAkhir: 52100000,
  rincianPemasukan: [
    { label: 'Infaq Kotak Jum\'at Berkah', amount: 14200000 },
    { label: 'Infaq Digital & QRIS Jamaah / Musafir', amount: 8750000 },
    { label: 'Donasi Khusus Sarana & Kebersihan', amount: 3500000 },
    { label: 'Infaq Kotak Parkir Sukarela', amount: 1950000 }
  ],
  rincianPengeluaran: [
    { label: 'Listrik (PLN), Air Bersih, & Internet Masjid', amount: 4850000 },
    { label: 'Bisyarah / Honor Marbot, Muadzin & Imam Rawatib', amount: 6500000 },
    { label: 'Operasional Kebersihan, Sabun & Sanitasi Toilet', amount: 2200000 },
    { label: 'Program Makan Berkah Jum\'at (Jum\'at Berkah)', amount: 3600000 },
    { label: 'Pemeliharaan Sound System & AC / Kipas', amount: 2000000 }
  ]
};

export interface MosqueFacility {
  id: string;
  name: string;
  spec: string;
  condition: 'Sangat Baik' | 'Baik' | 'Optimal';
  desc: string;
}

export const MOSQUE_FACILITIES: MosqueFacility[] = [
  {
    id: 'f1',
    name: 'Ruang Sholat Utama Berpendingin',
    spec: 'Kapasitas 350 jamaah, Karpet tebal standar Turki, Akustik minim gema',
    condition: 'Sangat Baik',
    desc: 'Ruang utama ibadah dengan karpet empuk, saf bertanda rapi, sirkulasi udara sejuk, dan pencahayaan alami melalui jendela transom.'
  },
  {
    id: 'f2',
    name: 'Mihrab Geometris & Mimbar Kayu Jati',
    spec: 'Marmer putih Carrara, Kaligrafi emas timbul, Akustik imam presisi',
    condition: 'Sangat Baik',
    desc: 'Pusat kiblat elegan dengan relung lengkung marmer, pencahayaan LED warm white tersembunyi, dan mimbar kayu jati ukir kaligrafi.'
  },
  {
    id: 'f3',
    name: 'Sirkulasi Pintu Kaca Ayun & Ramah Akses',
    spec: '4 set pintu kaca ayun double-swing + ramp disabilitas & lansia',
    condition: 'Sangat Baik',
    desc: 'Memudahkan akses jamaah lansia, kursi roda, dan kelancaran sirkulasi keluar-masuk saat bubaran sholat Jum\'at.'
  },
  {
    id: 'f4',
    name: 'Tempat Wudhu & Toilet Higienis',
    spec: '24 kran wudhu duduk/berdiri, terpisah total ikhwan & akhwat',
    condition: 'Optimal',
    desc: 'Desain lantai anti-slip, pengering tangan, sabun wudhu antiseptik, dan pasokan air bersih bertekanan stabil.'
  },
  {
    id: 'f5',
    name: 'Area Transit & Istirahat Musafir',
    spec: 'Buka 24 Jam dengan CCTV keamanan & pojok charging HP',
    condition: 'Baik',
    desc: 'Disediakan selasar teduh dan dispenser air minum gratis bagi musafir yang singgah untuk sholat dan rehat sejenak.'
  },
  {
    id: 'f6',
    name: 'Sound System & Menara Adzan Presisi',
    spec: '2 unit Horn Toa outdoor menara + 8 speaker indoor terkalibrasi',
    condition: 'Sangat Baik',
    desc: 'Penyampaian adzan terdengar jernih ke lingkungan sekitar dan bacaan sholat di dalam masjid terdengar lembut dan jelas tanpa distorsi.'
  },
  {
    id: 'f7',
    name: 'Kubah Bertingkat Berornamen Geometris',
    spec: 'Rangka baja ringan modern dengan ventilasi termal alami',
    condition: 'Sangat Baik',
    desc: 'Menghadirkan keindahan arsitektur Islam nusantara modern sekaligus berfungsi melepas panas ruangan ke udara bebas.'
  },
  {
    id: 'f8',
    name: 'Layanan ZISWAF & Kotak Infaq QRIS',
    spec: 'Standar Bank Indonesia (QRIS) & pencatatan keuangan akuntabel',
    condition: 'Optimal',
    desc: 'Memfasilitasi sedekah non-tunai yang aman, transparan, dan tercatat otomatis ke rekening resmi kas masjid.'
  }
];
