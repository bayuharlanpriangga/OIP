import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { umkmNppnPra2013Rule } from './nppn_pra2013';
import { umkmPmk44_2020DtpRule } from './pmk44_2020_dtp';
import { umkmPp20_2026Rule } from './pp20_2026';
import { umkmPp20_2026TransisiRule } from './pp20_2026_transisi_badan';
import { umkmPp23_2018Rule } from './pp23_2018';
import { umkmPp46_2013Rule } from './pp46_2013';
import { umkmPp55_2022Rule } from './pp55_2022';

export const PPH_UMKM_RULES: TaxRuleModule<TaxCalculatorInput['pph_umkm']>[] = [
  umkmPp20_2026Rule,
  umkmPp20_2026TransisiRule,
  umkmPp55_2022Rule,
  umkmPp23_2018Rule,
  umkmPmk44_2020DtpRule,
  umkmPp46_2013Rule,
  umkmNppnPra2013Rule,
];
