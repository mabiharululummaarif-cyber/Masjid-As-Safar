export type DataStatus = 'TERKONFIRMASI' | 'BELUM_DIKONFIRMASI' | 'BELUM_TERSEDIA';

export interface SimasProfile {
  idSimas: string;
  statusPendaftaranSimas: DataStatus;
  statusSimasLabel: string;
  namaResmi: string;
  namaMasjid: string;
  tipologi: string;
  tipologiStatus: DataStatus;
  tahunMulaiDibangun: string;
  tahunMulaiDigunakan: string;
  tahunBerdiri: string;
  kondisiBangunan: string;
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
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  zonaWaktu: 'WITA' | 'UTC+8';
  koordinat: {
    lat: number | null;
    lng: number | null;
    isConfirmed: boolean;
    status: DataStatus;
    catatan: string;
    azimuthKiblat: number;
    kiblatDesc: string;
  };
  nomorSkDkm: string;
  periodeKepengurusan: string;
  tanggalSkDkm: string;
  instansiPenerbitSk: string;
  ketuaUmum: string;
  skDkmStatus: DataStatus;
  kontak: {
    email: string;
    telepon: string;
    whatsapp: string;
    statusKontak: DataStatus;
    picSimas: {
      nama: string;
      nomorHpInternal: string;
    };
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
  idSimas: 'Belum tersedia',
  statusPendaftaranSimas: 'BELUM_TERSEDIA',
  statusSimasLabel: 'Belum tersedia',
  namaResmi: "Masjid As-Safar Yayasan Biharul Ulum Ma'arif",
  namaMasjid: 'Masjid As-Safar',
  tipologi: "Masjid Jami'",
  tipologiStatus: 'TERKONFIRMASI',
  tahunMulaiDibangun: '2025',
  tahunMulaiDigunakan: '2026',
  tahunBerdiri: '2025 (Pembangunan) / 2026 (Penggunaan)',
  kondisiBangunan: 'Baik',
  statusTanah: 'Wakaf',
  statusTanahVerification: 'TERKONFIRMASI',
  nomorSertifikatWakaf: 'NIB. 20.19.000009276.0',
  nomorAIW: 'WT.1/000001/7315021/2025',
  nadzirWakaf: "Yayasan Biharul Ulum Ma'arif",
  legalitasStatus: 'TERKONFIRMASI',
  luasTanah: 3938,
  luasTanahDesc: '3.938 m²',
  luasBangunan: 144,
  luasBangunanDesc: '144 m²',
  kapasitasJamaah: 200,
  kapasitasDesc: '200 jamaah (Formulir Pendaftaran SIMAS)',
  alamatLengkap: 'Jl. Poros TPI Ujung Labuang Lero B Wiringtasi, Kecamatan Suppa, Kabupaten Pinrang, Sulawesi Selatan',
  desa: 'Wiringtasi',
  kelurahan: 'Desa Wiringtasi',
  kecamatan: 'Suppa',
  kabupatenKota: 'Kabupaten Pinrang',
  provinsi: 'Sulawesi Selatan',
  kodePos: '91272',
  zonaWaktu: 'WITA',
  koordinat: {
    lat: null,
    lng: null,
    isConfirmed: false,
    status: 'BELUM_TERSEDIA',
    catatan: 'Titik koordinat lokasi belum terverifikasi secara resmi. Menunggu pengukuran lapangan oleh BHR Kemenag Pinrang.',
    azimuthKiblat: 292.3,
    kiblatDesc: '292,3° (Berdasarkan pengukuran formulir SIMAS)'
  },
  nomorSkDkm: '017/MA.21.17.0008/IX/2026',
  periodeKepengurusan: '2026–2030',
  tanggalSkDkm: 'September 2026 (Periode 2026–2030)',
  instansiPenerbitSk: "Yayasan Biharul Ulum Ma'arif",
  ketuaUmum: 'Syaharuddin, S.Pd., Gr.',
  skDkmStatus: 'TERKONFIRMASI',
  kontak: {
    email: 'mabiharululummaarif321@gmail.com',
    telepon: '081342111078',
    whatsapp: '081342111078',
    statusKontak: 'TERKONFIRMASI',
    picSimas: {
      nama: 'Tasbih, S.Pd.',
      nomorHpInternal: '081915115390' // PIC pendaftaran SIMAS (internal dokumen, bukan kontak publik)
    },
    rekeningInfaq: {
      bank: 'Bank Belum Tersedia',
      nomorRekening: 'Belum tersedia',
      atasNama: 'Masjid As-Safar',
      status: 'BELUM_TERSEDIA',
      catatan: 'Kanal transfer rekening resmi belum tersedia.'
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
    jabatan: 'Dewan Pengawas', 
    nama: 'Nurul Hijrah, S.Ak.', 
    bidang: 'Pengawas Organisasi',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Ketua Umum', 
    nama: 'Syaharuddin, S.Pd., Gr.', 
    bidang: 'Pimpinan Harian Takmir',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Sekretaris', 
    nama: 'Tasbih, S.Pd.', 
    bidang: 'Administrasi & Data SIMAS',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Bendahara', 
    nama: 'Khaerunnisyah Hasbua, S.Pd.', 
    bidang: 'Keuangan & Infaq Kas',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: "Koordinator Ri'ayah", 
    nama: 'Nurul Fani Darwis, S.Pd.', 
    bidang: 'Pemeliharaan & Pembangunan',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: "Anggota Ri'ayah", 
    nama: 'Rahmat', 
    bidang: 'Pemeliharaan & Pembangunan',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Koordinator Imarah', 
    nama: 'Meliani, S.Ag.', 
    bidang: 'Peribadatan & Dakwah',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Anggota Imarah', 
    nama: 'Fitriani', 
    bidang: 'Peribadatan & Dakwah',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Koordinator Idarah', 
    nama: 'Faharuddin, S.Pd.', 
    bidang: 'Sosial & Hubungan Masyarakat',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Anggota Idarah', 
    nama: 'Fitriah, S.Pd., Gr.', 
    bidang: 'Sosial & Hubungan Masyarakat',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Koordinator PRISMA', 
    nama: 'Maldini', 
    bidang: 'Pendidikan & Remaja Masjid',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  },
  { 
    jabatan: 'Anggota PRISMA', 
    nama: 'Miftah Farid, S.Pd.', 
    bidang: 'Pendidikan & Remaja Masjid',
    status: 'TERKONFIRMASI',
    statusDesc: 'SK No. 017/MA.21.17.0008/IX/2026'
  }
];

export interface PegawaiSyaraItem {
  nama: string;
  tugas: string;
}

export const PEGAWAI_SYARA: PegawaiSyaraItem[] = [
  { nama: 'Husain', tugas: 'Imam Rawatib Utama' },
  { nama: 'Resaldi', tugas: 'Imam Pendamping' },
  { nama: 'Kesal', tugas: 'Muazin Utama' },
  { nama: 'Tasbih', tugas: 'Muazin Pendamping' },
  { nama: 'Amin Rahim', tugas: 'Bilal / Petugas Khusus' },
  { nama: 'Abdullah', tugas: 'Marbot / Kebersihan' }
];

export interface AgendaItem {
  id: string;
  judul: string;
  waktu: string;
  hari: string;
  narasumber: string;
  deskripsi: string;
  kategori: 'Jumat' | 'Kajian' | 'Sosial';
  status: DataStatus;
}

export const WEEKLY_AGENDA: AgendaItem[] = [
  {
    id: 'ag-1',
    judul: 'Sholat Jum\'at Berjamaah',
    hari: 'Setiap Hari Jum\'at',
    waktu: '12:08 WITA - Selesai',
    narasumber: 'Khatib & Imam Takmir Masjid As-Safar',
    deskripsi: 'Khutbah dan pelaksanaan Sholat Jum\'at berjamaah di Ruang Sholat Utama Masjid As-Safar, Desa Wiringtasi, Kec. Suppa.',
    kategori: 'Jumat',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'ag-2',
    judul: 'Kajian Rutin & Majelis Taklim',
    hari: 'Belum tersedia',
    waktu: 'Belum tersedia',
    narasumber: 'Menunggu Penetapan Bidang Imarah',
    deskripsi: 'Jadwal kajian rutin dan majelis taklim saat ini belum tersedia. Menunggu penetapan agenda resmi dari Takmir Masjid As-Safar.',
    kategori: 'Kajian',
    status: 'BELUM_TERSEDIA'
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
  periode: 'Belum tersedia',
  keterangan: 'Laporan keuangan kas riil saat ini belum tersedia untuk publikasi. Saldo dan pencatatan kas resmi menunggu laporan dan rekonsiliasi dari Bendahara Takmir Masjid As-Safar (Khaerunnisyah Hasbua, S.Pd.).',
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
  condition: 'Optimal' | 'Rancangan 3D' | 'Tersedia' | 'Baik';
  desc: string;
  status: DataStatus;
}

export const MOSQUE_FACILITIES: MosqueFacility[] = [
  {
    id: 'f1',
    name: 'Ruang Sholat Utama',
    spec: 'Kapasitas 200 jamaah (Formulir SIMAS), sirkulasi udara alami dan saf teratur',
    condition: 'Baik',
    desc: 'Ruang ibadah utama dengan luas bangunan 144 m², bukaan ventilasi silang, pencahayaan alami, dan saf berarah kiblat 292,3°.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f2',
    name: 'Mihrab & Mimbar Khatib',
    spec: 'Aksen marmer, ornamen geometris dan mimbar khutbah',
    condition: 'Baik',
    desc: 'Fokus arah kiblat dengan relung lengkung elegan dan pencahayaan aksen untuk kekhusyukan ibadah fardhu dan Jum\'at.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f3',
    name: 'Pintu Kaca Ayun & Jalur Akses',
    spec: 'Pintu kaca bukaan ganda untuk kelancaran sirkulasi jamaah',
    condition: 'Baik',
    desc: 'Menghubungkan ruang utama dengan serambi luar, memudahkan akses jamaah dan kelancaran sirkulasi udara.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f4',
    name: 'Area Wudhu & Sanitasi',
    spec: 'Fasilitas wudhu dan toilet terpisah ikhwan dan akhwat',
    condition: 'Baik',
    desc: 'Area bersuci higienis dengan pasokan air bersih bagi jamaah warga dan musafir di Jl. Poros TPI.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f5',
    name: 'Serambi Transit Musafir',
    spec: 'Selasar teduh untuk istirahat sejenak musafir',
    condition: 'Baik',
    desc: 'Area beratap teduh yang dapat digunakan musafir untuk beristirahat saat singgah melaksanakan sholat di jalur pesisir Suppa.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f6',
    name: 'Tata Suara & Pengeras Suara',
    spec: 'Sistem pengeras suara adzan dan mikrofon ibadah',
    condition: 'Baik',
    desc: 'Penyampaian adzan oleh Muazin dan bacaan Imam Rawatib agar terdengar jelas dan tertib di lingkungan sekitar.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f7',
    name: 'Kubah Bertingkat Geometris',
    spec: 'Struktur kubah modern dengan ventilasi pelepasan panas',
    condition: 'Baik',
    desc: 'Mencerminkan arsitektur Islam tropis yang adaptif terhadap iklim pesisir Desa Wiringtasi, Kec. Suppa.',
    status: 'TERKONFIRMASI'
  },
  {
    id: 'f8',
    name: 'Kotak Infaq Fisik',
    spec: 'Penerimaan infaq tunai terkelola Takmir',
    condition: 'Baik',
    desc: 'Fasilitas kotak infaq terkelola bendahara takmir untuk operasional harian dan pemeliharaan sarana ibadah.',
    status: 'TERKONFIRMASI'
  }
];
