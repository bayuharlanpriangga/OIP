import { CalculationResult, CalculationStep, PtkpStatus, TaxCalculatorInput, TaxRegime } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

export type PtkpEra =
  | 'pmk101_2016'
  | 'pmk122_2015'
  | 'pmk162_2012'
  | 'uu36_2008'
  | 'pmk137_2005'
  | 'kmk564_2004'
  | 'uu17_2000'
  | 'uu10_1994'
  | 'uu7_1983';

export type Pph21BracketMode = 'hpp' | 'uu36_2008' | 'uu17_2000' | 'uu10_1994' | 'uu7_1983';

function getPtkpMeta(era: PtkpEra): { base: number; step: number; label: string } {
  switch (era) {
    case 'pmk101_2016':
      return { base: 54000000, step: 4500000, label: 'PMK 101/2016 (TK/0 Rp 54 jt)' };
    case 'pmk122_2015':
      return { base: 36000000, step: 3000000, label: 'PMK 122/2015 (TK/0 Rp 36 jt)' };
    case 'pmk162_2012':
      return { base: 24300000, step: 2025000, label: 'PMK 162/2012 (TK/0 Rp 24,3 jt)' };
    case 'uu36_2008':
      return { base: 15840000, step: 1320000, label: 'UU 36/2008 (TK/0 Rp 15,84 jt)' };
    case 'pmk137_2005':
      return { base: 13200000, step: 1200000, label: 'PMK 137/2005 (TK/0 Rp 13,2 jt)' };
    case 'kmk564_2004':
      return { base: 12000000, step: 1200000, label: 'KMK 564/2004 (TK/0 Rp 12 jt)' };
    case 'uu17_2000':
      return { base: 2880000, step: 1440000, label: 'UU 17/2000 (TK/0 Rp 2,88 jt)' };
    case 'uu10_1994':
      return { base: 1728000, step: 864000, label: 'UU 10/1994 (TK/0 Rp 1,728 jt)' };
    case 'uu7_1983':
      return { base: 960000, step: 480000, label: 'UU 7/1983 (TK/0 Rp 960 rb)' };
  }
}

function getBiayaJabatanMax(era: PtkpEra): { maxAnnual: number; label: string } {
  switch (era) {
    case 'pmk101_2016':
    case 'pmk122_2015':
    case 'pmk162_2012':
    case 'uu36_2008':
      return { maxAnnual: 6000000, label: 'Biaya jabatan (5%, maks Rp 6 jt/thn) & pensiun' };
    case 'pmk137_2005':
    case 'kmk564_2004':
    case 'uu17_2000':
      return {
        maxAnnual: 1296000,
        label: 'Biaya jabatan KMK 521/1998 (5%, maks Rp 1,296 jt/thn) & pensiun',
      };
    case 'uu10_1994':
      return {
        maxAnnual: 648000,
        label: 'Biaya jabatan KMK 49/1994 (5%, maks Rp 648 rb/thn) & pensiun',
      };
    case 'uu7_1983':
      return {
        maxAnnual: 360000,
        label: 'Biaya jabatan KMK 980/1983 (5%, maks Rp 360 rb/thn) & pensiun',
      };
  }
}

export function getPtkpAmount(status: PtkpStatus, era: PtkpEra): number {
  const { base, step } = getPtkpMeta(era);

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

function getLayersAndSurcharge(brackets: Pph21BracketMode): {
  layers: { limit: number; rate: number }[];
  supportsNonNpwpPenalty: boolean;
  label: string;
} {
  switch (brackets) {
    case 'hpp':
      return {
        label: 'PPh 21 setahun (Tarif Pasal 17 UU HPP)',
        supportsNonNpwpPenalty: true,
        layers: [
          { limit: 60000000, rate: 0.05 },
          { limit: 250000000, rate: 0.15 },
          { limit: 500000000, rate: 0.25 },
          { limit: 5000000000, rate: 0.3 },
          { limit: Infinity, rate: 0.35 },
        ],
      };
    case 'uu36_2008':
      return {
        label: 'PPh 21 setahun (Tarif Pasal 17 UU 36/2008)',
        supportsNonNpwpPenalty: true,
        layers: [
          { limit: 50000000, rate: 0.05 },
          { limit: 250000000, rate: 0.15 },
          { limit: 500000000, rate: 0.25 },
          { limit: Infinity, rate: 0.3 },
        ],
      };
    case 'uu17_2000':
      return {
        label: 'PPh 21 setahun (Tarif 5 lapis UU 17/2000: 5/10/15/25/35%)',
        supportsNonNpwpPenalty: false,
        layers: [
          { limit: 25000000, rate: 0.05 },
          { limit: 50000000, rate: 0.1 },
          { limit: 100000000, rate: 0.15 },
          { limit: 200000000, rate: 0.25 },
          { limit: Infinity, rate: 0.35 },
        ],
      };
    case 'uu10_1994':
      return {
        label: 'PPh 21 setahun (Tarif 3 lapis UU 10/1994: 10/15/30%)',
        supportsNonNpwpPenalty: false,
        layers: [
          { limit: 25000000, rate: 0.1 },
          { limit: 50000000, rate: 0.15 },
          { limit: Infinity, rate: 0.3 },
        ],
      };
    case 'uu7_1983':
      return {
        label: 'PPh 21 setahun (Tarif 3 lapis UU 7/1983: 15/25/35%)',
        supportsNonNpwpPenalty: false,
        layers: [
          { limit: 10000000, rate: 0.15 },
          { limit: 50000000, rate: 0.25 },
          { limit: Infinity, rate: 0.35 },
        ],
      };
  }
}

export function computeProgressivePph21(
  pkpRounded: number,
  brackets: Pph21BracketMode,
  hasNpwp: boolean
): { tax: number; breakdown: string } {
  if (pkpRounded <= 0) {
    return { tax: 0, breakdown: 'PKP <= Rp 0' };
  }

  const { layers, supportsNonNpwpPenalty } = getLayersAndSurcharge(brackets);

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

  if (supportsNonNpwpPenalty && !hasNpwp) {
    tax = tax * 1.2;
    parts.push('Sanksi non-NPWP +20%');
  }

  return { tax: Math.round(tax), breakdown: parts.join(' + ') };
}

export function calculateAnnualizedPph21(
  input: TaxCalculatorInput['pph21'],
  regime: TaxRegime,
  ptkpEra: PtkpEra,
  bracketMode: Pph21BracketMode
): CalculationResult {
  const gaji = Math.max(0, input.gajiBulanan);
  const tunjangan = Math.max(0, input.tunjanganTetap);
  const bonus = Math.max(0, input.bonusTahunan);
  const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

  const biayaMeta = getBiayaJabatanMax(ptkpEra);
  const ptkpMeta = getPtkpMeta(ptkpEra);
  const bracketMeta = getLayersAndSurcharge(bracketMode);

  const brutoBulananRutin = gaji + tunjangan;
  const brutoTahunan = brutoBulananRutin * 12 + bonus;
  const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, biayaMeta.maxAnnual);
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
    brutoBulananRutin * 12 -
      Math.min(brutoBulananRutin * 12 * 0.05, biayaMeta.maxAnnual) -
      pensiunTahunan
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
      label: biayaMeta.label,
      value: -(biayaJabatanTahunan + pensiunTahunan),
      isNegative: true,
    },
    {
      label: `PTKP (${input.ptkpStatus})`,
      formula: ptkpMeta.label,
      value: -ptkp,
      isNegative: true,
    },
    {
      label: 'Penghasilan Kena Pajak (PKP) tahunan',
      value: pkpRounded,
    },
    {
      label: bracketMeta.label,
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
  } else if (ptkpEra === 'uu36_2008') {
    notes.push(
      `Periode 2009–2012 menggunakan PTKP awal UU 36/2008 sebesar ${formatRupiah(ptkp)} dengan batas Biaya Jabatan yang telah naik ke Rp 6 juta/tahun (PMK 250/PMK.03/2008).`
    );
  } else if (ptkpEra === 'pmk137_2005' || ptkpEra === 'kmk564_2004' || ptkpEra === 'uu17_2000') {
    notes.push(
      `Menggunakan struktur tarif 5 lapis UU 17/2000 (5%–35%), Biaya Jabatan maksimal Rp 1.296.000/tahun (KMK 521/KMK.04/1998), serta belum ada sanksi +20% non-NPWP (baru lahir 2009).`
    );
  } else if (ptkpEra === 'uu10_1994' || ptkpEra === 'uu7_1983') {
    notes.push(
      `Menggunakan lapis tarif dan PTKP era ${ptkpMeta.label} beserta batas Biaya Jabatan pada masanya, sebelum pembaruan lapisan tarif di UU 17/2000.`
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
