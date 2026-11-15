import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_17_2009, SRC.PP_31_2011, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph4_2_pp17_2009_derivatif',
  taxType: 'pph4_2',
  name: 'PP Nomor 17 Tahun 2009 (Historis PPh Final Derivatif 2,5% — Dicabut PP 31/2011)',
  shortName: '2009–2011 (Historis Derivatif Bursa PP 17/2009)',
  legalBasis: 'PP Nomor 17 Tahun 2009 (Dicabut PP Nomor 31 Tahun 2011)',
  effectivePeriod: '1 Januari 2009 – 30 Mei 2011',
  isCurrent: false,
  summary:
    'Rezim historis yang sempat mengenakan PPh Final sebesar 2,5% atas margin awal (initial margin) transaksi derivatif kontrak berjangka di bursa efek/bursa berjangka sejak Januari 2009. Aturan ini resmi dicabut oleh PP Nomor 31 Tahun 2011 (efektif 31 Mei 2011), sehingga sejak itu laba bersih transaksi derivatif dikenai tarif umum Pasal 17 UU PPh.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp17-2009-derivatif',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Sejarah Pajak Transaksi Derivatif Kontrak Berjangka 2,5% (PP 17/2009) dan Pencabutannya oleh PP 31/2011',
  legalBasis: 'PP Nomor 17 Tahun 2009 & PP Nomor 31 Tahun 2011',
  effectiveDate: '1 Januari 2009 (Dicabut 31 Mei 2011)',
  readMinutes: 4,
  summary:
    'Mengulas alasan penerapan PPh Final 2,5% dari margin awal pada transaksi kontrak berjangka di era 2009–2011 dan mengapa PP 31/2011 mencabutnya kembali ke tarif PPh umum.',
  sections: [
    {
      heading: 'Tarif Final 2,5% atas Margin Awal (Era PP 17/2009)',
      paragraphs: [
        'Berdasarkan PP Nomor 17 Tahun 2009 yang berlaku sejak 1 Januari 2009, penghasilan yang diterima orang pribadi maupun badan dari transaksi derivatif berupa kontrak berjangka yang diperdagangkan di bursa dikenai PPh Final sebesar 2,5% dari margin awal yang disetorkan oleh lembaga kliring dan penjaminan.',
        'Pemungutan langsung atas margin awal membuat transaksi derivatif terkena beban pajak di muka meskipun secara realisasi kontrak tersebut mengalami kerugian di pasar.',
      ],
    },
    {
      heading: 'Pencabutan melalui PP 31/2011: Kembali ke Keuntungan Neto Pasal 17',
      paragraphs: [
        'Karena menghambat likuiditas bursa berjangka nasional dan tidak mencerminkan kemampuan ekonomis (ability to pay) saat transaksi merugi, pemerintah menerbitkan PP Nomor 31 Tahun 2011 pada 31 Mei 2011 yang mencabut PP 17/2009 secara menyeluruh.',
        'Sejak pencabutan tersebut hingga sekarang, tidak ada lagi pemotongan PPh Final 2,5% atas margin awal kontrak berjangka bursa; keuntungan neto dari selisih perdagangan derivatif dilaporkan di SPT Tahunan sebagai penghasilan umum (tarif progresif OP atau tarif PPh Badan 22%), sementara kerugian derivatif dapat diperhitungkan sebagai pengurang.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era PP 17/2009 (1 Jan 2009 – 30 Mei 2011)',
    newHeader: 'Pasca-Pencabutan PP 31/2011 (31 Mei 2011 – Sekarang)',
    rows: [
      {
        aspek: 'Basis Pemajakan Transaksi Derivatif Bursa',
        aturanLama: 'Margin awal (initial margin) — terutang saat setor margin',
        aturanBaru: 'Keuntungan neto realisasi di akhir tahun pajak (Pasal 17)',
      },
      {
        aspek: 'Tarif & Sifat Pemajakan',
        aturanLama: '2,5% Final oleh Lembaga Kliring dan Penjaminan',
        aturanBaru: '0% PPh Final (masuk tarif umum PPh OP/Badan di SPT Tahunan)',
      },
    ],
  },
  caseExample: {
    title: 'Penyetoran margin awal kontrak berjangka Rp 400 juta di era PP 17/2009',
    scenario:
      'Seorang trader menempatkan margin awal Rp 400.000.000 pada kontrak berjangka komoditi di tahun 2010 (saat PP 17/2009 berlaku). Lembaga kliring wajib memungut PPh Final 2,5% = Rp 10.000.000 atas margin awal tersebut. Sejak PP 31/2011 (31 Mei 2011 dst.), pemungutan final 2,5% atas margin awal dihapus (Rp 0).',
    presetRegime: 'pph4_2_pp17_2009_derivatif',
    presetInput: {
      pph4_2: {
        nilaiBruto: 400000000,
        objectType: 'sewa_tanah_bangunan',
        isMarginAwalDerivatif: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pp17_2009DerivatifRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiBruto);
    const isEraPp17 = input.isMarginAwalDerivatif !== false;
    const pphFinal = isEraPp17 ? Math.round(nilai * 0.025) : 0;

    const steps: CalculationStep[] = [
      {
        label: isEraPp17
          ? 'Nilai margin awal kontrak berjangka bursa (Basis PP 17/2009)'
          : 'Nilai margin awal kontrak berjangka (Pasca-PP 31/2011)',
        value: nilai,
      },
      {
        label: isEraPp17
          ? 'PPh Final 2,5% dipungut Lembaga Kliring (Era PP 17/2009)'
          : 'PPh Final 0% — Pemotongan Final Margin Dihapus (PP 31/2011)',
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isEraPp17
        ? 'PPh Final Derivatif (2,5% PP 17/2009)'
        : 'PPh Final Derivatif (Dicabut PP 31/2011)',
      primaryTaxAmount: pphFinal,
      annualTaxLabel: isEraPp17
        ? 'Bandingkan Pasca-PP 31/2011 (PPh Final Dihapus)'
        : 'Beban Historis Era PP 17/2009',
      annualTaxAmount: isEraPp17 ? 0 : Math.round(nilai * 0.025),
      effectiveRatePercent: isEraPp17 && nilai > 0 ? 2.5 : 0,
      takeHomeOrNetLabel: isEraPp17 ? 'Margin Bersih Setelah PPh Final 2,5%' : 'Margin Utuh Tanpa PPh Final',
      takeHomeOrNetAmount: Math.max(0, nilai - pphFinal),
      steps,
      notes: [
        isEraPp17
          ? `Pada era 1 Jan 2009 – 30 Mei 2011, setiap penyetoran margin awal sebesar ${formatRupiah(nilai)} langsung dikenai PPh Final ${formatPersen(2.5)} sebesar ${formatRupiah(pphFinal)}.`
          : 'Sejak 31 Mei 2011 berdasarkan PP Nomor 31 Tahun 2011, pengenaan PPh Final 2,5% atas margin awal dicabut; laba/rugi neto transaksi derivatif digabung ke penghasilan umum Pasal 17 di SPT Tahunan.',
        'Modul ini merupakan arsip historis yang penting bagi wajib pajak pasar berjangka untuk membedakan perlakuan pajak derivatif dengan pajak penjualan saham di bursa (PP 41/1994 sebesar 0,1%).',
      ],
    };
  },
};
