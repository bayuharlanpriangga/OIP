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
  id: 'pph26_pbdr_1970',
  taxType: 'pph26',
  name: 'PBDR 1970 atas Wajib Pajak Luar Negeri — UU 10/1970 (Pra-1984)',
  shortName: '1970–1983 (PBDR WPLN — UU 10/1970)',
  legalBasis: 'UU Nomor 10 Tahun 1970 (Pajak atas Bunga, Dividen, dan Royalty)',
  effectivePeriod: '1970 – 31 Desember 1983 (Digantikan PPh Pasal 26 UU 7/1983)',
  isCurrent: false,
  summary:
    'Pemotongan Pajak atas Bunga, Dividen, dan Royalty (PBDR) sebesar 20% atas pembayaran lintas batas kepada badan atau orang pribadi di luar negeri sebelum istilah PPh Pasal 26 diperkenalkan dalam Reformasi Pajak 1983.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pbdr-1970',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Akar PPh Pasal 26 Lintas Batas: PBDR 20% dalam UU 10/1970 (Pra-1984)',
  legalBasis: 'UU Nomor 10 Tahun 1970 jo. Pasal 26 UU Nomor 7 Tahun 1983',
  effectiveDate: '1970 – 31 Desember 1983',
  readMinutes: 4,
  summary:
    'Mengulas cikal bakal pemajakan atas arus dividen, bunga pinjaman luar negeri, dan royalti kepada subjek luar negeri lewat rezim PBDR 1970 (20%) sebelum diserap menjadi PPh Pasal 26 pada 1984.',
  sections: [
    {
      heading: 'Kesinambungan tarif 20% dari PBDR (1970) ke PPh Pasal 26 (1984)',
      paragraphs: [
        'Sebelum UU Nomor 7 Tahun 1983 memisahkan pemotongan dalam negeri (Pasal 23) dan luar negeri (Pasal 26), Indonesia menerapkan UU Nomor 10 Tahun 1970 tentang Pajak atas Bunga, Dividen, dan Royalty (PBDR) terhadap setiap pembayaran modal maupun lisensi HKI, termasuk yang dibayarkan kepada penerima di luar negeri.',
        'Tarif dasar PBDR sebesar 20% dari penghasilan bruto menjadi fondasi angka tarif PPh Pasal 26 sebesar 20% hingga hari ini. Perbedaan utama yang dibawa Reformasi Pajak 1983 adalah pengkodifikasian objek jasa luar negeri dan cabang BUT (Branch Profit Tax) secara lebih komprehensif ke dalam Pasal 26 UU 7/1983.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PBDR WPLN — UU 10/1970 (1970–1983)',
    newHeader: 'PPh Pasal 26 — UU 7/1983 (1984–Kini)',
    rows: [
      {
        aspek: 'Tarif dasar dividen, bunga, royalti ke WPLN',
        aturanLama: '20% Final dari bruto (PBDR)',
        aturanBaru: '20% Final dari bruto (PPh Pasal 26)',
      },
      {
        aspek: 'Cakupan imbalan jasa & Branch Profit Tax BUT',
        aturanLama: 'Terbatas pada bunga, dividen, dan royalti',
        aturanBaru: 'Diperluas ke jasa, hadiah, pensiun, dan BPT 20% BUT',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran bunga pinjaman ke bank luar negeri senilai Rp 200 juta tahun 1981',
    scenario:
      'Perusahaan di Jakarta membayar bunga pinjaman Rp 200.000.000 kepada kreditur luar negeri pada 1981 (tanpa fasilitas P3B). Terutang pemotongan PBDR 20% = Rp 40.000.000.',
    presetRegime: 'pph26_pbdr_1970',
    presetInput: {
      pph26: {
        nilaiBruto: 200000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pbdr1970Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const rate = input.hasSkdP3b ? Math.max(0, Math.min(20, input.tarifP3bPersen)) : 20;
    const tax = Math.round((bruto * rate) / 100);
    const netTransfer = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Jumlah bruto bunga / dividen / royalti dibayarkan ke luar negeri', value: bruto },
      {
        label: 'Tarif PBDR WPLN (UU Nomor 10 Tahun 1970)',
        formula: input.hasSkdP3b
          ? `Tarif treaty P3B awal (${formatPersen(rate)})`
          : 'Tarif standar PBDR 20% pra-1984',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PBDR dipotong pembayar di Indonesia',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Nilai bersih ditransfer ke penerima luar negeri', value: netTransfer },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBDR WPLN Dipotong (Pra-1984)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Pembayaran Bersih ke Luar Negeri',
      takeHomeOrNetAmount: netTransfer,
      steps,
      notes: [
        'Tarif dasar 20% dalam PBDR (UU 10/1970) dipertahankan secara konsisten sebagai tarif standar PPh Pasal 26 pada Reformasi Pajak 1983.',
      ],
    };
  },
};
