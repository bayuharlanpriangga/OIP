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
  summary: string;
  sources: TaxSource[];
  verifiedAt: string;
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
  };
  pph22: {
    nilaiDasar: number;
    objectType: Pph22ObjectType;
    hasNpwp: boolean;
    akumulasiOmzetSebelumnya?: number;
    marketplaceTaxStatus?: 'umkm_final' | 'umum_kredit' | 'op_surat_pernyataan_dibawah_500jt';
  };
  pph23: {
    nilaiBruto: number;
    objectType: Pph23ObjectType;
    hasNpwp: boolean;
  };
  pph4_2: {
    nilaiBruto: number;
    objectType: Pph4_2ObjectType;
    sewaSubjectType?: 'orang_pribadi' | 'badan_usaha';
  };
  pph_umkm: {
    omzetBulanan: number;
    akumulasiOmzetSebelumnya: number;
    subjectType: UmkmSubjectType;
  };
  pph25: {
    pphTerutangTahunLalu: number;
    kreditPajakTahunLalu: number;
    bulanBerjalan: number;
  };
  pph26: {
    nilaiBruto: number;
    objectType: Pph26ObjectType;
    hasSkdP3b: boolean;
    tarifP3bPersen: number;
  };
  pph15: {
    peredaranBruto: number;
    sectorType: Pph15SectorType;
  };
  pph_badan: {
    peredaranBrutoTahunan: number;
    penghasilanKenaPajak: number;
    isTbk: boolean;
  };
  ppn: {
    hargaJualDpp: number;
    goodsType: PpnGoodsType;
    termasukPpn: boolean;
  };
  ppnbm: {
    hargaJual: number;
    categoryType: PpnbmCategoryType;
  };
  pbb: {
    njopBumi: number;
    njopBangunan: number;
    njoptkpPilihan: number;
    tierRate: PbbTierRate;
  };
  bphtb: {
    hargaTransaksi: number;
    njopObjek: number;
    acquisitionType: BphtbAcquisitionType;
  };
  pbjt: {
    nilaiTransaksi: number;
    sectorType: PbjtSectorType;
  };
  bea_meterai: {
    nilaiDokumen: number;
    jumlahDokumen: number;
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
  annualTaxLabel?: string;
  annualTaxAmount?: number;
  effectiveRatePercent: number;
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
