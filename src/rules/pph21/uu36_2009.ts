import { TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';
import { calculateAnnualizedPph21 } from './shared';

const regime: TaxRegime = {
  id: 'pph21_uu36_2009',
  taxType: 'pph21',
  name: 'UU 36/2008 & PMK 250/2008 (TP 2009–2012)',
  shortName: '2009–2012 (PTKP 15,84 jt)',
  legalBasis: 'Pasal 7 & 17 UU 36/2008 jo. PMK Nomor 250/PMK.03/2008',
  effectivePeriod: '1 Januari 2009 – 31 Desember 2012',
  isCurrent: false,
  summary:
    'PTKP perdana UU 36/2008 sebesar Rp 15,84 juta (TK/0, +Rp 1,32 jt per status/tanggungan), Biaya Jabatan naik ke Rp 6 juta/thn, serta mulai berlakunya sanksi +20% non-NPWP.',
  sources: [SRC.UU_36_2008, SRC.PMK_250_2008],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-uu36-2009',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Reformasi UU 36/2008: Sanksi +20% Non-NPWP, PTKP Rp 15,84 Juta & Biaya Jabatan Rp 6 Juta',
  legalBasis: 'Pasal 7, 17 & 21 ayat (5a) UU 36/2008 jo. PMK 250/PMK.03/2008',
  effectiveDate: '1 Januari 2009 – 31 Desember 2012',
  readMinutes: 5,
  summary:
    'UU 36/2008 mengubah drastis struktur PPh 21 mulai 2009: memangkas lapisan tertinggi dari 35% menjadi 30%, menaikkan Biaya Jabatan dari Rp 1,296 juta ke Rp 6 juta/tahun, dan memperkenalkan penalti tarif 20% bagi pegawai tanpa NPWP.',
  sections: [
    {
      heading: 'Penyederhanaan 4 lapisan tarif dan kenaikan Biaya Jabatan',
      paragraphs: [
        'Dibandingkan UU 17/2000 yang memiliki 5 lapisan (5%, 10%, 15%, 25%, 35%), UU Nomor 36 Tahun 2008 menyederhanakannya menjadi 4 lapis: 5% (s.d. Rp 50 juta), 15% (> Rp 50 juta–Rp 250 juta), 25% (> Rp 250 juta–Rp 500 juta), dan 30% (> Rp 500 juta).',
        'Selain itu, PMK 250/PMK.03/2008 menaikkan plafon Biaya Jabatan 5% secara signifikan dari Rp 108.000/bulan (Rp 1.296.000/tahun) menjadi Rp 500.000/bulan (Rp 6.000.000/tahun), angka yang masih bertahan hingga era PMK 168/2023.',
      ],
    },
    {
      heading: 'Lahirnya sanksi +20% tanpa NPWP dan PTKP awal Rp 15,84 juta',
      paragraphs: [
        'Pasal 21 ayat (5a) UU 36/2008 memperkenalkan tarif pemotongan 20% lebih tinggi bagi penerima penghasilan yang tidak memiliki NPWP. Pada periode 2009–2012, PTKP TK/0 ditetapkan Rp 15.840.000 dengan tambahan Rp 1.320.000 per status kawin maupun tanggungan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 17/2000 & PMK 137/2005 (2006–2008)',
    newHeader: 'UU 36/2008 & PMK 250/2008 (2009–2012)',
    rows: [
      {
        aspek: 'PTKP Wajib Pajak (TK/0)',
        aturanLama: 'Rp 13.200.000 / tahun',
        aturanBaru: 'Rp 15.840.000 / tahun',
      },
      {
        aspek: 'Batas Biaya Jabatan 5%',
        aturanLama: 'Maks Rp 1.296.000 / tahun',
        aturanBaru: 'Maks Rp 6.000.000 / tahun',
      },
      {
        aspek: 'Struktur lapisan tarif PPh OP',
        aturanLama: '5 lapis (5/10/15/25/35%)',
        aturanBaru: '4 lapis (5/15/25/30%)',
      },
      {
        aspek: 'Sanksi pegawai tanpa NPWP',
        aturanLama: 'Belum berlaku',
        aturanBaru: 'Tarif 20% lebih tinggi',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai ber-NPWP vs non-NPWP di tahun pajak 2010',
    scenario:
      'Pegawai TK/0 dengan gaji Rp 4.500.000/bulan di tahun 2010 telah melampaui PTKP Rp 15,84 juta dan dipotong tarif Pasal 17 UU 36/2008.',
    presetRegime: 'pph21_uu36_2009',
    presetInput: {
      pph21: {
        gajiBulanan: 4500000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 75000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph21Uu36_2009Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    return calculateAnnualizedPph21(input, regime, 'uu36_2008', 'uu36_2008');
  },
};
