import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_40_2021, SRC.PMK_120_2019, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pp40_2021_kek_refund',
  taxType: 'ppn',
  name: 'PP 40/2021 (Fasilitas PPN KEK) & PMK 120/2019 (VAT Refund Turis Asing)',
  shortName: '2019–Kini (KEK PP 40/2021 & VAT Refund)',
  legalBasis: 'PP Nomor 40 Tahun 2021 (KEK) & PMK Nomor 120/PMK.03/2019 (VAT Refund)',
  effectivePeriod: '2 Februari 2021 (KEK) & 1 Oktober 2019 (VAT Refund) – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PPN Tidak Dipungut KEK (0%) & Restitusi PPN Turis Asing (min. Rp 500 rb)',
  summary:
    'Mengatur dua fasilitas khusus lintas batas kepabeanan dan pariwisata: (1) PPN/PPnBM Tidak Dipungut (0%, Kode Faktur 07) atas pemasukan BKP ke Kawasan Ekonomi Khusus (KEK) dalam PP 40/2021; serta (2) Pengembalian PPN kepada pemegang paspor luar negeri (VAT Refund Turis Asing) dalam PMK 120/2019 dengan syarat nilai PPN minimal Rp 500.000.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pp40-2021-kek-refund',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Tidak Dipungut Kawasan Ekonomi Khusus (PP 40/2021) & VAT Refund Turis Asing (PMK 120/2019)',
  legalBasis: 'PP Nomor 40 Tahun 2021 & PMK Nomor 120/PMK.03/2019',
  effectiveDate: '1 Oktober 2019 (PMK 120/2019) & 2 Februari 2021 (PP 40/2021)',
  readMinutes: 5,
  summary:
    'Membedah skema PPN Tidak Dipungut pada pemasukan bahan baku/barang modal ke KEK serta tata cara klaim pengembalian PPN belanja ritel wisatawan asing di bandara.',
  sections: [
    {
      heading: 'Fasilitas KEK (PP 40/2021): PPN Tidak Dipungut vs Kawasan Bebas',
      paragraphs: [
        'Berdasarkan PP Nomor 40 Tahun 2021 tentang Penyelenggaraan Kawasan Ekonomi Khusus, penyerahan atau pemasukan barang modal, bahan baku, dan BKP tertentu dari Tempat Lain Dalam Daerah Pabean (TLDDP) maupun luar daerah pabean ke Badan Usaha / Pelaku Usaha di dalam KEK memperoleh fasilitas PPN dan PPnBM Tidak Dipungut (Kode Faktur 07).',
        'Keuntungan utama fasilitas Tidak Dipungut dibandingkan Dibebaskan adalah PKP pemasok dari luar KEK tetap dapat mengkreditkan Pajak Masukan terkait barang yang dipasok ke dalam KEK.',
      ],
    },
    {
      heading: 'VAT Refund Wisatawan Asing (PMK 120/PMK.03/2019): ambang PPN minimal Rp 500.000',
      paragraphs: [
        'Melalui PMK 120/PMK.03/2019, wisatawan asing pemegang paspor luar negeri yang berbelanja di toko ritel berlogo Tax Free (PKP Toko Retail peserta VAT Refund) berhak meminta kembali PPN yang telah dibayarnya saat meninggalkan Indonesia melalui konter bandara internasional.',
        'Syarat minimalnya dipermudah menjadi akumulasi nilai PPN paling sedikit Rp 500.000 (sebelumnya hanya dalam 1 faktur) yang dapat digabung dari beberapa struk belanja dalam kurun waktu maksimal 1 bulan sebelum tanggal keberangkatan. Pengembalian di bawah atau sama dengan Rp 5.000.000 dapat dibayar tunai (cash), sedangkan di atas Rp 5.000.000 dilakukan melalui transfer rekening.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 76/PMK.03/2010 (VAT Refund Lama)',
    newHeader: 'PMK 120/PMK.03/2019 & PP 40/2021 (Kini)',
    rows: [
      {
        aspek: 'Syarat minimum PPN turis asing',
        aturanLama: 'Min. Rp 500.000 dalam 1 faktur pada 1 hari yang sama',
        aturanBaru: 'Min. Rp 500.000 secara akumulatif dari berbagai struk (maks. 1 bulan sebelum pulang)',
      },
      {
        aspek: 'Fasilitas Pemasukan ke Kawasan Ekonomi Khusus',
        aturanLama: 'Tersebar per PP KEK wilayah',
        aturanBaru: 'Terkonsolidasi di PP 40/2021: PPN Tidak Dipungut (Kode 07)',
      },
    ],
  },
  caseExample: {
    title: 'Klaim VAT Refund belanja wisatawan asing Rp 10 juta (PMK 120/2019)',
    scenario:
      'Turis asing berbelanja barang kena pajak ritel di Indonesia dengan DPP Rp 10.000.000 (membayar PPN efektif 11% = Rp 1.100.000). Karena >= Rp 500.000 dan <= Rp 5.000.000, seluruh Rp 1.100.000 dapat di-refund secara tunai di bandara.',
    presetRegime: 'ppn_pp40_2021_kek_refund',
    presetInput: {
      ppn: {
        hargaJualDpp: 10000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaKekRefund: 'vat_refund_turis_pmk120',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPp40_2021KekRefundRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaKekRefund ?? 'kek_tidak_dipungut_pp40';

    if (skema === 'kek_tidak_dipungut_pp40') {
      const ppnNormal = Math.round(raw * 0.11);
      const steps: CalculationStep[] = [
        { label: 'Nilai barang/jasa pemasukan ke KEK (DPP)', value: raw },
        { label: 'PPN terutang normal sebelum fasilitas KEK (11% efektif)', value: ppnNormal },
        { label: 'Fasilitas PPN Tidak Dipungut KEK (PP 40/2021 — Kode Faktur 07)', value: -ppnNormal, isNegative: true },
        { label: 'PPN yang wajib dibayar oleh pelaku usaha KEK', value: 0, isHighlight: true },
      ];
      return {
        regime,
        primaryTaxLabel: 'PPN Dibayar di KEK (Tidak Dipungut)',
        primaryTaxAmount: 0,
        annualTaxLabel: 'Nilai PPN Tidak Dipungut (Kode 07)',
        annualTaxAmount: ppnNormal,
        effectiveRatePercent: 0,
        takeHomeOrNetLabel: 'Total Nilai Pemasukan KEK',
        takeHomeOrNetAmount: raw,
        steps,
        notes: [
          'Sesuai PP 40/2021, PPN Tidak Dipungut menggunakan Kode Faktur 07 dan PKP penjual tetap berhak mengkreditkan Pajak Masukan.',
          'Jika barang dari KEK dikeluarkan kembali ke tempat lain dalam daerah pabean (TLDDP), PPN wajib dilunasi saat pengeluaran.',
        ],
      };
    }

    const dpp = input.termasukPpn ? Math.round(raw / 1.11) : raw;
    const ppnDibayar = Math.round(dpp * 0.11);
    const eligible = ppnDibayar >= 500000;
    const refundAmount = eligible ? ppnDibayar : 0;
    const payoutMethod =
      !eligible
        ? 'Tidak memenuhi syarat min. PPN Rp 500.000'
        : refundAmount <= 5000000
        ? 'Refund Tunai (<= Rp 5 juta) atau Transfer di Bandara'
        : 'Wajib via Transfer Rekening Bank (> Rp 5 juta)';

    const steps: CalculationStep[] = [
      { label: 'Total nilai belanja DPP di Toko Retail VAT Refund', value: dpp },
      { label: 'PPN efektif yang tercantum di Faktur Khusus (11%)', value: ppnDibayar },
      { label: 'Ambang minimum klaim VAT Refund (PMK 120/2019)', value: 500000 },
      {
        label: 'PPN yang dikembalikan kepada turis asing',
        formula: eligible ? payoutMethod : 'Belum mencapai PPN Rp 500.000',
        value: refundAmount,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: eligible ? 'PPN Dapat Di-Refund (PMK 120/2019)' : 'PPN Tidak Memenuhi Syarat Refund',
      primaryTaxAmount: refundAmount,
      effectiveRatePercent: eligible ? 11 : 0,
      takeHomeOrNetLabel: 'Biaya Belanja Netto Setelah Refund',
      takeHomeOrNetAmount: dpp + ppnDibayar - refundAmount,
      steps,
      notes: [
        eligible
          ? `Metode pencairan PMK 120/2019: ${payoutMethod}. Barang bawaan wajib diperlihatkan secara fisik bersama paspor dan boarding pass di konter DJP Bandara.`
          : `Nilai PPN sebesar ${formatRupiah(ppnDibayar)} belum memenuhi ambang minimum Rp 500.000 (akumulasi struk maksimal 1 bulan sebelum keberangkatan).`,
        `Tarif acuan ritel ${formatPersen(11)} efektif (12% x DPP 11/12).`,
      ],
    };
  },
};
