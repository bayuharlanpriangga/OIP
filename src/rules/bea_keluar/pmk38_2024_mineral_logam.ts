import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_mineral_2024',
  taxType: 'bea_keluar',
  name: 'Hasil Pengolahan Mineral Logam (PMK 38/2024) & Status Batubara',
  shortName: '2024–Kini (Mineral Logam)',
  legalBasis:
    'Lampiran Huruf D & E PMK Nomor 38 Tahun 2024, PMK Nomor 68 Tahun 2025 & KMK Nomor 31/MK/BC/2026',
  effectivePeriod: '3 Juni 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (PMK 38/2024)',
  summary:
    'PMK Nomor 38 Tahun 2024 menyederhanakan tarif Bea Keluar produk hasil pengolahan mineral logam dengan memutus ketergantungan progres fisik smelter: Konsentrat Tembaga (>= 15% Cu) 7,5%, Besi Laterit (>= 50% Fe, >= 10% Al2O3+SiO2) 5%, Timbal (>= 56% Pb) 5%, & Seng (>= 51% Zn) 5%. Batubara bukan objek BK PMK 38/2024.',
  sources: [
    SRC.PMK_38_2024,
    SRC.PMK_71_2023,
    SRC.KMK_31_MK_BC_2026,
    SRC.PMK_106_2022_BK,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-mineral-logam-pmk38-2024',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Bea Keluar Konsentrat Mineral Logam (PMK 38/2024) & Posisi Regulasi Batubara 2026',
  legalBasis:
    'Lampiran Huruf D & E PMK Nomor 38 Tahun 2024 jo. KMK Nomor 31/MK/BC/2026 (Pengawasan Ekspor Batubara)',
  effectiveDate: '3 Juni 2024 (Pengawasan Batubara KMK 31/MK/BC/2026 Juni 2026)',
  readMinutes: 6,
  summary:
    'PMK 38 Tahun 2024 mencabut skema progres fisik smelter 3 tahap (PMK 71/2023) dan menetapkan tarif ad valorem tunggal per jenis konsentrat mineral logam bagi pemegang izin relaksasi ekspor. Sementara itu, komoditas batubara dikenai PNBP Royalti ESDM serta pengawasan larangan/pembatasan (lartas) ekspor KMK 31/MK/BC/2026.',
  sections: [
    {
      heading: 'Tarif ad valorem tetap 7,5% dan 5% pasca-dicabutnya skema tahapan progres smelter',
      paragraphs: [
        'Pada masa transisi 2023–Mei 2024 (PMK 71 Tahun 2023), eksportir konsentrat mineral dikenai tarif berjenjang 5%–15% berdasarkan progres pembangunan fisik smelter (50%–<70%, 70%–<90%, 90%–100%). Mulai 3 Juni 2024, PMK Nomor 38 Tahun 2024 menyederhanakan skema tersebut menjadi tarif tunggal per kelompok kadar: Konsentrat Tembaga dengan kadar >= 15% Cu (ex 2603.00.00) sebesar 7,5%, Konsentrat Besi Laterit (>= 50% Fe & >= 10% Al2O3+SiO2) sebesar 5%, Konsentrat Timbal (>= 56% Pb) sebesar 5%, dan Konsentrat Seng (>= 51% Zn) sebesar 5%.',
        'Kebijakan ini memberikan kepastian tarif bagi proyek pemurnian yang memasuki tahap komisioning dan relaksasi ekspor bersyarat (termasuk evaluasi izin ekspor oleh Kementerian ESDM dan Kementerian Perdagangan). Untuk bijih mentah (raw ore) tetap tunduk pada kebijakan larangan ekspor UU Minerba.',
      ],
    },
    {
      heading: 'Status regulasi ekspor Batubara (Royalti ESDM, KMK 31/MK/BC/2026 & wacana 2026)',
      paragraphs: [
        'Hingga pembaruan PMK 68 Tahun 2025, komoditas batubara (HS 2701) tidak termasuk objek yang dikenakan Bea Keluar di dalam PMK 38 Tahun 2024. Pungutan negara atas penjualan/ekspor batubara berbentuk PNBP Royalti / Iuran Produksi atau Dana Hasil Produksi Batubara (DHPB) di bawah Kementerian ESDM, serta PPh Pasal 22 ekspor minerba/batubara 1,5% berdasarkan PMK 51/2025.',
        'Meskipun pemerintah dan DPR menggodok rancangan perluasan basis Bea Keluar untuk komoditas batubara pada tahun 2026, hingga paruh pertama–November 2026 belum diterbitkan PMK definitif pengenaan tarif BK batubara; pengawasan ekspornya di lapangan diperketat lewat KMK Nomor 31/MK/BC/2026 (aturan pelaksana Permendag 15/2026 efektif 1 Juni 2026 yang menetapkan 16 golongan batubara sebagai barang dibatasi/diawasi DJBC).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 71 Tahun 2023 (17 Jul 2023 – 2 Jun 2024)',
    newHeader: 'PMK 38 Tahun 2024 (Berlaku Mulai 3 Jun 2024)',
    rows: [
      {
        aspek: 'Konsentrat Tembaga (>= 15% Cu)',
        aturanLama: '10% / 7,5% / 5% (2023) naik 15% / 10% / 7,5% (2024) per progres smelter',
        aturanBaru: 'Tarif tunggal 7,5% (tidak lagi berjenjang progres smelter)',
      },
      {
        aspek: 'Konsentrat Besi Laterit (>= 50% Fe), Timbal (>= 56% Pb), Seng (>= 51% Zn)',
        aturanLama: '5%–10% berjenjang progres fisik smelter',
        aturanBaru: 'Tarif tunggal 5% Ad Valorem',
      },
      {
        aspek: 'Komoditas Batubara (HS 2701)',
        aturanLama: 'Bukan objek Bea Keluar (tunduk pada PNBP Royalti ESDM)',
        aturanBaru: 'Tetap bukan objek BK PMK 38/2024; diawasi lartas KMK 31/MK/BC/2026 & wacana 2026',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor Konsentrat Tembaga (>= 15% Cu) senilai USD 5.000.000',
    scenario:
      'Sebuah perusahaan tambang mengekspor konsentrat tembaga kadar >= 15% Cu dengan Harga Ekspor total USD 5.000.000 pada kurs pajak NDPBM Rp 16.000/USD berdasarkan PMK 38/2024.',
    presetRegime: 'bea_keluar_mineral_2024',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 5000000,
        ndpbmKurs: 16000,
        tonaseMt: 2500,
        tarifBkPersen: 7.5,
        jenisMineral2024: 'konsentrat_tembaga_7_5',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const MINERAL_META: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['jenisMineral2024']>,
  { label: string; tarif: number; detail: string }
> = {
  konsentrat_tembaga_7_5: { label: 'Konsentrat Tembaga (>= 15% Cu, ex 2603.00.00)', tarif: 7.5, detail: 'Lampiran Huruf D/E PMK 38/2024' },
  konsentrat_besi_laterit_5: { label: 'Konsentrat Besi Laterit (>= 50% Fe & >= 10% Al2O3+SiO2)', tarif: 5, detail: 'Lampiran PMK 38/2024' },
  konsentrat_timbal_5: { label: 'Konsentrat Timbal (>= 56% Pb)', tarif: 5, detail: 'Lampiran PMK 38/2024' },
  konsentrat_seng_5: { label: 'Konsentrat Seng (>= 51% Zn)', tarif: 5, detail: 'Lampiran PMK 38/2024' },
  batubara_non_bk: { label: 'Batubara (HS 2701 — Bukan Objek BK PMK 38/2024)', tarif: 0, detail: 'Terkena Royalti ESDM & Pengawasan KMK 31/MK/BC/2026' },
};

export const beaKeluarMineral2024Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const key = input.jenisMineral2024 ?? 'konsentrat_tembaga_7_5';
    const meta = MINERAL_META[key];
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    const beaKeluarUsd = nilaiEksporUsd * (meta.tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
    const netProceeds = Math.max(0, nilaiEksporIdr - beaKeluarIdr);

    const steps: CalculationStep[] = [
      {
        label: 'Jenis Komoditas Mineral / Pertambangan',
        formula: meta.detail,
        value: 0,
        format: 'text',
        displayValue: meta.label,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar PMK 38/2024',
        formula: meta.label,
        value: meta.tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: `${formatPersen(meta.tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'PMK 38 Tahun 2024 menghapus kaitan langsung antara persentase kemajuan fisik smelter dengan kenaikan tarif bulanan/semesteran seperti di PMK 71/2023, menjadi 7,5% (tembaga) dan 5% (besi laterit, timbal, seng).',
      'Selain Bea Keluar, eksportir komoditas pertambangan/minerba dan batubara wajib memperhatikan pemungutan PPh Pasal 22 sebesar 1,5% atas ekspor oleh bank devisa/DJBC sesuai PMK 51/2025.',
    ];
    if (key === 'batubara_non_bk') {
      notes.push(
        'Status Batubara 2026: Batubara belum tercantum sebagai objek Bea Keluar di PMK 38/2024 stdd PMK 68/2025 (PMK BK batubara masih dalam pembahasan hingga 2026), namun dibatasi & diawasi kepabeanannya melalui KMK 31/MK/BC/2026 (16 golongan barang).'
      );
    }

    return {
      regime,
      primaryTaxLabel: key === 'batubara_non_bk' ? 'Bea Keluar Batubara (PMK 38/2024)' : 'Bea Keluar Mineral Terutang',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: meta.tarif,
      effectiveRateLabel: 'Tarif Bea Keluar PMK 38/2024',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes,
    };
  },
};
