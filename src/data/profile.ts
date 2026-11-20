// Semua isi portofolio ada di file ini. Ubah teksnya di sini, komponen tidak perlu disentuh.

export const profile = {
  name: 'Dian Rizki Pratama',
  initials: 'DRP',
  role: 'Frontend Engineer',
  company: 'KALEKA Indonesia',
  location: 'Bali',
  timezone: 'Asia/Makassar',
  email: 'dianrizkipratama22@gmail.com',
  whatsapp: '6285360043696', // format internasional untuk link wa.me
  whatsappDisplay: '+62 853-6004-3696',
  whatsappText: 'Halo Dian, saya baru lihat portofolio kamu dan ingin ngobrol soal ',
  // Isi link asli lalu simpan; link kosong tidak ditampilkan.
  links: [
    { label: 'GitHub', href: 'https://github.com/dianrp22' },
    { label: 'LinkedIn', href: '' },
  ],
}

/** Angka di plate peta perjalanan (dihitung dari riwayat git). */
export const stats = [
  { label: 'Tahun berkarya', value: '05' },
  { label: 'Produk dibangun', value: '12' },
  { label: 'Repositori', value: '17' },
  { label: 'Commit', value: '770+' },
]

/** Tag di garis main pada graf git (t = tahun desimal). */
export const markers = [
  { t: 2020.5, l: 'v2020 · Telkom University' },
  { t: 2021.7, l: 'v2021 · PT Lentera' },
  { t: 2023.4, l: 'v2023 · KALEKA' },
  { t: 2026.2, l: 'v2026 · 12 produk' },
]

/**
 * Cabang di graf git: satu cabang per produk, dengan jumlah commit asli dari riwayat git.
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
  // proyek di luar Kaleka (repo Miniseri tidak ada di laptop ini, jadi tanpa angka commit)
  { name: 'miniseri', from: 2024.9, to: 2025.35, lane: 5, commits: 0, merge: true, note: 'app store + play' },
  { name: 'tjf-prototype', from: 2026.45, to: 2026.55, lane: -5, commits: 15, merge: true },
]

/** Baris yang diketik di hero. */
export const tagline = '> membangun web, API & mobile untuk petani dan hutan Indonesia'

/** Log boot di layar loading. */
export const boot = [
  '[ ok ] memuat 17 repositori',
  '[ ok ] menyusun 770+ commit',
  '[ ok ] menyiapkan 7 produk',
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
    c: 'Memegang Tanibaik end-to-end di tiga codebase (web Next.js, API ASP.NET Core, aplikasi Flutter) dengan 440+ commit.',
    code: ['$ git checkout kaleka/tanibaik', '> web: next.js   api: .net', '> app: flutter   db: postgres', '✓ 440+ commit'],
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
    code: ['$ git log --oneline | wc -l', '> 770+ commit · 17 repo', '> produk.aktif = 7', '✓ HEAD → main'],
    m: 'stripes',
    h: 215,
  },
]

/** Studi kasus utama di bagian "Dari lapangan". */
export const featured = {
  name: 'Tanibaik',
  report:
    'Platform pemberdayaan petani sawit: pelatihan, sertifikasi keberlanjutan (ISPO/RSPO), pemetaan lahan, sampai penyerapan hasil panen. Saya memegangnya end-to-end, dari skema database sampai aplikasi di HP petani.',
  highlights: [
    'Program donor dari nol: dashboard dampak publik dan privat, membership bertingkat, serta ambassador dan kode referal yang melacak sumber pendaftaran.',
    'Login OTP WhatsApp yang otomatis pindah ke SMS (OTP.ID), sehingga login tidak mati total saat satu vendor bermasalah.',
    'Rantai penyerapan hasil panen: transaksi, kuitansi otomatis, pengajuan ulang, notifikasi admin, dan ekspor Excel.',
    'Pelatihan dan sertifikasi (video, buku saku flipbook, kuis) di web dan mobile, plus dashboard harga komoditas dwibahasa.',
  ],
  stats: [
    { label: 'Commit', value: '446' },
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
    p: 'Pemberdayaan petani: donor, pelatihan, sertifikasi, dan penyerapan hasil panen.',
    stack: ['Next.js', '.NET', 'Flutter'],
    live: true,
  },
  {
    st: 'Mobile',
    name: 'Pugar Bumi',
    kind: 'Restorasi lahan',
    p: 'Aplikasi Flutter dari commit pertama: verifikasi titik tanam berbasis poligon, kegiatan desa, dan unggah banyak file.',
    stack: ['Flutter', '.NET', 'React'],
  },
  {
    st: 'Mobile',
    name: 'Katapeta',
    kind: 'Pemetaan',
    p: 'Pemetaan bebas dan komoditas, peta offline, penyimpanan draf, dan alur sertifikasi.',
    stack: ['Flutter', 'Offline map'],
  },
  {
    st: 'Web',
    name: 'Kaleka.id',
    kind: 'Situs + CMS',
    p: 'Publikasi, riset, Mosaik Initiative, dan dashboard analitik. 90+ commit sejak 2022.',
    stack: ['Next.js', '.NET'],
  },
  {
    st: 'Web',
    name: 'Aspiran',
    kind: 'Platform aliansi',
    p: 'Dibangun dari nol: peta anggota dengan pemilih koordinat, notula publik, dan Firebase Analytics.',
    stack: ['Next.js', 'Leaflet'],
  },
  {
    st: 'Web',
    name: 'Kolibri',
    kind: 'Platform aliansi',
    p: 'Peta area anggota berbentuk poligon, metrik dampak, dan CMS konten.',
    stack: ['Next.js', 'Leaflet', '.NET'],
  },
  {
    st: 'Data',
    name: 'Satudata',
    kind: 'Portal data',
    p: 'Katalog dan master data, serta backend yang menarik data perlindungan hutan dan profil lahan.',
    stack: ['React', '.NET'],
  },
  {
    st: 'Web',
    name: 'Konflik',
    kind: 'Mediasi konflik lahan',
    p: 'Role dan permission, mediator dan tipologi konflik, proses penyelesaian, serta laporan kabupaten.',
    stack: ['React', 'Esri Leaflet'],
  },
  {
    st: 'Rilis',
    name: 'Miniseri',
    kind: 'Streaming · mobile',
    p: 'Platform video vertikal untuk mini series. Aplikasi Flutter di Google Play dan App Store, admin Laravel Octane di server sendiri.',
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
    p: 'Platform booking multi-tenant: halaman publik untuk pelanggan dan dashboard admin per tenant.',
    stack: ['Next.js', 'ASP.NET Core', 'PostgreSQL'],
  },
  {
    st: 'Dalam proses',
    name: 'Momenta',
    kind: 'SaaS undangan digital',
    p: 'Self-service undangan digital untuk berbagai acara dengan editor visual: desain, publish, lalu bagikan dalam kurang dari 30 menit.',
    stack: ['Next.js', 'Node.js', 'Prisma'],
  },
]
