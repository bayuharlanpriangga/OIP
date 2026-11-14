import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_58_2022, SRC.PMK_59_2022, SRC.PMK_51_2025];

const regime: TaxRegime = {
  id: 'pph22_pmk58_2022_sipp',
  taxType: 'pph22',
  name: 'PMK 58/PMK.03/2022 (Pengadaan Pemerintah via Marketplace / SIPP)',
  shortName: '2022–Kini (Belanja Pemerintah SIPP 0,5%)',
  legalBasis: 'PMK Nomor 58/PMK.03/2022 Pasal 4–7 & PMK Nomor 59/PMK.03/2022',
  effectivePeriod: '1 Mei 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengadaan instansi pemerintah via SIPP',
  summary:
    'Penunjukan Pihak Lain (penyelenggara marketplace pengadaan pemerintah seperti Bela Pengadaan / e-Katalog / SIPP) sebagai pemungut PPh Pasal 22 sebesar 0,5% dari seluruh nilai transaksi di luar PPN & PPnBM, tidak final (dapat dikreditkan).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk58-2022-sipp',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Pemungutan PPh 22 0,5% atas Belanja Pemerintah lewat Marketplace SIPP (PMK 58/2022)',
  legalBasis: 'PMK Nomor 58/PMK.03/2022',
  effectiveDate: '1 Mei 2022',
  readMinutes: 4,
  summary:
    'Menghapus beban administrasi bendahara pemerintah: sejak 1 Mei 2022, belanja pemerintah melalui Sistem Informasi Pengadaan (SIPP) dipungut PPh Pasal 22 sebesar 0,5% secara otomatis oleh pihak marketplace pengadaan.',
  sections: [
    {
      heading: 'Menggeser pungutan 1,5% bendahara menjadi 0,5% oleh Pihak Lain SIPP',
      paragraphs: [
        'Sebelum PMK 58/PMK.03/2022 berlaku, setiap pengadaan barang oleh instansi pemerintah di atas Rp 2.000.000 harus dipotong langsung oleh Bendahara Pengeluaran sebesar 1,5% PPh Pasal 22 (atau PPh 23 sebesar 2% untuk jasa), yang sering menimbulkan kesalahan setor pada transaksi daring.',
        'Melalui PMK 58/PMK.03/2022, penyedia marketplace yang tergabung dalam Sistem Informasi Pengadaan Pemerintah (SIPP LKPP) ditunjuk menjadi Pihak Lain pemungut PPh Pasal 22 tunggal dengan tarif 0,5% untuk seluruh pengadaan barang maupun jasa kepada instansi pemerintah, tanpa batasan minimum transaksi Rp 2 juta.',
      ],
    },
    {
      heading: 'Sifat kredit pajak dan hubungan dengan PPh Final UMKM 0,5%',
      paragraphs: [
        'Sesuai Pasal 7 PMK 58/PMK.03/2022, PPh Pasal 22 sebesar 0,5% yang dipungut oleh Pihak Lain SIPP bukan pajak final murni, melainkan kredit pajak yang dapat diperhitungkan dengan PPh terutang dalam SPT Tahunan — atau diperhitungkan sebagai pelunasan PPh Final 0,5% bagi WP UMKM PP 55/2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Belanja Pemerintah Langsung oleh Bendahara (PMK 59/2022)',
    newHeader: 'Belanja Pemerintah via Marketplace SIPP (PMK 58/2022)',
    rows: [
      {
        aspek: 'Pemungut pajak transaksi',
        aturanLama: 'Bendahara Instansi Pemerintah (PMK 59/2022)',
        aturanBaru: 'Pihak Lain penyelenggara marketplace pengadaan (SIPP)',
      },
      {
        aspek: 'Tarif PPh Pasal 22',
        aturanLama: '1,5% (barang > Rp 2 jt) atau PPh 23 2% (jasa)',
        aturanBaru: '0,5% tunggal untuk pengadaan barang maupun jasa',
      },
      {
        aspek: 'Batas pengecualian transaksi',
        aturanLama: 'Dikecualikan s.d. Rp 2.000.000 (tidak dipecah)',
        aturanBaru: 'Tidak ada batas minimal (berlaku dari Rp 1)',
      },
    ],
  },
  caseExample: {
    title: 'Pengadaan ATK pemerintah melalui mitra e-marketplace SIPP senilai Rp 25 juta',
    scenario:
      'Dinas Daerah membeli perlengkapan kantor Rp 25.000.000 (di luar PPN) melalui toko daring terdaftar di Bela Pengadaan/SIPP LKPP.',
    presetRegime: 'pph22_pmk58_2022_sipp',
    presetInput: {
      pph22: {
        nilaiDasar: 25000000,
        objectType: 'bendahara_bumn',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk58_2022SippRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const rate = 0.5;
    const pph22 = Math.round((nilaiDasar * rate) / 100);
    const netReceived = Math.max(0, nilaiDasar - pph22);

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi pengadaan pemerintah via SIPP (di luar PPN/PPnBM)', value: nilaiDasar },
      {
        label: 'Tarif PPh Pasal 22 Pihak Lain SIPP (PMK 58/2022)',
        formula: 'Tarif tunggal 0,5% atas pengadaan barang/jasa di SIPP',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 dipungut Pihak Lain SIPP',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(rate)}`,
        value: pph22,
        isHighlight: true,
      },
      { label: 'Dana diterima rekanan penyedia (di luar PPN)', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 SIPP Dipungut',
      primaryTaxAmount: pph22,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima Rekanan',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'PPh 22 sebesar 0,5% atas transaksi SIPP dipungut oleh Pihak Lain (platform pengadaan) sehingga bendahara pemerintah tidak lagi memotong PPh 22 1,5% maupun PPh 23 2% secara terpisah.',
        'Bukti pungut berupa dokumen tagihan SIPP yang dipersamakan dengan bukti pemungutan PPh 22 dan dapat dikreditkan pada SPT Tahunan.',
      ],
    };
  },
};
