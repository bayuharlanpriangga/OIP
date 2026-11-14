import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { badanHpp2022Rule } from './hpp2022';
import { badanInsentifFiskalRule } from './insentif_fiskal';
import { badanPerppu2020Rule } from './perppu2020';
import { badanGmtPmk136_2024Rule } from './pmk136_2024_gmt';
import { badanPmk169_2015DerRule } from './pmk169_2015_der';
import { badanPmk72_2023PenyusutanRule } from './pmk72_2023_penyusutan';
import { badanPp12_2023IknRule } from './pp12_2023_ikn_pfii';
import { badanPp15_2022EkstraktifRule } from './pp15_2022_ekstraktif';
import { badanPp30_2020TbkRule } from './pp30_2020_tbk';
import { badanPps1925Rule } from './pps1925';
import { badanUu10_1994Rule } from './uu10_1994';
import { badanUu17_2000Rule } from './uu17_2000';
import { badanUu36_2008Rule } from './uu36_2008';
import { badanUu36_2009Rule } from './uu36_2009';
import { badanUu7_1983Rule } from './uu7_1983';

export const PPH_BADAN_RULES: TaxRuleModule<TaxCalculatorInput['pph_badan']>[] = [
  badanHpp2022Rule,
  badanGmtPmk136_2024Rule,
  badanPp30_2020TbkRule,
  badanInsentifFiskalRule,
  badanPp12_2023IknRule,
  badanPmk169_2015DerRule,
  badanPmk72_2023PenyusutanRule,
  badanPp15_2022EkstraktifRule,
  badanPerppu2020Rule,
  badanUu36_2008Rule,
  badanUu36_2009Rule,
  badanUu17_2000Rule,
  badanUu10_1994Rule,
  badanUu7_1983Rule,
  badanPps1925Rule,
];
