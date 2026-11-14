import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk162_2013',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 162/2012',
  shortName: '2013–2014 (PMK 162/2012)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 162/PMK.011/2012',
  effectivePeriod: '1 Januari 2013 – 31 Desember 2014',
  isCurrent: false,
  summary:
    'PTKP TK/0 sebesar Rp 24,3 juta per tahun (tambahan kawin/tanggungan Rp 2,025 juta) dengan lapisan tarif Pasal 17 UU 36/2008 (5% s.d. 30%).',
};

export const pph21Pmk162_2013Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk162_2012', 'uu36_2008');
  },
};
