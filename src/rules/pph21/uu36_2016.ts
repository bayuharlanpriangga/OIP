import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu36_2016',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 101/2016',
  shortName: '2016–2021 (UU PPh)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 101/PMK.010/2016',
  effectivePeriod: '1 Januari 2016 – 31 Desember 2021',
  isCurrent: false,
  summary:
    'PTKP TK/0 sudah Rp 54 juta, namun lapisan tarif 5% masih berakhir di Rp 50 juta dan tarif tertinggi berhenti di 30% untuk PKP di atas Rp 500 juta.',
};

export const pph21Uu36_2016Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk101_2016', 'uu36_2008');
  },
};
