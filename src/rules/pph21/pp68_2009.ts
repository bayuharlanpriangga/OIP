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
  id: 'pph21_pp68_2009',
  taxType: 'pph21',
  name: 'PP 68/2009 — Pesangon & Pensiun/THT/JHT Final',
  shortName: '2009–Kini (Pesangon/JHT PP 68)',
  legalBasis: 'PP Nomor 68 Tahun 2009 jo. PMK 16/PMK.03/2010 (Tarif Final Sekaligus)',
  effectivePeriod: '16 November 2009 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Khusus pesangon & pensiun/THT/JHT sekaligus',
  summary:
    'Tarif final PPh 21 atas pembayaran sekaligus: Pesangon 0% (<= 50jt), 5% (50–100jt), 15% (100–500jt), 25% (> 500jt); sedangkan Manfaat Pensiun/THT/JHT 0% (<= 50jt) dan 5% (> 50jt).',
  sources: [SRC.PP_68_2009, SRC.PMK_16_2010, SRC.PP_58_2023],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pp68-2009-pesangon',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Tarif Final Pesangon & Pencairan Pensiun/THT/JHT Sekaligus (PP 68/2009)',
  legalBasis: 'PP Nomor 68 Tahun 2009 jo. PMK 16/PMK.03/2010',
  effectiveDate: '16 November 2009 – Sekarang',
  readMinutes: 4,
  summary:
    'PP 68/2009 menetapkan tarif PPh 21 Final yang jauh lebih ringan atas uang pesangon serta memisahkan tarif manfaat pensiun, THT, dan JHT sekaligus hanya menjadi 0% dan 5%. Ketentuan ini tetap berlaku hingga era TER PP 58/2023.',
  sections: [
    {
      heading: 'Pemisahan tarif pesangon vs manfaat pensiun/THT/JHT',
      paragraphs: [
        'Sebelum November 2009 (PP 149/2000), pesangon dan pencairan sekaligus THT/JHT/pensiun digabung dalam lima lapisan tarif 0% hingga 25% dengan batas bebas hanya Rp 25 juta.',
        'Mulai 16 November 2009, PP 68/2009 menaikkan lapisan bebas pajak menjadi Rp 50.000.000. Untuk Uang Pesangon berlaku 4 lapis progresif final: 0% (s.d. Rp 50 jt), 5% (> Rp 50–100 jt), 15% (> Rp 100–500 jt), dan 25% (> Rp 500 jt). Sedangkan untuk Uang Manfaat Pensiun, THT, dan JHT sekaligus cukup 2 lapis: 0% (s.d. Rp 50 jt) dan 5% (> Rp 50 jt).',
      ],
    },
    {
      heading: 'Syarat pembayaran sekaligus maksimal 2 tahun kalender dan posisi di era TER',
      paragraphs: [
        'Sifat Final hanya berlaku jika dibayarkan sekaligus atau bertahap paling lama 2 tahun kalender. Jika dibayarkan pada tahun ketiga dan seterusnya, berlaku tarif umum Pasal 17 tidak final. Selain itu, PP 58/2023 secara eksplisit menegaskan pemotongan PPh 21 pesangon & pensiun sekaligus tetap mengacu PP 68/2009.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 149/2000 (2001–Nov 2009)',
    newHeader: 'PP 68/2009 (Nov 2009–Sekarang)',
    rows: [
      {
        aspek: 'Lapisan bebas pajak (0%)',
        aturanLama: 'Sampai dengan Rp 25.000.000',
        aturanBaru: 'Sampai dengan Rp 50.000.000',
      },
      {
        aspek: 'Batas tarif 25% Pesangon',
        aturanLama: 'Penghasilan bruto > Rp 200.000.000',
        aturanBaru: 'Penghasilan bruto > Rp 500.000.000',
      },
      {
        aspek: 'Tarif maksimal Pensiun / THT / JHT sekaligus',
        aturanLama: 'Sama dengan pesangon (hingga 25%)',
        aturanBaru: 'Maksimal 5% (> Rp 50.000.000)',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan menerima uang pesangon Rp 250 juta sekaligus',
    scenario:
      'Pegawai berhenti bekerja menerima pesangon Rp 250.000.000 dibayar sekaligus sesuai lapisan final PP 68/2009.',
    presetRegime: 'pph21_pp68_2009',
    presetInput: {
      pph21: {
        gajiBulanan: 0,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
        pesangonBruto: 250000000,
        pesangonType: 'pesangon',
      },
    },
  },
};

export const pph21Pp68_2009Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
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
