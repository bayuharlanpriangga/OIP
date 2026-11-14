import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_kmk564_2004',
  taxType: 'pph21',
  name: 'UU 17/2000 & KMK 564/2004 (TP 2005)',
  shortName: '2005 (PTKP 12 jt)',
  legalBasis: 'UU 17/2000, KMK 564/KMK.03/2004 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2005 – 31 Desember 2005',
  isCurrent: false,
  summary:
    'Penyesuaian PTKP Tahun Pajak 2005 dari Rp 2,88 juta menjadi Rp 12 juta (TK/0, +Rp 1,2 jt/tanggungan), tetap memakai tarif 5 lapis UU 17/2000 (5/10/15/25/35%).',
};

export const pph21Kmk564_2004Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'kmk564_2004', 'uu17_2000');
  },
};
