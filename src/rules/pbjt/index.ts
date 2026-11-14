import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pbjtHkpd2022Rule } from './hkpd2022';
import { pbjtPdrd2009Rule } from './pdrd2009';

export const PBJT_RULES: TaxRuleModule<TaxCalculatorInput['pbjt']>[] = [
  pbjtHkpd2022Rule,
  pbjtPdrd2009Rule,
];
