import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

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
  sources: [SRC.PP_149_2000, SRC.UU_17_2000],
};

const article: TaxArticle = {
  id: 'pph21-pp149-2000-pesangon',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Skema Historis Pesangon dan THT/JHT Era PP 149/2000 (Sebelum PP 68/2009)',
  legalBasis: 'PP Nomor 149 Tahun 2000 jo. UU Nomor 17 Tahun 2000',
  effectiveDate: '1 Januari 2001 – 15 November 2009',
  readMinutes: 3,
  summary:
    'Selama 2001–November 2009, seluruh pencairan pesangon, tebusan pensiun, THT, dan JHT sekaligus dipotong PPh 21 Final 5 lapis (0%, 5%, 10%, 15%, dan 25%) dengan batas bebas pajak masih Rp 25 juta.',
  sections: [
    {
      heading: 'Lima lapis tarif progresif final PP 149/2000',
      paragraphs: [
        'PP Nomor 149 Tahun 2000 berlaku serentak dengan UU 17/2000 sejak 1 Januari 2001 untuk memberikan tarif final terpisah atas pesangon dan uang tebusan pensiun/THT/JHT.',
        'Lapisan tarifnya terdiri atas 0% (s.d. Rp 25 jt), 5% (> Rp 25–50 jt), 10% (> Rp 50–100 jt), 15% (> Rp 100–200 jt), dan 25% (> Rp 200 jt) tanpa membedakan antara pesangon PHK dan pencairan saldo JHT/THT.',
      ],
    },
    {
      heading: 'Dampak bagi pencairan JHT pekerja sebelum 2009',
      paragraphs: [
        'Karena belum ada tarif khusus 0%/5% seperti di PP 68/2009, karyawan dengan akumulasi JHT atau tebusan pensiun besar di atas Rp 100 juta pada era 2001–2009 terkena potongan marginal 15% hingga 25%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 149/2000 (2001–Nov 2009)',
    newHeader: 'PP 68/2009 (Nov 2009–Kini)',
    rows: [
      {
        aspek: 'Lapisan bebas pajak (0%)',
        aturanLama: 'Bruto s.d. Rp 25 juta',
        aturanBaru: 'Bruto s.d. Rp 50 juta',
      },
      {
        aspek: 'Lapisan tarif JHT/THT > Rp 50 jt',
        aturanLama: '10% / 15% / 25%',
        aturanBaru: 'Datar 5% (tidak membedakan besaran)',
      },
      {
        aspek: 'Ambang tarif 25% Pesangon',
        aturanLama: '> Rp 200 juta',
        aturanBaru: '> Rp 500 juta',
      },
    ],
  },
  caseExample: {
    title: 'Pesangon Rp 150 juta dipotong memakai aturan PP 149/2000',
    scenario:
      'Membandingkan beban PPh 21 Final atas uang pesangon Rp 150.000.000 sebelum revisi PP 68/2009.',
    presetRegime: 'pph21_pp149_2000',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        pesangonBruto: 150000000,
        pesangonType: 'pesangon',
      },
    },
  },
};

export const pph21Pp149_2000Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
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
