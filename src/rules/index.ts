import {
  CalculationResult,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxTypeId,
} from '../types/tax';
import { BPHTB_RULES } from './bphtb';
import { PBB_RULES } from './pbb';
import { PPH21_RULES } from './pph21';
import { PPH23_RULES } from './pph23';
import { PPH_BADAN_RULES } from './pph_badan';
import { PPH_UMKM_RULES } from './pph_umkm';
import { PPN_RULES } from './ppn';

export const TAX_CATEGORIES: {
  id: TaxTypeId;
  label: string;
  shortLabel: string;
  scope: string;
}[] = [
  {
    id: 'pph21',
    label: 'PPh Pasal 21',
    shortLabel: 'PPh 21',
    scope: 'Penghasilan pegawai tetap, gaji bulanan, bonus, dan tunjangan',
  },
  {
    id: 'pph23',
    label: 'PPh Pasal 23',
    shortLabel: 'PPh 23',
    scope: 'Pemotongan atas jasa, sewa harta bergerak, royalti, dan dividen',
  },
  {
    id: 'pph_umkm',
    label: 'PPh Final UMKM',
    shortLabel: 'PPh UMKM',
    scope: 'Pajak final peredaran bruto sampai dengan Rp 4,8 miliar per tahun',
  },
  {
    id: 'pph_badan',
    label: 'PPh Badan',
    shortLabel: 'PPh Badan',
    scope: 'Pajak penghasilan tahunan perseroan dan fasilitas Pasal 31E',
  },
  {
    id: 'ppn',
    label: 'PPN',
    shortLabel: 'PPN',
    scope: 'Pajak Pertambahan Nilai atas penyerahan barang dan jasa kena pajak',
  },
  {
    id: 'pbb',
    label: 'PBB',
    shortLabel: 'PBB',
    scope: 'Pajak Bumi dan Bangunan atas kepemilikan/pemanfaatan tanah dan bangunan',
  },
  {
    id: 'bphtb',
    label: 'BPHTB',
    shortLabel: 'BPHTB',
    scope: 'Bea Perolehan Hak atas Tanah dan Bangunan dari jual beli maupun waris',
  },
];

export const DEFAULT_CALCULATOR_INPUT: TaxCalculatorInput = {
  pph21: {
    gajiBulanan: 0,
    tunjanganTetap: 0,
    bonusTahunan: 0,
    iuranPensiunBulanan: 0,
    ptkpStatus: 'TK/0',
    hasNpwp: true,
  },
  pph23: {
    nilaiBruto: 0,
    objectType: 'jasa_konsultan',
    hasNpwp: true,
  },
  pph_umkm: {
    omzetBulanan: 0,
    akumulasiOmzetSebelumnya: 0,
    subjectType: 'orang_pribadi',
  },
  pph_badan: {
    peredaranBrutoTahunan: 0,
    penghasilanKenaPajak: 0,
    isTbk: false,
  },
  ppn: {
    hargaJualDpp: 0,
    goodsType: 'umum',
    termasukPpn: false,
  },
  pbb: {
    njopBumi: 0,
    njopBangunan: 0,
    njoptkpPilihan: 10000000,
    tierRate: 'menengah',
  },
  bphtb: {
    hargaTransaksi: 0,
    njopObjek: 0,
    acquisitionType: 'jual_beli_pertama',
  },
};

export const TAX_REGIMES: TaxRegime[] = [
  ...PPH21_RULES.map((m) => m.regime),
  ...PPH23_RULES.map((m) => m.regime),
  ...PPH_UMKM_RULES.map((m) => m.regime),
  ...PPH_BADAN_RULES.map((m) => m.regime),
  ...PPN_RULES.map((m) => m.regime),
  ...PBB_RULES.map((m) => m.regime),
  ...BPHTB_RULES.map((m) => m.regime),
];

export const TAX_ARTICLES: TaxArticle[] = [
  ...PPH21_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH23_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH_UMKM_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH_BADAN_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPN_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PBB_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...BPHTB_RULES.flatMap((m) => (m.article ? [m.article] : [])),
];

export function runTaxCalculation(
  taxType: TaxTypeId,
  input: TaxCalculatorInput,
  regimeId: string
): CalculationResult {
  switch (taxType) {
    case 'pph21': {
      const mod = PPH21_RULES.find((r) => r.regime.id === regimeId) ?? PPH21_RULES[0];
      return mod.calculate(input.pph21);
    }
    case 'pph23': {
      const mod = PPH23_RULES.find((r) => r.regime.id === regimeId) ?? PPH23_RULES[0];
      return mod.calculate(input.pph23);
    }
    case 'pph_umkm': {
      const mod = PPH_UMKM_RULES.find((r) => r.regime.id === regimeId) ?? PPH_UMKM_RULES[0];
      return mod.calculate(input.pph_umkm);
    }
    case 'pph_badan': {
      const mod = PPH_BADAN_RULES.find((r) => r.regime.id === regimeId) ?? PPH_BADAN_RULES[0];
      return mod.calculate(input.pph_badan);
    }
    case 'ppn': {
      const mod = PPN_RULES.find((r) => r.regime.id === regimeId) ?? PPN_RULES[0];
      return mod.calculate(input.ppn);
    }
    case 'pbb': {
      const mod = PBB_RULES.find((r) => r.regime.id === regimeId) ?? PBB_RULES[0];
      return mod.calculate(input.pbb);
    }
    case 'bphtb': {
      const mod = BPHTB_RULES.find((r) => r.regime.id === regimeId) ?? BPHTB_RULES[0];
      return mod.calculate(input.bphtb);
    }
  }
}
