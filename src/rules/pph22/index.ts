import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph22BbmIndustriRule } from './bbm_industri';
import { pph22Kmk254_2001Rule } from './kmk254_2001';
import { pph22Kmk450_1997Rule } from './kmk450_1997';
import { pph22MpoUu8_1967Rule } from './mpo_uu8_1967';
import { pph22Pmk154_2010Rule } from './pmk154_2010';
import { pph22Pmk253_2008MewahRule } from './pmk253_2008_mewah';
import { pph22Pmk34_2017Rule } from './pmk34_2017';
import { pph22Pmk37_2025Rule } from './pmk37_2025';
import { pph22Pmk48_2023EmasRule } from './pmk48_2023_emas';
import { pph22Pmk50_2025KriptoRule } from './pmk50_2025_kripto';
import { pph22Pmk51_2025Rule } from './pmk51_2025';
import { pph22Pmk58_2022SippRule } from './pmk58_2022_sipp';
import { pph22Pmk68_2022KriptoRule } from './pmk68_2022_kripto';
import { pph22Pmk81_2024Rule } from './pmk81_2024';
import { pph22Uu7_1983Rule } from './uu7_1983';

export const PPH22_RULES: TaxRuleModule<TaxCalculatorInput['pph22']>[] = [
  pph22Pmk51_2025Rule,
  pph22Pmk37_2025Rule,
  pph22Pmk50_2025KriptoRule,
  pph22Pmk48_2023EmasRule,
  pph22Pmk58_2022SippRule,
  pph22BbmIndustriRule,
  pph22Pmk253_2008MewahRule,
  pph22Pmk81_2024Rule,
  pph22Pmk68_2022KriptoRule,
  pph22Pmk34_2017Rule,
  pph22Pmk154_2010Rule,
  pph22Kmk254_2001Rule,
  pph22Kmk450_1997Rule,
  pph22Uu7_1983Rule,
  pph22MpoUu8_1967Rule,
];
