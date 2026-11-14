import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_80_2010, SRC.PP_58_2023, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph21_pp80_2010',
  taxType: 'pph21',
  name: 'PP 80/2010 (Honorarium Beban APBN/APBD)',
  shortName: '2011–Kini (PP 80/2010 APBN/APBD)',
  legalBasis: 'PP Nomor 80 Tahun 2010 & PMK 262/PMK.03/2010',
  effectivePeriod: '1 Januari 2011 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Honorarium ASN/TNI/Polri (APBN/APBD)',
  summary:
    'Aturan khusus PPh Pasal 21 yang bersifat Final atas honorarium atau imbalan lain yang menjadi beban APBN/APBD bagi Pejabat Negara, PNS, TNI, Polri, dan Pensiunannya: 0% (Gol I–II), 5% (Gol III), dan 15% (Gol IV & Pejabat Negara).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pp80-2010',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Pemotongan Final Honorarium APBN/APBD bagi ASN, TNI, Polri, & Pejabat Negara (PP 80/2010)',
  legalBasis: 'PP Nomor 80 Tahun 2010 Pasal 2 & Pasal 4',
  effectiveDate: '1 Januari 2011',
  readMinutes: 4,
  summary:
    'Membedakan pemotongan penghasilan tetap bulanan (gaji/tunjangan APBN memakai tarif umum/TER) dengan honorarium tidak teratur yang dipotong final 0%, 5%, atau 15% menurut golongan kepangkatan.',
  sections: [
    {
      heading: 'Tarif Final berdasarkan golongan kepangkatan',
      paragraphs: [
        'Berdasarkan Pasal 4 PP Nomor 80 Tahun 2010, penghasilan selain penghasilan tetap dan teratur (seperti honorarium narasumber, panitia kegiatan, penguji, atau tim pelaksana) yang dananya bersumber dari APBN atau APBD dipotong PPh Pasal 21 bersifat Final tanpa memperhitungkan PTKP maupun sanksi non-NPWP.',
        'Tarifnya berjenjang menjadi tiga lapis: 0% bagi PNS Golongan I dan II, TNI/Polri pangkat Tamtama dan Bintara, serta pensiunannya; 5% bagi PNS Golongan III, TNI/Polri pangkat Perwira Pertama, serta pensiunannya; dan 15% bagi Pejabat Negara, PNS Golongan IV, TNI/Polri pangkat Perwira Menengah dan Perwira Tinggi, serta pensiunannya.',
      ],
    },
    {
      heading: 'Keterkaitan dengan berlakunya TER PP 58/2023',
      paragraphs: [
        'Sejak berlakunya PP 58/2023 per 1 Januari 2024, penghitungan pajak atas penghasilan tetap dan teratur bulanan (gaji pokok, tunjangan keluarga, tunjangan jabatan, tukin) bagi PNS/TNI/Polri beralih menggunakan tabel TER (Jan–Nov) dan Pasal 17 di Desember.',
        'Namun ketentuan PPh Pasal 21 Final 0%, 5%, dan 15% dalam PP Nomor 80 Tahun 2010 atas honorarium APBN/APBD tetap dipertahankan berlaku sebagai rezim lex specialis sehingga bendahara pemerintah langsung memotong final saat pencairan honorarium.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Gaji & Tunjangan Tetap ASN (APBN/APBD)',
    newHeader: 'Honorarium Tidak Tetap APBN/APBD (PP 80/2010)',
    rows: [
      {
        aspek: 'Golongan I–II / Tamtama–Bintara',
        aturanLama: 'Mengikuti tabel TER & PTKP Pasal 17 (tidak final)',
        aturanBaru: '0% Final langsung dari jumlah bruto honorarium',
      },
      {
        aspek: 'Golongan III / Perwira Pertama',
        aturanLama: 'Mengikuti tabel TER & PTKP Pasal 17 (tidak final)',
        aturanBaru: '5% Final langsung dari jumlah bruto honorarium',
      },
      {
        aspek: 'Golongan IV / Pamen–Pati / Pejabat Negara',
        aturanLama: 'Mengikuti tabel TER & PTKP Pasal 17 (tidak final)',
        aturanBaru: '15% Final langsung dari jumlah bruto honorarium',
      },
    ],
  },
  caseExample: {
    title: 'Honorarium tim APBN Rp 6 juta untuk PNS Golongan III vs Golongan IV',
    scenario:
      'Seorang PNS Golongan III menerima honorarium kegiatan sebesar Rp 6.000.000 yang dibebankan pada DIPA APBN (dipotong PPh 21 Final 5% sebesar Rp 300.000).',
    presetRegime: 'pph21_pp80_2010',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        honorariumApbn: 6000000,
        golonganAsn: 'gol_3',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pp80_2010Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const honor = Math.max(0, input.honorariumApbn ?? 0);
    const gol = input.golonganAsn ?? 'gol_3';

    const meta =
      gol === 'gol_1_2'
        ? { rate: 0, label: 'PNS Golongan I & II / TNI-Polri Tamtama–Bintara / Pensiunannya' }
        : gol === 'gol_3'
          ? { rate: 5, label: 'PNS Golongan III / TNI-Polri Perwira Pertama / Pensiunannya' }
          : { rate: 15, label: 'Pejabat Negara / PNS Golongan IV / TNI-Polri Pamen–Pati / Pensiunannya' };

    const tax = Math.round((honor * meta.rate) / 100);
    const netReceived = Math.max(0, honor - tax);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto honorarium beban APBN/APBD', value: honor },
      {
        label: `Tarif PPh 21 Final PP 80/2010 (${meta.label})`,
        value: meta.rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 21 Final dipotong bendahara',
        formula: `${formatRupiah(honor)} x ${formatPersen(meta.rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Honorarium bersih diterima', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh 21 Final APBN/APBD Dipotong',
      primaryTaxAmount: tax,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Honorarium Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Pemotongan berdasarkan PP 80/2010 bersifat Final atas imbalan selain penghasilan tetap bulanan sehingga tidak digabungkan lagi dalam penghitungan PTKP SPT Tahunan.',
        'Apabila penerima adalah tenaga honorer non-ASN/eksternal yang bukan PNS/TNI/Polri/Pejabat Negara, maka berlaku ketentuan umum PMK 168/2023 (bukan PP 80/2010).',
      ],
    };
  },
};
