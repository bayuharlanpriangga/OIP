import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'badan_uu17_2000',
  taxType: 'pph_badan',
  name: 'UU Nomor 17 Tahun 2000 (Progresif 3 Lapis)',
  shortName: '2001–2008 (10/15/30%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b UU 17/2000 & PP 81/2007 (Diskon Tbk TP 2008)',
  effectivePeriod: 'Tahun Pajak 2001 – 2008',
  isCurrent: false,
  summary:
    'Sebelum tarif tunggal berlaku di 2009, PPh Badan menggunakan tarif progresif tiga lapis: 10% (s.d. Rp 50 jt), 15% (> Rp 50 jt–100 jt), dan 30% (> Rp 100 jt) tanpa Pasal 31E; khusus TP 2008 emiten Tbk mendapat diskon 5% di PP 81/2007.',
};

export const badanUu17_2000Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;
    const tbkDiscount = input.isTbk ? 5 : 0;

    const layers = [
      { limit: 50000000, rate: Math.max(0, 10 - tbkDiscount) },
      { limit: 100000000, rate: Math.max(0, 15 - tbkDiscount) },
      { limit: Infinity, rate: Math.max(0, 30 - tbkDiscount) },
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
        label: input.isTbk
          ? 'Lapisan progresif UU 17/2000 dikurangi diskon 5% Tbk (PP 81/2007 — TP 2008)'
          : 'Lapisan tarif progresif 3 lapis UU 17/2000 (10% / 15% / 30%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Di era UU 17/2000 (TP 2001–2008), tarif tidak bergantung pada batas omzet Rp 4,8M/Rp 50M karena fasilitas Pasal 31E baru lahir di UU 36/2008 (mulai TP 2009).',
    ];
    if (input.isTbk) {
      notes.push(
        'Penurunan tarif 5% bagi emiten Tbk (PP Nomor 81 Tahun 2007) dalam era ini mulai berlaku khusus untuk Tahun Pajak 2008.'
      );
    }

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
