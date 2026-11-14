import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_7_1983, SRC.UU_10_1994, SRC.KEP_537_2000_DJP];

const regime: TaxRegime = {
  id: 'pph25_uu7_1983',
  taxType: 'pph25',
  name: 'Pasal 25 UU 7/1983 & UU 10/1994 (Fondasi Angsuran Bulanan 1984–2000)',
  shortName: '1984–2000 (UU 7/1983 & 10/1994)',
  legalBasis: 'Pasal 25 UU Nomor 7 Tahun 1983 stdd UU Nomor 10 Tahun 1994',
  effectivePeriod: '1 Januari 1984 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Menggantikan sistem MPS (Menghitung Pajak Sendiri) dalam UU 8/1967 mulai 1 Januari 1984 menjadi angsuran PPh Pasal 25 sebesar 1/12 dari PPh Terutang tahun lalu dikurangi kredit pemotongan/pemungutan (PPh 21, 22, 23, dan 24).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-uu7-1983',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Pasal 25 UU 7/1983 & UU 10/1994: Lahirnya Angsuran Pajak Bulanan Pengganti MPS (1984–2000)',
  legalBasis: 'Pasal 25 UU Nomor 7 Tahun 1983 jo. UU Nomor 10 Tahun 1994',
  effectiveDate: '1 Januari 1984 – 31 Desember 2000',
  readMinutes: 4,
  summary:
    'Menjelaskan transformasi sistem MPS era 1967 menjadi Pasal 25 UU 7/1983 yang menetapkan rumus klasik 1/12 dari PPh tahun lalu dikurangi kredit pajak hingga disempurnakan di UU 10/1994 dan KEP-537/PJ./2000.',
  sections: [
    {
      heading: 'Mengakhiri sistem MPS dan memulai rumus 1/12 SPT Tahunan',
      paragraphs: [
        'Sebelum tahun 1984, Wajib Pajak menyetor uang muka pajak sendiri melalui mekanisme MPS (UU 8/1967) berdasarkan persentase omzet bulanan/penjualan yang sering tidak mencerminkan laba riil. Sejak 1 Januari 1984 melalui Pasal 25 UU Nomor 7 Tahun 1983, angsuran bulanan dikaitkan langsung ke SPT Tahunan terakhir.',
        'Besarnya angsuran bulanan yang harus dibayar sendiri oleh Wajib Pajak ditetapkan sebesar 1/12 dari selisih antara PPh yang terutang menurut SPT Tahunan tahun pajak yang lalu dengan kredit pajak PPh Pasal 21, Pasal 22, Pasal 23, serta PPh Pasal 24 yang dibayar/terutang di luar negeri.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'MPS Era 1967–1983',
    newHeader: 'Pasal 25 UU 7/1983 & UU 10/1994 (1984–2000)',
    rows: [
      {
        aspek: 'Dasar penentuan angsuran bulanan',
        aturanLama: 'Persentase omzet/penjualan bruto (MPS)',
        aturanBaru: '1/12 dari (PPh Terutang SPT lalu − Kredit Pajak)',
      },
      {
        aspek: 'Tenggat setor bulanan (era awal)',
        aturanLama: 'Mengikuti aturan setor MPS berkala',
        aturanBaru: 'Paling lambat tanggal 15 bulan takwim berikutnya',
      },
    ],
  },
  caseExample: {
    title: 'Angsuran PPh 25 WP Badan tahun 1996 berdasarkan SPT 1995',
    scenario:
      'SPT Tahunan 1995 mencatat PPh Badan terutang Rp 180.000.000 dengan kredit PPh 22 & 23 sebesar Rp 60.000.000. Maka angsuran PPh Pasal 25 per bulan di tahun 1996 = (Rp 180 jt − Rp 60 jt) / 12 = Rp 10.000.000.',
    presetRegime: 'pph25_uu7_1983',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 180000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphLalu = Math.max(0, input.pphTerutangTahunLalu);
    const kreditLalu = Math.min(pphLalu, Math.max(0, input.kreditPajakTahunLalu));
    const dasar = Math.max(0, pphLalu - kreditLalu);
    const angsuran = Math.round(dasar / 12);
    const totalSetor = angsuran * Math.min(12, Math.max(1, input.bulanBerjalan));

    const steps: CalculationStep[] = [
      { label: 'PPh terutang menurut SPT Tahunan tahun lalu', value: pphLalu },
      { label: 'Dikurangi kredit pajak PPh 21/22/23/24', value: -kreditLalu, isNegative: true },
      { label: 'Dasar penghitungan angsuran Pasal 25 setahun', value: dasar },
      {
        label: 'Angsuran PPh Pasal 25 bulanan (1/12)',
        formula: `${formatRupiah(dasar)} / 12`,
        value: angsuran,
        isHighlight: true,
      },
      { label: `Total setoran ${input.bulanBerjalan} bulan`, value: totalSetor },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh 25 / Bulan (1984–2000)',
      primaryTaxAmount: angsuran,
      annualTaxLabel: `Total ${input.bulanBerjalan} Bulan`,
      annualTaxAmount: totalSetor,
      effectiveRatePercent: pphLalu > 0 ? (dasar / pphLalu) * 100 : 0,
      effectiveRateLabel: 'Porsi PPh dibayar sendiri',
      takeHomeOrNetLabel: `Akumulasi Setoran (${input.bulanBerjalan} Bln)`,
      takeHomeOrNetAmount: totalSetor,
      steps,
      notes: [
        'Pasal 25 UU 7/1983 & UU 10/1994 menggantikan sistem MPS 1967 menjadi angsuran 1/12 selisih PPh tahun lalu atas kredit pajak.',
        'Aturan teknis pengecualian/perubahan angsuran baru kemudian dikodifikasi rinci lewat KEP-537/PJ./2000 mulai 2001.',
      ],
    };
  },
};
