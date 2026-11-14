import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnbmPmk106_2015NonKendaraanRule } from './pmk106_2015_nonkendaraan';
import { ppnbmPmk12_2025DtpRule } from './pmk12_2025_dtp_hybrid';
import { ppnbmPmk20_2021DtpRule } from './pmk20_2021_dtp';
import { ppnbmPp145_2000Rule } from './pp145_2000';
import { ppnbmPp22_1985Rule } from './pp22_1985';
import { ppnbmPp41_2013Rule } from './pp41_2013';
import { ppnbmPp50_1994Rule } from './pp50_1994';
import { ppnbmPp74_2021Rule } from './pp74_2021';

export const PPNBM_RULES: TaxRuleModule<TaxCalculatorInput['ppnbm']>[] = [
  ppnbmPp74_2021Rule,
  ppnbmPmk12_2025DtpRule,
  ppnbmPmk20_2021DtpRule,
  ppnbmPmk106_2015NonKendaraanRule,
  ppnbmPp41_2013Rule,
  ppnbmPp145_2000Rule,
  ppnbmPp50_1994Rule,
  ppnbmPp22_1985Rule,
];
