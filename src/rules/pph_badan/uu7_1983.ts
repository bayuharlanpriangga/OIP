import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'badan_uu7_1983',
  taxType: 'pph_badan',
  name: 'UU Nomor 7 Tahun 1983 & UU 7/1991',
  shortName: '1984–1994 (15/25/35%)',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 7 Tahun 1983 stdd UU Nomor 7 Tahun 1991',
  effectivePeriod: 'Tahun Pajak 1984 – 1994',
  isCurrent: false,
  summary:
    'Struktur tarif progresif generasi awal reformasi pajak 1983: 15% (s.d. Rp 10 jt), 25% (> Rp 10 jt s.d. Rp 50 jt), dan 35% (> Rp 50 jt) untuk Orang Pribadi maupun Badan.',
};

export const badanUu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;

    const layers = [
      { limit: 10000000, rate: 15 },
      { limit: 50000000, rate: 25 },
      { limit: Infinity, rate: 35 },
    ];

    let remaining = pkp;
    let prevLimit = 0;
    let totalTax = 0;
    const parts: string[] = [];

    for (const layer of layers) {
      if (remaining <= 0) break;
      const span = layer.limit === Infinity ? remaining : Math.min(remaining, layer.limit - prevLimit);
      const layerTax = Math.round((span * layer.rate) / 100);
      totalTax += layerTax;
      parts.push(`${layer.rate}% x ${formatRupiah(span)}`);
      remaining -= span;
      prevLimit = layer.limit;
    }

    const effectiveRate = pkp > 0 ? (totalTax / pkp) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak (PKP dibulatkan ribuan)', value: pkp },
      {
        label: 'Lapisan tarif progresif UU 7/1983 (15% / 25% / 35%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Sejak reformasi perpajakan 1984 hingga 1994 (UU 7/1983 jo. UU 7/1991), WP Badan dan WP Orang Pribadi menggunakan lapisan tarif Pasal 17 yang sama (15% / 25% / 35%) dengan batas Rp 10 juta & Rp 50 juta.',
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Terutang Setahun',
      primaryTaxAmount: totalTax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Laba Fiskal Bersih Setelah PPh',
      takeHomeOrNetAmount: Math.max(0, pkp - totalTax),
      steps,
      notes,
    };
  },
};
