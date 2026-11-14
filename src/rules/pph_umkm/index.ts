import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { umkmPp20_2026Rule } from './pp20_2026';
import { umkmPp23_2018Rule } from './pp23_2018';
import { umkmPp46_2013Rule } from './pp46_2013';
import { umkmPp55_2022Rule } from './pp55_2022';

export const PPH_UMKM_RULES: TaxRuleModule<TaxCalculatorInput['pph_umkm']>[] = [
  umkmPp20_2026Rule,
  umkmPp55_2022Rule,
  umkmPp23_2018Rule,
  umkmPp46_2013Rule,
];
