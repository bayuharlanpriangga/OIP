import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';

const regime: TaxRegime = {
  id: 'pph23_kep170_2002',
  taxType: 'pph23',
  name: 'UU 17/2000 & KEP-170/PJ./2002',
  shortName: '2002–2007 (KEP-170/2002)',
  legalBasis: 'UU Nomor 17 Tahun 2000 & KEP-170/PJ./2002',
  effectivePeriod: '1 Mei 2002 – 8 April 2007',
  isCurrent: false,
  summary:
    'Skema perkiraan penghasilan neto PPh 23 sebelum PER-70/PJ/2007: tarif 15% x perkiraan neto 50% konsultan (efektif 7,5%), 40% jasa teknik/manajemen (efektif 6%), dan 30% sewa harta bergerak selain angkutan darat (efektif 4,5%).',
};

export const pph23Kep170_2002Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
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
      detailLabel = '15% x Perkiraan Neto 30% = 4,5% (Sewa Harta Umum; angkutan darat 20% = 3%)';
    } else {
      perkiraanNeto = 1.0;
      detailLabel = 'Tarif 15% x Bruto (UU 17/2000)';
    }

    const ratePercent = 15 * perkiraanNeto;

    if (perkiraanNeto < 1) {
      notes.push(
        `Pada KEP-170/PJ./2002, perkiraan penghasilan neto jasa teknik/manajemen (40% -> 6%) dan sewa harta umum (30% -> 4,5%; kecuali angkutan darat 20% -> 3%) lebih tinggi dibandingkan PER-70/PJ/2007.`
      );
    }
    if (!input.hasNpwp) {
      notes.push(
        'Catatan historis: Tambahan sanksi tarif +100% bagi penerima tanpa NPWP belum berlaku di era KEP-170/PJ./2002 (baru berlaku 1 Januari 2009 lewat UU 36/2008).'
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
