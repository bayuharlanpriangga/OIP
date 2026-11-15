import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_85_2015, SRC.PP_32_2009, SRC.PMK_131_2018, SRC.PMK_65_2021];

const regime: TaxRegime = {
  id: 'ppn_pp85_2015_kawasan_berikat',
  taxType: 'ppn',
  name: 'PP 85/2015 jo. PMK 131/2018 stdd PMK 65/2021 (Kawasan Berikat / TPB: Kode 07 & Kuota TLDDP 50%)',
  shortName: '2015–Sekarang (Kawasan Berikat / TPB)',
  legalBasis: 'PP 32/2009 stdd PP 85/2015 jo. PMK 131/PMK.04/2018 stdd PMK 65/PMK.04/2021',
  effectivePeriod: '25 November 2015 – Sekarang (Pelaksana PMK 65/2021: Juli 2021)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PPN Tidak Dipungut (0%) pemasukan bahan baku & kuota TLDDP 50%',
  summary:
    'Pemasukan barang modal, bahan baku, bahan penolong, dan pengemas dari luar negeri maupun dalam negeri ke Pengusaha Kawasan Berikat (Tempat Penimbunan Berikat/TPB) memperoleh fasilitas PPN/PPnBM Tidak Dipungut (Kode Faktur 07). Sebaliknya, pengeluaran barang jadi ke pasar domestik (TLDDP) dikenai PPN normal 11% dan dibatasi kuota maksimal 50% dari nilai realisasi ekspor & penjualan antar-kawasan tahun sebelumnya.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pp85-2015-kawasan-berikat',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Kawasan Berikat / Tempat Penimbunan Berikat: Kode 07 Tidak Dipungut & Kuota TLDDP 50%',
  legalBasis: 'PP Nomor 85 Tahun 2015 & PMK 131/PMK.04/2018 stdd PMK 65/PMK.04/2021',
  effectiveDate: '25 November 2015 (Perubahan PMK 65/2021: 12 Juni 2021)',
  readMinutes: 5,
  summary:
    'Membedah skema PPN Tidak Dipungut (Kode 07) saat bahan baku/mesin masuk ke Kawasan Berikat serta aturan pemungutan PPN dan batasan kuota 50% saat menjual ke pasar lokal (TLDDP).',
  sections: [
    {
      heading: 'Pemasukan Bahan Baku & Mesin ke Kawasan Berikat: Tidak Dipungut (Kode 07)',
      paragraphs: [
        'Berdasarkan PP Nomor 32 Tahun 2009 stdd PP Nomor 85 Tahun 2015 jo. Pasal 20 PMK 131/PMK.04/2018, pemasukan barang asal impor maupun dari Tempat Lain Dalam Daerah Pabean (TLDDP) ke Pengusaha Kawasan Berikat (PKB/PDKB) untuk diolah atau menunjang produksi ekspor mendapat fasilitas PPN dan/atau PPnBM Tidak Dipungut (Kode Faktur Pajak 07).',
        'Pemasok lokal yang menerbitkan Faktur Pajak Kode 07 kepada Kawasan Berikat tetap berhak penuh mengkreditkan Pajak Masukan terkait pembelian bahan bakunya (berbeda dengan fasilitas Dibebaskan Kode 08 yang melarang pengkreditan Pajak Masukan).',
      ],
    },
    {
      heading: 'Penjualan ke Pasar Lokal (TLDDP): Terutang PPN 11% & Batas Kuota Maks 50%',
      paragraphs: [
        'Sesuai Pasal 31 PMK 131/PMK.04/2018 stdd PMK 65/PMK.04/2021, Pengusaha Kawasan Berikat dapat mengeluarkan hasil produksi ke TLDDP (pasar domestik) paling banyak 50% dari penjumlahan nilai realisasi tahun sebelumnya atas ekspor, penjualan ke Kawasan Berikat lain, Kawasan Bebas (FTZ), dan KEK.',
        'Atas pengeluaran ke TLDDP tersebut wajib dilunasi Bea Masuk dan PPN terutang (efektif 11% di bawah UU HPP jo. PMK 131/2024). Jika pengeluaran ke TLDDP melebihi kuota 50% tanpa persetujuan Kepala Kanwil/KPU DJBC atas rekomendasi Kemenperin, perusahaan dikenai sanksi pengurangan kuota penjualan domestik periode berikutnya hingga pembekuan izin Kawasan Berikat maksimal 3 bulan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pemasukan Bahan Baku/Mesin ke Kawasan Berikat',
    newHeader: 'Pengeluaran Hasil Produksi ke TLDDP (Pasar Lokal)',
    rows: [
      {
        aspek: 'Perlakuan PPN & Kode Faktur',
        aturanLama: 'PPN Tidak Dipungut (0% — Kode Faktur 07; PM pemasok tetap dikreditkan)',
        aturanBaru: 'Terutang PPN Normal 11% efektif + Bea Masuk sesuai tarif',
      },
      {
        aspek: 'Batasan Kuota (Pasal 31 PMK 131/2018 jo. PMK 65/2021)',
        aturanLama: 'Tidak ada batas kuota pemasukan selama terkait izin KB',
        aturanBaru: 'Maksimal 50% dari realisasi ekspor & penjualan antar-kawasan tahun lalu',
      },
    ],
  },
  caseExample: {
    title: 'Pemasukan bahan baku lokal Rp 2 miliar ke pabrik garmen Kawasan Berikat',
    scenario:
      'Pabrik garmen berstatus PDKB di Kawasan Berikat membeli kain lokal Rp 2.000.000.000 dari pemasok PKP di Bandung dengan BC 4.0 dan Faktur Pajak Kode 07. PPN 11% sebesar Rp 220.000.000 mendapat fasilitas Tidak Dipungut (Rp 0 dibayar pembeli) sementara pemasok tetap dapat mengkreditkan Pajak Masukan.',
    presetRegime: 'ppn_pp85_2015_kawasan_berikat',
    presetInput: {
      ppn: {
        hargaJualDpp: 2000000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaKawasanBerikat: 'pemasukan_bahan_baku',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPp85_2015KawasanBerikatRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaKawasanBerikat ?? 'pemasukan_bahan_baku';
    const ppnStandar = Math.round(nilai * 0.11);

    if (skema === 'pemasukan_bahan_baku') {
      const steps: CalculationStep[] = [
        { label: 'Nilai barang modal / bahan baku pemasukan ke Kawasan Berikat', value: nilai },
        { label: 'PPN normal sebelum fasilitas TPB (11% efektif)', value: ppnStandar },
        { label: 'Fasilitas PPN Tidak Dipungut (PP 85/2015 — Kode Faktur 07 & BC 4.0/2.3)', value: -ppnStandar, isNegative: true },
        { label: 'PPN yang wajib dibayar oleh Kawasan Berikat', value: 0, isHighlight: true },
      ];
      return {
        regime,
        primaryTaxLabel: 'PPN Pemasukan Kawasan Berikat (Kode 07)',
        primaryTaxAmount: 0,
        annualTaxLabel: 'Nilai Fasilitas PPN Tidak Dipungut',
        annualTaxAmount: ppnStandar,
        effectiveRatePercent: 0,
        takeHomeOrNetLabel: 'Total Nilai Pemasukan (Tanpa Beban PPN)',
        takeHomeOrNetAmount: nilai,
        steps,
        notes: [
          `Pemasukan ke Kawasan Berikat menggunakan dokumen pabean BC 4.0 (lokal) atau BC 2.3 (impor) dan Faktur Pajak Kode 07 sehingga PPN ${formatRupiah(ppnStandar)} Tidak Dipungut (Rp 0).`,
          'Pemasok dalam negeri tetap berhak penuh mengkreditkan Pajak Masukan atas barang yang diserahkan ke Kawasan Berikat.',
        ],
      };
    }

    const isOverQuota = skema === 'penjualan_tlldp_lebih_kuota';
    const steps: CalculationStep[] = [
      { label: 'Nilai penyerahan hasil produksi Kawasan Berikat ke TLDDP', value: nilai },
      {
        label: 'Status kuota TLDDP (maks 50% realisasi tahun sebelumnya)',
        value: isOverQuota ? 0 : 1,
        format: 'text',
        displayValue: isOverQuota ? 'Melebihi 50% (Perlu Izin/Sanksi)' : 'Dalam Kuota <= 50%',
      },
      { label: 'PPN wajib dipungut / dilunasi (11% efektif — PMK 131/2024)', value: ppnStandar, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Pengeluaran ke TLDDP (11%)',
      primaryTaxAmount: ppnStandar,
      annualTaxLabel: 'Total Tagihan Termasuk PPN',
      annualTaxAmount: nilai + ppnStandar,
      effectiveRatePercent: nilai > 0 ? (ppnStandar / nilai) * 100 : 0,
      takeHomeOrNetLabel: 'Status Kepatuhan Kuota 50% TLDDP',
      takeHomeOrNetAmount: 0,
      takeHomeOrNetDisplay: isOverQuota ? 'Risiko Sanksi Kuota / Beku 3 Bln' : 'Patuh Kuota <= 50%',
      steps,
      notes: [
        isOverQuota
          ? `Peringatan Pasal 31 PMK 131/2018 jo. PMK 65/2021: Pengeluaran ke TLDDP melebihi 50% realisasi ekspor/antar-kawasan tahun lalu wajib memperoleh persetujuan Kanwil/KPU DJBC atas rekomendasi Kemenperin; jika tanpa izin, dikenai sanksi pengurangan kuota tahun berikutnya hingga pembekuan izin maks 3 bulan.`
          : `Penjualan ke pasar domestik (TLDDP) dalam batas kuota <= 50% wajib memungut PPN normal ${formatPersen(11)} sebesar ${formatRupiah(ppnStandar)} dan melunasi Bea Masuk dengan dokumen BC 2.5.`,
      ],
    };
  },
};
