import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_perppu_2020',
  taxType: 'pph_badan',
  name: 'Perppu 1/2020 jo. UU 2/2020',
  shortName: '2020–2021 (22%)',
  legalBasis: 'UU Nomor 2 Tahun 2020',
  effectivePeriod: 'Tahun Pajak 2020 – 2021',
  isCurrent: false,
  summary:
    'Menurunkan tarif PPh Badan dari 25% ke 22% (dan Tbk ke 19%) sebagai respons fiskal pandemi, sebelum rencana penurunan lanjutan ke 20% dibatalkan UU HPP.',
};

export const badanPerppu2020Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 19 : 22);
  },
};
