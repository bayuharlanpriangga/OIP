import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_pmk244_2009',
  taxType: 'pph23',
  name: 'UU 36/2008 & PMK 244/2008',
  shortName: '2009–2015',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 244/PMK.03/2008',
  effectivePeriod: '1 Januari 2009 – 25 Agustus 2015',
  isCurrent: false,
  summary:
    'Tarif 2% berlaku atas 27 jenis jasa tertentu; dividen yang diterima WP Badan dengan kepemilikan saham di bawah 25% masih dipotong PPh 23 sebesar 15%.',
  sources: [SRC.PMK_244_2008, SRC.UU_36_2008],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-pmk244-2009',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'PMK 244/2008 & UU 36/2008: Lahirnya Tarif Tunggal 2% PPh 23 (2009–2015)',
  legalBasis: 'Pasal 23 UU Nomor 36 Tahun 2008 & PMK 244/PMK.03/2008',
  effectiveDate: '1 Januari 2009',
  readMinutes: 4,
  summary:
    'Terobosan penyederhanaan PPh Pasal 23 dari skema perkiraan neto menjadi tarif datar 2% atas 27 jenis jasa lain sekaligus pemberlakuan tarif 200% bagi WP non-NPWP.',
  sections: [
    {
      heading: 'Penghapusan Perkiraan Neto dan 27 jenis jasa PMK 244/2008',
      paragraphs: [
        'Melalui UU Nomor 36 Tahun 2008 yang berlaku mulai 1 Januari 2009, pembuat undang-undang menghapus sistem perkiraan penghasilan neto yang sebelumnya membuat tarif efektif jasa melompat-lompat antara 3% hingga 7,5%. Sebagai gantinya, sewa harta selain tanah/bangunan dan imbalan jasa lain dikenai tarif datar 2% dari jumlah bruto tidak termasuk PPN.',
        'Sebagai aturan pelaksana perdana, PMK 244/PMK.03/2008 merinci daftar positif sebanyak 27 kelompok jasa lain (dari jasa penilai dan aktuaris hingga maklon, perawatan komputer, dan katering), sebelum kelak diperluas menjadi 62 jenis di era PMK 141/2015.',
      ],
    },
    {
      heading: 'Dividen WP Badan <25% saham dan pengali tarif non-NPWP',
      paragraphs: [
        'Pada masa ini, pengecualian dividen antarkorporasi hanya berlaku apabila kepemilikan saham penerima mencapai minimal 25% dari modal disetor; di bawah batas itu tetap dipotong PPh 23 sebesar 15%. Selain itu, Pasal 23 ayat (1a) UU 36/2008 memberlakukan tarif 100% lebih tinggi (4% untuk jasa, 30% untuk royalti/dividen) apabila penerima tidak memiliki NPWP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PER-70/PJ/2007 (2007–2008)',
    newHeader: 'PMK 244/2008 (2009–2015)',
    rows: [
      {
        aspek: 'Tarif jasa konsultan & manajemen',
        aturanLama: '15% × perkiraan neto (4,5% – 7,5%)',
        aturanBaru: '2% langsung dari jumlah bruto',
      },
      {
        aspek: 'Cakupan jenis jasa lain',
        aturanLama: 'Mengikuti rincian PER-70/PJ/2007',
        aturanBaru: '27 jenis jasa positif (PMK 244/2008)',
      },
    ],
  },
  caseExample: {
    title: 'Jasa teknik Rp 50 juta dihitung di bawah PMK 244/2008',
    scenario:
      'Pembayaran jasa teknik kepada rekanan ber-NPWP sebesar Rp 50.000.000 pada tahun 2012 dipotong PPh Pasal 23 sebesar 2% atau Rp 1.000.000.',
    presetRegime: 'pph23_pmk244_2009',
    presetInput: {
      pph23: {
        nilaiBruto: 50000000,
        objectType: 'jasa_teknik_manajemen',
        hasNpwp: true,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph23Pmk244_2009Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const notes: string[] = [];
    let ratePercent = 0;
    let formulaDesc = '';

    if (input.objectType === 'dividen_badan' || input.objectType === 'royalti') {
      ratePercent = input.hasNpwp ? 15 : 30;
      formulaDesc = input.hasNpwp
        ? 'Tarif 15% x Bruto (UU 36/2008)'
        : 'Tarif 15% x 200% = 30% (Non-NPWP)';
      if (input.objectType === 'dividen_badan') {
        notes.push(
          'Pada era UU 36/2008 (sebelum UU Cipta Kerja), dividen WP Badan dengan kepemilikan saham < 25% masih dipotong PPh 23 sebesar 15%.'
        );
      }
    } else {
      ratePercent = input.hasNpwp ? 2 : 4;
      formulaDesc = input.hasNpwp
        ? 'Tarif 2% x Bruto (PMK 244/2008)'
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
