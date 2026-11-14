import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pbbHkpd2022Rule } from './hkpd2022';
import { pbbIpedaPra1986Rule } from './ipeda_pra1986';
import { pbbPdrd2009Rule } from './pdrd2009';
import { pbbPmk186_2019P3Rule } from './pmk186_2019_p3';
import { pbbPp35_2023Rule } from './pp35_2023_pbb';
import { pbbPp46_2000Rule } from './pp46_2000';
import { pbbUu12_1985Rule } from './uu12_1985';
import { pbbUu12_1994Rule } from './uu12_1994';

export const PBB_RULES: TaxRuleModule<TaxCalculatorInput['pbb']>[] = [
  pbbHkpd2022Rule,
  pbbPp35_2023Rule,
  pbbPmk186_2019P3Rule,
  pbbPdrd2009Rule,
  pbbPp46_2000Rule,
  pbbUu12_1994Rule,
  pbbUu12_1985Rule,
  pbbIpedaPra1986Rule,
];
