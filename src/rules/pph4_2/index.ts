import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph4_2Pp34_2016Rule } from './pp34_2016';
import { pph4_2Pp51_2008Rule } from './pp51_2008';
import { pph4_2Pp9_2022Rule } from './pp9_2022';

export const PPH4_2_RULES: TaxRuleModule<TaxCalculatorInput['pph4_2']>[] = [
  pph4_2Pp9_2022Rule,
  pph4_2Pp34_2016Rule,
  pph4_2Pp51_2008Rule,
];
