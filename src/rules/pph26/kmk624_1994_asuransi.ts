import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_624_1994, SRC.UU_10_1994, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph26_kmk624_1994_asuransi',
  taxType: 'pph26',
  name: 'KMK 624/KMK.04/1994 (Premi Asuransi & Reasuransi ke Perusahaan Asuransi Luar Negeri)',
  shortName: '1995–Kini (Premi Asuransi LN KMK 624/1994)',
  legalBasis: 'Pasal 26 ayat (2) UU PPh jo. KMK Nomor 624/KMK.04/1994',
  effectivePeriod: '1 Januari 1995 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tarif efektif 10% (Tertanggung), 2% (Asuransi DN), & 1% (Reasuransi DN)',
  summary:
    'Aturan pelaksana khusus Pasal 26 ayat (2) UU PPh atas pembayaran premi asuransi dan premi reasuransi kepada perusahaan asuransi di luar negeri dengan perkiraan penghasilan neto berjenjang: 50% (efektif 10%) bila dibayar langsung oleh tertanggung di Indonesia, 10% (efektif 2%) bila dibayar oleh perusahaan asuransi di Indonesia, dan 5% (efektif 1%) bila dibayar oleh perusahaan reasuransi di Indonesia.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-kmk624-1994-asuransi',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'PPh Pasal 26 Premi Asuransi & Reasuransi Luar Negeri: KMK 624/KMK.04/1994',
  legalBasis: 'Pasal 26 ayat (2) UU Nomor 10 Tahun 1994 jo. KMK Nomor 624/KMK.04/1994',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Mengapa pembayaran premi asuransi ke luar negeri tidak langsung dikali 20%, melainkan dihitung menggunakan Perkiraan Penghasilan Neto (50%, 10%, atau 5%) sesuai KMK 624/KMK.04/1994.',
  sections: [
    {
      heading: 'Tiga lapisan tarif efektif: 10%, 2%, dan 1%',
      paragraphs: [
        'Dalam praktik bisnis internasional, pengangkutan kargo ekspor-impor, konstruksi proyek besar, maupun industri asuransi domestik kerap mengalihkan sebagian risiko ke perusahaan asuransi atau reasuransi di luar negeri (seperti di Singapura atau London).',
        'KMK 624/KMK.04/1994 menetapkan Perkiraan Penghasilan Neto yang berbeda berdasarkan siapa pihak pembayar di Indonesia, lalu dikalikan tarif PPh 26 sebesar 20%: (1) dibayar oleh Tertanggung langsung ke luar negeri: neto 50% × 20% = 10% efektif; (2) dibayar oleh Perusahaan Asuransi berkedudukan di Indonesia: neto 10% × 20% = 2% efektif; dan (3) dibayar oleh Perusahaan Reasuransi berkedudukan di Indonesia: neto 5% × 20% = 1% efektif.',
      ],
    },
    {
      heading: 'Interaksi dengan P3B (Tax Treaty) melalui SKD/DGT Form',
      paragraphs: [
        'Apabila perusahaan asuransi di luar negeri berada di negara mitra P3B dan menyerahkan SKD (DGT Form) yang sah, pemajakan premi asuransi tanpa BUT di Indonesia umumnya tunduk pada Pasal Business Profits (Article 7) di P3B terkait—kecuali bila P3B bilateral secara eksplisit memberikan hak pemajakan asuransi kepada negara sumber.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pembayar Premi di Indonesia',
    newHeader: 'Perkiraan Neto & Tarif Efektif PPh 26',
    rows: [
      {
        aspek: 'Tertanggung langsung (non-perusahaan asuransi)',
        aturanLama: 'Perkiraan Neto 50% × Premi Bruto',
        aturanBaru: '10% efektif (20% × 50%)',
      },
      {
        aspek: 'Perusahaan Asuransi berkedudukan di Indonesia',
        aturanLama: 'Perkiraan Neto 10% × Premi Bruto',
        aturanBaru: '2% efektif (20% × 10%)',
      },
      {
        aspek: 'Perusahaan Reasuransi berkedudukan di Indonesia',
        aturanLama: 'Perkiraan Neto 5% × Premi Bruto',
        aturanBaru: '1% efektif (20% × 5%)',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan manufaktur RI bayar premi asuransi kargo Rp 500 jt langsung ke asuransi LN',
    scenario:
      'Sebuah PT manufaktur di Indonesia (tertanggung langsung) membayar premi asuransi sebesar Rp 500.000.000 kepada perusahaan asuransi luar negeri tanpa SKD P3B. Perkiraan penghasilan neto adalah 50% (Rp 250 juta) sehingga PPh 26 terutang adalah 10% x Rp 500 juta = Rp 50.000.000.',
    presetRegime: 'pph26_kmk624_1994_asuransi',
    presetInput: {
      pph26: {
        nilaiBruto: 500000000,
        objectType: 'premi_asuransi_ln',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
        skemaAsuransi624: 'tertanggung_ri_10',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Kmk624_1994AsuransiRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPremi = Math.max(0, input.nilaiBruto);
    const skema = input.skemaAsuransi624 ?? 'tertanggung_ri_10';

    let deemedRate = 50;
    let desc = 'Tertanggung di Indonesia bayar langsung ke perusahaan asuransi LN (Neto 50%)';
    if (skema === 'perusahaan_asuransi_ri_2') {
      deemedRate = 10;
      desc = 'Perusahaan asuransi di Indonesia bayar ke asuransi/reasuransi LN (Neto 10%)';
    } else if (skema === 'perusahaan_reasuransi_ri_1') {
      deemedRate = 5;
      desc = 'Perusahaan reasuransi di Indonesia bayar ke asuransi/reasuransi LN (Neto 5%)';
    }

    const perkiraanNeto = Math.round((nilaiPremi * deemedRate) / 100);
    const normalRate = (deemedRate * 20) / 100;
    const pph26 = input.hasSkdP3b
      ? Math.round((nilaiPremi * Math.max(0, Math.min(20, input.tarifP3bPersen))) / 100)
      : Math.round((perkiraanNeto * 20) / 100);
    const effRate = nilaiPremi > 0 ? (pph26 / nilaiPremi) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Jumlah premi asuransi/reasuransi bruto dibayar ke luar negeri', value: nilaiPremi },
      {
        label: `Perkiraan Penghasilan Neto KMK 624/1994 (${formatPersen(deemedRate)})`,
        formula: desc,
        value: perkiraanNeto,
      },
      {
        label: input.hasSkdP3b
          ? `PPh 26 P3B berdasarkan SKD (${formatPersen(input.tarifP3bPersen)})`
          : `PPh Pasal 26 ayat (2) terutang (${formatPersen(normalRate)} efektif = 20% × ${formatPersen(deemedRate)})`,
        formula: input.hasSkdP3b
          ? `${formatRupiah(nilaiPremi)} x ${formatPersen(input.tarifP3bPersen)}`
          : `20% x ${formatRupiah(perkiraanNeto)}`,
        value: pph26,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Premi Asuransi LN Terutang',
      primaryTaxAmount: pph26,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Premi Bersih Ditransfer ke Asuransi Luar Negeri',
      takeHomeOrNetAmount: Math.max(0, nilaiPremi - pph26),
      steps,
      notes: [
        'Bila tertanggung langsung membayarkan premi ke luar negeri dengan perjanjian net-of-tax, pastikan apakah perlu gross-up agar tidak menjadi koreksi biaya non-deductible.',
        'Jika perusahaan asuransi LN menyampaikan SKD (DGT Form) yang membebaskan hak pemajakan Business Profits di P3B terkait, isi tarif P3B = 0%.',
      ],
    };
  },
};
