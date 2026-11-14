import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph25Kep537_2000Rule } from './kep537_2000';
import { pph25Kmk522_2000OpptRule } from './kmk522_2000_oppt';
import { pph25MpsUu8_1967Rule } from './mps_uu8_1967';
import { pph25Pmk215_2018Rule } from './pmk215_2018';
import { pph25Pmk215_2018WpTertentuRule } from './pmk215_2018_wp_tertentu';
import { pph25Pmk23_2020Rule } from './pmk23_2020_diskon30';
import { pph25Pmk81_2024Rule } from './pmk81_2024';
import { pph25Pmk9_2021Rule } from './pmk9_2021';
import { pph25Pp42_2000FlnRule } from './pp42_2000_fln';
import { pph25Pp46_1994FlnRule } from './pp46_1994_fln';
import { pph25Pp80_2008FlnRule } from './pp80_2008_fln';
import { pph25Uu7_1983Rule } from './uu7_1983';

export const PPH25_RULES: TaxRuleModule<TaxCalculatorInput['pph25']>[] = [
  pph25Pmk81_2024Rule,
  pph25Pmk215_2018Rule,
  pph25Pmk215_2018WpTertentuRule,
  pph25Kmk522_2000OpptRule,
  pph25Pmk9_2021Rule,
  pph25Pmk23_2020Rule,
  pph25Kep537_2000Rule,
  pph25Uu7_1983Rule,
  pph25MpsUu8_1967Rule,
  pph25Pp80_2008FlnRule,
  pph25Pp42_2000FlnRule,
  pph25Pp46_1994FlnRule,
];
