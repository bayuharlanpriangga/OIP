import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph4_2_pp51_2008',
  taxType: 'pph4_2',
  name: 'PP 51/2008, PP 5/2002 & PP 71/2008',
  shortName: '2008–Sep 2016 (PP 71/2008 5%)',
  legalBasis: 'PP 51/2008 jo. PP 40/2009 (Konstruksi), PP 5/2002 (Sewa), & PP 71/2008 (PHTB)',
  effectivePeriod: '1 Januari 2008 – 6 September 2016',
  isCurrent: false,
  summary:
    'Skema PPh Final Pasal 4(2) sebelum PP 34/2016: pengalihan hak tanah/bangunan 5% (PP 71/2008), konstruksi 2%/3%/4%/6% (PP 51/2008), dan sewa tanah/bangunan 10% (PP 5/2002).',
  sources: [SRC.PP_51_2008, SRC.PP_40_2009, SRC.PP_71_2008, SRC.PP_5_2002],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp51-2008',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PP 51/2008 & PP 71/2008: Finalisasi Penuh Jasa Konstruksi dan PHTB 5% (2008–2016)',
  legalBasis: 'PP Nomor 51 Tahun 2008 jo. PP 40/2009, PP 5/2002, & PP 71/2008',
  effectiveDate: '1 Januari 2008',
  readMinutes: 4,
  summary:
    'Tonggak pengenaan PPh Final atas seluruh kualifikasi jasa konstruksi berdasarkan kepemilikan SBU (2%–6%), beriringan dengan tarif PHTB umum 5% dan sewa 10%.',
  sections: [
    {
      heading: 'Berlakunya tarif berjenjang konstruksi berdasarkan SBU (LPJK)',
      paragraphs: [
        'Berbeda dari PP 140/2000 yang hanya mengenakan PPh Final bagi usaha kecil berbatas kontrak Rp 1 miliar, PP Nomor 51 Tahun 2008 (berlaku surut sejak 1 Januari 2008 dan disesuaikan oleh PP 40/2009) mengembalikan seluruh penghasilan usaha jasa konstruksi ke skema PPh Final.',
        'Struktur tarifnya dikaitkan langsung dengan Sertifikat Badan Usaha (SBU): pelaksana kualifikasi kecil 2%, pelaksana menengah/besar 3%, pelaksana tanpa SBU 4%, konsultansi ber-SBU 4%, dan konsultansi tanpa SBU 6%.',
      ],
    },
    {
      heading: 'Tarif 5% PHTB era PP 71/2008',
      paragraphs: [
        'Di sektor properti, PP Nomor 71 Tahun 2008 (efektif 1 Januari 2009) mempertegas sifat final tarif 5% atas pengalihan hak tanah dan/atau bangunan bagi seluruh Wajib Pajak Orang Pribadi maupun Badan sebelum akhirnya dipangkas menjadi 2,5% pada September 2016.',
      ],
    },
  ],
  caseExample: {
    title: 'Kontrak konstruksi SBU menengah Rp 800 juta di era PP 51/2008',
    scenario:
      'Kontraktor kualifikasi menengah mengerjakan proyek senilai Rp 800.000.000 (non-PPN) pada tahun 2013 dan dipotong PPh Final Pasal 4(2) sebesar 3% atau Rp 24.000.000.',
    presetRegime: 'pph4_2_pp51_2008',
    presetInput: {
      pph4_2: {
        nilaiBruto: 800000000,
        objectType: 'konstruksi_menengah_besar',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getOldPph4_2Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return { rate: 10, label: 'Persewaan tanah/bangunan — PP 5/2002 (10%)' };
    case 'konstruksi_kecil':
      return { rate: 2, label: 'Pekerjaan konstruksi SBU Kecil — PP 51/2008 (2%)' };
    case 'konstruksi_menengah_besar':
      return { rate: 3, label: 'Pekerjaan konstruksi SBU Menengah/Besar — PP 51/2008 (3%)' };
    case 'konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Pekerjaan konstruksi tanpa SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 4, label: 'Jasa konsultansi konstruksi ber-SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_tanpa_sbu':
      return { rate: 6, label: 'Jasa konsultansi konstruksi tanpa SBU — PP 51/2008 (6%)' };
    case 'pengalihan_tanah_bangunan':
      return { rate: 5, label: 'Pengalihan hak tanah/bangunan — PP 71/2008 (5%)' };
  }
}

export const pph4_2Pp51_2008Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getOldPph4_2Meta(input.objectType);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2) era lama', formula: meta.label, value: meta.rate, format: 'percent' },
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
        'Pada periode sebelum 7 September 2016, pengalihan hak atas tanah/bangunan umum masih dikenai tarif 5% berdasarkan PP 71/2008 sebelum diturunkan menjadi 2,5% oleh PP 34/2016.',
      ],
    };
  },
};
