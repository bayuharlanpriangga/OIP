import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph4_2DepositoPp131_2000Rule } from './pp131_2000_deposito';
import { pph4_2UndianKoperasiRule } from './pp132_2000_undian_koperasi';
import { pph4_2Pp140_2000Rule } from './pp140_2000';
import { pph4_2DividenOpRule } from './pp19_2009_dividen_op';
import { pph42Pp27_2008SpnDheRule } from './pp27_2008_spn_dhe';
import { pph4_2Pp29_1996Rule } from './pp29_1996';
import { pph4_2Pp34_2016Rule } from './pp34_2016';
import { pph42Pp34_2016PhtbKhususRule } from './pp34_2016_phtb_khusus';
import { pph4_2SahamPp41_1994Rule } from './pp41_1994_saham';
import { pph4_2Pp51_2008Rule } from './pp51_2008';
import { pph4_2ObligasiPp91_2021Rule } from './pp91_2021_obligasi';
import { pph4_2Pp9_2022Rule } from './pp9_2022';

export const PPH4_2_RULES: TaxRuleModule<TaxCalculatorInput['pph4_2']>[] = [
  pph4_2Pp9_2022Rule,
  pph4_2Pp34_2016Rule,
  pph42Pp34_2016PhtbKhususRule,
  pph4_2DepositoPp131_2000Rule,
  pph4_2ObligasiPp91_2021Rule,
  pph42Pp27_2008SpnDheRule,
  pph4_2SahamPp41_1994Rule,
  pph4_2DividenOpRule,
  pph4_2UndianKoperasiRule,
  pph4_2Pp51_2008Rule,
  pph4_2Pp140_2000Rule,
  pph4_2Pp29_1996Rule,
];
