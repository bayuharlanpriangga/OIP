import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_41_2023, SRC.PMK_11_2025, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'ppn_pmk41_2023_ayda',
  taxType: 'ppn',
  name: 'PMK 41/2023 jo. PMK 11/2025 (PPN Penyerahan Agunan Diambil Alih / AYDA 1,1%)',
  shortName: '2023–Kini (AYDA Bank / LJK 1,1%)',
  legalBasis: 'PMK Nomor 41 Tahun 2023 jo. PMK Nomor 11 Tahun 2025 (Besaran Tertentu 1,1%)',
  effectivePeriod: '1 Mei 2023 – Sekarang (Penyesuaian 11/12 di PMK 11/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Lelang/Jual Agunan Kredit Macet oleh Bank/Multifinance',
  summary:
    'Menghitung PPN Besaran Tertentu sebesar 1,1% (10% x 11/12 x 12%) atas penjualan atau lelang Agunan yang Diambil Alih (AYDA) oleh kreditur (bank/lembaga pembiayaan) kepada pembeli agunan, sekaligus membedakan tahap pengambilalihan dari debitur (0%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk41-2023-ayda',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Penyerahan Agunan yang Diambil Alih (AYDA) Bank/LJK: Besaran Tertentu 1,1% (PMK 41/2023 jo. PMK 11/2025)',
  legalBasis: 'PMK Nomor 41 Tahun 2023 jo. PMK Nomor 11 Tahun 2025',
  effectiveDate: '1 Mei 2023 (diselaraskan 11/12 efektif 4 Februari 2025)',
  readMinutes: 5,
  summary:
    'Mengulas kewajiban pemungutan PPN Besaran Tertentu 1,1% dengan Faktur Pajak Kode 050 oleh kreditur saat menjual agunan sitaan (lelang/penjualan langsung) kepada pembeli, beserta hak pengkreditan Pajak Masukan oleh pembeli PKP.',
  sections: [
    {
      heading: 'Besaran Tertentu 1,1% atas penjualan AYDA kepada pembeli',
      paragraphs: [
        'Penyerahan hak atas agunan yang diambil alih oleh kreditur (bank, BPR, atau perusahaan pembiayaan) kepada pembeli agunan termasuk dalam cakupan penyerahan Barang Kena Pajak (BKP). Sejak berlakunya PMK Nomor 41 Tahun 2023 (1 Mei 2023), PPN dipungut oleh kreditur dengan mekanisme Besaran Tertentu sebesar 10% dari tarif PPN umum.',
        'Di bawah PMK Nomor 11 Tahun 2025, besaran tertentu tersebut dirumuskan sebagai 10% x 11/12 x tarif 12%, sehingga beban efektifnya tetap tepat 1,1% dikalikan dengan hasil penjualan agunan (atau nilai lelang/nilai kesepakatan penjualan AYDA).',
      ],
    },
    {
      heading: 'Tahap pengambilalihan dari debitur vs hak kredit pembeli PKP',
      paragraphs: [
        'Pada saat kreditur melakukan pengambilalihan fisik/penguasaan AYDA dari debitur macet menuju portofolio bank, kreditur TIDAK menerbitkan faktur dan belum ada PPN terutang dari tahap pengambilalihan internal tersebut sampai saat agunan benar-benar diserahkan kepada pembeli akhir.',
        'Atas pemungutan PPN 1,1% kepada pembeli (menggunakan Kode Faktur 050 atau bukti setara yang dipersamakan sesuai PMK 41/2023), Kreditur tidak dapat mengkreditkan Pajak Masukan pemeliharaan/lelang AYDA, namun PEMBELI berstatus PKP tetap diperbolehkan mengkreditkan PPN 1,1% tersebut sebagai Pajak Masukan apabila terkait kegiatan usaha.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tahap Pengambilalihan dari Debitur',
    newHeader: 'Tahap Penjualan AYDA ke Pembeli (PMK 41/2023 & PMK 11/2025)',
    rows: [
      {
        aspek: 'Terutang PPN AYDA',
        aturanLama: 'Belum terutang PPN pemungutan AYDA oleh kreditur (0%)',
        aturanBaru: 'Wajib pungut PPN Besaran Tertentu 1,1% x harga jual agunan',
      },
      {
        aspek: 'Kredit Pajak Masukan Kreditur vs Pembeli',
        aturanLama: 'Tidak ada faktur AYDA',
        aturanBaru: 'Kreditur tidak dapat kredit PM; Pembeli PKP DAPAT kredit 1,1%',
      },
    ],
  },
  caseExample: {
    title: 'Bank menjual/melelang ruko AYDA kepada pembeli seharga Rp 2 miliar',
    scenario:
      'Bank menjual aset ruko AYDA hasil eksekusi kredit macet seharga Rp 2.000.000.000 (belum termasuk PPN). Bank wajib memungut PPN Besaran Tertentu 1,1% = Rp 22.000.000 menggunakan dokumen dipersamakan Faktur Pajak Kode 050.',
    presetRegime: 'ppn_pmk41_2023_ayda',
    presetInput: {
      ppn: {
        hargaJualDpp: 2000000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaAyda: 'jual_ayda_pembeli',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk41_2023AydaRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaAyda ?? 'jual_ayda_pembeli';
    const isJual = skema === 'jual_ayda_pembeli';

    const effRate = isJual ? 1.1 : 0;
    const hargaJual = isJual && input.termasukPpn ? Math.round((raw * 100) / 101.1) : raw;
    const ppnAyda = isJual ? Math.round(hargaJual * 0.011) : 0;
    const ppnUmumPembanding = isJual ? Math.round(hargaJual * 0.11) : 0;
    const selisihKeringanan = Math.max(0, ppnUmumPembanding - ppnAyda);

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual / lelang / pelunasan agunan AYDA (sebelum PPN)',
        value: hargaJual,
      },
      {
        label: isJual
          ? 'Besaran Tertentu PPN AYDA (10% x 11/12 x 12% = 1,1%)'
          : 'Status tahap pengambilalihan agunan dari debitur (0%)',
        value: effRate,
        format: 'percent',
      },
      {
        label: isJual ? 'PPN AYDA Wajib Dipungut Kreditur (Kode 050)' : 'PPN Dipungut Kreditur (Belum Penyerahan Akhir)',
        formula: isJual ? `1,1% x ${formatRupiah(hargaJual)}` : 'Belum terutang hingga diserahkan ke pembeli',
        value: ppnAyda,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isJual) {
      notes.push(
        `Sesuai PMK 41/2023 jo. PMK 11/2025, kreditur memungut PPN Besaran Tertentu ${formatPersen(effRate)} sebesar ${formatRupiah(ppnAyda)} dari pembeli (jauh lebih ringan dibanding tarif normal 11%, hemat ${formatRupiah(selisihKeringanan)}).`
      );
      notes.push(
        'Kreditur menerbitkan tagihan/dokumen dipersamakan Faktur Pajak saat menerima pembayaran/pelunasan (saat lain). Pajak Masukan terkait AYDA tidak dapat dikreditkan oleh kreditur, tetapi pembeli PKP dapat mengkreditkannya sepanjang memenuhi syarat umum.'
      );
    } else {
      notes.push(
        'Pengambilalihan agunan dari debitur kepada kreditur dalam rangka penyelesaian kredit belum memicu pemungutan PPN AYDA oleh bank hingga agunan tersebut dijual/diserahkan kepada pembeli akhir.'
      );
    }

    return {
      regime,
      primaryTaxLabel: isJual ? 'PPN AYDA Besaran Tertentu (1,1%)' : 'PPN Saat Pengambilalihan Internal',
      primaryTaxAmount: ppnAyda,
      annualTaxLabel: isJual ? 'Keringanan PPN vs Tarif Umum 11%' : 'Estimasi PPN 1,1% Saat Dijual Nanti',
      annualTaxAmount: isJual ? selisihKeringanan : Math.round(hargaJual * 0.011),
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Pelunasan Dibayar Pembeli Agunan',
      takeHomeOrNetAmount: hargaJual + ppnAyda,
      steps,
      notes,
    };
  },
};
