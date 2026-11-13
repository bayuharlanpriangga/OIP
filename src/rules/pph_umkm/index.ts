import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { umkmPp23_2018Rule } from './pp23_2018';
import { umkmPp46_2013Rule } from './pp46_2013';
import { umkmPp55_2022Rule } from './pp55_2022';

export const PPH_UMKM_RULES: TaxRuleModule<TaxCalculatorInput['pph_umkm']>[] = [
  umkmPp55_2022Rule,
  umkmPp23_2018Rule,
  umkmPp46_2013Rule,
];
