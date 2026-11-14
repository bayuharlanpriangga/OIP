import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph26Pp9_2021Rule } from './pp9_2021_p3b';
import { pph26Uu36_2008Rule } from './uu36_2008';

export const PPH26_RULES: TaxRuleModule<TaxCalculatorInput['pph26']>[] = [
  pph26Pp9_2021Rule,
  pph26Uu36_2008Rule,
];
