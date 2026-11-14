import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'badan_uu10_1994',
  taxType: 'pph_badan',
  name: 'UU Nomor 10 Tahun 1994 (10/15/30%)',
  shortName: '1995–2000 (UU 10/1994)',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 10 Tahun 1994',
  effectivePeriod: 'Tahun Pajak 1995 – 2000',
  isCurrent: false,
  summary:
    'Struktur tarif progresif Pasal 17 UU 10/1994 untuk Orang Pribadi maupun Badan: 10% (s.d. Rp 25 jt), 15% (> Rp 25 jt s.d. Rp 50 jt), dan 30% (> Rp 50 jt). Belum mengenal Pasal 31E maupun diskon Tbk.',
};

export const badanUu10_1994Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;

    const layers = [
      { limit: 25000000, rate: 10 },
      { limit: 50000000, rate: 15 },
      { limit: Infinity, rate: 30 },
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
        label: 'Lapisan tarif progresif UU 10/1994 (10% / 15% / 30%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Pada UU 10/1994 (1995–2000), tarif PPh Badan masih disatukan dengan lapis progresif Pasal 17 (batas lapis Rp 25 juta & Rp 50 juta), serta belum tersedia fasilitas Pasal 31E maupun diskon emiten Tbk.',
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
