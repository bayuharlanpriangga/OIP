import { beaMasukFasilitasRule } from './fasilitas_pembebasan_kite';
import { beaMasukPra1996Rule } from './ordonansi_bea_pra1996';
import { beaMasukNilaiPabeanRule } from './pmk144_2022_nilai_pabean';
import { beaMasukReimporRule } from './pmk175_2021_reimpor';
import { beaMasukImporSementaraRule } from './pmk178_2017_impor_sementara';
import { beaMasukKirimanHistorisRule } from './pmk199_2019_kiriman_historis';
import { beaMasukBtkiLamaRule } from './pmk213_2011_btki_lama';
import { beaMasukBarangPindahanRule } from './pmk25_2025_barang_pindahan';
import { beaMasukBtki2022Rule } from './pmk26_2022_btki';
import { beaMasukPenumpangRule } from './pmk34_2025_penumpang';
import { beaMasukFtaSkaRule } from './pmk35_2023_fta_ska';
import { beaMasukRushHandlingRule } from './pmk74_2021_rush_handling';
import { beaMasukKiriman2025Rule } from './pmk96_2023_kiriman';
import { beaMasukBmtPp34Rule } from './pp34_2011_bmt';
import { beaMasukSanksiSptnpRule } from './pp39_2019_sanksi_sptnp';
import { beaMasukFtzPlbRule } from './pp41_2021_ftz_plb';
import { beaMasukBtbmiUu101995Rule } from './uu10_1995_btbmi';

export const BEA_MASUK_RULES = [
  beaMasukBtki2022Rule,
  beaMasukNilaiPabeanRule,
  beaMasukFtaSkaRule,
  beaMasukKiriman2025Rule,
  beaMasukPenumpangRule,
  beaMasukBarangPindahanRule,
  beaMasukImporSementaraRule,
  beaMasukReimporRule,
  beaMasukRushHandlingRule,
  beaMasukFtzPlbRule,
  beaMasukFasilitasRule,
  beaMasukBmtPp34Rule,
  beaMasukSanksiSptnpRule,
  beaMasukKirimanHistorisRule,
  beaMasukBtkiLamaRule,
  beaMasukBtbmiUu101995Rule,
  beaMasukPra1996Rule,
];
