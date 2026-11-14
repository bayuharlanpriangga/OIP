import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph23Kep128_1997Rule } from './kep128_1997';
import { pph23Kep170_2002Rule } from './kep170_2002';
import { pph23Kep176_2000Rule } from './kep176_2000';
import { pph23Pbdr1970Rule } from './pbdr_1970';
import { pph23Per70_2007Rule } from './per70_2007';
import { pph23Pmk141_2015Rule } from './pmk141_2015';
import { pph23Pmk244_2009Rule } from './pmk244_2009';
import { pph23Pmk69_2022FintechRule } from './pmk69_2022_fintech';
import { pph23Pmk81_2024Rule } from './pmk81_2024_coretax';
import { pph23Uu7_1983Rule } from './uu7_1983';

export const PPH23_RULES: TaxRuleModule<TaxCalculatorInput['pph23']>[] = [
  pph23Pmk81_2024Rule,
  pph23Pmk141_2015Rule,
  pph23Pmk69_2022FintechRule,
  pph23Pmk244_2009Rule,
  pph23Per70_2007Rule,
  pph23Kep170_2002Rule,
  pph23Kep176_2000Rule,
  pph23Kep128_1997Rule,
  pph23Uu7_1983Rule,
  pph23Pbdr1970Rule,
];
