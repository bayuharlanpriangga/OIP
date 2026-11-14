import { TaxSource } from '../types/tax';

export const SRC = {
  // Undang-Undang Pokok & Lintas Pajak
  UU_7_2021_HPP: {
    title: 'UU Nomor 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-7-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  UU_7_2021_SETNEG: {
    title: 'UU Nomor 7 Tahun 2021 (Naskah Resmi Peraturan Perundang-undangan)',
    url: 'https://peraturan.go.id/id/uu-no-7-tahun-2021',
    publisher: 'peraturan.go.id',
  },
  UU_6_2023_CK: {
    title: 'UU Nomor 6 Tahun 2023 tentang Penetapan Perppu Nomor 2 Tahun 2022 tentang Cipta Kerja',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-6-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  UU_2_2020: {
    title: 'UU Nomor 2 Tahun 2020 (Penetapan Perppu 1 Tahun 2020)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-2-tahun-2020',
    publisher: 'JDIH Kemenkeu',
  },
  UU_36_2008: {
    title: 'UU Nomor 36 Tahun 2008 (Perubahan Keempat UU PPh)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-36-tahun-2008',
    publisher: 'JDIH Kemenkeu',
  },
  UU_17_2000: {
    title: 'UU Nomor 17 Tahun 2000 (Perubahan Ketiga UU PPh)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-17-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  UU_10_1994: {
    title: 'UU Nomor 10 Tahun 1994 (Perubahan Kedua UU PPh)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-10-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  UU_7_1991: {
    title: 'UU Nomor 7 Tahun 1991 (Perubahan Pertama UU PPh)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-7-tahun-1991',
    publisher: 'JDIH Kemenkeu',
  },
  UU_7_1983: {
    title: 'UU Nomor 7 Tahun 1983 tentang Pajak Penghasilan',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-7-tahun-1983',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 21
  PP_58_2023: {
    title: 'PP Nomor 58 Tahun 2023 tentang Tarif Pemotongan PPh Pasal 21 (TER)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-58-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PP_58_2023_BPK: {
    title: 'PP Nomor 58 Tahun 2023 — Arsip JDIH BPK RI',
    url: 'https://peraturan.bpk.go.id/Details/274247/pp-no-58-tahun-2023-tarif-pemotongan-pajak-penghasilan-pasal-21-atas-penghasilan',
    publisher: 'JDIH BPK RI',
  },
  PMK_168_2023: {
    title: 'PMK Nomor 168 Tahun 2023 tentang Petunjuk Pelaksanaan Pemotongan PPh 21',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-168-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_168_2023_BPK: {
    title: 'PMK Nomor 168 Tahun 2023 — Arsip JDIH BPK RI',
    url: 'https://peraturan.bpk.go.id/Details/286951/pmk-no-168-tahun-2023',
    publisher: 'JDIH BPK RI',
  },
  PER_16_PJ_2016: {
    title: 'PER-16/PJ/2016 tentang Pedoman Teknis Tata Cara Pemotongan PPh Pasal 21/26',
    url: 'https://www.pajak.go.id/id/peraturan-direktur-jenderal-pajak-nomor-16pj2016',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PMK_23_2020: {
    title: 'PMK Nomor 23/PMK.03/2020 tentang Insentif Pajak untuk Wajib Pajak Terdampak Wabah Virus Corona',
    url: 'https://jdih.kemenkeu.go.id/dok/23-pmk-03-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_44_2020: {
    title: 'PMK Nomor 44/PMK.03/2020 tentang Insentif Pajak untuk Wajib Pajak Terdampak Pandemi COVID-19',
    url: 'https://jdih.kemenkeu.go.id/dok/44-pmk-03-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_86_2020: {
    title: 'PMK Nomor 86/PMK.03/2020 tentang Insentif Pajak Terdampak Pandemi COVID-19',
    url: 'https://jdih.kemenkeu.go.id/dok/86-pmk-03-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_110_2020: {
    title: 'PMK Nomor 110/PMK.03/2020 tentang Perubahan atas PMK 86/PMK.03/2020',
    url: 'https://jdih.kemenkeu.go.id/dok/110-pmk-03-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_9_2021: {
    title: 'PMK Nomor 9/PMK.03/2021 tentang Insentif Pajak Tahun 2021',
    url: 'https://jdih.kemenkeu.go.id/dok/9-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_82_2021: {
    title: 'PMK Nomor 82/PMK.03/2021 tentang Perubahan atas PMK 9/PMK.03/2021',
    url: 'https://jdih.kemenkeu.go.id/dok/82-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_101_2016: {
    title: 'PMK Nomor 101/PMK.010/2016 tentang Penyesuaian Besarnya PTKP',
    url: 'https://jdih.kemenkeu.go.id/dok/101-pmk-010-2016',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_122_2015: {
    title: 'PMK Nomor 122/PMK.010/2015 tentang Penyesuaian Besarnya PTKP',
    url: 'https://jdih.kemenkeu.go.id/dok/122-pmk-010-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_162_2012: {
    title: 'PMK Nomor 162/PMK.011/2012 tentang Penyesuaian Besarnya PTKP',
    url: 'https://jdih.kemenkeu.go.id/dok/162-pmk-011-2012',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_250_2008: {
    title: 'PMK Nomor 250/PMK.03/2008 tentang Besarnya Biaya Jabatan dan Biaya Pensiun',
    url: 'https://jdih.kemenkeu.go.id/dok/250-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_137_2005: {
    title: 'PMK Nomor 137/PMK.03/2005 tentang Penyesuaian Besarnya PTKP',
    url: 'https://jdih.kemenkeu.go.id/dok/137-pmk-03-2005',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_564_2004: {
    title: 'KMK Nomor 564/KMK.03/2004 tentang Penyesuaian Besarnya PTKP',
    url: 'https://jdih.kemenkeu.go.id/dok/564-kmk-03-2004',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_521_1998: {
    title: 'KMK Nomor 521/KMK.04/1998 tentang Besarnya Biaya Jabatan dan Biaya Pensiun',
    url: 'https://jdih.kemenkeu.go.id/dok/521-kmk-04-1998',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_49_1994: {
    title: 'KMK Nomor 49/KMK.04/1994 tentang Besarnya Biaya Jabatan',
    url: 'https://jdih.kemenkeu.go.id/dok/49-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_980_1983: {
    title: 'KMK Nomor 980/KMK.04/1983 tentang Besarnya Biaya Jabatan Sehubungan dengan Pekerjaan',
    url: 'https://pajak.go.id/id/peraturan/besarnya-biaya-untuk-mendapatkan-menagih-dan-memelihara-penghasilan-teratur-sehubungan-0',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PP_68_2009: {
    title: 'PP Nomor 68 Tahun 2009 tentang Tarif PPh Pasal 21 atas Uang Pesangon dan Manfaat Pensiun/THT/JHT',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-68-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_16_2010: {
    title: 'PMK Nomor 16/PMK.03/2010 tentang Tata Cara Pemotongan PPh 21 atas Pesangon/Pensiun',
    url: 'https://jdih.kemenkeu.go.id/dok/16-pmk-03-2010',
    publisher: 'JDIH Kemenkeu',
  },
  PP_149_2000: {
    title: 'PP Nomor 149 Tahun 2000 tentang Pemotongan PPh Pasal 21 atas Penghasilan Berupa Uang Pesangon',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-149-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 22
  PMK_37_2025: {
    title: 'PMK Nomor 37 Tahun 2025 tentang Pemungutan PPh oleh Pihak Lain (Marketplace/PPMSE)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-37-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_37_2025_BPK: {
    title: 'PMK Nomor 37 Tahun 2025 — Arsip JDIH BPK RI',
    url: 'https://peraturan.bpk.go.id/Details/322300/pmk-no-37-tahun-2025',
    publisher: 'JDIH BPK RI',
  },
  PMK_37_2025_DJP: {
    title: 'Artikel Resmi DJP: PMK 37/2025 Kesetaraan Pajak Pedagang Online dan Offline',
    url: 'https://www.pajak.go.id/id/artikel/pmk-372025-kesetaraan-pajak-pedagang-online-dan-offline',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PMK_51_2025: {
    title:
      'PMK Nomor 51 Tahun 2025 tentang Pemungutan PPh Pasal 22 atas Penyerahan Barang, Impor, atau Kegiatan Usaha di Bidang Lain',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-51-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_54_2025: {
    title:
      'PMK Nomor 54 Tahun 2025 tentang Perubahan Ketiga atas PMK 81/2024 (Mencabut Pasal 217–225 PPh 22 PMK 81/2024)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-54-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_92_2019: {
    title:
      'PMK Nomor 92/PMK.03/2019 tentang Perubahan Kedua PMK 253/PMK.03/2008 (Barang Sangat Mewah)',
    url: 'https://jdih.kemenkeu.go.id/dok/92-pmk-03-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_34_2017: {
    title: 'PMK Nomor 34/PMK.010/2017 tentang Pemungutan PPh Pasal 22 (Dicabut oleh PMK 81/2024)',
    url: 'https://jdih.kemenkeu.go.id/dok/34-pmk-010-2017',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_110_2018: {
    title: 'PMK Nomor 110/PMK.010/2018 tentang Perubahan atas PMK 34/PMK.010/2017',
    url: 'https://jdih.kemenkeu.go.id/dok/110-pmk-010-2018',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_41_2022: {
    title: 'PMK Nomor 41/PMK.010/2022 tentang Perubahan Kedua atas PMK 34/PMK.010/2017',
    url: 'https://jdih.kemenkeu.go.id/dok/41-pmk-010-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_48_2023: {
    title: 'PMK Nomor 48 Tahun 2023 tentang PPh dan/atau PPN atas Penjualan/Penyerahan Emas Perhiasan & Emas Batangan',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-48-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_59_2022: {
    title: 'PMK Nomor 59/PMK.03/2022 tentang Perubahan PMK 231/PMK.03/2019 (Instansi Pemerintah)',
    url: 'https://jdih.kemenkeu.go.id/dok/59-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_154_2010: {
    title: 'PMK Nomor 154/PMK.03/2010 tentang Pemungutan PPh Pasal 22',
    url: 'https://jdih.kemenkeu.go.id/dok/154-pmk-03-2010',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_175_2013: {
    title: 'PMK Nomor 175/PMK.011/2013 tentang Perubahan Ketiga PMK 154/PMK.03/2010',
    url: 'https://jdih.kemenkeu.go.id/dok/175-pmk-011-2013',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_107_2015: {
    title: 'PMK Nomor 107/PMK.010/2015 tentang Perubahan Keempat atas PMK 154/PMK.03/2010',
    url: 'https://jdih.kemenkeu.go.id/dok/107-pmk-010-2015',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_254_2001: {
    title: 'KMK Nomor 254/KMK.03/2001 tentang Penunjukan Pemungut PPh Pasal 22',
    url: 'https://jdih.kemenkeu.go.id/dok/254-kmk-03-2001',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_210_2008: {
    title: 'PMK Nomor 210/PMK.03/2008 tentang Perubahan Kelima KMK 254/KMK.03/2001',
    url: 'https://jdih.kemenkeu.go.id/dok/210-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_253_2008: {
    title: 'PMK Nomor 253/PMK.03/2008 tentang WP Badan Tertentu Pemungut PPh Barang Sangat Mewah',
    url: 'https://jdih.kemenkeu.go.id/dok/253-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_450_1997: {
    title: 'KMK Nomor 450/KMK.04/1997 tentang Penunjukan Pemungut PPh Pasal 22',
    url: 'https://jdih.kemenkeu.go.id/dok/450-kmk-04-1997',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_599_1994: {
    title: 'KMK Nomor 599/KMK.04/1994 tentang Penunjukan Pemungut PPh Pasal 22',
    url: 'https://jdih.kemenkeu.go.id/dok/599-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_382_1989: {
    title: 'KMK Nomor 382/KMK.04/1989 tentang Penunjukan Pemungut PPh Pasal 22, Dasar Pemungutan, Tarif Serta Tata Cara Pelaksanaannya',
    url: 'https://jdih.kemenkeu.go.id/dok/382-kmk-04-1989',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_965_1983: {
    title: 'KMK Nomor 965/KMK.04/1983 tentang Badan-Badan Tertentu sebagai Pemungut PPh Pasal 22',
    url: 'https://jdih.kemenkeu.go.id/dok/965-kmk-04-1983',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 23
  PMK_141_2015: {
    title: 'PMK Nomor 141/PMK.03/2015 tentang Jenis Jasa Lain Pasal 23 Ayat (1) Huruf c',
    url: 'https://jdih.kemenkeu.go.id/dok/141-pmk-03-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_244_2008: {
    title: 'PMK Nomor 244/PMK.03/2008 tentang Jenis Jasa Lain Pasal 23 Ayat (1) Huruf c',
    url: 'https://jdih.kemenkeu.go.id/dok/244-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PER_70_PJ_2007: {
    title: 'PER-70/PJ/2007 tentang Jenis Jasa Lain dan Perkiraan Penghasilan Neto PPh Pasal 23',
    url: 'https://www.pajak.go.id/en/node/60839',
    publisher: 'Direktorat Jenderal Pajak',
  },
  KEP_170_2002_DJP: {
    title: 'KEP-170/PJ./2002 tentang Jenis Jasa Lain dan Perkiraan Penghasilan Neto PPh 23',
    url: 'https://pajak.go.id/id/peraturan/jenis-jasa-lain-dan-perkiraan-penghasilan-neto-sebagaimana-dimaksud-dalam-pasal-23-ayat-2',
    publisher: 'Direktorat Jenderal Pajak',
  },
  KEP_176_PJ_2000: {
    title: 'KEP-176/PJ./2000 tentang Jenis Jasa Lain dan Perkiraan Penghasilan Neto PPh Pasal 23',
    url: 'https://www.pajak.go.id/id/node/58990',
    publisher: 'Direktorat Jenderal Pajak',
  },

  // PPh Pasal 4(2)
  PP_9_2022: {
    title: 'PP Nomor 9 Tahun 2022 tentang Perubahan Kedua PP 51/2008 (Jasa Konstruksi)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-9-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PP_34_2017: {
    title: 'PP Nomor 34 Tahun 2017 tentang PPh atas Penghasilan dari Persewaan Tanah dan/atau Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-34-tahun-2017',
    publisher: 'JDIH Kemenkeu',
  },
  PP_34_2016: {
    title: 'PP Nomor 34 Tahun 2016 tentang PPh atas Pengalihan Hak atas Tanah dan/atau Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-34-tahun-2016',
    publisher: 'JDIH Kemenkeu',
  },
  PP_51_2008: {
    title: 'PP Nomor 51 Tahun 2008 tentang PPh atas Penghasilan dari Usaha Jasa Konstruksi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-51-tahun-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PP_40_2009: {
    title: 'PP Nomor 40 Tahun 2009 tentang Perubahan atas PP 51/2008',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-40-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PP_5_2002: {
    title: 'PP Nomor 5 Tahun 2002 tentang Perubahan atas PP 29/1996 (Sewa Tanah/Bangunan)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-5-tahun-2002',
    publisher: 'JDIH Kemenkeu',
  },
  PP_71_2008: {
    title: 'PP Nomor 71 Tahun 2008 tentang Perubahan Ketiga PP 48/1994 (PHTB)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-71-tahun-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PP_140_2000: {
    title: 'PP Nomor 140 Tahun 2000 tentang PPh atas Penghasilan dari Usaha Jasa Konstruksi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-140-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_48_1994: {
    title: 'PP Nomor 48 Tahun 1994 tentang Pembayaran PPh atas Pengalihan Hak Tanah/Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-48-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_79_1999: {
    title: 'PP Nomor 79 Tahun 1999 tentang Perubahan Kedua PP 48/1994 — JDIH BPK RI',
    url: 'https://peraturan.bpk.go.id/Details/54569/pp-no-79-tahun-1999',
    publisher: 'JDIH BPK RI',
  },
  PP_29_1996: {
    title: 'PP Nomor 29 Tahun 1996 tentang PPh atas Persewaan Tanah dan/atau Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-29-tahun-1996',
    publisher: 'JDIH Kemenkeu',
  },
  PP_73_1996: {
    title: 'PP Nomor 73 Tahun 1996 tentang PPh atas Penghasilan dari Usaha Jasa Konstruksi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-73-tahun-1996',
    publisher: 'JDIH Kemenkeu',
  },
  PP_27_1996: {
    title: 'PP Nomor 27 Tahun 1996 tentang Perubahan atas PP 48/1994 (PHTB Final 5%)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-27-tahun-1996',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Final UMKM
  PP_20_2026: {
    title: 'PP Nomor 20 Tahun 2026 tentang Perubahan atas PP Nomor 55 Tahun 2022',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-20-tahun-2026',
    publisher: 'JDIH Kemenkeu',
  },
  PP_20_2026_SETNEG: {
    title: 'PP Nomor 20 Tahun 2026 (Naskah Resmi Peraturan Perundang-undangan)',
    url: 'https://peraturan.go.id/id/pp-no-20-tahun-2026',
    publisher: 'peraturan.go.id',
  },
  PP_20_2026_BPK: {
    title: 'PP Nomor 20 Tahun 2026 — Arsip JDIH BPK RI',
    url: 'https://peraturan.bpk.go.id/Details/349415/pp-no-20-tahun-2026',
    publisher: 'JDIH BPK RI',
  },
  PP_55_2022: {
    title: 'PP Nomor 55 Tahun 2022 tentang Penyesuaian Pengaturan di Bidang Pajak Penghasilan',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-55-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PP_55_2022_SETNEG: {
    title: 'PP Nomor 55 Tahun 2022 (Naskah Resmi Peraturan Perundang-undangan)',
    url: 'https://peraturan.go.id/id/pp-no-55-tahun-2022',
    publisher: 'peraturan.go.id',
  },
  PP_23_2018: {
    title: 'PP Nomor 23 Tahun 2018 tentang PPh atas Penghasilan dari Usaha dengan Peredaran Bruto Tertentu',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-23-tahun-2018',
    publisher: 'JDIH Kemenkeu',
  },
  PP_46_2013: {
    title: 'PP Nomor 46 Tahun 2013 tentang PPh atas Penghasilan dari Usaha dengan Peredaran Bruto Tertentu',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-46-tahun-2013',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 25, 26, 15, Badan
  PMK_81_2024: {
    title: 'PMK Nomor 81 Tahun 2024 tentang Ketentuan Perpajakan dalam Rangka Coretax',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-81-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_215_2018: {
    title: 'PMK Nomor 215/PMK.03/2018 tentang Penghitungan Angsuran PPh Tahun Berjalan (WP Tertentu)',
    url: 'https://jdih.kemenkeu.go.id/dok/215-pmk-03-2018',
    publisher: 'JDIH Kemenkeu',
  },
  KEP_537_2000_DJP: {
    title: 'KEP-537/PJ./2000 tentang Penghitungan Besarnya Angsuran Pajak dalam Hal-Hal Tertentu',
    url: 'https://www.pajak.go.id/id/peraturan/penghitungan-besarnya-angsuran-pajak-dalam-tahun-pajak-berjalan-dalam-hal-hal-tertentu',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PP_9_2021: {
    title: 'PP Nomor 9 Tahun 2021 tentang Perlakuan Perpajakan Mendukung Kemudahan Berusaha',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-9-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_112_2025: {
    title:
      'PMK Nomor 112 Tahun 2025 tentang Tata Cara Penerapan Persetujuan Penghindaran Pajak Berganda (P3B)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-112-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PER_25_PJ_2018_DJP: {
    title:
      'PER-25/PJ/2018 tentang Tata Cara Penerapan Persetujuan Penghindaran Pajak Berganda (Dicabut PMK 112/2025)',
    url: 'https://www.pajak.go.id/sites/default/files/2019-03/PER25PJ2018.pdf',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PP_16_2009: {
    title: 'PP Nomor 16 Tahun 2009 tentang PPh atas Penghasilan Berupa Bunga Obligasi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-16-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_624_1994: {
    title: 'KMK Nomor 624/KMK.04/1994 tentang Pemotongan PPh 26 atas Penghasilan Berupa Premi Asuransi',
    url: 'https://jdih.kemenkeu.go.id/dok/624-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_416_1996: {
    title: 'KMK Nomor 416/KMK.04/1996 tentang Norma Penghitungan Khusus Perusahaan Pelayaran Dalam Negeri',
    url: 'https://jdih.kemenkeu.go.id/dok/416-kmk-04-1996',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_475_1996: {
    title: 'KMK Nomor 475/KMK.04/1996 tentang Norma Penghitungan Khusus Perusahaan Penerbangan Dalam Negeri',
    url: 'https://jdih.kemenkeu.go.id/dok/475-kmk-04-1996',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_417_1996_DJP: {
    title: 'KMK Nomor 417/KMK.04/1996 tentang Norma Penghitungan Khusus Pelayaran/Penerbangan Luar Negeri',
    url: 'https://www.pajak.go.id/id/peraturan/norma-penghitungan-khusus-penghasilan-neto-bagi-wajib-pajak-perusahaan-pelayaran-danatau',
    publisher: 'Direktorat Jenderal Pajak',
  },
  PP_81_2007: {
    title: 'PP Nomor 81 Tahun 2007 tentang Penurunan Tarif PPh WP Badan Dalam Negeri Berbentuk Perseroan Terbuka',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-81-tahun-2007',
    publisher: 'JDIH Kemenkeu',
  },

  // PPN & PPnBM
  PMK_131_2024: {
    title: 'PMK Nomor 131 Tahun 2024 tentang Perlakuan PPN atas Impor & Penyerahan BKP/JKP',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-131-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  UU_42_2009: {
    title: 'UU Nomor 42 Tahun 2009 (Perubahan Ketiga UU PPN dan PPnBM)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-42-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  UU_18_2000: {
    title: 'UU Nomor 18 Tahun 2000 (Perubahan Kedua UU PPN dan PPnBM)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-18-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  UU_11_1994: {
    title: 'UU Nomor 11 Tahun 1994 (Perubahan Pertama UU PPN dan PPnBM)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-11-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  UU_8_1983: {
    title: 'UU Nomor 8 Tahun 1983 tentang Pajak Pertambahan Nilai Barang dan Jasa dan PPnBM',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-8-tahun-1983',
    publisher: 'JDIH Kemenkeu',
  },
  PP_1_1985: {
    title: 'PP Nomor 1 Tahun 1985 tentang Penetapan Mulai Berlakunya UU PPN 1984',
    url: 'https://peraturan.bpk.go.id/Details/64414',
    publisher: 'JDIH BPK RI',
  },
  PP_74_2021: {
    title: 'PP Nomor 74 Tahun 2021 tentang Perubahan atas PP 73/2019 (PPnBM Kendaraan Bermotor)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-74-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PP_73_2019: {
    title: 'PP Nomor 73 Tahun 2019 tentang Barang Kena Pajak Tergolong Mewah Kendaraan Bermotor',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-73-tahun-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_141_2021: {
    title: 'PMK Nomor 141/PMK.010/2021 tentang Penetapan Jenis Kendaraan Bermotor Dikenai PPnBM',
    url: 'https://jdih.kemenkeu.go.id/dok/141-pmk-010-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_96_2021: {
    title: 'PMK Nomor 96/PMK.03/2021 tentang Penetapan BKP Tergolong Mewah Selain Kendaraan Bermotor',
    url: 'https://jdih.kemenkeu.go.id/dok/96-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_15_2023: {
    title: 'PMK Nomor 15/PMK.03/2023 tentang Perubahan atas PMK 96/PMK.03/2021',
    url: 'https://jdih.kemenkeu.go.id/dok/15-pmk-03-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PP_41_2013: {
    title: 'PP Nomor 41 Tahun 2013 tentang BKP Tergolong Mewah Kendaraan Bermotor (LCGC)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-41-tahun-2013',
    publisher: 'JDIH Kemenkeu',
  },
  PP_22_2014: {
    title: 'PP Nomor 22 Tahun 2014 tentang Perubahan atas PP 41/2013',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-22-tahun-2014',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_106_2015: {
    title: 'PMK Nomor 106/PMK.010/2015 tentang Jenis BKP Tergolong Mewah Selain Kendaraan Bermotor',
    url: 'https://jdih.kemenkeu.go.id/dok/106-pmk-010-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_35_2017: {
    title: 'PMK Nomor 35/PMK.010/2017 tentang Perubahan atas PMK 106/PMK.010/2015',
    url: 'https://jdih.kemenkeu.go.id/dok/35-pmk-010-2017',
    publisher: 'JDIH Kemenkeu',
  },
  PP_145_2000: {
    title: 'PP Nomor 145 Tahun 2000 tentang Kelompok BKP Tergolong Mewah yang Dikenakan PPnBM',
    url: 'https://peraturan.bpk.go.id/Details/54029/pp-no-145-tahun-2000',
    publisher: 'JDIH BPK RI',
  },
  PP_12_2006: {
    title: 'PP Nomor 12 Tahun 2006 tentang Perubahan Ketujuh PP 145/2000',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-12-tahun-2006',
    publisher: 'JDIH Kemenkeu',
  },
  PP_50_1994: {
    title: 'PP Nomor 50 Tahun 1994 tentang Pelaksanaan UU PPN 1984 stdd UU 11/1994',
    url: 'https://peraturan.bpk.go.id/Details/57293/pp-no-50-tahun-1994',
    publisher: 'JDIH BPK RI',
  },
  PP_20_1996: {
    title: 'PP Nomor 20 Tahun 1996 tentang Perubahan atas PP 50/1994',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-20-tahun-1996',
    publisher: 'JDIH Kemenkeu',
  },
  PP_59_1999: {
    title: 'PP Nomor 59 Tahun 1999 tentang Perubahan Ketiga atas PP 50/1994 (PPnBM)',
    url: 'https://peraturan.bpk.go.id/Details/54381/pp-no-59-tahun-1999',
    publisher: 'JDIH BPK RI',
  },
  PP_22_1985: {
    title: 'PP Nomor 22 Tahun 1985 tentang Pelaksanaan Undang-Undang Pajak Pertambahan Nilai 1984',
    url: 'https://peraturan.bpk.go.id/Details/64580/pp-no-22-tahun-1985',
    publisher: 'JDIH BPK RI',
  },
  PP_29_1988: {
    title:
      'PP Nomor 29 Tahun 1988 tentang Perubahan atas Pasal 16 PP Nomor 22 Tahun 1985 tentang Pelaksanaan UU PPN 1984',
    url: 'https://peraturan.bpk.go.id/Details/63928/pp-no-29-tahun-1988',
    publisher: 'JDIH BPK RI',
  },
  PP_65_1991: {
    title:
      'PP Nomor 65 Tahun 1991 tentang Perubahan atas PP Nomor 22 Tahun 1985 stdd PP Nomor 29 Tahun 1988',
    url: 'https://peraturan.bpk.go.id/Details/58400/pp-no-65-tahun-1991',
    publisher: 'JDIH BPK RI',
  },
  PP_76_1991: {
    title:
      'PP Nomor 76 Tahun 1991 tentang Perubahan atas PP Nomor 22 Tahun 1985 stdd PP Nomor 65 Tahun 1991',
    url: 'https://peraturan.bpk.go.id/Details/58431/pp-no-76-tahun-1991',
    publisher: 'JDIH BPK RI',
  },
  PP_36_1993: {
    title:
      'PP Nomor 36 Tahun 1993 tentang Perubahan atas PP Nomor 22 Tahun 1985 stdd PP Nomor 76 Tahun 1991',
    url: 'https://peraturan.bpk.go.id/Details/57538/pp-no-36-tahun-1993',
    publisher: 'JDIH BPK RI',
  },

  // Pajak Daerah (PBB, BPHTB, PBJT)
  UU_1_2022_HKPD: {
    title: 'UU Nomor 1 Tahun 2022 tentang Hubungan Keuangan antara Pemerintah Pusat dan Daerah (HKPD)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-1-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  UU_28_2009_PDRD: {
    title: 'UU Nomor 28 Tahun 2009 tentang Pajak Daerah dan Retribusi Daerah (PDRD)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-28-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  UU_12_1994: {
    title: 'UU Nomor 12 Tahun 1994 tentang Perubahan atas UU 12/1985 tentang PBB',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-12-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_25_2002: {
    title: 'PP Nomor 25 Tahun 2002 tentang Penetapan Besarnya Nilai Jual Kena Pajak (NJKP) PBB',
    url: 'https://peraturan.bpk.go.id/Details/52422/pp-no-25-tahun-2002',
    publisher: 'JDIH BPK RI',
  },
  UU_12_1985: {
    title: 'UU Nomor 12 Tahun 1985 tentang Pajak Bumi dan Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-12-tahun-1985',
    publisher: 'JDIH Kemenkeu',
  },
  PP_46_1985: {
    title: 'PP Nomor 46 Tahun 1985 tentang Penetapan Besarnya Persentase NJKP pada PBB',
    url: 'https://peraturan.bpk.go.id/Download/54900/PP%20NO%2046%20TH%201985.pdf',
    publisher: 'JDIH BPK RI',
  },
  UU_20_2000: {
    title: 'UU Nomor 20 Tahun 2000 tentang Perubahan atas UU 21/1997 tentang BPHTB',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-20-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_111_2000: {
    title: 'PP Nomor 111 Tahun 2000 tentang Pengenaan BPHTB Karena Waris dan Hibah Wasiat',
    url: 'https://peraturan.bpk.go.id/Download/43148/PP%20No.111%20TH%202000.pdf',
    publisher: 'JDIH BPK RI',
  },
  UU_21_1997: {
    title: 'UU Nomor 21 Tahun 1997 tentang Bea Perolehan Hak atas Tanah dan Bangunan',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-21-tahun-1997',
    publisher: 'JDIH Kemenkeu',
  },
  UU_1_1998: {
    title: 'UU Nomor 1 Tahun 1998 tentang Penangguhan Mulai Berlakunya UU 21/1997 hingga 1 Juli 1998',
    url: 'https://peraturan.bpk.go.id/Details/45406/uu-no-1-tahun-1998',
    publisher: 'JDIH BPK RI',
  },
  UU_34_2000: {
    title: 'UU Nomor 34 Tahun 2000 tentang Perubahan atas UU 18/1997 tentang Pajak Daerah',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-34-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_65_2001: {
    title: 'PP Nomor 65 Tahun 2001 tentang Pajak Daerah',
    url: 'https://peraturan.bpk.go.id/Details/53062/pp-no-65-tahun-2001',
    publisher: 'JDIH BPK RI',
  },
  UU_18_1997: {
    title: 'UU Nomor 18 Tahun 1997 tentang Pajak Daerah dan Retribusi Daerah',
    url: 'https://peraturan.bpk.go.id/Details/45950/uu-no-18-tahun-1997',
    publisher: 'JDIH BPK RI',
  },
  PP_19_1997: {
    title: 'PP Nomor 19 Tahun 1997 tentang Pajak Daerah',
    url: 'https://peraturan.bpk.go.id/Details/56255/pp-no-19-tahun-1997',
    publisher: 'JDIH BPK RI',
  },

  // Bea Meterai
  UU_10_2020: {
    title: 'UU Nomor 10 Tahun 2020 tentang Bea Meterai',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-10-tahun-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PP_24_2000: {
    title: 'PP Nomor 24 Tahun 2000 tentang Perubahan Tarif Bea Meterai dan Batas Harga Nominal',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-24-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_7_1995: {
    title: 'PP Nomor 7 Tahun 1995 tentang Perubahan Tarif Bea Meterai',
    url: 'https://peraturan.bpk.go.id/Details/57025/pp-no-7-tahun-1995',
    publisher: 'JDIH BPK RI',
  },
  UU_13_1985: {
    title: 'UU Nomor 13 Tahun 1985 tentang Bea Meterai',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-13-tahun-1985',
    publisher: 'JDIH Kemenkeu',
  },

  // Tambahan Regulasi Historis & Terbaru Lintas Jenis Pajak (Audit Kelengkapan 2026)
  // PPh Pasal 21
  PMK_10_2025: {
    title: 'PMK Nomor 10 Tahun 2025 tentang PPh Pasal 21 Ditanggung Pemerintah (DTP) Stimulus Ekonomi 2025',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-10-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_72_2025: {
    title: 'PMK Nomor 72 Tahun 2025 tentang Perubahan atas PMK 10/2025 (Perluasan Sektor PPh 21 DTP 2025)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-72-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_66_2023: {
    title: 'PMK Nomor 66 Tahun 2023 tentang Perlakuan PPh atas Penggantian atau Imbalan dalam Bentuk Natura dan/atau Kenikmatan',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-66-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PP_80_2010: {
    title: 'PP Nomor 80 Tahun 2010 tentang Tarif Pemotongan dan Pengenaan PPh Pasal 21 Beban APBN/APBD',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-80-tahun-2010',
    publisher: 'JDIH Kemenkeu',
  },
  PER_31_PJ_2009: {
    title: 'PER-31/PJ/2009 tentang Pedoman Teknis Tata Cara Pemotongan PPh Pasal 21/26',
    url: 'https://jdih.kemenkeu.go.id/dok/per-31-pj-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PER_31_PJ_2012: {
    title: 'PER-31/PJ/2012 tentang Pedoman Teknis Tata Cara Pemotongan, Penyetoran dan Pelaporan PPh Pasal 21/26',
    url: 'https://jdih.kemenkeu.go.id/dok/per-31-pj-2012',
    publisher: 'JDIH Kemenkeu',
  },
  PER_32_PJ_2015: {
    title: 'PER-32/PJ/2015 tentang Pedoman Teknis Tata Cara Pemotongan, Penyetoran dan Pelaporan PPh Pasal 21/26',
    url: 'https://jdih.kemenkeu.go.id/dok/per-32-pj-2015',
    publisher: 'JDIH Kemenkeu',
  },
  UU_9_1970_PPD: {
    title: 'UU Nomor 9 Tahun 1970 tentang Perubahan dan Tambahan Ordonansi Pajak Pendapatan 1944',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-9-tahun-1970',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 22 & 23
  PMK_50_2025: {
    title: 'PMK Nomor 50 Tahun 2025 tentang PPN dan PPh atas Transaksi Perdagangan Aset Kripto (Berlaku 1 Agustus 2025)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-50-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_68_2022: {
    title: 'PMK Nomor 68/PMK.03/2022 tentang PPN dan PPh atas Transaksi Perdagangan Aset Kripto (Dicabut PMK 50/2025)',
    url: 'https://jdih.kemenkeu.go.id/dok/68-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_58_2022: {
    title: 'PMK Nomor 58/PMK.03/2022 tentang Penunjukan Pihak Lain sebagai Pemungut Pajak Pengadaan Pemerintah (SIPP)',
    url: 'https://jdih.kemenkeu.go.id/dok/58-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_90_2015: {
    title: 'PMK Nomor 90/PMK.03/2015 tentang Perubahan atas PMK 253/PMK.03/2008 (Barang Sangat Mewah)',
    url: 'https://jdih.kemenkeu.go.id/dok/90-pmk-03-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_69_2022: {
    title: 'PMK Nomor 69/PMK.03/2022 tentang Pajak Penghasilan dan PPN atas Penyelenggaraan Teknologi Finansial (Fintech)',
    url: 'https://jdih.kemenkeu.go.id/dok/69-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  KEP_128_PJ_1997: {
    title: 'KEP-128/PJ./1997 tentang Jenis Jasa Lain dan Perkiraan Penghasilan Neto PPh Pasal 23',
    url: 'https://jdih.kemenkeu.go.id/dok/kep-128-pj-1997',
    publisher: 'JDIH Kemenkeu',
  },
  KEP_02_PJ_1995: {
    title: 'KEP-02/PJ./1995 tentang Petunjuk Pelaksanaan Pemotongan PPh Pasal 21 dan Pasal 26',
    url: 'https://jdih.kemenkeu.go.id/dok/kep-02-pj-1995',
    publisher: 'JDIH Kemenkeu',
  },

  // PPh Pasal 4(2) Final
  PP_131_2000: {
    title: 'PP Nomor 131 Tahun 2000 tentang PPh atas Bunga Deposito dan Tabungan serta Diskonto SBI',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-131-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_123_2015: {
    title: 'PP Nomor 123 Tahun 2015 tentang Perubahan atas PP 131/2000 (Insentif PPh Deposito Devisa Hasil Ekspor)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-123-tahun-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PP_51_1994: {
    title: 'PP Nomor 51 Tahun 1994 tentang PPh atas Bunga Deposito dan Tabungan serta Diskonto SBI',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-51-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_91_2021: {
    title: 'PP Nomor 91 Tahun 2021 tentang PPh atas Penghasilan Berupa Bunga Obligasi yang Diterima WPDN dan BUT',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-91-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PP_55_2019: {
    title: 'PP Nomor 55 Tahun 2019 tentang Perubahan Kedua atas PP 16/2009 tentang PPh Bunga Obligasi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-55-tahun-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PP_139_2000: {
    title: 'PP Nomor 139 Tahun 2000 tentang PPh atas Penghasilan Berupa Bunga Obligasi yang Diperdagangkan di Bursa',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-139-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_41_1994: {
    title: 'PP Nomor 41 Tahun 1994 tentang PPh atas Penghasilan dari Transaksi Penjualan Saham di Bursa Efek',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-41-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_14_1997: {
    title: 'PP Nomor 14 Tahun 1997 tentang Perubahan atas PP 41/1994 (Tambahan 0,5% Saham Pendiri)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-14-tahun-1997',
    publisher: 'JDIH Kemenkeu',
  },
  PP_19_2009: {
    title: 'PP Nomor 19 Tahun 2009 tentang PPh atas Dividen yang Diterima Wajib Pajak Orang Pribadi Dalam Negeri',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-19-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_18_2021: {
    title: 'PMK Nomor 18/PMK.03/2021 tentang Pelaksanaan UU Cipta Kerja di Bidang PPh, PPN/PPnBM, serta KUP (Reinvestasi Dividen)',
    url: 'https://jdih.kemenkeu.go.id/dok/18-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PP_132_2000: {
    title: 'PP Nomor 132 Tahun 2000 tentang PPh atas Hadiah Undian (Tarif Final 25%)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-132-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PP_42_1994: {
    title: 'PP Nomor 42 Tahun 1994 tentang PPh atas Hadiah Undian (Dicabut PP 132/2000)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-42-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_15_2009: {
    title: 'PP Nomor 15 Tahun 2009 tentang PPh atas Bunga Simpanan Koperasi Kepada Anggota Orang Pribadi',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-15-tahun-2009',
    publisher: 'JDIH Kemenkeu',
  },

  // UMKM / NPPN, PPh 25, 26, 15, Badan
  KEP_536_PJ_2000: {
    title: 'KEP-536/PJ./2000 tentang Norma Penghitungan Penghasilan Neto (NPPN)',
    url: 'https://jdih.kemenkeu.go.id/dok/kep-536-pj-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PER_17_PJ_2015: {
    title: 'PER-17/PJ/2015 tentang Norma Penghitungan Penghasilan Neto (NPPN)',
    url: 'https://jdih.kemenkeu.go.id/dok/per-17-pj-2015',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_522_2000: {
    title: 'KMK Nomor 522/KMK.04/2000 tentang Penghitungan Angsuran PPh WP Tertentu & OPPT',
    url: 'https://jdih.kemenkeu.go.id/dok/522-kmk-04-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_255_2008: {
    title: 'PMK Nomor 255/PMK.03/2008 tentang Penghitungan Besarnya Angsuran PPh dalam Tahun Berjalan WP Tertentu',
    url: 'https://jdih.kemenkeu.go.id/dok/255-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_208_2009: {
    title: 'PMK Nomor 208/PMK.03/2009 tentang Perubahan atas PMK 255/PMK.03/2008 (Angsuran OPPT 0,75%)',
    url: 'https://jdih.kemenkeu.go.id/dok/208-pmk-03-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PP_80_2008: {
    title: 'PP Nomor 80 Tahun 2008 tentang PPh Bagi WP Orang Pribadi Dalam Negeri yang Bertolak ke Luar Negeri (FLN)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-80-tahun-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PER_61_PJ_2009: {
    title: 'PER-61/PJ/2009 tentang Tata Cara Penerapan Persetujuan Penghindaran Pajak Berganda (P3B)',
    url: 'https://jdih.kemenkeu.go.id/dok/per-61-pj-2009',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_14_2011: {
    title: 'PMK Nomor 14/PMK.03/2011 tentang Perlakuan Perpajakan atas Penghasilan Kena Pajak Sesudah Pajak dari BUT',
    url: 'https://jdih.kemenkeu.go.id/dok/14-pmk-03-2011',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_258_2008: {
    title: 'PMK Nomor 258/PMK.03/2008 tentang Pemotongan PPh Pasal 26 atas Penjualan/Pengalihan Saham SPC Pasal 18(3c)',
    url: 'https://jdih.kemenkeu.go.id/dok/258-pmk-03-2008',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_634_1994: {
    title: 'KMK Nomor 634/KMK.04/1994 tentang Norma Penghitungan Khusus Bagi WPLN dengan Kantor Perwakilan Dagang',
    url: 'https://jdih.kemenkeu.go.id/dok/634-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KEP_667_PJ_2001: {
    title: 'KEP-667/PJ./2001 tentang Norma Penghitungan Khusus Penghasilan Neto Bagi Kantor Perwakilan Dagang Asing (0,44%)',
    url: 'https://jdih.kemenkeu.go.id/dok/kep-667-pj-2001',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_543_2002: {
    title: 'KMK Nomor 543/KMK.03/2002 tentang Norma Penghitungan Khusus Jasa Maklon Internasional Produksi Mainan Anak',
    url: 'https://jdih.kemenkeu.go.id/dok/543-kmk-03-2002',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_181_1995: {
    title: 'KMK Nomor 181/KMK.04/1995 tentang Norma Penghitungan Khusus Usaha Pelayaran dan/atau Penerbangan',
    url: 'https://jdih.kemenkeu.go.id/dok/181-kmk-04-1995',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_136_2024: {
    title: 'PMK Nomor 136 Tahun 2024 tentang Pengenaan Pajak Minimum Global Berdasarkan Kesepakatan Internasional (Pilar 2)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-136-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PP_30_2020: {
    title: 'PP Nomor 30 Tahun 2020 tentang Penurunan Tarif PPh Bagi Wajib Pajak Badan Dalam Negeri Berbentuk Perseroan Terbuka',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-30-tahun-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PP_77_2013: {
    title: 'PP Nomor 77 Tahun 2013 tentang Penurunan Tarif PPh Bagi Wajib Pajak Badan Perseroan Terbuka',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-77-tahun-2013',
    publisher: 'JDIH Kemenkeu',
  },
  PP_78_2019: {
    title: 'PP Nomor 78 Tahun 2019 tentang Fasilitas PPh untuk Penanaman Modal di Bidang/Daerah Tertentu (Tax Allowance)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-78-tahun-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_130_2020: {
    title: 'PMK Nomor 130/PMK.010/2020 tentang Pemberian Fasilitas Pengurangan PPh Badan (Tax Holiday)',
    url: 'https://jdih.kemenkeu.go.id/dok/130-pmk-010-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_69_2024: {
    title: 'PMK Nomor 69 Tahun 2024 tentang Perubahan atas PMK 130/2020 (Perpanjangan Tax Holiday & Klausul GMT)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-69-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PP_45_2019: {
    title: 'PP Nomor 45 Tahun 2019 tentang Penghitungan Penghasilan Kena Pajak (Super Deduction R&D 300% & Vokasi 200%)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-45-tahun-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_72_2023: {
    title: 'PMK Nomor 72 Tahun 2023 tentang Penyusutan Harta Berwujud dan/atau Amortisasi Harta Tak Berwujud',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-72-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  UU_8_1970_PPS: {
    title: 'UU Nomor 8 Tahun 1970 tentang Perubahan dan Tambahan Ordonansi Pajak Perseroan 1925',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-8-tahun-1970',
    publisher: 'JDIH Kemenkeu',
  },

  // PPN, PPnBM, PBB, Daerah, & Bea Meterai
  PMK_11_2025: {
    title: 'PMK Nomor 11 Tahun 2025 tentang Ketentuan Nilai Lain sebagai DPP dan Besaran Tertentu PPN',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-11-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_60_2022: {
    title: 'PMK Nomor 60/PMK.03/2022 tentang Tata Cara Penunjukan Pemungut, Pemungutan, Penyetoran & Pelaporan PPN PMSE',
    url: 'https://jdih.kemenkeu.go.id/dok/60-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_48_2020: {
    title: 'PMK Nomor 48/PMK.03/2020 tentang PPN atas Pemanfaatan BKP Tidak Berwujud/JKP Luar Daerah Pabean via PMSE',
    url: 'https://jdih.kemenkeu.go.id/dok/48-pmk-03-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_197_2013: {
    title: 'PMK Nomor 197/PMK.03/2013 tentang Perubahan atas PMK 68/PMK.03/2010 (Batasan Pengusaha Kecil PPN Rp 4,8 M)',
    url: 'https://jdih.kemenkeu.go.id/dok/197-pmk-03-2013',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_68_2010: {
    title: 'PMK Nomor 68/PMK.03/2010 tentang Batasan Pengusaha Kecil PPN (Rp 600 Juta)',
    url: 'https://jdih.kemenkeu.go.id/dok/68-pmk-03-2010',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_164_2023: {
    title: 'PMK Nomor 164 Tahun 2023 tentang Tata Cara Pengenaan PPh Usaha Beromzet Tertentu dan Pengukuhan PKP',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-164-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  UU_DARURAT_19_1951: {
    title: 'UU Darurat Nomor 19 Tahun 1951 tentang Pemungutan Pajak Penjualan (PPn 1951)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-darurat-19-tahun-1951',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_12_2025: {
    title: 'PMK Nomor 12 Tahun 2025 tentang PPN DTP KBLBB & PPnBM DTP 3% Kendaraan Emisi Karbon Rendah (Hybrid) TA 2025',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-12-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_9_2024: {
    title: 'PMK Nomor 9 Tahun 2024 tentang PPnBM Ditanggung Pemerintah atas KBLBB Roda Empat CBU/CKD Tertentu TA 2024',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-9-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_20_2021: {
    title: 'PMK Nomor 20/PMK.010/2021 tentang PPnBM DTP Kendaraan Bermotor Tertentu TA 2021',
    url: 'https://jdih.kemenkeu.go.id/dok/20-pmk-010-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_31_2021: {
    title: 'PMK Nomor 31/PMK.010/2021 tentang PPnBM DTP Kendaraan Bermotor (Perluasan s.d. 2.500 cc) TA 2021',
    url: 'https://jdih.kemenkeu.go.id/dok/31-pmk-010-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_5_2022: {
    title: 'PMK Nomor 5/PMK.010/2022 tentang PPnBM DTP Kendaraan Bermotor Tertentu (LCGC & Mobil Terjangkau) TA 2022',
    url: 'https://jdih.kemenkeu.go.id/dok/5-pmk-010-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_620_2004: {
    title: 'PMK Nomor 620/PMK.03/2004 tentang Jenis BKP Tergolong Mewah Selain Kendaraan Bermotor',
    url: 'https://jdih.kemenkeu.go.id/dok/620-pmk-03-2004',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_186_2019: {
    title: 'PMK Nomor 186/PMK.03/2019 tentang Klasifikasi Objek Pajak dan Tata Cara Penetapan NJOP PBB (PBB-P3)',
    url: 'https://jdih.kemenkeu.go.id/dok/186-pmk-03-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_234_2022: {
    title: 'PMK Nomor 234/PMK.03/2022 tentang Perubahan atas PMK 186/PMK.03/2019 (Penyelarasan PBB-P3 & UU HKPD)',
    url: 'https://jdih.kemenkeu.go.id/dok/234-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_23_2014: {
    title: 'PMK Nomor 23/PMK.03/2014 tentang Penyesuaian Besarnya NJOPTKP PBB (Rp 12 Juta PBB-P3)',
    url: 'https://jdih.kemenkeu.go.id/dok/23-pmk-03-2014',
    publisher: 'JDIH Kemenkeu',
  },
  PP_46_2000: {
    title: 'PP Nomor 46 Tahun 2000 tentang Penetapan Besarnya NJKP pada PBB (20% dan 40%)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-46-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_201_2000: {
    title: 'KMK Nomor 201/KMK.04/2000 tentang Penyesuaian Besarnya NJOPTKP sebagai Dasar Penghitungan PBB',
    url: 'https://jdih.kemenkeu.go.id/dok/201-kmk-04-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PERPU_11_1959_IPEDA: {
    title: 'Perpu Nomor 11 Tahun 1959 tentang Pajak Hasil Bumi (Landasan Historis IPEDA Pra-UU PBB)',
    url: 'https://jdih.kemenkeu.go.id/dok/perpu-11-tahun-1959',
    publisher: 'JDIH Kemenkeu',
  },
  PP_35_2023: {
    title: 'PP Nomor 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah (Pelaksana UU HKPD)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-35-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  UU_DARURAT_11_1957: {
    title: 'UU Darurat Nomor 11 Tahun 1957 jo. UU 1/1961 tentang Peraturan Umum Pajak Daerah',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-darurat-11-tahun-1957',
    publisher: 'JDIH Kemenkeu',
  },
  UU_1_1961: {
    title: 'UU Nomor 1 Tahun 1961 tentang Penetapan UU Darurat Pajak Daerah Menjadi Undang-Undang',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-1-tahun-1961',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_78_2024: {
    title: 'PMK Nomor 78 Tahun 2024 tentang Ketentuan Pelaksanaan Bea Meterai (Mencabut PMK 134/2021)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-78-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PP_86_2021: {
    title: 'PP Nomor 86 Tahun 2021 tentang Pengadaan, Pengelolaan, dan Penjualan Meterai',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-86-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PP_3_2022: {
    title: 'PP Nomor 3 Tahun 2022 tentang Pemberian Fasilitas Pembebasan dari Pengenaan Bea Meterai',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-3-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_134_2021: {
    title: 'PMK Nomor 134/PMK.03/2021 tentang Pembayaran Bea Meterai & Pemeteraian Kemudian (Dicabut PMK 78/2024)',
    url: 'https://jdih.kemenkeu.go.id/dok/134-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },

  // Tambahan Rujukan Kelengkapan Bagian B (Aturan Khusus Terkini & Jejak Historis Pra-1984 / Pra-2010)
  PMK_13_2025: {
    title: 'PMK Nomor 13 Tahun 2025 tentang PPN Ditanggung Pemerintah atas Penyerahan Rumah Tapak & Satuan Rumah Susun TA 2025',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-13-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_61_2024: {
    title: 'PMK Nomor 61 Tahun 2024 tentang PPN Ditanggung Pemerintah Rumah Tapak & Rusun Periode September–Desember 2024',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-61-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_7_2024: {
    title: 'PMK Nomor 7 Tahun 2024 tentang PPN Ditanggung Pemerintah atas Penyerahan Rumah Tapak & Satuan Rumah Susun TA 2024',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-7-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_8_2024: {
    title: 'PMK Nomor 8 Tahun 2024 tentang PPN Ditanggung Pemerintah atas Penyerahan KBLBB Roda Empat dan Bus Tertentu TA 2024',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-8-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PP_49_2022: {
    title: 'PP Nomor 49 Tahun 2022 tentang PPN Dibebaskan dan PPN/PPnBM Tidak Dipungut atas Impor/Penyerahan BKP & JKP Strategis',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-49-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_571_2003: {
    title: 'KMK Nomor 571/KMK.03/2003 tentang Perubahan atas KMK 552/KMK.04/2000 (Batasan Pengusaha Kecil PPN Rp 600 Juta)',
    url: 'https://jdih.kemenkeu.go.id/dok/571-kmk-03-2003',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_552_2000: {
    title: 'KMK Nomor 552/KMK.04/2000 tentang Batasan Pengusaha Kecil Pajak Pertambahan Nilai (Rp 360 Jt BKP / Rp 180 Jt JKP)',
    url: 'https://jdih.kemenkeu.go.id/dok/552-kmk-04-2000',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_648_1994: {
    title: 'KMK Nomor 648/KMK.04/1994 tentang Batasan Pengusaha Kecil PPN (Rp 240 Jt BKP / Rp 120 Jt JKP)',
    url: 'https://jdih.kemenkeu.go.id/dok/648-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  UU_8_1967: {
    title: 'UU Nomor 8 Tahun 1967 tentang Perubahan Tata Cara Pemungutan PPd 1944, PKk 1932, dan PPs 1925 (MPS & MPO)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-8-tahun-1967',
    publisher: 'JDIH Kemenkeu',
  },
  UU_10_1970_PBDR: {
    title: 'UU Nomor 10 Tahun 1970 tentang Perubahan Ordonansi Pajak Dividen 1959 (Pajak atas Bunga, Dividen, dan Royalty / PBDR)',
    url: 'https://jdih.kemenkeu.go.id/dok/uu-10-tahun-1970',
    publisher: 'JDIH Kemenkeu',
  },
  PP_27_2008: {
    title: 'PP Nomor 27 Tahun 2008 tentang Pajak Penghasilan atas Diskonto Surat Perbendaharaan Negara (SPN)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-27-tahun-2008',
    publisher: 'JDIH Kemenkeu',
  },
  PP_36_2023: {
    title: 'PP Nomor 36 Tahun 2023 tentang Devisa Hasil Ekspor dari Kegiatan Pengusahaan, Pengelolaan, dan/atau Pengolahan SDA',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-36-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PP_8_2025: {
    title: 'PP Nomor 8 Tahun 2025 tentang Perubahan atas PP 36/2023 (Penempatan DHE SDA 100% Selama 12 Bulan)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-8-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PP_42_2000: {
    title: 'PP Nomor 42 Tahun 2000 tentang Pembayaran PPh Orang Pribadi yang Akan Bertolak ke Luar Negeri (Fiskal Luar Negeri)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-42-tahun-2000',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_82_2009: {
    title: 'PMK Nomor 82/PMK.03/2009 tentang Pemotongan PPh Pasal 26 atas Penghasilan Penjualan/Pengalihan Harta di Indonesia oleh WPLN',
    url: 'https://jdih.kemenkeu.go.id/dok/82-pmk-03-2009',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_628_1991: {
    title: 'KMK Nomor 628/KMK.04/1991 tentang Norma Penghitungan Khusus BUT Perusahaan Pengeboran Minyak dan Gas Bumi Asing',
    url: 'https://jdih.kemenkeu.go.id/dok/628-kmk-04-1991',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_60_2025: {
    title: 'PMK Nomor 60 Tahun 2025 tentang PPN Ditanggung Pemerintah Rumah Tapak & Rusun Periode 1 Juli–31 Desember 2025 (100%)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-60-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_18_2025: {
    title: 'PMK Nomor 18 Tahun 2025 tentang PPN DTP Jasa Angkutan Udara Niaga Berjadwal Dalam Negeri Kelas Ekonomi (Lebaran 2025)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-18-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_36_2025: {
    title: 'PMK Nomor 36 Tahun 2025 tentang PPN DTP Jasa Angkutan Udara Niaga Berjadwal Dalam Negeri Kelas Ekonomi (Libur Sekolah 2025)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-36-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_71_2025: {
    title: 'PMK Nomor 71 Tahun 2025 tentang PPN DTP Jasa Angkutan Udara Niaga Berjadwal Dalam Negeri Kelas Ekonomi (Nataru 2025/2026)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-71-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },

  // Tambahan Rujukan Aturan 2026, Historis Pra-2000, dan Rezim Sektoral Khusus
  PMK_105_2025: {
    title: 'PMK Nomor 105 Tahun 2025 tentang PPh Pasal 21 Ditanggung Pemerintah Stimulus Ekonomi Tahun Anggaran 2026',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-105-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PP_45_1994: {
    title: 'PP Nomor 45 Tahun 1994 tentang PPh Pejabat Negara, PNS, ABRI, & Pensiunan atas Penghasilan Keuangan Negara/Daerah',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-45-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_636_1994: {
    title: 'KMK Nomor 636/KMK.04/1994 tentang Pemotongan PPh Pasal 21 atas Honorarium dan Imbalan Lain APBN/APBD',
    url: 'https://jdih.kemenkeu.go.id/dok/636-kmk-04-1994',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_600_1995: {
    title: 'KMK Nomor 600/KMK.04/1995 tentang Pemotongan PPh Pasal 21 Final atas Uang Pesangon, Tebusan Pensiun, dan THT',
    url: 'https://jdih.kemenkeu.go.id/dok/600-kmk-04-1995',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_462_1998: {
    title: 'KMK Nomor 462/KMK.04/1998 tentang Pemotongan PPh Pasal 21 Final atas Uang Pesangon (Batas Bebas Rp 17,28 Juta)',
    url: 'https://jdih.kemenkeu.go.id/dok/462-kmk-04-1998',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_16_2016: {
    title: 'PMK Nomor 16/PMK.010/2016 tentang Pemungutan PPh Pasal 22 Sektor Kehutanan, Perkebunan, Pertanian, & Perikanan (0,25%)',
    url: 'https://jdih.kemenkeu.go.id/dok/16-pmk-010-2016',
    publisher: 'JDIH Kemenkeu',
  },
  PP_40_2016: {
    title: 'PP Nomor 40 Tahun 2016 tentang PPh atas Penghasilan dari Pengalihan Real Estat dalam Skema KIK-DIRE (0,5% Final)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-40-tahun-2016',
    publisher: 'JDIH Kemenkeu',
  },
  PP_4_1995: {
    title: 'PP Nomor 4 Tahun 1995 tentang PPh Perusahaan Modal Ventura dari Penjualan Saham Perusahaan Pasangan Usaha (0,1% Final)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-4-tahun-1995',
    publisher: 'JDIH Kemenkeu',
  },
  PP_11_1967: {
    title: 'PP Nomor 11 Tahun 1967 tentang Pelaksanaan UU Nomor 8 Tahun 1967 mengenai Tata Cara Pemungutan Pajak MPS & MPO',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-11-tahun-1967',
    publisher: 'JDIH Kemenkeu',
  },
  PP_46_1994: {
    title: 'PP Nomor 46 Tahun 1994 tentang Pembayaran PPh Orang Pribadi Bertolak ke Luar Negeri (Fiskal Luar Negeri 1995–1998)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-46-tahun-1994',
    publisher: 'JDIH Kemenkeu',
  },
  PP_17_1998: {
    title: 'PP Nomor 17 Tahun 1998 tentang Perubahan atas PP 46/1994 mengenai Tarif Fiskal Luar Negeri (1998–2000)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-17-tahun-1998',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_35_2019: {
    title: 'PMK Nomor 35/PMK.03/2019 tentang Penentuan Bentuk Usaha Tetap (BUT)',
    url: 'https://jdih.kemenkeu.go.id/dok/35-pmk-03-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_169_2015: {
    title: 'PMK Nomor 169/PMK.010/2015 tentang Penentuan Besarnya Perbandingan Antara Utang dan Modal Perusahaan (DER 4:1)',
    url: 'https://jdih.kemenkeu.go.id/dok/169-pmk-010-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PP_15_2022: {
    title: 'PP Nomor 15 Tahun 2022 tentang Perlakuan Perpajakan dan/atau PNBP di Bidang Usaha Pertambangan Batubara',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-15-tahun-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PP_18_2025: {
    title: 'PP Nomor 18 Tahun 2025 tentang Perubahan atas PP 15/2022 mengenai Perlakuan Perpajakan & PNBP Pertambangan Batubara',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-18-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PP_37_2018: {
    title: 'PP Nomor 37 Tahun 2018 tentang Perlakuan Perpajakan dan/atau PNBP di Bidang Usaha Pertambangan Mineral',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-37-tahun-2018',
    publisher: 'JDIH Kemenkeu',
  },
  PP_53_2017: {
    title: 'PP Nomor 53 Tahun 2017 tentang Perlakuan Perpajakan Kegiatan Usaha Hulu Migas Kontrak Bagi Hasil Gross Split',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-53-tahun-2017',
    publisher: 'JDIH Kemenkeu',
  },
  PP_12_2023: {
    title: 'PP Nomor 12 Tahun 2023 tentang Pemberian Perizinan Berusaha, Kemudahan Berusaha, & Fasilitas Penanaman Modal di IKN',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-12-tahun-2023',
    publisher: 'JDIH Kemenkeu',
  },
  PP_29_2024: {
    title: 'PP Nomor 29 Tahun 2024 tentang Perubahan atas PP 12/2023 (Penguatan Fasilitas Fiskal IKN & Daerah Mitra)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-29-tahun-2024',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_1_2026: {
    title: 'PMK Nomor 1 Tahun 2026 tentang Perubahan Keempat atas PMK 81/2024 dalam rangka Pelaksanaan Coretax',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-1-tahun-2026',
    publisher: 'JDIH Kemenkeu',
  },
  PER_12_PJ_2026: {
    title: 'PER-12/PJ/2026 tentang Perubahan atas PER-11/PJ/2025 mengenai Ketentuan Pelaporan Pajak pada Coretax',
    url: 'https://jdih.kemenkeu.go.id/dok/per-12-pj-2026',
    publisher: 'JDIH Kemenkeu / DJP',
  },
  PMK_90_2025: {
    title: 'PMK Nomor 90 Tahun 2025 tentang PPN Ditanggung Pemerintah atas Penyerahan Rumah Tapak & Rusun Tahun Anggaran 2026',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-90-tahun-2025',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_4_2026: {
    title: 'PMK Nomor 4 Tahun 2026 tentang PPN DTP 100% Tiket Pesawat Ekonomi Domestik (Idulfitri 1447 H / 2026)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-4-tahun-2026',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_43_2026: {
    title: 'PMK Nomor 43 Tahun 2026 tentang PPN DTP 100% Tiket Pesawat Ekonomi Domestik (Libur Sekolah 2026)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-43-tahun-2026',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_77_2026: {
    title: 'PMK Nomor 77 Tahun 2026 tentang PPN DTP 100% Tiket Pesawat Ekonomi Domestik (Nataru 2026/2027)',
    url: 'https://jdih.kemenkeu.go.id/dok/pmk-77-tahun-2026',
    publisher: 'JDIH Kemenkeu',
  },
  PP_81_2015: {
    title: 'PP Nomor 81 Tahun 2015 tentang Impor dan/atau Penyerahan BKP Tertentu yang Bersifat Strategis yang Dibebaskan PPN',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-81-tahun-2015',
    publisher: 'JDIH Kemenkeu',
  },
  PP_48_2020: {
    title: 'PP Nomor 48 Tahun 2020 tentang Perubahan atas PP 81/2015 (BKP Strategis Dibebaskan PPN)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-48-tahun-2020',
    publisher: 'JDIH Kemenkeu',
  },
  PP_12_2001: {
    title: 'PP Nomor 12 Tahun 2001 tentang Impor dan/atau Penyerahan BKP Tertentu yang Bersifat Strategis yang Dibebaskan PPN',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-12-tahun-2001',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_163_2012: {
    title: 'PMK Nomor 163/PMK.03/2012 tentang Batasan dan Tata Cara Pengenaan PPN atas Kegiatan Membangun Sendiri (KMS 2%)',
    url: 'https://jdih.kemenkeu.go.id/dok/163-pmk-03-2012',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_61_2022: {
    title: 'PMK Nomor 61/PMK.03/2022 tentang Pajak Pertambahan Nilai atas Kegiatan Membangun Sendiri (KMS 2,2%)',
    url: 'https://jdih.kemenkeu.go.id/dok/61-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_64_2022: {
    title: 'PMK Nomor 64/PMK.03/2022 tentang PPN atas Penyerahan Barang Hasil Pertanian Tertentu (Besaran Tertentu 1,1%)',
    url: 'https://jdih.kemenkeu.go.id/dok/64-pmk-03-2022',
    publisher: 'JDIH Kemenkeu',
  },
  PP_40_2021: {
    title: 'PP Nomor 40 Tahun 2021 tentang Penyelenggaraan Kawasan Ekonomi Khusus (Fasilitas PPN Tidak Dipungut KEK)',
    url: 'https://jdih.kemenkeu.go.id/dok/pp-40-tahun-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_120_2019: {
    title: 'PMK Nomor 120/PMK.03/2019 tentang Tata Cara Pengajuan & Penyelesaian Permintaan Kembali PPN Turis Asing (VAT Refund)',
    url: 'https://jdih.kemenkeu.go.id/dok/120-pmk-03-2019',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_139_2014: {
    title: 'PMK Nomor 139/PMK.03/2014 tentang Klasifikasi dan Penetapan NJOP Sebagai Dasar Pengenaan PBB (PBB-P3)',
    url: 'https://jdih.kemenkeu.go.id/dok/139-pmk-03-2014',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_76_2013: {
    title: 'PMK Nomor 76/PMK.03/2013 tentang Penatausahaan PBB Sektor Pertambangan Minyak Bumi, Gas Bumi, dan Panas Bumi',
    url: 'https://jdih.kemenkeu.go.id/dok/76-pmk-03-2013',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_122_2019: {
    title: 'PMK Nomor 122/PMK.03/2019 tentang Fasilitas PPN/PPnBM, PBB, dan Perlakuan Perpajakan Hulu Migas',
    url: 'https://jdih.kemenkeu.go.id/dok/122-pmk-03-2019',
    publisher: 'JDIH Kemenkeu',
  },
  KMK_561_2004: {
    title: 'KMK Nomor 561/KMK.04/2004 tentang Pemberian Pengurangan Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB)',
    url: 'https://jdih.kemenkeu.go.id/dok/561-kmk-04-2004',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_91_2006: {
    title: 'PMK Nomor 91/PMK.03/2006 tentang Perubahan Kedua atas KMK 561/KMK.04/2004 (Pengurangan BPHTB)',
    url: 'https://jdih.kemenkeu.go.id/dok/91-pmk-03-2006',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_4_2021: {
    title: 'PMK Nomor 4/PMK.03/2021 tentang Pembayaran Bea Meterai, Ciri Meterai Tempel, dan Pemeteraian Kemudian',
    url: 'https://jdih.kemenkeu.go.id/dok/4-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
  PMK_151_2021: {
    title: 'PMK Nomor 151/PMK.03/2021 tentang Penetapan Pemungut Bea Meterai serta Tata Cara Pemungutan & Penyetoran',
    url: 'https://jdih.kemenkeu.go.id/dok/151-pmk-03-2021',
    publisher: 'JDIH Kemenkeu',
  },
} satisfies Record<string, TaxSource>;
