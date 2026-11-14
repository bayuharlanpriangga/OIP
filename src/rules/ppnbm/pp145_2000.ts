import {
  CalculationStep,
  PpnbmCategoryType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppnbm_pp145_2000',
  taxType: 'ppnbm',
  name: 'PP 145/2000 jo. PP 43/2003 & PP 12/2006',
  shortName: '2001–2013 (PP 145/2000)',
  legalBasis: 'PP Nomor 145 Tahun 2000 stdd PP Nomor 12 Tahun 2006 (Kendaraan & Barang Mewah)',
  effectivePeriod: '1 Januari 2001 – 22 Mei 2013',
  isCurrent: false,
  summary:
    'Struktur PPnBM awal pasca-UU 18/2000: kendaraan 10% (minibus/4x2 <= 1.500 cc), 20% (1.500–2.500 cc), 30% (sedan <= 1.500 cc), 40% (> 2.500 cc / sedan 1.500–3.000 cc), hingga 75% (> 3.000 cc, kapal pesiar & pesawat); belum ada insentif LCGC maupun BEV.',
  sources: [SRC.PP_145_2000, SRC.PP_12_2006, SRC.UU_18_2000],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pp145-2000',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'PP 145/2000: Puncak Tarif 75% Era UU 18/2000 dan Ketiadaan Insentif LCGC (2001–2013)',
  legalBasis: 'PP Nomor 145 Tahun 2000 stdd PP Nomor 12 Tahun 2006',
  effectiveDate: '1 Januari 2001',
  readMinutes: 4,
  summary:
    'Rezim PPnBM 2001–2013 yang menyatukan aturan barang mewah kendaraan dan non-kendaraan dalam satu PP, dengan plafon tarif tertinggi naik dari 50% menjadi 75%.',
  sections: [
    {
      heading: 'Kenaikan batas atas PPnBM menjadi 75% di awal tahun 2001',
      paragraphs: [
        'Mengikuti perubahan UU 18/2000 yang menaikkan batas atas tarif PPnBM dalam undang-undang menjadi 75%, PP Nomor 145 Tahun 2000 menetapkan tarif progresif otomotif mulai 10% (minibus 4x2 <= 1.500 cc), 20% (1.500–2.500 cc), 30% (sedan <= 1.500 cc), 40% (sedan/4x4 1.500–3.000 cc), hingga 75% untuk kendaraan mewah di atas 3.000 cc.',
        'Berbagai barang konsumsi mewah selain kendaraan—mulai dari kapal pesiar, pesawat pribadi, alat elektronik rumah tangga kelas atas, hingga hunian mewah—masih tergabung langsung dalam lampiran PP 145/2000 hingga revisinya (PP 12/2006).',
      ],
    },
    {
      heading: 'Belum mengenal mobil listrik maupun LCGC',
      paragraphs: [
        'Pada masa ini belum ada fasilitas tarif 0% untuk kendaraan bermotor listrik (BEV) maupun LCGC; seluruh mobil berkapasitas di bawah 1.500 cc non-sedan minimal terkena PPnBM 10% di tingkat pabrikan atau impor.',
      ],
    },
  ],
  caseExample: {
    title: 'Mobil keluarga 1.800 cc harga pabrikan Rp 250 juta di era PP 145/2000',
    scenario:
      'Penyerahan kendaraan penumpang 4x2 1.500–2.500 cc senilai Rp 250.000.000 pada tahun 2008 dikenai PPnBM sebesar 20% atau Rp 50.000.000.',
    presetRegime: 'ppnbm_pp145_2000',
    presetInput: {
      ppnbm: {
        hargaJual: 250000000,
        categoryType: 'hybrid_full',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getPp145Meta(cat: PpnbmCategoryType): { rate: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
      return {
        rate: 10,
        label: 'Kendaraan penumpang <= 1.500 cc non-sedan (belum ada insentif BEV 0% -> min. 10%)',
      };
    case 'lcgc':
      return {
        rate: 10,
        label: 'Kendaraan bermotor <= 1.500 cc (skema LCGC 0% belum lahir di era PP 145/2000 -> 10%)',
      };
    case 'hybrid_full':
      return {
        rate: 20,
        label: 'Kendaraan 4x2 1.500–2.500 cc non-sedan (belum ada diskon hybrid -> 20%)',
      };
    case 'sedan_suv_menengah':
      return {
        rate: 40,
        label: 'Sedan / station wagon & 4x4 1.500–3.000 cc era PP 145/2000 (40%)',
      };
    case 'kendaraan_emisi_tinggi':
      return {
        rate: 75,
        label: 'Kendaraan mewah > 3.000 cc bensin / > 2.500 cc diesel (batas maks PP 145/2000: 75%)',
      };
    case 'hunian_mewah':
      return {
        rate: 20,
        label: 'Hunian mewah tertentu sesuai kriteria PMK pelaksana PP 145/2000 (20%)',
      };
    case 'balon_udara_peluru':
      return {
        rate: 40,
        label: 'Balon udara, peluru, & barang mewah kelompok 40% — PP 145/2000',
      };
    case 'helikopter_senjata_api':
      return {
        rate: 50,
        label: 'Pesawat udara/helikopter non-niaga & senjata api — kelompok 50% PP 145/2000',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 75,
        label: 'Kapal pesiar, yacht & pesawat udara non-niaga — PP 145/2000 (75%)',
      };
  }
}

export const ppnbmPp145_2000Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getPp145Meta(input.categoryType);
    const ppnbm = Math.round((hargaJual * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / nilai impor', value: hargaJual },
      { label: 'Tarif PPnBM era PP 145/2000', formula: meta.label, value: meta.rate, format: 'percent' },
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
        'Pada era PP 145/2000 (2001–2013), batas tarif tertinggi kendaraan mewah adalah 75% sebelum dinaikkan menjadi 125% pada PP 41/2013, dan belum terdapat pembebasan 0% untuk LCGC maupun mobil listrik.',
      ],
    };
  },
};
