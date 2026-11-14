import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pbjtHkpd2022Rule } from './hkpd2022';
import { pbjtHkpdOpsenRule } from './hkpd_opsen_pkb_bbnkb';
import { pbjtHkpdDaerahLainRule } from './hkpd_pajak_daerah_lain';
import { pbjtHkpdProvinsiOtotarifRule } from './hkpd_pkb_bbnkb_pbbkb_rokok';
import { pbjtPdrd2009Rule } from './pdrd2009';
import { pbjtPp35_2023DaerahRule } from './pp35_2023_daerah';
import { pbjtUu11_1957Rule } from './uu11_1957';
import { pbjtUu18_1997Rule } from './uu18_1997';
import { pbjtUu34_2000Rule } from './uu34_2000';

export const PBJT_RULES: TaxRuleModule<TaxCalculatorInput['pbjt']>[] = [
  pbjtHkpd2022Rule,
  pbjtHkpdOpsenRule,
  pbjtHkpdProvinsiOtotarifRule,
  pbjtHkpdDaerahLainRule,
  pbjtPp35_2023DaerahRule,
  pbjtPdrd2009Rule,
  pbjtUu34_2000Rule,
  pbjtUu18_1997Rule,
  pbjtUu11_1957Rule,
];
