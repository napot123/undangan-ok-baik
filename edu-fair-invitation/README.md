# Edu Fair & Career Day 2026 - Web Invitation & Admin Dashboard

Aplikasi web modern, profesional, dan responsif untuk manajemen undangan digital dan sistem blast peserta **Edu Fair & Career Day 2026**. Dibangun menggunakan HTML5, CSS3, dan Vanilla JavaScript murni tanpa framework, dilengkapi integrasi **PapaParse CSV**, **Google Maps**, dan **WhatsApp Link API (wa.me)**.

---

## 📁 Struktur Berkas Proyek

```text
edu-fair-invitation/
├── index.html              # Halaman Undangan Publik (Public Invitation)
├── admin.html              # Halaman Dashboard Admin (Management Panel)
├── data-tamu.csv           # Sampel data tamu berformat CSV
├── css/
│   ├── invitation.css      # Gaya visual halaman undangan publik (Navy & Gold)
│   └── admin.css           # Gaya antarmuka SaaS Admin Dashboard modern
├── js/
│   ├── data.js             # Layer manajemen data, default state, & LocalStorage
│   ├── invitation.js       # Logika URLSearchParams, countdown, RSVP, & audio
│   └── admin.js            # Logika CRUD tamu, PapaParse CSV, Blast WA, & Chart.js
└── assets/
    └── images/             # Folder aset grafis pendukung
```

---

## 🚀 Fitur Utama

### 1. Public Digital Invitation (`index.html`)
- **Cover / Envelope Interaktif:** Efek membuka amplop undangan resmi dengan tombol *"Buka Undangan"* dan audio suasana latar belakang (*synthesized ambient sound*).
- **Personalisasi Dinamis (URLSearchParams):**
  - Menerima parameter `to` (nama instansi/tamu), `kategori` (universitas/perusahaan/alumni), dan `penerima` (nama PIC).
  - Contoh: `index.html?to=Universitas+Indonesia&kategori=Universitas`
- **Hitung Mundur (Countdown Timer):** Hari, jam, menit, dan detik menuju waktu acara (Sabtu, 24 Januari 2026).
- **Rangkaian Acara (Rundown Timeline):** Jadwal kegiatan mulai dari registrasi pagi hingga serah terima plakat kemitraan.
- **Fasilitas & Benefit Booth:** Kartu benefit booth eksklusif mitra (fasilitas VIP, 1.000+ audiens, publikasi, dll).
- **Peta Lokasi Interaktif:** Embed Google Maps responsif dan tombol langsung menuju Google Maps arah jalan.
- **Formulir Konfirmasi Kehadiran (RSVP):**
  - Mengisi nama, instansi, kategori, pilihan kehadiran (*Pasti Hadir*, *Tidak Hadir*, *Belum Pasti*), jumlah delegasi, dan catatan/pesan.
  - Data tersimpan otomatis ke `localStorage` dan langsung diperbarui di feed ucapan publik serta Dashboard Admin.

---

### 2. Admin Dashboard (`admin.html`)
- **Dashboard Overview:**
  - 4 Kartu Statistik Real-time: *Total Tamu*, *Undangan Dibuka (Blast)*, *Belum Dikirim*, dan *RSVP Konfirmasi Hadir*.
  - Visualisasi Grafik Interaktif menggunakan **Chart.js** (Distribusi Kategori Tamu & Status Konfirmasi RSVP) dengan sistem fallback offline otomatis.
  - Widget *Aktivitas Terbaru* (log pengiriman dan update status RSVP).
- **Pengelolaan Data Tamu:**
  - Tabel lengkap: ID, Nama Tamu, Instansi, Kategori, Nomor WhatsApp, Status Undangan, dan Aksi.
  - Pencarian instan (*real-time search* berdasarkan nama/instansi), filter kategori, dan pagination.
  - Modal Tambah, Edit, dan Hapus Tamu dengan validasi input.
  - Ekspor seluruh data tamu ke format `.csv`.
- **Import Berkas CSV:**
  - Integrasi **PapaParse** dengan drag & drop upload.
  - Mendukung separator koma (`,`) maupun titik-koma (`;`), serta pembersihan notasi eksponensial nomor telepon Excel (`6,28226E+12` -> `6282260060508`).
  - Tabel pratinjau (*preview*) sebelum disimpan dengan pilihan *Append* (gabungkan) atau *Replace* (ganti semua).
  - Tombol unduh template berkas `data-tamu.csv`.
- **Generator Undangan & Blast WhatsApp:**
  - URL dasar web undangan yang dapat disesuaikan (lokal maupun link hosting GitHub Pages).
  - Generator tautan personal otomatis untuk setiap tamu.
  - Template pesan WhatsApp resmi dengan variabel `[NAMA_INSTANSI]` dan `[LINK_UNDANGAN]`.
  - Tombol **Kirim WA** yang langsung membuka WhatsApp Web / Aplikasi via tautan `wa.me`, sekaligus otomatis mencatat tanggal & jam pengiriman dengan status *"Dibuka untuk Pengiriman"*.
  - Tombol *Salin Link* (Copy to Clipboard) dan tombol *Preview* untuk uji coba tampilan undangan.
- **Riwayat Pengiriman:**
  - Rekap jejak digital pengiriman blast WhatsApp secara transparan.
- **Data RSVP Tamu:**
  - Rekap seluruh konfirmasi yang masuk dari formulir undangan publik dengan filter status dan tombol ekspor CSV.
- **Pengaturan Informasi Acara:**
  - Pengubahan dinamis nama acara, tema, tanggal, waktu, lokasi, tautan Google Maps, deskripsi, dan template WhatsApp default yang tersinkronisasi langsung ke halaman `index.html`.

---

## 💻 Cara Menjalankan Secara Lokal

1. Buka folder proyek di file manager atau VS Code.
2. Buka berkas `index.html` langsung di browser (Chrome, Edge, Firefox) untuk melihat halaman undangan digital.
3. Buka berkas `admin.html` langsung di browser untuk mengakses dashboard pengelolaan undangan.
4. Uji coba pengiriman blast WhatsApp dan buka link hasil generator dengan parameter URL untuk memverifikasi personalisasi nama dan kategori tamu.
