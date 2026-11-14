import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'meterai_pp24_2000',
  taxType: 'bea_meterai',
  name: 'UU 13/1985 & PP Nomor 24 Tahun 2000',
  shortName: '2000–2020 (Rp 3rb / Rp 6rb)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 24 Tahun 2000',
  effectivePeriod: '1 Mei 2000 – 31 Desember 2020',
  isCurrent: false,
  summary:
    'Skema historis Bea Meterai bertingkat: bebas s.d. Rp 250 ribu, tarif Rp 3.000 untuk > Rp 250 ribu s.d. Rp 1 juta, dan tarif Rp 6.000 untuk nominal di atas Rp 1 juta.',
  sources: [SRC.PP_24_2000, SRC.UU_13_1985],
};

const article: TaxArticle = {
  id: 'bea-meterai-pp24-2000',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Era Meterai Rp 3.000 dan Rp 6.000 Selama Dua Dekade (PP 24/2000)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 24 Tahun 2000',
  effectiveDate: '1 Mei 2000 – 31 Desember 2020',
  readMinutes: 3,
  summary:
    'PP 24/2000 menaikkan tarif Bea Meterai menjadi dua tingkat yang dikenal luas masyarakat selama 20 tahun: Rp 3.000 (nominal > Rp 250 ribu s.d. Rp 1 juta) dan Rp 6.000 (nominal di atas Rp 1 juta).',
  sections: [
    {
      heading: 'Kenaikan tiga kali lipat dari PP 7/1995 setelah krisis moneter',
      paragraphs: [
        'Menyusul perubahan nilai tukar dan inflasi pasca-1998, pemerintah menaikkan tarif Bea Meterai melalui PP Nomor 24 Tahun 2000 yang berlaku mulai 1 Mei 2000. Tarif lapisan pertama naik dari Rp 1.000 menjadi Rp 3.000, sementara lapisan atas naik dari Rp 2.000 menjadi Rp 6.000.',
        'Namun batas bebas nominal uang dipertahankan sama dengan PP 7/1995 (tidak melebihi Rp 250.000), sehingga kuitansi atau cek bernilai lebih dari Rp 1 juta tetap wajib bermeterai Rp 6.000 hingga akhir 2020.',
      ],
    },
    {
      heading: 'Dokumen perjanjian perdata dan efek tanpa e-Meterai khusus',
      paragraphs: [
        'Surat perjanjian dan akta perdata tanpa nominal uang dikenai tarif Rp 6.000. Karena disusun berdasarkan UU 13/1985, ketentuan teknis era ini hanya mengenal meterai tempel, kertas bermeterai, mesin teraan, dan sistem komputerisasi tanpa infrastruktur e-Meterai terintegrasi seperti UU 10/2020.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 7/1995 (1995–Apr 2000)',
    newHeader: 'PP 24/2000 (Mei 2000–Des 2020)',
    rows: [
      {
        aspek: 'Batas bebas Bea Meterai',
        aturanLama: 'Nominal s.d. Rp 250.000',
        aturanBaru: 'Nominal s.d. Rp 250.000',
      },
      {
        aspek: 'Nominal > Rp 250 rb s.d. Rp 1 jt',
        aturanLama: 'Rp 1.000 / dokumen',
        aturanBaru: 'Rp 3.000 / dokumen',
      },
      {
        aspek: 'Nominal > Rp 1 juta & perjanjian',
        aturanLama: 'Rp 2.000 / dokumen',
        aturanBaru: 'Rp 6.000 / dokumen',
      },
    ],
  },
  caseExample: {
    title: 'Kuitansi pembayaran jasa Rp 3,5 juta dibuat dalam 1 dokumen',
    scenario:
      'Membandingkan dokumen bernilai Rp 3.500.000 yang pada PP 24/2000 dikenai Rp 6.000, sedangkan pada UU 10/2020 bebas meterai karena <= Rp 5 juta.',
    presetRegime: 'meterai_pp24_2000',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 3500000,
        jumlahDokumen: 1,
      },
    },
  },
};

export const beaMeteraiPp24_2000Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 250.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 6000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 6.000 / dokumen';
    } else if (nilaiDokumen > 250000) {
      tarifPerDokumen = 3000;
      tierFormula = 'Nominal > Rp 250.000 s.d. Rp 1.000.000 -> Tarif Rp 3.000 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif PP 24/2000', formula: tierFormula, value: tarifPerDokumen },
      {
        label: `Total Bea Meterai (${jumlahDokumen} dokumen)`,
        formula: `${formatRupiah(tarifPerDokumen)} x ${jumlahDokumen} dok`,
        value: totalBeaMeterai,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalBeaMeterai,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: tarifPerDokumen,
      steps,
      notes: [
        'Pada era PP 24/2000, dokumen dengan nilai di atas Rp 1 juta hingga Rp 5 juta sudah dikenai Bea Meterai Rp 6.000, sedangkan sejak 2021 dibebaskan di UU 10/2020.',
      ],
    };
  },
};
