import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph25Pmk215_2018Rule } from './pmk215_2018';
import { pph25Pmk81_2024Rule } from './pmk81_2024';

export const PPH25_RULES: TaxRuleModule<TaxCalculatorInput['pph25']>[] = [
  pph25Pmk81_2024Rule,
  pph25Pmk215_2018Rule,
];
