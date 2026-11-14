import {
  CalculationStep,
  PpnbmCategoryType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

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
    case 'kapal_pesiar_pesawat':
      return {
        rate: 75,
        label: 'Kapal pesiar, yacht & pesawat udara non-niaga — PP 145/2000 (75%)',
      };
  }
}

export const ppnbmPp145_2000Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
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
