import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_uu36_2009',
  taxType: 'pph_badan',
  name: 'UU Nomor 36 Tahun 2008 (TP 2009)',
  shortName: '2009 (28%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b & ayat (2b) UU 36/2008',
  effectivePeriod: 'Tahun Pajak 2009',
  isCurrent: false,
  summary:
    'Tarif tunggal perdana PPh Badan sebesar 28% pada Tahun Pajak 2009 (diskon 5% menjadi 23% bagi emiten Tbk) dengan fasilitas Pasal 31E bertarif efektif 14%.',
  sources: [SRC.UU_36_2008, SRC.PP_81_2007],
};

const article: TaxArticle = {
  id: 'pph-badan-uu36-2009',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Transisi Tarif Tunggal Perdana 28% dan Kelahiran Pasal 31E pada Tahun Pajak 2009',
  legalBasis: 'Pasal 17 ayat (1) huruf b, Pasal 17 ayat (2b) & Pasal 31E UU Nomor 36 Tahun 2008',
  effectiveDate: 'Tahun Pajak 2009',
  readMinutes: 4,
  summary:
    'Tahun Pajak 2009 menjadi tahun transisi bersejarah ketika Indonesia menghapus sistem 3 lapisan progresif PPh Badan menjadi tarif tunggal 28%, sebelum turun kembali menjadi 25% mulai 2010.',
  sections: [
    {
      heading: 'Menghapus lapisan 10%/15%/30% menjadi tarif tunggal 28%',
      paragraphs: [
        'Hingga 2008, PPh Badan mengenakan tarif puncak 30% atas PKP di atas Rp 100 juta. Mulai Tahun Pajak 2009, UU 36/2008 menetapkan tarif tunggal 28% untuk satu tahun transisi (dan otomatis menjadi 25% sejak Tahun Pajak 2010).',
        'Bagi Wajib Pajak Badan berbentuk Perseroan Terbuka dengan kepemilikan saham publik >= 40%, tarif diturunkan 5% menjadi 23% pada Tahun Pajak 2009.',
      ],
    },
    {
      heading: 'Kelahiran fasilitas diskon 50% Pasal 31E bagi usaha beromzet <= Rp 50 M',
      paragraphs: [
        'Agar penghapusan lapisan terbawah 10% dan 15% tidak membebani korporasi berskala kecil dan menengah, UU 36/2008 memperkenalkan Pasal 31E sejak 2009: pengurangan tarif 50% atas porsi PKP dari peredaran bruto sampai Rp 4,8 miliar bagi badan usaha dengan omzet tahunan maksimal Rp 50 miliar (menghasilkan tarif efektif 14% di 2009).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 17/2000 (2001–2008)',
    newHeader: 'UU 36/2008 Transisi (TP 2009)',
    rows: [
      {
        aspek: 'Struktur tarif umum Badan',
        aturanLama: 'Progresif 10% / 15% / 30%',
        aturanBaru: 'Tarif tunggal 28%',
      },
      {
        aspek: 'Fasilitas UMKM Badan Pasal 31E',
        aturanLama: 'Belum ada',
        aturanBaru: 'Diskon 50% (efektif 14%) s.d. omzet Rp 50 M',
      },
      {
        aspek: 'Tarif khusus emiten Tbk',
        aturanLama: 'Diskon 5% pada TP 2008 (PP 81/2007)',
        aturanBaru: '23% (diskon 5% dari 28%)',
      },
    ],
  },
  caseExample: {
    title: 'PT beromzet Rp 3,8 miliar dan PKP Rp 400 juta di tahun 2009',
    scenario:
      'Menghitung PPh Badan Tahun Pajak 2009 untuk perusahaan dengan omzet di bawah Rp 4,8 miliar yang memperoleh tarif Pasal 31E penuh (14%).',
    presetRegime: 'badan_uu36_2009',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 3800000000,
        penghasilanKenaPajak: 400000000,
        isTbk: false,
      },
    },
  },
};

export const badanUu36_2009Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 23 : 28);
  },
};
