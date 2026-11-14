import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk162_2013',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 162/2012',
  shortName: '2013–2014 (PMK 162/2012)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 162/PMK.011/2012',
  effectivePeriod: '1 Januari 2013 – 31 Desember 2014',
  isCurrent: false,
  summary:
    'PTKP TK/0 sebesar Rp 24,3 juta per tahun (tambahan kawin/tanggungan Rp 2,025 juta) dengan lapisan tarif Pasal 17 UU 36/2008 (5% s.d. 30%).',
  sources: [SRC.PMK_162_2012, SRC.UU_36_2008, SRC.PMK_250_2008],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk162-2012',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Era PTKP Rp 24,3 Juta untuk Tahun Pajak 2013–2014 (PMK 162/2012)',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 162/PMK.011/2012',
  effectiveDate: '1 Januari 2013 – 31 Desember 2014',
  readMinutes: 3,
  summary:
    'PMK 162/PMK.011/2012 menaikkan PTKP pertama kali sejak UU 36/2008 diberlakukan, dari Rp 15,84 juta menjadi Rp 24,3 juta per tahun (Rp 2,025 juta per bulan).',
  sections: [
    {
      heading: 'Penyesuaian PTKP Rp 2,025 juta per bulan',
      paragraphs: [
        'Setelah berlaku statis sejak 2009, batas PTKP Wajib Pajak Orang Pribadi dinaikkan sebesar 53,4% melalui PMK 162/PMK.011/2012 mulai 1 Januari 2013 menjadi Rp 24.300.000 per tahun untuk TK/0.',
        'Tambahan untuk Wajib Pajak kawin dan tiap tanggungan (maksimal 3 orang) ditetapkan Rp 2.025.000 per tahun sehingga status K/3 memperoleh PTKP Rp 32.400.000.',
      ],
    },
    {
      heading: 'Ketentuan penghitungan dan tarif progresif',
      paragraphs: [
        'Pengurang Biaya Jabatan sebesar 5% (maksimal Rp 6.000.000/tahun sesuai PMK 250/2008) serta empat lapisan tarif Pasal 17 UU 36/2008 (5%/15%/25%/30%) tetap diterapkan bersama tarif lebih tinggi 20% bagi pegawai tanpa NPWP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 36/2008 (2009–2012)',
    newHeader: 'PMK 162/2012 (2013–2014)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 15.840.000 / tahun',
        aturanBaru: 'Rp 24.300.000 / tahun',
      },
      {
        aspek: 'Tambahan kawin & tanggungan',
        aturanLama: 'Rp 1.320.000 / status',
        aturanBaru: 'Rp 2.025.000 / status',
      },
      {
        aspek: 'PTKP maksimal (K/3)',
        aturanLama: 'Rp 21.120.000 / tahun',
        aturanBaru: 'Rp 32.400.000 / tahun',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan K/0 bergaji Rp 5 juta per bulan pada tahun 2014',
    scenario:
      'Simulasi PPh Pasal 21 karyawan ber-NPWP status K/0 (PTKP Rp 26.325.000) dengan gaji Rp 5.000.000/bulan pada Tahun Pajak 2014.',
    presetRegime: 'pph21_pmk162_2013',
    presetInput: {
      pph21: {
        gajiBulanan: 5000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 100000,
        ptkpStatus: 'K/0',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk162_2013Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk162_2012', 'uu36_2008');
  },
};
