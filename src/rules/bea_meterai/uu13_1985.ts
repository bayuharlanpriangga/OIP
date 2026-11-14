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
  id: 'meterai_uu13_1985',
  taxType: 'bea_meterai',
  name: 'UU Nomor 13 Tahun 1985 (Tarif Awal)',
  shortName: '1986–1995 (Rp 500 / Rp 1rb)',
  legalBasis: 'Pasal 2 ayat (2) & (3) UU Nomor 13 Tahun 1985 tentang Bea Meterai',
  effectivePeriod: '1 Januari 1986 – 20 April 1995',
  isCurrent: false,
  summary:
    'Tarif perdana UU 13/1985: dokumen nominal s.d. Rp 100 ribu bebas meterai, > Rp 100 ribu s.d. Rp 1 juta dikenai Rp 500, dan di atas Rp 1 juta dikenai Rp 1.000.',
  sources: [SRC.UU_13_1985, SRC.PP_7_1995],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-uu13-1985',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Reformasi Bea Meterai 1985: Mengakhiri Zegelverordening 1921 dengan Tarif Rp 500 & Rp 1.000',
  legalBasis: 'Pasal 2 UU Nomor 13 Tahun 1985 tentang Bea Meterai',
  effectiveDate: '1 Januari 1986 – 20 April 1995',
  readMinutes: 4,
  summary:
    'UU Nomor 13 Tahun 1985 menggantikan Aturan Bea Meterai 1921 warisan kolonial yang rumit (167 jenis dokumen) menjadi hanya dua tarif sederhana: Rp 500 dan Rp 1.000 mulai 1 Januari 1986.',
  sections: [
    {
      heading: 'Penyederhanaan drastis dari Aturan Bea Meterai 1921',
      paragraphs: [
        'Sebelum 1986, pemungutan Bea Meterai masih mengacu pada Zegelverordening 1921 dengan puluhan variasi tarif tetap, tarif sebanding (proporsional), dan daftar objek yang panjang. UU 13/1985 memangkas seluruhnya menjadi dua tarif tetap: Rp 500 dan Rp 1.000.',
        'Khusus dokumen yang menyebut jumlah uang, dokumen hingga Rp 100.000 dibebaskan, nominal di atas Rp 100.000 s.d. Rp 1.000.000 dikenai Rp 500, dan nominal di atas Rp 1.000.000 dikenai Rp 1.000 (termasuk surat perjanjian, akta notaris, akta PPAT, dan efek).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 13/1985 Awal (1986–1995)',
    newHeader: 'UU 10/2020 (2021–Sekarang)',
    rows: [
      {
        aspek: 'Batas bebas dokumen nominal uang',
        aturanLama: 'Nominal s.d. Rp 100.000',
        aturanBaru: 'Nominal s.d. Rp 5.000.000',
      },
      {
        aspek: 'Struktur tarif',
        aturanLama: 'Dua lapis (Rp 500 & Rp 1.000)',
        aturanBaru: 'Tarif tunggal (Rp 10.000)',
      },
      {
        aspek: 'Cakupan bentuk dokumen',
        aturanLama: 'Dokumen kertas/fisik',
        aturanBaru: 'Dokumen kertas dan elektronik (e-Meterai)',
      },
    ],
  },
  caseExample: {
    title: 'Akta perjanjian Rp 5 juta di tahun 1990',
    scenario:
      'Simulasi Bea Meterai UU 13/1985 awal atas kontrak bernilai Rp 5.000.000 yang sudah melampaui batas Rp 1.000.000 (tarif Rp 1.000/dokumen).',
    presetRegime: 'meterai_uu13_1985',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 5000000,
        jumlahDokumen: 2,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiUu13_1985Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 100.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 1000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 1.000 / dokumen';
    } else if (nilaiDokumen > 100000) {
      tarifPerDokumen = 500;
      tierFormula = 'Nominal > Rp 100.000 s.d. Rp 1.000.000 -> Tarif Rp 500 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif awal UU 13/1985', formula: tierFormula, value: tarifPerDokumen },
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
        'UU Nomor 13 Tahun 1985 merupakan reformasi Bea Meterai yang menggantikan Aturan Bea Meterai 1921 (Zegelverordening) dan menyederhanakan tarif hanya menjadi Rp 500 serta Rp 1.000.',
      ],
    };
  },
};
