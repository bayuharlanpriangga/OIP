import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_DARURAT_19_1951, SRC.UU_8_1983];

const regime: TaxRegime = {
  id: 'ppn_uuppn_1951',
  taxType: 'ppn',
  name: 'UU Darurat Nomor 19 Tahun 1951 (Pajak Penjualan / PPn 1951 — Pra-PPN 1983)',
  shortName: '1951–1985 (Pajak Penjualan / PPn 1951)',
  legalBasis: 'UU Darurat Nomor 19 Tahun 1951 jo. UU Nomor 2 Tahun 1968 (Dicabut UU 8/1983)',
  effectivePeriod: '1 Oktober 1951 – 31 Maret 1985',
  isCurrent: false,
  summary:
    'Sistem Pajak Penjualan (PPn 1951) sebelum berlakunya UU PPN 1983: menggunakan sistem pajak berganda kumulatif (cascade/turnover tax) di setiap rantai penyerahan tanpa mekanisme pengkreditan Pajak Masukan dengan tarif umum 10% (dan 20% atas barang mewah, serta bervariasi 2,5%–20% menurut kelompok barang).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-uuppn-1951',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Pajak Penjualan (PPn 1951): Pajak Berganda Sebelum Sistem Pajak Pertambahan Nilai (1951–1985)',
  legalBasis: 'UU Darurat Nomor 19 Tahun 1951 (Dicabut per 1 April 1985 oleh UU 8/1983)',
  effectiveDate: '1 Oktober 1951 (Berakhir 31 Maret 1985)',
  readMinutes: 4,
  summary:
    'Mengapa Indonesia mereformasi total Pajak Penjualan 1951 menjadi Pajak Pertambahan Nilai (PPN) pada April 1985: penghapusan efek pajak berganda (cascading tax) pada harga barang.',
  sections: [
    {
      heading: 'Efek pajak berganda (Cascade Effect) dalam UU Darurat 19/1951',
      paragraphs: [
        'Sejak 1951 hingga 31 Maret 1985, pungutan atas konsumsi di Indonesia berbentuk Pajak Penjualan (PPn 1951) berdasarkan UU Darurat Nomor 19 Tahun 1951. Kelemahan utamanya adalah belum dikenalnya metode kredit pajak (Tax Credit Method): Pajak yang sudah dibayar pabrikan saat membeli bahan baku tidak bisa dikreditkan sehingga ikut masuk ke harga pokok dan dipajaki kembali di tingkat distributor maupun pabrikan hilir.',
        'Reformasi UU Nomor 8 Tahun 1983 (mulai berlaku 1 April 1985) mengganti PPn 1951 menjadi PPN yang hanya memajaki nilai tambah (Value Added) di tiap mata rantai dan mengizinkan pengkreditan penuh Pajak Masukan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU Darurat 19/1951 (PPn 1951)',
    newHeader: 'UU Nomor 8 Tahun 1983 (PPN Mulai Apr 1985)',
    rows: [
      {
        aspek: 'Mekanisme pengkreditan Pajak Masukan',
        aturanLama: 'Tidak dapat dikreditkan (pajak berganda / cascade pada harga)',
        aturanBaru: 'Indirect Subtraction / Credit Method (PK - PM)',
      },
      {
        aspek: 'Tarif umum & barang mewah',
        aturanLama: 'Berjenjang rumit (umum 5%–10%; mewah 20%)',
        aturanBaru: 'Tarif tunggal 10% + PPnBM terpisah',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan barang pabrik Rp 100 juta pada sistem PPn 1951 (10% cascade)',
    scenario:
      'Pabrikan menyerahkan barang hasil olahan Rp 100.000.000 pada era PPn 1951 dengan tarif umum 10% (tanpa pengkreditan PPn pembelian bahan baku).',
    presetRegime: 'ppn_uuppn_1951',
    presetInput: {
      ppn: {
        hargaJualDpp: 100000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnUuPpn1951Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const rate = input.goodsType === 'barang_mewah' ? 20 : 10;
    const dpp = input.termasukPpn ? Math.round(raw / (1 + rate / 100)) : raw;
    const tax = Math.round((dpp * rate) / 100);
    const total = dpp + tax;

    const steps: CalculationStep[] = [
      { label: 'Harga penyerahan pabrikan / impor (PPn 1951)', value: dpp },
      {
        label: 'Tarif Pajak Penjualan (UU Darurat 19/1951)',
        formula: input.goodsType === 'barang_mewah' ? 'Kelompok Barang Mewah PPn 1951 (20%)' : 'Tarif Umum PPn 1951 (10%)',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPn 1951 terutang (tanpa kredit Pajak Masukan)',
        formula: `${formatRupiah(dpp)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Harga jual termasuk Pajak Penjualan 1951', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Penjualan (PPn 1951) Terutang',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Harga Setelah PPn 1951',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        'Pada era PPn 1951 (1951–Maret 1985), pajak atas pembelian bahan baku menjadi beban biaya (tidak ada Pajak Masukan yang dikreditkan), menciptakan pajak berganda sebelum hadirnya UU PPN 1983.',
      ],
    };
  },
};
