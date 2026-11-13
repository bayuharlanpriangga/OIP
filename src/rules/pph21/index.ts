import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph21Hpp2022Rule } from './hpp2022';
import { pph21Pmk162_2013Rule } from './pmk162_2013';
import { pph21Ter2024Rule } from './ter2024';
import { pph21Uu36_2016Rule } from './uu36_2016';

export const PPH21_RULES: TaxRuleModule<TaxCalculatorInput['pph21']>[] = [
  pph21Ter2024Rule,
  pph21Hpp2022Rule,
  pph21Uu36_2016Rule,
  pph21Pmk162_2013Rule,
];
