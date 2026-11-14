import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph22Kmk254_2001Rule } from './kmk254_2001';
import { pph22Pmk154_2010Rule } from './pmk154_2010';
import { pph22Pmk34_2017Rule } from './pmk34_2017';

export const PPH22_RULES: TaxRuleModule<TaxCalculatorInput['pph22']>[] = [
  pph22Pmk34_2017Rule,
  pph22Pmk154_2010Rule,
  pph22Kmk254_2001Rule,
];
