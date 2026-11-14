import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph23Kep170_2002Rule } from './kep170_2002';
import { pph23Kep176_2000Rule } from './kep176_2000';
import { pph23Per70_2007Rule } from './per70_2007';
import { pph23Pmk141_2015Rule } from './pmk141_2015';
import { pph23Pmk244_2009Rule } from './pmk244_2009';

export const PPH23_RULES: TaxRuleModule<TaxCalculatorInput['pph23']>[] = [
  pph23Pmk141_2015Rule,
  pph23Pmk244_2009Rule,
  pph23Per70_2007Rule,
  pph23Kep170_2002Rule,
  pph23Kep176_2000Rule,
];
