import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { badanHpp2022Rule } from './hpp2022';
import { badanPerppu2020Rule } from './perppu2020';
import { badanUu36_2008Rule } from './uu36_2008';
import { badanUu36_2009Rule } from './uu36_2009';

export const PPH_BADAN_RULES: TaxRuleModule<TaxCalculatorInput['pph_badan']>[] = [
  badanHpp2022Rule,
  badanPerppu2020Rule,
  badanUu36_2008Rule,
  badanUu36_2009Rule,
];
