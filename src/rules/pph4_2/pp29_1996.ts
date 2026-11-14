import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph4_2_pp29_1996',
  taxType: 'pph4_2',
  name: 'PP 29/1996 (Sewa), PP 73/1996 (Konstruksi) & PP 48/1994',
  shortName: '1995–2000 (PP 29/1996 & PP 48/1994)',
  legalBasis: 'PP 29/1996 (Sewa Tanah/Bangunan), PP 73/1996 (Konstruksi), & PP 48/1994 jo. PP 27/1996 (PHTB)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Aturan awal PPh Final Pasal 4(2): sewa tanah/bangunan dibedakan 6% (WP Badan) dan 10% (WP OP) sesuai PP 29/1996, PHTB 5% (PP 48/1994), serta konstruksi 2%/4% (PP 73/1996 mulai 1997).',
  sources: [SRC.PP_29_1996, SRC.PP_73_1996, SRC.PP_48_1994, SRC.PP_27_1996],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph4-2-pp29-1996-pp140-2000',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Evolusi Awal PPh Final Pasal 4(2): Sewa 6%/10% (PP 29/1996) hingga PP 140/2000',
  legalBasis: 'PP 48/1994, PP 29/1996, PP 73/1996, PP 140/2000 & PP 5/2002',
  effectiveDate: '1 Januari 1995 – 31 Desember 2007',
  readMinutes: 4,
  summary:
    'Jejak regulasi PPh Final properti dan konstruksi sebelum era PP 51/2008: mulai dari tarif sewa 6% khusus WP Badan di PP 29/1996 hingga pembatasan final konstruksi Rp 1 miliar di PP 140/2000.',
  sections: [
    {
      heading: 'Tarif ganda sewa tanah/bangunan di PP 29/1996 sebelum diseragamkan PP 5/2002',
      paragraphs: [
        'Ketika PP Nomor 29 Tahun 1996 mulai berlaku untuk persewaan tanah dan/atau bangunan, tarif PPh Final dibedakan berdasarkan subjek pemilik aset: 10% apabila yang menyewakan adalah Wajib Pajak Orang Pribadi, dan hanya 6% apabila yang menyewakan adalah Wajib Pajak Badan dalam negeri atau BUT.',
        'Perbedaan tarif tersebut kemudian dihapus oleh PP Nomor 5 Tahun 2002 (berlaku 1 Mei 2002) yang menyeragamkan tarif PPh Final persewaan tanah/bangunan menjadi 10% bagi seluruh subjek pajak, baik Orang Pribadi maupun Badan.',
      ],
    },
    {
      heading: 'Jasa konstruksi: PP 73/1996, PP 140/2000, hingga PP 51/2008',
      paragraphs: [
        'Melalui PP Nomor 73 Tahun 1996 (efektif 1 Januari 1997), seluruh jasa pelaksanaan konstruksi dikenai PPh Final 2% dan jasa perencanaan/pengawasan 4%. Kemudian PP Nomor 140 Tahun 2000 (efektif 1 Januari 2001) membatasi PPh Final 2%/4% hanya bagi pengusaha kecil dengan nilai pengadaan hingga Rp 1 miliar, sebelum seluruh kualifikasi dikembalikan ke skema PPh Final di PP 51/2008 dan diturunkan tarifnya lewat PP 9/2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 29/1996 & PP 73/1996 (1995–2000)',
    newHeader: 'PP 140/2000 & PP 5/2002 (2001–2007)',
    rows: [
      {
        aspek: 'Sewa tanah/bangunan (WP Badan)',
        aturanLama: '6% final (PP 29/1996)',
        aturanBaru: 'Naik ke 10% final (PP 5/2002)',
      },
      {
        aspek: 'Sewa tanah/bangunan (WP OP)',
        aturanLama: '10% final (PP 29/1996)',
        aturanBaru: 'Tetap 10% final (PP 5/2002)',
      },
      {
        aspek: 'Jasa konstruksi (pelaksana / konsultan)',
        aturanLama: '2% / 4% final menyeluruh (PP 73/1996)',
        aturanBaru: '2% / 4% final khusus usaha kecil <= Rp 1 M (PP 140/2000)',
      },
      {
        aspek: 'Pengalihan tanah & bangunan (PHTB)',
        aturanLama: '5% (PP 48/1994 jo. PP 27/1996)',
        aturanBaru: 'Tetap 5% (PP 79/1999)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi sewa gedung milik PT senilai Rp 200 juta di era PP 29/1996',
    scenario:
      'Penyewa menyewa kantor dari pemilik berstatus WP Badan (PT) senilai Rp 200.000.000 dengan tarif 6% menurut PP 29/1996.',
    presetRegime: 'pph4_2_pp29_1996',
    presetInput: {
      pph4_2: {
        nilaiBruto: 200000000,
        objectType: 'sewa_tanah_bangunan',
        sewaSubjectType: 'badan_usaha',
      },
    },
  },
};

function getPp29Meta(
  objectType: Pph4_2ObjectType,
  sewaSubjectType: 'orang_pribadi' | 'badan_usaha'
): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return sewaSubjectType === 'badan_usaha'
        ? { rate: 6, label: 'Persewaan tanah/bangunan milik WP Badan/BUT — PP 29/1996 (6%)' }
        : { rate: 10, label: 'Persewaan tanah/bangunan milik WP Orang Pribadi — PP 29/1996 (10%)' };
    case 'konstruksi_kecil':
    case 'konstruksi_menengah_besar':
    case 'konstruksi_tanpa_sbu':
      return { rate: 2, label: 'Jasa pelaksanaan konstruksi — PP 73/1996 (2% final, mulai 1997)' };
    case 'konsultansi_konstruksi_sbu':
    case 'konsultansi_konstruksi_tanpa_sbu':
      return {
        rate: 4,
        label: 'Jasa perencanaan & pengawasan konstruksi — PP 73/1996 (4% final, mulai 1997)',
      };
    case 'pengalihan_tanah_bangunan':
      return { rate: 5, label: 'Pengalihan hak tanah/bangunan — PP 48/1994 jo. PP 27/1996 (5%)' };
  }
}

export const pph4_2Pp29_1996Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const sewaSubject = input.sewaSubjectType ?? 'orang_pribadi';
    const meta = getPp29Meta(input.objectType, sewaSubject);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2) era 1995–2000', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) terutang',
        formula: `${formatRupiah(nilaiBruto)} x ${formatPersen(meta.rate)}`,
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Pasal 4(2) Terutang',
      primaryTaxAmount: pphFinal,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilaiBruto - pphFinal),
      steps,
      notes: [
        'PP 29/1996 membedakan tarif PPh Final sewa tanah/bangunan menjadi 6% untuk pemilik WP Badan/BUT dan 10% untuk WP Orang Pribadi sebelum diseragamkan menjadi 10% oleh PP 5/2002.',
        'Atas pengalihan hak tanah/bangunan (PP 48/1994, berlaku 1 Jan 1995) dikenai 5%, dan sejak 1 Januari 1997 PP 73/1996 memberlakukan PPh Final 2% (pelaksana) dan 4% (perencana/pengawas konstruksi).',
      ],
    };
  },
};
