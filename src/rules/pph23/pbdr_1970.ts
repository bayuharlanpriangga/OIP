import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_10_1970_PBDR, SRC.UU_7_1983];

const regime: TaxRegime = {
  id: 'pph23_pbdr_1970',
  taxType: 'pph23',
  name: 'PBDR 1970 — UU Nomor 10 Tahun 1970 (Pra-1984)',
  shortName: '1970–1983 (PBDR — UU 10/1970)',
  legalBasis: 'UU Nomor 10 Tahun 1970 tentang Pajak atas Bunga, Dividen, dan Royalty',
  effectivePeriod: '1970 – 31 Desember 1983 (Digantikan PPh 23 & 26 UU 7/1983)',
  isCurrent: false,
  summary:
    'Pajak pemotongan sumber atas pembayaran bunga, dividen, dan royalti kepada Wajib Pajak Dalam Negeri maupun Luar Negeri dengan tarif dasar 20% sebelum dipecah menjadi PPh Pasal 23 (15%) dan PPh Pasal 26 (20%) dalam UU 7/1983.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-pbdr-1970',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Cikal Bakal PPh 23 Pra-1984: Pajak atas Bunga, Dividen, dan Royalty (PBDR — UU 10/1970)',
  legalBasis: 'UU Nomor 10 Tahun 1970 tentang Perubahan Ordonansi Pajak Dividen 1959',
  effectiveDate: '1970 – 31 Desember 1983',
  readMinutes: 4,
  summary:
    'Mengulas sejarah PBDR 1970 yang memperluas objek Ordonansi Pajak Dividen 1959 menjadi pemotongan 20% atas bunga, dividen, dan royalti sebelum bertransformasi menjadi PPh Pasal 23.',
  sections: [
    {
      heading: 'Dari Pajak Dividen 1959 menjadi PBDR 20% (UU 10/1970)',
      paragraphs: [
        'Sebelum Reformasi Pajak 1983, pemungutan atas penghasilan modal tidak digabung dengan jasa di bawah satu pasal. Ordonansi Pajak Dividen 1959 semula hanya menyasar pembagian laba/dividen, lalu diperluas oleh UU Nomor 10 Tahun 1970 menjadi Pajak atas Bunga, Dividen, dan Royalty (PBDR).',
        'Tarif pemotongan PBDR ditetapkan sebesar 20% atas jumlah bruto pembayaran bunga pinjaman, dividen, maupun royalti hak kekayaan intelektual. Pajak yang dipotong ini menjadi kredit pajak bagi penerima dalam negeri, sebelum akhirnya pada 1 Januari 1984 seluruh arus penghasilan modal dan sewa/jasa dalam negeri disatukan ke dalam Pasal 23 UU Nomor 7 Tahun 1983 dengan tarif 15%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PBDR 1970 — UU 10/1970 (1970–1983)',
    newHeader: 'PPh Pasal 23 — UU 7/1983 (Mulai 1984)',
    rows: [
      {
        aspek: 'Tarif bunga, dividen & royalti (WPDN)',
        aturanLama: '20% dari jumlah bruto (PBDR)',
        aturanBaru: '15% dari jumlah bruto (PPh Pasal 23)',
      },
      {
        aspek: 'Pemisahan WPDN vs WPLN',
        aturanLama: 'Satu UU PBDR untuk penerima DN maupun LN',
        aturanBaru: 'Dipisah menjadi PPh 23 (WPDN 15%) dan PPh 26 (WPLN 20%)',
      },
    ],
  },
  caseExample: {
    title: 'Pemotongan PBDR 20% atas royalti hak paten Rp 50 juta era 1980',
    scenario:
      'Sebuah perusahaan manufaktur membayarkan royalti teknologi Rp 50.000.000 kepada pemilik paten di dalam negeri pada tahun 1980. Terutang PBDR 20% = Rp 10.000.000.',
    presetRegime: 'pph23_pbdr_1970',
    presetInput: {
      pph23: {
        nilaiBruto: 50000000,
        objectType: 'royalti',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Pbdr1970Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const rate = 20;
    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Jumlah bruto bunga / dividen / royalti (Basis PBDR)', value: bruto },
      { label: 'Tarif PBDR UU Nomor 10 Tahun 1970', formula: 'Tarif tunggal 20% pra-1984', value: rate, format: 'percent' },
      {
        label: 'PBDR dipotong pihak pembayar',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Nilai bersih diterima penerima penghasilan', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBDR Dipotong (Pra-1984)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'UU 10/1970 (PBDR) adalah cikal bakal PPh Pasal 23 untuk pemotongan bunga, dividen, dan royalti dengan tarif 20%.',
        'Mulai 1 Januari 1984, tarif pemotongan dalam negeri diturunkan menjadi 15% di bawah Pasal 23 UU 7/1983.',
      ],
    };
  },
};
