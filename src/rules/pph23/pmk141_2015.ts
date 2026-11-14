import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_pmk141_2015',
  taxType: 'pph23',
  name: 'PMK 141/2015 & UU HPP',
  shortName: '2015–Sekarang',
  legalBasis: 'PMK 141/PMK.03/2015 jo. UU Nomor 6 Tahun 2023 & UU Nomor 7 Tahun 2021',
  effectivePeriod: '26 Agustus 2015 – Sekarang',
  isCurrent: true,
  summary:
    'Tarif 2% atas 62 jenis jasa dan sewa harta; 15% atas royalti. Dividen WP Badan dalam negeri dikecualikan dari objek PPh sejak UU Cipta Kerja.',
  sources: [SRC.PMK_141_2015, SRC.UU_6_2023_CK, SRC.UU_7_2021_HPP, SRC.UU_36_2008],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-jasa-pmk141',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Perluasan Jenis Jasa PMK 141/2015 dan Penghapusan Perkiraan Neto',
  legalBasis: 'PMK 141/PMK.03/2015 vs PMK 244/2008 & PER-70/PJ/2007',
  effectiveDate: '26 Agustus 2015',
  readMinutes: 5,
  summary:
    'Peralihan dari skema perkiraan penghasilan neto (PER-70/2007) menjadi tarif langsung 2% dari jumlah bruto tidak termasuk PPN serta perluasan daftar jasa menjadi 62 jenis.',
  sections: [
    {
      heading: 'Dari tarif efektif berbasis perkiraan neto ke tarif datar 2%',
      paragraphs: [
        'Pada periode 2007–2008 berdasarkan UU 17/2000 dan PER-70/PJ/2007, pemotongan PPh 23 jasa menggunakan tarif 15% dikalikan Perkiraan Penghasilan Neto. Akibatnya, jasa manajemen dan teknik terkena tarif efektif 4,5% (15% × 30%), sedangkan jasa konsultan, hukum, dan akuntansi terkena tarif efektif 7,5% (15% × 50%).',
        'UU 36/2008 menyederhanakan tarif tersebut menjadi 2% langsung dari jumlah bruto (tidak termasuk PPN). PMK 244/2008 awalnya merinci 27 jenis jasa lain, kemudian digantikan PMK 141/2015 yang memperluas cakupan menjadi 62 jenis jasa, termasuk jasa perawatan perangkat lunak, penyelenggara acara, dan pengisian suara.',
      ],
    },
    {
      heading: 'Pengecualian dividen WP Badan dalam negeri',
      paragraphs: [
        'Sejak berlakunya UU Cipta Kerja dan ditegaskan kembali dalam UU HPP, dividen yang berasal dari dalam negeri yang diterima atau diperoleh Wajib Pajak Badan dalam negeri dikecualikan dari objek PPh Pasal 23 tanpa syarat minimum kepemilikan saham 25% yang dulu berlaku di era UU 36/2008.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PER-70/PJ/2007 (2007–2008)',
    newHeader: 'PMK 141/2015 & UU HPP (Kini)',
    rows: [
      {
        aspek: 'Jasa konsultan / akuntansi / hukum',
        aturanLama: '15% × 50% Perkiraan Neto = 7,5% efektif',
        aturanBaru: '2% langsung dari bruto (4% bila non-NPWP)',
      },
      {
        aspek: 'Jasa teknik & manajemen',
        aturanLama: '15% × 30% Perkiraan Neto = 4,5% efektif',
        aturanBaru: '2% langsung dari bruto',
      },
      {
        aspek: 'Dividen WP Badan DN (<25% saham)',
        aturanLama: 'Dipungut PPh 23 sebesar 15%',
        aturanBaru: 'Dikecualikan dari objek PPh (0%)',
      },
    ],
  },
  caseExample: {
    title: 'Pemotongan jasa konsultan manajemen Rp 45 juta',
    scenario:
      'Pembayaran imbalan jasa konsultan sebesar Rp 45.000.000 kepada badan usaha ber-NPWP berdasarkan aturan PMK 141/2015.',
    presetRegime: 'pph23_pmk141_2015',
    presetInput: {
      pph23: {
        nilaiBruto: 45000000,
        objectType: 'jasa_konsultan',
        hasNpwp: true,
      },
    },
  },
};

export const pph23Pmk141_2015Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const notes: string[] = [];
    let ratePercent = 0;
    let formulaDesc = '';

    if (input.objectType === 'dividen_badan') {
      ratePercent = 0;
      formulaDesc = 'Dikecualikan dari objek PPh (UU Cipta Kerja / UU HPP)';
      notes.push(
        'Sejak berlakunya UU Cipta Kerja dan UU HPP, dividen dalam negeri yang diterima WP Badan dalam negeri dikecualikan dari pemotongan PPh 23 tanpa syarat minimal kepemilikan saham.'
      );
    } else if (input.objectType === 'royalti') {
      ratePercent = input.hasNpwp ? 15 : 30;
      formulaDesc = input.hasNpwp ? 'Tarif 15% x Jumlah Bruto' : 'Tarif 15% x 200% (Non-NPWP)';
    } else {
      ratePercent = input.hasNpwp ? 2 : 4;
      formulaDesc = input.hasNpwp
        ? 'Tarif 2% x Bruto (PMK 141/2015)'
        : 'Tarif 2% x 200% = 4% (Non-NPWP)';
    }

    const taxAmount = Math.round((bruto * ratePercent) / 100);
    const netReceived = bruto - taxAmount;

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi (tidak termasuk PPN)', value: bruto },
      { label: 'Tarif pemotongan efektif', formula: formulaDesc, value: ratePercent, format: 'percent' },
      { label: 'PPh Pasal 23 yang dipotong pemotong pajak', value: taxAmount, isHighlight: true },
      { label: 'Pembayaran bersih diterima penyedia jasa/penerima', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 23 Dipotong',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: ratePercent,
      takeHomeOrNetLabel: 'Dana Diterima Setelah Pajak',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes,
    };
  },
};
