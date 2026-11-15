import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_btki_2022',
  taxType: 'bea_masuk',
  name: 'BTKI 2022 & Tarif MFN (PMK 26/2022 stdd PMK 62/2025, PMK 50/2026 & PMK 68/2026)',
  shortName: '2022–Kini (BTKI 2022)',
  legalBasis:
    'Pasal 12 UU Nomor 10 Tahun 1995 jo. UU Nomor 17 Tahun 2006, PMK Nomor 26/PMK.010/2022 stdd PMK 10/2024, PMK 62/2025, PMK 50/2026 & PMK 68/2026',
  effectivePeriod: '1 April 2022 – Sekarang (Perubahan Ke-4 per 9 Okt 2026)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (BTKI 2022 / PMK 68/2026)',
  summary:
    'Sistem klasifikasi HS/AHTN 2022 (8 digit) dan pembebanan tarif Bea Masuk MFN ad valorem (umumnya 0%–40%) maupun tarif spesifik per satuan; diperbarui s.d. PMK 50/2026 (0% MRO pesawat & LPG) dan PMK 68/2026 (Pasal 4B 0% bahan baku plastik 6 bulan), dengan catatan insentif EV 0% CBU berakhir 31 Desember 2025.',
  sources: [
    SRC.PMK_26_2022,
    SRC.PMK_10_2024,
    SRC.PMK_62_2025,
    SRC.PMK_50_2026,
    SRC.PMK_68_2026,
    SRC.UU_17_2006,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-btki-2022',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'BTKI 2022, Tarif MFN Ad Valorem vs Spesifik, Sunset EV 2025, & Insentif 2026 (PMK 50/2026 – PMK 68/2026)',
  legalBasis:
    'Pasal 12 UU Kepabeanan, PMK Nomor 26/PMK.010/2022 stdd PMK 10/2024, PMK 62/2025, PMK 50/2026 & PMK 68/2026',
  effectiveDate: '1 April 2022 (Pembaruan Terakhir PMK 68/2026 per 9 Oktober 2026)',
  readMinutes: 6,
  summary:
    'Buku Tarif Kepabeanan Indonesia (BTKI) 2022 menjadi pedoman pos tarif impor nasional berbasis HS & AHTN 2022 hingga Perubahan Keempat (PMK 68/2026). Bea Masuk dihitung menggunakan persentase ad valorem atas Nilai Pabean (CIF) atau tarif spesifik per satuan serta membentuk Nilai Impor sebagai DPP PPN dan PPh 22.',
  sections: [
    {
      heading: 'Struktur pos tarif 8 digit HS/AHTN 2022 dan batas maksimal 40%',
      paragraphs: [
        'Sejak 1 April 2022, PMK Nomor 26/PMK.010/2022 mengadopsi Harmonized System (HS) 2022 dan ASEAN Harmonized Tariff Nomenclature (AHTN) 2022 ke dalam struktur klasifikasi 8 digit (lebih dari 11.500 pos tarif). Pembebanan Bea Masuk umum atau Most Favoured Nation (MFN) mengikuti Pasal 12 ayat (1) UU Kepabeanan dengan pagu maksimal 40% dari Nilai Pabean, kecuali produk pertanian tertentu dalam Schedule XXI GATT/WTO (seperti beras atau gula dengan tarif spesifik/tinggi) maupun pengenaan Bea Masuk Tambahan.',
        'Bea Masuk yang terutang tidak berdiri sendiri, melainkan langsung ditambahkan ke Nilai Pabean (CIF) untuk membentuk Nilai Impor (Nilai Impor = CIF + Bea Masuk). Nilai Impor inilah yang kemudian menjadi Dasar Pengenaan Pajak (DPP) untuk menghitung PPN Impor dan PPh Pasal 22 Impor pada Pemberitahuan Impor Barang (PIB / BC 2.0).',
      ],
    },
    {
      heading: 'Sunset KBLBB/EV 2025 vs Insentif Tarif 0% Tahun 2026 (PMK 50/2026 & PMK 68/2026)',
      paragraphs: [
        'Melalui PMK Nomor 10 Tahun 2024 jo. Pasal 4A ayat (2) PMK Nomor 62 Tahun 2025 (Perubahan Kedua, efektif 15 September 2025), pemerintah memberikan tarif Bea Masuk MFN 0% bagi kendaraan bermotor listrik berbasis baterai (KBLBB/EV) CBU/CKD tertentu dengan persetujuan BKPM terbatas hingga 31 Desember 2025; sejak 1 Januari 2026 impor CBU KBLBB kembali mengikuti tarif MFN BTKI normal.',
        'Sebagai pembaruan pada tahun 2026, PMK Nomor 50 Tahun 2026 (Perubahan Ketiga, efektif 28 Juli 2026) menetapkan tarif Bea Masuk 0% bagi industri pemeliharaan pesawat udara (MRO) dan bahan baku LPG petrokimia. Selanjutnya, PMK Nomor 68 Tahun 2026 (Perubahan Keempat, efektif 9 Oktober 2026) menyisipkan Pasal 4B yang menurunkan tarif Bea Masuk menjadi 0% selama 6 bulan atas 6 pos tarif bahan baku plastik (HS 3901.10.12, 3901.10.19, 3901.10.99, 3902.10.30, 3902.10.90, dan 3902.30.30 yang sebelumnya bertarif 5%–10%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'BTKI 2017 (PMK 6/PMK.010/2017)',
    newHeader: 'BTKI 2022 (PMK 26/2022 stdd PMK 50/2026 & PMK 68/2026)',
    rows: [
      {
        aspek: 'Standar Nomenklatur Internasional',
        aturanLama: 'HS 2017 & AHTN 2017 (8 digit)',
        aturanBaru: 'HS 2022 & AHTN 2022 (8 digit, perluasan EV, drone, limbah elektronik & produk medis)',
      },
      {
        aspek: 'Insentif Sektor Strategis 2024–2026',
        aturanLama: 'Tarif MFN standar (0%–40%) & spesifik per satuan',
        aturanBaru: 'EV CBU 0% berakhir 31 Des 2025 (PMK 62/2025); 2026 aktif 0% MRO/LPG (PMK 50/2026) & Bahan Baku Plastik Pasal 4B (PMK 68/2026)',
      },
      {
        aspek: 'Posisi dalam Penghitungan PDRI',
        aturanLama: 'Membentuk Nilai Impor (CIF + BM)',
        aturanBaru: 'Tetap membentuk Nilai Impor (CIF + BM) sebagai DPP PPN Impor & PPh 22 Impor',
      },
    ],
  },
  caseExample: {
    title: 'Impor mesin industri dengan Nilai Pabean Rp 1,5 miliar (Tarif MFN 5%)',
    scenario:
      'Sebuah pabrik mengimpor mesin pengemasan dari Jepang tanpa fasilitas SKA dengan Nilai Pabean CIF setara Rp 1.500.000.000 dan pos tarif BTKI 2022 bertarif MFN 5%.',
    presetRegime: 'bea_masuk_btki_2022',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 1500000000,
        tarifBmPersen: 5,
        skemaBtki: 'ad_valorem',
        jumlahUnitSpesifik: 1000,
        tarifSpesifikPerUnit: 450,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukBtki2022Rule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const skema = input.skemaBtki ?? 'ad_valorem';
    const rawTarif = Math.max(0, input.tarifBmPersen);
    const jumlahUnit = Math.max(0, input.jumlahUnitSpesifik ?? 0);
    const tarifPerUnit = Math.max(0, input.tarifSpesifikPerUnit ?? 0);

    let beaMasuk = 0;
    let formulaBm = '';
    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean (CIF dalam Rupiah)', value: nilaiPabean },
    ];

    if (skema === 'ev_kblbb_pmk10') {
      beaMasuk = 0;
      formulaBm = '0% x Nilai Pabean (Khusus PIB s.d. 31 Des 2025 — PMK 10/2024 jo. PMK 62/2025)';
      steps.push({
        label: 'Skema Tarif BTKI 2022',
        formula: 'Periode insentif KBLBB 0% berlaku 2024–31 Desember 2025 (berakhir mulai 1 Jan 2026)',
        value: 0,
        format: 'text',
        displayValue: '0% (Jendela 2024–31 Des 2025)',
      });
    } else if (skema === 'insentif_2026_pmk50_68') {
      beaMasuk = 0;
      formulaBm = '0% x Nilai Pabean (Insentif 2026: MRO/LPG PMK 50/2026 & 6 Pos Plastik Pasal 4B PMK 68/2026)';
      steps.push({
        label: 'Skema Tarif Khusus BTKI 2026 (PMK 50/2026 & PMK 68/2026)',
        formula: 'Tarif 0% MRO Pesawat / LPG (28 Jul 2026) & Bahan Baku Plastik 6 bln (9 Okt 2026)',
        value: 0,
        format: 'text',
        displayValue: '0% (Insentif BTKI 2026)',
      });
    } else if (skema === 'spesifik_per_unit') {
      beaMasuk = Math.round(jumlahUnit * tarifPerUnit);
      formulaBm = `${jumlahUnit.toLocaleString('id-ID')} unit/kg x ${formatRupiah(tarifPerUnit)}`;
      steps.push({
        label: 'Volume Barang Tarif Spesifik (kg / liter / unit)',
        formula: `Tarif spesifik ${formatRupiah(tarifPerUnit)} per satuan`,
        value: 0,
        format: 'text',
        displayValue: `${jumlahUnit.toLocaleString('id-ID')} satuan`,
      });
    } else {
      const cappedTarif = Math.min(rawTarif, 150);
      beaMasuk = Math.round(nilaiPabean * (cappedTarif / 100));
      formulaBm = `${formatPersen(cappedTarif)} x ${formatRupiah(nilaiPabean)}`;
      steps.push({
        label: 'Tarif Bea Masuk MFN (BTKI 2022)',
        formula: 'Pasal 12 UU Kepabeanan (umum maks. 40%, kecuali komoditas khusus)',
        value: cappedTarif,
        format: 'percent',
      });
    }

    const nilaiImpor = nilaiPabean + beaMasuk;
    const effectiveRate = nilaiPabean > 0 ? (beaMasuk / nilaiPabean) * 100 : 0;

    steps.push(
      {
        label: 'Bea Masuk Terutang',
        formula: formulaBm,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Nilai Impor (DPP PPN & PPh Pasal 22 Impor)',
        formula: 'Nilai Pabean (CIF) + Bea Masuk',
        value: nilaiImpor,
      }
    );

    const notes: string[] = [
      'Nilai Impor (CIF + Bea Masuk) menjadi Dasar Pengenaan Pajak (DPP) untuk menghitung PPN Impor (11%) dan PPh Pasal 22 Impor (umumnya 2,5% dengan API atau 7,5% non-API sesuai PMK 51/2025).',
    ];
    if (skema === 'ev_kblbb_pmk10') {
      notes.push(
        'Peringatan Sunset 2026: Berdasarkan Pasal 4A ayat (2) PMK 62/2025, fasilitas Bea Masuk 0% impor CBU/CKD KBLBB berakhir pada 31 Desember 2025 (tidak diperpanjang pada tahun 2026). Impor CBU KBLBB sejak 1 Januari 2026 kembali tunduk pada tarif MFN BTKI normal.'
      );
    }
    if (skema === 'insentif_2026_pmk50_68') {
      notes.push(
        'Berlaku pada 2026: PMK 50/2026 (efektif 28 Jul 2026) membebaskan tarif MRO pesawat & LPG petrokimia, dan Pasal 4B PMK 68/2026 (efektif 9 Okt 2026) menurunkan tarif 6 pos HS bahan baku plastik (3901.10.12/19/99, 3902.10.30/90, 3902.30.30) menjadi 0% selama 6 bulan.'
      );
    }
    if (skema === 'ad_valorem' && rawTarif > 40) {
      notes.push(
        'Catatan: Tarif MFN umum dibatasi maksimal 40% oleh Pasal 12 ayat (1) UU Kepabeanan; tarif di atas 40% hanya berlaku bagi produk pertanian tertentu (Schedule XXI GATT-WTO) atau pos tarif pengecualian.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Terutang',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel: 'Nilai Impor (DPP PPN & PPh 22)',
      annualTaxAmount: nilaiImpor,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Beban Bea Masuk thd Nilai Pabean',
      takeHomeOrNetLabel: 'Total Nilai Pabean + Bea Masuk',
      takeHomeOrNetAmount: nilaiImpor,
      steps,
      notes,
    };
  },
};
