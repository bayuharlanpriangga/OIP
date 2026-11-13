import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pbbHkpd2022Rule } from './hkpd2022';
import { pbbPdrd2009Rule } from './pdrd2009';
import { pbbUu12_1994Rule } from './uu12_1994';

export const PBB_RULES: TaxRuleModule<TaxCalculatorInput['pbb']>[] = [
  pbbHkpd2022Rule,
  pbbPdrd2009Rule,
  pbbUu12_1994Rule,
];
