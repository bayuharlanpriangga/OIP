export type TaxTypeId =
  | 'pph21'
  | 'pph22'
  | 'pph23'
  | 'pph4_2'
  | 'pph_umkm'
  | 'pph25'
  | 'pph26'
  | 'pph15'
  | 'pph_badan'
  | 'ppn'
  | 'ppnbm'
  | 'pbb'
  | 'bphtb'
  | 'pbjt'
  | 'bea_meterai';

export type PtkpStatus =
  | 'TK/0'
  | 'TK/1'
  | 'TK/2'
  | 'TK/3'
  | 'K/0'
  | 'K/1'
  | 'K/2'
  | 'K/3';

export type Pph22ObjectType =
  | 'impor_api'
  | 'impor_non_api'
  | 'impor_komoditas_tertentu'
  | 'impor_konsumsi_10'
  | 'bendahara_bumn'
  | 'bulion_emas'
  | 'barang_sangat_mewah';

export type Pph23ObjectType =
  | 'jasa_teknik_manajemen'
  | 'jasa_konsultan'
  | 'sewa_harta'
  | 'royalti'
  | 'dividen_badan';

export type Pph4_2ObjectType =
  | 'sewa_tanah_bangunan'
  | 'konstruksi_kecil'
  | 'konstruksi_menengah_besar'
  | 'konstruksi_tanpa_sbu'
  | 'konsultansi_konstruksi_sbu'
  | 'konsultansi_konstruksi_tanpa_sbu'
  | 'pengalihan_tanah_bangunan';

export type Pph26ObjectType =
  | 'dividen_royalti_jasa'
  | 'bunga_obligasi_wpln'
  | 'premi_asuransi_ln';

export type Pph15SectorType =
  | 'pelayaran_dn'
  | 'penerbangan_dn_charter'
  | 'pelayaran_penerbangan_ln';

export type PpnbmCategoryType =
  | 'listrik_bev'
  | 'lcgc'
  | 'hybrid_full'
  | 'sedan_suv_menengah'
  | 'kendaraan_emisi_tinggi'
  | 'hunian_mewah'
  | 'kapal_pesiar_pesawat';

export type PbjtSectorType =
  | 'makanan_minuman'
  | 'perhotelan'
  | 'parkir'
  | 'hiburan_umum'
  | 'hiburan_khusus'
  | 'tenaga_listrik';

export type UmkmSubjectType =
  | 'orang_pribadi'
  | 'perseroan_perorangan'
  | 'koperasi'
  | 'badan_usaha';

export type PpnGoodsType = 'umum' | 'barang_mewah';

export type PbbTierRate = 'rendah' | 'menengah' | 'tinggi' | 'maksimal';

export type BphtbAcquisitionType = 'jual_beli_pertama' | 'jual_beli_lainnya' | 'waris_hibah_wasiat';

export interface TaxSource {
  title: string;
  url: string;
  publisher?: string;
}

export interface TaxRegime {
  id: string;
  taxType: TaxTypeId;
  name: string;
  shortName: string;
  legalBasis: string;
  effectivePeriod: string;
  isCurrent: boolean;
  currentScopeLabel?: string;
  summary: string;
  sources: TaxSource[];
  verifiedAt?: string;
}

export interface TaxCalculatorInput {
  pph21: {
    gajiBulanan: number;
    tunjanganTetap: number;
    bonusTahunan: number;
    iuranPensiunBulanan: number;
    ptkpStatus: PtkpStatus;
    hasNpwp: boolean;
    pesangonBruto?: number;
    pesangonType?: 'pesangon' | 'pensiun_tht_jht';
    naturaBulanan?: number;
    honorariumApbn?: number;
    golonganAsn?: 'gol_1_2' | 'gol_3' | 'gol_4_pejabat';
    honorariumBukanPegawai?: number;
    bukanPegawaiBerkesinambungan?: boolean;
    skemaNonPegawai?: 'bukan_pegawai_pmk168' | 'harian_ter_pp58';
  };
  pph22: {
    nilaiDasar: number;
    objectType: Pph22ObjectType;
    hasNpwp: boolean;
    akumulasiOmzetSebelumnya?: number;
    marketplaceTaxStatus?: 'umkm_final' | 'umum_kredit' | 'op_surat_pernyataan_dibawah_500jt';
    kriptoChannel?: 'dalam_negeri_ojk' | 'luar_negeri';
    sektorIndustri?:
      | 'bbm_spbu_pertamina'
      | 'bbm_spbu_non_pertamina'
      | 'bbg_pelumas'
      | 'semen'
      | 'kertas'
      | 'baja'
      | 'otomotif'
      | 'farmasi';
    jenisMewah?: 'hunian_mewah' | 'kendaraan_yacht_pesawat';
    eraMewah?: 'pmk92_2019' | 'pmk90_2015' | 'pmk253_2008';
    skemaEmas?:
      | 'pabrikan_ke_pedagang_pkp'
      | 'pabrikan_ke_konsumen'
      | 'pedagang_punya_fp'
      | 'pedagang_tanpa_fp'
      | 'emas_batangan';
  };
  pph23: {
    nilaiBruto: number;
    objectType: Pph23ObjectType;
    hasNpwp: boolean;
    fintechRecipientType?: 'wpdn_but' | 'wpln_pph26' | 'umkm_skb';
  };
  pph4_2: {
    nilaiBruto: number;
    objectType: Pph4_2ObjectType;
    sewaSubjectType?: 'orang_pribadi' | 'badan_usaha';
    depositoSkema?:
      | 'reguler'
      | 'dhe_idr_1bln'
      | 'dhe_idr_3bln'
      | 'dhe_idr_6bln_lebih'
      | 'dhe_usd_1bln'
      | 'dhe_usd_3bln'
      | 'dhe_usd_6bln'
      | 'dhe_usd_lebih_6bln'
      | 'historis_pp51_1994';
    nilaiDepositoPokok?: number;
    eraObligasi?: 'pp91_2021' | 'pp16_2009' | 'pp139_2000';
    isSahamPendiri?: boolean;
    isDividenReinvested?: boolean;
    undianAtauKoperasi?: 'hadiah_undian' | 'simpanan_koperasi';
    skemaPhtbKhusus?: 'umum_2_5' | 'rumah_sederhana_1' | 'pemerintah_bumn_0';
    skemaSpnDhe?: 'diskonto_spn_20' | 'dhe_nonmigas_pp8_2025_12bln' | 'dhe_migas_pp36_2023_3bln';
  };
  pph_umkm: {
    omzetBulanan: number;
    akumulasiOmzetSebelumnya: number;
    subjectType: UmkmSubjectType;
    isEntityInTransition?: boolean;
    isFreeProfession?: boolean;
    omzetTerkaitSebelumnya?: number;
    nppnPersen?: number;
  };
  pph25: {
    pphTerutangTahunLalu: number;
    kreditPajakTahunLalu: number;
    bulanBerjalan: number;
    diskonPandemiPersen?: 30 | 50;
    omzetOpptBulanan?: number;
    flnTransport?: 'udara' | 'laut' | 'punya_npwp';
    isKondisiTurun25?: boolean;
    estimasiPphSetahunBaru?: number;
  };
  pph26: {
    nilaiBruto: number;
    objectType: Pph26ObjectType;
    hasSkdP3b: boolean;
    tarifP3bPersen: number;
    isBptReinvested?: boolean;
  };
  pph15: {
    peredaranBruto: number;
    sectorType: Pph15SectorType;
  };
  pph_badan: {
    peredaranBrutoTahunan: number;
    penghasilanKenaPajak: number;
    isTbk: boolean;
    etrSetelahInsentifPersen?: number;
    tbkEra?: 'pp30_2020' | 'pp77_2013' | 'pp81_2007';
    skemaInsentif?: 'tax_holiday_100' | 'tax_holiday_50' | 'tax_allowance' | 'supertax_rnd';
    nilaiInvestasiAtauRnd?: number;
  };
  ppn: {
    hargaJualDpp: number;
    goodsType: PpnGoodsType;
    termasukPpn: boolean;
    besaranTertentuType?:
      | 'kms_2_2'
      | 'paket_wisata_1_1'
      | 'pengiriman_paket_1_1'
      | 'kendaraan_bekas_1_1'
      | 'freight_forwarding_1_1'
      | 'agen_asuransi_1_1';
    pmseChannel?: 'pmse_jasa_digital' | 'aset_kripto_pmk50_2025' | 'aset_kripto_pmk68_2022';
    eraPkp?: 'pmk197_2013' | 'pmk68_2010';
    periodePropertiDtp?: 'jan_jun_2025_100' | 'jul_des_2025_50';
    skemaEvDtp?: 'kblbb_tkdn40_pmk12_2025' | 'bus_tkdn20_pmk12_2025' | 'kblbb_tkdn40_pmk8_2024';
    skemaStrategis?:
      | 'bkp_jkp_dibebaskan_pp49'
      | 'tidak_dipungut_kawasan'
      | 'wapu_diatas_2jt'
      | 'wapu_dibawah_2jt';
    eraPkpLama?: 'kmk571_2003' | 'kmk552_2000_bkp' | 'kmk552_2000_jkp' | 'kmk648_1994_bkp' | 'kmk648_1994_jkp';
  };
  ppnbm: {
    hargaJual: number;
    categoryType: PpnbmCategoryType;
    dtpDiscountPersen?: 100 | 50 | 25;
  };
  pbb: {
    njopBumi: number;
    njopBangunan: number;
    njoptkpPilihan: number;
    tierRate: PbbTierRate;
    sektorPp46?: 'perkebunan_kehutanan' | 'pertambangan' | 'lainnya_umum';
  };
  bphtb: {
    hargaTransaksi: number;
    njopObjek: number;
    acquisitionType: BphtbAcquisitionType;
    isRumahMbr?: boolean;
  };
  pbjt: {
    nilaiTransaksi: number;
    sectorType: PbjtSectorType;
  };
  bea_meterai: {
    nilaiDokumen: number;
    jumlahDokumen: number;
    isPemeteraianKemudian?: boolean;
    isBebasMeteraiPp3?: boolean;
  };
}

export interface CalculationStep {
  label: string;
  formula?: string;
  value: number;
  isHighlight?: boolean;
  isNegative?: boolean;
  format?: 'currency' | 'percent';
}

export interface CalculationResult {
  regime: TaxRegime;
  primaryTaxLabel: string;
  primaryTaxAmount: number;
  isNotCalculated?: boolean;
  primaryTaxDisplay?: string;
  annualTaxLabel?: string;
  annualTaxAmount?: number;
  effectiveRatePercent: number;
  effectiveRateLabel?: string;
  takeHomeOrNetLabel: string;
  takeHomeOrNetAmount: number;
  steps: CalculationStep[];
  notes: string[];
}

export interface ArticleComparisonRow {
  aspek: string;
  aturanLama: string;
  aturanBaru: string;
}

export interface TaxArticle {
  id: string;
  taxType: TaxTypeId;
  taxTypeLabel: string;
  title: string;
  legalBasis: string;
  effectiveDate: string;
  readMinutes: number;
  summary: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  comparisonTable?: {
    oldHeader: string;
    newHeader: string;
    rows: ArticleComparisonRow[];
  };
  caseExample: {
    title: string;
    scenario: string;
    presetRegime: string;
    presetInput: Partial<TaxCalculatorInput>;
  };
  sources?: TaxSource[];
  verifiedAt?: string;
}

export interface TaxRuleModule<TInput> {
  regime: TaxRegime;
  article?: TaxArticle;
  calculate: (input: TInput) => CalculationResult;
}
