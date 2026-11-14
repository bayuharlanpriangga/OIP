import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk122_2015',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 122/2015',
  shortName: '2015 (PMK 122/2015)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 122/PMK.010/2015',
  effectivePeriod: '1 Januari 2015 – 31 Desember 2015',
  isCurrent: false,
  summary:
    'PTKP TK/0 naik menjadi Rp 36 juta per tahun (tambahan kawin/tanggungan Rp 3 juta) dengan lapisan tarif Pasal 17 UU 36/2008 (5% s.d. 30%).',
  sources: [SRC.PMK_122_2015, SRC.UU_36_2008, SRC.PMK_250_2008],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk122-2015',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Penyesuaian PTKP Tahun Pajak 2015 Menjadi Rp 36 Juta (PMK 122/2015)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 122/PMK.010/2015',
  effectiveDate: '1 Januari 2015 – 31 Desember 2015',
  readMinutes: 3,
  summary:
    'PMK 122/2015 menjadi jembatan historis satu tahun antara PTKP Rp 24,3 juta (2013–2014) dan Rp 54 juta (2016), dengan menetapkan batas bebas pajak TK/0 sebesar Rp 36 juta setahun.',
  sections: [
    {
      heading: 'Kenaikan 48% dari PTKP 2013–2014 untuk menjaga daya beli',
      paragraphs: [
        'Ditetapkan pada pertengahan 2015 dan berlaku untuk seluruh Tahun Pajak 2015, PMK 122/PMK.010/2015 menaikkan PTKP TK/0 dari Rp 24.300.000 menjadi Rp 36.000.000 per tahun (Rp 3.000.000 per bulan) serta menaikkan tambahan status kawin/tanggungan dari Rp 2.025.000 menjadi Rp 3.000.000.',
        'Kebijakan ini membuat penghasilan pegawai hingga sekitar UMR/UMP pada 2015 tidak lagi terpotong PPh Pasal 21, dan mendorong pembetulan SPT Masa untuk bulan Januari–Juni yang telah telanjur dipotong dengan PTKP lama.',
      ],
    },
    {
      heading: 'Struktur Biaya Jabatan dan lapisan tarif Pasal 17',
      paragraphs: [
        'Pengurang penghasilan bruto tetap mengacu pada PMK 250/PMK.03/2008 (Biaya Jabatan 5% maksimal Rp 6.000.000/tahun), sedangkan lapisan tarif tetap memakai 4 lapis Pasal 17 UU 36/2008 (5%, 15%, 25%, 30%) beserta penalti +20% non-NPWP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 162/2012 (2013–2014)',
    newHeader: 'PMK 122/2015 (Tahun Pajak 2015)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 24.300.000 / tahun',
        aturanBaru: 'Rp 36.000.000 / tahun',
      },
      {
        aspek: 'Tambahan kawin & tanggungan',
        aturanLama: 'Rp 2.025.000 / status',
        aturanBaru: 'Rp 3.000.000 / status',
      },
      {
        aspek: 'PTKP maksimal (K/3)',
        aturanLama: 'Rp 32.400.000 / tahun',
        aturanBaru: 'Rp 48.000.000 / tahun',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai lajang TK/0 bergaji Rp 6 juta per bulan di tahun 2015',
    scenario:
      'Pegawai ber-NPWP status TK/0 menerima gaji Rp 6.000.000/bulan pada 2015 untuk membandingkan PKP PTKP Rp 36 juta terhadap era sebelumnya.',
    presetRegime: 'pph21_pmk122_2015',
    presetInput: {
      pph21: {
        gajiBulanan: 6000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 100000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk122_2015Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk122_2015', 'uu36_2008');
  },
};
