import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';

const regime: TaxRegime = {
  id: 'pph23_pmk244_2009',
  taxType: 'pph23',
  name: 'UU 36/2008 & PMK 244/2008',
  shortName: '2009–2015',
  legalBasis: 'UU Nomor 36 Tahun 2008 & PMK 244/PMK.03/2008',
  effectivePeriod: '1 Januari 2009 – 23 Agustus 2015',
  isCurrent: false,
  summary:
    'Tarif 2% berlaku atas 27 jenis jasa tertentu; dividen yang diterima WP Badan dengan kepemilikan saham di bawah 25% masih dipotong PPh 23 sebesar 15%.',
};

export const pph23Pmk244_2009Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
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
