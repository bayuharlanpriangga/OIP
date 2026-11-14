import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { bphtbHkpd2022Rule } from './hkpd2022';
import { bphtbPdrd2009Rule } from './pdrd2009';
import { bphtbUu20_2000Rule } from './uu20_2000';
import { bphtbUu21_1997Rule } from './uu21_1997';

export const BPHTB_RULES: TaxRuleModule<TaxCalculatorInput['bphtb']>[] = [
  bphtbHkpd2022Rule,
  bphtbPdrd2009Rule,
  bphtbUu20_2000Rule,
  bphtbUu21_1997Rule,
];
