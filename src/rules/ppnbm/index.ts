import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnbmPp41_2013Rule } from './pp41_2013';
import { ppnbmPp74_2021Rule } from './pp74_2021';

export const PPNBM_RULES: TaxRuleModule<TaxCalculatorInput['ppnbm']>[] = [
  ppnbmPp74_2021Rule,
  ppnbmPp41_2013Rule,
];
