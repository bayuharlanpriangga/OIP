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
  | 'ekspor_tambang_1_5'
  | 'pengumpul_kehutanan_perkebunan_0_25'
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
  | 'balon_udara_peluru'
  | 'helikopter_senjata_api'
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
    bulanBayarBonus?: 'jan_nov' | 'desember';
    pmk168KhususType?: 'dewan_komisaris' | 'peserta_kegiatan' | 'penarikan_dapen' | 'mantan_pegawai';
    wnaTahunKe?: number;
    tahunPesangonLama?: 'kmk462_1998' | 'kmk600_1995';
    isEligibleIknPmk28?: boolean;
    jumlahBulanKerja?: number;
    skemaTengahTahun?: 'lokal_berhenti_tidak_setahun' | 'expat_meninggal_tinggal_ri_setahun';
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
      | 'pedagang_punya_fp_konsumen'
      | 'pedagang_tanpa_fp_usaha'
      | 'pedagang_tanpa_fp'
      | 'emas_batangan';
    skemaPembebasan22?: 'belanja_max_2jt' | 'kite_kek_bebas_bm' | 'impor_ekspor_skb_djp' | 'umkm_pp55_skb';
  };
  pph23: {
    nilaiBruto: number;
    objectType: Pph23ObjectType;
    hasNpwp: boolean;
    fintechRecipientType?: 'wpdn_but' | 'wpln_pph26' | 'umkm_skb';
    isSuketUmkm?: boolean;
    isPengecualianPasal23_4?: boolean;
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
    skemaPph42Historis?: 'deposito_15_pp51_1994' | 'undian_20_pp42_1994';
    skemaDireVentura?: 'kik_dire_0_5' | 'modal_ventura_0_1';
    nilaiBukuFiskal?: number;
    skemaRevaluasi?: 'reguler_10_pmk79' | 'insentif_2015_3' | 'insentif_h1_2016_4' | 'insentif_h2_2016_6';
    skemaTaPps?:
      | 'ta_dn_2'
      | 'ta_dn_3'
      | 'ta_dn_5'
      | 'ta_ln_4'
      | 'ta_ln_6'
      | 'ta_ln_10'
      | 'ta_umkm_0_5'
      | 'ta_umkm_2'
      | 'pps_k1_6'
      | 'pps_k1_8'
      | 'pps_k1_11'
      | 'pps_k2_12'
      | 'pps_k2_14'
      | 'pps_k2_18';
  };
  pph_umkm: {
    omzetBulanan: number;
    akumulasiOmzetSebelumnya: number;
    subjectType: UmkmSubjectType;
    isEntityInTransition?: boolean;
    isFreeProfession?: boolean;
    omzetTerkaitSebelumnya?: number;
    nppnPersen?: number;
    marginLabaPersen?: number;
    skemaSuket164?:
      | 'suket_pihak_ketiga_0_5'
      | 'tanpa_suket_pph23_2'
      | 'suket_op_kuota_500jt_0'
      | 'lewati_4_8m_pkp_akhir_tahun';
  };
  pph25: {
    pphTerutangTahunLalu: number;
    kreditPajakTahunLalu: number;
    bulanBerjalan: number;
    diskonPandemiPersen?: 30 | 50;
    omzetOpptBulanan?: number;
    flnTransport?: 'udara' | 'laut' | 'darat' | 'punya_npwp';
    isKondisiTurun25?: boolean;
    estimasiPphSetahunBaru?: number;
    skemaWpTertentu?: 'bank_ojk' | 'bumn_bumd_rkap' | 'emiten_berkala';
    labaTriwulanAtauRkap?: number;
    flnEra1994?: 'pp46_1994' | 'pp17_1998';
    skemaWpBaruTransisi?: 'wp_baru_umum' | 'masa_sebelum_spt' | 'penggabungan_peleburan' | 'wp_baru_oppt';
  };
  pph26: {
    nilaiBruto: number;
    objectType: Pph26ObjectType;
    hasSkdP3b: boolean;
    tarifP3bPersen: number;
    isBptReinvested?: boolean;
    skemaButPpt?: 'beneficial_owner_valid' | 'ppt_fragmentasi_ditolak' | 'conduit_gagal_bo';
    nilaiPenyerahanJasaBut?: number;
    hariDiIndonesia?: number;
    skemaAsuransi624?: 'tertanggung_ri_10' | 'perusahaan_asuransi_ri_2' | 'perusahaan_reasuransi_ri_1';
  };
  pph15: {
    peredaranBruto: number;
    sectorType: Pph15SectorType;
    hasSkdP3bArticle8?: boolean;
  };
  pph_badan: {
    peredaranBrutoTahunan: number;
    penghasilanKenaPajak: number;
    isTbk: boolean;
    etrSetelahInsentifPersen?: number;
    tbkEra?: 'pp30_2020' | 'pp77_2013' | 'pp81_2007';
    skemaInsentif?: 'tax_holiday_100' | 'tax_holiday_50' | 'tax_allowance' | 'supertax_rnd';
    nilaiInvestasiAtauRnd?: number;
    utangBerbunga?: number;
    ekuitasFiskal?: number;
    kelompokHartaPenyusutan?: 'kel_1_4thn' | 'kel_2_8thn' | 'kel_3_16thn' | 'kel_4_20thn' | 'bangunan_20thn';
    skemaEkstraktif?: 'batubara_iupk_pp15_18' | 'mineral_pp37_2018' | 'migas_gross_split_pp53';
    skemaIknPfii?: 'ikn_tax_holiday_100' | 'ikn_supertax_350' | 'financial_center_ikn';
    koreksiPositifNonDeductible?: number;
    koreksiNegatif?: number;
    kompensasiKerugianFiskal?: number;
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
    periodePropertiDtp?: 'ta_2026_100_pmk90' | 'jan_jun_2025_100' | 'jul_des_2025_100_pmk60' | 'jul_des_2025_50';
    periodeTiketDtp?:
      | 'pmk77_nataru_2026'
      | 'pmk43_libur_2026'
      | 'pmk4_lebaran_2026'
      | 'pmk18_mudik_2025'
      | 'pmk36_libur_2025'
      | 'pmk71_nataru_2025'
      | 'reguler_non_dtp';
    skemaEvDtp?: 'kblbb_tkdn40_pmk12_2025' | 'bus_tkdn20_pmk12_2025' | 'kblbb_tkdn40_pmk8_2024';
    skemaStrategis?:
      | 'bkp_jkp_dibebaskan_pp49'
      | 'tidak_dipungut_kawasan'
      | 'wapu_diatas_2jt'
      | 'wapu_dibawah_2jt';
    eraPkpLama?: 'kmk571_2003' | 'kmk552_2000_bkp' | 'kmk552_2000_jkp' | 'kmk648_1994_bkp' | 'kmk648_1994_jkp';
    skemaKmsLama?: 'pmk163_2012_2persen' | 'pmk61_2022_2_2persen' | 'pmk64_pertanian_1_1persen';
    skemaKekRefund?: 'kek_tidak_dipungut_pp40' | 'vat_refund_turis_pmk120';
    skemaWapu81?: 'bumn_pmk8_diatas_10jt' | 'bumn_pmk8_sd_10jt' | 'kkks_diatas_10jt' | 'instansi_diatas_2jt';
    statusPkpJln?: 'pkp_dapat_kredit' | 'non_pkp_beban_biaya';
  };
  ppnbm: {
    hargaJual: number;
    categoryType: PpnbmCategoryType;
    dtpDiscountPersen?: 100 | 50 | 25;
    isPembebasanPmk141?: boolean;
  };
  pbb: {
    njopBumi: number;
    njopBangunan: number;
    njoptkpPilihan: number;
    tierRate: PbbTierRate;
    sektorPp46?: 'perkebunan_kehutanan' | 'pertambangan' | 'lainnya_umum';
    sektorP3Lama?: 'migas_panas_bumi_pmk76' | 'perkebunan_hutanan_pmk139';
  };
  bphtb: {
    hargaTransaksi: number;
    njopObjek: number;
    acquisitionType: BphtbAcquisitionType;
    isRumahMbr?: boolean;
    tingkatPenguranganBphtb?: 'pengurangan_25' | 'pengurangan_50' | 'pengurangan_75';
    penghasilanBulananMbr?: number;
    adaPerkadaPembebasanMbr?: boolean;
  };
  pbjt: {
    nilaiTransaksi: number;
    sectorType: PbjtSectorType;
    listrikSkema?: 'umum_10' | 'industri_migas_3' | 'sendiri_1_5';
    jenisOpsenHkpd?: 'opsen_pkb_66' | 'opsen_bbnkb_66';
    jenisPajakDaerahLain?: 'reklame_25' | 'air_tanah_20' | 'minerba_mblb_20' | 'pab_alat_berat_0_2';
    jenisPajakProvinsiHkpd?: 'pkb_non_dki' | 'pkb_dki' | 'bbnkb_non_dki' | 'bbnkb_dki' | 'pbbkb_10' | 'rokok_10';
  };
  bea_meterai: {
    nilaiDokumen: number;
    jumlahDokumen: number;
    isPemeteraianKemudian?: boolean;
    isBebasMeteraiPp3?: boolean;
    jenisTransisiMeterai?: 'transisi_3000_6000_9000' | 'pemungut_emeterai_pmk151';
    skemaPemungutNonObjek?: 'non_objek_pasal7' | 'pemungut_1000_pmk78' | 'nominal_sd_5jt';
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
