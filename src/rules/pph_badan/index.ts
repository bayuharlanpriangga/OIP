import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { badanHpp2022Rule } from './hpp2022';
import { badanInsentifFiskalRule } from './insentif_fiskal';
import { pphBadanKoreksiFiskalKerugianRule } from './koreksi_fiskal_kerugian';
import { badanPerppu2020Rule } from './perppu2020';
import { badanGmtPmk136_2024Rule } from './pmk136_2024_gmt';
import { badanPmk169_2015DerRule } from './pmk169_2015_der';
import { badanPmk172_2023TpDocRule } from './pmk172_2023_tp_doc';
import { badanPmk18_2021DividenLnRule } from './pmk18_2021_dividen_ln';
import { badanPmk192_2018Pph24Rule } from './pmk192_2018_pph24';
import { badanPmk52_2017MergerRule } from './pmk52_2017_merger';
import { badanPmk72_2023PenyusutanRule } from './pmk72_2023_penyusutan';
import { badanPmk93_2019CfcRule } from './pmk93_2019_cfc';
import { badanPp12_2023IknRule } from './pp12_2023_ikn_pfii';
import { badanPp15_2022EkstraktifRule } from './pp15_2022_ekstraktif';
import { badanPp30_2020TbkRule } from './pp30_2020_tbk';
import { badanPp60_2010ZakatRule } from './pp60_2010_zakat';
import { badanPps1925Rule } from './pps1925';
import { badanUu10_1994Rule } from './uu10_1994';
import { badanUu17_2000Rule } from './uu17_2000';
import { badanUu36_2008Rule } from './uu36_2008';
import { badanUu36_2009Rule } from './uu36_2009';
import { badanUu7_1983Rule } from './uu7_1983';

export const PPH_BADAN_RULES: TaxRuleModule<TaxCalculatorInput['pph_badan']>[] = [
  badanHpp2022Rule,
  pphBadanKoreksiFiskalKerugianRule,
  badanGmtPmk136_2024Rule,
  badanPp30_2020TbkRule,
  badanInsentifFiskalRule,
  badanPp12_2023IknRule,
  badanPmk192_2018Pph24Rule,
  badanPmk93_2019CfcRule,
  badanPmk172_2023TpDocRule,
  badanPmk52_2017MergerRule,
  badanPmk18_2021DividenLnRule,
  badanPp60_2010ZakatRule,
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
