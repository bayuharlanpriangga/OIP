import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_51_2025, SRC.PMK_81_2024, SRC.PMK_34_2017];

const regime: TaxRegime = {
  id: 'pph22_pembebasan_skb',
  taxType: 'pph22',
  name: 'Pengecualian & SKB PPh Pasal 22 (PMK 51/2025 Pasal 3 jo. PER-1/PJ/2011)',
  shortName: '2025–Kini (Pengecualian & SKB PPh 22)',
  legalBasis: 'Pasal 3 PMK Nomor 51 Tahun 2025 (eks Pasal 219 PMK 81/2024 & PMK 34/2017) jo. PER-21/PJ/2014',
  effectivePeriod: '1 Agustus 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengecualian otomatis (KITE/KEK/<=Rp 2 jt) & SKB DJP',
  summary:
    'Mengatur transaksi yang dikecualikan dari pemungutan PPh Pasal 22 baik secara otomatis tanpa SKB (belanja instansi pemerintah <= Rp 2 juta, impor fasilitas KITE/KEK/Kawasan Berikat/bantuan bencana/barang kiriman ibadah) maupun yang memerlukan Surat Keterangan Bebas (SKB) PPh 22 DJP (Wajib Pajak rugi fiskal atau tidak terutang PPh) serta Suket UMKM 0,5%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pembebasan-skb',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Pengecualian Otomatis vs. SKB PPh Pasal 22: PMK 51/2025 jo. PER-21/PJ/2014',
  legalBasis: 'Pasal 3 PMK Nomor 51 Tahun 2025 & PER-1/PJ/2011 stdd PER-21/PJ/2014',
  effectiveDate: '1 Agustus 2025',
  readMinutes: 5,
  summary:
    'Membedakan objek impor dan belanja instansi pemerintah yang otomatis bebas PPh Pasal 22 (tanpa SKB) dari transaksi yang tetap wajib melampirkan Surat Keterangan Bebas (SKB) atau Suket UMKM agar tidak dipungut 1,5%–2,5%.',
  sections: [
    {
      heading: 'Pengecualian otomatis tanpa memerlukan SKB dari KPP',
      paragraphs: [
        'Pasal 3 PMK 51 Tahun 2025 menegaskan kelompok penyerahan dan impor yang dikecualikan langsung secara otomatis tanpa SKB, antara lain: (1) pembayaran oleh Instansi Pemerintah paling banyak Rp 2.000.000 tidak termasuk PPN dan bukan pembayaran yang dipecah-pecah; (2) pembayaran BUMN/tertentu untuk pembelian BBM, listrik, gas, air minum, dan benda pos;',
        '(3) impor barang dalam skema Kemudahan Impor Tujuan Ekspor (KITE Pembebasan), Kawasan Ekonomi Khusus (KEK), atau Kawasan Berikat; serta (4) impor barang kiriman hadiah untuk keperluan ibadah umum, amal, sosial, kebudayaan, atau penanggulangan bencana alam.',
      ],
    },
    {
      heading: 'Kapan wajib mengurus Surat Keterangan Bebas (SKB) PPh Pasal 22?',
      paragraphs: [
        'Untuk impor bahan baku umum (tarif 2,5% API) atau penyerahan barang strategis di luar daftar bebas otomatis, Wajib Pajak yang mengalami kerugian fiskal tahun sebelumnya atau berhak atas kompensasi kerugian sehingga tahun berjalan tidak akan terutang PPh Badan dapat mengajukan SKB PPh Pasal 22 melalui portal Coretax/KPP (PER-1/PJ/2011 jo. PER-21/PJ/2014). Adapun rekanan beromzet UMKM menyerahkan Suket PP 55/2022 / PP 20/2026 sehingga dikenai PPh Final 0,5% alih-alih 1,5%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tanpa Pengecualian / Tanpa SKB',
    newHeader: 'Memenuhi Pasal 3 PMK 51/2025 / Ber-SKB',
    rows: [
      {
        aspek: 'Belanja instansi pemerintah <= Rp 2 jt (non-PPN)',
        aturanLama: 'Jika > Rp 2 jt tetap dipungut 1,5% PPh 22',
        aturanBaru: 'Dikecualikan otomatis 0% (tidak perlu SKB DJP)',
      },
      {
        aspek: 'Impor fasilitas KITE / KEK / SKB rugi fiskal',
        aturanLama: 'Impor API normal dipungut 2,5% PPh 22',
        aturanBaru: '0% (Dibebaskan/dikecualikan dari pemungutan PPh 22)',
      },
      {
        aspek: 'Transaksi rekanan ber-Suket UMKM',
        aturanLama: 'Dipungut PPh 22 tidak final 1,5%',
        aturanBaru: 'Dipotong PPh Final UMKM 0,5% (bukan PPh 22)',
      },
    ],
  },
  caseExample: {
    title: 'Belanja instansi pemerintah Rp 1.800.000 (di bawah ambang batas Rp 2 juta)',
    scenario:
      'Instansi pemerintah membeli perlengkapan kantor seharga Rp 1.800.000 (di luar PPN) dalam satu kali pembayaran tanpa dipecah. Karena <= Rp 2.000.000, transaksi dikecualikan otomatis dari pemungutan PPh 22 (Rp 0).',
    presetRegime: 'pph22_pembebasan_skb',
    presetInput: {
      pph22: {
        nilaiDasar: 1800000,
        objectType: 'bendahara_bumn',
        hasNpwp: true,
        skemaPembebasan22: 'belanja_max_2jt',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22PembebasanSkbRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const skema = input.skemaPembebasan22 ?? 'belanja_max_2jt';

    let rate = 0;
    let normalBenchmarkRate = 1.5;
    let desc = '';

    if (skema === 'belanja_max_2jt') {
      normalBenchmarkRate = 1.5;
      if (nilaiDasar > 2000000) {
        rate = input.hasNpwp ? 1.5 : 3;
        desc = 'Nilai > Rp 2.000.000: pengecualian tidak berlaku -> wajib pungut PPh 22 1,5%';
      } else {
        rate = 0;
        desc = 'Pembayaran instansi pemerintah <= Rp 2.000.000 (Dikecualikan otomatis tanpa SKB)';
      }
    } else if (skema === 'kite_kek_bebas_bm') {
      normalBenchmarkRate = 2.5;
      rate = 0;
      desc = 'Fasilitas KITE Pembebasan / KEK / Kawasan Berikat / Bantuan Bencana (Otomatis 0%)';
    } else if (skema === 'impor_ekspor_skb_djp') {
      normalBenchmarkRate = 2.5;
      rate = 0;
      desc = 'Bebas pungutan PPh 22 berdasarkan SKB DJP (Wajib Pajak rugi fiskal / emas ekspor)';
    } else {
      normalBenchmarkRate = 1.5;
      rate = 0.5;
      desc = 'Rekanan ber-Suket UMKM: dialihkan ke pemotongan PPh Final 0,5% (bukan 1,5%)';
    }

    const payableTax = Math.round((nilaiDasar * rate) / 100);
    const benchmarkNormalTax = Math.round((nilaiDasar * normalBenchmarkRate) / 100);
    const savingAmount = Math.max(0, benchmarkNormalTax - payableTax);

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi / nilai impor (non-PPN)', value: nilaiDasar },
      { label: 'Pembanding PPh 22 normal tanpa fasilitas/SKB', value: benchmarkNormalTax },
      {
        label: 'Pajak terutang setelah pengecualian / SKB / Suket',
        formula: desc,
        value: payableTax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: skema === 'umkm_pp55_skb' ? 'PPh Final UMKM Dipotong (0,5%)' : 'PPh Pasal 22 Dipungut',
      primaryTaxAmount: payableTax,
      annualTaxLabel: 'Penghematan Pungutan PPh 22',
      annualTaxAmount: savingAmount,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Diterima Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - payableTax),
      steps,
      notes: [
        'Batas pengecualian Rp 2.000.000 khusus Instansi Pemerintah mensyaratkan bukan pembayaran yang dipecah-pecah dari suatu transaksi bernilai lebih besar.',
        'SKB PPh 22 tidak diperlukan untuk pengecualian otomatis (belanja <= Rp 2 juta, KITE/KEK, bantuan bencana), namun wajib dilampirkan untuk pembebasan karena kondisi rugi fiskal.',
      ],
    };
  },
};
