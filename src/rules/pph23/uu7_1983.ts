import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_uu7_1983',
  taxType: 'pph23',
  name: 'UU Nomor 7 Tahun 1983 (Pasal 23)',
  shortName: '1984–1994 (UU 7/1983 — 15% Bruto)',
  legalBasis: 'Pasal 23 UU Nomor 7 Tahun 1983',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Era awal PPh Pasal 23 sebelum skema Perkiraan Penghasilan Neto di UU 10/1994: tarif tunggal 15% dari jumlah bruto atas dividen, bunga, royalti, hadiah, sewa, serta imbalan jasa teknik dan manajemen.',
  sources: [SRC.UU_7_1983, SRC.UU_10_1994],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph23-uu7-1983',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Tarif Tunggal 15% Bruto di Era Awal Pasal 23 UU 7/1983 (1984–1994)',
  legalBasis: 'Pasal 23 UU Nomor 7 Tahun 1983',
  effectiveDate: '1 Januari 1984',
  readMinutes: 3,
  summary:
    'Bentuk perdana PPh Pasal 23 dalam UU PPh 1983 yang mengenakan pemotongan datar 15% dari jumlah bruto atas modal maupun jasa teknik/manajemen.',
  sections: [
    {
      heading: 'Tarif seragam 15% untuk modal, sewa, dan jasa teknik',
      paragraphs: [
        'Ketika UU Nomor 7 Tahun 1983 mulai berlaku pada 1 Januari 1984, Pasal 23 menetapkan satu tarif pemotongan yang sama, yakni 15% dari jumlah bruto yang dibayarkan atau terutang oleh badan pemerintah, subjek pajak badan dalam negeri, maupun penyelenggara kegiatan.',
        'Pada masa ini belum ada pemisahan dasar pengenaan antara imbalan modal (dividen, bunga, royalti) dengan sewa dan imbalan jasa teknik atau jasa manajemen.',
      ],
    },
    {
      heading: 'Dampak arus kas yang memicu reformasi 1994',
      paragraphs: [
        'Karena seluruh imbalan jasa teknik dan manajemen langsung dipotong 15% dari nilai kontrak kotor, banyak perusahaan jasa dengan margin operasional tipis mengalami kelebihan pemotongan kredit pajak di SPT Tahunan. Kondisi inilah yang mendorong lahirnya skema Perkiraan Penghasilan Neto dalam UU 10/1994.',
      ],
    },
  ],
  caseExample: {
    title: 'Imbalan jasa manajemen Rp 20 juta di bawah UU 7/1983',
    scenario:
      'Pembayaran jasa manajemen senilai Rp 20.000.000 pada periode 1984–1994 dipotong langsung 15% bruto atau Rp 3.000.000 (jauh di atas tarif 2% saat ini).',
    presetRegime: 'pph23_uu7_1983',
    presetInput: {
      pph23: {
        nilaiBruto: 20000000,
        objectType: 'jasa_teknik_manajemen',
        hasNpwp: true,
      },
    },
  },
};

export const pph23Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const ratePercent = 15;
    const taxAmount = Math.round((bruto * ratePercent) / 100);
    const netReceived = bruto - taxAmount;

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi (tidak termasuk PPN)', value: bruto },
      {
        label: 'Tarif pemotongan Pasal 23 UU 7/1983',
        formula: 'Tarif tunggal 15% x Jumlah Bruto (belum memakai Perkiraan Neto)',
        value: ratePercent,
        format: 'percent',
      },
      { label: 'PPh Pasal 23 yang dipotong pemotong pajak', value: taxAmount, isHighlight: true },
      { label: 'Pembayaran bersih diterima penyedia jasa/penerima', value: netReceived },
    ];

    const notes: string[] = [
      'Pada UU 7/1983 (1984–1994), seluruh objek Pasal 23 termasuk jasa teknik/manajemen dan sewa harta dikenai tarif tunggal 15% dari jumlah bruto, sebelum UU 10/1994 memperkenalkan Perkiraan Penghasilan Neto untuk sewa dan jasa.',
    ];
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Sanksi tarif 100% lebih tinggi bagi WP tanpa NPWP belum berlaku (baru mulai 1 Januari 2009 melalui UU 36/2008).'
      );
    }

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
