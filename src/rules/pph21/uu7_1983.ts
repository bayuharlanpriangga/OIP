import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu7_1983',
  taxType: 'pph21',
  name: 'UU Nomor 7 Tahun 1983 & UU 7/1991 (TP 1984–1994)',
  shortName: '1984–1994 (PTKP 960 rb)',
  legalBasis: 'Pasal 7 & 17 UU 7/1983 jo. KMK 980/KMK.04/1983 (Biaya Jabatan)',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Era awal reformasi UU PPh: tarif 3 lapis 15% (<= 10jt), 25% (10–50jt), 35% (> 50jt), PTKP TK/0 Rp 960 ribu (+Rp 480 rb/tanggungan), dan Biaya Jabatan maks Rp 360 ribu/thn.',
  sources: [SRC.UU_7_1983, SRC.UU_7_1991, SRC.KMK_980_1983, SRC.KMK_49_1994],
};

const article: TaxArticle = {
  id: 'pph21-uu7-1983',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Lahirnya UU PPh 1983: PTKP Rp 960 Ribu, Biaya Jabatan Rp 360 Ribu & Tarif 15%/25%/35%',
  legalBasis: 'Pasal 7 & 17 UU Nomor 7 Tahun 1983 stdd UU Nomor 7 Tahun 1991',
  effectiveDate: '1 Januari 1984 – 31 Desember 1994',
  readMinutes: 4,
  summary:
    'Reformasi perpajakan nasional pertama sejak 1 Januari 1984 mengganti Ordonansi Pajak Pendapatan 1944 (PPd 1944) dengan sistem self-assessment UU 7/1983, memperkenalkan PTKP dan 3 lapisan tarif progresif 15%, 25%, dan 35%.',
  sections: [
    {
      heading: 'Transisi dari PPd 1944 ke sistem pemotongan Pasal 21 modern',
      paragraphs: [
        'Sebelum 1984, pajak atas gaji karyawan diatur berdasarkan Ordonansi Pajak Pendapatan 1944 dengan banyak lapisan tarif kecil yang rumit. UU Nomor 7 Tahun 1983 menyederhanakannya menjadi hanya tiga lapisan progresif untuk Orang Pribadi maupun Badan: 15% untuk PKP sampai Rp 10 juta, 25% untuk > Rp 10 juta s.d. Rp 50 juta, dan 35% di atas Rp 50 juta.',
      ],
    },
    {
      heading: 'PTKP perdana Rp 960 ribu dan Biaya Jabatan KMK 980/1983',
      paragraphs: [
        'Pasal 7 UU 7/1983 menetapkan PTKP Rp 960.000 setahun bagi Wajib Pajak sendiri (TK/0), ditambah Rp 480.000 untuk Wajib Pajak kawin serta masing-masing paling banyak 3 orang tanggungan (K/3 = Rp 2.880.000). Biaya Jabatan dibatasi 5% maksimal Rp 30.000/bulan atau Rp 360.000/tahun (kemudian diperbarui menjelang akhir periode oleh KMK 49/1994).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 7/1983 (1984–1994)',
    newHeader: 'UU HPP & PP 58/2023 (2024–Kini)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 960.000 / tahun',
        aturanBaru: 'Rp 54.000.000 / tahun',
      },
      {
        aspek: 'Biaya Jabatan 5%',
        aturanLama: 'Maks Rp 360.000 / tahun',
        aturanBaru: 'Maks Rp 6.000.000 / tahun',
      },
      {
        aspek: 'Tarif lapisan terendah',
        aturanLama: '15% (PKP s.d. Rp 10 juta)',
        aturanBaru: '5% (PKP s.d. Rp 60 juta)',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai tetap TK/0 bergaji Rp 500 ribu per bulan pada tahun 1988',
    scenario:
      'Simulasi PPh Pasal 21 pegawai lajang berpenghasilan Rp 500.000/bulan pada era awal reformasi UU 7/1983.',
    presetRegime: 'pph21_uu7_1983',
    presetInput: {
      pph21: {
        gajiBulanan: 500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
};

export const pph21Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu7_1983', 'uu7_1983');
  },
};
