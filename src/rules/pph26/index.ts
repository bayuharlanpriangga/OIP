import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph26Kmk624_1994AsuransiRule } from './kmk624_1994_asuransi';
import { pph26Pbdr1970Rule } from './pbdr_1970_wpln';
import { pph26Per61_2009SkdRule } from './per61_2009_skd';
import { pph26Pmk112_2025P3bRule } from './pmk112_2025_p3b';
import { pph26Pmk14_2011BptRule } from './pmk14_2011_bpt';
import { pph26Pmk258_2008SahamRule } from './pmk258_2008_saham';
import { pph26Pmk35_2019ButRule } from './pmk35_2019_but';
import { pph26Pmk82_2009HartaRule } from './pmk82_2009_harta';
import { pph26Pp9_2021Rule } from './pp9_2021_p3b';
import { pph26Uu10_1994Rule } from './uu10_1994';
import { pph26Uu36_2008Rule } from './uu36_2008';
import { pph26Uu7_1983Rule } from './uu7_1983';

export const PPH26_RULES: TaxRuleModule<TaxCalculatorInput['pph26']>[] = [
  pph26Pmk112_2025P3bRule,
  pph26Pp9_2021Rule,
  pph26Pmk35_2019ButRule,
  pph26Per61_2009SkdRule,
  pph26Pmk14_2011BptRule,
  pph26Pmk82_2009HartaRule,
  pph26Kmk624_1994AsuransiRule,
  pph26Pmk258_2008SahamRule,
  pph26Uu36_2008Rule,
  pph26Uu10_1994Rule,
  pph26Uu7_1983Rule,
  pph26Pbdr1970Rule,
];
