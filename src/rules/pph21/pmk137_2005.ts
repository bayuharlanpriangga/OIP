import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk137_2005',
  taxType: 'pph21',
  name: 'UU 17/2000 & PMK 137/2005 (TP 2006–2008)',
  shortName: '2006–2008 (PTKP 13,2 jt)',
  legalBasis: 'UU 17/2000, PMK 137/PMK.03/2005 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2006 – 31 Desember 2008',
  isCurrent: false,
  summary:
    'Tarif progresif 5 lapis UU 17/2000 (5/10/15/25/35%), PTKP Rp 13,2 juta (TK/0, +Rp 1,2 jt/tanggungan), dan batas Biaya Jabatan Rp 1,296 juta/thn.',
};

export const pph21Pmk137_2005Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk137_2005', 'uu17_2000');
  },
};
