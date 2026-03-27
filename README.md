# 📚 Book Manager

Aplikasi manajemen buku full-stack yang dibangun dengan **Node.js**, **Express**, **Sequelize (SQLite)**, dan **React**. Aplikasi ini dilengkapi dengan sistem autentikasi JWT dan antarmuka pengguna yang modern.

## ✨ Fitur Utama

- **Manajemen Buku**: Tambah, Lihat, Edit, dan Hapus buku.
- **Autentikasi JWT**: Sistem Register dan Login untuk mengamankan data.
- **Pencarian Real-time**: Filter buku berdasarkan judul langsung dari antarmuka.
- **Validasi Input**: Menggunakan **Zod** untuk memastikan data yang masuk valid.
- **UI Modern**: Dibangun dengan Tailwind CSS, Lucide Icons, dan animasi dari Framer Motion.
- **Backend Modular**: Struktur kode yang rapi dan mudah dikelola.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express, Sequelize ORM, SQLite3, JWT, bcryptjs, Zod.
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Database**: SQLite (File `database.sqlite` akan dibuat otomatis).

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- npm (Biasanya terinstal bersama Node.js)

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal:
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di direktori akar (root) dan tambahkan variabel berikut:
```env
JWT_SECRET=rahasia_super_kuat_anda
NODE_ENV=development
```

### 4. Menjalankan Aplikasi (Mode Pengembangan)
Gunakan perintah berikut untuk menjalankan server backend dan frontend sekaligus:
```bash
npm run dev
```
Aplikasi akan berjalan di: [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Autentikasi
- `POST /api/auth/register` - Daftar akun baru.
- `POST /api/auth/login` - Masuk dan dapatkan token JWT.

### Buku
- `GET /api/books` - Ambil semua buku (Mendukung query `?title=...`).
- `GET /api/books/:id` - Ambil detail buku berdasarkan ID.
- `POST /api/books` - Tambah buku baru (Memerlukan Token).
- `PUT /api/books/:id` - Update data buku (Memerlukan Token).
- `DELETE /api/books/:id` - Hapus buku (Memerlukan Token).

## 📂 Struktur Folder
```
├── src/
│   ├── backend/
│   │   ├── config/      # Konfigurasi Database
│   │   ├── controllers/ # Logika Bisnis
│   │   ├── middleware/  # Auth, Logger, Validasi
│   │   ├── models/      # Definisi Tabel Sequelize
│   │   └── routes/      # Definisi Endpoint API
│   ├── App.tsx          # Frontend React
│   └── main.tsx         # Entry Point Frontend
├── server.ts            # Entry Point Backend Express
└── package.json         # Dependensi & Scripts
```

## 📝 Catatan Teknis
- Aplikasi ini menggunakan **SQLite** untuk kemudahan setup tanpa perlu menginstal server database terpisah.
- Database akan disinkronkan secara otomatis saat server dijalankan pertama kali.
- Token JWT disimpan di `localStorage` pada sisi klien untuk menjaga sesi login.
