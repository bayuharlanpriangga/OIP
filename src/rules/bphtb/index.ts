import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { bphtbBbnPra1997Rule } from './bbn_pra1997';
import { bphtbHkpd2022Rule } from './hkpd2022';
import { bphtbPdrd2009Rule } from './pdrd2009';
import { bphtbPmk91_2006PenguranganRule } from './pmk91_2006_pengurangan';
import { bphtbPp35_2023MbrRule } from './pp35_2023_mbr';
import { bphtbSkb3menteri_2024MbrRule } from './skb3menteri_2024_mbr';
import { bphtbUu20_2000Rule } from './uu20_2000';
import { bphtbUu21_1997Rule } from './uu21_1997';

export const BPHTB_RULES: TaxRuleModule<TaxCalculatorInput['bphtb']>[] = [
  bphtbHkpd2022Rule,
  bphtbPp35_2023MbrRule,
  bphtbSkb3menteri_2024MbrRule,
  bphtbPdrd2009Rule,
  bphtbPmk91_2006PenguranganRule,
  bphtbUu20_2000Rule,
  bphtbUu21_1997Rule,
  bphtbBbnPra1997Rule,
];
