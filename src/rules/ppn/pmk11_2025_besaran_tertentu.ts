import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_11_2025, SRC.PMK_131_2024, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'ppn_besaran_tertentu_pmk11_2025',
  taxType: 'ppn',
  name: 'PMK 11/2025 (PPN Besaran Tertentu & KMS: 1,1% & 2,2%)',
  shortName: '2025–Kini (Besaran Tertentu & KMS)',
  legalBasis: 'PMK Nomor 11 Tahun 2025 jo. Pasal 9A UU PPN (UU HPP)',
  effectivePeriod: '4 Februari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — KMS (2,2%), kurir, biro wisata, kendaraan bekas (1,1%)',
  summary:
    'Penyesuaian resmi Nilai Lain sebagai DPP dan Besaran Tertentu PPN untuk mengintegrasikan faktor 11/12 agar tarif efektif tidak naik di 2025: Kegiatan Membangun Sendiri (KMS) = 20% x 11/12 x 12% = 2,2%; jasa pengiriman paket, biro perjalanan wisata, kendaraan bekas, freight forwarding & agen asuransi = 10% x 11/12 x 12% = 1,1% (Pajak Masukan tidak dapat dikreditkan).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk11-2025-besaran-tertentu',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PMK 11 Tahun 2025: PPN Besaran Tertentu (1,1%) dan Kegiatan Membangun Sendiri (2,2%)',
  legalBasis: 'PMK Nomor 11 Tahun 2025 jo. PMK Nomor 131 Tahun 2024',
  effectiveDate: '4 Februari 2025 (Diterapkan Berlaku sejak 1 Januari 2025)',
  readMinutes: 5,
  summary:
    'Pasca PMK 131/2024 menaikkan tarif ke 12% dengan DPP 11/12, PMK Nomor 11 Tahun 2025 menyesuaikan seluruh PPN Besaran Tertentu dan Nilai Lain sektor khusus agar beban efektifnya tetap tepat 1,1% dan 2,2% tanpa melonjak ke 1,2% / 2,4%.',
  sections: [
    {
      heading: 'Mengapa PMK 11/2025 dibutuhkan mendampingi PMK 131/2024?',
      paragraphs: [
        'Dalam UU HPP Pasal 9A dan PMK sebelumnya (seperti PMK 61/2022 untuk KMS dan PMK 71/2022 untuk jasa tertentu), rumus PPN dipatok memakai persentase dari tarif Pasal 7 ayat (1) — misalnya 20% × tarif untuk Kegiatan Membangun Sendiri (KMS) dan 10% × tarif untuk jasa pengiriman paket atau biro perjalanan wisata.',
        'Jika aturan lama tidak disesuaikan saat tarif UU naik ke 12%, maka KMS akan otomatis melonjak menjadi 20% × 12% = 2,4% dan jasa pengiriman paket menjadi 10% × 12% = 1,2%. Oleh sebab itu PMK Nomor 11 Tahun 2025 menyisipkan pengali 11/12 di dalam rumusnya: KMS = 20% × (11/12) × 12% = 2,2% dari total biaya bangun (untuk luas >= 200 m2), sedangkan jasa pengiriman paket, biro wisata, penjualan kendaraan bermotor bekas, dan freight forwarding = 10% × (11/12) × 12% = 1,1%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 2022 (Tarif PPN 11%)',
    newHeader: 'PMK Nomor 11 Tahun 2025 (Tarif 12% × DPP 11/12)',
    rows: [
      {
        aspek: 'Kegiatan Membangun Sendiri (KMS, luas >= 200 m2)',
        aturanLama: '20% × 11% = 2,2% dari total biaya',
        aturanBaru: '20% × 11/12 × 12% = 2,2% dari jumlah biaya bulanan (non-tanah)',
      },
      {
        aspek: 'Pengiriman paket, biro perjalanan, kendaraan bekas, freight forwarding',
        aturanLama: '10% × 11% = 1,1% dari nilai tagihan/penyerahan',
        aturanBaru: '10% × 11/12 × 12% = 1,1% (Pajak Masukan tidak dikreditkan)',
      },
    ],
  },
  caseExample: {
    title: 'Biaya pembangunan rumah pribadi sendiri Rp 500 juta (>= 200 m2) kena KMS 2,2%',
    scenario:
      'Wajib Pajak membangun sendiri rumah tinggal luas 240 m2 di luar kawasan kontraktor PKP dengan total biaya material dan upah Rp 500.000.000 (tidak termasuk harga tanah). PPN KMS PMK 11/2025 = 2,2% × Rp 500 juta = Rp 11.000.000.',
    presetRegime: 'ppn_besaran_tertentu_pmk11_2025',
    presetInput: {
      ppn: {
        hargaJualDpp: 500000000,
        goodsType: 'umum',
        termasukPpn: false,
        besaranTertentuType: 'kms_2_2',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk11_2025BesaranTertentuRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const rawNominal = Math.max(0, input.hargaJualDpp);
    const tipe = input.besaranTertentuType ?? 'kms_2_2';
    const isKms = tipe === 'kms_2_2';
    const effRate = isKms ? 2.2 : 1.1;

    const dpp = input.termasukPpn ? Math.round(rawNominal / (1 + effRate / 100)) : rawNominal;
    const ppn = Math.round((dpp * effRate) / 100);
    const total = dpp + ppn;

    const sectorLabels: Record<NonNullable<TaxCalculatorInput['ppn']['besaranTertentuType']>, string> = {
      kms_2_2: 'Kegiatan Membangun Sendiri (KMS) >= 200 m2 (20% x 11/12 x 12% = 2,2%)',
      paket_wisata_1_1: 'Biro Perjalanan Wisata / Penginapan Paket (10% x 11/12 x 12% = 1,1%)',
      pengiriman_paket_1_1: 'Jasa Pengiriman Paket Pos/Kurir (10% x 11/12 x 12% = 1,1%)',
      kendaraan_bekas_1_1: 'Penyerahan Kendaraan Bermotor Bekas (10% x 11/12 x 12% = 1,1%)',
      freight_forwarding_1_1: 'Jasa Pengurusan Transportasi / Freight Forwarding (10% x 11/12 x 12% = 1,1%)',
      agen_asuransi_1_1: 'Komisi Agen Asuransi (10% x 11/12 x 12% = 1,1%)',
    };

    const steps: CalculationStep[] = [
      { label: isKms ? 'Total biaya bangun non-tanah (KMS)' : 'Dasar Pengenaan / Harga Penyerahan', value: dpp },
      { label: 'Skema Besaran Tertentu PMK 11/2025', formula: sectorLabels[tipe], value: effRate, format: 'percent' },
      {
        label: 'PPN Besaran Tertentu dipungut / disetor',
        formula: `${formatRupiah(dpp)} x ${formatPersen(effRate)}`,
        value: ppn,
        isHighlight: true,
      },
      { label: 'Total biaya / nilai tagihan akhir', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: `PPN Besaran Tertentu (${formatPersen(effRate)})`,
      primaryTaxAmount: ppn,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: isKms ? 'Total Pengeluaran + PPN KMS' : 'Total Tagihan Termasuk PPN',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        isKms
          ? 'PPN KMS disetor sendiri paling lambat tanggal 15 bulan berikutnya setelah bulan biaya dikeluarkan apabila luas bangunan yang dibangun sendiri >= 200 m2.'
          : 'Berdasarkan Pasal 9A UU PPN jo. PMK 11/2025, PKP yang memungut PPN Besaran Tertentu (1,1%) tidak dapat mengkreditkan Pajak Masukan atas perolehan BKP/JKP terkait penyerahan tersebut.',
      ],
    };
  },
};
