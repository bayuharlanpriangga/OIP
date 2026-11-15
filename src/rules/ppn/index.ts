import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { ppnHpp2022Rule } from './hpp2022';
import { ppnKmk552_2000PkpRule } from './kmk552_2000_pkp';
import { ppnPasal16dAktivaRule } from './pasal16d_aktiva';
import { ppnPmk11_2025BesaranTertentuRule } from './pmk11_2025_besaran_tertentu';
import { ppnPmk119_2024RestitusiRule } from './pmk119_2024_restitusi';
import { ppnPer11_2025DigunggungRule } from './per11_2025_digunggung';
import { ppnPmk12_2025DtpEvRule } from './pmk12_2025_dtp_ev';
import { ppnPmk131_2025Rule } from './pmk131_2025';
import { ppnPmk13_2025DtpPropertiRule } from './pmk13_2025_dtp_properti';
import { ppnPmk163_2012KmsRule } from './pmk163_2012_kms_lama';
import { ppnPmk186_2022ProporsionalRule } from './pmk186_2022_proporsional';
import { ppnPmk18_2025DtpTiketRule } from './pmk18_2025_dtp_tiket';
import { ppnPmk197_2013PkpRule } from './pmk197_2013_pkp';
import { ppnPmk32_2019EksporJkpRule } from './pmk32_2019_ekspor_jkp';
import { ppnPmk40_2010JlnRule } from './pmk40_2010_jln';
import { ppnPmk41_2023AydaRule } from './pmk41_2023_ayda';
import { ppnPmk60_2022PmseRule } from './pmk60_2022_pmse';
import { ppnPmk64_2022PertanianRule } from './pmk64_2022_pertanian';
import { ppnPmk75_2010NilaiLainReturRule } from './pmk75_2010_nilai_lain_retur';
import { ppnPmk81_2024WapuBumnKkksRule } from './pmk81_2024_wapu_bumn_kkks';
import { ppnPp40_2021KekRefundRule } from './pp40_2021_kek_refund';
import { ppnPp47_2020DiplomatikRule } from './pp47_2020_diplomatik';
import { ppnPp49_2022StrategisRule } from './pp49_2022_strategis';
import { ppnPp81_2015StrategisRule } from './pp81_2015_strategis_lama';
import { ppnPp85_2015KawasanBerikatRule } from './pp85_2015_kawasan_berikat';
import { ppnUu11_1994Rule } from './uu11_1994';
import { ppnUu18_2000Rule } from './uu18_2000';
import { ppnUu42_2009Rule } from './uu42_2009';
import { ppnUu8_1983Rule } from './uu8_1983';
import { ppnUuPpn1951Rule } from './uuppn1951';

export const PPN_RULES: TaxRuleModule<TaxCalculatorInput['ppn']>[] = [
  ppnPmk131_2025Rule,
  ppnPasal16dAktivaRule,
  ppnPmk186_2022ProporsionalRule,
  ppnPmk32_2019EksporJkpRule,
  ppnPmk41_2023AydaRule,
  ppnPmk75_2010NilaiLainReturRule,
  ppnPp85_2015KawasanBerikatRule,
  ppnPmk119_2024RestitusiRule,
  ppnPer11_2025DigunggungRule,
  ppnPp47_2020DiplomatikRule,
  ppnPmk81_2024WapuBumnKkksRule,
  ppnPmk40_2010JlnRule,
  ppnPmk13_2025DtpPropertiRule,
  ppnPmk18_2025DtpTiketRule,
  ppnPmk11_2025BesaranTertentuRule,
  ppnPmk64_2022PertanianRule,
  ppnPp40_2021KekRefundRule,
  ppnPp49_2022StrategisRule,
  ppnPmk60_2022PmseRule,
  ppnPmk12_2025DtpEvRule,
  ppnPmk163_2012KmsRule,
  ppnPp81_2015StrategisRule,
  ppnPmk197_2013PkpRule,
  ppnHpp2022Rule,
  ppnUu42_2009Rule,
  ppnKmk552_2000PkpRule,
  ppnUu18_2000Rule,
  ppnUu11_1994Rule,
  ppnUu8_1983Rule,
  ppnUuPpn1951Rule,
];
