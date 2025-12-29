ATURAN WAJIB (dibaca sebelum mulai coding)

1) Dokumentasi & Referensi Library
- Selalu gunakan Context7 saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi library/API.
  - Wajib: resolve Library ID dulu, lalu ambil docs dari Context7.
- Selalu gunakan alat Vuetify MCP saat membutuhkan pembuatan kode, langkah setup/konfigurasi, atau dokumentasi Vuetify.

2) Menjalankan Project (Jangan jalankan dev server)
- Jangan running aplikasi/dev server (saya sudah run). Fokus hanya ke unit test.
- Jika ada perubahan code, buat/ubah unit test untuk mengetes flow utama.
- Untuk menjalankan semua unit test: npm run test:run

3) Struktur File (Wajib, untuk semua file: component/ts/utils/test)
- Pattern: lebih baik banyak file yang penting, spesifik, dan gampang untuk di maintance dan di debug.
- Hindari 1 file besar untuk banyak komponen/flow/fitur yang tidak related.
- Jika refactor/penambahan fitur membuat file membesar dan tidak fokus, pecah menjadi beberapa file yang jelas tanggung jawabnya.
- Untuk unit test, wajib ikut folder pattern:
  - Komponen UI: src/test/components/UI/<folder-spesifik>/
    - Semua src/components/UI masuk kategori ini.
  - Komponen common: src/test/components/common/
  - Custom utils/library: src/test/utils/
  - Setiap file/komponen yang diubah: cek apakah sudah ada unit test.
    - Jika belum ada dan memungkinkan: buat test minimal untuk memastikan flow tidak rusak.

4) Loading State (Paling sering terlewat, wajib patuh)
- Jika loading berasal dari props parent (mis. <Child :loading="parentLoading" />), itu boleh.
- Jika loading memakai util dari src/utils/loading.ts, wajib pakai aturan ini:
  - Di template/HTML, gunakan resultLoading untuk state loading/disabled, bukan loading.data/loading.submit langsung.
    - Contoh pattern: :loading="resultLoading", :disabled="resultLoading"
  - Jika butuh loading spesifik per aksi, tetap set loading.xxx di script, tapi binding UI pakai resultLoading.

5) Console & Logging (Wajib)
- Hindari console.log (cepat penuh log docker).
- Boleh: console.error saja (untuk error handling).
- Jika benar-benar perlu debug sementara, gunakan seminimal mungkin dan hapus sebelum selesai.

6) TypeScript & Tipe Data (Wajib)
- Hindari tipe any sebisa mungkin.
- Jangan buat interface/type di dalam component.
  - Taruh interface/type di src/model (atau file model yang relevan).
- Pastikan tidak ada error message/diagnostic pada file yang diubah.

7) API Call Style (Wajib)
- Jika ada call API: gunakan Promise chain (.then/.catch/.finally), jangan pakai async/await.
- Bagian catch cukup console.error saja (error handling utama sudah di config api).

8) Vue / Router Import (Wajib)
- Import vue dan vue-router tidak perlu (sudah auto import).

9) UI/UX (Wajib)
- Textfield gunakan density="compact".
- Textfield readonly biasakan background warna abu-abu.
- Tampilan harus responsif dan enak dilihat.

10) Permission (Jika buat halaman/fitur baru)
- Jika buat halaman baru, cek dan pastikan sudah implementasi permission.

11) Browser Console
- Pastikan tidak ada error atau warning di console browser akibat perubahan.
