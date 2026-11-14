import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph21_pp68_2009',
  taxType: 'pph21',
  name: 'PP 68/2009 — Pesangon & Pensiun/THT/JHT Final',
  shortName: '2009–Kini (Pesangon/JHT PP 68)',
  legalBasis: 'PP Nomor 68 Tahun 2009 jo. PMK 16/PMK.03/2010 (Tarif Final Sekaligus)',
  effectivePeriod: '16 November 2009 – Sekarang',
  isCurrent: false,
  summary:
    'Tarif final PPh 21 atas pembayaran sekaligus: Pesangon 0% (<= 50jt), 5% (50–100jt), 15% (100–500jt), 25% (> 500jt); sedangkan Manfaat Pensiun/THT/JHT 0% (<= 50jt) dan 5% (> 50jt).',
};

export const pph21Pp68_2009Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  calculate(input) {
    const bruto = Math.max(0, input.pesangonBruto ?? 0);
    const kind = input.pesangonType ?? 'pesangon';

    const layers =
      kind === 'pesangon'
        ? [
            { limit: 50000000, rate: 0 },
            { limit: 100000000, rate: 0.05 },
            { limit: 500000000, rate: 0.15 },
            { limit: Infinity, rate: 0.25 },
          ]
        : [
            { limit: 50000000, rate: 0 },
            { limit: Infinity, rate: 0.05 },
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
      {
        label:
          kind === 'pesangon'
            ? 'Bruto Uang Pesangon yang dibayarkan sekaligus'
            : 'Bruto Uang Manfaat Pensiun / THT / JHT sekaligus',
        value: bruto,
      },
      {
        label:
          kind === 'pesangon'
            ? 'PPh 21 Final Pesangon (PP 68/2009: 0/5/15/25%)'
            : 'PPh 21 Final Pensiun/THT/JHT (PP 68/2009: 0/5%)',
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
        'PP 68/2009 bersifat Final (tanpa sanksi non-NPWP dan tidak digabung dalam penghitungan ulang SPT Tahunan) sepanjang dibayar sekaligus atau bertahap maksimal 2 tahun kalender.',
        'Untuk honorarium/imbalan lain yang menjadi beban APBN/APBD bagi PNS, anggota TNI/Polri, dan pensiunannya berlaku aturan final terpisah lewat PP Nomor 80 Tahun 2010 (0% Gol I–II, 5% Gol III, 15% Gol IV/Pejabat Negara).',
      ],
    };
  },
};
