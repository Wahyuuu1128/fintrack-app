# FinTrack - Mobile-First Personal Finance Tracker

FinTrack adalah aplikasi pelacak keuangan pribadi berbasis web dengan arsitektur *serverless*. Dirancang khusus untuk penggunaan perangkat mobile yang cepat, responsif, dan terintegrasi langsung dengan Google Sheets sebagai basis data penyimpanan awan (cloud database).

##  Fitur Utama

- **PWA Ready (Progressive Web App):** Dapat diinstal langsung ke *homescreen* smartphone layaknya aplikasi native.
- **Quick Entry Form:** Input data transaksi (Pemasukan/Pengeluaran) dengan antarmuka yang bersih dan minimalis.
- **Dashboard Analitik:**
  - Kartu ringkasan Sisa Saldo, Total Pemasukan, dan Total Pengeluaran.
  - *Doughnut Chart* untuk visualisasi distribusi pengeluaran berdasarkan kategori.
  - *Area/Line Chart* untuk memantau tren pengeluaran harian.
- **Manajemen Transaksi (CRUD):** Fitur untuk mencatat, melihat, mengedit, dan menghapus riwayat transaksi secara *real-time*.
- **Filter Data Bulanan:** Memudahkan pengguna untuk meninjau riwayat dan statistik keuangan pada bulan-bulan sebelumnya.

##  Teknologi yang Digunakan

**Frontend:**
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (ES6+)
- Chart.js (Visualisasi Data)
- FontAwesome (Ikon)

**Backend & Database:**
- Google Apps Script (Sebagai REST API Endpoint)
- Google Sheets (Sebagai Database Terpusat)

---

##  Cara Instalasi & Setup

Jika Anda ingin melakukan *clone* dan menggunakan aplikasi ini untuk keperluan pribadi, ikuti langkah-langkah berikut:

### 1. Setup Database (Google Sheets)
1. Buat file Google Sheets baru.
2. Pada `Sheet1`, buat header pada baris pertama mulai dari kolom A hingga E: `Timestamp`, `Jenis`, `Kategori`, `Nominal`, `Catatan`.

### 2. Setup API (Google Apps Script)
1. Pada Google Sheets Anda, buka menu **Extensions > Apps Script**.
2. Hapus kode bawaan dan tempelkan kode backend (fungsi `doPost` dan `doGet`) yang telah dikonfigurasi.
3. Klik tombol **Deploy > New deployment**.
4. Pilih tipe **Web App**.
   - *Execute as*: Me
   - *Who has access*: Anyone
5. Klik **Deploy** dan salin **Web App URL** yang dihasilkan.

### 3. Setup Frontend
1. *Clone* repository ini:
   ```bash
   git clone [https://github.com/Wahyuuu1128/fintrack-app.git](https://github.com/Wahyuuu1128/fintrack-app.git)

##  Sekian Terima Kasih
