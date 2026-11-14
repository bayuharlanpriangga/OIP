import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu17_2000',
  taxType: 'pph21',
  name: 'UU Nomor 17 Tahun 2000 (TP 2001–2004)',
  shortName: '2001–2004 (PTKP 2,88 jt)',
  legalBasis: 'Pasal 7 & 17 UU Nomor 17 Tahun 2000 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2004',
  isCurrent: false,
  summary:
    'Tarif progresif 5 lapis UU 17/2000 (5% <= 25jt, 10% s.d. 50jt, 15% s.d. 100jt, 25% s.d. 200jt, 35% > 200jt), PTKP TK/0 Rp 2,88 juta (+Rp 1,44 jt/tanggungan), Biaya Jabatan maks Rp 1,296 juta/thn.',
};

export const pph21Uu17_2000Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu17_2000', 'uu17_2000');
  },
};
