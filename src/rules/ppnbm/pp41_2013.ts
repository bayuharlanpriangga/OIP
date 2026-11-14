import {
  CalculationStep,
  PpnbmCategoryType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'ppnbm_pp41_2013',
  taxType: 'ppnbm',
  name: 'PP 41/2013 jo. PP 22/2014 & PMK 35/2017',
  shortName: '2013–2021 (PP 41/2013 CC)',
  legalBasis: 'PP 41/2013 jo. PP 22/2014 (Kendaraan) & PMK 106/2015 jo. PMK 35/2017 (Non-Kendaraan)',
  effectivePeriod: '23 Mei 2013 – 15 Oktober 2021',
  isCurrent: false,
  summary:
    'Aturan PPnBM lama berbasis kapasitas isi silinder (cc), tipe bodi (sedan vs minibus), dan 4x2/4x4 (0% LCGC, 10%–125%), serta 20% hunian mewah / 75% kapal & pesawat.',
};

function getOldPpnbmMeta(cat: PpnbmCategoryType): { rate: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
      return {
        rate: 10,
        label: 'Kendaraan penumpang < 1.500 cc non-sedan (belum ada insentif BEV 0% -> min. 10%)',
      };
    case 'lcgc':
      return { rate: 0, label: 'KBH2 / LCGC kriteria PP 41/2013 (DPP 0% -> 0%)' };
    case 'hybrid_full':
      return {
        rate: 20,
        label: 'Kendaraan penumpang 1.500–2.500 cc non-sedan/MPV era PP 41/2013 (20%)',
      };
    case 'sedan_suv_menengah':
      return { rate: 30, label: 'Sedan / SUV 1.500–3.000 cc era PP 41/2013 (30%)' };
    case 'kendaraan_emisi_tinggi':
      return { rate: 125, label: 'Kendaraan mewah > 3.000 cc bensin (125%)' };
    case 'hunian_mewah':
      return {
        rate: 20,
        label: 'Hunian mewah (rumah >= Rp 20M / apartemen >= Rp 10M) — PMK 106/2015 jo. PMK 35/2017 (20%)',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 75,
        label: 'Kapal pesiar & pesawat pribadi non-niaga — PMK 106/2015 jo. PMK 35/2017 (75%)',
      };
  }
}

export const ppnbmPp41_2013Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getOldPpnbmMeta(input.categoryType);
    const ppnbm = Math.round((hargaJual * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / nilai impor', value: hargaJual },
      { label: 'Tarif PPnBM era PP 41/2013', formula: meta.label, value: meta.rate, format: 'percent' },
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
        'Pada era PP 41/2013, mobil sedan dan kendaraan di atas 3.000 cc terkena tarif jauh lebih berat (30% hingga 125%) dibandingkan rezim berbasis emisi PP 74/2021.',
      ],
    };
  },
};
