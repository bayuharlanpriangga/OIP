import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_hpp_2022',
  taxType: 'pph_badan',
  name: 'UU Nomor 7 Tahun 2021 (HPP)',
  shortName: '2022–Sekarang (22%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b UU HPP',
  effectivePeriod: 'Tahun Pajak 2022 – Sekarang',
  isCurrent: true,
  summary:
    'Tarif tunggal 22% (19% untuk Perseroan Terbuka dengan kepemilikan publik >= 40%) dan fasilitas pengurangan tarif 50% Pasal 31E (tarif efektif 11%).',
};

const article: TaxArticle = {
  id: 'pph-badan-31e',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Penurunan Tarif PPh Badan 25% ke 22% dan Perhitungan Fasilitas Pasal 31E',
  legalBasis: 'UU HPP (7/2021), UU 2/2020, dan UU 36/2008',
  effectiveDate: '1 Januari 2022',
  readMinutes: 5,
  summary:
    'Cara kerja diskon tarif 50% Pasal 31E untuk badan usaha beromzet hingga Rp 50 miliar dan perbandingan beban fiskal antara tarif lama 25% dan tarif kini 22%.',
  sections: [
    {
      heading: 'Pembatalan tarif 20% dan penetapan permanen 22%',
      paragraphs: [
        'Selama 2010–2019, tarif umum PPh Badan adalah 25%. UU 2/2020 sempat merencanakan penurunan bertahap menjadi 22% untuk Tahun Pajak 2020–2021 dan 20% mulai 2022. Namun, UU HPP membatalkan penurunan ke 20% tersebut dan menetapkan tarif PPh Badan tetap 22% mulai Tahun Pajak 2022 seterusnya.',
        'Bagi Perseroan Terbuka (Tbk) yang minimal 40% sahamnya diperdagangkan di Bursa Efek Indonesia serta memenuhi syarat sebaran pemegang saham, diberikan pengurangan tarif 3% menjadi 19% (dulu 20% saat tarif umum masih 25%).',
      ],
    },
    {
      heading: 'Mekanisme proporsional Pasal 31E UU PPh',
      paragraphs: [
        'Wajib Pajak Badan dalam negeri dengan peredaran bruto sampai Rp 50 miliar memperoleh pengurangan tarif sebesar 50% atas Penghasilan Kena Pajak (PKP) yang merupakan bagian dari peredaran bruto hingga Rp 4,8 miliar.',
        'Bila omzet <= Rp 4,8 miliar, seluruh PKP dikenai tarif efektif 11% (50% × 22%). Bila omzet antara Rp 4,8 miliar hingga Rp 50 miliar, bagian PKP yang mendapat fasilitas dihitung dengan rumus (Rp 4,8 miliar ÷ Peredaran Bruto) × PKP, sedangkan sisanya dikenai tarif normal 22%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 (2010–2019)',
    newHeader: 'UU HPP (2022–Sekarang)',
    rows: [
      {
        aspek: 'Tarif umum PPh Badan',
        aturanLama: '25%',
        aturanBaru: '22%',
      },
      {
        aspek: 'Tarif Perseroan Terbuka (Tbk)',
        aturanLama: '20% (diskon 5%)',
        aturanBaru: '19% (diskon 3%)',
      },
      {
        aspek: 'Tarif fasilitas Pasal 31E',
        aturanLama: '12,5% (50% × 25%)',
        aturanBaru: '11% (50% × 22%)',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan manufaktur beromzet Rp 12,4 miliar',
    scenario:
      'PT non-Tbk dengan peredaran bruto Rp 12,4 miliar dan laba fiskal (PKP) Rp 1,45 miliar menggunakan perhitungan proporsional Pasal 31E tarif UU HPP 22%.',
    presetRegime: 'badan_hpp_2022',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 12400000000,
        penghasilanKenaPajak: 1450000000,
        isTbk: false,
      },
    },
  },
};

export const badanHpp2022Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 19 : 22);
  },
};
