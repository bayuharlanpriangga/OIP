import {
  CalculationStep,
  PpnbmCategoryType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppnbm_pp22_1985',
  taxType: 'ppnbm',
  name: 'PP 22/1985 jo. PP 28/1988 & PP 65/1991',
  shortName: '1985–1994 (PP 22/1985)',
  legalBasis: 'PP Nomor 22 Tahun 1985 stdd PP 28/1988, PP 65/1991 & PP 36/1993 (UU 8/1983)',
  effectivePeriod: '1 April 1985 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Pelaksanaan awal PPnBM bersama berlakunya UU PPN 1983: awalnya hanya tarif 10% dan 20% (PP 22/1985), lalu berkembang menjadi 10%, 20%, 30%, dan 35% lewat PP 28/1988, PP 65/1991, dan PP 36/1993.',
  sources: [SRC.PP_22_1985, SRC.PP_50_1994, SRC.UU_8_1983],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'ppnbm-pp22-1985',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Sejarah PPnBM 1985–2000: Dari Dua Lapis PP 22/1985 ke Struktur PP 50/1994',
  legalBasis: 'PP 22/1985, PP 65/1991 & PP 50/1994',
  effectiveDate: '1 April 1985 – 31 Desember 2000',
  readMinutes: 4,
  summary:
    'Sebelum konsolidasi tarif tinggi hingga 75% di PP 145/2000 dan berbasis emisi karbon di PP 74/2021, PPnBM periode 1985–2000 berawal dari tarif 10% dan 20% lalu meningkat bertahap ke 35%–50%.',
  sections: [
    {
      heading: 'Fase awal PP 22/1985 hingga perluasan lapisan 35% (1985–1994)',
      paragraphs: [
        'Bersamaan dengan berlakunya UU 8/1983 pada 1 April 1985, PP 22/1985 menetapkan tarif PPnBM hanya dalam dua lapis: 10% dan 20% (sesuai batas maksimal undang-undang saat itu 20%). Ketika PP 28/1988 hingga PP 65/1991 dan PP 36/1993 terbit seiring amandemen batas atas PPnBM menjadi 35%, kelompok kendaraan bermotor mewah seperti sedan dan jeep dikenakan tarif 20% hingga 35%.',
      ],
    },
    {
      heading: 'Konsolidasi kendaraan bermotor di PP 50/1994 (1995–2000)',
      paragraphs: [
        'Melalui PP 50/1994 sebagai pelaksana UU 11/1994 dan perubahan akhirnya lewat PP 59/1999, batas atas PPnBM naik hingga 50% untuk kendaraan mewah berkapasitas besar, sebelum meroket menjadi 75% di PP 145/2000 dan 125% di PP 41/2013.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 22/1985 & PP 65/1991 (1985–1994)',
    newHeader: 'PP 50/1994 jo. PP 59/1999 (1995–2000)',
    rows: [
      {
        aspek: 'Rentang tarif PPnBM',
        aturanLama: '10% dan 20% (awal), lalu 10%–35%',
        aturanBaru: '10%, 20%, 25%, 35%, hingga 50% (PP 59/1999)',
      },
      {
        aspek: 'Tarif sedan / kendaraan mewah',
        aturanLama: '20% – 35% sesuai jenis & kapasitas',
        aturanBaru: '35% – 50% sesuai kapasitas silinder (cc)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi PPnBM kendaraan era PP 22/1985–PP 65/1991',
    scenario:
      'Penyerahan sedan/SUV penumpang senilai Rp 250.000.000 oleh pabrikan pada periode 1991–1994 dengan tarif maksimal era itu sebesar 35%.',
    presetRegime: 'ppnbm_pp22_1985',
    presetInput: {
      ppnbm: {
        hargaJual: 250000000,
        categoryType: 'sedan_suv_menengah',
      },
    },
  },
};

function getPp22Meta(cat: PpnbmCategoryType): { rate: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
    case 'lcgc':
      return {
        rate: 10,
        label: 'Kendaraan bermotor kelompok awal 10% (PP 22/1985; belum ada insentif BEV/LCGC)',
      };
    case 'hybrid_full':
      return {
        rate: 20,
        label: 'Kendaraan penumpang minibus/kombi/jeep — PP 22/1985 jo. PP 65/1991 (20%)',
      };
    case 'sedan_suv_menengah':
      return {
        rate: 35,
        label: 'Sedan & station wagon — tarif tertinggi era PP 65/1991 & PP 36/1993 (35%)',
      };
    case 'kendaraan_emisi_tinggi':
      return {
        rate: 35,
        label: 'Kendaraan bermotor mewah kapasitas besar — batas maks 35% (PP 65/1991)',
      };
    case 'hunian_mewah':
      return {
        rate: 10,
        label: 'Barang mewah kelompok umum 10%–20% (hunian mewah baru diatur spesifik era 1994+)',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 35,
        label: 'Kapal pesiar & pesawat udara non-niaga — batas maks 35% era 1991–1994',
      };
  }
}

export const ppnbmPp22_1985Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getPp22Meta(input.categoryType);
    const ppnbm = Math.round((hargaJual * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / nilai impor', value: hargaJual },
      { label: 'Tarif PPnBM era 1985–1994', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPnBM terutang',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(meta.rate)}`,
        value: ppnbm,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPnBM Terutang',
      primaryTaxAmount: ppnbm,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Harga Setelah PPnBM (Belum Termasuk PPN)',
      takeHomeOrNetAmount: hargaJual + ppnbm,
      steps,
      notes: [
        'Pada awal berlakunya UU 8/1983 (PP 22/1985), tarif PPnBM maksimal adalah 20%, lalu meningkat hingga 35% melalui PP 28/1988, PP 65/1991, dan PP 36/1993 sebelum naik ke 50% (PP 59/1999) dan 75% (PP 145/2000).',
      ],
    };
  },
};
