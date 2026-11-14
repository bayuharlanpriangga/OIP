import { CalculationResult, CalculationStep, PtkpStatus, TaxCalculatorInput, TaxRegime } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

export type PtkpEra = 'pmk101_2016' | 'pmk122_2015' | 'pmk162_2012';

export function getPtkpAmount(status: PtkpStatus, era: PtkpEra): number {
  const base =
    era === 'pmk101_2016' ? 54000000 : era === 'pmk122_2015' ? 36000000 : 24300000;
  const step =
    era === 'pmk101_2016' ? 4500000 : era === 'pmk122_2015' ? 3000000 : 2025000;

  switch (status) {
    case 'TK/0':
      return base;
    case 'TK/1':
      return base + step;
    case 'TK/2':
      return base + step * 2;
    case 'TK/3':
      return base + step * 3;
    case 'K/0':
      return base + step;
    case 'K/1':
      return base + step * 2;
    case 'K/2':
      return base + step * 3;
    case 'K/3':
      return base + step * 4;
  }
}

export function computeProgressivePph21(
  pkpRounded: number,
  brackets: 'hpp' | 'uu36_2008',
  hasNpwp: boolean
): { tax: number; breakdown: string } {
  if (pkpRounded <= 0) {
    return { tax: 0, breakdown: 'PKP <= Rp 0' };
  }

  const layers =
    brackets === 'hpp'
      ? [
          { limit: 60000000, rate: 0.05 },
          { limit: 250000000, rate: 0.15 },
          { limit: 500000000, rate: 0.25 },
          { limit: 5000000000, rate: 0.3 },
          { limit: Infinity, rate: 0.35 },
        ]
      : [
          { limit: 50000000, rate: 0.05 },
          { limit: 250000000, rate: 0.15 },
          { limit: 500000000, rate: 0.25 },
          { limit: Infinity, rate: 0.3 },
        ];

  let remaining = pkpRounded;
  let prevLimit = 0;
  let tax = 0;
  const parts: string[] = [];

  for (const layer of layers) {
    if (remaining <= 0) break;
    const span = layer.limit === Infinity ? remaining : Math.min(remaining, layer.limit - prevLimit);
    const layerTax = span * layer.rate;
    tax += layerTax;
    parts.push(`${Math.round(layer.rate * 100)}% x ${formatRupiah(span)}`);
    remaining -= span;
    prevLimit = layer.limit;
  }

  if (!hasNpwp) {
    tax = tax * 1.2;
    parts.push('Sanksi non-NPWP +20%');
  }

  return { tax: Math.round(tax), breakdown: parts.join(' + ') };
}

export function calculateAnnualizedPph21(
  input: TaxCalculatorInput['pph21'],
  regime: TaxRegime,
  ptkpEra: PtkpEra,
  bracketMode: 'hpp' | 'uu36_2008'
): CalculationResult {
  const gaji = Math.max(0, input.gajiBulanan);
  const tunjangan = Math.max(0, input.tunjanganTetap);
  const bonus = Math.max(0, input.bonusTahunan);
  const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

  const brutoBulananRutin = gaji + tunjangan;
  const brutoTahunan = brutoBulananRutin * 12 + bonus;
  const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, 6000000);
  const pensiunTahunan = pensiunBulanan * 12;
  const netoTahunan = Math.max(0, brutoTahunan - biayaJabatanTahunan - pensiunTahunan);

  const ptkp = getPtkpAmount(input.ptkpStatus, ptkpEra);
  const pkpRaw = Math.max(0, netoTahunan - ptkp);
  const pkpRounded = Math.floor(pkpRaw / 1000) * 1000;

  const { tax: pphTahunan, breakdown } = computeProgressivePph21(
    pkpRounded,
    bracketMode,
    input.hasNpwp
  );

  const netoRutinSetahun = Math.max(
    0,
    brutoBulananRutin * 12 - Math.min(brutoBulananRutin * 12 * 0.05, 6000000) - pensiunTahunan
  );
  const pkpRutinOnly = Math.floor(Math.max(0, netoRutinSetahun - ptkp) / 1000) * 1000;
  const { tax: pphRutinTahunan } = computeProgressivePph21(pkpRutinOnly, bracketMode, input.hasNpwp);
  const pphBulananRutin = Math.round(pphRutinTahunan / 12);
  const pphAtasBonus = Math.max(0, pphTahunan - pphRutinTahunan);

  const steps: CalculationStep[] = [
    {
      label: 'Penghasilan bruto rutin setahun (12 bulan)',
      value: brutoBulananRutin * 12,
    },
    {
      label: 'Bonus tahunan ditambahkan ke bruto',
      value: bonus,
    },
    {
      label: 'Biaya jabatan (5%, maks Rp 6 jt/thn) & pensiun',
      value: -(biayaJabatanTahunan + pensiunTahunan),
      isNegative: true,
    },
    {
      label: `PTKP (${input.ptkpStatus})`,
      formula:
        ptkpEra === 'pmk162_2012'
          ? 'PMK 162/2012 (TK/0 Rp 24,3 jt)'
          : ptkpEra === 'pmk122_2015'
            ? 'PMK 122/2015 (TK/0 Rp 36 jt)'
            : 'PMK 101/2016 (TK/0 Rp 54 jt)',
      value: -ptkp,
      isNegative: true,
    },
    {
      label: 'Penghasilan Kena Pajak (PKP) tahunan',
      value: pkpRounded,
    },
    {
      label:
        bracketMode === 'hpp'
          ? 'PPh 21 setahun (Tarif Pasal 17 UU HPP)'
          : 'PPh 21 setahun (Tarif Pasal 17 UU 36/2008)',
      formula: breakdown,
      value: pphTahunan,
      isHighlight: true,
    },
    {
      label: 'Angsuran PPh 21 rutin per bulan (tanpa bonus)',
      formula: `${formatRupiah(pphRutinTahunan)} ÷ 12 bulan`,
      value: pphBulananRutin,
    },
    {
      label: 'Tambahan PPh 21 saat bonus dibayarkan',
      formula: `${formatRupiah(pphTahunan)} - ${formatRupiah(pphRutinTahunan)}`,
      value: pphAtasBonus,
    },
  ];

  const notes: string[] = [
    `Skema ini menghitung pajak atas gaji rutin dengan proyeksi disetahunkan tiap bulan (${formatRupiah(pphBulananRutin)}/bln), lalu menghitung selisih pajak bonus (${formatRupiah(pphAtasBonus)}) saat bonus dibayar.`,
  ];

  if (ptkpEra === 'pmk162_2012') {
    notes.push(
      `Dengan PTKP era 2013–2014 yang lebih rendah (${formatRupiah(ptkp)}), PKP menjadi jauh lebih besar dibanding aturan 2015 ke atas.`
    );
  } else if (ptkpEra === 'pmk122_2015') {
    notes.push(
      `Menggunakan PTKP Tahun Pajak 2015 sebesar ${formatRupiah(ptkp)} sesuai PMK 122/PMK.010/2015 sebelum kenaikan ke Rp 54 juta pada 2016.`
    );
  }

  const effectiveAnnualRate = brutoTahunan > 0 ? (pphTahunan / brutoTahunan) * 100 : 0;
  const takeHomeBulanRutin = Math.max(0, brutoBulananRutin - pensiunBulanan - pphBulananRutin);

  return {
    regime,
    primaryTaxLabel: 'Potongan Bulanan Rutin (Disetahunkan)',
    primaryTaxAmount: pphBulananRutin,
    annualTaxLabel: 'Total PPh 21 Setahun',
    annualTaxAmount: pphTahunan,
    effectiveRatePercent: effectiveAnnualRate,
    takeHomeOrNetLabel: 'Penghasilan Bersih Bulanan (Rutin)',
    takeHomeOrNetAmount: takeHomeBulanRutin,
    steps,
    notes,
  };
}
