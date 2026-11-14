import { TaxCalculatorInput, TaxRuleModule } from '../../types/tax';
import { beaMeteraiPmk134_2021TransisiRule } from './pmk134_2021_transisi';
import { beaMeteraiPmk78_2024Rule } from './pmk78_2024_pelaksana';
import { beaMeteraiPp24_2000Rule } from './pp24_2000';
import { beaMeteraiPp3_2022Rule } from './pp3_2022_fasilitas';
import { beaMeteraiPp7_1995Rule } from './pp7_1995';
import { beaMeteraiUu10_2020Rule } from './uu10_2020';
import { beaMeteraiUu10_2020PemungutNonobjekRule } from './uu10_2020_pemungut_nonobjek';
import { beaMeteraiUu13_1985Rule } from './uu13_1985';
import { beaMeteraiZegel1921Rule } from './zegel1921';

export const BEA_METERAI_RULES: TaxRuleModule<TaxCalculatorInput['bea_meterai']>[] = [
  beaMeteraiUu10_2020Rule,
  beaMeteraiPmk78_2024Rule,
  beaMeteraiUu10_2020PemungutNonobjekRule,
  beaMeteraiPp3_2022Rule,
  beaMeteraiPmk134_2021TransisiRule,
  beaMeteraiPp24_2000Rule,
  beaMeteraiPp7_1995Rule,
  beaMeteraiUu13_1985Rule,
  beaMeteraiZegel1921Rule,
];
