import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { REGIME_VERIFIED_AT, SRC } from '../sources';
import { calculateCorporateTaxWith31E } from './shared';

const regime: TaxRegime = {
  id: 'badan_perppu_2020',
  taxType: 'pph_badan',
  name: 'Perppu 1/2020 jo. UU 2/2020',
  shortName: '2020–2021 (22%)',
  legalBasis: 'UU Nomor 2 Tahun 2020',
  effectivePeriod: 'Tahun Pajak 2020 – 2021',
  isCurrent: false,
  summary:
    'Menurunkan tarif PPh Badan dari 25% ke 22% (dan Tbk ke 19%) sebagai respons fiskal pandemi, sebelum rencana penurunan lanjutan ke 20% dibatalkan UU HPP.',
  sources: [SRC.UU_2_2020, SRC.UU_7_2021_HPP],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph-badan-perppu-2020',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Pemangkasan Tarif PPh Badan ke 22% di Masa Pandemi (Perppu 1/2020 jo. UU 2/2020)',
  legalBasis: 'Pasal 5 ayat (1) Perppu 1/2020 jo. UU Nomor 2 Tahun 2020',
  effectiveDate: 'Tahun Pajak 2020 – 2021',
  readMinutes: 4,
  summary:
    'Untuk menjaga daya tahan dunia usaha menghadapi pandemi COVID-19, Perppu 1/2020 menurunkan tarif PPh Badan dari 25% menjadi 22% mulai Tahun Pajak 2020–2021 dan mengubah diskon emiten Tbk menjadi 3%.',
  sections: [
    {
      heading: 'Penurunan 3 poin persentase sekaligus dan nasib tarif 20%',
      paragraphs: [
        'Melalui Perppu 1 Tahun 2020 yang ditetapkan menjadi UU Nomor 2 Tahun 2020, pemerintah memotong tarif tunggal PPh Badan dari 25% menjadi 22% untuk Tahun Pajak 2020 dan 2021.',
        'Pasal 5 ayat (1) huruf b UU 2/2020 semula juga merencanakan penurunan lanjutan menjadi 20% mulai Tahun Pajak 2022, namun ketentuan tersebut kemudian dibatalkan oleh UU HPP (UU 7/2021) agar tarif 22% tetap dipertahankan demi konsolidasi APBN.',
      ],
    },
    {
      heading: 'Diskon Tbk 3% dan penyesuaian tarif efektif Pasal 31E',
      paragraphs: [
        'Emiten Tbk dengan kepemilikan publik >= 40% mendapat pengurangan tarif 3% lebih rendah (menjadi 19%), berubah dari sebelumnya 5% pada rezim UU 36/2008. Sementara fasilitas Pasal 31E tetap mengurangi tarif normal sebesar 50% sehingga porsi omzet <= Rp 4,8 miliar otomatis dikenai tarif efektif 11%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 (2010–2019)',
    newHeader: 'UU 2/2020 (2020–2021)',
    rows: [
      {
        aspek: 'Tarif umum PPh Badan',
        aturanLama: '25%',
        aturanBaru: '22%',
      },
      {
        aspek: 'Tarif emiten Tbk (>= 40% publik)',
        aturanLama: '20% (diskon 5%)',
        aturanBaru: '19% (diskon 3%)',
      },
      {
        aspek: 'Tarif efektif fasilitas Pasal 31E',
        aturanLama: '12,5%',
        aturanBaru: '11%',
      },
    ],
  },
  caseExample: {
    title: 'PT Tbk memenuhi syarat publik dengan PKP Rp 10 miliar pada 2021',
    scenario:
      'Menghitung PPh Badan PT Tbk beromzet Rp 80 miliar (non-31E) dan PKP Rp 10 miliar pada Tahun Pajak 2021 menggunakan tarif diskon emiten 19%.',
    presetRegime: 'badan_perppu_2020',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 80000000000,
        penghasilanKenaPajak: 10000000000,
        isTbk: true,
      },
    },
  },
};

export const badanPerppu2020Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    return calculateCorporateTaxWith31E(input, regime, input.isTbk ? 19 : 22);
  },
};
