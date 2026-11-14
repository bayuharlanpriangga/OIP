import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { beaMeteraiPp24_2000Rule } from './pp24_2000';
import { beaMeteraiPp7_1995Rule } from './pp7_1995';
import { beaMeteraiUu10_2020Rule } from './uu10_2020';
import { beaMeteraiUu13_1985Rule } from './uu13_1985';

export const BEA_METERAI_RULES: TaxRuleModule<TaxCalculatorInput['bea_meterai']>[] = [
  beaMeteraiUu10_2020Rule,
  beaMeteraiPp24_2000Rule,
  beaMeteraiPp7_1995Rule,
  beaMeteraiUu13_1985Rule,
];
