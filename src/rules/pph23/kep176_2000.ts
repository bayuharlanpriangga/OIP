import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';

const regime: TaxRegime = {
  id: 'pph23_kep176_2000',
  taxType: 'pph23',
  name: 'UU 10/1994 & KEP-176/PJ./2000',
  shortName: '1995–2002 (UU 10/1994 & KEP-176)',
  legalBasis: 'Pasal 23 UU Nomor 10 Tahun 1994 & KEP-176/PJ./2000',
  effectivePeriod: '1 Januari 1995 – 30 April 2002',
  isCurrent: false,
  summary:
    'Aturan PPh Pasal 23 era UU 10/1994 hingga KEP-176/PJ./2000: dividen/bunga/royalti 15% bruto, sedangkan jasa konsultan (neto 50% -> 7,5%), jasa teknik/manajemen (40% -> 6%), dan sewa harta umum (30% -> 4,5%).',
};

export const pph23Kep176_2000Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const notes: string[] = [];

    let perkiraanNeto = 0.4;
    let detailLabel = '';
    if (input.objectType === 'jasa_konsultan') {
      perkiraanNeto = 0.5;
      detailLabel = '15% x Perkiraan Neto 50% = 7,5% (Jasa Konsultan)';
    } else if (input.objectType === 'jasa_teknik_manajemen') {
      perkiraanNeto = 0.4;
      detailLabel = '15% x Perkiraan Neto 40% = 6% (Jasa Teknik/Manajemen)';
    } else if (input.objectType === 'sewa_harta') {
      perkiraanNeto = 0.3;
      detailLabel = '15% x Perkiraan Neto 30% = 4,5% (Sewa Harta Non-Tanah/Bangunan)';
    } else {
      perkiraanNeto = 1.0;
      detailLabel = 'Tarif 15% x Bruto (Pasal 23 ayat 1 huruf a UU 10/1994)';
    }

    const ratePercent = 15 * perkiraanNeto;

    if (perkiraanNeto < 1) {
      notes.push(
        'Berdasarkan Pasal 23 UU 10/1994 jo. KEP-176/PJ./2000, pemotongan atas sewa harta serta jasa teknik, manajemen, dan konsultan menggunakan 15% dikalikan Perkiraan Penghasilan Neto.'
      );
    }
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Sanksi tarif 100% lebih tinggi bagi WP tanpa NPWP baru lahir pada 1 Januari 2009 melalui UU 36/2008.'
      );
    }

    const taxAmount = Math.round((bruto * ratePercent) / 100);
    const netReceived = bruto - taxAmount;

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi (tidak termasuk PPN)', value: bruto },
      { label: 'Tarif pemotongan efektif', formula: detailLabel, value: ratePercent, format: 'percent' },
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
