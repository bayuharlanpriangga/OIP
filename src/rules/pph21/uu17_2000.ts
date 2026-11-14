import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu17_2000',
  taxType: 'pph21',
  name: 'UU Nomor 17 Tahun 2000 (TP 2001–2004)',
  shortName: '2001–2004 (PTKP 2,88 jt)',
  legalBasis: 'Pasal 7 & 17 UU Nomor 17 Tahun 2000 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2004',
  isCurrent: false,
  summary:
    'Tarif progresif 5 lapis UU 17/2000 (5% <= 25jt, 10% s.d. 50jt, 15% s.d. 100jt, 25% s.d. 200jt, 35% > 200jt), PTKP TK/0 Rp 2,88 juta (+Rp 1,44 jt/tanggungan), Biaya Jabatan maks Rp 1,296 juta/thn.',
  sources: [SRC.UU_17_2000, SRC.KMK_521_1998],
};

const article: TaxArticle = {
  id: 'pph21-uu17-2000',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Tarif Progresif 5 Lapis (5%–35%) dan PTKP Rp 2,88 Juta Era Awal UU 17/2000',
  legalBasis: 'Pasal 7 & 17 UU Nomor 17 Tahun 2000 jo. KMK 521/KMK.04/1998',
  effectiveDate: '1 Januari 2001 – 31 Desember 2004',
  readMinutes: 4,
  summary:
    'UU 17/2000 memperhalus gradasi tarif Pasal 17 dari 3 lapis menjadi 5 lapis (dimulai dari 5% untuk PKP <= Rp 25 juta hingga 35% di atas Rp 200 juta), sambil mematok PTKP TK/0 Rp 2,88 juta dan Biaya Jabatan Rp 1,296 juta.',
  sections: [
    {
      heading: 'Dari 3 lapis menjadi 5 lapis tarif progresif',
      paragraphs: [
        'Pada rezim sebelumnya (UU 10/1994), lapisan terbawah langsung dikenai 10% dan tarif puncak 30% sudah menyentuh PKP di atas Rp 50 juta. Mulai 1 Januari 2001, UU 17/2000 menurunkan tarif awal menjadi 5% (PKP s.d. Rp 25 juta), lalu 10% (Rp 25–50 juta), 15% (Rp 50–100 juta), 25% (Rp 100–200 juta), dan 35% (> Rp 200 juta).',
        'Struktur lima lapis inilah yang menjadi cikal bakal pembagian progresif modern dan terus dipakai hingga Tahun Pajak 2008.',
      ],
    },
    {
      heading: 'PTKP Rp 2,88 juta dan Biaya Jabatan KMK 521/1998',
      paragraphs: [
        'Pasal 7 UU 17/2000 menetapkan PTKP Rp 2.880.000/tahun untuk diri Wajib Pajak dengan tambahan Rp 1.440.000/tahun untuk status kawin serta masing-masing tanggungan (maksimal 3 orang). Biaya Jabatan mengacu KMK 521/KMK.04/1998 sebesar 5% maksimal Rp 108.000/bulan (Rp 1.296.000/tahun).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 10/1994 (1995–2000)',
    newHeader: 'UU 17/2000 Awal (2001–2004)',
    rows: [
      {
        aspek: 'Tarif lapisan terbawah',
        aturanLama: '10% (PKP s.d. Rp 25 juta)',
        aturanBaru: '5% (PKP s.d. Rp 25 juta)',
      },
      {
        aspek: 'Tarif lapisan tertinggi',
        aturanLama: '30% (PKP > Rp 50 juta)',
        aturanBaru: '35% (PKP > Rp 200 juta)',
      },
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 1.728.000 / tahun',
        aturanBaru: 'Rp 2.880.000 / tahun',
      },
      {
        aspek: 'Plafon Biaya Jabatan 5%',
        aturanLama: 'Maks Rp 648.000 / tahun',
        aturanBaru: 'Maks Rp 1.296.000 / tahun',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan TK/0 bergaji Rp 2,5 juta per bulan pada tahun 2002',
    scenario:
      'Simulasi PPh Pasal 21 karyawan tetap gaji Rp 2.500.000/bulan pada era UU 17/2000 dengan PTKP Rp 2,88 juta dan tarif 5%–35%.',
    presetRegime: 'pph21_uu17_2000',
    presetInput: {
      pph21: {
        gajiBulanan: 2500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 25000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
};

export const pph21Uu17_2000Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu17_2000', 'uu17_2000');
  },
};
