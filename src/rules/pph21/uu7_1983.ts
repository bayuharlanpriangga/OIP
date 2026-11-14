import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu7_1983',
  taxType: 'pph21',
  name: 'UU Nomor 7 Tahun 1983 & UU 7/1991 (TP 1984–1994)',
  shortName: '1984–1994 (PTKP 960 rb)',
  legalBasis: 'Pasal 7 & 17 UU 7/1983 jo. KMK 980/KMK.04/1983 (Biaya Jabatan)',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Era awal reformasi UU PPh: tarif 3 lapis 15% (<= 10jt), 25% (10–50jt), 35% (> 50jt), PTKP TK/0 Rp 960 ribu (+Rp 480 rb/tanggungan), dan Biaya Jabatan maks Rp 360 ribu/thn.',
};

export const pph21Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu7_1983', 'uu7_1983');
  },
};
