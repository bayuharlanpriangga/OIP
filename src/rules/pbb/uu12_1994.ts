import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pbb_uu12_1994',
  taxType: 'pbb',
  name: 'UU Nomor 12 Tahun 1994 (PBB Pusat / P3)',
  shortName: '1995–2009 (Nasional & P3)',
  legalBasis: 'UU Nomor 12 Tahun 1994 & PP Nomor 25 Tahun 2002',
  effectivePeriod: '1 Januari 1995 – 2009 (masih berlaku untuk PBB-P3)',
  isCurrent: false,
  summary:
    'Tarif tunggal 0,5% dikalikan NJKP (20% untuk NJOP < Rp 1 M atau 40% untuk NJOP >= Rp 1 M), dengan NJOPTKP nasional Rp 12 juta.',
};

export const pbbUu12_1994Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;
    const njoptkp = 12000000;
    const njopSetelahNjoptkp = Math.max(0, njopTotal - njoptkp);

    const njkpPercent = njopTotal >= 1000000000 ? 40 : 20;
    const tarif = 0.5;
    const njkpAmount = Math.round((njopSetelahNjoptkp * njkpPercent) / 100);
    const pbbTerutang = Math.round((njkpAmount * tarif) / 100);
    const effectiveRate = njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi', value: bumi },
      { label: 'NJOP Bangunan', value: bangunan },
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      {
        label: 'NJOPTKP Nasional (maks Rp 12 jt)',
        value: -Math.min(njopTotal, njoptkp),
        isNegative: true,
      },
      { label: 'NJOP Dasar Perhitungan', value: njopSetelahNjoptkp },
      {
        label: `NJKP PP 25/2002 (${njkpPercent}%)`,
        formula:
          njopTotal >= 1000000000
            ? 'NJOP >= Rp 1 M menggunakan NJKP 40%'
            : 'NJOP < Rp 1 M menggunakan NJKP 20%',
        value: njkpAmount,
      },
      {
        label: 'Tarif Tunggal UU PBB (0,5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(njkpAmount)}`,
        value: tarif,
        format: 'percent',
      },
      { label: 'PBB terutang setahun', value: pbbTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBB Terutang Setahun',
      primaryTaxAmount: pbbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Nilai Jual Kena Pajak (NJKP)',
      takeHomeOrNetAmount: njkpAmount,
      steps,
      notes: [
        'Ketentuan 0,5% x NJKP (20%/40%) dari UU PBB tetap berlaku sampai saat ini khusus untuk sektor Perkebunan, Perhutanan, dan Pertambangan (PBB-P3) yang dikelola DJP.',
      ],
    };
  },
};
