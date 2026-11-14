import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph21_pp149_2000',
  taxType: 'pph21',
  name: 'PP 149/2000 — Pesangon & Pensiun/THT/JHT (Lama)',
  shortName: '2001–2009 (Pesangon PP 149)',
  legalBasis: 'PP Nomor 149 Tahun 2000 (sebelum digantikan PP 68/2009)',
  effectivePeriod: '1 Januari 2001 – 15 November 2009',
  isCurrent: false,
  summary:
    'Aturan pendahulu PP 68/2009 untuk pesangon, tebusan pensiun, THT, dan JHT sekaligus: 0% (<= 25jt), 5% (25–50jt), 10% (50–100jt), 15% (100–200jt), dan 25% (> 200jt).',
};

export const pph21Pp149_2000Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    const bruto = Math.max(0, input.pesangonBruto ?? 0);

    const layers = [
      { limit: 25000000, rate: 0 },
      { limit: 50000000, rate: 0.05 },
      { limit: 100000000, rate: 0.1 },
      { limit: 200000000, rate: 0.15 },
      { limit: Infinity, rate: 0.25 },
    ];

    let remaining = bruto;
    let prevLimit = 0;
    let tax = 0;
    const parts: string[] = [];

    for (const layer of layers) {
      if (remaining <= 0) break;
      const span = layer.limit === Infinity ? remaining : Math.min(remaining, layer.limit - prevLimit);
      const layerTax = Math.round(span * layer.rate);
      tax += layerTax;
      parts.push(`${Math.round(layer.rate * 100)}% x ${formatRupiah(span)}`);
      remaining -= span;
      prevLimit = layer.limit;
    }

    const effectiveRate = bruto > 0 ? (tax / bruto) * 100 : 0;
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Bruto Pesangon / Tebusan Pensiun / THT / JHT sekaligus', value: bruto },
      {
        label: 'PPh 21 Final PP 149/2000 (0 / 5 / 10 / 15 / 25%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'Bruto Rp 0',
        value: tax,
        isHighlight: true,
      },
      {
        label: 'Dana bersih diterima pegawai',
        formula: `${formatRupiah(bruto)} - ${formatRupiah(tax)}`,
        value: netReceived,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 21 Final Terutang',
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Dana Bersih Diterima Pegawai',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Di PP 149/2000, batas bebas pajak masih Rp 25 juta (naik ke Rp 50 juta di PP 68/2009) dan tarif 25% sudah menyentuh jumlah di atas Rp 200 juta (sebelum dinaikkan ke Rp 500 juta).',
      ],
    };
  },
};
