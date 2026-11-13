export type TaxTypeId =
  | 'pph21'
  | 'pph23'
  | 'pph_umkm'
  | 'pph_badan'
  | 'ppn'
  | 'pbb'
  | 'bphtb';

export type PtkpStatus =
  | 'TK/0'
  | 'TK/1'
  | 'TK/2'
  | 'TK/3'
  | 'K/0'
  | 'K/1'
  | 'K/2'
  | 'K/3';

export type Pph23ObjectType =
  | 'jasa_teknik_manajemen'
  | 'jasa_konsultan'
  | 'sewa_harta'
  | 'royalti'
  | 'dividen_badan';

export type UmkmSubjectType = 'orang_pribadi' | 'badan_usaha';

export type PpnGoodsType = 'umum' | 'barang_mewah';

export type PbbTierRate = 'rendah' | 'menengah' | 'tinggi' | 'maksimal';

export type BphtbAcquisitionType = 'jual_beli_pertama' | 'jual_beli_lainnya' | 'waris_hibah_wasiat';

export interface TaxRegime {
  id: string;
  taxType: TaxTypeId;
  name: string;
  shortName: string;
  legalBasis: string;
  effectivePeriod: string;
  isCurrent: boolean;
  summary: string;
}

export interface TaxCalculatorInput {
  pph21: {
    gajiBulanan: number;
    tunjanganTetap: number;
    bonusTahunan: number;
    iuranPensiunBulanan: number;
    ptkpStatus: PtkpStatus;
    hasNpwp: boolean;
  };
  pph23: {
    nilaiBruto: number;
    objectType: Pph23ObjectType;
    hasNpwp: boolean;
  };
  pph_umkm: {
    omzetBulanan: number;
    akumulasiOmzetSebelumnya: number;
    subjectType: UmkmSubjectType;
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
}

export interface TaxRuleModule<TInput> {
  regime: TaxRegime;
  article?: TaxArticle;
  calculate: (input: TInput) => CalculationResult;
}
