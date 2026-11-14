import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_4_1995, SRC.PP_41_1994, SRC.UU_10_1994];

const regime: TaxRegime = {
  id: 'pph4_2_pp4_1995_ventura',
  taxType: 'pph4_2',
  name: 'PP 4/1995 (PPh Final Penjualan Saham Perusahaan Modal Ventura 0,1%)',
  shortName: '1995–Sekarang (Modal Ventura 0,1% PP 4/1995)',
  legalBasis: 'PP Nomor 4 Tahun 1995 jo. Pasal 4 ayat (2) UU PPh',
  effectivePeriod: '1 Januari 1995 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Divestasi modal ventura pada Perusahaan Pasangan Usaha UMKM (0,1%)',
  summary:
    'Penghasilan perusahaan modal ventura dari transaksi penjualan saham atau pengalihan penyertaan modal pada Perusahaan Pasangan Usahanya (PPU — skala mikro, kecil, menengah, dan belum tercatat di bursa efek) dikenai PPh Final sebesar 0,1% dari jumlah bruto nilai transaksi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp4-1995-ventura',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final 0,1% Perusahaan Modal Ventura (Exit Startup/UMKM): PP Nomor 4 Tahun 1995',
  legalBasis: 'PP Nomor 4 Tahun 1995',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Mengulas rezim PPh Final 0,1% dari nilai penjualan bruto bagi perusahaan modal ventura saat melakukan divestasi saham pada Perusahaan Pasangan Usaha (PPU) non-tbk — termasuk perbandingannya jika PPU sudah melantai di bursa.',
  sections: [
    {
      heading: 'Syarat PPU dan tarif 0,1% bersifat final',
      paragraphs: [
        'Berdasarkan PP Nomor 4 Tahun 1995, penghasilan perusahaan modal ventura dari pengalihan penyertaan modal pada Perusahaan Pasangan Usahanya dikenai PPh Final 0,1% dari nilai bruto transaksi penjualan saham/penyertaan.',
        'Syaratnya PPU merupakan perusahaan kecil, menengah, atau sektor prioritas sesuai ketentuan pemerintah serta sahamnya tidak diperdagangkan di bursa efek Indonesia. Apabila saham PPU sudah dicatatkan di bursa efek (IPO), pengenaan pajaknya tunduk pada ketentuan penjualan saham di bursa efek (PP 41/1994 jo. PP 14/1997 sebesar 0,1% atau tambahan 0,5% saham pendiri).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Penjualan Saham Non-Bursa Biasa (Pasal 17)',
    newHeader: 'Modal Ventura atas PPU Non-Bursa (PP 4/1995)',
    rows: [
      {
        aspek: 'Dasar pengenaan & tarif',
        aturanLama: 'Tarif umum PPh Badan (22%) atas capital gain',
        aturanBaru: '0,1% bersifat Final dari nilai bruto transaksi divestasi',
      },
      {
        aspek: 'Status PPU yang disyaratkan',
        aturanLama: 'Semua perseroan non-tbk',
        aturanBaru: 'UMKM / sektor prioritas non-bursa sesuai PP 4/1995',
      },
    ],
  },
  caseExample: {
    title: 'Divestasi penyertaan modal ventura pada startup/PPU sebesar Rp 10.000.000.000',
    scenario:
      'Perusahaan Modal Ventura berizin OJK menjual penyertaan sahamnya pada Perusahaan Pasangan Usaha (belum IPO) senilai Rp 10.000.000.000.',
    presetRegime: 'pph4_2_pp4_1995_ventura',
    presetInput: {
      pph4_2: {
        nilaiBruto: 10000000000,
        objectType: 'pengalihan_tanah_bangunan',
        skemaDireVentura: 'modal_ventura_0_1',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pp4_1995VenturaRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiBruto);
    const taxAmount = Math.round(nilai * 0.001);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi penjualan saham / penyertaan PPU', value: nilai },
      { label: 'Tarif PPh Final Modal Ventura (PP 4/1995)', value: 0.1, format: 'percent' },
      {
        label: 'PPh Final Modal Ventura terutang',
        formula: `${formatRupiah(nilai)} x 0,1%`,
        value: taxAmount,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Modal Ventura (0,1% — PP 4/1995)',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: 0.1,
      takeHomeOrNetLabel: 'Hasil Divestasi Bersih Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, nilai - taxAmount),
      steps,
      notes: [
        'Berlaku khusus apabila Perusahaan Pasangan Usaha (PPU) belum diperdagangkan di bursa efek dan memenuhi syarat usaha kecil/menengah atau sektor prioritas dalam PP 4/1995.',
      ],
    };
  },
};
