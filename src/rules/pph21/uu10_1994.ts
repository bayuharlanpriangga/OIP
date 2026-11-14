import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu10_1994',
  taxType: 'pph21',
  name: 'UU Nomor 10 Tahun 1994 (TP 1995–2000)',
  shortName: '1995–2000 (PTKP 1,728 jt)',
  legalBasis: 'Pasal 7 & 17 UU 10/1994 jo. KMK 49/KMK.04/1994 (Biaya Jabatan)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Tarif progresif 3 lapis 10% (<= 25jt), 15% (25–50jt), dan 30% (> 50jt) dengan PTKP TK/0 Rp 1,728 juta (+Rp 864 rb/tanggungan) dan Biaya Jabatan KMK 49/1994 maks Rp 648 rb/thn.',
  sources: [SRC.UU_10_1994, SRC.KMK_49_1994, SRC.KMK_521_1998],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-uu10-1994',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Tarif 10%/15%/30% dan PTKP Rp 1,728 Juta pada UU Nomor 10 Tahun 1994',
  legalBasis: 'Pasal 7 & 17 UU Nomor 10 Tahun 1994 jo. KMK 49/KMK.04/1994',
  effectiveDate: '1 Januari 1995 – 31 Desember 2000',
  readMinutes: 4,
  summary:
    'Reformasi pajak kedua melalui UU 10/1994 menurunkan seluruh lapisan tarif PPh Pasal 21 menjadi 10%, 15%, dan 30% serta melebarkan batas lapisan pertama hingga Rp 25 juta dengan PTKP TK/0 Rp 1,728 juta.',
  sections: [
    {
      heading: 'Penurunan tarif dari 15%/25%/35% menjadi 10%/15%/30%',
      paragraphs: [
        'Dibandingkan era awal UU 7/1983, UU Nomor 10 Tahun 1994 memangkas tarif tiga lapis Pasal 17 sebesar lima poin persentase di setiap lapisan: 10% untuk PKP sampai Rp 25 juta, 15% untuk > Rp 25 juta s.d. Rp 50 juta, dan 30% untuk PKP di atas Rp 50 juta.',
        'Batas lapisan pertama juga dinaikkan dari Rp 10 juta menjadi Rp 25 juta agar pekerja kelas menengah pada dekade 1990-an tidak cepat masuk ke braket menengah.',
      ],
    },
    {
      heading: 'PTKP Rp 1,728 juta dan penyesuaian Biaya Jabatan',
      paragraphs: [
        'PTKP TK/0 ditetapkan Rp 1.728.000/tahun (Rp 144.000/bulan) dengan tambahan Rp 864.000/tahun per status kawin atau tanggungan (maksimal 3 orang). Biaya Jabatan 5% mengikuti KMK 49/KMK.04/1994 sebesar maksimal Rp 54.000/bulan (Rp 648.000/tahun), sebelum dinaikkan lewat KMK 521/KMK.04/1998.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 7/1983 (1984–1994)',
    newHeader: 'UU 10/1994 (1995–2000)',
    rows: [
      {
        aspek: 'Tarif 3 lapisan Pasal 17',
        aturanLama: '15% / 25% / 35%',
        aturanBaru: '10% / 15% / 30%',
      },
      {
        aspek: 'Batas lapisan pertama',
        aturanLama: 'PKP s.d. Rp 10.000.000',
        aturanBaru: 'PKP s.d. Rp 25.000.000',
      },
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 960.000 / tahun',
        aturanBaru: 'Rp 1.728.000 / tahun',
      },
      {
        aspek: 'Biaya Jabatan KMK 49/1994',
        aturanLama: 'Maks Rp 360.000 / tahun',
        aturanBaru: 'Maks Rp 648.000 / tahun',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai tetap K/2 gaji Rp 1,5 juta per bulan pada tahun 1997',
    scenario:
      'Menghitung PPh Pasal 21 pegawai berstatus K/2 pada tahun 1997 memakai PTKP Rp 4,32 juta, Biaya Jabatan Rp 648 ribu, dan tarif 10%/15%/30%.',
    presetRegime: 'pph21_uu10_1994',
    presetInput: {
      pph21: {
        gajiBulanan: 1500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'K/2',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Uu10_1994Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu10_1994', 'uu10_1994');
  },
};
