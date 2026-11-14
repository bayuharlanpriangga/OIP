import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnHpp2022Rule } from './hpp2022';
import { ppnPmk131_2025Rule } from './pmk131_2025';
import { ppnUu11_1994Rule } from './uu11_1994';
import { ppnUu18_2000Rule } from './uu18_2000';
import { ppnUu42_2009Rule } from './uu42_2009';
import { ppnUu8_1983Rule } from './uu8_1983';

export const PPN_RULES: TaxRuleModule<TaxCalculatorInput['ppn']>[] = [
  ppnPmk131_2025Rule,
  ppnHpp2022Rule,
  ppnUu42_2009Rule,
  ppnUu18_2000Rule,
  ppnUu11_1994Rule,
  ppnUu8_1983Rule,
];
