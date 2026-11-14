import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk122_2015',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 122/2015',
  shortName: '2015 (PMK 122/2015)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 122/PMK.010/2015',
  effectivePeriod: '1 Januari 2015 – 31 Desember 2015',
  isCurrent: false,
  summary:
    'PTKP TK/0 naik menjadi Rp 36 juta per tahun (tambahan kawin/tanggungan Rp 3 juta) dengan lapisan tarif Pasal 17 UU 36/2008 (5% s.d. 30%).',
};

export const pph21Pmk122_2015Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk122_2015', 'uu36_2008');
  },
};
