// Semua isi portofolio ada di file ini. Ubah teksnya di sini, komponen tidak perlu disentuh.

export const profile = {
  name: 'Dian Rizki Pratama',
  initials: 'DRP',
  role: 'Fullstack Engineer',
  company: 'KALEKA Indonesia',
  location: 'Bali',
  timezone: 'Asia/Makassar',
  email: 'dianrizkipratama22@gmail.com',
  whatsapp: '6285360043696', // format internasional untuk link wa.me
  whatsappDisplay: '+62 853-6004-3696',
  whatsappText: 'Halo Dian, saya baru lihat portofolio kamu dan ingin ngobrol soal ',
  // Isi link asli lalu simpan; link kosong tidak ditampilkan.
  links: [
    { label: 'GitHub', href: 'https://github.com/dianrp22', icon: 'code', cta: 'Lihat kode' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dian-rizki-pratama/', icon: 'in', cta: 'Lihat profil' },
  ],
}

/** Angka di plate peta perjalanan (dihitung dari riwayat git). */
export const stats = [
  { label: 'Tahun berkarya', value: '05' },
  { label: 'Produk dirilis', value: '12' },
  { label: 'Repositori', value: '17' },
  { label: 'Platform', value: '03' },
]

/** Tag di garis main pada graf git (t = tahun desimal). */
export const markers = [
  { t: 2020.5, l: 'v2020 · Telkom University' },
  { t: 2021.7, l: 'v2021 · PT Lentera' },
  { t: 2023.4, l: 'v2023 · KALEKA' },
  { t: 2026.2, l: 'v2026 · 12 produk' },
]

/**
 * Cabang di graf git: satu cabang per produk, sesuai periode pengerjaannya.
 * lane = baris di atas (-) atau bawah (+) garis main; merge = cabang sudah selesai/digabung.
 */
export const branches = [
  { name: 'konflik', from: 2022.45, to: 2025.3, lane: -1, commits: 24, merge: true },
  { name: 'kaleka.id', from: 2022.85, to: 2026.95, lane: -2, commits: 91, merge: false },
  { name: 'tanibaik', from: 2023.4, to: 2026.95, lane: 1, commits: 446, merge: false },
  { name: 'pugar-bumi', from: 2024.95, to: 2026.4, lane: 2, commits: 72, merge: true },
  { name: 'satudata', from: 2024.95, to: 2026.25, lane: -3, commits: 33, merge: true },
  { name: 'aspiran', from: 2025.2, to: 2026.15, lane: 3, commits: 54, merge: true },
  { name: 'kolibri', from: 2025.2, to: 2026.7, lane: -4, commits: 40, merge: true },
  { name: 'katapeta', from: 2025.2, to: 2026.4, lane: 4, commits: 14, merge: true },
  // proyek di luar Kaleka
  { name: 'miniseri', from: 2024.9, to: 2025.35, lane: 5, commits: 0, merge: true, note: 'app store + play' },
  { name: 'tjf-prototype', from: 2026.45, to: 2026.55, lane: -5, commits: 15, merge: true },
]

/** Baris yang diketik di hero. */
export const tagline = '> satu orang, satu produk utuh: database, API, web, sampai aplikasi di App Store & Google Play. 12 produk sudah dipakai orang sungguhan.'

/** Log boot di layar loading. */
export const boot = [
  '[ ok ] memuat 17 repositori',
  '[ ok ] menyusun web, API & mobile',
  '[ ok ] menyiapkan 12 produk',
  '[ ok ] siap',
]

/** Linimasa. m = pola plate (dots | waves | grid | rings | blocks | stripes), h = hue warna plate. */
export const timeline = [
  {
    y: '2020',
    t: 'Lulus Teknik Komputer',
    s: 'Telkom University · Bandung',
    c: 'Fondasi di pemrograman, jaringan, AI, dan rekayasa perangkat lunak, ditambah proyek nyata yang dikerjakan lintas tim.',
    code: ['$ git clone telkom-university', '> jurusan: teknik komputer', '✓ lulus · BSc 2020'],
    m: 'dots',
    h: 225,
  },
  {
    y: '2021',
    t: 'Frontend Engineer',
    s: 'PT Lentera Indonesia · Bali',
    c: 'UI React, Vue, dan Next.js sambil merangkap backend .NET. Membangun Konflik, platform mediasi konflik lahan dengan role dan permission, alur penyelesaian, dan laporan tingkat kabupaten.',
    code: ['$ git checkout -b lentera', '> stack: react vue next .net', '$ npm run build konflik', '✓ deployed'],
    m: 'grid',
    h: 160,
  },
  {
    y: '2022',
    t: 'Masuk ekosistem Kaleka',
    s: 'Kaleka.id · Satudata',
    c: 'Membangun Kaleka.id dan API-nya: publikasi, riset, newsletter, dan dashboard analitik. Juga portal Satudata yang menarik data perlindungan hutan dan profil lahan.',
    code: ['$ git init kaleka.id', '> api: publikasi, riset, slug', '$ satudata pull --hutan', '✓ synced'],
    m: 'waves',
    h: 250,
  },
  {
    y: '2023',
    t: 'Frontend Engineer',
    s: 'KALEKA Indonesia · Bali',
    c: 'Memegang Tanibaik end-to-end di tiga codebase (web Next.js, API ASP.NET Core, aplikasi Flutter), dari skema database sampai aplikasi di HP petani.',
    code: ['$ git checkout kaleka/tanibaik', '> web: next.js   api: .net', '> app: flutter   db: postgres', '✓ live di 3 platform'],
    m: 'rings',
    h: 200,
  },
  {
    y: '2025',
    t: 'Rilis Miniseri',
    s: 'App Store · Google Play · Laravel',
    c: 'Platform video vertikal untuk mini series: aplikasi Flutter yang rilis di Google Play dan App Store, plus panel admin Laravel Octane yang saya deploy sendiri di server (Nginx + Supervisor).',
    code: ['$ flutter build appbundle', '$ php artisan octane:start', '> nginx → :7000  supervisor ✓', '✓ live di play + app store'],
    m: 'dots',
    h: 170,
  },
  {
    y: '2025',
    t: 'Aplikasi lapangan dari nol',
    s: 'Pugar Bumi · Katapeta · Aspiran · Kolibri',
    c: 'Aplikasi Flutter untuk tim lapangan: verifikasi titik tanam berbasis poligon, peta offline, dan pemetaan bebas. Aspiran dan Kolibri dibangun dari commit pertama.',
    code: ['$ flutter create pugar_bumi', '> verify(titik, polygon)', '> offline_maps = true', '✓ shipped ke lapangan'],
    m: 'blocks',
    h: 230,
  },
  {
    y: '2026',
    t: 'Sekarang',
    s: '7+ produk Kaleka · proyek pribadi',
    c: 'Di Kaleka: program donor, membership dan referal, kuitansi otomatis, dan OTP WhatsApp→SMS. Di luar kantor: TJF Prototype, SaaS Booking multi-tenant (Next.js + .NET), dan Momenta, editor undangan digital.',
    code: ['$ git log --all --oneline', '> kaleka · freelance · pribadi', '> produk.rilis = 12', '✓ HEAD → main'],
    m: 'stripes',
    h: 215,
  },
]

/** Studi kasus utama di bagian "Dari lapangan". */
export const featured = {
  name: 'Tanibaik',
  report:
    'Platform yang membantu petani sawit naik kelas: pelatihan, sertifikasi keberlanjutan (ISPO/RSPO), pemetaan lahan, sampai penjualan hasil panen. Tiga codebase (web, API, mobile) saya pegang sendiri sejak 2023, dari skema database sampai aplikasi yang dipakai petani di lapangan.',
  highlights: [
    'Membuka sumber pendanaan baru: program donor dari nol, lengkap dengan dashboard dampak publik/privat, membership bertingkat, dan kode referal ambassador yang melacak asal setiap pendaftar.',
    'Login yang tidak gampang tumbang: OTP WhatsApp otomatis beralih ke SMS saat satu vendor bermasalah, jadi petani tetap bisa masuk.',
    'Memangkas kerja manual admin: transaksi hasil panen dengan kuitansi otomatis, pengajuan ulang, notifikasi, dan ekspor Excel sekali klik.',
    'Belajar dari HP: pelatihan dan sertifikasi (video, buku saku flipbook, kuis) di web dan mobile, plus dashboard harga komoditas dwibahasa.',
  ],
  stats: [
    { label: 'Peran', value: 'Fullstack' },
    { label: 'Codebase', value: '03' },
    { label: 'Sejak', value: '2023' },
    { label: 'Bahasa', value: 'ID/EN' },
  ],
}

/** Kartu di band proyek. live = sedang berjalan (kartu dengan denyut cyan). */
export const cards = [
  {
    st: 'Berjalan',
    name: 'Tanibaik',
    kind: 'Web · API · Mobile',
    p: 'Satu ekosistem untuk petani, donor, dan admin: pelatihan, sertifikasi, sampai penjualan hasil panen. Web, API, dan mobile dipegang satu orang.',
    stack: ['Next.js', '.NET', 'Flutter'],
    live: true,
  },
  {
    st: 'Mobile',
    name: 'Pugar Bumi',
    kind: 'Restorasi lahan',
    p: 'Dibangun dari commit pertama. Tim lapangan memverifikasi titik tanam langsung di dalam poligon lahan, mencatat kegiatan desa, dan mengunggah bukti sekaligus.',
    stack: ['Flutter', '.NET', 'React'],
  },
  {
    st: 'Mobile',
    name: 'Katapeta',
    kind: 'Pemetaan',
    p: 'Tetap jalan tanpa sinyal: peta offline dan draf tersimpan, jadi pemetaan lahan dan komoditas di pelosok tidak hilang.',
    stack: ['Flutter', 'Offline map'],
  },
  {
    st: 'Web',
    name: 'Kaleka.id',
    kind: 'Situs + CMS',
    p: 'Wajah publik Kaleka: publikasi, riset, Mosaik Initiative, dan dashboard analitik. Saya bangun dan rawat sejak 2022.',
    stack: ['Next.js', '.NET'],
  },
  {
    st: 'Web',
    name: 'Aspiran',
    kind: 'Platform aliansi',
    p: 'Dari nol sampai live: peta anggota interaktif, notula rapat yang terbuka untuk publik, dan analitik pengunjung.',
    stack: ['Next.js', 'Leaflet'],
  },
  {
    st: 'Web',
    name: 'Kolibri',
    kind: 'Platform aliansi',
    p: 'Wilayah kerja anggota tampil sebagai poligon di peta, lengkap dengan metrik dampak dan CMS yang bisa diurus tim sendiri.',
    stack: ['Next.js', 'Leaflet', '.NET'],
  },
  {
    st: 'Data',
    name: 'Satudata',
    kind: 'Portal data',
    p: 'Satu pintu untuk data: katalog dan master data, plus backend yang menarik data perlindungan hutan dan profil lahan secara otomatis.',
    stack: ['React', '.NET'],
  },
  {
    st: 'Web',
    name: 'Konflik',
    kind: 'Mediasi konflik lahan',
    p: 'Membantu mediator menyelesaikan konflik lahan: alur penyelesaian terstruktur, role dan permission, sampai laporan tingkat kabupaten.',
    stack: ['React', 'Esri Leaflet'],
  },
  {
    st: 'Rilis',
    name: 'Miniseri',
    kind: 'Streaming · mobile',
    p: 'Dari kode sampai toko aplikasi: platform video vertikal yang rilis di Google Play dan App Store, plus admin Laravel Octane yang saya deploy sendiri.',
    stack: ['Flutter', 'Laravel', 'Nginx'],
  },
  {
    st: 'Pribadi',
    name: 'TJF Prototype',
    kind: 'Situs riset · CMS',
    p: 'Situs multibahasa dengan riset, publikasi, berita, inisiatif, dan CMS berbasis markdown, plus grafik data.',
    stack: ['Next.js', 'Zustand', 'Recharts'],
  },
  {
    st: 'Pribadi',
    name: 'SaaS Booking',
    kind: 'Multi-tenant · MVP',
    p: 'Satu sistem untuk banyak bisnis: tiap tenant punya halaman booking publik dan dashboard admin sendiri.',
    stack: ['Next.js', 'ASP.NET Core', 'PostgreSQL'],
  },
  {
    st: 'Dalam proses',
    name: 'Momenta',
    kind: 'SaaS undangan digital',
    p: 'Undangan digital tanpa desainer: editor visual self-service, dari desain sampai dibagikan dalam kurang dari 30 menit.',
    stack: ['Next.js', 'Node.js', 'Prisma'],
  },
]

/** Stack lengkap, dikelompokkan. `where` = proyek tempat teknologi itu benar-benar dipakai. */
export const stack = [
  {
    key: 'frontend',
    items: [
      { n: 'Next.js', where: 'Tanibaik, Kaleka.id, Aspiran, Kolibri, TJF' },
      { n: 'React', where: 'Satudata, Konflik, admin Pugar Bumi' },
      { n: 'Vue 3', where: 'Lentera, portofolio ini' },
      { n: 'TypeScript', where: 'hampir semua proyek' },
      { n: 'Tailwind CSS · MUI', where: 'Kaleka, Aspiran, Kolibri' },
      { n: 'TanStack Query · Zustand', where: 'state & data fetching' },
      { n: 'Framer Motion · Canvas', where: 'animasi & interaksi' },
    ],
  },
  {
    key: 'backend',
    items: [
      { n: 'ASP.NET Core · C#', where: 'Tanibaik, Pugar Bumi, Kaleka, Satudata' },
      { n: 'Entity Framework Core', where: 'migrasi, relasi, query' },
      { n: 'Laravel + Octane', where: 'admin Miniseri' },
      { n: 'Node.js · Prisma', where: 'Momenta' },
      { n: 'REST API · JWT', where: 'auth, role & permission' },
      { n: 'OTP WhatsApp → SMS', where: 'login multi-channel Tanibaik' },
    ],
  },
  {
    key: 'mobile',
    items: [
      { n: 'Flutter · Dart', where: 'Tanibaik, Pugar Bumi, Katapeta, Miniseri' },
      { n: 'Offline-first', where: 'peta offline, draf lapangan' },
      { n: 'Multi-file upload', where: 'dokumen & foto kegiatan' },
      { n: 'Rilis ke store', where: 'Google Play & App Store' },
    ],
  },
  {
    key: 'data_maps',
    items: [
      { n: 'PostgreSQL', where: 'database utama' },
      { n: 'Leaflet · Esri · GeoJSON', where: 'poligon lahan, peta anggota' },
      { n: 'Chart.js · Recharts', where: 'dashboard harga & dampak' },
      { n: 'ExcelJS · docxtemplater', where: 'ekspor laporan' },
      { n: 'Firebase · Google Analytics', where: 'analitik & notifikasi' },
    ],
  },
  {
    key: 'devops',
    items: [
      { n: 'Git', where: 'semua proyek, 17 repositori' },
      { n: 'Docker', where: 'container produksi Kaleka' },
      { n: 'Nginx · Supervisor', where: 'server Miniseri' },
      { n: 'Vercel', where: 'portofolio ini' },
      { n: 'Deploy dev & prod', where: 'migrasi DB & redeploy' },
    ],
  },
]

