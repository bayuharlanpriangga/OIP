import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_8_1967, SRC.UU_7_1983, SRC.KMK_965_1983];

const regime: TaxRegime = {
  id: 'pph22_mpo_uu8_1967',
  taxType: 'pph22',
  name: 'MPO (Menghitung Pajak Orang) — UU Nomor 8 Tahun 1967 (Pra-1984)',
  shortName: '1967–1983 (MPO — UU 8/1967)',
  legalBasis: 'UU Nomor 8 Tahun 1967 jo. PP Nomor 11 Tahun 1967 tentang MPS & MPO',
  effectivePeriod: '1967 – 31 Desember 1983 (Digantikan PPh 22 UU 7/1983)',
  isCurrent: false,
  summary:
    'Sistem pemungutan di muka era pra-Reformasi 1983 melalui mekanisme MPO (Menghitung Pajak Orang Lain) oleh wajib pungut (importir, pabrikan, penyalur, dan instansi) dengan tarif umum 2% per mata rantai transaksi sebagai kredit Pajak Pendapatan / Pajak Perseroan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-mpo-uu8-1967',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Sejarah Cikal Bakal PPh 22 Pra-1984: Sistem MPO dalam UU Nomor 8 Tahun 1967',
  legalBasis: 'UU Nomor 8 Tahun 1967 jo. PP Nomor 11 Tahun 1967',
  effectiveDate: '1967 (Dicabut per 1 Januari 1984 oleh UU 7/1983)',
  readMinutes: 4,
  summary:
    'Menelusuri lahirnya sistem MPS-MPO tahun 1967 sebagai cikal bakal withholding tax atas impor dan transaksi niaga di Indonesia sebelum dikodifikasikan ke dalam PPh Pasal 22 dan Pasal 23 pada Reformasi Pajak 1983.',
  sections: [
    {
      heading: 'Dari official assessment ke sistem MPS dan MPO (1967–1983)',
      paragraphs: [
        'Sebelum tahun 1967, pemungutan Pajak Pendapatan (PPd 1944) dan Pajak Perseroan (PPs 1925) sepenuhnya bergantung pada Surat Ketetapan Pajak (SKP) dari kantor pajak. Untuk mempercepat penerimaan negara, UU Nomor 8 Tahun 1967 memperkenalkan dua mekanisme baru: MPS (Menghitung Pajak Sendiri) sebagai cikal bakal PPh 25, dan MPO (Menghitung Pajak Orang Lain).',
        'Dalam sistem MPO, importir, eksportir, distributor utama, hingga instansi pemerintah ditunjuk sebagai Wajib Pungut MPO yang memungut uang muka pajak sebesar rata-rata 2% dari nilai transaksi perdagangan atau impor (bisa berlipat menjadi 4% untuk transaksi tanpa surat fiskal/NPWP tertentu) lalu menyetorkannya atas nama rekanan.',
      ],
    },
    {
      heading: 'Transformasi MPO menjadi PPh Pasal 22 dan Pasal 23 di UU 7/1983',
      paragraphs: [
        'Ketika UU Nomor 7 Tahun 1983 berlaku 1 Januari 1984, istilah MPO dihapus karena dianggap terlalu luas dan membebani arus perdagangan eceran berantai. Fungsi pemungutan MPO di pintu impor serta transaksi instansi pemerintah dipertahankan dan disederhanakan ke dalam Pasal 22 UU PPh (bermula lewat KMK 965/KMK.04/1983).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sistem MPO — UU 8/1967 (1967–1983)',
    newHeader: 'PPh Pasal 22 — UU 7/1983 & Kini',
    rows: [
      {
        aspek: 'Mekanisme pungutan',
        aturanLama: 'MPO bertingkat dari importir/pabrikan hingga grosir (umum 2%)',
        aturanBaru: 'Dibatasi pada objek tertentu (impor, bendahara, industri hulu)',
      },
      {
        aspek: 'Status pembayaran',
        aturanLama: 'Uang muka / kredit terhadap SKP PPd 1944 atau PPs 1925',
        aturanBaru: 'Kredit pajak dalam SPT Tahunan PPh (atau final pada barang tertentu)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi pungutan MPO 2% atas transaksi niaga Rp 50 juta era 1978',
    scenario:
      'Seorang pedagang grosir membeli barang dagangan dari pabrikan wajib pungut MPO senilai Rp 50.000.000 pada 1978. Wajib Pungut memotong/memungut MPO 2% = Rp 1.000.000 sebagai kredit PPs/PPd pembeli.',
    presetRegime: 'pph22_mpo_uu8_1967',
    presetInput: {
      pph22: {
        nilaiDasar: 50000000,
        objectType: 'impor_api',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22MpoUu8_1967Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiDasar);
    const rate = input.hasNpwp ? 2 : 4;
    const tax = Math.round((nilai * rate) / 100);
    const total = nilai + tax;

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi perdagangan / impor (Basis MPO)', value: nilai },
      {
        label: `Tarif pungutan MPO historis (${formatPersen(rate)})`,
        formula: input.hasNpwp ? 'Tarif standar MPO 2%' : 'Tarif MPO non-terdaftar / tertentu 4%',
        value: rate,
        format: 'percent',
      },
      {
        label: 'Pajak MPO dipungut (Kredit PPd/PPs)',
        formula: `${formatRupiah(nilai)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Total nilai pembayaran termasuk MPO', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pungutan MPO Terutang (Pra-1984)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Nilai Termasuk MPO',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        'MPO (UU 8/1967) merupakan cikal bakal PPh Pasal 22 sebelum Reformasi Pajak 1983.',
        'Pembayaran MPO dikreditkan terhadap Pajak Pendapatan (PPd) atau Pajak Perseroan (PPs) yang terutang pada akhir tahun.',
      ],
    };
  },
};
