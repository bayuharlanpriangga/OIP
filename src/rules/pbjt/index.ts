import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pbjtHkpd2022Rule } from './hkpd2022';
import { pbjtPdrd2009Rule } from './pdrd2009';
import { pbjtUu34_2000Rule } from './uu34_2000';

export const PBJT_RULES: TaxRuleModule<TaxCalculatorInput['pbjt']>[] = [
  pbjtHkpd2022Rule,
  pbjtPdrd2009Rule,
  pbjtUu34_2000Rule,
];
