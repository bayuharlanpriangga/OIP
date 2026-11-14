import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnHpp2022Rule } from './hpp2022';
import { ppnKmk552_2000PkpRule } from './kmk552_2000_pkp';
import { ppnPmk11_2025BesaranTertentuRule } from './pmk11_2025_besaran_tertentu';
import { ppnPmk12_2025DtpEvRule } from './pmk12_2025_dtp_ev';
import { ppnPmk131_2025Rule } from './pmk131_2025';
import { ppnPmk13_2025DtpPropertiRule } from './pmk13_2025_dtp_properti';
import { ppnPmk197_2013PkpRule } from './pmk197_2013_pkp';
import { ppnPmk60_2022PmseRule } from './pmk60_2022_pmse';
import { ppnPp49_2022StrategisRule } from './pp49_2022_strategis';
import { ppnUu11_1994Rule } from './uu11_1994';
import { ppnUu18_2000Rule } from './uu18_2000';
import { ppnUu42_2009Rule } from './uu42_2009';
import { ppnUu8_1983Rule } from './uu8_1983';
import { ppnUuPpn1951Rule } from './uuppn1951';

export const PPN_RULES: TaxRuleModule<TaxCalculatorInput['ppn']>[] = [
  ppnPmk131_2025Rule,
  ppnPmk13_2025DtpPropertiRule,
  ppnPmk12_2025DtpEvRule,
  ppnPmk11_2025BesaranTertentuRule,
  ppnPp49_2022StrategisRule,
  ppnPmk60_2022PmseRule,
  ppnPmk197_2013PkpRule,
  ppnHpp2022Rule,
  ppnUu42_2009Rule,
  ppnKmk552_2000PkpRule,
  ppnUu18_2000Rule,
  ppnUu11_1994Rule,
  ppnUu8_1983Rule,
  ppnUuPpn1951Rule,
];
