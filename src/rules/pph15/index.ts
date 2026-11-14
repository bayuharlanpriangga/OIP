import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph15Kmk181_1995Rule } from './kmk181_1995';
import { pph15Kmk416_1996Rule } from './kmk416_1996';
import { pph15Kmk543_2002MaklonRule } from './kmk543_2002_maklon';
import { pph15Kmk628_1991MigasRule } from './kmk628_1991_migas';
import { pph15Kmk634_1994KpdRule } from './kmk634_1994_kpd';

export const PPH15_RULES: TaxRuleModule<TaxCalculatorInput['pph15']>[] = [
  pph15Kmk416_1996Rule,
  pph15Kmk634_1994KpdRule,
  pph15Kmk543_2002MaklonRule,
  pph15Kmk628_1991MigasRule,
  pph15Kmk181_1995Rule,
];
