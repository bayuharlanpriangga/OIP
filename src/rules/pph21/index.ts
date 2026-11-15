import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { pph21Hpp2022Rule } from './hpp2022';
import { pph21Kmk462_1998PesangonRule } from './kmk462_1998_pesangon';
import { pph21Kmk564_2004Rule } from './kmk564_2004';
import { pph21Per2_2009SplnRule } from './per2_2009_spln';
import { pph21Per31_2009Rule } from './per31_2009';
import { pph21Pmk105_2025Rule } from './pmk105_2025';
import { pph21Pmk10_2025Rule } from './pmk10_2025';
import { pph21Pmk122_2015Rule } from './pmk122_2015';
import { pph21Pmk137_2005Rule } from './pmk137_2005';
import { pph21Pmk162_2013Rule } from './pmk162_2013';
import { pph21Pmk168_2023DesemberRule } from './pmk168_2023_desember';
import { pph21Pmk168_2023GrossUpRule } from './pmk168_2023_gross_up';
import { pph21Pmk168_2023KhususRule } from './pmk168_2023_khusus';
import { pph21Pmk168_2023MultiPemberiKerjaRule } from './pmk168_2023_multi_pemberi_kerja';
import { pph21Pmk168_2023NonPegawaiRule } from './pmk168_2023_nonpegawai';
import { pph21Pmk168_2023TengahTahunRule } from './pmk168_2023_tengah_tahun';
import { pph21Pmk18_2021WnaRule } from './pmk18_2021_wna_teritorial';
import { pph21Pmk28_2024IknRule } from './pmk28_2024_ikn';
import { pph21Pmk66_2023Rule } from './pmk66_2023';
import { pph21Pmk86_2020DtpRule } from './pmk86_2020_dtp';
import { pph21Pp149_2000Rule } from './pp149_2000';
import { pph21Pp68_2009Rule } from './pp68_2009';
import { pph21Pp80_2010Rule } from './pp80_2010';
import { pph21Ppd1944Rule } from './ppd1944';
import { pph21Ter2024Rule } from './ter2024';
import { pph21Uu10_1994Rule } from './uu10_1994';
import { pph21Uu17_2000Rule } from './uu17_2000';
import { pph21Uu36_2009Rule } from './uu36_2009';
import { pph21Uu36_2016Rule } from './uu36_2016';
import { pph21Uu7_1983Rule } from './uu7_1983';

export const PPH21_RULES: TaxRuleModule<TaxCalculatorInput['pph21']>[] = [
  pph21Ter2024Rule,
  pph21Pmk168_2023DesemberRule,
  pph21Pmk168_2023GrossUpRule,
  pph21Pmk168_2023MultiPemberiKerjaRule,
  pph21Pmk168_2023TengahTahunRule,
  pph21Pmk168_2023NonPegawaiRule,
  pph21Pmk168_2023KhususRule,
  pph21Pmk105_2025Rule,
  pph21Pmk28_2024IknRule,
  pph21Pmk18_2021WnaRule,
  pph21Per2_2009SplnRule,
  pph21Pmk66_2023Rule,
  pph21Pp80_2010Rule,
  pph21Pmk10_2025Rule,
  pph21Hpp2022Rule,
  pph21Pmk86_2020DtpRule,
  pph21Uu36_2016Rule,
  pph21Pmk122_2015Rule,
  pph21Pmk162_2013Rule,
  pph21Per31_2009Rule,
  pph21Uu36_2009Rule,
  pph21Pmk137_2005Rule,
  pph21Kmk564_2004Rule,
  pph21Uu17_2000Rule,
  pph21Uu10_1994Rule,
  pph21Uu7_1983Rule,
  pph21Ppd1944Rule,
  pph21Pp68_2009Rule,
  pph21Pp149_2000Rule,
  pph21Kmk462_1998PesangonRule,
];
