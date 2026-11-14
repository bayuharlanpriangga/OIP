import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_uu36_2009',
  taxType: 'pph_badan',
  name: 'UU Nomor 36 Tahun 2008 (TP 2009)',
  shortName: '2009 (28%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b & ayat (2b) UU 36/2008',
  effectivePeriod: 'Tahun Pajak 2009',
  isCurrent: false,
  summary:
    'Tarif tunggal perdana PPh Badan sebesar 28% pada Tahun Pajak 2009 (diskon 5% menjadi 23% bagi emiten Tbk) dengan fasilitas Pasal 31E bertarif efektif 14%.',
};

export const badanUu36_2009Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 23 : 28);
  },
};
