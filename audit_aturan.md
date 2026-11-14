# Audit Menyeluruh Aturan Perpajakan (OIP)

Dokumen ini memuat daftar lengkap dan hasil audit seluruh **191 modul aturan/artikel perpajakan** lintas **15 jenis pajak** pada direktori `src/rules/`, disusun berurutan mulai dari **PPh Pasal 21** hingga **Bea Meterai** (79 aturan awal + 48 perluasan pertama + 21 aturan Bagian B + 29 modul pelengkap 2026 & jejak historis + **14 modul aturan terbaru & operasional khusus**).

## Kriteria Penilaian & Konvensi Checkbox

Setiap aturan diaudit pada 5 aspek utama:
1. **Klasifikasi Jenis Pajak (`taxType`)**: Kesesuaian objek, subjek, dan pengelompokan pasal/jenis pajak.
2. **Kesesuaian Rujukan (`sources` & `src/rules/sources.ts`)**: Semua regulasi inti yang menjadi dasar hukum perhitungan tercantum pada `sources` tanpa salah rujuk ke regulasi lain.
3. **Konsistensi Dasar Hukum (`legalBasis` & teks artikel)**: Penyebutan nomor pasal/ayat, nomor peraturan, dan narasi perbandingan historis akurat.
4. **Periode Berlaku (`effectivePeriod` / `effectiveDate`)**: Tanggal mulai dan berakhirnya rezim sesuai ketentuan pengundangan/berlaku efektif.
5. **Logika Perhitungan (`calculate()`) & Tarif**: Besaran tarif, PTKP/NPOPTKP/NJOPTKP, lapisan progresif, dan rumus perhitungan sesuai peraturan pada periode masing-masing.

- `- [x]` **Sesuai**: Rujukan (`sources` & `legalBasis`), jenis aturan, periode berlaku, artikel, dan logika kalkulator sudah akurat dan selaras (catatan minor/simplifikasi simulasi yang tidak menyalahi aturan tetap dicatat sebagai observasi).
- `- [ ]` **Ada Temuan / Perlu Perbaikan**: Terdapat ketidaksesuaian pada `sources`/rujukan, kesalahan tarif/logika kalkulasi, ketidaksesuaian tanggal efektif, atau kekeliruan/typo redaksional yang perlu ditindaklanjuti.

---

## Ringkasan Eksekutif

| No | Jenis Pajak | Jumlah Aturan | Sesuai (`[x]`) | Perlu Perbaikan (`[ ]`) | Catatan Utama |
| :-: | :--- | :-: | :-: | :-: | :--- |
| 1 | PPh Pasal 21 (`pph21`) | 27 | 27 | 0 | +2 modul baru: PPh 21 DTP Final IKN s.d. 2035 (`PMK 28/2024`) & Pegawai Masuk/Berhenti Tengah Tahun Disetahunkan vs Tidak Disetahunkan (`PMK 168/2023`). |
| 2 | PPh Pasal 22 (`pph22`) | 16 | 16 | 0 | +1 modul baru: Pengecualian Otomatis <= Rp 2 jt / KITE / KEK & SKB DJP (`PMK 51/2025` Pasal 3 jo. `PER-21/PJ/2014`). |
| 3 | PPh Pasal 23 (`pph23`) | 11 | 11 | 0 | +1 modul: Suket UMKM 0,5% & Pengecualian Pasal 23 ayat (4) UU PPh (`PP 55/2022` jo. `PP 20/2026`). |
| 4 | PPh Pasal 4(2) Final (`pph4_2`) | 17 | 17 | 0 | +2 modul baru: Revaluasi Aktiva Tetap 10%/3%/4%/6% (`PMK 79/2008` & `PMK 191/2015`) & Historis Tax Amnesty 2016 (`UU 11/2016`) / PPS 2022 (`PMK 196/2021`). |
| 5 | PPh Final UMKM (`pph_umkm`) | 8 | 8 | 0 | +1 modul baru: Tata Cara Suket UMKM 0,5%, Surat Pernyataan <= Rp 500 jt, & Relaksasi PKP Akhir Tahun Buku (`PMK 164/2023`). |
| 6 | PPh Pasal 25 (`pph25`) | 13 | 13 | 0 | +1 modul baru: Angsuran WP Baru Nihil Rp 0, Masa Sebelum SPT (Des Lalu), Merger, & WP Baru OPPT (`PMK 215/2018` jo. `PMK 81/2024`). |
| 7 | PPh Pasal 26 (`pph26`) | 12 | 12 | 0 | +1 modul baru: Tarif Efektif Premi Asuransi & Reasuransi ke Luar Negeri 10% / 2% / 1% (`KMK 624/KMK.04/1994`). |
| 8 | PPh Pasal 15 (`pph15`) | 6 | 6 | 0 | +1 modul: Pembebasan Resiprokal P3B Article 8 & `PMK 112/2025` untuk pelayaran/penerbangan asing. |
| 9 | PPh Badan (`pph_badan`) | 16 | 16 | 0 | +1 modul baru: Rekonsiliasi Koreksi Fiskal Positif/Negatif (`PP 93/2010`, `PMK 105/2009`, `PMK 02/2010`) & Kompensasi Kerugian 5 Tahun. |
| 10 | PPN (`ppn`) | 21 | 21 | 0 | +2 modul baru: WAPU PPN BUMN/KKKS > Rp 10 jt Kode 030 vs Instansi > Rp 2 jt Kode 020 (`PMK 81/2024`) & PPN Jasa Luar Negeri Self-Assessed 11% (`PMK 40/2010`–`PMK 81/2024`). |
| 11 | PPnBM (`ppnbm`) | 9 | 9 | 0 | +1 modul: Pembebasan PPnBM Kendaraan Dinas/Umum/Khusus (`PMK 141/2021`). |
| 12 | PBB (`pbb`) | 9 | 9 | 0 | +1 modul: Penatausahaan PBB-P3 Hulu Migas & Panas Bumi (`PMK 76/2013`, `PMK 139/2014` & `PMK 122/2019`). |
| 13 | BPHTB (`bphtb`) | 8 | 8 | 0 | +1 modul baru: Pembebasan BPHTB 100% Rumah Pertama MBR Program 3 Juta Rumah (`SKB 3 Menteri Nov 2024` + Perkada). |
| 14 | PBJT / Pajak Daerah (`pbjt`) | 9 | 9 | 0 | +1 modul baru: Pajak Provinsi UU HKPD — Pokok PKB 1,2% / BBNKB 12% (+ Opsen 66%), BBNKB Bekas 0%, PBBKB 10%, & Rokok 10%. |
| 15 | Bea Meterai (`bea_meterai`) | 9 | 9 | 0 | +1 modul baru: Dokumen Non-Objek Pasal 7 `UU 10/2020` & Kewajiban Pemungut > 1.000 Dokumen (`PMK 78/2024`). |
| **Total** | **15 Jenis Pajak** | **191** | **191** | **0** | **100% Sesuai (191 modul aturan, rujukan resmi & pengujian unit deterministik terverifikasi per 14 November 2026)** |

---

## 1. PPh Pasal 21 (`pph21` — 27 Aturan)

- [x] **1.1 PP 58/2023 & PMK 168/2023 (TER)** (`src/rules/pph21/ter2024.ts`)
  - **Regime ID / Article ID**: `pph21_ter_2024` / `pph21-ter-2024`
  - **Periode Berlaku**: `1 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PP_58_2023`, `SRC.PMK_168_2023`, `SRC.PMK_168_2023_BPK`, `SRC.PP_58_2023_BPK`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Jenis pajak, rujukan `sources`, pemetaan kategori TER A/B/C dari status PTKP, dan seluruh tabel batas bruto bulanan PP 58/2023 sudah sesuai. *Catatan observasi*: kalkulator masih menerapkan penalti +20% saat `!hasNpwp` (Pasal 21 ayat 5a UU PPh, sedangkan di praktik Coretax/PMK 168/2023 sanksi ini gugur bila NIK sudah valid sebagai NPWP) dan mensimulasikan TER masa bulanan atas penghasilan rutin (belum memisahkan lonjakan TER pada bulan pembayaran bonus).

- [x] **1.2 UU HPP & PER-16/PJ/2016** (`src/rules/pph21/hpp2022.ts`)
  - **Regime ID / Article ID**: `pph21_hpp_2022` / `pph21-lapisan-hpp`
  - **Periode Berlaku**: `1 Januari 2022 – 31 Desember 2023`
  - **`sources`**: `SRC.UU_7_2021_HPP`, `SRC.UU_7_2021_SETNEG`, `SRC.PER_16_PJ_2016`, `SRC.PMK_101_2016`
  - **Hasil Audit**: Rujukan, periode berlaku (pasca-UU HPP sebelum TER 2024), PTKP Rp 54 juta + Rp 4,5 juta/tanggungan, Biaya Jabatan 5% maks Rp 6 juta/tahun, serta 5 lapisan progresif UU HPP (5% s.d. 60 jt, 15%, 25%, 30%, 35% > 5 M) sudah akurat.

- [x] **1.3 PMK 86/2020, PMK 110/2020, PMK 9/2021 & PMK 82/2021 (PPh 21 DTP)** (`src/rules/pph21/pmk86_2020_dtp.ts`)
  - **Regime ID / Article ID**: `pph21_pmk86_2020_dtp` / `pph21-pmk86-2020-dtp`
  - **Periode Berlaku**: `Masa Pajak April 2020 – Desember 2021`
  - **`sources`**: `SRC.PMK_23_2020`, `SRC.PMK_44_2020`, `SRC.PMK_86_2020`, `SRC.PMK_110_2020`, `SRC.PMK_9_2021`, `SRC.PMK_82_2021`
  - **Hasil Audit (Diperbaiki)**: `SRC.PMK_23_2020` dan `SRC.PMK_44_2020` telah ditambahkan ke `sources.ts` dan `sources` modul serta diselaraskan dengan `article.legalBasis`. Logika syarat DTP (penghasilan bruto tetap disetahunkan <= Rp 200 juta dan ber-NPWP) akurat.

- [x] **1.4 UU 36/2008 & PMK 101/2016** (`src/rules/pph21/uu36_2016.ts`)
  - **Regime ID / Article ID**: `pph21_uu36_2016` / `pph21-uu36-pmk101-2016`
  - **Periode Berlaku**: `1 Januari 2016 – 31 Desember 2021`
  - **`sources`**: `SRC.UU_36_2008`, `SRC.PMK_101_2016`, `SRC.PER_16_PJ_2016`
  - **Hasil Audit**: Rujukan, PTKP Rp 54 juta, Biaya Jabatan maks Rp 6 juta/tahun, dan 4 lapis tarif UU 36/2008 (5% s.d. 50 jt, 15%, 25%, 30% > 500 jt) sudah akurat.

- [x] **1.5 UU 36/2008 & PMK 122/2015** (`src/rules/pph21/pmk122_2015.ts`)
  - **Regime ID / Article ID**: `pph21_pmk122_2015` / `pph21-pmk122-2015`
  - **Periode Berlaku**: `1 Januari 2015 – 31 Desember 2015`
  - **`sources`**: `SRC.PMK_122_2015`, `SRC.UU_36_2008`, `SRC.PMK_250_2008`
  - **Hasil Audit**: Rujukan, PTKP Rp 36 juta (tambahan Rp 3 juta/tanggungan), periode berlaku Tahun Pajak 2015, dan tarif Pasal 17 akurat.

- [x] **1.6 UU 36/2008 & PMK 162/2012** (`src/rules/pph21/pmk162_2013.ts`)
  - **Regime ID / Article ID**: `pph21_pmk162_2013` / `pph21-pmk162-2012`
  - **Periode Berlaku**: `1 Januari 2013 – 31 Desember 2014`
  - **`sources`**: `SRC.PMK_162_2012`, `SRC.UU_36_2008`, `SRC.PMK_250_2008`
  - **Hasil Audit**: Rujukan, PTKP Rp 24,3 juta (tambahan Rp 2,025 juta/tanggungan), dan periode 2013–2014 sesuai PMK 162/PMK.011/2012 akurat.

- [x] **1.7 UU 36/2008 & PMK 250/2008 (TP 2009–2012)** (`src/rules/pph21/uu36_2009.ts`)
  - **Regime ID / Article ID**: `pph21_uu36_2009` / `pph21-uu36-2009`
  - **Periode Berlaku**: `1 Januari 2009 – 31 Desember 2012`
  - **`sources`**: `SRC.UU_36_2008`, `SRC.PMK_250_2008`
  - **Hasil Audit**: Rujukan, PTKP Pasal 7 UU 36/2008 Rp 15,84 juta (tambahan Rp 1,32 juta), kenaikan batas Biaya Jabatan ke Rp 6 juta/tahun (PMK 250/2008), dan sanksi +20% non-NPWP akurat.

- [x] **1.8 UU 17/2000 & PMK 137/2005 (TP 2006–2008)** (`src/rules/pph21/pmk137_2005.ts`)
  - **Regime ID / Article ID**: `pph21_pmk137_2005` / `pph21-pmk137-2005`
  - **Periode Berlaku**: `1 Januari 2006 – 31 Desember 2008`
  - **`sources`**: `SRC.PMK_137_2005`, `SRC.UU_17_2000`, `SRC.KMK_521_1998`
  - **Hasil Audit**: Rujukan, PTKP Rp 13,2 juta (tambahan Rp 1,2 juta), Biaya Jabatan Rp 1,296 juta/tahun (KMK 521/1998), dan 5 lapis tarif UU 17/2000 (5/10/15/25/35%) akurat.

- [x] **1.9 UU 17/2000 & KMK 564/2004 (TP 2005)** (`src/rules/pph21/kmk564_2004.ts`)
  - **Regime ID / Article ID**: `pph21_kmk564_2004` / `pph21-kmk564-2004`
  - **Periode Berlaku**: `1 Januari 2005 – 31 Desember 2005`
  - **`sources`**: `SRC.KMK_564_2004`, `SRC.UU_17_2000`, `SRC.KMK_521_1998`
  - **Hasil Audit (Diperbaiki)**: Typo redaksional pada paragraf pertama artikel telah diperbaiki menjadi kalimat faktual yang bersih. Angka PTKP (Rp 12 juta + Rp 1,2 juta), tarif 5/10/15/25/35%, dan `sources` akurat.

- [x] **1.10 UU Nomor 17 Tahun 2000 (TP 2001–2004)** (`src/rules/pph21/uu17_2000.ts`)
  - **Regime ID / Article ID**: `pph21_uu17_2000` / `pph21-uu17-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 31 Desember 2004`
  - **`sources`**: `SRC.UU_17_2000`, `SRC.KMK_521_1998`
  - **Hasil Audit**: Rujukan, PTKP Rp 2,88 juta + Rp 1,44 juta/tanggungan, Biaya Jabatan Rp 1,296 juta/tahun, dan 5 lapis tarif Pasal 17 UU 17/2000 akurat.

- [x] **1.11 UU Nomor 10 Tahun 1994 (TP 1995–2000)** (`src/rules/pph21/uu10_1994.ts`)
  - **Regime ID / Article ID**: `pph21_uu10_1994` / `pph21-uu10-1994`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.UU_10_1994`, `SRC.KMK_49_1994`, `SRC.KMK_521_1998`
  - **Hasil Audit**: Rujukan, PTKP Rp 1,728 juta + Rp 864 ribu/tanggungan, Biaya Jabatan Rp 648 ribu/tahun (KMK 49/1994) lalu Rp 1,296 juta/tahun (KMK 521/1998; di simulasi memakai Rp 648 ribu), serta 3 lapis tarif 10/15/30% akurat.

- [x] **1.12 UU Nomor 7 Tahun 1983 & UU 7/1991 (TP 1984–1994)** (`src/rules/pph21/uu7_1983.ts`)
  - **Regime ID / Article ID**: `pph21_uu7_1983` / `pph21-uu7-1983`
  - **Periode Berlaku**: `1 Januari 1984 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.UU_7_1991`, `SRC.KMK_980_1983`, `SRC.KMK_49_1994`
  - **Hasil Audit (Diperbaiki)**: `SRC.KMK_980_1983` (Biaya Jabatan perdana 31 Des 1983) telah ditambahkan ke `sources.ts` dan `sources` modul mendampingi `KMK_49_1994`. Angka PTKP (Rp 960 rb + Rp 480 rb), Biaya Jabatan 5% maks Rp 360 rb/tahun, dan tarif 15/25/35% akurat.

- [x] **1.13 PP 68/2009 — Pesangon & Pensiun/THT/JHT Final** (`src/rules/pph21/pp68_2009.ts`)
  - **Regime ID / Article ID**: `pph21_pp68_2009` / `pph21-pp68-2009-pesangon`
  - **Periode Berlaku**: `16 November 2009 – Sekarang`
  - **`sources`**: `SRC.PP_68_2009`, `SRC.PMK_16_2010`, `SRC.PP_58_2023`
  - **Hasil Audit**: Rujukan, tanggal berlaku 16 November 2009, lapisan tarif final uang pesangon (0%/5%/15%/25%) dan uang manfaat pensiun/THT/JHT (0% s.d. 50 jt, 5% > 50 jt) akurat.

- [x] **1.14 PP 149/2000 — Pesangon & Pensiun/THT/JHT (Lama)** (`src/rules/pph21/pp149_2000.ts`)
  - **Regime ID / Article ID**: `pph21_pp149_2000` / `pph21-pp149-2000-pesangon`
  - **Periode Berlaku**: `1 Januari 2001 – 15 November 2009`
  - **`sources`**: `SRC.PP_149_2000`, `SRC.UU_17_2000`
  - **Hasil Audit**: Rujukan, periode berlaku, dan 5 lapis tarif final pesangon PP 149/2000 (<= 25 jt 0%, 25–50 jt 5%, 50–100 jt 10%, 100–200 jt 15%, > 200 jt 25%) sudah akurat.

- [x] **1.15 PMK 10/2025 jo. PMK 72/2025 (PPh 21 DTP 2025)** (`src/rules/pph21/pmk10_2025.ts`)
  - **Regime ID / Article ID**: `pph21_pmk10_2025` / `pph21-pmk10-2025`
  - **Periode Berlaku**: `Januari 2025 – Desember 2025`
  - **`sources`**: `SRC.PMK_10_2025`, `SRC.PMK_72_2025`, `SRC.PP_58_2023`, `SRC.PMK_168_2023`
  - **Hasil Audit**: Pembebasan PPh 21 DTP 100% untuk sektor padat karya (tekstil, alas kaki, furnitur, kulit) & pariwisata (PMK 72/2025) dengan batas bruto tetap dan teratur <= Rp 10 juta/bulan serta syarat NPWP/NIK padan akurat.

- [x] **1.16 PMK 66/2023 (Natura & Kenikmatan Pegawai)** (`src/rules/pph21/pmk66_2023.ts`)
  - **Regime ID / Article ID**: `pph21_pmk66_2023` / `pph21-pmk66-2023`
  - **Periode Berlaku**: `1 Juli 2023 – Sekarang`
  - **`sources`**: `SRC.PMK_66_2023`, `SRC.PP_55_2022`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Pembalikan rezim natura/kenikmatan menjadi taxable-deductible sejak 1 Juli 2023 beserta penggabungan nilai pasar natura ke basis bruto TER & rekonsiliasi Pasal 17 UU HPP akurat.

- [x] **1.17 PP 80/2010 (Honorarium Beban APBN/APBD)** (`src/rules/pph21/pp80_2010.ts`)
  - **Regime ID / Article ID**: `pph21_pp80_2010` / `pph21-pp80-2010`
  - **Periode Berlaku**: `1 Januari 2011 – Sekarang`
  - **`sources`**: `SRC.PP_80_2010`, `SRC.PP_58_2023`, `SRC.UU_36_2008`
  - **Hasil Audit**: Tarif PPh 21 final atas honorarium dan imbalan lain beban APBN/APBD berdasarkan golongan PNS/TNI/Polri/Pejabat Negara (0% Gol I–II, 5% Gol III, 15% Gol IV & Pejabat Negara) akurat.

- [x] **1.18 PER-31/PJ/2009 & PER-31/PJ/2012 (Bukan Pegawai 50%)** (`src/rules/pph21/per31_2009.ts`)
  - **Regime ID / Article ID**: `pph21_per31_2009` / `pph21-per31-2009`
  - **Periode Berlaku**: `1 Januari 2009 – 28 September 2016`
  - **`sources`**: `SRC.PER_31_PJ_2009`, `SRC.PER_31_PJ_2012`, `SRC.PER_32_PJ_2015`, `SRC.UU_36_2008`
  - **Hasil Audit**: Norma DPP 50% × penghasilan bruto untuk Bukan Pegawai (tenaga ahli, komisi, agen), pemisahan skema berkesinambungan (dengan pengurang PTKP/12) vs tidak berkesinambungan, serta sanksi non-NPWP +20% akurat.

- [x] **1.19 Ordonansi Pajak Pendapatan 1944 (PPd 1944) jo. UU 9/1970** (`src/rules/pph21/ppd1944.ts`)
  - **Regime ID / Article ID**: `pph21_ppd1944` / `pph21-ppd1944`
  - **Periode Berlaku**: `1944 – 31 Desember 1983`
  - **`sources`**: `SRC.UU_9_1970_PPD`, `SRC.UU_7_1983`
  - **Hasil Audit**: Sejarah pra-reformasi 1984 (sistem official assessment SKP, tarif progresif 10%–50% sesuai UU 9/1970, dan pencabutan oleh UU 7/1983) serta simulasi konversi tarif akurat.

- [x] **1.20 PMK 168/2023 (Rekonsiliasi Masa Desember & Lonjakan TER THR/Bonus)** (`src/rules/pph21/pmk168_2023_desember.ts`)
  - **Regime ID / Article ID**: `pph21_pmk168_2023_desember` / `pph21-pmk168-2023-desember`
  - **Periode Berlaku**: `1 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PMK_168_2023`, `SRC.PP_58_2023`, `SRC.UU_7_2021_HPP`, `SRC.PMK_101_2016`
  - **Hasil Audit (Baru Dibuat & Terverifikasi)**: Memisahkan secara akurat 10 bulan TER rutin + 1 bulan lonjakan TER akibat pencairan THR/bonus di masa Januari–November (atau 11 bulan rutin bila bonus cair Desember) sebelum rekonsiliasi Pasal 17 UU HPP pada Masa Pajak Terakhir Desember, lengkap dengan penanganan **Kurang Potong** maupun **Lebih Potong** (wajib dikembalikan paling lambat akhir Januari).

- [x] **1.21 PMK 168/2023 & PP 58/2023 (Bukan Pegawai 50% & TER Harian)** (`src/rules/pph21/pmk168_2023_nonpegawai.ts`)
  - **Regime ID / Article ID**: `pph21_pmk168_2023_nonpegawai` / `pph21-pmk168-2023-nonpegawai`
  - **Periode Berlaku**: `1 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PMK_168_2023`, `SRC.PP_58_2023`, `SRC.UU_7_2021_HPP`, `SRC.PER_16_PJ_2016`
  - **Hasil Audit**: Perubahan penghitungan Bukan Pegawai menjadi Tarif Pasal 17 UU HPP × (50% × Bruto) per masa tanpa PTKP dan tanpa kumulatif, serta TER Harian Pegawai Tidak Tetap (0% <= Rp 450 rb/hari, 0,5% > Rp 450 rb–Rp 2,5 jt/hari, dan 50% Bruto × Pasal 17 > Rp 2,5 jt/hari) akurat.

- [x] **1.22 PMK 168/2023 Subjek Khusus (Komisaris, Peserta Kegiatan, Mantan Pegawai, & Penarikan Dapen)** (`src/rules/pph21/pmk168_2023_khusus.ts`)
  - **Regime ID / Article ID**: `pph21_pmk168_2023_khusus` / `pph21-pmk168-2023-khusus`
  - **Periode Berlaku**: `1 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PMK_168_2023`, `SRC.PP_58_2023`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Memisahkan secara akurat dua kelompok pengali: Dewan Komisaris tidak teratur & Mantan Pegawai (Bruto × TER Bulanan) vs Peserta Kegiatan & Penarikan Dana Pensiun Awal (Bruto × Tarif Pasal 17 non-kumulatif tanpa faktor 50%).

- [x] **1.23 PMK 105/2025 (PPh 21 DTP Stimulus Ekonomi TA 2026)** (`src/rules/pph21/pmk105_2025.ts`)
  - **Regime ID / Article ID**: `pph21_pmk105_2025` / `pph21-pmk105-2025`
  - **Periode Berlaku**: `Masa Pajak Januari 2026 – Desember 2026`
  - **`sources`**: `SRC.PMK_105_2025`, `SRC.PMK_10_2025`, `SRC.PMK_72_2025`, `SRC.PP_58_2023`, `SRC.PMK_168_2023`
  - **Hasil Audit**: Pembebasan PPh Pasal 21 DTP 100% (dibayarkan tunai ke pekerja) sepanjang Masa Pajak Januari–Desember 2026 untuk sektor KLU alas kaki, tekstil/pakaian jadi, furnitur, kulit, dan pariwisata dengan syarat bruto tetap & teratur <= Rp 10 juta/bulan serta NPWP/NIK valid terverifikasi.

- [x] **1.24 PMK 18/PMK.03/2021 (PPh Teritorial Ekspatriat WNA Keahlian Tertentu)** (`src/rules/pph21/pmk18_2021_wna_teritorial.ts`)
  - **Regime ID / Article ID**: `pph21_pmk18_2021_wna` / `pph21-pmk18-2021-wna`
  - **Periode Berlaku**: `17 Februari 2021 – Sekarang`
  - **`sources`**: `SRC.PMK_18_2021`, `SRC.UU_6_2023_CK`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Fasilitas pengenaan PPh hanya atas penghasilan bersumber Indonesia (teritorial) selama 4 tahun pajak pertama sejak menjadi SPDN bagi WNA berkeahlian tertentu vs pengenaan *worldwide income* pada tahun ke-5 dst terverifikasi akurat.

- [x] **1.25 KMK 600/1995 & KMK 462/1998 (Pesangon Pra-2001: Bebas Rp 17,28 Jt / 10% / 15%)** (`src/rules/pph21/kmk462_1998_pesangon.ts`)
  - **Regime ID / Article ID**: `pph21_kmk462_1998_pesangon` / `pph21-kmk462-1998-pesangon`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.KMK_462_1998`, `SRC.KMK_600_1995`, `SRC.PP_45_1994`, `SRC.PP_149_2000`
  - **Hasil Audit**: Lapisan historis PPh Final pesangon pra-PP 149/2000 (KMK 600/1995: bebas s.d. Rp 5,184 jt, 10% s.d. 25 jt, 15% > 25 jt; KMK 462/1998: bebas s.d. Rp 17,28 jt, 10% s.d. 25 jt, 15% > 25 jt) akurat.

- [x] **1.26 PMK 28/2024 Pasal 123–126 (PPh 21 DTP Final Ibu Kota Nusantara s.d. 2035)** (`src/rules/pph21/pmk28_2024_ikn.ts`)
  - **Regime ID / Article ID**: `pph21_pmk28_2024_ikn` / `pph21-pmk28-2024-ikn`
  - **Periode Berlaku**: `16 Mei 2024 – 31 Desember 2035`
  - **`sources`**: `SRC.PMK_28_2024`, `SRC.PP_12_2023`, `SRC.PP_29_2024`
  - **Hasil Audit**: Pembebasan PPh 21 DTP 100% bersifat final tanpa plafon gaji Rp 10 juta hingga Tahun Pajak 2035 bagi Pegawai Tertentu yang berdomisili dan ber-NPWP/NIK KPP wilayah IKN serta bekerja pada Pemberi Kerja Tertentu di IKN akurat.

- [x] **1.27 PMK 168/2023 Pasal 16 (Pegawai Masuk / Berhenti Tengah Tahun: Disetahunkan vs Tidak Disetahunkan)** (`src/rules/pph21/pmk168_2023_tengah_tahun.ts`)
  - **Regime ID / Article ID**: `pph21_pmk168_2023_tengah_tahun` / `pph21-pmk168-2023-tengah-tahun`
  - **Periode Berlaku**: `1 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PMK_168_2023`, `SRC.PMK_168_2023_BPK`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Pemisahan akurat antara pegawai lokal yang resign/pensiun di dalam negeri (penghasilan n bulan TIDAK disetahunkan namun tetap dikurangi PTKP penuh setahun) vs WNA baru datang/pegawai meninggal dunia/meninggalkan RI selamanya (neto disetahunkan 12/n lalu PPh diprorata n/12).

---

## 2. PPh Pasal 22 (`pph22` — 16 Aturan)

- [x] **2.1 PMK 51/2025 (Pemungutan PPh 22 Terkini) jo. PMK 92/2019** (`src/rules/pph22/pmk51_2025.ts`)
  - **Regime ID / Article ID**: `pph22_pmk51_2025` / `pph22-pmk51-2025`
  - **Periode Berlaku**: `1 Agustus 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_51_2025`, `SRC.PMK_54_2025`, `SRC.PMK_92_2019`
  - **Hasil Audit**: Rujukan lengkap (termasuk PMK 54/2025 yang mencabut Pasal 217–225 PMK 81/2024), tanggal berlaku 1 Agustus 2025, tarif impor (2,5% API, 7,5% non-API, 0,5% komoditas tertentu, 10% konsumsi tertentu), bendahara/BUMN 1,5%, bulion emas 0,25%, dan barang sangat mewah 1%/5% (PMK 92/2019) akurat.

- [x] **2.2 PMK 37/2025 (PPh 22 Marketplace / PPMSE)** (`src/rules/pph22/pmk37_2025.ts`)
  - **Regime ID / Article ID**: `pph22_pmk37_2025` / `pph22-pmk37-2025`
  - **Periode Berlaku**: `14 Juli 2025 – Sekarang (Implementasi Bertahap)`
  - **`sources`**: `SRC.PMK_37_2025`, `SRC.PMK_37_2025_DJP`, `SRC.PMK_37_2025_BPK`
  - **Hasil Audit**: Rujukan, tanggal penetapan (11 Juni 2025) & pengundangan (14 Juli 2025), tarif 0,5% dari peredaran bruto tidak termasuk PPN/PPnBM, dan pengecualian pedagang OP beromzet <= Rp 500 juta dengan surat pernyataan sudah akurat. (*Catatan minor*: `caseExample.presetInput.pph22.objectType` bernilai `'impor_api'` karena tidak digunakan oleh fungsi `calculate()` khusus marketplace).

- [x] **2.3 PMK 81/2024 Bab VI (Pasal 217–225)** (`src/rules/pph22/pmk81_2024.ts`)
  - **Regime ID / Article ID**: `pph22_pmk81_2024` / `pph22-pmk81-2024`
  - **Periode Berlaku**: `1 Januari 2025 – 31 Juli 2025`
  - **`sources`**: `SRC.PMK_81_2024`, `SRC.PMK_54_2025`, `SRC.PMK_92_2019`
  - **Hasil Audit**: Rujukan, periode sebelum dicabut PMK 54/2025, tarif bulion emas 0,25% (meneruskan PMK 48/2023), serta penerapan sanksi +100% (200% tarif normal) apabila wajib pajak belum ber-NPWP/NIK 16 digit (sebagaimana diimplementasikan pada kalkulasi `!hasNpwp`) akurat.

- [x] **2.4 PMK 34/2017 jo. PMK 110/2018, PMK 41/2022 & PMK 48/2023** (`src/rules/pph22/pmk34_2017.ts`)
  - **Regime ID / Article ID**: `pph22_pmk34_2017` / `pph22-pmk34-2017`
  - **Periode Berlaku**: `1 Maret 2017 – 31 Desember 2024`
  - **`sources`**: `SRC.PMK_34_2017`, `SRC.PMK_110_2018`, `SRC.PMK_41_2022`, `SRC.PMK_48_2023`, `SRC.PMK_59_2022`, `SRC.PMK_92_2019`
  - **Hasil Audit (Diperbaiki)**: Tarif `bulion_emas` telah dikoreksi menjadi **0,25%** mengikuti PMK Nomor 48 Tahun 2023 (efektif 1 Mei 2023; dengan catatan riwayat 0,45% periode 2017–Apr 2023) dan `SRC.PMK_48_2023` telah ditambahkan ke `sources`.

- [x] **2.5 PMK Nomor 154/PMK.03/2010** (`src/rules/pph22/pmk154_2010.ts`)
  - **Regime ID / Article ID**: `pph22_pmk154_2010` / `pph22-pmk154-2010`
  - **Periode Berlaku**: `31 Agustus 2010 – 28 Februari 2017`
  - **`sources`**: `SRC.PMK_154_2010`, `SRC.PMK_175_2013`, `SRC.PMK_107_2015`, `SRC.PMK_253_2008`
  - **Hasil Audit (Diperbaiki)**: `SRC.PMK_107_2015` telah ditambahkan ke `sources` dan `legalBasis`, serta label dan catatan `bulion_emas` memperjelas bahwa tarif 0,45% emas batangan berlaku mulai PMK 107/PMK.010/2015.

- [x] **2.6 KMK 254/2001 jo. PMK 210/2008 & PMK 253/2008** (`src/rules/pph22/kmk254_2001.ts`)
  - **Regime ID / Article ID**: `pph22_kmk254_2001` / `pph22-kmk254-2001`
  - **Periode Berlaku**: `30 April 2001 – 30 Agustus 2010`
  - **`sources`**: `SRC.KMK_254_2001`, `SRC.PMK_210_2008`, `SRC.PMK_253_2008`, `SRC.UU_36_2008`
  - **Hasil Audit (Diperbaiki)**: `SRC.UU_36_2008` telah ditambahkan ke `sources`, serta label formula dan catatan non-NPWP di `calculate()` kini menegaskan bahwa sanksi +100% hanya berlaku pada akhir periode rezim (1 Jan 2009–30 Ags 2010) sesuai UU 36/2008.

- [x] **2.7 KMK 599/KMK.04/1994 & KMK 450/KMK.04/1997** (`src/rules/pph22/kmk450_1997.ts`)
  - **Regime ID / Article ID**: `pph22_kmk450_1997` / `pph22-kmk450-1997`
  - **Periode Berlaku**: `1 Januari 1995 – 29 April 2001`
  - **`sources`**: `SRC.KMK_450_1997`, `SRC.KMK_599_1994`, `SRC.UU_10_1994`
  - **Hasil Audit**: Rujukan, periode berlaku, dan tarif impor (2,5% / 7,5%) serta bendahara/BUMN (1,5%) akurat.

- [x] **2.8 UU 7/1983 & KMK 965/1983 / KMK 382/1989** (`src/rules/pph22/uu7_1983.ts`)
  - **Regime ID / Article ID**: `pph22_uu7_1983` / `pph22-uu7-1983`
  - **Periode Berlaku**: `1 Januari 1984 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.KMK_965_1983`, `SRC.KMK_382_1989`, `SRC.KMK_599_1994`
  - **Hasil Audit (Diperbaiki)**: Penomoran historis keliru (`KMK 983/KMK.04/1983` & `KMK 848/KMK.04/1992`) telah diganti menjadi nomor regulasi PPh 22 terverifikasi JDIH Kemenkeu yaitu **`KMK 965/KMK.04/1983`** dan **`KMK 382/KMK.04/1989`** serta ditambahkan ke `sources`.

- [x] **2.9 PMK 50/2025 (PPh 22 Final Aset Kripto — Pencabut PMK 68/2022)** (`src/rules/pph22/pmk50_2025_kripto.ts`)
  - **Regime ID / Article ID**: `pph22_pmk50_2025_kripto` / `pph22-pmk50-2025-kripto`
  - **Periode Berlaku**: `1 Agustus 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_50_2025`, `SRC.PMK_68_2022`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Penghapusan PPN penyerahan aset kripto dan penetapan tarif PPh 22 Final 0,21% (PPMSE dalam negeri terdaftar) atau 1% (bursa luar negeri) per 1 Agustus 2025 sesuai PMK 50/2025 akurat.

- [x] **2.10 PMK 58/PMK.03/2022 (Pengadaan Pemerintah via Marketplace / SIPP)** (`src/rules/pph22/pmk58_2022_sipp.ts`)
  - **Regime ID / Article ID**: `pph22_pmk58_2022_sipp` / `pph22-pmk58-2022-sipp`
  - **Periode Berlaku**: `1 Mei 2022 – Sekarang`
  - **`sources`**: `SRC.PMK_58_2022`, `SRC.PMK_59_2022`, `SRC.PMK_51_2025`
  - **Hasil Audit**: Penunjukan pihak lain penyelenggara sistem pengadaan pemerintah (SIPP) sebagai pemungut PPh Pasal 22 sebesar 0,5% atas nilai pembayaran non-PPN (termasuk skema transisi ke PMK 51/2025) akurat.

- [x] **2.11 PMK 51/2025 & PMK 34/2017 (PPh 22 BBM, BBG, Pelumas & Industri Tertentu)** (`src/rules/pph22/bbm_industri.ts`)
  - **Regime ID / Article ID**: `pph22_bbm_industri` / `pph22-bbm-industri`
  - **Periode Berlaku**: `1 April 2017 – Sekarang (Diperbarui di PMK 51/2025)`
  - **`sources`**: `SRC.PMK_51_2025`, `SRC.PMK_81_2024`, `SRC.PMK_34_2017`
  - **Hasil Audit**: Tarif 8 klaster industri/energi (BBM Pertamina 0,25% final, BBM non-Pertamina 0,3%, BBG/pelumas 0,3%, semen 0,25%, kertas 0,1%, baja 0,3%, otomotif 0,45%, farmasi 0,3%) akurat.

- [x] **2.12 PMK 253/2008 jo. PMK 90/2015 & PMK 92/2019 (Barang Sangat Mewah)** (`src/rules/pph22/pmk253_2008_mewah.ts`)
  - **Regime ID / Article ID**: `pph22_pmk253_2008_mewah` / `pph22-pmk253-2008-mewah`
  - **Periode Berlaku**: `1 Januari 2009 – Sekarang`
  - **`sources`**: `SRC.PMK_92_2019`, `SRC.PMK_90_2015`, `SRC.PMK_253_2008`
  - **Hasil Audit**: Evolusi ambang harga dan tarif barang sangat mewah dari PMK 253/2008 (5% ambang Rp 10 M), PMK 90/2015 (5% hunian ≥ Rp 5 M), hingga PMK 92/2019 (1% hunian ≥ Rp 30 M dan 5% pesawat/yacht/mobil mewah) akurat.

- [x] **2.13 PMK 48/2023 jo. PMK 51/2025 & PMK 11/2025 (PPh 22 & PPN Emas Perhiasan/Batangan)** (`src/rules/pph22/pmk48_2023_emas.ts`)
  - **Regime ID / Article ID**: `pph22_pmk48_2023_emas` / `pph22-pmk48-2023-emas`
  - **Periode Berlaku**: `1 Mei 2023 – Sekarang`
  - **`sources`**: `SRC.PMK_48_2023`, `SRC.PMK_51_2025`, `SRC.PMK_11_2025`, `SRC.PMK_41_2022`
  - **Hasil Audit (Disempurnakan)**: Tarif PPh 22 sebesar 0,25% (0% untuk konsumen akhir/SKB) dan PPN Besaran Tertentu 1,1% / 1,65% akurat. Telah dilengkapi skema lengkap Pedagang Punya/Tanpa Faktur Pajak baik ke Pelaku Usaha maupun ke Konsumen Akhir serta rujukan `SRC.PMK_11_2025`.

- [x] **2.14 PMK 68/PMK.03/2022 (PPh 22 & PPN Kripto Era Bappebti)** (`src/rules/pph22/pmk68_2022_kripto.ts`)
  - **Regime ID / Article ID**: `pph22_pmk68_2022_kripto` / `pph22-pmk68-2022-kripto`
  - **Periode Berlaku**: `1 Mei 2022 – 31 Juli 2025`
  - **`sources`**: `SRC.PMK_68_2022`, `SRC.PMK_50_2025`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Pemisahan periode historis pra-PMK 50/2025: PPh 22 Final 0,1% + PPN 0,11% (exchanger terdaftar Bappebti) atau 0,2% + PPN 0,22% (non-terdaftar) akurat.

- [x] **2.15 MPO (Menghitung Pajak Orang) — UU Nomor 8 Tahun 1967 (Pra-1984)** (`src/rules/pph22/mpo_uu8_1967.ts`)
  - **Regime ID / Article ID**: `pph22_mpo_uu8_1967` / `pph22-mpo-uu8-1967`
  - **Periode Berlaku**: `1967 – 31 Desember 1983 (Digantikan PPh 22 UU 7/1983)`
  - **`sources`**: `SRC.UU_8_1967`, `SRC.UU_7_1983`, `SRC.KMK_965_1983`
  - **Hasil Audit**: Jejak historis cikal bakal PPh 22 melalui sistem pemungutan MPO (2% atas nilai niaga/impor, 4% tanpa identitas fiskal) sesuai UU 8/1967 jo. PP 11/1967 sebelum digantikan UU 7/1983 akurat.

- [x] **2.16 Pengecualian Otomatis & SKB PPh Pasal 22 (PMK 51/2025 Pasal 3 jo. PER-21/PJ/2014)** (`src/rules/pph22/pembebasan_skb.ts`)
  - **Regime ID / Article ID**: `pph22_pembebasan_skb` / `pph22-pembebasan-skb`
  - **Periode Berlaku**: `1 Agustus 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_51_2025`, `SRC.PMK_81_2024`, `SRC.PMK_34_2017`
  - **Hasil Audit**: Pembedaan akurat transaksi pengecualian otomatis tanpa SKB (belanja instansi pemerintah <= Rp 2 jt non-PPN, impor fasilitas KITE Pembebasan/KEK/Kawasan Berikat, bantuan bencana/sosial) vs pembebasan ber-SKB DJP rugi fiskal serta pengalihan ke PPh Final UMKM 0,5% bagi rekanan ber-Suket.

---

## 3. PPh Pasal 23 (`pph23` — 11 Aturan)

- [x] **3.1 PMK 141/2015 & UU HPP** (`src/rules/pph23/pmk141_2015.ts`)
  - **Regime ID / Article ID**: `pph23_pmk141_2015` / `pph23-jasa-pmk141`
  - **Periode Berlaku**: `26 Agustus 2015 – Sekarang`
  - **`sources`**: `SRC.PMK_141_2015`, `SRC.UU_6_2023_CK`, `SRC.UU_7_2021_HPP`, `SRC.UU_36_2008`
  - **Hasil Audit (Diperbaiki)**: `effectivePeriod` dan `effectiveDate` dikoreksi menjadi **26 Agustus 2015** (30 hari setelah diundangkan 27 Juli 2015), serta `SRC.UU_6_2023_CK` (Penetapan Perppu Cipta Kerja) telah ditambahkan ke `sources` dan `legalBasis`.

- [x] **3.2 UU 36/2008 & PMK 244/2008** (`src/rules/pph23/pmk244_2009.ts`)
  - **Regime ID / Article ID**: `pph23_pmk244_2009` / `pph23-pmk244-2009`
  - **Periode Berlaku**: `1 Januari 2009 – 25 Agustus 2015`
  - **`sources`**: `SRC.PMK_244_2008`, `SRC.UU_36_2008`
  - **Hasil Audit (Diperbaiki)**: Batas akhir `effectivePeriod` diselaraskan menjadi **25 Agustus 2015** tepat sehari sebelum PMK 141/2015 berlaku efektif. Rujukan `sources` dan tarif akurat.

- [x] **3.3 UU 17/2000 & PER-70/PJ/2007** (`src/rules/pph23/per70_2007.ts`)
  - **Regime ID / Article ID**: `pph23_per70_2007` / `pph23-per70-2007`
  - **Periode Berlaku**: `9 April 2007 – 31 Desember 2008`
  - **`sources`**: `SRC.UU_17_2000`, `SRC.PER_70_PJ_2007`
  - **Hasil Audit (Diperbaiki)**: `SRC.PER_70_PJ_2007` telah ditambahkan ke `sources.ts` menggantikan `SRC.KEP_170_2002_DJP` pada `sources` modul. Tarif perkiraan neto dan tanggal berlaku akurat.

- [x] **3.4 UU 17/2000 & KEP-170/PJ./2002** (`src/rules/pph23/kep170_2002.ts`)
  - **Regime ID / Article ID**: `pph23_kep170_2002` / `pph23-kep170-2002`
  - **Periode Berlaku**: `1 Mei 2002 – 8 April 2007`
  - **`sources`**: `SRC.KEP_170_2002_DJP`, `SRC.UU_17_2000`
  - **Hasil Audit**: Rujukan, periode berlaku, dan tarif efektif perkiraan neto KEP-170/PJ./2002 (7,5% konsultan, 6% teknik/manajemen tertentu, 4,5% sewa harta, 15% royalti/dividen) akurat.

- [x] **3.5 UU 10/1994 & KEP-176/PJ./2000** (`src/rules/pph23/kep176_2000.ts`)
  - **Regime ID / Article ID**: `pph23_kep176_2000` / `pph23-kep176-2000`
  - **Periode Berlaku**: `1 Januari 1995 – 30 April 2002`
  - **`sources`**: `SRC.UU_10_1994`, `SRC.KEP_176_PJ_2000`
  - **Hasil Audit (Diperbaiki)**: `SRC.KEP_176_PJ_2000` telah ditambahkan ke `sources.ts` menggantikan `SRC.KEP_170_2002_DJP` pada `sources` modul. Tarif efektif era 1995–2002 akurat.

- [x] **3.6 UU Nomor 7 Tahun 1983 (Pasal 23)** (`src/rules/pph23/uu7_1983.ts`)
  - **Regime ID / Article ID**: `pph23_uu7_1983` / `pph23-uu7-1983`
  - **Periode Berlaku**: `1 Januari 1984 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.UU_10_1994`
  - **Hasil Audit**: Rujukan, periode berlaku, dan tarif 15% sesuai Pasal 23 UU 7/1983 akurat.

- [x] **3.7 PMK 69/PMK.03/2022 (P2P Lending & Pajak Fintech)** (`src/rules/pph23/pmk69_2022_fintech.ts`)
  - **Regime ID / Article ID**: `pph23_pmk69_2022_fintech` / `pph23-pmk69-2022-fintech`
  - **Periode Berlaku**: `1 Mei 2022 – Sekarang`
  - **`sources`**: `SRC.PMK_69_2022`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Pemotongan pajak atas bunga pinjaman P2P lending melalui penyelenggara fintech berizin OJK: PPh 23 sebesar 15% bagi WPDN/BUT (30% bila non-NPWP), PPh 26 sebesar 20% bagi WPLN, serta 0% bila dikecualikan/SKB akurat.

- [x] **3.8 KEP-128/PJ./1997 (Jenis Jasa Lain Awal UU 10/1994)** (`src/rules/pph23/kep128_1997.ts`)
  - **Regime ID / Article ID**: `pph23_kep128_1997` / `pph23-kep128-1997`
  - **Periode Berlaku**: `1997 – 3 Juli 2000`
  - **`sources`**: `SRC.KEP_128_PJ_1997`, `SRC.UU_10_1994`, `SRC.KEP_176_PJ_2000`
  - **Hasil Audit**: Tarif perkiraan penghasilan neto awal pasca-UU 10/1994 (sebelum diperbarui KEP-176/PJ./2000 dan KEP-170/PJ./2002) serta rujukan akurat.

- [x] **3.9 PMK 81/2024 & PMK 141/2015 (Unifikasi PPh 23 Era Coretax)** (`src/rules/pph23/pmk81_2024_coretax.ts`)
  - **Regime ID / Article ID**: `pph23_pmk81_2024` / `pph23-pmk81-2024`
  - **Periode Berlaku**: `1 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_81_2024`, `SRC.PMK_141_2015`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit (Diperbaiki)**: Bug perhitungan pada `dividen_badan` (yang semula menghitung 15%/30% padahal dikecualikan dari objek PPh 23) telah diperbaiki menjadi **0%** tanpa sanksi non-NPWP sesuai UU HPP/UU CK, beserta pembaruan tampilan opsi NIK/NPWP 16 digit dan tenggat setor tanggal 15 era Coretax PMK 81/2024.

- [x] **3.10 PBDR 1970 — UU Nomor 10 Tahun 1970 (Pra-1984)** (`src/rules/pph23/pbdr_1970.ts`)
  - **Regime ID / Article ID**: `pph23_pbdr_1970` / `pph23-pbdr-1970`
  - **Periode Berlaku**: `1970 – 31 Desember 1983 (Digantikan PPh 23 & 26 UU 7/1983)`
  - **`sources`**: `SRC.UU_10_1970_PBDR`, `SRC.UU_7_1983`
  - **Hasil Audit**: Sejarah Pajak atas Bunga, Dividen, dan Royalty (PBDR) tarif tunggal 20% pra-1984 sebelum berlakunya PPh Pasal 23 tarif 15% dalam UU 7/1983 akurat.

- [x] **3.11 PP 55/2022 & Pasal 23 ayat (4) UU PPh (Suket UMKM 0,5% & Pengecualian Pemotongan)** (`src/rules/pph23/pp55_2022_suket_pengecualian.ts`)
  - **Regime ID / Article ID**: `pph23_suket_pengecualian` / `pph23-suket-pengecualian`
  - **Periode Berlaku**: `1 Juli 2018 – Sekarang (Disesuaikan PP 55/2022 & PP 20/2026)`
  - **`sources`**: `SRC.PP_55_2022`, `SRC.PP_20_2026`, `SRC.PMK_141_2015`, `SRC.PMK_81_2024`
  - **Hasil Audit**: Substitusi pemotongan PPh 23 2% menjadi PPh Final UMKM 0,5% saat rekanan menyerahkan Surat Keterangan (Suket) PP 55/2022/PP 20/2026 serta pembebasan 0% atas penghasilan yang dikecualikan oleh Pasal 23 ayat (4) UU PPh akurat.

---

## 4. PPh Pasal 4(2) Final (`pph4_2` — 17 Aturan)

- [x] **4.1 PP 9/2022, PP 34/2017 & PP 34/2016** (`src/rules/pph4_2/pp9_2022.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp9_2022` / `pph4-2-pp9-2022`
  - **Periode Berlaku**: `21 Februari 2022 – Sekarang`
  - **`sources`**: `SRC.PP_9_2022`, `SRC.PP_34_2017`, `SRC.PP_34_2016`
  - **Hasil Audit**: Tarif konstruksi PP 9/2022 (1,75% kecil bersertifikat, 2,65% menengah/besar, 4% tanpa SBU, 3,5% konsultansi SBU, 6% konsultansi non-SBU), sewa tanah/bangunan 10% (PP 34/2017), PHTB 2,5% (PP 34/2016), dan `sources` lengkap serta akurat.

- [x] **4.2 PP 34/2016, PP 51/2008 & PP 34/2017** (`src/rules/pph4_2/pp34_2016.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp34_2016` / `pph4-2-pp34-2016`
  - **Periode Berlaku**: `7 September 2016 – 20 Februari 2022`
  - **`sources`**: `SRC.PP_34_2016`, `SRC.PP_34_2017`, `SRC.PP_51_2008`
  - **Hasil Audit**: Penurunan PHTB 5% -> 2,5% sejak 7 September 2016 (PP 34/2016), tarif konstruksi PP 51/2008 (2/3/4/6%), sewa 10%, dan `sources` akurat.

- [x] **4.3 PP 51/2008, PP 5/2002 & PP 71/2008** (`src/rules/pph4_2/pp51_2008.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp51_2008` / `pph4-2-pp51-2008`
  - **Periode Berlaku**: `1 Januari 2008 – 6 September 2016`
  - **`sources`**: `SRC.PP_51_2008`, `SRC.PP_40_2009`, `SRC.PP_71_2008`, `SRC.PP_5_2002`
  - **Hasil Audit**: Tarif PP 51/2008 jo. PP 40/2009 (2/3/4/6%), sewa 10% (PP 5/2002), PHTB 5% final (PP 71/2008), dan `sources` akurat.

- [x] **4.4 PP 140/2000, PP 5/2002 & PP 79/1999** (`src/rules/pph4_2/pp140_2000.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp140_2000` / `pph4-2-pp140-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 31 Desember 2007`
  - **`sources`**: `SRC.PP_140_2000`, `SRC.PP_5_2002`, `SRC.PP_79_1999`, `SRC.PP_48_1994`
  - **Hasil Audit**: Tarif konstruksi PP 140/2000 (2% pelaksanaan / 4% perencanaan-pengawasan, termasuk catatan perlakuan non-final bagi kualifikasi besar sebelum PP 51/2008), sewa 10%, PHTB 5%, dan `sources` akurat.

- [x] **4.5 PP 29/1996 (Sewa), PP 73/1996 (Konstruksi) & PP 48/1994** (`src/rules/pph4_2/pp29_1996.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp29_1996` / `pph4-2-pp29-1996-pp140-2000`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.PP_29_1996`, `SRC.PP_73_1996`, `SRC.PP_48_1994`, `SRC.PP_27_1996`
  - **Hasil Audit**: Sewa 6% (WP Badan pra-PP 5/2002) dan 10% (WP OP), konstruksi 2%/4% (PP 73/1996), PHTB 5% (PP 48/1994 jo. PP 27/1996), dan `sources` akurat.

- [x] **4.6 PP 131/2000 jo. PP 123/2015 (Bunga Deposito, Tabungan, & DHE)** (`src/rules/pph4_2/pp131_2000_deposito.ts`)
  - **Regime ID / Article ID**: `pph4_2_deposito_pp131_2000` / `pph4-2-pp131-2000-deposito`
  - **Periode Berlaku**: `1 Januari 2001 – Sekarang (DHE Berlaku 2015)`
  - **`sources`**: `SRC.PP_131_2000`, `SRC.PP_123_2015`, `SRC.PP_51_1994`
  - **Hasil Audit**: Tarif final 20% reguler (dibanding 15% historis PP 51/1994), pengecualian pokok <= Rp 7,5 juta, serta tarif progresif turun untuk Devisa Hasil Ekspor (DHE) IDR (7,5%/5%/0%) dan USD (10%/7,5%/2,5%/0%) akurat.

- [x] **4.7 PP 91/2021 jo. PP 16/2009 & PP 139/2000 (Bunga Obligasi WPDN)** (`src/rules/pph4_2/pp91_2021_obligasi.ts`)
  - **Regime ID / Article ID**: `pph4_2_obligasi_pp91_2021` / `pph4-2-pp91-2021-obligasi`
  - **Periode Berlaku**: `30 Agustus 2021 – Sekarang`
  - **`sources`**: `SRC.PP_91_2021`, `SRC.PP_55_2019`, `SRC.PP_16_2009`, `SRC.PP_139_2000`
  - **Hasil Audit**: Penurunan PPh Final bunga/diskonto obligasi WPDN & BUT menjadi 10% di PP 91/2021 (dibandingkan 15%/5% reksadana era PP 16/2009 jo. PP 55/2019 dan 20% era PP 139/2000) akurat.

- [x] **4.8 PP 41/1994 jo. PP 14/1997 (Penjualan Saham di Bursa Efek)** (`src/rules/pph4_2/pp41_1994_saham.ts`)
  - **Regime ID / Article ID**: `pph4_2_saham_pp41_1994` / `pph4-2-pp41-1994-saham`
  - **Periode Berlaku**: `1 Januari 1995 – Sekarang (Saham Pendiri +0,5% mulai 29 Mei 1997)`
  - **`sources`**: `SRC.PP_41_1994`, `SRC.PP_14_1997`, `SRC.UU_36_2008`
  - **Hasil Audit**: Tarif final 0,1% dari nilai bruto transaksi penjualan saham di bursa efek serta tambahan 0,5% khusus saham pendiri (PP 14/1997) akurat.

- [x] **4.9 UU Cipta Kerja / HPP & PMK 18/2021 (vs PP 19/2009 Dividen WP OP 10%)** (`src/rules/pph4_2/pp19_2009_dividen_op.ts`)
  - **Regime ID / Article ID**: `pph4_2_dividen_op` / `pph4-2-dividen-op`
  - **Periode Berlaku**: `2 November 2020 – Sekarang (PP 19/2009: 2009–2020)`
  - **`sources`**: `SRC.UU_7_2021_HPP`, `SRC.UU_6_2023_CK`, `SRC.PMK_18_2021`, `SRC.PP_19_2009`
  - **Hasil Audit**: Pengecualian objek PPh (0%) atas dividen dalam negeri bagi WP OP bila diinvestasikan minimal 3 tahun di Indonesia (PMK 18/2021), vs tarif final 10% bila tidak direinvestasikan (atau era PP 19/2009), akurat.

- [x] **4.10 PP 132/2000 (Hadiah Undian 25%) & PP 15/2009 (Bunga Simpanan Koperasi)** (`src/rules/pph4_2/pp132_2000_undian_koperasi.ts`)
  - **Regime ID / Article ID**: `pph4_2_undian_koperasi` / `pph4-2-undian-koperasi`
  - **Periode Berlaku**: `1 Januari 2001 – Sekarang (Koperasi sejak 1 Januari 2009)`
  - **`sources`**: `SRC.PP_132_2000`, `SRC.PP_42_1994`, `SRC.PP_15_2009`
  - **Hasil Audit**: Tarif final 25% hadiah undian (naik dari 20% PP 42/1994) serta tarif 0% (bunga koperasi <= Rp 240 ribu/bulan) / 10% seluruh bunga (> Rp 240 ribu/bulan) PP 15/2009 akurat.

- [x] **4.11 PP 34/2016 (PHTB Rumah Sederhana 1%, Kepentingan Umum 0%, & Umum 2,5%)** (`src/rules/pph4_2/pp34_2016_phtb_khusus.ts`)
  - **Regime ID / Article ID**: `pph4_2_phtb_khusus` / `pph4-2-phtb-khusus`
  - **Periode Berlaku**: `7 September 2016 – Sekarang`
  - **`sources`**: `SRC.PP_34_2016`, `SRC.PP_71_2008`, `SRC.PP_48_1994`
  - **Hasil Audit**: Pemisahan akurat 3 tarif PPh Final pengalihan hak atas tanah dan/atau bangunan Pasal 2 ayat (1) PP 34/2016: 2,5% umum, 1% Rumah Sederhana/Rusun Sederhana oleh pengembang pokok, dan 0% pengalihan kepada pemerintah/BUMN/BUMD penugasan khusus kepentingan umum.

- [x] **4.12 PP 27/2008 (Diskonto SPN 20%) & DHE SDA (PP 36/2023 jo. PP 8/2025)** (`src/rules/pph4_2/pp27_2008_spn_dhe.ts`)
  - **Regime ID / Article ID**: `pph4_2_spn_pp27_2008` / `pph4-2-spn-pp27-2008`
  - **Periode Berlaku**: `2008 – Sekarang (DHE SDA 100% 12 Bln Berlaku 1 Mar 2025)`
  - **`sources`**: `SRC.PP_27_2008`, `SRC.PP_8_2025`, `SRC.PP_36_2023`, `SRC.PP_123_2015`
  - **Hasil Audit**: Tarif PPh Final 20% atas diskonto Surat Perbendaharaan Negara (PP 27/2008) serta integrasi rezim terbaru penempatan DHE SDA 100% selama 12 bulan bagi non-migas (PP 8/2025, efektif 1 Maret 2025) vs 30% selama 3 bulan bagi migas (PP 36/2023) dengan fasilitas 0% bunga deposito DHE > 6 bulan akurat.

- [x] **4.13 PP 40/2016 (PPh Final Pengalihan Real Estat ke KIK-DIRE 0,5%)** (`src/rules/pph4_2/pp40_2016_dire.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp40_2016_dire` / `pph4-2-pp40-2016-dire`
  - **Periode Berlaku**: `17 Oktober 2016 – Sekarang`
  - **`sources`**: `SRC.PP_40_2016`, `SRC.PP_34_2016`, `SRC.UU_36_2008`
  - **Hasil Audit**: Tarif preferensial PPh Final 0,5% dari nilai bruto pengalihan aset real estat kepada Special Purpose Company (SPC) atau KIK dalam skema Dana Investasi Real Estat (DIRE) akurat.

- [x] **4.14 PP 4/1995 (PPh Final Penjualan Saham Perusahaan Modal Ventura 0,1%)** (`src/rules/pph4_2/pp4_1995_ventura.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp4_1995_ventura` / `pph4-2-pp4-1995-ventura`
  - **Periode Berlaku**: `1 Januari 1995 – Sekarang`
  - **`sources`**: `SRC.PP_4_1995`, `SRC.PP_41_1994`, `SRC.UU_10_1994`
  - **Hasil Audit**: Tarif final 0,1% dari nilai transaksi bruto penjualan saham perusahaan pasangan usaha (UMKM/non-tbk paling lama 10 tahun) oleh Perusahaan Modal Ventura akurat.

- [x] **4.15 PP 51/1994 & PP 42/1994 (Deposito 15% & Undian 20% Era 1994–2000)** (`src/rules/pph4_2/pp51_1994_historis.ts`)
  - **Regime ID / Article ID**: `pph4_2_pp51_1994_historis` / `pph4-2-pp51-1994-historis`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.PP_51_1994`, `SRC.PP_42_1994`, `SRC.PP_131_2000`, `SRC.PP_132_2000`
  - **Hasil Audit**: Tarif historis bunga deposito/tabungan 15% (PP 51/1994 sebelum naik menjadi 20% di PP 131/2000) dan hadiah undian 20% (PP 42/1994 sebelum naik menjadi 25% di PP 132/2000) akurat.

- [x] **4.16 PMK 79/2008 (10% Reguler) & PMK 191/2015 jo. PMK 233/2015 (Revaluasi Aktiva Tetap)** (`src/rules/pph4_2/pmk191_2015_revaluasi.ts`)
  - **Regime ID / Article ID**: `pph4_2_pmk191_2015_revaluasi` / `pph4-2-pmk191-2015-revaluasi`
  - **Periode Berlaku**: `23 Mei 2008 – Sekarang (Insentif Khusus Okt 2015 – Des 2016)`
  - **`sources`**: `SRC.PMK_79_2008`, `SRC.PMK_191_2015`, `SRC.PMK_233_2015`
  - **Hasil Audit**: Tarif final 10% reguler (`PMK 79/2008`) atas selisih lebih penilaian kembali aktiva tetap (Nilai Pasar Wajar dikurangi Nilai Sisa Buku Fiskal) beserta insentif diskon sementara 3%/4%/6% pada Paket Kebijakan Ekonomi V (`PMK 191/2015` jo. `PMK 233/2015`) akurat.

- [x] **4.17 UU 11/2016 (Tax Amnesty 2016–2017) & PMK 196/2021 (PPS 2022)** (`src/rules/pph4_2/pps_tax_amnesty.ts`)
  - **Regime ID / Article ID**: `pph4_2_pps_tax_amnesty` / `pph4-2-pps-tax-amnesty`
  - **Periode Berlaku**: `1 Juli 2016 – 31 Maret 2017 (TA) & 1 Januari – 30 Juni 2022 (PPS)`
  - **`sources`**: `SRC.UU_11_2016`, `SRC.PMK_118_2016`, `SRC.UU_7_2021_HPP`, `SRC.PMK_196_2021`
  - **Hasil Audit**: Lengkap memuat seluruh 14 lapisan tarif historis Uang Tebusan Tax Amnesty 2016–2017 (2/3/5% DN/Repatriasi, 4/6/10% LN, 0,5/2% UMKM) serta PPh Final PPS Kebijakan I (6/8/11%) & Kebijakan II OP (12/14/18%) sesuai UU HPP jo. PMK 196/2021.

---

## 5. PPh Final UMKM (`pph_umkm` — 8 Aturan)

- [x] **5.1 PP 20/2026 (Perubahan PP 55/2022)** (`src/rules/pph_umkm/pp20_2026.ts`)
  - **Regime ID / Article ID**: `umkm_pp20_2026` / `umkm-pp20-2026`
  - **Periode Berlaku**: `22 April 2026 – Sekarang`
  - **`sources`**: `SRC.PP_20_2026`, `SRC.PP_20_2026_SETNEG`, `SRC.PP_20_2026_BPK`, `SRC.PP_55_2022`
  - **Hasil Audit**: Sesuai PP 20/2026 (berlaku 22 April 2026): pencabutan Pasal 59 (hapus batas jangka waktu 7 tahun OP), cakupan OP/PT Perorangan/Koperasi (maks 4 thn), pengecualian CV/Firma/PT umum & pekerjaan bebas, kuota bebas Rp 500 jt untuk OP, dan aturan anti-fragmentasi omzet pihak terkait terhadap plafon Rp 4,8 M.

- [x] **5.2 PP 55/2022 & UU HPP** (`src/rules/pph_umkm/pp55_2022.ts`)
  - **Regime ID / Article ID**: `umkm_pp55_2022` / `umkm-pp55-2022`
  - **Periode Berlaku**: `1 Januari 2022 – 21 April 2026`
  - **`sources`**: `SRC.PP_55_2022`, `SRC.PP_55_2022_SETNEG`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Tarif 0,5% serta bagian peredaran bruto tidak kena pajak s.d. Rp 500 juta setahun bagi WP OP sesuai Pasal 7 ayat (2a) UU HPP & PP 55/2022 akurat.

- [x] **5.3 PP Nomor 23 Tahun 2018** (`src/rules/pph_umkm/pp23_2018.ts`)
  - **Regime ID / Article ID**: `umkm_pp23_2018` / `umkm-pp23-2018`
  - **Periode Berlaku**: `1 Juli 2018 – 31 Desember 2021`
  - **`sources`**: `SRC.PP_23_2018`, `SRC.PP_46_2013`
  - **Hasil Audit**: Tarif 0,5% dari omzet bulanan tanpa ambang bebas Rp 500 juta OP serta masa waktu 7/4/3 tahun akurat.

- [x] **5.4 PP Nomor 46 Tahun 2013** (`src/rules/pph_umkm/pp46_2013.ts`)
  - **Regime ID / Article ID**: `umkm_pp46_2013` / `umkm-pp46-2013`
  - **Periode Berlaku**: `1 Juli 2013 – 30 Juni 2018`
  - **`sources`**: `SRC.PP_46_2013`, `SRC.PP_23_2018`
  - **Hasil Audit**: Tarif 1% omzet <= Rp 4,8 M/tahun dan pengecualian pekerjaan bebas/usaha sarana tidak tetap akurat.

- [x] **5.5 PMK 44/2020 jo. PMK 86/2020 & PMK 9/2021 (PPh Final UMKM DTP COVID-19)** (`src/rules/pph_umkm/pmk44_2020_dtp.ts`)
  - **Regime ID / Article ID**: `umkm_pmk44_2020_dtp` / `pph-umkm-pmk44-2020-dtp`
  - **Periode Berlaku**: `Masa Pajak April 2020 – Desember 2021`
  - **`sources`**: `SRC.PMK_44_2020`, `SRC.PMK_86_2020`, `SRC.PMK_110_2020`, `SRC.PMK_9_2021`, `SRC.PMK_82_2021`
  - **Hasil Audit**: Pembebasan 100% PPh Final UMKM 0,5% melalui skema Ditanggung Pemerintah (DTP) sepanjang April 2020–Desember 2021 untuk omzet tahunan <= Rp 4,8 miliar dan kelengkapan pelaporan realisasi bulanan akurat.

- [x] **5.6 KEP-536/PJ./2000 & PER-17/PJ/2015 (Norma Penghitungan Penghasilan Neto — NPPN)** (`src/rules/pph_umkm/nppn_pra2013.ts`)
  - **Regime ID / Article ID**: `umkm_nppn_pra2013` / `pph-umkm-nppn`
  - **Periode Berlaku**: `2001 – Sekarang (Wajib bagi Pekerjaan Bebas & Pengusaha Pra-2013)`
  - **`sources`**: `SRC.PER_17_PJ_2015`, `SRC.KEP_536_PJ_2000`, `SRC.PP_55_2022`, `SRC.UU_36_2008`
  - **Hasil Audit**: Mekanisme penghitungan PPh OP non-final bagi pekerja bebas dan WP OP pra-PP 46/2013: omzet × persentase norma NPPN − PTKP lalu dikenai lapisan progresif Pasal 17 akurat.

- [x] **5.7 Transisi UMKM Badan PP 20/2026 (0,5% Final vs Tarif 11% Pasal 31E)** (`src/rules/pph_umkm/pp20_2026_transisi_badan.ts`)
  - **Regime ID / Article ID**: `umkm_pp20_2026_transisi` / `umkm-pp20-2026-transisi`
  - **Periode Berlaku**: `22 April 2026 – Sekarang (Akhir Masa Transisi CV/PT)`
  - **`sources`**: `SRC.PP_20_2026`, `SRC.PP_55_2022`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Pemodelan titik impas (break-even margin laba ~4,55%) dan simulasi perbandingan beban pajak tahunan bagi WP Badan (CV/Firma/PT) saat beralih dari PPh Final 0,5% omzet ke tarif normal Pasal 31E (11% laba neto) sesuai PP 20/2026 akurat.

- [x] **5.8 PMK 164 Tahun 2023 (Suket UMKM 0,5%, Surat Pernyataan Rp 500 Jt, & Relaksasi PKP)** (`src/rules/pph_umkm/pmk164_2023_suket.ts`)
  - **Regime ID / Article ID**: `umkm_pmk164_2023_suket` / `umkm-pmk164-2023-suket`
  - **Periode Berlaku**: `29 Desember 2023 – Sekarang`
  - **`sources`**: `SRC.PMK_164_2023`, `SRC.PP_55_2022`, `SRC.PMK_197_2013`
  - **Hasil Audit**: Skema operasional pemotongan pihak ketiga (Suket valid 0,5%, tanpa Suket 2% PPh 23, OP kuota <= Rp 500 jt dengan Surat Pernyataan 0%) serta reformasi tenggat lapor PKP saat omzet melewati Rp 4,8 miliar menjadi paling lambat akhir tahun buku (PPN mulai tahun buku berikutnya) akurat.

---

## 6. PPh Pasal 25 (`pph25` — 13 Aturan)

- [x] **6.1 Pasal 25 UU PPh jo. PMK 81 Tahun 2024** (`src/rules/pph25/pmk81_2024.ts`)
  - **Regime ID / Article ID**: `pph25_pmk81_2024` / `pph25-pmk81-2024`
  - **Periode Berlaku**: `1 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_81_2024`, `SRC.UU_7_2021_HPP`, `SRC.KEP_537_2000_DJP`
  - **Hasil Audit (Diperbaiki)**: Output catatan kalkulator telah diubah dari `"sesuai PMK 215/PMK.03/2018"` menjadi `"sesuai Pasal 226–237 PMK 81 Tahun 2024"`. Rumus angsuran `(PPh terutang - kredit pajak) / 12` dan rujukan akurat.

- [x] **6.2 Pasal 25 UU PPh, KEP-537/2000 & PMK 215/2018** (`src/rules/pph25/pmk215_2018.ts`)
  - **Regime ID / Article ID**: `pph25_pmk215_2018` / `pph25-pmk215-2018`
  - **Periode Berlaku**: `31 Desember 2018 – 31 Desember 2024`
  - **`sources`**: `SRC.PMK_215_2018`, `SRC.KEP_537_2000_DJP`, `SRC.UU_36_2008`
  - **Hasil Audit**: Rujukan, periode berlaku, dan mekanisme angsuran bulanan 1/12 sesuai Pasal 25 UU PPh jo. PMK 215/2018 akurat.

- [x] **6.3 PMK 110/2020, PMK 9/2021 & PMK 82/2021 (Diskon 50%)** (`src/rules/pph25/pmk9_2021.ts`)
  - **Regime ID / Article ID**: `pph25_pmk9_2021` / `pph25-pmk9-2021`
  - **Periode Berlaku**: `Masa Pajak Juli 2020 – Desember 2021`
  - **`sources`**: `SRC.PMK_110_2020`, `SRC.PMK_9_2021`, `SRC.PMK_82_2021`, `SRC.PMK_86_2020`
  - **Hasil Audit**: Diskon pengurangan angsuran 50% (diperluas dari 30% era PMK 23/44/86 ke 50% mulai PMK 110/2020 s.d. PMK 82/2021) dan `sources` utama akurat.

- [x] **6.4 KMK 522/2000 jo. PMK 255/2008 & PMK 208/2009 (Angsuran PPh 25 OPPT 0,75%)** (`src/rules/pph25/kmk522_2000_oppt.ts`)
  - **Regime ID / Article ID**: `pph25_kmk522_2000_oppt` / `pph25-kmk522-2000-oppt`
  - **Periode Berlaku**: `1 Januari 2001 – Sekarang (OPPT 0,75% Omzet)`
  - **`sources`**: `SRC.PMK_208_2009`, `SRC.PMK_255_2008`, `SRC.KMK_522_2000`, `SRC.PMK_215_2018`
  - **Hasil Audit**: Rumus angsuran PPh Pasal 25 khusus Wajib Pajak Orang Pribadi Pengusaha Tertentu (OPPT, gerai perdagangan eceran) sebesar 0,75% × omzet bulanan per tempat usaha sebagai kredit pajak tidak final akurat.

- [x] **6.5 PMK 23/2020, PMK 44/2020 & PMK 110/2020 (Diskon PPh 25 30% -> 50%)** (`src/rules/pph25/pmk23_2020_diskon30.ts`)
  - **Regime ID / Article ID**: `pph25_pmk23_2020` / `pph25-pmk23-2020`
  - **Periode Berlaku**: `Masa Pajak April 2020 – Desember 2021`
  - **`sources`**: `SRC.PMK_23_2020`, `SRC.PMK_44_2020`, `SRC.PMK_86_2020`, `SRC.PMK_110_2020`, `SRC.PMK_9_2021`
  - **Hasil Audit**: Evolusi diskon angsuran 30% (PMK 23/44/86 Tahun 2020) hingga 50% (PMK 110/2020) serta label rasio pembayaran `Porsi angsuran yang disetor` telah diverifikasi akurat.

- [x] **6.6 PP 80/2008 (Fiskal Luar Negeri — Dihapus 1 Januari 2011)** (`src/rules/pph25/pp80_2008_fln.ts`)
  - **Regime ID / Article ID**: `pph25_pp80_2008_fln` / `pph25-pp80-2008-fln`
  - **Periode Berlaku**: `1 Januari 2009 – 31 Desember 2010 (Berakhir 1 Jan 2011)`
  - **`sources`**: `SRC.PP_80_2008`, `SRC.UU_36_2008`
  - **Hasil Audit**: Tarif Fiskal Luar Negeri sebagai angsuran Pasal 25 ayat (8) UU PPh sebelum dihapus: Rp 2,5 juta (pesawat udara), Rp 1 juta (kapal laut), dan Rp 0 bagi pemegang NPWP akurat.

- [x] **6.7 KEP-537/PJ./2000 & PMK 255/2008 (Angsuran Hal-Hal Tertentu 2001–2018)** (`src/rules/pph25/kep537_2000.ts`)
  - **Regime ID / Article ID**: `pph25_kep537_2000` / `pph25-kep537-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 30 Desember 2018`
  - **`sources`**: `SRC.KEP_537_2000_DJP`, `SRC.PMK_255_2008`, `SRC.PMK_215_2018`
  - **Hasil Audit**: Ketentuan pengurangan angsuran PPh 25 apabila proyeksi pajak turun > 25% setelah 3 bulan masa pajak serta formula 1/12 dasar reguler tahun 2001–2018 sebelum PMK 215/2018 akurat.

- [x] **6.8 Pasal 25 UU 7/1983 & UU 10/1994 (Fondasi Angsuran Bulanan 1984–2000)** (`src/rules/pph25/uu7_1983.ts`)
  - **Regime ID / Article ID**: `pph25_uu7_1983` / `pph25-uu7-1983`
  - **Periode Berlaku**: `1 Januari 1984 – 31 Desember 2000`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.UU_10_1994`, `SRC.KEP_537_2000_DJP`
  - **Hasil Audit**: Rantai historis angsuran bulanan PPh Pasal 25 era awal self-assessment (1984–2000) menggantikan sistem MPS 1967 akurat.

- [x] **6.9 PP 42/2000 (Fiskal Luar Negeri Rp 1 Jt / Rp 500 Rb — Era 2000–2008)** (`src/rules/pph25/pp42_2000_fln.ts`)
  - **Regime ID / Article ID**: `pph25_pp42_2000_fln` / `pph25-pp42-2000-fln`
  - **Periode Berlaku**: `23 Juni 2000 – 31 Desember 2008`
  - **`sources`**: `SRC.PP_42_2000`, `SRC.PP_80_2008`, `SRC.UU_17_2000`
  - **Hasil Audit (Diperbaiki)**: Tanggal mulai berlaku PP Nomor 42 Tahun 2000 pada `effectivePeriod` dan `effectiveDate` telah dikoreksi dari `1 Juli 2000` menjadi **23 Juni 2000** sesuai tanggal penetapan/pengundangan resmi. Tarif Rp 1 juta (pesawat) & Rp 500 ribu (kapal laut) tanpa bebas NPWP akurat.

- [x] **6.10 PMK 215/PMK.03/2018 (Angsuran PPh 25 WP Tertentu: Bank, BUMN/BUMD, & Emiten)** (`src/rules/pph25/pmk215_2018_wp_tertentu.ts`)
  - **Regime ID / Article ID**: `pph25_pmk215_2018_bank_bumn` / `pph25-pmk215-2018-wp-tertentu`
  - **Periode Berlaku**: `31 Desember 2018 – Sekarang`
  - **`sources`**: `SRC.PMK_215_2018`, `SRC.PMK_81_2024`, `SRC.UU_36_2008`
  - **Hasil Audit**: Formula khusus angsuran WP Tertentu PMK 215/2018 (Bank berbasis laporan keuangan triwulanan OJK yang disetahunkan × 22%, Emiten berbasis laporan berkala bursa 6 bulanan, dan BUMN/BUMD berbasis RKAP) akurat.

- [x] **6.11 UU 8/1967 jo. PP 11/1967 (Menghitung Pajak Sendiri / MPS Pra-1984)** (`src/rules/pph25/mps_uu8_1967.ts`)
  - **Regime ID / Article ID**: `pph25_mps_uu8_1967` / `pph25-mps-uu8-1967`
  - **Periode Berlaku**: `26 Agustus 1967 – 31 Desember 1983`
  - **`sources`**: `SRC.UU_8_1967`, `SRC.PP_11_1967`, `SRC.UU_7_1983`
  - **Hasil Audit**: Jejak historis sistem Menghitung Pajak Sendiri (MPS) era pra-1984 sesuai UU 8/1967 jo. PP 11/1967 sebagai cikal bakal angsuran PPh Pasal 25 akurat.

- [x] **6.12 PP 46/1994 & PP 17/1998 (Fiskal Luar Negeri 1995–2000)** (`src/rules/pph25/pp46_1994_fln.ts`)
  - **Regime ID / Article ID**: `pph25_pp46_1994_fln` / `pph25-pp46-1994-fln`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.PP_46_1994`, `SRC.PP_17_1998`, `SRC.PP_42_2000`, `SRC.PP_80_2008`
  - **Hasil Audit**: Tarif historis Fiskal Luar Negeri pra-2000: PP 46/1994 (Rp 250 rb udara / Rp 100 rb laut / Rp 50 rb darat) dan kenaikan era krismon PP 17/1998 (Rp 1 jt udara / Rp 500 rb laut / Rp 200 rb darat) akurat.

- [x] **6.13 PMK 215/2018 & Pasal 25(2) UU PPh jo. PMK 81/2024 (WP Baru Nihil, Masa Sebelum SPT, & Merger)** (`src/rules/pph25/pmk81_2024_wp_baru_transisi.ts`)
  - **Regime ID / Article ID**: `pph25_pmk81_2024_wp_baru_transisi` / `pph25-pmk81-2024-wp-baru-transisi`
  - **Periode Berlaku**: `31 Desember 2018 – Sekarang (Jatuh Tempo Tgl 15)`
  - **`sources`**: `SRC.PMK_215_2018`, `SRC.PMK_81_2024`, `SRC.KEP_537_2000_DJP`
  - **Hasil Audit**: Penetapan angsuran PPh 25 Nihil (Rp 0) bagi Wajib Pajak Baru umum (Pasal 10 PMK 215/2018), pemakaian angka bulan Desember tahun lalu pada masa sebelum batas SPT Tahunan (Pasal 25 ayat 2 UU PPh), akumulasi angsuran peserta merger, serta pengecualian OPPT baru 0,75% akurat.

---

## 7. PPh Pasal 26 (`pph26` — 12 Aturan)

- [x] **7.1 Pasal 26 UU PPh jo. PP 9/2021, PMK 81/2024 & PMK 112/2025** (`src/rules/pph26/pp9_2021_p3b.ts`)
  - **Regime ID / Article ID**: `pph26_pp9_2021` / `pph26-pp9-2021`
  - **Periode Berlaku**: `2 Agustus 2021 – Sekarang (P3B: PMK 112/2025 per 30 Des 2025)`
  - **`sources`**: `SRC.PP_9_2021`, `SRC.PMK_112_2025`, `SRC.PER_25_PJ_2018_DJP`, `SRC.PMK_81_2024`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Penurunan tarif bunga obligasi WPLN menjadi 10% final (PP 9/2021), pembaruan tata cara P3B ke PMK 112/2025 per 30 Desember 2025 (mencabut PER-25/PJ/2018), serta premi asuransi LN 50%/10%/5% × 20% akurat.

- [x] **7.2 UU 36/2008 & PP 16/2009 (Pra-PP 9/2021)** (`src/rules/pph26/uu36_2008.ts`)
  - **Regime ID / Article ID**: `pph26_uu36_2008` / `pph26-uu36-2008`
  - **Periode Berlaku**: `1 Januari 2009 – 1 Agustus 2021`
  - **`sources`**: `SRC.UU_36_2008`, `SRC.PP_16_2009`, `SRC.KMK_624_1994`
  - **Hasil Audit**: Tarif 20% bunga obligasi WPLN pra-PP 9/2021, opsi tarif P3B (default SKD 15%), dan tarif asuransi LN KMK 624/1994 akurat.

- [x] **7.3 UU 10/1994 & UU 17/2000 (Pasal 26)** (`src/rules/pph26/uu10_1994.ts`)
  - **Regime ID / Article ID**: `pph26_uu10_1994` / `pph26-uu10-1994`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2008`
  - **`sources`**: `SRC.UU_10_1994`, `SRC.UU_17_2000`, `SRC.KMK_624_1994`
  - **Hasil Audit**: Tarif dasar 20%, penerbitan norma premi asuransi LN dalam KMK 624/1994 (efektif 10%/2%/1%), dan P3B akurat.

- [x] **7.4 UU Nomor 7 Tahun 1983 (Pasal 26)** (`src/rules/pph26/uu7_1983.ts`)
  - **Regime ID / Article ID**: `pph26_uu7_1983` / `pph26-uu7-1983`
  - **Periode Berlaku**: `1 Januari 1984 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.UU_10_1994`
  - **Hasil Audit**: Tarif tunggal 20% final Pasal 26 UU 7/1983 dan rujukan akurat.

- [x] **7.5 PER-61/PJ/2009 jo. PER-25/PJ/2018 & PMK 112/2025 (Penerapan SKD P3B)** (`src/rules/pph26/per61_2009_skd.ts`)
  - **Regime ID / Article ID**: `pph26_per61_2009_skd` / `pph26-per61-2009-skd`
  - **Periode Berlaku**: `1 Januari 2010 – Sekarang (Pembaruan Coretax PMK 112/2025)`
  - **`sources`**: `SRC.PMK_112_2025`, `SRC.PER_25_PJ_2018_DJP`, `SRC.PER_61_PJ_2009`
  - **Hasil Audit**: Penerapan Surat Keterangan Domisili (Form DGT) sebagai prasyarat mutlak penggunaan tarif treaty P3B dibanding fallback tarif domestik 20% apabila tanpa SKD sah akurat.

- [x] **7.6 PMK 14/PMK.03/2011 (Branch Profit Tax / Pasal 26 ayat 4 BUT)** (`src/rules/pph26/pmk14_2011_bpt.ts`)
  - **Regime ID / Article ID**: `pph26_pmk14_2011_bpt` / `pph26-pmk14-2011-bpt`
  - **Periode Berlaku**: `24 Januari 2011 – Sekarang`
  - **`sources`**: `SRC.PMK_14_2011`, `SRC.UU_36_2008`
  - **Hasil Audit**: Pajak atas PKP BUT sesudah dikurangi PPh Badan (tarif 20% atau tarif BPT treaty jika memenuhi SKD) beserta pembebasan 0% apabila seluruh laba ditanamkan kembali di Indonesia sesuai syarat PMK 14/2011 akurat.

- [x] **7.7 PMK 258/PMK.03/2008 (Penjualan Saham / Conduit SPC Pasal 18 ayat 3c)** (`src/rules/pph26/pmk258_2008_saham.ts`)
  - **Regime ID / Article ID**: `pph26_pmk258_2008_saham` / `pph26-pmk258-2008-saham`
  - **Periode Berlaku**: `1 Januari 2009 – Sekarang`
  - **`sources`**: `SRC.PMK_258_2008`, `SRC.UU_36_2008`
  - **Hasil Audit**: Pemotongan PPh 26 atas pengalihan saham perusahaan antara (conduit/SPC) di tax haven yang memiliki perusahaan di Indonesia dengan perkiraan penghasilan neto 25% × tarif 20% (= 5% efektif dari harga jual) akurat.

- [x] **7.8 PMK 82/PMK.03/2009 (PPh 26 Penjualan Harta di Indonesia oleh WPLN — 5%)** (`src/rules/pph26/pmk82_2009_harta.ts`)
  - **Regime ID / Article ID**: `pph26_pmk82_2009_harta` / `pph26-pmk82-2009-harta`
  - **Periode Berlaku**: `1 Januari 2009 – Sekarang`
  - **`sources`**: `SRC.PMK_82_2009`, `SRC.PMK_258_2008`, `SRC.UU_36_2008`
  - **Hasil Audit**: Perkiraan penghasilan neto 25% × tarif 20% (= 5% efektif dari harga jual) atas penjualan/pengalihan harta di Indonesia oleh WPLN selain BUT (perhiasan mewah, jam tangan, barang seni, dll. > Rp 10 juta per transaksi) serta opsi tarif P3B jika ada SKD sah akurat.

- [x] **7.9 PBDR 1970 atas Wajib Pajak Luar Negeri — UU 10/1970 (Pra-1984)** (`src/rules/pph26/pbdr_1970_wpln.ts`)
  - **Regime ID / Article ID**: `pph26_pbdr_1970` / `pph26-pbdr-1970`
  - **Periode Berlaku**: `1970 – 31 Desember 1983 (Digantikan PPh Pasal 26 UU 7/1983)`
  - **`sources`**: `SRC.UU_10_1970_PBDR`, `SRC.UU_7_1983`
  - **Hasil Audit**: Sejarah pemotongan 20% PBDR atas pembayaran bunga/dividen/royalti ke luar negeri sebelum dipecah menjadi PPh Pasal 26 pada UU 7/1983 akurat.

- [x] **7.10 PMK 112/2025 (Penerapan P3B, Uji Beneficial Owner & Principal Purpose Test / Anti-Abuse)** (`src/rules/pph26/pmk112_2025_p3b.ts`)
  - **Regime ID / Article ID**: `pph26_pmk112_2025_p3b` / `pph26-pmk112-2025-p3b`
  - **Periode Berlaku**: `31 Desember 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_112_2025`, `SRC.PP_9_2021`, `SRC.PER_25_PJ_2018_DJP`
  - **Hasil Audit**: Pengujian substansi ekonomi (*substance over form*) Beneficial Owner dan *Principal Purpose Test* (PPT) sesuai PMK 112/2025 (pengganti PER-25/PJ/2018): lolos uji = tarif preferensial P3B, terindikasi *conduit*/gagal PPT = gugur ke tarif domestik 20% akurat.

- [x] **7.11 PMK 35/PMK.03/2019 (Penentuan Bentuk Usaha Tetap / BUT & Time Test 60 Hari)** (`src/rules/pph26/pmk35_2019_but.ts`)
  - **Regime ID / Article ID**: `pph26_pmk35_2019_but` / `pph26-pmk35-2019-but`
  - **Periode Berlaku**: `1 April 2019 – Sekarang`
  - **`sources`**: `SRC.PMK_35_2019`, `SRC.PMK_112_2025`, `SRC.UU_36_2008`
  - **Hasil Audit**: Simulasi pemenuhan ambang *time test* jasa WPLN 60 hari dalam 12 bulan sesuai PMK 35/2019 (di atas 60 hari terbit status BUT: PPh Badan 22% neto + BPT vs <= 60 hari non-BUT dipotong PPh 26/P3B) akurat.

- [x] **7.12 KMK 624/KMK.04/1994 (Premi Asuransi & Reasuransi ke Luar Negeri: 10% / 2% / 1%)** (`src/rules/pph26/kmk624_1994_asuransi.ts`)
  - **Regime ID / Article ID**: `pph26_kmk624_1994_asuransi` / `pph26-kmk624-1994-asuransi`
  - **Periode Berlaku**: `1 Januari 1995 – Sekarang`
  - **`sources`**: `SRC.KMK_624_1994`, `SRC.UU_10_1994`, `SRC.UU_36_2008`
  - **Hasil Audit**: Rumus khusus Pasal 26 ayat (2) UU PPh atas pembayaran premi asuransi/reasuransi ke perusahaan asuransi luar negeri dengan perkiraan penghasilan neto 50% (efektif 10% bila dibayar tertanggung RI), 10% (efektif 2% oleh perusahaan asuransi RI), dan 5% (efektif 1% oleh perusahaan reasuransi RI) beserta opsi P3B akurat.

---

## 8. PPh Pasal 15 (`pph15` — 6 Aturan)

- [x] **8.1 KMK 416/1996, KMK 475/1996 & KMK 417/1996** (`src/rules/pph15/kmk416_1996.ts`)
  - **Regime ID / Article ID**: `pph15_kmk416_1996` / `pph15-pelayaran-penerbangan`
  - **Periode Berlaku**: `1996 – Sekarang (Administrasi PMK 81/2024)`
  - **`sources`**: `SRC.KMK_416_1996`, `SRC.KMK_475_1996`, `SRC.KMK_417_1996_DJP`, `SRC.PMK_81_2024`
  - **Hasil Audit**: Norma penghasilan neto dan tarif efektif masing-masing sektor (pelayaran DN 4% × 30% = 1,2% final; penerbangan DN charter 6% × 30% = 1,8% kredit pajak; pelayaran/penerbangan LN 6% × 44% [2,64% final]) beserta penyesuaian administrasi PMK 81/2024 akurat.

- [x] **8.2 KMK 634/KMK.04/1994 & KEP-667/PJ./2001 (Kantor Perwakilan Dagang Asing 0,44%)** (`src/rules/pph15/kmk634_1994_kpd.ts`)
  - **Regime ID / Article ID**: `pph15_kmk634_1994_kpd` / `pph15-kmk634-1994-kpd`
  - **Periode Berlaku**: `1994 – Sekarang (Pembaruan 0,44% sejak KEP-667/PJ./2001)`
  - **`sources`**: `SRC.KEP_667_PJ_2001`, `SRC.KMK_634_1994`, `SRC.PMK_81_2024`
  - **Hasil Audit**: Norma penghitungan neto 1% dari nilai ekspor bruto dikalikan tarif kombinasi efektif 44% (PPh Badan + Branch Profit Tax) menghasilkan tarif efektif 0,44% final untuk Representative Office (KPD Asing) akurat.

- [x] **8.3 KMK 543/KMK.03/2002 (Norma Khusus Jasa Maklon Mainan Anak 2,1%)** (`src/rules/pph15/kmk543_2002_maklon.ts`)
  - **Regime ID / Article ID**: `pph15_kmk543_2002_maklon` / `pph15-kmk543-2002-maklon`
  - **Periode Berlaku**: `1 Januari 2003 – Sekarang`
  - **`sources`**: `SRC.KMK_543_2002`, `SRC.PMK_81_2024`
  - **Hasil Audit**: Norma khusus WP Badan jasa maklon internasional produksi mainan anak: penghasilan neto 7% × tarif 30% = **2,1% final** dari total biaya pembuatan/perakitan tidak termasuk bahan baku akurat.

- [x] **8.4 KMK 181/KMK.04/1995 (Pelayaran & Penerbangan 1995–1996)** (`src/rules/pph15/kmk181_1995.ts`)
  - **Regime ID / Article ID**: `pph15_kmk181_1995` / `pph15-kmk181-1995`
  - **Periode Berlaku**: `1995 – September 1996`
  - **`sources`**: `SRC.KMK_181_1995`, `SRC.KMK_416_1996`, `SRC.UU_10_1994`
  - **Hasil Audit**: Ketentuan perdana norma Pasal 15 pasca-UU 10/1994 (tarif pelayaran/penerbangan 1995–1996 sebelum dipecah menjadi KMK 416, 417, dan 475 Tahun 1996) akurat.

- [x] **8.5 KMK 628/KMK.04/1991 (Norma Khusus BUT Pengeboran Migas Asing — 15% Neto)** (`src/rules/pph15/kmk628_1991_migas.ts`)
  - **Regime ID / Article ID**: `pph15_kmk628_1991_migas` / `pph15-kmk628-1991-migas`
  - **Periode Berlaku**: `26 Juni 1991 – Sekarang`
  - **`sources`**: `SRC.KMK_628_1991`, `SRC.UU_7_1983`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Tanggal berlaku 26 Juni 1991, norma penghasilan neto 15% dari peredaran bruto kontrak pengeboran migas BUT asing, serta proyeksi PPh Badan 22% (3,3%) + Branch Profit Tax 20% atas laba setelah pajak (2,34%) = 5,64% efektif akurat.

- [x] **8.6 P3B Article 8 & PMK 112/2025 (Pembebasan Resiprokal Pelayaran/Penerbangan Asing)** (`src/rules/pph15/pmk112_2025_resiprokal.ts`)
  - **Regime ID / Article ID**: `pph15_pmk112_2025_resiprokal` / `pph15-pmk112-2025-resiprokal`
  - **Periode Berlaku**: `Berlaku Terkini (Penyelarasan SKD di PMK 112/2025)`
  - **`sources`**: `SRC.PMK_112_2025`, `SRC.KMK_417_1996_DJP`, `SRC.PER_25_PJ_2018_DJP`
  - **Hasil Audit**: Pembebasan resiprokal PPh Pasal 15 (0%) bagi perusahaan pelayaran/penerbangan jalur internasional berbasis *Article 8 Shipping & Air Transport* dalam P3B bila memiliki SKD valid di Coretax/PMK 112/2025 vs fallback tarif 2,64% final tanpa SKD akurat.

---

## 9. PPh Badan (`pph_badan` — 16 Aturan)

- [x] **9.1 UU Nomor 7 Tahun 2021 (HPP)** (`src/rules/pph_badan/hpp2022.ts`)
  - **Regime ID / Article ID**: `badan_hpp_2022` / `pph-badan-31e`
  - **Periode Berlaku**: `Tahun Pajak 2022 – Sekarang`
  - **`sources`**: `SRC.UU_7_2021_HPP`, `SRC.UU_7_2021_SETNEG`, `SRC.UU_36_2008`, `SRC.PMK_81_2024`
  - **Hasil Audit (Diperbaiki & Diselaraskan)**: Helper `shared.ts` telah diperbaiki untuk edge-case `omzet === 0`, dan `hpp2022.ts` kini memuat `SRC.PMK_81_2024` serta bagian pembahasan penyelarasan SPT Tahunan PPh Badan & pengkreditan bukti potong unifikasi era Coretax 2025.

- [x] **9.2 Perppu 1/2020 jo. UU 2/2020** (`src/rules/pph_badan/perppu2020.ts`)
  - **Regime ID / Article ID**: `badan_perppu_2020` / `pph-badan-perppu-2020`
  - **Periode Berlaku**: `Tahun Pajak 2020 – 2021`
  - **`sources`**: `SRC.UU_2_2020`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit (Diperbaiki)**: Edge-case `omzet === 0` pada `shared.ts` telah teratasi. Tarif 22% / 19% Tbk untuk TP 2020–2021 dan rujukan akurat.

- [x] **9.3 UU Nomor 36 Tahun 2008 (TP 2010–2019)** (`src/rules/pph_badan/uu36_2008.ts`)
  - **Regime ID / Article ID**: `badan_uu36_2008` / `pph-badan-uu36-2008`
  - **Periode Berlaku**: `Tahun Pajak 2010 – 2019`
  - **`sources`**: `SRC.UU_36_2008`, `SRC.PP_81_2007`
  - **Hasil Audit (Diperbaiki)**: Edge-case `omzet === 0` pada `shared.ts` telah teratasi dan `legalBasis` rezim serta artikel kini melengkapi `Pasal 17 ayat (1) huruf b, ayat (2a), ayat (2b) & Pasal 31E UU 36/2008`.

- [x] **9.4 UU Nomor 36 Tahun 2008 (TP 2009)** (`src/rules/pph_badan/uu36_2009.ts`)
  - **Regime ID / Article ID**: `badan_uu36_2009` / `pph-badan-uu36-2009`
  - **Periode Berlaku**: `Tahun Pajak 2009`
  - **`sources`**: `SRC.UU_36_2008`, `SRC.PP_81_2007`
  - **Hasil Audit (Diperbaiki)**: Edge-case `omzet === 0` pada `shared.ts` telah teratasi dan `regime.legalBasis` kini mencantumkan `Pasal 31E`. Tarif transisi 28% / 23% Tbk akurat.

- [x] **9.5 UU Nomor 17 Tahun 2000 (Progresif 3 Lapis)** (`src/rules/pph_badan/uu17_2000.ts`)
  - **Regime ID / Article ID**: `badan_uu17_2000` / `pph-badan-uu17-2000`
  - **Periode Berlaku**: `Tahun Pajak 2001 – 2008`
  - **`sources`**: `SRC.UU_17_2000`, `SRC.PP_81_2007`
  - **Hasil Audit**: Lapisan progresif badan 10% (s.d. Rp 50 jt), 15% (Rp 50–100 jt), dan 30% (> Rp 100 jt) serta fasilitas pengurangan tarif 5% untuk WP Badan Tbk pada TP 2008 sesuai PP 81/2007 akurat.

- [x] **9.6 UU Nomor 10 Tahun 1994 (10/15/30%)** (`src/rules/pph_badan/uu10_1994.ts`)
  - **Regime ID / Article ID**: `badan_uu10_1994` / `pph-badan-uu10-1994`
  - **Periode Berlaku**: `Tahun Pajak 1995 – 2000`
  - **`sources`**: `SRC.UU_10_1994`, `SRC.UU_7_1983`
  - **Hasil Audit**: Lapisan 10% (s.d. Rp 25 jt), 15% (Rp 25–50 jt), dan 30% (> Rp 50 jt) serta `sources` akurat.

- [x] **9.7 UU Nomor 7 Tahun 1983 & UU 7/1991** (`src/rules/pph_badan/uu7_1983.ts`)
  - **Regime ID / Article ID**: `badan_uu7_1983` / `pph-badan-uu7-1983`
  - **Periode Berlaku**: `Tahun Pajak 1984 – 1994`
  - **`sources`**: `SRC.UU_7_1983`, `SRC.UU_7_1991`
  - **Hasil Audit**: Lapisan 15% (s.d. Rp 10 jt), 25% (Rp 10–50 jt), dan 35% (> Rp 50 jt) sesuai Pasal 17 ayat (1) UU 7/1983 stdd UU 7/1991 akurat.

- [x] **9.8 PMK 136/2024 (Pajak Minimum Global / Pillar Two GloBE 15%)** (`src/rules/pph_badan/pmk136_2024_gmt.ts`)
  - **Regime ID / Article ID**: `badan_gmt_pmk136_2024` / `pph-badan-pmk136-2024-gmt`
  - **Periode Berlaku**: `1 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_136_2024`, `SRC.PMK_69_2024`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Mekanisme Pajak Minimum Global (Global Minimum Tax / Pillar Two 15% bagi grup PMN omzet global >= EUR 750 juta): perhitungan Top-Up Tax (15% − ETR) melalui DMTT/IIR akurat.

- [x] **9.9 PP 81/2007, PP 77/2013, PP 30/2020 & PP 55/2022 (Tarif Perseroan Terbuka / Tbk)** (`src/rules/pph_badan/pp30_2020_tbk.ts`)
  - **Regime ID / Article ID**: `badan_pp30_2020_tbk` / `pph-badan-pp30-2020-tbk`
  - **Periode Berlaku**: `1 Januari 2008 – Sekarang (Diskon -3% sejak 2020)`
  - **`sources`**: `SRC.PP_55_2022`, `SRC.PP_30_2020`, `SRC.PP_77_2013`, `SRC.PP_81_2007`
  - **Hasil Audit**: Evolusi pengurangan tarif PPh Badan bagi emiten Tbk (minimal 40% saham diperdagangkan & >= 300 pemegang saham) dari diskon -5% (PP 81/2007 & PP 77/2013) menjadi -3% atas tarif 22% (19% di PP 30/2020 & PP 55/2022) akurat.

- [x] **9.10 PMK 130/2020 jo. PMK 69/2024, PP 78/2019 & PP 45/2019 (Insentif Fiskal Badan)** (`src/rules/pph_badan/insentif_fiskal.ts`)
  - **Regime ID / Article ID**: `badan_insentif_fiskal` / `pph-badan-insentif-fiskal`
  - **Periode Berlaku**: `2019 – Sekarang (Tax Holiday Diperpanjang s.d. Des 2025 & Penyesuaian GMT)`
  - **`sources`**: `SRC.PMK_130_2020`, `SRC.PMK_69_2024`, `SRC.PP_78_2019`, `SRC.PP_45_2019`
  - **Hasil Audit**: Simulasi 4 skema fasilitas utama PPh Badan (Tax Holiday 100%, Mini Tax Holiday 50%, Tax Allowance 30% / 6 thn, dan Super Tax Deduction Litbang/R&D hingga 300%) akurat.

- [x] **9.11 Ordonansi Pajak Perseroan 1925 jo. UU Nomor 8 Tahun 1970 (Pra-UU 7/1983)** (`src/rules/pph_badan/pps1925.ts`)
  - **Regime ID / Article ID**: `badan_pps1925` / `pph-badan-pps1925`
  - **Periode Berlaku**: `1970 – 31 Desember 1983`
  - **`sources`**: `SRC.UU_8_1970_PPS`, `SRC.UU_7_1983`
  - **Hasil Audit**: Lapisan tarif Pajak Perseroan era pra-reformasi 1984 (tarif dasar 20% hingga tarif puncak 45% sesuai UU 8/1970 jo. PPs 1925) beserta sejarah penyatuannya ke UU 7/1983 akurat.

- [x] **9.12 PP 12/2023 jo. PP 29/2024 (Tax Holiday IKN & Daerah Mitra 100% s.d. 30 Tahun + Super Tax Deduction)** (`src/rules/pph_badan/pp12_2023_ikn_pfii.ts`)
  - **Regime ID / Article ID**: `badan_pp12_2023_ikn` / `badan-pp12-2023-ikn`
  - **Periode Berlaku**: `6 Maret 2023 – Sekarang (Revisi PP 29/2024 & PMK 69/2024)`
  - **`sources`**: `SRC.PP_12_2023`, `SRC.PP_29_2024`, `SRC.PMK_69_2024`, `SRC.PMK_130_2020`
  - **Hasil Audit**: Fasilitas fiskal khusus Ibu Kota Nusantara (IKN) dan Daerah Mitra sesuai PP 12/2023 jo. PP 29/2024: Tax Holiday 100% (s.d. 30 tahun untuk investasi >= Rp 10 miliar di IKN), Financial Center, serta Super Tax Deduction vokasi/Litbang/donasi IKN akurat.

- [x] **9.13 PMK 169/PMK.010/2015 (Batasan Utang terhadap Modal / Debt-to-Equity Ratio 4:1)** (`src/rules/pph_badan/pmk169_2015_der.ts`)
  - **Regime ID / Article ID**: `badan_pmk169_2015_der` / `badan-pmk169-2015-der`
  - **Periode Berlaku**: `Tahun Pajak 2016 – Sekarang`
  - **`sources`**: `SRC.PMK_169_2015`, `SRC.UU_7_2021_HPP`, `SRC.UU_36_2008`
  - **Hasil Audit**: Pembatasan *thin capitalization* melalui rasio maksimal utang terhadap modal 4:1 sesuai PMK 169/2015 beserta koreksi fiskal positif atas kelebihan biaya pinjaman/bunga dan dampaknya terhadap PPh Badan 22% akurat.

- [x] **9.14 PMK 72/2023 (Penyusutan Harta Berwujud & Amortisasi Bangunan > 20 Tahun)** (`src/rules/pph_badan/pmk72_2023_penyusutan.ts`)
  - **Regime ID / Article ID**: `badan_pmk72_2023_penyusutan` / `badan-pmk72-2023-penyusutan`
  - **Periode Berlaku**: `17 Juli 2023 – Sekarang`
  - **`sources`**: `SRC.PMK_72_2023`, `SRC.UU_7_2021_HPP`, `SRC.UU_36_2008`
  - **Hasil Audit**: Aturan terbaru pengelompokan penyusutan fiskal Kelompok 1–4, Bangunan Permanen 20 tahun, serta hak pemilihan masa manfaat sesuai pembukuan sebenarnya untuk bangunan permanen/harta tak berwujud > 20 tahun beserta perhitungan penghematan pajak 22% akurat.

- [x] **9.15 PP 15/2022 jo. PP 18/2025, PP 37/2018 & PP 53/2017 (PPh Badan Sektor Ekstraktif: Batubara, Mineral & Migas)** (`src/rules/pph_badan/pp15_2022_ekstraktif.ts`)
  - **Regime ID / Article ID**: `badan_pp15_2022_ekstraktif` / `badan-pp15-2022-ekstraktif`
  - **Periode Berlaku**: `2017 / 2018 / 2022 – Sekarang (Update PNBP Batubara PP 18/2025)`
  - **`sources`**: `SRC.PP_15_2022`, `SRC.PP_18_2025`, `SRC.PP_37_2018`, `SRC.PP_53_2017`
  - **Hasil Audit**: Perlakuan PPh Badan dan tambahan iuran produksi/bagian pemerintah daerah (4% Pusat + 6% Daerah pada IUPK eks-PKP2B PP 15/2022 jo. PP 18/2025, IUPK Mineral PP 37/2018, dan Kontrak Bagi Hasil Gross Split Hulu Migas PP 53/2017) akurat.

- [x] **9.16 Pasal 6(2) & Pasal 9 UU PPh (Koreksi Fiskal Positif/Negatif & Kompensasi Rugi 5 Tahun)** (`src/rules/pph_badan/koreksi_fiskal_kerugian.ts`)
  - **Regime ID / Article ID**: `badan_koreksi_fiskal_kerugian` / `pph-badan-koreksi-fiskal-kerugian`
  - **Periode Berlaku**: `1 Januari 2009 – Sekarang (UU 36/2008 stdd UU HPP)`
  - **`sources`**: `SRC.PP_93_2010`, `SRC.PMK_105_2009`, `SRC.PMK_02_2010`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Alur rekonsiliasi fiskal tahunan dari laba komersial ke PhKP (koreksi positif sumbangan/promosi tanpa daftar nominatif PMK 02/2010/piutang non-syarat PMK 105/2009, koreksi negatif PPh Final/non-objek, pengurang kompensasi kerugian 5 tahun Pasal 6 ayat 2, lalu penerapan tarif 22% / Pasal 31E & diskon Tbk) akurat.

---

## 10. PPN (`ppn` — 21 Aturan)

- [x] **10.1 PMK 131/2024 & UU HPP** (`src/rules/ppn/pmk131_2025.ts`)
  - **Regime ID / Article ID**: `ppn_pmk131_2025` / `ppn-pmk131-2025`
  - **Periode Berlaku**: `1 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_131_2024`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Skema tarif 12% atas barang mewah dan DPP Nilai Lain 11/12 × 12% (= 11% efektif) untuk BKP/JKP non-mewah berlaku 1 Januari 2025 akurat. (*Catatan minor*: nama file/ID memakai `2025` mengikuti tahun berlaku, sementara nomor peraturan yang tepat adalah **PMK 131 Tahun 2024** sebagaimana sudah benar di `sources` dan `legalBasis`).

- [x] **10.2 UU Nomor 7 Tahun 2021 (HPP)** (`src/rules/ppn/hpp2022.ts`)
  - **Regime ID / Article ID**: `ppn_hpp_2022` / `ppn-hpp-2022`
  - **Periode Berlaku**: `1 April 2022 – 31 Desember 2024`
  - **`sources`**: `SRC.UU_7_2021_HPP`, `SRC.UU_7_2021_SETNEG`
  - **Hasil Audit**: Tarif PPN 11% sesuai Pasal 7 ayat (1) huruf a UU HPP, mekanisme inklusif/eksklusif PPN, dan periode berlaku akurat.

- [x] **10.3 UU Nomor 42 Tahun 2009** (`src/rules/ppn/uu42_2009.ts`)
  - **Regime ID / Article ID**: `ppn_uu42_2009` / `ppn-uu42-2009`
  - **Periode Berlaku**: `1 April 2010 – 31 Maret 2022`
  - **`sources`**: `SRC.UU_42_2009`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Tarif tunggal 10%, periode berlaku, dan pembaruan objek/ekspor jasa sesuai UU 42/2009 akurat.

- [x] **10.4 UU Nomor 18 Tahun 2000** (`src/rules/ppn/uu18_2000.ts`)
  - **Regime ID / Article ID**: `ppn_uu18_2000` / `ppn-uu18-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 31 Maret 2010`
  - **`sources`**: `SRC.UU_18_2000`, `SRC.UU_42_2009`
  - **Hasil Audit**: Tarif 10%, periode berlaku, dan `sources` akurat.

- [x] **10.5 UU Nomor 11 Tahun 1994** (`src/rules/ppn/uu11_1994.ts`)
  - **Regime ID / Article ID**: `ppn_uu11_1994` / `ppn-uu11-1994`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.UU_11_1994`, `SRC.UU_18_2000`
  - **Hasil Audit**: Tarif 10%, periode berlaku, dan `sources` akurat.

- [x] **10.6 UU Nomor 8 Tahun 1983 jo. PP 1/1985** (`src/rules/ppn/uu8_1983.ts`)
  - **Regime ID / Article ID**: `ppn_uu8_1983` / `ppn-uu8-1983`
  - **Periode Berlaku**: `1 April 1985 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_8_1983`, `SRC.PP_1_1985`, `SRC.UU_11_1994`
  - **Hasil Audit**: Tanggal mulai berlaku 1 April 1985 (berdasarkan PP 1/1985), tarif 10%, dan `sources` akurat.

- [x] **10.7 PMK 11/2025 (PPN Besaran Tertentu & KMS: 1,1% & 2,2%)** (`src/rules/ppn/pmk11_2025_besaran_tertentu.ts`)
  - **Regime ID / Article ID**: `ppn_besaran_tertentu_pmk11_2025` / `ppn-pmk11-2025-besaran-tertentu`
  - **Periode Berlaku**: `4 Februari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_11_2025`, `SRC.PMK_131_2024`, `SRC.UU_7_2021_HPP`
  - **Hasil Audit**: Penyelarasan tarif PPN Besaran Tertentu Pasal 9A UU PPN dan KMS agar tetap efektif **1,1%** (paket wisata, kurir, mobil bekas, freight forwarding, komisi asuransi = 10% × 11/12 × 12%) serta **2,2%** (Kegiatan Membangun Sendiri = 20% × 11/12 × 12%) per PMK 11/2025 akurat.

- [x] **10.8 PMK 48/2020 jo. PMK 60/2022 (PPN PMSE Digital Asing) & Transisi Kripto PMK 50/2025** (`src/rules/ppn/pmk60_2022_pmse.ts`)
  - **Regime ID / Article ID**: `ppn_pmse_pmk60_2022` / `ppn-pmk60-2022-pmse`
  - **Periode Berlaku**: `1 Juli 2020 – Sekarang (PPN Koin Kripto Dihapus per 1 Ags 2025)`
  - **`sources`**: `SRC.PMK_60_2022`, `SRC.PMK_48_2020`, `SRC.PMK_50_2025`, `SRC.PMK_68_2022`
  - **Hasil Audit**: Pemungutan PPN atas produk digital luar negeri (PMSE) sebesar 11% efektif serta pembandingan transisi kripto (0,11% era PMK 68/2022 menjadi 0% bukan objek PPN per 1 Agustus 2025 di PMK 50/2025) akurat.

- [x] **10.9 PMK 197/2013 jo. PMK 68/2010 & PMK 164/2023 (Batasan Pengusaha Kecil PKP)** (`src/rules/ppn/pmk197_2013_pkp.ts`)
  - **Regime ID / Article ID**: `ppn_pkp_pmk197_2013` / `ppn-pmk197-2013-pkp`
  - **Periode Berlaku**: `1 Januari 2014 – Sekarang (PMK 68/2010: 2010–2013)`
  - **`sources`**: `SRC.PMK_197_2013`, `SRC.PMK_68_2010`, `SRC.PMK_164_2023`
  - **Hasil Audit**: Uji omzet kewajiban pengukuhan Pengusaha Kena Pajak (ambang Rp 4,8 M/tahun sejak 1 Jan 2014 beserta tenggat akhir tahun buku PMK 164/2023 vs Rp 600 juta era PMK 68/2010) akurat.

- [x] **10.10 UU Darurat Nomor 19 Tahun 1951 (Pajak Penjualan / PPn 1951 — Pra-PPN 1983)** (`src/rules/ppn/uuppn1951.ts`)
  - **Regime ID / Article ID**: `ppn_uuppn_1951` / `ppn-uuppn-1951`
  - **Periode Berlaku**: `1 Oktober 1951 – 31 Maret 1985`
  - **`sources`**: `SRC.UU_DARURAT_19_1951`, `SRC.UU_8_1983`
  - **Hasil Audit**: Sejarah Pajak Penjualan (PPn 1951) sistem pengenaan bertingkat/kaskade (tanpa mekanisme Pajak Masukan–Keluaran) sebelum digantikan UU 8/1983 akurat.

- [x] **10.11 PMK 90/2025, PMK 13/2025 jo. PMK 60/2025 & PMK 7/2024 (PPN DTP Rumah Tapak & Rusun)** (`src/rules/ppn/pmk13_2025_dtp_properti.ts`)
  - **Regime ID / Article ID**: `ppn_dtp_properti_pmk13_2025` / `ppn-pmk13-2025-dtp-properti`
  - **Periode Berlaku**: `1 Januari 2024 – 31 Desember 2026 (Diperpanjang PMK 90/2025)`
  - **`sources`**: `SRC.PMK_90_2025`, `SRC.PMK_60_2025`, `SRC.PMK_13_2025`, `SRC.PMK_61_2024`, `SRC.PMK_7_2024`, `SRC.PMK_131_2024`
  - **Hasil Audit (Diperbarui 2026)**: Plafon harga jual <= Rp 5 miliar dengan bagian DPP DTP maksimal Rp 2 miliar atas PPN efektif 11% akurat. Telah diperbarui dengan **`SRC.PMK_90_2025`** yang memperpanjang PPN DTP **100% penuh** sepanjang Tahun Anggaran 2026 (1 Januari–31 Desember 2026), berdampingan dengan opsi 2025 (`PMK 13/2025` & `PMK 60/2025`).

- [x] **10.12 PMK 12/2025 jo. PMK 8/2024 (PPN DTP Kendaraan Listrik Berbasis Baterai / KBLBB)** (`src/rules/ppn/pmk12_2025_dtp_ev.ts`)
  - **Regime ID / Article ID**: `ppn_dtp_ev_pmk12_2025` / `ppn-pmk12-2025-dtp-ev`
  - **Periode Berlaku**: `1 Januari 2025 – 31 Desember 2025`
  - **`sources`**: `SRC.PMK_12_2025`, `SRC.PMK_8_2024`, `SRC.PMK_131_2024`
  - **Hasil Audit**: DTP 10% atas PPN 12% untuk KBLBB TKDN >= 40% (pembeli bayar 2%), DTP 5% untuk bus TKDN 20%–<40% (pembeli bayar 7%), dan pembanding historis 2024 PMK 8/2024 (pembeli bayar 1%) akurat.

- [x] **10.13 PMK 4/2026, 43/2026 & 77/2026 jo. PMK 18/36/71 Tahun 2025 (PPN DTP Tiket Pesawat Ekonomi Domestik)** (`src/rules/ppn/pmk18_2025_dtp_tiket.ts`)
  - **Regime ID / Article ID**: `ppn_dtp_tiket_pesawat` / `ppn-pmk18-2025-dtp-tiket`
  - **Periode Berlaku**: `Musiman 2025 – 10 Januari 2027 (Gelombang 2025: 6% DTP; Gelombang 2026: 100% DTP)`
  - **`sources`**: `SRC.PMK_77_2026`, `SRC.PMK_43_2026`, `SRC.PMK_4_2026`, `SRC.PMK_71_2025`, `SRC.PMK_36_2025`, `SRC.PMK_18_2025`, `SRC.PMK_131_2024`
  - **Hasil Audit (Diperbarui 2026)**: Memodelkan lengkap 6 gelombang musiman tiket ekonomi domestik: 3 gelombang tahun 2025 (`PMK 18/2025` Lebaran, `PMK 36/2025` Libur Sekolah, `PMK 71/2025` Nataru) dengan DTP parsial **6%** (penumpang bayar 5%), serta 3 gelombang tahun 2026 (`PMK 4/2026` Idulfitri 1447 H, `PMK 43/2026` Libur Sekolah, `PMK 77/2026` Nataru 2026/2027) dengan **PPN DTP 100%** (penumpang bayar **Rp 0 PPN** atas base fare + fuel surcharge).

- [x] **10.14 PP 49/2022 & PMK 59/2022 (PPN Dibebaskan, Tidak Dipungut, & WAPU Pemerintah)** (`src/rules/ppn/pp49_2022_strategis.ts`)
  - **Regime ID / Article ID**: `ppn_pp49_2022_strategis` / `ppn-pp49-2022-strategis`
  - **Periode Berlaku**: `12 Desember 2022 – Sekarang`
  - **`sources`**: `SRC.PP_49_2022`, `SRC.PMK_59_2022`, `SRC.PMK_131_2024`
  - **Hasil Audit (Diperbaiki)**: Redaksional ambang WAPU Instansi Pemerintah Pasal 18 ayat (1) huruf a PMK 59/2022 telah diperbaiki menjadi **"paling banyak Rp 2.000.000 TIDAK termasuk PPN dan/atau PPnBM"**, serta ditambahkan catatan peringatan apabila opsi WAPU yang dipilih berselisih dengan nilai DPP masukan.

- [x] **10.15 KMK 648/1994 -> KMK 552/2000 -> KMK 571/2003 (Evolusi Batas Pengusaha Kecil PKP Pra-2010)** (`src/rules/ppn/kmk552_2000_pkp.ts`)
  - **Regime ID / Article ID**: `ppn_pkp_pra2010` / `ppn-kmk552-2000-pkp`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Maret 2010 (Sebelum PMK 68/2010 & PMK 197/2013)`
  - **`sources`**: `SRC.KMK_571_2003`, `SRC.KMK_552_2000`, `SRC.KMK_648_1994`
  - **Hasil Audit**: Rangkaian berurutan batasan omzet Pengusaha Kecil PPN pra-2010 (KMK 648/1994: Rp 240 jt BKP / Rp 120 jt JKP; KMK 552/2000: Rp 360 jt BKP / Rp 180 jt JKP; KMK 571/2003: Rp 600 jt BKP & JKP) akurat.

- [x] **10.16 PMK 64/PMK.03/2022 (PPN Besaran Tertentu Barang Hasil Pertanian Tertentu 1,1%)** (`src/rules/ppn/pmk64_2022_pertanian.ts`)
  - **Regime ID / Article ID**: `ppn_pmk64_2022_pertanian` / `ppn-pmk64-2022-pertanian`
  - **Periode Berlaku**: `1 April 2022 – Sekarang (Diselaraskan PMK 11/2025)`
  - **`sources`**: `SRC.PMK_64_2022`, `SRC.PMK_11_2025`, `SRC.UU_42_2009`
  - **Hasil Audit**: Tarif PPN Besaran Tertentu 1,1% (10% × 11% dan diselaraskan 10% × 11/12 × 12% di PMK 11/2025) bagi PKP pengolah hasil perkebunan/pertanian/kehutanan yang memilih skema final non-pengkreditan pajak masukan akurat.

- [x] **10.17 PP 40/2021 (Fasilitas PPN KEK) & PMK 120/2019 (VAT Refund Turis Asing)** (`src/rules/ppn/pp40_2021_kek_refund.ts`)
  - **Regime ID / Article ID**: `ppn_pp40_2021_kek_refund` / `ppn-pp40-2021-kek-refund`
  - **Periode Berlaku**: `2 Februari 2021 (KEK) & 1 Oktober 2019 (VAT Refund) – Sekarang`
  - **`sources`**: `SRC.PP_40_2021`, `SRC.PMK_120_2019`, `SRC.PMK_131_2024`
  - **Hasil Audit**: Fasilitas PPN Tidak Dipungut (0%) atas pemasukan BKP/JKP ke Kawasan Ekonomi Khusus sesuai PP 40/2021 serta skema pengembalian PPN turis asing (VAT Refund) dengan batas minimal PPN Rp 500.000 per faktur/gabungan dalam 1 bulan sesuai PMK 120/2019 akurat.

- [x] **10.18 PMK 163/PMK.03/2012 jo. PMK 61/PMK.03/2022 (PPN Kegiatan Membangun Sendiri / KMS)** (`src/rules/ppn/pmk163_2012_kms_lama.ts`)
  - **Regime ID / Article ID**: `ppn_pmk163_2012_kms` / `ppn-pmk163-2012-kms-lama`
  - **Periode Berlaku**: `22 November 2012 – 31 Desember 2024 (Era Tarif 2% & 2,2%)`
  - **`sources`**: `SRC.PMK_163_2012`, `SRC.PMK_61_2022`, `SRC.PMK_11_2025`
  - **Hasil Audit**: Evolusi tarif efektif Kegiatan Membangun Sendiri bangunan >= 200 m2 (20% × biaya non-tanah × 10% = 2% pada PMK 163/2012 dan 20% × 11% = 2,2% pada PMK 61/2022) sebelum diselaraskan ke PMK 11/2025 akurat.

- [x] **10.19 PP 12/2001, PP 81/2015 jo. PP 48/2020 (BKP Strategis Dibebaskan PPN 2001–2022)** (`src/rules/ppn/pp81_2015_strategis_lama.ts`)
  - **Regime ID / Article ID**: `ppn_pp81_2015_strategis` / `ppn-pp81-2015-strategis-lama`
  - **Periode Berlaku**: `1 Januari 2001 – 11 Desember 2022`
  - **`sources`**: `SRC.PP_81_2015`, `SRC.PP_48_2020`, `SRC.PP_12_2001`, `SRC.PP_49_2022`
  - **Hasil Audit**: Rezim historis BKP strategis dibebaskan PPN (mesin pabrik, sembako, pakan ternak, air bersih, listrik rumah tangga <= 6.600 VA) sebelum dikonsolidasikan menjadi PP 49/2022 akurat.

- [x] **10.20 PMK 81/2024 Bab IV (WAPU BUMN, KKKS Migas, & Instansi Pemerintah — Pencabut PMK 8/2021 & PMK 73/2010)** (`src/rules/ppn/pmk81_2024_wapu_bumn_kkks.ts`)
  - **Regime ID / Article ID**: `ppn_pmk81_2024_wapu_bumn_kkks` / `ppn-pmk81-2024-wapu-bumn-kkks`
  - **Periode Berlaku**: `1 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.PMK_81_2024`, `SRC.PMK_8_2021`, `SRC.PMK_73_2010`, `SRC.PMK_131_2024`
  - **Hasil Audit**: Konsolidasi WAPU Coretax PMK 81/2024 dengan pembedaan tepat ambang BUMN/KKKS (> Rp 10 juta termasuk PPN -> Kode 030 dipungut WAPU vs <= Rp 10 juta -> Kode 040/010 dipungut PKP penjual) dan Instansi Pemerintah (> Rp 2 juta tidak termasuk PPN -> Kode 020) beserta pemisahan arus kas diterima vendor akurat.

- [x] **10.21 PMK 40/2010 jo. PMK 81/2024 & PMK 131/2024 (PPN Jasa & BKP Tidak Berwujud Luar Negeri / Self-Assessed)** (`src/rules/ppn/pmk40_2010_jln.ts`)
  - **Regime ID / Article ID**: `ppn_pmk40_2010_jln` / `ppn-pmk40-2010-jln`
  - **Periode Berlaku**: `1 April 2010 – Sekarang (PPN 11% Efektif Sejak 2022/2025)`
  - **`sources`**: `SRC.PMK_40_2010`, `SRC.PMK_81_2024`, `SRC.PMK_131_2024`
  - **Hasil Audit**: Mekanisme self-assessment penyetoran PPN JLN 11% efektif oleh pemanfaat di Indonesia (baik PKP maupun Non-PKP) maksimal tgl 15 bulan berikutnya beserta hak pengkreditan Pajak Masukan (PKP) vs komponen biaya (Non-PKP) akurat.

---

## 11. PPnBM (`ppnbm` — 9 Aturan)

- [x] **11.1 PP 73/2019 jo. PP 74/2021, PMK 141/2021 & PMK 15/2023** (`src/rules/ppnbm/pp74_2021.ts`)
  - **Regime ID / Article ID**: `ppnbm_pp74_2021` / `ppnbm-pp74-2021`
  - **Periode Berlaku**: `16 Oktober 2021 – Sekarang`
  - **`sources`**: `SRC.PP_74_2021`, `SRC.PP_73_2019`, `SRC.PMK_141_2021`, `SRC.PMK_96_2021`, `SRC.PMK_15_2023`
  - **Hasil Audit**: Rujukan, tanggal berlaku 16 Oktober 2021, dan tarif berbasis emisi/non-kendaraan (BEV 0%, LCGC 15% × DPP 20% = 3%, Full Hybrid 15% × DPP 40% = 6%, konvensional 20%–40%, hunian mewah >= Rp 30 M 20%, kapal pesiar/pesawat 75%) sudah akurat.

- [x] **11.2 PP 41/2013 jo. PP 22/2014 & PMK 35/2017** (`src/rules/ppnbm/pp41_2013.ts`)
  - **Regime ID / Article ID**: `ppnbm_pp41_2013` / `ppnbm-pp41-2013`
  - **Periode Berlaku**: `23 Mei 2013 – 15 Oktober 2021`
  - **`sources`**: `SRC.PP_41_2013`, `SRC.PP_22_2014`, `SRC.PMK_106_2015`, `SRC.PMK_35_2017`
  - **Hasil Audit**: Tanggal berlaku 23 Mei 2013, tarif LCGC 0%, sedan 30%, >3.000 cc 125%, hunian mewah 20% (PMK 106/2015 jo. PMK 35/2017), kapal pesiar/pesawat 75%, dan `sources` akurat.

- [x] **11.3 PP 145/2000 jo. PP 43/2003 & PP 12/2006** (`src/rules/ppnbm/pp145_2000.ts`)
  - **Regime ID / Article ID**: `ppnbm_pp145_2000` / `ppnbm-pp145-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 22 Mei 2013`
  - **`sources`**: `SRC.PP_145_2000`, `SRC.PP_12_2006`, `SRC.UU_18_2000`
  - **Hasil Audit**: Plafon tarif hingga 75% (mengikuti UU 18/2000), lapisan 10%/20%/40%/75% sebelum ada BEV/LCGC 0%, dan periode berlaku akurat (*catatan minor*: PP 43/2003 disebut di nama rezim namun tidak terpisah di `sources`).

- [x] **11.4 PP 50/1994 jo. PP 20/1996 & PP 59/1999** (`src/rules/ppnbm/pp50_1994.ts`)
  - **Regime ID / Article ID**: `ppnbm_pp50_1994` / `ppnbm-pp50-1994`
  - **Periode Berlaku**: `1 Januari 1995 – 31 Desember 2000`
  - **`sources`**: `SRC.PP_50_1994`, `SRC.PP_20_1996`, `SRC.PP_59_1999`, `SRC.UU_11_1994`
  - **Hasil Audit (Diperbaiki)**: `SRC.PP_59_1999` (JDIH BPK RI) telah ditambahkan ke `sources.ts` dan `sources` modul mendukung tarif puncak 50% era 1999.

- [x] **11.5 PP 22/1985 jo. PP 29/1988, PP 65/1991, PP 76/1991 & PP 36/1993** (`src/rules/ppnbm/pp22_1985.ts`)
  - **Regime ID / Article ID**: `ppnbm_pp22_1985` / `ppnbm-pp22-1985`
  - **Periode Berlaku**: `1 April 1985 – 31 Desember 1994`
  - **`sources`**: `SRC.PP_22_1985`, `SRC.PP_29_1988`, `SRC.PP_65_1991`, `SRC.PP_76_1991`, `SRC.PP_36_1993`, `SRC.PP_50_1994`, `SRC.UU_8_1983`
  - **Hasil Audit**: Rangkaian 7 sumber PP/UU dan evolusi tarif 10%–20% (Pasal 16 PP 22/1985) ke batas 35% akurat (*catatan minor*: `article.effectiveDate` tertulis `1 April 1985 – 31 Desember 2000` karena artikel merangkum transisi s.d. PP 50/1994, sementara `regime.effectivePeriod` sudah tepat `1 April 1985 – 31 Desember 1994`).

- [x] **11.6 PMK 12/2025 jo. PMK 9/2024 (PPnBM DTP Hybrid 3% & EV KBLBB)** (`src/rules/ppnbm/pmk12_2025_dtp_hybrid.ts`)
  - **Regime ID / Article ID**: `ppnbm_pmk12_2025_dtp` / `ppnbm-pmk12-2025-dtp`
  - **Periode Berlaku**: `Januari 2024 – 31 Desember 2025`
  - **`sources`**: `SRC.PMK_12_2025`, `SRC.PMK_9_2024`, `SRC.PP_74_2021`
  - **Hasil Audit**: Insentif PPnBM DTP 3% untuk kendaraan hybrid hemat energi TA 2025 (memangkas beban efektif 6% menjadi 3% untuk konsumen) dan pembebasan PPnBM KBLBB (BEV/impor CBU investasi PMK 9/2024) akurat.

- [x] **11.7 PMK 20/2021, PMK 31/2021 & PMK 5/2022 (PPnBM DTP Otomotif Pandemi 100%–25%)** (`src/rules/ppnbm/pmk20_2021_dtp.ts`)
  - **Regime ID / Article ID**: `ppnbm_pmk20_2021_dtp` / `ppnbm-pmk20-2021-dtp`
  - **Periode Berlaku**: `1 Maret 2021 – 30 September 2022`
  - **`sources`**: `SRC.PMK_20_2021`, `SRC.PMK_31_2021`, `SRC.PMK_5_2022`, `SRC.PP_41_2013`
  - **Hasil Audit**: Stimulus otomotif pandemi bertahap diskon 100%, 50%, dan 25% atas tarif normal PP 41/2013 (dan relaksasi perluasan hingga 2.500 cc pada PMK 31/2021 serta LCGC di PMK 5/2022) akurat.

- [x] **11.8 PMK 620/2004, PMK 106/2015, PMK 35/2017 -> PMK 96/2021 & PMK 15/2023 (Non-Kendaraan)** (`src/rules/ppnbm/pmk106_2015_nonkendaraan.ts`)
  - **Regime ID / Article ID**: `ppnbm_pmk106_2015_nonkendaraan` / `ppnbm-pmk106-2015-nonkendaraan`
  - **Periode Berlaku**: `31 Desember 2004 – Sekarang (Pembaruan Batasan di PMK 15/2023)`
  - **`sources`**: `SRC.PMK_96_2021`, `SRC.PMK_15_2023`, `SRC.PMK_106_2015`, `SRC.PMK_35_2017`, `SRC.PMK_620_2004`
  - **Hasil Audit**: Evolusi pemangkasan daftar BKP mewah selain kendaraan bermotor sejak PMK 620/2004 hingga konsolidasi PMK 96/2021 jo. PMK 15/2023 (hunian mewah >= Rp 30 M tarif 20%, balon udara/kapal pesiar/senjata api 40%–75%) akurat.

- [x] **11.9 PMK 141/PMK.010/2021 (Pembebasan PPnBM Kendaraan Dinas/Umum/Khusus)** (`src/rules/ppnbm/pmk141_2021_pembebasan.ts`)
  - **Regime ID / Article ID**: `ppnbm_pmk141_2021_pembebasan` / `ppnbm-pmk141-2021-pembebasan`
  - **Periode Berlaku**: `16 Oktober 2021 – Sekarang`
  - **`sources`**: `SRC.PMK_141_2021`, `SRC.PP_74_2021`, `SRC.PP_73_2019`
  - **Hasil Audit**: Mekanisme pembebasan PPnBM (0% melalui SKB PPnBM) atas kendaraan angkutan umum/taksi, ambulans, kendaraan jenazah, pemadam kebakaran, kendaraan tahanan, serta kendaraan dinas TNI/Polri dan protokoler kenegaraan akurat.

---

## 12. PBB (`pbb` — 9 Aturan)

- [x] **12.1 UU Nomor 1 Tahun 2022 (HKPD)** (`src/rules/pbb/hkpd2022.ts`)
  - **Regime ID / Article ID**: `pbb_hkpd_2022` / `pbb-hkpd-2022`
  - **Periode Berlaku**: `5 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit**: Sesuai Pasal 40–41 UU HKPD: assessment ratio/NJKP 20%–100%, NJOPTKP minimal Rp 10 juta per WP, tarif paling tinggi 0,5%, dan batas transisi Perda 5 Januari 2024 akurat (*catatan observasi*: kalkulator memakai plafon tarif Perda 0,5% secara tetap sedangkan daerah dapat menetapkan di bawah 0,5%).

- [x] **12.2 UU Nomor 28 Tahun 2009 (PDRD)** (`src/rules/pbb/pdrd2009.ts`)
  - **Regime ID / Article ID**: `pbb_pdrd_2009` / `pbb-pdrd-2009`
  - **Periode Berlaku**: `1 Januari 2010 – 4 Januari 2024`
  - **`sources`**: `SRC.UU_28_2009_PDRD`, `SRC.UU_12_1994`
  - **Hasil Audit**: Desentralisasi PBB-P2 sesuai Pasal 77–84 UU PDRD tanpa NJKP, NJOPTKP min Rp 10 juta, dan tarif maksimal 0,3% akurat.

- [x] **12.3 UU Nomor 12 Tahun 1994 (PBB Pusat / P3)** (`src/rules/pbb/uu12_1994.ts`)
  - **Regime ID / Article ID**: `pbb_uu12_1994` / `pbb-uu12-1994`
  - **Periode Berlaku**: `1 Januari 1995 – 2009 (masih berlaku untuk PBB-P3)`
  - **`sources`**: `SRC.UU_12_1994`, `SRC.PP_25_2002`, `SRC.UU_12_1985`
  - **Hasil Audit**: Tarif tunggal 0,5%, NJKP 20% (< Rp 1 M) / 40% (>= Rp 1 M) per PP 25/2002, NJOPTKP Rp 12 juta (naik dari Rp 8 jt awal UU 12/1994), dan keberlanjutan aturan untuk PBB-P3 akurat.

- [x] **12.4 UU Nomor 12 Tahun 1985** (`src/rules/pbb/uu12_1985.ts`)
  - **Regime ID / Article ID**: `pbb_uu12_1985` / `pbb-uu12-1985`
  - **Periode Berlaku**: `1 Januari 1986 – 31 Desember 1994`
  - **`sources`**: `SRC.UU_12_1985`, `SRC.PP_46_1985`, `SRC.UU_12_1994`
  - **Hasil Audit**: Pengurangan Nilai Bangunan Tidak Kena Pajak (NBTKP) Rp 2.000.000 khusus bangunan sesuai Pasal 3 ayat (3) UU 12/1985, NJKP 20% (PP 46/1985), dan tarif 0,5% akurat.

- [x] **12.5 PMK 186/PMK.03/2019 jo. PMK 234/2022 & PMK 23/2014 (PBB-P3 Pusat)** (`src/rules/pbb/pmk186_2019_p3.ts`)
  - **Regime ID / Article ID**: `pbb_pmk186_2019_p3` / `pbb-pmk186-2019-p3`
  - **Periode Berlaku**: `1 Januari 2020 – Sekarang (Penyelarasan PMK 234/2022)`
  - **`sources`**: `SRC.PMK_186_2019`, `SRC.PMK_234_2022`, `SRC.PMK_23_2014`, `SRC.UU_12_1994`
  - **Hasil Audit**: Formula khusus PBB sektor P3 yang tetap dikelola DJP Pusat (NJKP tetap 40%, tarif 0,5% => 0,2% efektif atas NJOP bersih setelah NJOPTKP Rp 12 juta PMK 23/2014) akurat.

- [x] **12.6 PP 46/2000 jo. KMK 201/2000 (Transisi NJKP 40% Perkebunan/Tambang & NJOPTKP Rp 12 Jt)** (`src/rules/pbb/pp46_2000.ts`)
  - **Regime ID / Article ID**: `pbb_pp46_2000` / `pbb-pp46-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 12 Mei 2002 (Berlanjut ke PP 25/2002)`
  - **`sources`**: `SRC.PP_46_2000`, `SRC.KMK_201_2000`, `SRC.PP_25_2002`
  - **Hasil Audit**: Pembedaan awal NJKP 40% bagi sektor perkebunan, kehutanan, pertambangan (serta properti >= Rp 1 M) vs 20% bagi objek umum < Rp 1 M dengan NJOPTKP Rp 12 juta akurat.

- [x] **12.7 Perpu 11/1959 & Rezim IPEDA / IREDA (Pra-UU 12/1985)** (`src/rules/pbb/ipeda_pra1986.ts`)
  - **Regime ID / Article ID**: `pbb_ipeda_pra1986` / `pbb-ipeda-pra1986`
  - **Periode Berlaku**: `1959 – 31 Desember 1985`
  - **`sources`**: `SRC.PERPU_11_1959_IPEDA`, `SRC.UU_12_1985`
  - **Hasil Audit**: Konteks historis Pajak Hasil Bumi (Perpu 11/1959) & Iuran Pembangunan Daerah (IPEDA/IREDA) sebelum digantikan unifikasi PBB UU 12/1985 akurat.

- [x] **12.8 PP Nomor 35 Tahun 2023 (Pelaksana PBB-P2 UU HKPD: NJOPTKP & Klasterisasi NJKP)** (`src/rules/pbb/pp35_2023_pbb.ts`)
  - **Regime ID / Article ID**: `pbb_pp35_2023` / `pbb-pp35-2023`
  - **Periode Berlaku**: `16 Juni 2023 – Sekarang`
  - **`sources`**: `SRC.PP_35_2023`, `SRC.UU_1_2022_HKPD`
  - **Hasil Audit**: Pelaksana teknis PP 35/2023 Pasal 12–17 atas tata cara pemungutan PBB-P2 (NJOPTKP minimal Rp 10 juta untuk satu objek utama per WP, rentang NJKP 20%–100%, serta tarif maksimal Perda 0,5%) akurat.

- [x] **12.9 PMK 76/2013 jo. PMK 122/2019 & PMK 139/2014 (PBB-P3 Hulu Migas & Panas Bumi)** (`src/rules/pbb/pmk139_2014_p3_migas.ts`)
  - **Regime ID / Article ID**: `pbb_pmk139_2014_migas` / `pbb-pmk139-2014-migas`
  - **Periode Berlaku**: `11 April 2013 – 31 Desember 2019 (Penatausahaan PBB Migas Tetap Relevan)`
  - **`sources`**: `SRC.PMK_76_2013`, `SRC.PMK_122_2019`, `SRC.PMK_139_2014`, `SRC.PMK_186_2019`
  - **Hasil Audit**: Penatausahaan & penetapan NJOP PBB-P3 sektor hulu migas, panas bumi, dan mineral/batubara pra-PMK 186/2019 (NJKP tetap 40% × 0,5% = 0,2% efektif dengan NJOPTKP Rp 12 juta, termasuk pengecualian fasilitas PBB masa eksplorasi migas di PMK 122/2019) akurat.

---

## 13. BPHTB (`bphtb` — 8 Aturan)

- [x] **13.1 UU Nomor 1 Tahun 2022 (HKPD)** (`src/rules/bphtb/hkpd2022.ts`)
  - **Regime ID / Article ID**: `bphtb_hkpd_2022` / `bphtb-hkpd-2022`
  - **Periode Berlaku**: `5 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit (Diperbaiki)**: `npoptkp` untuk `jual_beli_lainnya` (perolehan hak kedua dan seterusnya) telah diubah dari `60000000` menjadi `0` sesuai Pasal 46 ayat (5) UU Nomor 1 Tahun 2022 (HKPD), beserta pembaruan label langkah kalkulasi, tabel perbandingan artikel, dan catatan hasil perhitungan.

- [x] **13.2 UU Nomor 28 Tahun 2009 (PDRD)** (`src/rules/bphtb/pdrd2009.ts`)
  - **Regime ID / Article ID**: `bphtb_pdrd_2009` / `bphtb-pdrd-2009`
  - **Periode Berlaku**: `1 Januari 2011 – 4 Januari 2024`
  - **`sources`**: `SRC.UU_28_2009_PDRD`, `SRC.UU_20_2000`
  - **Hasil Audit**: Pengalihan BPHTB menjadi pajak daerah mulai 1 Januari 2011 (Pasal 85–90 UU PDRD), NPOPTKP minimal Rp 60 juta (umum) & Rp 300 juta (waris/hibah wasiat), serta tarif maksimal 5% akurat.

- [x] **13.3 UU Nomor 20 Tahun 2000 & PP 111/2000** (`src/rules/bphtb/uu20_2000.ts`)
  - **Regime ID / Article ID**: `bphtb_uu20_2000` / `bphtb-uu20-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 31 Desember 2010`
  - **`sources`**: `SRC.UU_20_2000`, `SRC.PP_111_2000`, `SRC.UU_21_1997`
  - **Hasil Audit**: NPOPTKP maksimal Rp 60 juta (umum) dan Rp 300 juta (waris/hibah wasiat) beserta pengurangan pajak terutang 50% atas waris/hibah wasiat sesuai PP 111/2000 akurat.

- [x] **13.4 UU Nomor 21 Tahun 1997 jo. Perpu 1/1997** (`src/rules/bphtb/uu21_1997.ts`)
  - **Regime ID / Article ID**: `bphtb_uu21_1997` / `bphtb-uu21-1997`
  - **Periode Berlaku**: `1 Juli 1998 – 31 Desember 2000`
  - **`sources`**: `SRC.UU_21_1997`, `SRC.UU_1_1998`, `SRC.UU_20_2000`
  - **Hasil Audit**: Penundaan pemberlakuan UU 21/1997 melalui Perpu 1/1997 (UU 1/1998) ke 1 Juli 1998, NPOPTKP nasional seragam Rp 30 juta, dan tarif tunggal 5% akurat.

- [x] **13.5 PP 35/2023 & Insentif Pembebasan BPHTB Rumah Pertama MBR (UU HKPD)** (`src/rules/bphtb/pp35_2023_mbr.ts`)
  - **Regime ID / Article ID**: `bphtb_pp35_2023_mbr` / `bphtb-pp35-2023-mbr`
  - **Periode Berlaku**: `5 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.PP_35_2023`, `SRC.UU_1_2022_HKPD`
  - **Hasil Audit**: Ketentuan teknis pemungutan BPHTB PP 35/2023 dan simulasi pembebasan BPHTB 0% bagi Masyarakat Berpenghasilan Rendah (MBR) untuk rumah pertama (NPOPTKP Rp 0 perolehan kedua dst sesuai Pasal 46 ayat 5 UU HKPD) akurat.

- [x] **13.6 Ordonansi Bea Balik Nama (S.1924 No. 291 — Sebelum UU 21/1997)** (`src/rules/bphtb/bbn_pra1997.ts`)
  - **Regime ID / Article ID**: `bphtb_bbn_pra1997` / `bphtb-bbn-pra1997`
  - **Periode Berlaku**: `1924 – 30 Juni 1998`
  - **`sources`**: `SRC.UU_21_1997`, `SRC.UU_1_1998`
  - **Hasil Audit**: Sejarah Ordonansi Bea Balik Nama 1924 (Staatsblad 1924 No. 291) dengan tarif 10% atas pendaftaran akta peralihan hak sebelum dicabut dan digantikan BPHTB 5% dalam UU 21/1997 akurat.

- [x] **13.7 KMK 561/KMK.04/2004 jo. PMK 91/PMK.03/2006 (Pengurangan BPHTB 25%/50%/75%)** (`src/rules/bphtb/pmk91_2006_pengurangan.ts`)
  - **Regime ID / Article ID**: `bphtb_pmk91_2006_pengurangan` / `bphtb-pmk91-2006-pengurangan`
  - **Periode Berlaku**: `1 Desember 2004 – 31 Desember 2010 (Diadopsi menjadi Perda/Perkada Era Daerah)`
  - **`sources`**: `SRC.KMK_561_2004`, `SRC.PMK_91_2006`, `SRC.UU_20_2000`, `SRC.PP_35_2023`
  - **Hasil Audit**: Tingkat pengurangan BPHTB terutang (25% rumah dinas/hibah badan sosial, 50% waris/bencana/veteran, dan 75% relokasi bencana/kepentingan sosial tertentu) sebelum dan sesudah pengalihan ke Perda/Perkada akurat.

- [x] **13.8 SKB 3 Menteri Nov 2024 & Perkada MBR (Pembebasan BPHTB 100% Rumah Pertama MBR Program 3 Juta Rumah)** (`src/rules/bphtb/skb3menteri_2024_mbr.ts`)
  - **Regime ID / Article ID**: `bphtb_skb3menteri_2024_mbr` / `bphtb-skb3menteri-2024-mbr`
  - **Periode Berlaku**: `25 November 2024 – Sekarang`
  - **`sources`**: `SRC.SKB_3_MENTERI_2024_MBR`, `SRC.UU_1_2022_HKPD`, `SRC.PP_35_2023`
  - **Hasil Audit**: Simulasi syarat pembebasan 100% BPHTB (Rp 0) untuk pembeli rumah pertama MBR berdasarkan SKB Mendagri, MenPKP & MenPU tgl 25 November 2024 jo. Perkada setempat (rumah pertama, penghasilan <= Rp 8 juta/bulan umum, dan adanya Perkada pembebasan) akurat.

---

## 14. PBJT / Pajak Daerah (`pbjt` — 9 Aturan)

- [x] **14.1 UU Nomor 1 Tahun 2022 (HKPD)** (`src/rules/pbjt/hkpd2022.ts`)
  - **Regime ID / Article ID**: `pbjt_hkpd_2022` / `pbjt-hkpd-2022`
  - **Periode Berlaku**: `5 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit**: Sesuai Pasal 50–58 UU HKPD: peleburan 5 pajak konsumsi menjadi PBJT dengan plafon umum 10% (makanan/minuman, perhotelan, parkir, hiburan umum, listrik umum), hiburan khusus 40%–75% (kalkulator memakai batas bawah 40%), listrik industri 3%, dan listrik sendiri 1,5% akurat.

- [x] **14.2 UU Nomor 28 Tahun 2009 (PDRD)** (`src/rules/pbjt/pdrd2009.ts`)
  - **Regime ID / Article ID**: `pbjt_pdrd_2009` / `pbjt-pdrd-2009`
  - **Periode Berlaku**: `1 Januari 2010 – 4 Januari 2024`
  - **`sources`**: `SRC.UU_28_2009_PDRD`, `SRC.UU_1_2022_HKPD`
  - **Hasil Audit**: Plafon masing-masing pajak konsumsi era UU PDRD (Hotel 10%, Restoran 10%, Parkir 30%, Hiburan umum 35%, Hiburan khusus 75%, PPJ 10%) akurat.

- [x] **14.3 UU Nomor 34 Tahun 2000 jo. PP 65/2001** (`src/rules/pbjt/uu34_2000.ts`)
  - **Regime ID / Article ID**: `pbjt_uu34_2000` / `pbjt-uu34-2000`
  - **Periode Berlaku**: `1 Januari 2001 – 31 Desember 2009`
  - **`sources`**: `SRC.UU_34_2000`, `SRC.PP_65_2001`, `SRC.UU_18_1997`
  - **Hasil Audit**: Pemisahan Pajak Hotel (10%) & Restoran (10%), lahirnya Pajak Parkir (maks 20% PP 65/2001), Pajak Hiburan (maks 35%), dan PPJ (maks 10%) akurat (*catatan minor*: UU 34/2000 diundangkan 20 Des 2000 sementara periode simulasi dimulai 1 Jan 2001).

- [x] **14.4 UU Nomor 18 Tahun 1997 jo. PP 19/1997** (`src/rules/pbjt/uu18_1997.ts`)
  - **Regime ID / Article ID**: `pbjt_uu18_1997` / `pbjt-uu18-1997`
  - **Periode Berlaku**: `23 Mei 1997 – 31 Desember 2000`
  - **`sources`**: `SRC.UU_18_1997`, `SRC.PP_19_1997`, `SRC.UU_34_2000`
  - **Hasil Audit**: Tanggal berlaku 23 Mei 1997, penggabungan Pajak Hotel & Restoran (maks 10%), Hiburan (maks 35%), PPJ (maks 10%), dan belum adanya Pajak Parkir daerah (0%) akurat.

- [x] **14.5 PP 35/2023 (Ketentuan Umum & Tata Cara Pemungutan PBJT Daerah)** (`src/rules/pbjt/pp35_2023_daerah.ts`)
  - **Regime ID / Article ID**: `pbjt_pp35_2023_daerah` / `pbjt-pp35-2023-daerah`
  - **Periode Berlaku**: `16 Juni 2023 – Sekarang (Perda HKPD Efektif 5 Jan 2024)`
  - **`sources`**: `SRC.PP_35_2023`, `SRC.UU_1_2022_HKPD`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit**: Pengaturan pelaksana PP 35/2023 Pasal 18–24 atas pengecualian objek konsumsi (katering UMKM/kos-kosan/perhotelan dikecualikan), batas tarif PBJT 10% (hiburan khusus 40%–75%), dan saat terutang akurat.

- [x] **14.6 UU Darurat 11/1957 jo. UU 1/1961 (Peraturan Umum Pajak Daerah Pra-1997)** (`src/rules/pbjt/uu11_1957.ts`)
  - **Regime ID / Article ID**: `pbjt_uu11_1957` / `pbjt-uu11-1957`
  - **Periode Berlaku**: `1957 – 22 Mei 1997 (Pra-UU 18/1997)`
  - **`sources`**: `SRC.UU_DARURAT_11_1957`, `SRC.UU_1_1961`, `SRC.UU_18_1997`
  - **Hasil Audit**: Regulasi payung pajak daerah pra-1997 (termasuk sejarah Pajak Pembangunan I 10% atas restoran/hotel & Pajak Tontonan daerah hingga 35%) sebelum diringkas lewat UU 18/1997 akurat.

- [x] **14.7 UU HKPD Pasal 83–84 & PP 35/2023 (Opsen PKB & Opsen BBNKB 66%)** (`src/rules/pbjt/hkpd_opsen_pkb_bbnkb.ts`)
  - **Regime ID / Article ID**: `pbjt_hkpd_opsen` / `pbjt-hkpd-opsen`
  - **Periode Berlaku**: `5 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.PP_35_2023`
  - **Hasil Audit**: Mekanisme tambahan Opsen PKB dan Opsen BBNKB untuk Kabupaten/Kota sebesar **66%** dihitung atas pokok pajak terutang Provinsi (berlaku efektif 5 Januari 2025 sesuai Pasal 83–84 UU HKPD jo. PP 35/2023) akurat.

- [x] **14.8 UU HKPD & PP 35/2023 (Pajak Alat Berat, Reklame, Air Tanah, & MBLB)** (`src/rules/pbjt/hkpd_pajak_daerah_lain.ts`)
  - **Regime ID / Article ID**: `pbjt_hkpd_daerah_lain` / `pbjt-hkpd-daerah-lain`
  - **Periode Berlaku**: `5 Januari 2024 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.PP_35_2023`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit**: Simulasi plafon tarif pajak daerah non-PBJT dalam UU HKPD: Pajak Alat Berat maks 0,2%, Pajak Reklame maks 25%, Pajak Air Tanah maks 20%, dan Pajak MBLB maks 20% (beserta ketentuan Opsen MBLB 25%) akurat.

- [x] **14.9 UU HKPD 1/2022 & PP 35/2023 (Pajak Provinsi: PKB 1,2%, BBNKB Baru 12% + Opsen 66%, PBBKB, & Rokok)** (`src/rules/pbjt/hkpd_pkb_bbnkb_pbbkb_rokok.ts`)
  - **Regime ID / Article ID**: `pbjt_hkpd_provinsi_ototarif` / `pbjt-hkpd-provinsi-ototarif`
  - **Periode Berlaku**: `5 Januari 2025 – Sekarang`
  - **`sources`**: `SRC.UU_1_2022_HKPD`, `SRC.PP_35_2023`, `SRC.UU_28_2009_PDRD`
  - **Hasil Audit**: Tarif pokok PKB Non-DKI 1,2% (+ Opsen 66% = 1,992%) vs DKI 2%, BBNKB kendaraan baru Non-DKI 12% (+ Opsen 66% = 19,92%) vs DKI 20% (beserta pembebasan 0% kendaraan bekas), PBBKB maks 10%, dan Pajak Rokok 10% cukai akurat.

---

## 15. Bea Meterai (`bea_meterai` — 9 Aturan)

- [x] **15.1 UU Nomor 10 Tahun 2020 (Tarif Tunggal)** (`src/rules/bea_meterai/uu10_2020.ts`)
  - **Regime ID / Article ID**: `meterai_uu10_2020` / `bea-meterai-uu10-2020`
  - **Periode Berlaku**: `1 Januari 2021 – Sekarang`
  - **`sources`**: `SRC.UU_10_2020`, `SRC.PP_24_2000`
  - **Hasil Audit**: Berlaku 1 Januari 2021, tarif tunggal Rp 10.000/dokumen untuk nominal uang > Rp 5.000.000, pengakuan penuh e-Meterai, dan catatan dokumen perdata tanpa nominal akurat.

- [x] **15.2 UU 13/1985 & PP Nomor 24 Tahun 2000** (`src/rules/bea_meterai/pp24_2000.ts`)
  - **Regime ID / Article ID**: `meterai_pp24_2000` / `bea-meterai-pp24-2000`
  - **Periode Berlaku**: `1 Mei 2000 – 31 Desember 2020`
  - **`sources`**: `SRC.PP_24_2000`, `SRC.UU_13_1985`
  - **Hasil Audit**: Berlaku 1 Mei 2000, ambang bebas s.d. Rp 250.000, tarif Rp 3.000 (> Rp 250 rb s.d. Rp 1 jt), dan Rp 6.000 (> Rp 1 jt) akurat.

- [x] **15.3 UU 13/1985 & PP Nomor 7 Tahun 1995** (`src/rules/bea_meterai/pp7_1995.ts`)
  - **Regime ID / Article ID**: `meterai_pp7_1995` / `bea-meterai-pp7-1995`
  - **Periode Berlaku**: `21 April 1995 – 30 April 2000`
  - **`sources`**: `SRC.PP_7_1995`, `SRC.UU_13_1985`
  - **Hasil Audit**: Berlaku 21 April 1995, ambang bebas s.d. Rp 250.000, tarif Rp 1.000 (> Rp 250 rb s.d. Rp 1 jt), dan Rp 2.000 (> Rp 1 jt) akurat.

- [x] **15.4 UU Nomor 13 Tahun 1985 (Tarif Awal)** (`src/rules/bea_meterai/uu13_1985.ts`)
  - **Regime ID / Article ID**: `meterai_uu13_1985` / `bea-meterai-uu13-1985`
  - **Periode Berlaku**: `1 Januari 1986 – 20 April 1995`
  - **`sources`**: `SRC.UU_13_1985`, `SRC.PP_7_1995`
  - **Hasil Audit**: Berlaku 1 Januari 1986 sesuai Pasal 2 ayat (2) & (3) UU 13/1985, ambang bebas s.d. Rp 100.000, tarif Rp 500 (> Rp 100 rb s.d. Rp 1 jt), dan Rp 1.000 (> Rp 1 jt) akurat.

- [x] **15.5 PMK 78/2024 & PP 86/2021 (Pelaksana e-Meterai & Pemeteraian Kemudian +100%)** (`src/rules/bea_meterai/pmk78_2024_pelaksana.ts`)
  - **Regime ID / Article ID**: `meterai_pmk78_2024` / `bea-meterai-pmk78-2024`
  - **Periode Berlaku**: `18 Oktober 2024 – Sekarang`
  - **`sources`**: `SRC.PMK_78_2024`, `SRC.PP_86_2021`, `SRC.PMK_134_2021`, `SRC.UU_10_2020`
  - **Hasil Audit**: Konsolidasi aturan pelaksana e-Meterai & meterai percetakan per 18 Oktober 2024 (mencabut PMK 134/2021), pengenaan pokok Rp 10.000 serta sanksi administratif 100% (total Rp 20.000/dokumen) untuk Pemeteraian Kemudian sesuai Pasal 17–18 UU 10/2020 jo. PMK 78/2024 akurat.

- [x] **15.6 PP 3/2022 (Fasilitas Pembebasan Bea Meterai — 0% / Rp 0)** (`src/rules/bea_meterai/pp3_2022_fasilitas.ts`)
  - **Regime ID / Article ID**: `meterai_pp3_2022` / `bea-meterai-pp3-2022`
  - **Periode Berlaku**: `12 Januari 2022 – Sekarang`
  - **`sources`**: `SRC.PP_3_2022`, `SRC.UU_10_2020`, `SRC.PMK_78_2024`
  - **Hasil Audit**: Pembebasan 0% / Rp 0 atas 4 kategori dokumen dalam PP 3/2022 (pengalihan hak program pemerintah/rumah sederhana, pelaksanaan perjanjian internasional, dokumen penanganan bencana alam, serta transaksi dalam negeri pemerintah/sosial/keagamaan tertentu) akurat.

- [x] **15.7 Zegelverordening 1921 / Aturan Bea Meterai 1921 (Stbl. 1921 No. 498)** (`src/rules/bea_meterai/zegel1921.ts`)
  - **Regime ID / Article ID**: `meterai_zegel1921` / `bea-meterai-zegel-1921`
  - **Periode Berlaku**: `1921 – 31 Desember 1985`
  - **`sources`**: `SRC.UU_13_1985`, `SRC.UU_10_2020`
  - **Hasil Audit**: Sejarah aturan bea meterai proporsional pra-1986 (`Zegelverordening 1921`, 167 pasal, tarif bertingkat & sebanding seperti 0,1% meterai kredit/dagang) sebelum digantikan UU 13/1985 akurat.

- [x] **15.8 PMK 4/2021, PMK 134/2021 & PMK 151/2021 (Transisi Meterai Rp 9.000 & Pemungut e-Meterai)** (`src/rules/bea_meterai/pmk134_2021_transisi.ts`)
  - **Regime ID / Article ID**: `meterai_pmk134_2021_transisi` / `bea-meterai-pmk134-2021-transisi`
  - **Periode Berlaku**: `1 Januari 2021 – 17 Oktober 2024 (Masa Transisi Meterai Lama s.d. 31 Des 2021)`
  - **`sources`**: `SRC.PMK_4_2021`, `SRC.PMK_134_2021`, `SRC.PMK_151_2021`, `SRC.UU_10_2020`
  - **Hasil Audit**: Masa transisi penggunaan meterai tempel lama Rp 3.000 + Rp 6.000 = paling sedikit Rp 9.000 s.d. 31 Desember 2021 serta skema pemungut Bea Meterai elektronik (`PMK 151/2021`) sebelum dikonsolidasikan ke `PMK 78/2024` akurat.

- [x] **15.9 Pasal 7 UU 10/2020 & Pasal 28–37 PMK 78/2024 (Dokumen Non-Objek & Pemungut > 1.000 Dokumen)** (`src/rules/bea_meterai/uu10_2020_pemungut_nonobjek.ts`)
  - **Regime ID / Article ID**: `meterai_uu10_2020_pemungut_nonobjek` / `bea-meterai-uu10-2020-pemungut-nonobjek`
  - **Periode Berlaku**: `1 Januari 2021 – Sekarang (Pembaruan PMK 78/2024 per 18 Okt 2024)`
  - **`sources`**: `SRC.UU_10_2020`, `SRC.PMK_78_2024`, `SRC.PMK_151_2021`
  - **Hasil Audit**: Identifikasi dokumen Non-Objek Pasal 7 UU 10/2020 (ijazah, slip gaji/pensiun, konosemen/B/L, tanda terima intern, kuitansi pajak/bank) = Rp 0, ambang nominal <= Rp 5 jt = Rp 0, serta kewajiban Pemungut Bea Meterai bagi penerbit > 1.000 dokumen/bulan di PMK 78/2024 akurat (termasuk edge-case `jumlahDokumen = 0`).

---

## Riwayat Perbaikan 18 Temuan (Prioritas Tinggi -> Rendah) — Selesai

### Prioritas Tinggi — Bug Logika Perhitungan & Tarif
1. **BPHTB UU HKPD (`src/rules/bphtb/hkpd2022.ts`)**: `npoptkp` untuk `jual_beli_lainnya` diubah dari `60000000` menjadi `0` sesuai Pasal 46 ayat (5) UU 1/2022; label langkah, tabel perbandingan, dan catatan hasil telah diselaraskan.
2. **PPh 22 PMK 34/2017 (`src/rules/pph22/pmk34_2017.ts`)**: Tarif `bulion_emas` dikoreksi menjadi **0,25%** sesuai **PMK 48/2023 (efektif 1 Mei 2023)**, `SRC.PMK_48_2023` ditambahkan ke `sources`, dan catatan riwayat 0,45% (Mar 2017–Apr 2023) ditambahkan.
3. **PPh 22 KMK 254/2001 (`src/rules/pph22/kmk254_2001.ts`)**: `SRC.UU_36_2008` ditambahkan ke `sources`, serta formula dan catatan diperjelas bahwa sanksi non-NPWP +100% hanya berlaku mulai 1 Januari 2009 hingga 30 Agustus 2010 (sedangkan 2001–2008 tarif normal 100%).
4. **PPh Badan `shared.ts` (`src/rules/pph_badan/shared.ts`)**: Ditambahkan cabang eksplisit `omzet === 0` agar formula langkah dan `notes` menyatakan tarif normal (bukan `"Seluruh PKP menikmati diskon 50% Pasal 31E"`), memulihkan konsistensi untuk `hpp2022.ts`, `perppu2020.ts`, `uu36_2008.ts`, dan `uu36_2009.ts`.

### Prioritas Menengah — Ketidaksesuaian `sources` / Rujukan Regulasi
5. **PPh 23 PER-70/PJ/2007 (`src/rules/pph23/per70_2007.ts`)**: `SRC.PER_70_PJ_2007` ditambahkan di `src/rules/sources.ts` dan menggantikan `SRC.KEP_170_2002_DJP` pada `sources` modul.
6. **PPh 23 KEP-176/PJ./2000 (`src/rules/pph23/kep176_2000.ts`)**: `SRC.KEP_176_PJ_2000` ditambahkan di `src/rules/sources.ts` dan menggantikan `SRC.KEP_170_2002_DJP` pada `sources` modul.
7. **PPh 21 UU 7/1983 (`src/rules/pph21/uu7_1983.ts`)**: `SRC.KMK_980_1983` ditambahkan di `src/rules/sources.ts` dan dimasukkan ke `sources` modul.
8. **PPh 21 DTP (`src/rules/pph21/pmk86_2020_dtp.ts`)**: `SRC.PMK_23_2020` dan `SRC.PMK_44_2020` ditambahkan di `sources.ts` dan `sources` modul serta diselaraskan dengan `article.legalBasis`.
9. **PPh 22 PMK 154/2010 (`src/rules/pph22/pmk154_2010.ts`)**: `SRC.PMK_107_2015` ditambahkan di `sources.ts`, `sources`, dan `legalBasis` modul dengan keterangan berlakunya tarif emas batangan 0,45% mulai PMK 107/PMK.010/2015.
10. **PPh 22 UU 7/1983 (`src/rules/pph22/uu7_1983.ts`)**: Nomor KMK keliru (`KMK 983/KMK.04/1983` dan `KMK 848/KMK.04/1992`) dikoreksi menjadi regulasi resmi PPh 22 terverifikasi JDIH Kemenkeu **`KMK 965/KMK.04/1983`** (`SRC.KMK_965_1983`) dan **`KMK 382/KMK.04/1989`** (`SRC.KMK_382_1989`).
11. **PPnBM PP 50/1994 (`src/rules/ppnbm/pp50_1994.ts`)**: `SRC.PP_59_1999` ditambahkan ke `sources.ts` dan `sources` modul.
12. **PPh Badan UU 36/2008 (`uu36_2008.ts` & `uu36_2009.ts`)**: `legalBasis` dilengkapi dengan `ayat (2a)`, `ayat (2b)`, dan `Pasal 31E`.

### Prioritas Rendah — Tanggal Efektif & Redaksional
13. **PPh 23 PMK 141/2015 & PMK 244/2008 (`pmk141_2015.ts`, `pmk244_2009.ts`)**: Tanggal berlaku efektif PMK 141/2015 dikoreksi menjadi **26 Agustus 2015** (beserta penambahan `SRC.UU_6_2023_CK`), dan batas akhir PMK 244/2008 menjadi **25 Agustus 2015**.
14. **PPh 25 PMK 81/2024 (`src/rules/pph25/pmk81_2024.ts`)**: Catatan output kalkulator diperbarui menjadi `"sesuai Pasal 226–237 PMK 81 Tahun 2024"`.
15. **PPh 21 KMK 564/2004 (`src/rules/pph21/kmk564_2004.ts`)**: Typo redaksional pada paragraf pertama artikel telah dibersihkan.

---

## Audit Perluasan +48 Aturan Historis & Terkini (Total 127 Modul) — Selesai

- **Kelengkapan Rujukan & Keakuratan**: Seluruh 48 modul baru memiliki minimal 2 tautan sumber resmi `https://` (`sources.ts`), mencantumkan `verifiedAt: '14 November 2026'` pada `regime` dan `article`, serta lulus pengujian deterministik `node:test`.
- **Sinkronisasi Kalkulator UI (`src/components/TaxCalculatorWorkspace.tsx`)**: Menambahkan input khusus dinamis sesuai parameter setiap aturan baru (Natura PMK 66/2023, ASN PP 80/2010, Bukan Pegawai PER-31, Kripto PMK 50/2025, SIPP PMK 58/2022, BBM/Industri, Barang Sangat Mewah, Fintech P2P Lending, Deposito/DHE, Obligasi WPDN, Saham Bursa/Pendiri, Dividen OP, Undian/Koperasi, NPPN, OPPT 0,75%, Diskon Pandemi PPh 25 30%–50% & FLN PP 80/2008, Branch Profit Tax BUT, GMT 15% PMK 136/2024, Tarif Tbk, Insentif Fiskal Badan, PPN Besaran Tertentu PMK 11/2025, PMSE/Kripto, PKP Batasan Omzet, PPnBM DTP Otomotif Pandemi, PBB PP 46/2000, BPHTB Rumah MBR, Pemeteraian Kemudian PMK 78/2024, serta Pembebasan Meterai PP 3/2022).
- **Perbaikan Label Rasio PPh 25 PMK 23/2020 (`src/rules/pph25/pmk23_2020_diskon30.ts`)**: Menambahkan `effectiveRateLabel: 'Porsi angsuran yang disetor'` agar persentase setoran (70% atau 50%) tidak salah tampil dengan label default `"Tarif pajak efektif"`.

---

## Audit Kelengkapan Bagian B (+21 Aturan Terkini & Jejak Historis — Total 148 Modul) — Selesai

- **Penambahan 2 Modul Penutup Celah Bagian B**:
  1. `src/rules/ppn/pmk18_2025_dtp_tiket.ts` (`ppn_dtp_tiket_pesawat`): PPN DTP 6% (penumpang bayar 5%) untuk tiket pesawat ekonomi berjadwal dalam negeri periode Lebaran (`PMK 18/2025`), Libur Sekolah (`PMK 36/2025`), dan Nataru (`PMK 71/2025`).
  2. `src/rules/pph21/pmk168_2023_desember.ts` (`pph21_pmk168_2023_desember`): Rekonsiliasi PPh Pasal 21 Masa Pajak Terakhir (Desember) sesuai `PMK 168/2023` yang memisahkan 10 bulan TER rutin + 1 bulan lonjakan TER akibat THR/bonus, lengkap dengan deteksi otomatis **Kurang Potong** vs **Lebih Potong** (refund ke pegawai paling lambat akhir Januari).
- **Perbaikan Akurasi & Kelengkapan Hasil Audit Bagian B**:
  1. **Bug Tarif `dividen_badan` PPh 23 Coretax (`src/rules/pph23/pmk81_2024_coretax.ts`)**: Mengoreksi tarif `dividen_badan` dari 15%/30% menjadi **0%** (dikecualikan dari objek PPh 23 tanpa penalti non-NPWP sesuai UU HPP/UU Cipta Kerja), dan menyembunyikan checkbox NPWP di UI saat objek `dividen_badan` dipilih.
  2. **Redaksional & Peringatan Ambang WAPU `PMK 59/2022` (`src/rules/ppn/pp49_2022_strategis.ts`)**: Memperbaiki definisi batas Rp 2.000.000 pada paragraf artikel menjadi **tidak termasuk PPN dan/atau PPnBM** (Pasal 18 ayat 1 huruf a `PMK 59/2022`) serta menambahkan catatan peringatan bila opsi WAPU yang dipilih berselisih dengan nominal DPP.
  3. **Tanggal Berlaku `PP 42/2000` (`src/rules/pph25/pp42_2000_fln.ts`)**: Mengoreksi tanggal mulai berlaku Fiskal Luar Negeri `PP 42/2000` dari `1 Juli 2000` menjadi **23 Juni 2000** sesuai tanggal penetapan/pengundangan resmi.
  4. **Pembaruan `PMK 60/2025` pada PPN DTP Properti (`src/rules/ppn/pmk13_2025_dtp_properti.ts`)**: Menambahkan `SRC.PMK_60_2025` dan opsi periode Juli–Desember 2025 dengan DTP diperpanjang **100%** (di samping opsi pembanding skema awal `PMK 13/2025` 50%).
  5. **Kelengkapan Skema Niaga Emas (`src/rules/pph22/pmk48_2023_emas.ts`)**: Menambahkan `SRC.PMK_11_2025` serta dua skema pedagang yang sebelumnya belum terpisah (`pedagang_punya_fp_konsumen` 0% PPh 22 + 1,1% PPN dan `pedagang_tanpa_fp_usaha` 0,25% PPh 22 + 1,65% PPN).
  6. **Penyelarasan Coretax pada PPh Badan (`src/rules/pph_badan/hpp2022.ts`)**: Menambahkan `SRC.PMK_81_2024` dan bagian penjelasan integrasi SPT Tahunan PPh Badan & bukti potong unifikasi di sistem Coretax 2025.

---

## Audit Kelengkapan Final (+29 Modul Terkini 2026 & Jejak Historis — Total 177 Modul) — Selesai

- **Pembaruan Aturan & Cakupan 2026 (Terverifikasi Resmi 14 November 2026)**:
  1. **PPh Pasal 21 TA 2026 (`src/rules/pph21/pmk105_2025.ts`)**: Stimulus PPh 21 DTP 100% sepanjang Masa Pajak Januari–Desember 2026 bagi 5 sektor padat karya/pariwisata dengan bruto tetap & teratur <= Rp 10 juta/bulan.
  2. **PPN DTP Properti TA 2026 (`src/rules/ppn/pmk13_2025_dtp_properti.ts`)**: Integrasi penuh `PMK Nomor 90 Tahun 2025` (DTP **100%** setahun penuh 1 Januari–31 Desember 2026 atas bagian DPP s.d. Rp 2 miliar dari harga maksimal Rp 5 miliar).
  3. **PPN DTP Tiket Pesawat TA 2026 (`src/rules/ppn/pmk18_2025_dtp_tiket.ts`)**: Penambahan 3 gelombang musiman tahun 2026 dengan **DTP 100%** (penumpang bayar **0% PPN**): Idulfitri 1447 H (`PMK 4/2026`), Libur Sekolah 2026 (`PMK 43/2026`), dan Nataru 2026/2027 (`PMK 77/2026`).
  4. **Transisi UMKM Badan `PP 20/2026` (`src/rules/pph_umkm/pp20_2026_transisi_badan.ts`) & Suket `PP 55/2022` (`src/rules/pph23/pp55_2022_suket_pengecualian.ts`)**: Penyelarasan berakhirnya masa transisi CV/PT di `PP 20/2026` (efektif 22 April 2026) serta pemodelan titik impas tarif umum 11% Pasal 31E vs PPh Final 0,5%.
  5. **Penerapan P3B & Perpajakan Internasional (`pmk112_2025_p3b.ts`, `pmk35_2019_but.ts`, `pmk112_2025_resiprokal.ts`)**: Uji *Beneficial Owner*, *Principal Purpose Test* (PPT), *time test* BUT jasa 60 hari (`PMK 35/2019`), serta pembebasan resiprokal Article 8 di bawah `PMK 112/2025`.
  6. **PPh Badan Khusus (`pp12_2023_ikn_pfii.ts`, `pmk169_2015_der.ts`, `pmk72_2023_penyusutan.ts`, `pp15_2022_ekstraktif.ts`)**, **PPN/PPnBM/PBB/BPHTB/PBJT Opsen 66%/Meterai Transisi**, serta **Objek Lengkap PPh 22** (`ekspor_tambang_1_5` 1,5% & `pengumpul_kehutanan_perkebunan_0_25` 0,25%).
- **Sinkronisasi Kalkulator UI (`src/components/TaxCalculatorWorkspace.tsx`)**: Seluruh 29 modul baru, opsi objek PPh 22 tambahan, serta skema 2026 telah memiliki kontrol input khusus dan label kontekstual yang selaras.
- **Verifikasi Otomatis**: Seluruh **177 modul aturan & artikel**, seluruh sumber `https://`, dan 15 rangkaian pengujian deterministik lulus **15/15 (100%)** melalui `npx --yes tsx --test src/rules/rulesAudit.test.ts`.

---

## Audit Pembaruan, Perbaikan Bug, & Penambahan +14 Aturan Terbaru & Khusus (Total 191 Modul) — Selesai

- **Perbaikan Bug & Akurasi Sebelum Penambahan (Cross-Checked)**:
  1. **PPnBM Terkini & Non-Kendaraan (`pp74_2021.ts`, `pmk106_2015_nonkendaraan.ts`, `pmk20_2021_dtp.ts`)**: Pemisahan akurat kelompok non-kendaraan `balon_udara_peluru` (40%) dan `helikopter_senjata_api` (50%) di bawah `PMK 96/2021` jo. `PMK 15/2023`, penghapusan nilai default yang keliru pada opsi hunian mewah, serta pembatasan fasilitas DTP otomotif `PMK 20/2021` agar tidak diterapkan pada non-kendaraan.
  2. **PBJT Listrik Industri/Sendiri (`pbjt/hkpd2022.ts`) & FLN Darat (`pph25/pp46_1994_fln.ts`)**: Penambahan opsi batas maks 3% (listrik industri/migas) & 1,5% (listrik sendiri/captive power) sesuai Pasal 58 UU HKPD, serta perbaikan dukungan lintas darat pada Fiskal Luar Negeri 1994–2000.
  3. **Edge-Case Input Nol (`pmk191_2015_revaluasi.ts` & `uu10_2020_pemungut_nonobjek.ts`)**: Memastikan `effectiveRatePercent` bernilai `0` (bukan `10%` atau `NaN`) ketika selisih revaluasi atau jumlah dokumen bernilai `0`.
  4. **Keselarasan Audit Dokumentasi (`audit_aturan.md` poin 2.3)**: Menyesuaikan catatan `pph22_pmk81_2024` agar akurat mencerminkan implementasi sanksi `+100%` saat `!hasNpwp`.
- **Penambahan +14 Modul Terbaru & Operasional Khusus (Terverifikasi 14 November 2026)**:
  1. **PPh 21 (`+2`)**: `pph21_pmk28_2024_ikn` (`PMK 28/2024` PPh 21 DTP Final IKN s.d. 2035) & `pph21_pmk168_2023_tengah_tahun` (masuk/berhenti tengah tahun disetahunkan vs tidak disetahunkan).
  2. **PPh 22 (`+1`)**: `pph22_pembebasan_skb` (pengecualian otomatis <= Rp 2 jt / KITE / KEK & SKB DJP).
  3. **PPh 4(2) (`+2`)**: `pph4_2_pmk191_2015_revaluasi` (revaluasi aktiva tetap 10%/3%/4%/6%) & `pph4_2_pps_tax_amnesty` (14 skema historis Tax Amnesty `UU 11/2016` & PPS `PMK 196/2021`).
  4. **PPh UMKM (`+1`)**: `umkm_pmk164_2023_suket` (tata cara Suket 0,5%, Surat Pernyataan <= Rp 500 jt, & relaksasi PKP akhir tahun buku).
  5. **PPh 25 (`+1`)**: `pph25_pmk81_2024_wp_baru_transisi` (WP Baru Nihil, masa sebelum SPT, merger, & OPPT baru).
  6. **PPh 26 (`+1`)**: `pph26_kmk624_1994_asuransi` (premi asuransi/reasuransi LN 10% / 2% / 1%).
  7. **PPh Badan (`+1`)**: `badan_koreksi_fiskal_kerugian` (koreksi fiskal positif/negatif `PP 93/2010`, `PMK 105/2009`, `PMK 02/2010` & kompensasi rugi 5 tahun).
  8. **PPN (`+2`)**: `ppn_pmk81_2024_wapu_bumn_kkks` (WAPU BUMN/KKKS > Rp 10 jt Kode 030 vs Instansi > Rp 2 jt Kode 020) & `ppn_pmk40_2010_jln` (PPN Jasa Luar Negeri self-assessed 11%).
  9. **BPHTB (`+1`)**: `bphtb_skb3menteri_2024_mbr` (`SKB 3 Menteri Nov 2024` pembebasan BPHTB 100% rumah pertama MBR).
  10. **PBJT / Pajak Daerah (`+1`)**: `pbjt_hkpd_provinsi_ototarif` (pajak provinsi UU HKPD: PKB 1,2% / BBNKB 12% + Opsen 66%, bebas BBNKB bekas, PBBKB, & Rokok).
  11. **Bea Meterai (`+1`)**: `meterai_uu10_2020_pemungut_nonobjek` (non-objek Pasal 7 `UU 10/2020` & Pemungut > 1.000 dokumen `PMK 78/2024`).
- **Sinkronisasi Kalkulator UI (`src/components/TaxCalculatorWorkspace.tsx`)**: Seluruh 14 modul baru terhubung dengan kontrol input khusus, label kontekstual, opsi `<select>`, dan tombol reset ke Rp 0 yang bersih.
- **Verifikasi Menyeluruh**: Seluruh **191 modul aturan & artikel**, kelengkapan minimal 2 sumber resmi `https://`, penanggalan `14 November 2026`, serta seluruh kasus uji unit lulus 100% melalui `npx --yes tsx --test src/rules/rulesAudit.test.ts` dan pengujian langsung di peramban.


