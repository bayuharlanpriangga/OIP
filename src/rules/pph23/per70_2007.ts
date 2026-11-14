import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph23_per70_2007',
  taxType: 'pph23',
  name: 'UU 17/2000 & PER-70/PJ/2007',
  shortName: '2007–2008 (Perkiraan Neto)',
  legalBasis: 'UU Nomor 17 Tahun 2000 & PER-70/PJ/2007',
  effectivePeriod: '9 April 2007 – 31 Desember 2008',
  isCurrent: false,
  summary:
    'Pemotongan menggunakan tarif 15% dikalikan Perkiraan Penghasilan Neto: 4,5% efektif untuk jasa teknik/manajemen, 7,5% untuk konsultan, dan 3% untuk sewa.',
  sources: [SRC.UU_17_2000, SRC.KEP_170_2002_DJP],
};

const article: TaxArticle = {
  id: 'pph23-per70-2007',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Skema Perkiraan Penghasilan Neto Jasa di Era PER-70/PJ/2007',
  legalBasis: 'UU Nomor 17 Tahun 2000 & PER-70/PJ/2007',
  effectiveDate: '9 April 2007',
  readMinutes: 4,
  summary:
    'Sebelum tarif tunggal 2% berlaku di tahun 2009, pemotongan PPh Pasal 23 atas jasa menggunakan tarif 15% dikalikan persentase Perkiraan Penghasilan Neto.',
  sections: [
    {
      heading: 'Cara kerja tarif 15% dikali Perkiraan Penghasilan Neto',
      paragraphs: [
        'Di bawah ketentuan UU Nomor 17 Tahun 2000 dan PER-70/PJ/2007, tarif pemotongan PPh Pasal 23 atas jasa bukan angka tunggal 2%. Undang-undang menetapkan tarif 15% dari Perkiraan Penghasilan Neto yang besarannya berbeda menurut jenis jasanya.',
        'Jasa konsultan, hukum, dan akuntansi ditetapkan memiliki perkiraan penghasilan neto 50% sehingga tarif efektifnya mencapai 7,5%. Sementara itu, jasa teknik dan manajemen memiliki perkiraan neto 30% (efektif 4,5%), dan sewa kendaraan atau harta selain tanah/bangunan memiliki perkiraan neto 20% (efektif 3%).',
      ],
    },
    {
      heading: 'Penghentian skema perkiraan neto pada 2009',
      paragraphs: [
        'Melalui UU Nomor 36 Tahun 2008 yang berlaku 1 Januari 2009, pemerintah menghapus mekanisme perkiraan penghasilan neto dan menggantinya dengan tarif datar 2% langsung dari jumlah bruto agar arus kas penyedia jasa lebih ringan dan mudah diaudit.',
      ],
    },
  ],
  caseExample: {
    title: 'Jasa konsultan Rp 45 juta dihitung dengan PER-70/PJ/2007',
    scenario:
      'Imbalan jasa konsultan sebesar Rp 45.000.000 dengan perkiraan neto 50% menghasilkan potongan efektif 7,5% (Rp 3.375.000).',
    presetRegime: 'pph23_per70_2007',
    presetInput: {
      pph23: {
        nilaiBruto: 45000000,
        objectType: 'jasa_konsultan',
        hasNpwp: true,
      },
    },
  },
};

export const pph23Per70_2007Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const notes: string[] = [];

    let perkiraanNeto = 0.3;
    if (input.objectType === 'jasa_konsultan') perkiraanNeto = 0.5;
    else if (input.objectType === 'jasa_teknik_manajemen') perkiraanNeto = 0.3;
    else if (input.objectType === 'sewa_harta') perkiraanNeto = 0.2;
    else perkiraanNeto = 1.0;

    const ratePercent = 15 * perkiraanNeto;
    const formulaDesc =
      perkiraanNeto === 1
        ? 'Tarif 15% x Bruto (UU 17/2000)'
        : `15% x Perkiraan Neto ${Math.round(perkiraanNeto * 100)}% = ${formatPersen(ratePercent)}`;

    if (perkiraanNeto < 1) {
      notes.push(
        `Pada era PER-70/PJ/2007 (sebelum 2009), jasa dikenakan tarif 15% atas Perkiraan Penghasilan Neto (${Math.round(perkiraanNeto * 100)}%), sehingga tarif efektifnya lebih tinggi dibanding aturan 2% saat ini.`
      );
    }
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Sanksi tarif 100% lebih tinggi bagi non-NPWP di PPh 23 baru mulai berlaku 1 Januari 2009 melalui UU 36/2008.'
      );
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
