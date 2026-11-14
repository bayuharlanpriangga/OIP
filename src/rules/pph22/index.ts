import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph22Kmk254_2001Rule } from './kmk254_2001';
import { pph22Kmk450_1997Rule } from './kmk450_1997';
import { pph22Pmk154_2010Rule } from './pmk154_2010';
import { pph22Pmk34_2017Rule } from './pmk34_2017';
import { pph22Pmk37_2025Rule } from './pmk37_2025';
import { pph22Pmk51_2025Rule } from './pmk51_2025';
import { pph22Pmk81_2024Rule } from './pmk81_2024';
import { pph22Uu7_1983Rule } from './uu7_1983';

export const PPH22_RULES: TaxRuleModule<TaxCalculatorInput['pph22']>[] = [
  pph22Pmk51_2025Rule,
  pph22Pmk37_2025Rule,
  pph22Pmk81_2024Rule,
  pph22Pmk34_2017Rule,
  pph22Pmk154_2010Rule,
  pph22Kmk254_2001Rule,
  pph22Kmk450_1997Rule,
  pph22Uu7_1983Rule,
];
