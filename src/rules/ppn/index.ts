import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnHpp2022Rule } from './hpp2022';
import { ppnPmk131_2025Rule } from './pmk131_2025';
import { ppnUu42_2009Rule } from './uu42_2009';

export const PPN_RULES: TaxRuleModule<TaxCalculatorInput['ppn']>[] = [
  ppnPmk131_2025Rule,
  ppnHpp2022Rule,
  ppnUu42_2009Rule,
];
