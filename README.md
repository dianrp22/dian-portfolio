# Portofolio · Dian Rizki Pratama

Vite + Vue 3 + TypeScript. Animasi memakai canvas dan spring buatan sendiri (`src/engine/sora.js`), smooth scroll memakai Lenis.
Font di-host sendiri: Archivo, Geist, dan Geist Mono (Fontsource).

## Jalankan di lokal

```bash
nvm use        # Node 22 (lihat .nvmrc)
npm install
npm run dev
```

## Ubah isi

Semua teks (profil, kontak/WhatsApp, linimasa, graf git, proyek) ada di `src/data/profile.ts`.
Warna dan font ada di bagian atas `src/engine/sora.css`.

## Deploy

Repo ini terhubung ke Vercel: setiap push ke `main` otomatis membangun ulang dan merilis situs.
Build manual: `npm run build` (hasil di `dist/`).
