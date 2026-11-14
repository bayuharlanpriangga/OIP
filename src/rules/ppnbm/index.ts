import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnbmPp145_2000Rule } from './pp145_2000';
import { ppnbmPp22_1985Rule } from './pp22_1985';
import { ppnbmPp41_2013Rule } from './pp41_2013';
import { ppnbmPp50_1994Rule } from './pp50_1994';
import { ppnbmPp74_2021Rule } from './pp74_2021';

export const PPNBM_RULES: TaxRuleModule<TaxCalculatorInput['ppnbm']>[] = [
  ppnbmPp74_2021Rule,
  ppnbmPp41_2013Rule,
  ppnbmPp145_2000Rule,
  ppnbmPp50_1994Rule,
  ppnbmPp22_1985Rule,
];
