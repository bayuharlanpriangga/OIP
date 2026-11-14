import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'meterai_pp7_1995',
  taxType: 'bea_meterai',
  name: 'UU 13/1985 & PP Nomor 7 Tahun 1995',
  shortName: '1995–2000 (Rp 1rb / Rp 2rb)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 7 Tahun 1995',
  effectivePeriod: '21 April 1995 – 30 April 2000',
  isCurrent: false,
  summary:
    'Penyesuaian pertama tarif Bea Meterai: bebas s.d. Rp 250 ribu, tarif Rp 1.000 untuk > Rp 250 ribu s.d. Rp 1 juta, dan tarif Rp 2.000 untuk nominal di atas Rp 1 juta.',
  sources: [SRC.PP_7_1995, SRC.UU_13_1985],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-pp7-1995',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Penyesuaian Pertama Tarif Bea Meterai Rp 1.000 dan Rp 2.000 (PP 7/1995)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 7 Tahun 1995',
  effectiveDate: '21 April 1995 – 30 April 2000',
  readMinutes: 3,
  summary:
    'Diterbitkan sepuluh tahun setelah UU 13/1985, PP 7/1995 menggandakan tarif Bea Meterai dari Rp 500/Rp 1.000 menjadi Rp 1.000/Rp 2.000 sekaligus menaikkan batas bebas pajak dari Rp 100 ribu menjadi Rp 250 ribu.',
  sections: [
    {
      heading: 'Menggunakan kewenangan Pasal 3 UU 13/1985 untuk menyesuaikan tarif',
      paragraphs: [
        'Pasal 3 UU Nomor 13 Tahun 1985 memberi wewenang kepada Peraturan Pemerintah untuk mengubah tarif serta batas harga nominal dokumen. Pada 21 April 1995, PP Nomor 7 Tahun 1995 ditetapkan untuk menyesuaikan kedua parameter tersebut.',
        'Batas dokumen uang yang tidak dikenai Bea Meterai dinaikkan dari Rp 100.000 menjadi Rp 250.000, sedangkan tarif lapisan menengah naik menjadi Rp 1.000 (> Rp 250 ribu s.d. Rp 1 juta) dan lapisan tertinggi menjadi Rp 2.000 (> Rp 1 juta maupun perjanjian perdata).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 13/1985 Awal (1986–Apr 1995)',
    newHeader: 'PP 7/1995 (Apr 1995–Apr 2000)',
    rows: [
      {
        aspek: 'Batas bebas nominal uang',
        aturanLama: 'Nominal s.d. Rp 100.000',
        aturanBaru: 'Nominal s.d. Rp 250.000',
      },
      {
        aspek: 'Tarif lapisan menengah (s.d. Rp 1 jt)',
        aturanLama: 'Rp 500 / dokumen',
        aturanBaru: 'Rp 1.000 / dokumen',
      },
      {
        aspek: 'Tarif lapisan atas (> Rp 1 jt)',
        aturanLama: 'Rp 1.000 / dokumen',
        aturanBaru: 'Rp 2.000 / dokumen',
      },
    ],
  },
  caseExample: {
    title: 'Kwitansi transaksi Rp 750 ribu dalam 2 dokumen rangkap (1998)',
    scenario:
      'Menghitung Bea Meterai pada 1998 atas dokumen senilai Rp 750.000 (berada di lapisan > Rp 250 ribu s.d. Rp 1 juta dengan tarif Rp 1.000).',
    presetRegime: 'meterai_pp7_1995',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 750000,
        jumlahDokumen: 2,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiPp7_1995Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 250.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 2000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 2.000 / dokumen';
    } else if (nilaiDokumen > 250000) {
      tarifPerDokumen = 1000;
      tierFormula = 'Nominal > Rp 250.000 s.d. Rp 1.000.000 -> Tarif Rp 1.000 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif PP 7/1995', formula: tierFormula, value: tarifPerDokumen },
      {
        label: `Total Bea Meterai (${jumlahDokumen} dokumen)`,
        formula: `${formatRupiah(tarifPerDokumen)} x ${jumlahDokumen} dok`,
        value: totalBeaMeterai,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalBeaMeterai,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: tarifPerDokumen,
      steps,
      notes: [
        'PP 7/1995 menaikkan batas bebas dokumen nominal uang dari Rp 100 ribu menjadi Rp 250 ribu dan menaikkan tarif menjadi Rp 1.000 / Rp 2.000 sebelum naik lagi ke Rp 3.000 / Rp 6.000 di PP 24/2000.',
      ],
    };
  },
};
