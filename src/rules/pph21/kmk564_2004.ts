import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_kmk564_2004',
  taxType: 'pph21',
  name: 'UU 17/2000 & KMK 564/2004 (TP 2005)',
  shortName: '2005 (PTKP 12 jt)',
  legalBasis: 'UU 17/2000, KMK 564/KMK.03/2004 & KMK 521/KMK.04/1998',
  effectivePeriod: '1 Januari 2005 – 31 Desember 2005',
  isCurrent: false,
  summary:
    'Penyesuaian PTKP Tahun Pajak 2005 dari Rp 2,88 juta menjadi Rp 12 juta (TK/0, +Rp 1,2 jt/tanggungan), tetap memakai tarif 5 lapis UU 17/2000 (5/10/15/25/35%).',
  sources: [SRC.KMK_564_2004, SRC.UU_17_2000, SRC.KMK_521_1998],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-kmk564-2004',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Lonjakan PTKP 2005 dari Rp 2,88 Juta Menjadi Rp 12 Juta (KMK 564/2004)',
  legalBasis: 'UU Nomor 17 Tahun 2000, KMK 564/KMK.03/2004 & KMK 521/KMK.04/1998',
  effectiveDate: '1 Januari 2005 – 31 Desember 2005',
  readMinutes: 3,
  summary:
    'KMK 564/KMK.03/2004 mencatat lonjakan PTKP terbesar secara persentase sepanjang sejarah PPh 21 modern: batas bebas pajak TK/0 naik lebih dari empat kali lipat dari Rp 2,88 juta menjadi Rp 12 juta per tahun.',
  sections: [
    {
      heading: 'Mengakhiri PTKP Rp 240 ribu per bulan yang tertinggal inflasi',
      paragraphs: [
        'Selama 2001–2004, PTKP TK/0 hanya Rp 2.880.000/tahun (Rp 240.000/bulan), jauh di bawah upah minimum provinsi setelah krisis moneter 1998. Melalui KMK 564/KMK.03/2004, pemerintah menaikkan PTKP TK/0 mulai 1 Januari 2005 menjadi Rp 12.000.000 per tahun (Rp 1.000.000/bulan).',
        'Sementara itu, tambahan PTKP untuk status kawin dan tiap tanggungan disesuaikan dari Rp 1.440.000 menjadi Rp 1.200.000/tahun; meski nominal tambahan per tanggungan turun, total PTKP K/3 tetap melonjak dari Rp 8,64 juta menjadi Rp 16,8 juta setahun.',
      ],
    },
    {
      heading: 'Struktur tarif dan pengurang lain pada Tahun Pajak 2005',
      paragraphs: [
        'Struktur tarif progresif 5 lapis UU 17/2000 (5% s.d. Rp 25 juta hingga 35% di atas Rp 200 juta) dan batas Biaya Jabatan KMK 521/1998 (5% maks Rp 1,296 juta/tahun) tetap dipertahankan selama Tahun Pajak 2005.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 17/2000 Awal (2001–2004)',
    newHeader: 'KMK 564/2004 (Tahun Pajak 2005)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 2.880.000 / tahun',
        aturanBaru: 'Rp 12.000.000 / tahun',
      },
      {
        aspek: 'PTKP Kawin 3 Tanggungan (K/3)',
        aturanLama: 'Rp 8.640.000 / tahun',
        aturanBaru: 'Rp 16.800.000 / tahun',
      },
      {
        aspek: 'Lapisan tarif PPh 21',
        aturanLama: '5/10/15/25/35% (UU 17/2000)',
        aturanBaru: '5/10/15/25/35% (UU 17/2000)',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai K/1 gaji Rp 3 juta per bulan pada Tahun Pajak 2005',
    scenario:
      'Menghitung penghematan PPh 21 pegawai status K/1 bergaji Rp 3.000.000/bulan setelah PTKP naik menjadi Rp 14,4 juta di Tahun Pajak 2005.',
    presetRegime: 'pph21_kmk564_2004',
    presetInput: {
      pph21: {
        gajiBulanan: 3000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 50000,
        ptkpStatus: 'K/1',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Kmk564_2004Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'kmk564_2004', 'uu17_2000');
  },
};
