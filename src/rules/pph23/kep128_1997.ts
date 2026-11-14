import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { SRC } from '../sources';

const sources = [SRC.KEP_128_PJ_1997, SRC.UU_10_1994, SRC.KEP_176_PJ_2000];

const regime: TaxRegime = {
  id: 'pph23_kep128_1997',
  taxType: 'pph23',
  name: 'KEP-128/PJ./1997 (Jenis Jasa Lain Awal UU 10/1994)',
  shortName: '1997–2000 (KEP-128/PJ./1997)',
  legalBasis: 'KEP-128/PJ./1997 jo. Pasal 23 UU Nomor 10 Tahun 1994',
  effectivePeriod: '1997 – 3 Juli 2000',
  isCurrent: false,
  summary:
    'Keputusan Dirjen Pajak pelaksana awal Pasal 23 ayat (2) UU 10/1994 yang merinci perkiraan penghasilan neto atas sewa harta (30% -> 4,5%), jasa teknik/manajemen/konstruksi (40% -> 6%), jasa konsultan (50% -> 7,5%), dan penghasilan pasif (15% bruto) sebelum digantikan KEP-176/PJ./2000.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-kep128-1997',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Fondasi Perkiraan Neto Jasa Lain di Era 1997–2000: KEP-128/PJ./1997',
  legalBasis: 'KEP-128/PJ./1997 & Pasal 23 UU Nomor 10 Tahun 1994',
  effectiveDate: '1997 (Digantikan KEP-176/PJ./2000 per 4 Juli 2000)',
  readMinutes: 4,
  summary:
    'KEP-128/PJ./1997 menstandarkan daftar jenis jasa lain dan perkiraan penghasilan neto di era pasca-UU 10/1994, memecah sewa dan jasa dari tarif datar 15% menjadi tarif efektif 4,5%–7,5% sebelum disempurnakan oleh KEP-176/PJ./2000 dan KEP-170/PJ./2002.',
  sections: [
    {
      heading: 'Klasifikasi tarif efektif KEP-128/PJ./1997',
      paragraphs: [
        'Sesuai mandat Pasal 23 ayat (2) UU Nomor 10 Tahun 1994, DJP menetapkan besaran Perkiraan Penghasilan Neto untuk menyederhanakan pemotongan terhadap imbalan bruto: jasa konsultan menggunakan norma neto 50% (efektif 7,5%), jasa teknik/manajemen dan jasa konstruksi menggunakan 40% (efektif 6%), serta sewa harta selain tanah/bangunan menggunakan 30% (efektif 4,5%).',
        'Aturan ini menjadi cikal bakal perluasan jenis jasa pada KEP-176/PJ./2000 dan KEP-170/PJ./2002 sebelum akhirnya UU 36/2008 menghapus skema perkiraan neto menjadi tarif tunggal 2% bruto.',
      ],
    },
  ],
  caseExample: {
    title: 'Jasa teknik pabrik Rp 40 juta pada era KEP-128/PJ./1997',
    scenario:
      'Imbalan jasa teknik dan perawatan mesin sebesar Rp 40.000.000 pada tahun 1998 dikenai 15% × Perkiraan Neto 40% = efektif 6% (Rp 2.400.000).',
    presetRegime: 'pph23_kep128_1997',
    presetInput: {
      pph23: {
        nilaiBruto: 40000000,
        objectType: 'jasa_teknik_manajemen',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Kep128_1997Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    let perkiraanNeto = 0.4;
    let detailLabel = '15% x Perkiraan Neto 40% = 6%';
    if (input.objectType === 'jasa_konsultan') {
      perkiraanNeto = 0.5;
      detailLabel = '15% x Perkiraan Neto 50% = 7,5% (Jasa Konsultan)';
    } else if (input.objectType === 'jasa_teknik_manajemen') {
      perkiraanNeto = 0.4;
      detailLabel = '15% x Perkiraan Neto 40% = 6% (Jasa Teknik / Manajemen)';
    } else if (input.objectType === 'sewa_harta') {
      perkiraanNeto = 0.3;
      detailLabel = '15% x Perkiraan Neto 30% = 4,5% (Sewa Harta selain Tanah/Bangunan)';
    } else {
      perkiraanNeto = 1;
      detailLabel = 'Tarif 15% x Bruto (Dividen, Bunga, Royalti, Hadiah)';
    }

    const ratePercent = 15 * perkiraanNeto;
    const taxAmount = Math.round((bruto * ratePercent) / 100);
    const netReceived = Math.max(0, bruto - taxAmount);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi (non-PPN)', value: bruto },
      { label: 'Tarif pemotongan efektif KEP-128/PJ./1997', formula: detailLabel, value: ratePercent, format: 'percent' },
      { label: 'PPh Pasal 23 dipotong', value: taxAmount, isHighlight: true },
      { label: 'Dana bersih diterima penyedia jasa', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 23 Dipotong (Era 1997)',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: ratePercent,
      takeHomeOrNetLabel: 'Dana Diterima Setelah Pajak',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Pada era KEP-128/PJ./1997 hingga 2008 belum dikenal sanksi tarif +100% bagi penerima tanpa NPWP.',
      ],
    };
  },
};
