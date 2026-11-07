OVO — Beranda PWA

ISI
- index.html: aplikasi berdasarkan file HTML yang diberikan.
- manifest.webmanifest: metadata instalasi PWA.
- sw.js: service worker dan cache offline dasar.
- icons/: ikon aplikasi 192px dan 512px.

DEPLOY
1. Ekstrak ZIP.
2. Upload seluruh isi folder (index.html, manifest.webmanifest, sw.js, icons/) ke root hosting.
3. Gunakan hosting HTTPS, misalnya Cloudflare Pages, Netlify, atau server web HTTPS.
4. Buka URL di Chrome Android.
5. Pilih menu browser > Install app / Tambahkan ke layar utama.

CATATAN
- Instalasi PWA membutuhkan HTTPS (localhost untuk pengujian).
- Tampilan dan kode aplikasi sumber dipertahankan; penambahan hanya metadata PWA, ikon, dan service worker.
- Fitur yang memerlukan internet/server eksternal tetap memerlukan koneksi. Cache offline hanya menyimpan shell aplikasi dan aset same-origin yang berhasil dimuat.
