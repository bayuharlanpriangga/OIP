import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { beaMeteraiPp24_2000Rule } from './pp24_2000';
import { beaMeteraiUu10_2020Rule } from './uu10_2020';

export const BEA_METERAI_RULES: TaxRuleModule<TaxCalculatorInput['bea_meterai']>[] = [
  beaMeteraiUu10_2020Rule,
  beaMeteraiPp24_2000Rule,
];
