import { TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu36_2009',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 250/2008 (TP 2009–2012)',
  shortName: '2009–2012 (PTKP 15,84 jt)',
  legalBasis: 'Pasal 7 & 17 UU 36/2008 jo. PMK Nomor 250/PMK.03/2008',
  effectivePeriod: '1 Januari 2009 – 31 Desember 2012',
  isCurrent: false,
  summary:
    'PTKP perdana UU 36/2008 sebesar Rp 15,84 juta (TK/0, +Rp 1,32 jt per status/tanggungan), Biaya Jabatan naik ke Rp 6 juta/thn, serta mulai berlakunya sanksi +20% non-NPWP.',
};

export const pph21Uu36_2009Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu36_2008', 'uu36_2008');
  },
};
