import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_smelter_2022_2023',
  taxType: 'bea_keluar',
  name: 'Era HS 2022, Flush Out Sawit & Progres Smelter 50%+ (PMK 39/2022 stdd PMK 71/2023)',
  shortName: '2022–2024 (PMK 39/2022 & 71/2023)',
  legalBasis:
    'PMK Nomor 39/PMK.010/2022 stdd PMK 98/2022, PMK 123/2022 & PMK 71 Tahun 2023 (Dicabut oleh PMK 38/2024)',
  effectivePeriod: '1 April 2022 – 2 Juni 2024',
  isCurrent: false,
  summary:
    'Masa peralihan ke nomenklatur HS 2022: restrukturisasi matriks sawit menjadi 17 kolom (PMK 98/2022 & PMK 123/2022 termasuk program percepatan ekspor/flush out), diikuti PMK 71 Tahun 2023 (17 Jul 2023 – 2 Jun 2024) yang menghapus tarif 0% smelter dan mematok syarat minimum progres fisik smelter 50% dengan 3 tahap tarif naik (2023: 10%/7,5%/5% -> 2024: 15%/10%/7,5%).',
  sources: [
    SRC.PMK_39_2022,
    SRC.PMK_98_2022,
    SRC.PMK_123_2022,
    SRC.PMK_71_2023,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-smelter-pmk39-2022-pmk71-2023',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Historis PMK 39/2022 stdd PMK 98/2022, PMK 123/2022 & PMK 71/2023 (Flush Out Sawit & Smelter 50%+)',
  legalBasis:
    'PMK Nomor 39/PMK.010/2022 (1 Apr 2022) s.d. Perubahan Ketiga PMK Nomor 71 Tahun 2023 (17 Jul 2023 – 2 Jun 2024)',
  effectiveDate: '1 April 2022 – 2 Juni 2024',
  readMinutes: 6,
  summary:
    'Periode 2022–2024 menandai dua tonggak besar: pembaruan matriks Bea Keluar CPO pasca-larangan ekspor minyak goreng (PMK 98/2022 & 123/2022) dan pengetatan relaksasi konsentrat mineral berbasis progres fisik smelter minimal 50% melalui PMK 71 Tahun 2023.',
  sections: [
    {
      heading: 'Transformasi matriks CPO 2022 (PMK 98/2022 & PMK 123/2022)',
      paragraphs: [
        'Berlaku sejak 1 April 2022 mengikuti BTKI 2022, PMK 39/PMK.010/2022 awalnya meneruskan struktur 12 lapisan CPO. Namun setelah gejolak harga dan larangan sementara ekspor CPO/minyak goreng pada April–Mei 2022, pemerintah menerbitkan PMK 98/PMK.010/2022 (berlaku 10 Juni 2022) yang memperluas matriks sawit menjadi 17 kolom (puncak USD 288/MT) serta program percepatan ekspor (flush out) bertarif khusus untuk mengosongkan tangki pabrik kelapa sawit.',
        'Selanjutnya pada Agustus 2022, PMK Nomor 123/PMK.010/2022 menurunkan ambang batas awal pengenaan Bea Keluar CPO dari USD 750 menjadi USD 680/MT dengan 17 kolom rentang setiap kelipatan USD 50/MT hingga > USD 1.430/MT — struktur 17 kolom inilah yang kemudian dipertahankan oleh PMK 38 Tahun 2024.',
      ],
    },
    {
      heading: 'Penghapusan tarif 0% dan syarat minimal 50% smelter pada PMK 71 Tahun 2023',
      paragraphs: [
        'Pada sektor pertambangan, Perubahan Ketiga melalui PMK Nomor 71 Tahun 2023 (berlaku 17 Juli 2023 – 2 Juni 2024) merevisi skema PMK 39/2022 dengan mewajibkan progres pembangunan fisik smelter sekurang-kurangnya 50% untuk dapat memperoleh relaksasi ekspor konsentrat. Tarif 0% untuk smelter di atas 50% resmi dihapus.',
        'Khusus Konsentrat Tembaga (>= 15% Cu), PMK 71/2023 membagi tarif berdasarkan 3 tahap progres smelter dan 2 jendela waktu: periode 17 Juli – 31 Desember 2023 sebesar 10% (progres 50%–<70%), 7,5% (70%–<90%), dan 5% (90%–100%); sedangkan untuk 1 Januari – 31 Mei 2024 naik menjadi 15% (Tahap I), 10% (Tahap II), dan 7,5% (Tahap III) sebelum digantikan tarif tetap 7,5% di PMK 38/2024.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 71/2023 (Jul 2023 – Mei 2024)',
    newHeader: 'PMK 38/2024 (Sejak 3 Jun 2024)',
    rows: [
      {
        aspek: 'Syarat Minimal Progres Smelter untuk Ekspor',
        aturanLama: 'Wajib mencapai >= 50% fisik pembangunan smelter',
        aturanBaru: 'Ketergantungan progres fisik smelter dalam tarif BK dicabut',
      },
      {
        aspek: 'Konsentrat Tembaga — Tahap I (50%–<70%)',
        aturanLama: '10% (Jul–Des 2023) -> 15% (Jan–Mei 2024)',
        aturanBaru: '7,5% datar untuk seluruh kadar >= 15% Cu',
      },
      {
        aspek: 'Konsentrat Tembaga — Tahap II (70%–<90%) & III (90%–100%)',
        aturanLama: '7,5% / 5% (2023) -> 10% / 7,5% (Jan–Mei 2024)',
        aturanBaru: '7,5% datar untuk seluruh kadar >= 15% Cu',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor Konsentrat Tembaga progres smelter 65% pada Semester I 2024 (PMK 71/2023)',
    scenario:
      'Sebuah perusahaan tambang mengekspor konsentrat tembaga senilai USD 4.000.000 pada Februari 2024 (Tahap I progres smelter 65%, antara 50%–<70%) dengan kurs pajak NDPBM Rp 15.700/USD.',
    presetRegime: 'bea_keluar_smelter_2022_2023',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 4000000,
        ndpbmKurs: 15700,
        tonaseMt: 2000,
        tarifBkPersen: 10,
        periodeSmelter71: '2024_h1',
        progresSmelterPersen: 65,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaKeluarSmelter2022Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const progres = Math.max(0, Math.min(100, input.progresSmelterPersen ?? 65));
    const periode = input.periodeSmelter71 ?? '2024_h1';
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    let tarif = 0;
    let tahapLabel = '';
    const isEligible = progres >= 50;

    if (!isEligible) {
      tarif = 0;
      tahapLabel = `Progres ${formatPersen(progres)} (< 50% — Tidak Memenuhi Syarat Ekspor PMK 71/2023)`;
    } else if (progres < 70) {
      tarif = periode === '2024_h1' ? 15 : 10;
      tahapLabel = 'Tahap I (Progres Fisik Smelter 50% s.d. < 70%)';
    } else if (progres < 90) {
      tarif = periode === '2024_h1' ? 10 : 7.5;
      tahapLabel = 'Tahap II (Progres Fisik Smelter 70% s.d. < 90%)';
    } else {
      tarif = periode === '2024_h1' ? 7.5 : 5;
      tahapLabel = 'Tahap III (Progres Fisik Smelter 90% s.d. 100%)';
    }

    const beaKeluarUsd = nilaiEksporUsd * (tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Periode & Tingkat Kemajuan Fisik Smelter',
        formula: periode === '2024_h1' ? 'Jendela 1 Jan – 31 Mei 2024' : 'Jendela 17 Jul – 31 Des 2023',
        value: 0,
        format: 'text',
        displayValue: tahapLabel,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar Konsentrat Tembaga (PMK 71/2023)',
        formula: isEligible ? tahapLabel : 'Ditolak/Dilarang Ekspor (< 50%)',
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: isEligible ? `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}` : 'Tidak memperoleh izin ekspor di bawah PMK 71/2023',
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang (PMK 71/2023)',
      primaryTaxAmount: beaKeluarIdr,
      isNotCalculated: !isEligible,
      primaryTaxDisplay: !isEligible ? 'Tidak Memenuhi Syarat (<50%)' : undefined,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Konsentrat Tembaga PMK 71/2023',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - beaKeluarIdr),
      steps,
      notes: [
        'Di bawah PMK 71 Tahun 2023, pemegang IUP/IUPK yang progres smelternya di bawah 50% tidak diperkenankan mengekspor konsentrat; tarif 0% smelter juga resmi dihapus.',
        'Rangkaian PMK 39/2022 s.d. PMK 71/2023 resmi dicabut dan digantikan oleh PMK 38 Tahun 2024 mulai 3 Juni 2024.',
      ],
    };
  },
};
