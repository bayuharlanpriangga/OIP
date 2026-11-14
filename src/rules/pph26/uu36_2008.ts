import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph26_uu36_2008',
  taxType: 'pph26',
  name: 'UU 36/2008 & PP 16/2009 (Pra-PP 9/2021)',
  shortName: '2009–2021 (UU 36/2008)',
  legalBasis: 'Pasal 26 UU Nomor 36 Tahun 2008 & PP 16/2009',
  effectivePeriod: '1 Januari 2009 – 1 Agustus 2021',
  isCurrent: false,
  summary:
    'Aturan sebelum PP 9/2021: bunga obligasi Wajib Pajak Luar Negeri tanpa P3B masih dikenai tarif penuh 20% (belum turun menjadi 10%).',
};

export const pph26Uu36_2008Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 UU 36/2008 (20% bruto)';

    if (input.objectType === 'premi_asuransi_ln') {
      const basePremiRate = 10;
      if (input.hasSkdP3b && treatyRate < basePremiRate) {
        effectiveRate = treatyRate;
        basisLabel = `Tarif P3B dengan SKD DGT-1 (${formatPersen(treatyRate)})`;
      } else {
        effectiveRate = basePremiRate;
        basisLabel = 'Perkiraan penghasilan neto 50% x 20% = 10%';
      }
    } else if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B dengan SKD (${formatPersen(treatyRate)})`;
    } else if (input.objectType === 'bunga_obligasi_wpln') {
      effectiveRate = 20;
      basisLabel = 'Bunga obligasi WPLN era PP 16/2009 sebelum PP 9/2021 (20%)';
    }

    const pph26 = Math.round((bruto * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayar ke WPLN', value: bruto },
      { label: 'Dasar tarif pemotongan', formula: basisLabel, value: effectiveRate, format: 'percent' },
      {
        label: 'PPh Pasal 26 final dipotong',
        formula: `${formatRupiah(bruto)} x ${formatPersen(effectiveRate)}`,
        value: pph26,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Dipotong (Final)',
      primaryTaxAmount: pph26,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Pembayaran Bersih Ditransfer ke WPLN',
      takeHomeOrNetAmount: Math.max(0, bruto - pph26),
      steps,
      notes: [
        'Sebelum PP 9/2021 berlaku pada Agustus 2021, bunga obligasi WPLN tanpa P3B dipotong PPh Pasal 26 sebesar 20% (dua kali lipat tarif PP 9/2021 yang sebesar 10%).',
      ],
    };
  },
};
