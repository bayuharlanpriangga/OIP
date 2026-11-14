import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu10_1994',
  taxType: 'pph21',
  name: 'UU Nomor 10 Tahun 1994 (TP 1995–2000)',
  shortName: '1995–2000 (PTKP 1,728 jt)',
  legalBasis: 'Pasal 7 & 17 UU 10/1994 jo. KMK 49/KMK.04/1994 (Biaya Jabatan)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Tarif progresif 3 lapis 10% (<= 25jt), 15% (25–50jt), dan 30% (> 50jt) dengan PTKP TK/0 Rp 1,728 juta (+Rp 864 rb/tanggungan) dan Biaya Jabatan KMK 49/1994 maks Rp 648 rb/thn.',
};

export const pph21Uu10_1994Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu10_1994', 'uu10_1994');
  },
};
