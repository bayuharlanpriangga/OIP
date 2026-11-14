import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_8_1967, SRC.PP_11_1967, SRC.UU_7_1983];

const regime: TaxRegime = {
  id: 'pph25_mps_uu8_1967',
  taxType: 'pph25',
  name: 'UU 8/1967 jo. PP 11/1967 (Menghitung Pajak Sendiri / MPS Pra-1984)',
  shortName: '1967–1983 (Pra-UU PPh: MPS UU 8/1967)',
  legalBasis: 'UU Nomor 8 Tahun 1967 jo. PP Nomor 11 Tahun 1967 (Sistem MPS)',
  effectivePeriod: '26 Agustus 1967 – 31 Desember 1983',
  isCurrent: false,
  summary:
    'Cikal bakal angsuran pajak bulanan sebelum PPh Pasal 25 lahir di Reformasi Pajak 1983: melalui sistem Menghitung Pajak Sendiri (MPS), Wajib Pajak menghitung dan menyetor sendiri angsuran bulanan Pajak Pendapatan / Pajak Perseroan / Pajak Kekayaan berdasarkan peredaran atau ketetapan masa sebelumnya.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-mps-uu8-1967',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Pra-1984 Sebelum PPh 25: Sistem Menghitung Pajak Sendiri (MPS) UU 8/1967 jo. PP 11/1967',
  legalBasis: 'UU Nomor 8 Tahun 1967 jo. PP Nomor 11 Tahun 1967',
  effectiveDate: '26 Agustus 1967 – 31 Desember 1983',
  readMinutes: 4,
  summary:
    'Menelusuri sistem pembayaran pajak di muka oleh Wajib Pajak sendiri (MPS) pada masa Ordonansi PPd 1944 & PPs 1925 sebelum digantikan oleh mekanisme angsuran PPh Pasal 25 UU 7/1983.',
  sections: [
    {
      heading: 'Dari Official Assessment menuju semi self-assessment MPS',
      paragraphs: [
        'Sebelum UU Nomor 8 Tahun 1967 disahkan, pemungutan Pajak Pendapatan dan Pajak Perseroan bergantung penuh pada Surat Ketetapan Pajak (SKP) dari Jawatan Pajak (official assessment). Melalui UU 8/1967 jo. PP 11/1967, pemerintah memperkenalkan sistem MPS (Menghitung Pajak Sendiri) untuk angsuran bulanan Wajib Pajak serta MPO (Menghitung Pajak Orang Lain) untuk pemungutan pihak ketiga.',
        'Pada praktik MPS, Wajib Pajak menyetor angsuran bulanan berdasarkan persentase tertentu dari peredaran bruto atau 1/12 ketetapan tahun lalu sebelum diperhitungkan terhadap ketetapan akhir — pola inilah yang kelak disempurnakan menjadi angsuran PPh Pasal 25 dalam UU 7/1983.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sistem MPS (UU 8/1967 & PP 11/1967)',
    newHeader: 'Angsuran PPh Pasal 25 (UU 7/1983–Kini)',
    rows: [
      {
        aspek: 'Asas pemungutan & penagihan',
        aturanLama: 'Semi self-assessment (MPS angsuran + SKP rampung Jawatan Pajak)',
        aturanBaru: 'Self-assessment penuh (SPT Tahunan ÷ 12 tanpa tunggu SKP)',
      },
      {
        aspek: 'Pajak yang diangsur',
        aturanLama: 'Pajak Pendapatan (PPd 1944), PPs 1925, & PKk 1932',
        aturanBaru: 'Pajak Penghasilan (PPh) terintegrasi orang pribadi & badan',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi setoran angsuran MPS berdasarkan ketetapan pajak Rp 24.000.000',
    scenario:
      'Wajib Pajak pada tahun 1980 memiliki ketetapan Pajak Pendapatan/Perseroan tahun sebelumnya Rp 24.000.000 dan kredit MPO pihak lain Rp 3.000.000.',
    presetRegime: 'pph25_mps_uu8_1967',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 24000000,
        kreditPajakTahunLalu: 3000000,
        bulanBerjalan: 12,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25MpsUu8_1967Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const skpTahunLalu = Math.max(0, input.pphTerutangTahunLalu);
    const kreditMpo = Math.max(0, input.kreditPajakTahunLalu);
    const dasarMps = Math.max(0, skpTahunLalu - kreditMpo);
    const angsuranBulanan = Math.round(dasarMps / 12);

    const steps: CalculationStep[] = [
      { label: 'Ketetapan PPd / PPs tahun pajak sebelumnya', value: skpTahunLalu },
      { label: 'Kredit pajak dipungut pihak lain (MPO)', value: -kreditMpo, isNegative: true },
      { label: 'Dasar angsuran MPS setahun', value: dasarMps },
      {
        label: 'Angsuran MPS bulanan (÷ 12)',
        formula: `${formatRupiah(dasarMps)} / 12`,
        value: angsuranBulanan,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran MPS Bulanan (Pra-1984)',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: 'Total Setoran MPS Setahun (12 Masa)',
      annualTaxAmount: angsuranBulanan * 12,
      effectiveRatePercent: skpTahunLalu > 0 ? ((angsuranBulanan * 12) / skpTahunLalu) * 100 : 0,
      takeHomeOrNetLabel: 'Sisa Pajak Rampung Perkiraan',
      takeHomeOrNetAmount: 0,
      steps,
      notes: [
        'UU 8/1967 jo. PP 11/1967 merupakan jembatan menuju sistem self-assessment yang dikukuhkan secara penuh pada UU 7/1983 (PPh Pasal 25).',
      ],
    };
  },
};
