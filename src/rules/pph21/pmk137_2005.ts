import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_pmk137_2005',
  taxType: 'pph21',
  name: 'UU 17/2000 & PMK 137/2005 (TP 2006–2008)',
  shortName: '2006–2008 (PTKP 13,2 jt)',
  legalBasis: 'UU 17/2000, PMK 137/PMK.03/2005 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2006 – 31 Desember 2008',
  isCurrent: false,
  summary:
    'Tarif progresif 5 lapis UU 17/2000 (5/10/15/25/35%), PTKP Rp 13,2 juta (TK/0, +Rp 1,2 jt/tanggungan), dan batas Biaya Jabatan Rp 1,296 juta/thn.',
  sources: [SRC.PMK_137_2005, SRC.UU_17_2000, SRC.KMK_521_1998],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk137-2005',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'PTKP Rp 13,2 Juta (PMK 137/2005) dan Tarif 5 Lapis Akhir Era UU 17/2000',
  legalBasis: 'UU Nomor 17 Tahun 2000, PMK 137/PMK.03/2005 & KMK 521/KMK.04/1998',
  effectiveDate: '1 Januari 2006 – 31 Desember 2008',
  readMinutes: 4,
  summary:
    'Periode 2006–2008 menggabungkan PTKP TK/0 Rp 13,2 juta (naik dari Rp 12 juta pada 2005) dengan struktur 5 lapisan progresif UU 17/2000 (5%, 10%, 15%, 25%, 35%) dan Biaya Jabatan maksimal Rp 1,296 juta/tahun.',
  sections: [
    {
      heading: 'Penyesuaian PTKP TK/0 menjadi Rp 1,1 juta per bulan',
      paragraphs: [
        'Hanya setahun setelah KMK 564/2004 menaikkan PTKP menjadi Rp 12 juta, pemerintah menerbitkan PMK 137/PMK.03/2005 yang mulai berlaku Tahun Pajak 2006 dengan batas PTKP Wajib Pajak sebesar Rp 13.200.000 per tahun.',
        'Tambahan status kawin dan tiap tanggungan (maksimal 3 orang) tetap dipatok Rp 1.200.000 per tahun, sehingga PTKP K/3 mencapai Rp 18.000.000 setahun.',
      ],
    },
    {
      heading: 'Tarif 5 lapis UU 17/2000 dan plafon Biaya Jabatan KMK 521/1998',
      paragraphs: [
        'Penghasilan Kena Pajak dikenai 5 lapisan progresif: 5% (s.d. Rp 25 juta), 10% (> Rp 25 juta–50 juta), 15% (> Rp 50 juta–100 juta), 25% (> Rp 100 juta–200 juta), dan 35% (> Rp 200 juta). Biaya Jabatan masih dibatasi Rp 108.000/bulan (Rp 1.296.000/tahun) hingga berakhirnya Tahun Pajak 2008.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 564/2004 (Tahun Pajak 2005)',
    newHeader: 'PMK 137/2005 (2006–2008)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 12.000.000 / tahun',
        aturanBaru: 'Rp 13.200.000 / tahun',
      },
      {
        aspek: 'Tambahan kawin & tanggungan',
        aturanLama: 'Rp 1.200.000 / status',
        aturanBaru: 'Rp 1.200.000 / status',
      },
      {
        aspek: 'Biaya Jabatan 5%',
        aturanLama: 'Maks Rp 1.296.000 / tahun',
        aturanBaru: 'Maks Rp 1.296.000 / tahun',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai tetap TK/0 gaji Rp 3,5 juta/bulan di tahun 2007',
    scenario:
      'Simulasi pemotongan PPh Pasal 21 pegawai lajang gaji Rp 3.500.000/bulan memakai PTKP Rp 13,2 juta dan tarif 5 lapis UU 17/2000.',
    presetRegime: 'pph21_pmk137_2005',
    presetInput: {
      pph21: {
        gajiBulanan: 3500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 50000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk137_2005Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'pmk137_2005', 'uu17_2000');
  },
};
