import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KEP_667_PJ_2001, SRC.KMK_634_1994, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph15_kmk634_1994_kpd',
  taxType: 'pph15',
  name: 'KMK 634/KMK.04/1994 & KEP-667/PJ./2001 (Kantor Perwakilan Dagang Asing 0,44%)',
  shortName: '1994–Kini (KPD Asing 0,44%)',
  legalBasis: 'Pasal 15 UU PPh, KMK 634/KMK.04/1994 & KEP-667/PJ./2001',
  effectivePeriod: '1994 – Sekarang (Pembaruan 0,44% sejak KEP-667/PJ./2001)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Nilai ekspor bruto KPD / Representative Office (0,44%)',
  summary:
    'Norma Penghitungan Khusus PPh Pasal 15 bagi Wajib Pajak Luar Negeri yang mempunyai Kantor Perwakilan Dagang (Representative Office) di Indonesia tanpa melakukan penjualan langsung: Penghasilan neto ditetapkan 1% dari seluruh nilai ekspor bruto ke Indonesia, dikalikan gabungan PPh Badan 30% + BPT 20% atas sisa 70% laba (= 44% gabungan) sehingga menjadi 0,44% Final.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph15-kmk634-1994-kpd',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'Norma Khusus Kantor Perwakilan Dagang Asing (KPD): KMK 634/1994 & KEP-667/PJ./2001 (0,44%)',
  legalBasis: 'KMK 634/KMK.04/1994 jo. KEP-667/PJ./2001',
  effectiveDate: '29 Desember 1994 (Revisi 0,44% di KEP-667/PJ./2001)',
  readMinutes: 4,
  summary:
    'Meskipun Kantor Perwakilan Dagang (Representative Office) perusahaan asing tidak menerbitkan faktur penjualan di Indonesia, penghasilan netonya dianggap 1% dari nilai ekspor bruto kantor pusat ke Indonesia dan dikenai tarif efektif final 0,44%.',
  sections: [
    {
      heading: 'Mengapa tarif efektif KPD Asing tepat 0,44% Final dari nilai ekspor bruto?',
      paragraphs: [
        'Berdasarkan KMK Nomor 634/KMK.04/1994 dan penegasannya pada KEP-667/PJ./2001, norma penghasilan neto Kantor Perwakilan Dagang Asing di Indonesia ditetapkan sebesar 1% dari seluruh nilai ekspor bruto barang (baik terkait promosi maupun pengawasan) yang dikirim oleh perusahaan induk di luar negeri kepada pembeli di Indonesia.',
        'Atas penghasilan neto 1% tersebut diterapkan tarif PPh Badan tertinggi historis 30% ditambah Branch Profit Tax 20% atas sisa 70% (= 14%), menghasilkan tarif gabungan 44% × 1% = 0,44% Final dari nilai ekspor bruto — dengan catatan jika ada P3B (tax treaty), tarif gabungan mengikuti PPh Badan + tarif BPT P3B.',
      ],
    },
  ],
  caseExample: {
    title: 'Representative Office dengan nilai ekspor kantor pusat Rp 20 miliar ke Indonesia',
    scenario:
      'Kantor perwakilan dagang perusahaan manufaktur asing di Jakarta memfasilitasi pengiriman ekspor kantor pusat ke Indonesia senilai Rp 20.000.000.000: PPh Pasal 15 Final terutang = 0,44% × Rp 20 M = Rp 88.000.000.',
    presetRegime: 'pph15_kmk634_1994_kpd',
    presetInput: {
      pph15: {
        peredaranBruto: 20000000000,
        sectorType: 'pelayaran_dn',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph15Kmk634_1994KpdRule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const nilaiEkspor = Math.max(0, input.peredaranBruto);
    const normaNeto = Math.round(nilaiEkspor * 0.01);
    const rate = 0.44;
    const pph15 = Math.round((nilaiEkspor * rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai ekspor bruto perusahaan induk ke Indonesia', value: nilaiEkspor },
      { label: 'Norma penghasilan neto KPD Asing (1% × nilai ekspor)', value: normaNeto },
      {
        label: 'Tarif PPh Pasal 15 Final KPD (44% × norma neto 1%)',
        formula: '30% PPh Badan + 20% BPT x (1 - 30%) = 44% x 1%',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 15 Final KPD terutang & setor sendiri',
        formula: `${formatRupiah(nilaiEkspor)} x ${formatPersen(rate)}`,
        value: pph15,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 15 Final KPD Asing (0,44%)',
      primaryTaxAmount: pph15,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Sisa Nilai Ekspor Bruto Setelah PPh 15',
      takeHomeOrNetAmount: Math.max(0, nilaiEkspor - pph15),
      steps,
      notes: [
        'Batas penyetoran PPh Pasal 15 KPD Asing adalah setiap bulan/triwulan mengikuti jadwal pelaporan masa kini di PMK 81/2024 paling lambat tanggal 15 bulan berikutnya.',
        'Jika negara domisili kantor pusat mempunyai P3B dengan Indonesia dan tarif BPT P3B di bawah 20%, tarif efektif menyesuaikan 1% × [tarif PPh Badan + tarif BPT P3B × (1 - tarif PPh Badan)].',
      ],
    };
  },
};
