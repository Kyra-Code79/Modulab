# Modulab

[Modulab](https://github.com/Kyra-Code79/Modulab) adalah sebuah proyek aplikasi web toko daring (e-commerce) yang dibuat dengan Next.js, React, Tailwind CSS dan beberapa library modern lainnya.  
Proyek ini dibuat untuk memenuhi kebutuhan modul ataupun tugas tertentu — sekaligus sebagai showcase kemampuan pengembangan front-end dan full-stack.

---

## 🛠️ Fitur Utama
- Keranjang belanja (cart) dengan kontrol jumlah item dan total harga.  
- Checkout dengan form informasi pengguna (nama, email, telepon, alamat, provinsi, kota, kode pos).  
- Dropdown dinamis provinsi → kota menggunakan API publik.  
- Perhitungan otomatis pengiriman (ongkir) berdasarkan provinsi dan total belanja.  
- Metode pembayaran beragam (Credit/Debit, Paypal, OVO, Dana, Gopay, Shopee Pay).  
- Ringkasan pesanan yang menampilkan subtotal, diskon/promo, ongkir, serta total akhir.  
- Desain responsif, dark-theme friendly, menggunakan Tailwind CSS + komponen modern.

---

## 📦 Teknologi
- [Next.js](https://nextjs.org/) (React framework)  
- React (Hooks, context)  
- Tailwind CSS untuk styling  
- `lucide-react` atau icon library untuk ikon  
- API eksternal untuk daftar provinsi/kota  
- Konteks Cart (`useCart`) untuk manajemen keranjang  
- Utilitas formatCurrency untuk memformat mata uang  
- dan lain-lain…

---

## 🚀 Instalasi & Jalankan Secara Lokal
1. Clone repository  
   ```bash
   git clone https://github.com/Kyra-Code79/Modulab.git
   cd Modulab
   ```
2. Instalasi dependencies
   ```bash
    npm install
    atau
    yarn install
   ```
3. Jalankan mode pengembangan
   ```bash
    npm run dev
    # atau
    yarn dev
   ```
4. Buka browser ke http://localhost:3000

## 🎯 Struktur Direktori
  ```bash
    /src
    /components   ← komponen-komponen UI seperti Header, Footer, CartContext, dll  
    /lib          ← utilitas & konteks (contoh: cart-context, utils)  
    /pages        ← halaman-halaman penting (Checkout, Products, OrderConfirmation)  
    /styles       ← file Tailwind CSS konfigurasi / styling global  
    public/         ← aset publik (gambar, ikon, favicon)  
  ```

## 🔍 Kontribusi
Kontribusi sangat welcome! Bila kamu ingin memberikan pull request, mohon pertimbangkan:
1. Fork repo ini.
2. Buat branch baru: feature/your-feature-name.
3. Pastikan coding style konsisten (ikuti Tailwind + React best practices).
4. Jalankan aplikasi dan pastikan tidak ada error sebelum push.
5. Submit PR dengan deskripsi perubahan yang jelas.

## 📄 Lisensi
Proyek ini dirilis di bawah lisensi MIT.
Silakan gunakan, modifikasi, dan distribusikan kode ini sesuai kebutuhan — sambil tetap mencantumkan hak cipta awal.
