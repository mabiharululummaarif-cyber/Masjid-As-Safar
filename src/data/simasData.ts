export type DataStatus = 'TERKONFIRMASI' | 'BELUM_DIKONFIRMASI' | 'BELUM_TERSEDIA';

export interface SimasProfile {
  idSimas: string;
  statusPendaftaranSimas: DataStatus;
  statusSimasLabel: string;
  namaMasjid: string;
  tipologi: string;
  tipologiStatus: DataStatus;
  tahunBerdiri: string;
  tahunBerdiriStatus: DataStatus;
  statusTanah: string;
  statusTanahVerification: DataStatus;
  nomorSertifikatWakaf: string;
  nomorAIW: string;
  nadzirWakaf: string;
  legalitasStatus: DataStatus;
  luasTanah: number | null;
  luasTanahDesc: string;
  luasBangunan: number | null;
  luasBangunanDesc: string;
  kapasitasJamaah: number;
  kapasitasDesc: string;
  alamatLengkap: string;
  desa: string;
  kelurahan: string; // kompatibilitas
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  zonaWaktu: 'WITA' | 'UTC+8';
  koordinat: {
    lat: number;
    lng: number;
    isConfirmed: boolean;
    status: DataStatus;
    catatan: string;
    azimuthKiblat: number; // derajat
    kiblatDesc: string;
  };
  nomorSkDkm: string;
  tanggalSkDkm: string;
  instansiPenerbitSk: string;
  skDkmStatus: DataStatus;
  kontak: {
    email: string;
    telepon: string;
    whatsapp: string;
    statusKontak: DataStatus;
    rekeningInfaq: {
      bank: string;
      nomorRekening: string;
      atasNama: string;
      status: DataStatus;
      catatan: string;
    };
  };
}

export const MASJID_SIMAS_DATA: SimasProfile = {
  idSimas: 'Belum Dikonfirmasi',
  statusPendaftaranSimas: 'BELUM_DIKONFIRMASI',
  statusSimasLabel: 'Menunggu Konfirmasi DKM / Belum Terdata Resmi',
  namaMasjid: 'Masjid As-Safar',
  tipologi: "Masjid Jami' (Perlu Konfirmasi DKM)",
  tipologiStatus: 'BELUM_DIKONFIRMASI',
  tahunBerdiri: 'Perlu Konfirmasi DKM',
  tahunBerdiriStatus: 'BELUM_DIKONFIRMASI',
  statusTanah: 'Tanah Wakaf (Menunggu Berkas Bukti)',
  statusTanahVerification: 'BELUM_DIKONFIRMASI',
  nomorSertifikatWakaf: 'Belum Dikonfirmasi',
  nomorAIW: 'Belum Dikonfirmasi',
  nadzirWakaf: 'Perlu Konfirmasi Pengurus DKM',
  legalitasStatus: 'BELUM_DIKONFIRMASI',
  luasTanah: null,
  luasTanahDesc: 'Perlu Konfirmasi Pengukuran DKM / BPN',
  luasBangunan: 484,
  luasBangunanDesc: '484 m² (Dimensi Model 3D: 22m × 22m — Perlu Konfirmasi Lapangan)',
  kapasitasJamaah: 350,
  kapasitasDesc: 'Estimasi Model Arsitektur 3D (±350 Jamaah)',
  alamatLengkap: 'Desa Lero, Kecamatan Suppa, Kabupaten Pinrang, Sulawesi Selatan',
  desa: 'Lero',
  kelurahan: 'Desa Lero',
  kecamatan: 'Suppa',
  kabupatenKota: 'Kabupaten Pinrang',
  provinsi: 'Sulawesi Selatan',
  kodePos: '91272',
  zonaWaktu: 'WITA',
  koordinat: {
    lat: -3.987,
    lng: 119.623,
    isConfirmed: false,
    status: 'BELUM_DIKONFIRMASI',
    catatan: 'Koordinat estimasi wilayah Desa Lero, Kec. Suppa (WITA) untuk hisab awal. Titik GPS presisi masjid belum dikonfirmasi.',
    azimuthKiblat: 292.5,
    kiblatDesc: 'Estimasi wilayah Suppa ~292.5° (22.5° Barat ke Utara) — Memerlukan pengukuran resmi lapangan oleh BHR Kemenag Pinrang'
  },
  nomorSkDkm: 'Belum Dikonfirmasi',
  tanggalSkDkm: 'Perlu Konfirmasi DKM / KUA',
  instansiPenerbitSk: 'KUA Kecamatan Suppa (Menunggu Konfirmasi SK)',
  skDkmStatus: 'BELUM_DIKONFIRMASI',
  kontak: {
    email: '',
    telepon: 'Dalam Konfirmasi DKM',
    whatsapp: '',
    statusKontak: 'BELUM_DIKONFIRMASI',
    rekeningInfaq: {
      bank: 'Rekening DKM Sedang Dikonfirmasi',
      nomorRekening: 'Belum Tersedia',
      atasNama: 'DKM Masjid As-Safar',
      status: 'BELUM_TERSEDIA',
      catatan: 'Nomor rekening resmi belum tersedia. Harap hubungi pengurus DKM secara langsung.'
    }
  }
};

export interface DkmMember {
  jabatan: string;
  nama: string;
  gelar?: string;
  bidang: string;
  status: DataStatus;
  statusDesc: string;
}

export const DKM_MEMBERS: DkmMember[] = [
  { 
    jabatan: 'Penasihat / Pembina', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Pengarah & Syariah',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Ketua DKM', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Pimpinan Harian & Tata Kelola',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Wakil Ketua DKM', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Operasional & Peribadatan',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Sekretaris', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Administrasi & Data SIMAS',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Bendahara', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Keuangan & Infaq Jamaah',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Imam Rawatib', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Peribadatan & Imam Sholat',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Bidang Ri\'ayah (Pemeliharaan)', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Pemeliharaan Fisik & Kebersihan',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  },
  { 
    jabatan: 'Bidang Imarah (Kemakmuran)', 
    nama: 'Dalam Konfirmasi DKM', 
    bidang: 'Kajian, Dakwah & Remaja Masjid',
    status: 'BELUM_DIKONFIRMASI',
    statusDesc: 'Menunggu konfirmasi nama pengurus dari DKM'
  }
];

export interface AgendaItem {
  id: string;
  judul: string;
  waktu: string;
  hari: string;
  narasumber: string;
  deskripsi: string;
  kategori: 'Kajian' | 'Jumat' | 'PHBI' | 'Sosial';
  status: DataStatus;
}

export const WEEKLY_AGENDA: AgendaItem[] = [
  {
    id: 'ag-1',
    judul: 'Sholat Jum\'at Berjamaah',
    hari: 'Setiap Hari Jum\'at',
    waktu: '12:08 WITA - Selesai',
    narasumber: 'Khotib & Imam (Jadwal Pengurus DKM)',
    deskripsi: 'Khutbah dan Sholat Jum\'at berjamaah di Ruang Utama Masjid As-Safar, Desa Lero, Kec. Suppa.',
    kategori: 'Jumat',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'ag-2',
    judul: 'Kajian Rutin & Taklim',
    hari: 'Dalam Konfirmasi Jadwal DKM',
    waktu: 'Ba\'da Maghrib - Isya WITA',
    narasumber: 'Asatidz Setempat (Menunggu Konfirmasi)',
    deskripsi: 'Program pengajian dan taklim jamaah warga Desa Lero.',
    kategori: 'Kajian',
    status: 'BELUM_DIKONFIRMASI'
  },
  {
    id: 'ag-3',
    judul: 'Pelayanan Infaq & Sosial Keumatan',
    hari: 'Setiap Hari',
    waktu: '08:00 - 20:00 WITA',
    narasumber: 'Pengurus DKM Masjid As-Safar',
    deskripsi: 'Penerimaan dan pengelolaan infaq serta sedekah untuk kemakmuran masjid di Desa Lero.',
    kategori: 'Sosial',
    status: 'TERKONFIRMASI'
  }
];

export interface FinancialSummary {
  isPublished: boolean;
  status: DataStatus;
  periode: string;
  keterangan: string;
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  rincianPemasukan: { label: string; amount: number }[];
  rincianPengeluaran: { label: string; amount: number }[];
}

export const FINANCIAL_DATA: FinancialSummary = {
  isPublished: false,
  status: 'BELUM_TERSEDIA',
  periode: 'Menunggu Konfirmasi Laporan Resmi DKM',
  keterangan: 'Laporan keuangan kas riil belum dipublikasikan. Angka saldo dan mutasi kas resmi akan ditampilkan setelah diverifikasi dan diserahkan oleh Bendahara DKM Masjid As-Safar.',
  saldoAwal: 0,
  totalPemasukan: 0,
  totalPengeluaran: 0,
  saldoAkhir: 0,
  rincianPemasukan: [],
  rincianPengeluaran: []
};

export interface MosqueFacility {
  id: string;
  name: string;
  spec: string;
  condition: 'Optimal' | 'Rancangan 3D' | 'Tersedia';
  desc: string;
  status: DataStatus;
}

export const MOSQUE_FACILITIES: MosqueFacility[] = [
  {
    id: 'f1',
    name: 'Ruang Sholat Utama',
    spec: 'Kapasitas ±350 jamaah, sirkulasi udara alami dan saf teratur',
    condition: 'Rancangan 3D',
    desc: 'Ruang ibadah utama dengan bukaan ventilasi silang, pencahayaan alami, dan saf berarah kiblat teratur.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f2',
    name: 'Mihrab & Mimbar Khatib',
    spec: 'Aksen marmer putih, ornamen geometris dan mimbar kayu',
    condition: 'Rancangan 3D',
    desc: 'Fokus arah kiblat dengan relung lengkung elegan dan pencahayaan aksen untuk kekhusyukan ibadah.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f3',
    name: 'Pintu Kaca Ayun & Jalur Akses',
    spec: '16 unit pintu kaca bukaan ganda untuk kelancaran sirkulasi',
    condition: 'Rancangan 3D',
    desc: 'Menghubungkan ruang utama dengan serambi luar, memudahkan akses jamaah dan sirkulasi udara.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f4',
    name: 'Area Wudhu & Sanitasi',
    spec: 'Fasilitas wudhu dan toilet terpisah ikhwan dan akhwat',
    condition: 'Tersedia',
    desc: 'Area bersuci higienis dengan pasokan air bersih bagi jamaah warga dan musafir.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f5',
    name: 'Serambi Transit Musafir',
    spec: 'Selasar teduh untuk istirahat sejenak musafir',
    condition: 'Tersedia',
    desc: 'Area beratap teduh yang dapat digunakan musafir untuk beristirahat saat singgah melaksanakan sholat.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f6',
    name: 'Tata Suara & Pengeras Suara',
    spec: 'Sistem pengeras suara adzan dan mikrofon ibadah',
    condition: 'Optimal',
    desc: 'Penyampaian adzan dan bacaan imam agar terdengar jelas dan tertib di lingkungan sekitar.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f7',
    name: 'Kubah Bertingkat Geometris',
    spec: 'Struktur kubah modern dengan ventilasi pelepasan panas',
    condition: 'Rancangan 3D',
    desc: 'Mencerminkan arsitektur Islam nusantara yang adaptif terhadap iklim tropis pesisir.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f8',
    name: 'Kotak Infaq & Saluran Shadaqah',
    spec: 'Penerimaan infaq tunai & persiapan kanal non-tunai',
    condition: 'Tersedia',
    desc: 'Fasilitas kotak infaq terkelola untuk operasional dan pemeliharaan sarana ibadah.',
    status: 'TERKONFIRMASI'
  }
];
