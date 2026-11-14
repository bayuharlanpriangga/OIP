import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_uu36_2008',
  taxType: 'pph_badan',
  name: 'UU Nomor 36 Tahun 2008 (TP 2010–2019)',
  shortName: '2010–2019 (25%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b, ayat (2a), ayat (2b) & Pasal 31E UU 36/2008',
  effectivePeriod: 'Tahun Pajak 2010 – 2019',
  isCurrent: false,
  summary:
    'Tarif umum PPh Badan sebesar 25% (diskon 5% menjadi 20% bagi perusahaan Tbk) dengan fasilitas Pasal 31E bertarif efektif 12,5%.',
  sources: [SRC.UU_36_2008, SRC.PP_81_2007],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-uu36-2008',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Struktur Tarif Tunggal PPh Badan 25% dan Insentif Emiten Tbk Era UU 36/2008',
  legalBasis: 'Pasal 17 ayat (1) huruf b, ayat (2a), ayat (2b) & Pasal 31E UU Nomor 36 Tahun 2008',
  effectiveDate: '1 Januari 2010',
  readMinutes: 4,
  summary:
    'Mengulas pemberlakuan tarif tunggal PPh Badan 25% selama satu dekade (2010–2019), pengurangan 5% bagi emiten bursa, serta batas fasilitas 12,5%.',
  sections: [
    {
      heading: 'Peralihan dari tarif progresif badan ke tarif tunggal 25%',
      paragraphs: [
        'Sebelum tahun 2009, PPh Badan di Indonesia menggunakan lapisan tarif progresif 10%, 15%, dan 30%. UU 36/2008 menghapus sistem berlapis tersebut menjadi tarif tunggal 28% pada 2009, lalu turun menjadi 25% sejak Tahun Pajak 2010.',
        'Pada masa ini, perusahaan terbuka yang paling sedikit 40% sahamnya tercatat di Bursa Efek Indonesia berhak atas penurunan tarif sebesar 5 poin persentase sehingga membayar 20% (sedangkan sejak 2020 diskon emiten diubah menjadi 3 poin persentase dari tarif umum 22% menjadi 19%).',
      ],
    },
    {
      heading: 'Dampak tarif 25% pada perhitungan Pasal 31E',
      paragraphs: [
        'Bagi perseroan dengan omzet tahunan hingga Rp 50 miliar, pengurangan 50% Pasal 31E di era UU 36/2008 menghasilkan tarif efektif sebesar 12,5% untuk porsi PKP yang memperoleh fasilitas, lebih tinggi 1,5 poin persentase dibanding tarif fasilitas 11% saat ini.',
      ],
    },
  ],
  caseExample: {
    title: 'Perhitungan PPh Badan 25% untuk omzet Rp 12,4 miliar',
    scenario:
      'PT non-Tbk beromzet Rp 12,4 miliar dan PKP Rp 1,45 miliar dihitung dengan rezim UU 36/2008 (tarif normal 25% dan fasilitas 12,5%).',
    presetRegime: 'badan_uu36_2008',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 12400000000,
        penghasilanKenaPajak: 1450000000,
        isTbk: false,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const badanUu36_2008Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 20 : 25);
  },
};
