import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { REGIME_VERIFIED_AT, SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_hpp_2022',
  taxType: 'pph21',
  name: 'UU HPP & PER-16/PJ/2016',
  shortName: '2022–2023 (UU HPP)',
  legalBasis: 'UU Nomor 7 Tahun 2021 (HPP) & PER-16/PJ/2016',
  effectivePeriod: '1 Januari 2022 – 31 Desember 2023',
  isCurrent: false,
  summary:
    'Belum menggunakan TER. Potongan bulanan disetahunkan langsung memakai tarif progresif UU HPP (lapisan 5% diperluas s.d. Rp 60 jt; lapisan baru 35% di atas Rp 5 M).',
  sources: [SRC.UU_7_2021_HPP, SRC.UU_7_2021_SETNEG, SRC.PER_16_PJ_2016, SRC.PMK_101_2016],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph21-lapisan-hpp',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Perubahan Lapisan Tarif Progresif Pasal 17 dan Sejarah Kenaikan PTKP',
  legalBasis: 'UU Nomor 7 Tahun 2021 (HPP) vs UU Nomor 36 Tahun 2008',
  effectiveDate: '1 Januari 2022',
  readMinutes: 5,
  summary:
    'Perluasan lapisan terbawah 5% dari Rp 50 juta menjadi Rp 60 juta menurunkan beban pekerja berpenghasilan menengah, sementara lapisan 35% diberlakukan untuk PKP di atas Rp 5 miliar.',
  sections: [
    {
      heading: 'Pergeseran batas Penghasilan Kena Pajak (PKP)',
      paragraphs: [
        'Selama 2009–2021, UU 36/2008 membatasi tarif terbawah 5% hanya sampai PKP Rp 50.000.000 per tahun. Melalui UU Harmonisasi Peraturan Perpajakan (UU HPP), batas lapisan pertama diperlebar menjadi Rp 60.000.000 per tahun sejak Tahun Pajak 2022.',
        'Di sisi atas, UU HPP menambahkan lapisan kelima sebesar 35% bagi Wajib Pajak Orang Pribadi dengan PKP melebihi Rp 5.000.000.000 dalam setahun, yang sebelumnya mentok pada tarif 30%.',
      ],
    },
    {
      heading: 'Dampak historis kenaikan PTKP 2013–2016',
      paragraphs: [
        'Penyesuaian Penghasilan Tidak Kena Pajak (PTKP) juga sangat memengaruhi daya beli pekerja. Pada periode 2013–2014 (PMK 162/2012), PTKP TK/0 hanya Rp 24.300.000 setahun. Pada 2015 naik ke Rp 36.000.000, dan sejak 2016 melalui PMK 101/2016 ditetapkan menjadi Rp 54.000.000 dengan tambahan Rp 4.500.000 untuk status kawin dan masing-masing tanggungan (maksimal 3).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 & PMK 162/2012 (2013–2014)',
    newHeader: 'UU HPP & PMK 101/2016 (2022–Kini)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 24.300.000 / tahun',
        aturanBaru: 'Rp 54.000.000 / tahun',
      },
      {
        aspek: 'Batas lapisan tarif 5%',
        aturanLama: 'Rp 0 s.d. Rp 50.000.000',
        aturanBaru: 'Rp 0 s.d. Rp 60.000.000',
      },
      {
        aspek: 'Tarif tertinggi Pasal 17',
        aturanLama: '30% (PKP > Rp 500 juta)',
        aturanBaru: '35% (PKP > Rp 5 miliar)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi PPh 21 UU HPP sebelum berlakunya skema TER',
    scenario:
      'Pegawai berstatus TK/0 dengan gaji Rp 9.500.000/bulan tanpa bonus dihitung dengan metode disetahunkan tarif UU HPP.',
    presetRegime: 'pph21_hpp_2022',
    presetInput: {
      pph21: {
        gajiBulanan: 9500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 190000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
};

export const pph21Hpp2022Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk101_2016', 'hpp');
  },
};
