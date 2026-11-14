import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph15Kmk416_1996Rule } from './kmk416_1996';

export const PPH15_RULES: TaxRuleModule<TaxCalculatorInput['pph15']>[] = [pph15Kmk416_1996Rule];
