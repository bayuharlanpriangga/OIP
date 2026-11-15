import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_kakao_pinus',
  taxType: 'bea_keluar',
  name: 'Biji Kakao Progresif & Getah Pinus 25% (PMK 38/2024 stdd PMK 68/2025)',
  shortName: '2025–Kini (Kakao & Getah Pinus)',
  legalBasis:
    'PMK Nomor 38 Tahun 2024 jo. PMK Nomor 68 Tahun 2025 (Lampiran Huruf A & B) & PMK Nomor 9 Tahun 2026',
  effectivePeriod: '22 Oktober 2025 – Sekarang (PMK 38/2024 sejak 3 Jun 2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (PMK 68/2025)',
  summary:
    'PMK Nomor 68 Tahun 2025 (berlaku 22 Okt 2025) menurunkan tarif progresif Bea Keluar Biji Kakao menjadi 0% / 2,5% / 5% / 7,5% (dari semula 0% / 5% / 10% / 15% di PMK 38/2024) serta menetapkan objek baru Getah Pinus (ex 1301.90.90) bertarif flat 25%.',
  sources: [
    SRC.PMK_68_2025,
    SRC.PMK_38_2024,
    SRC.PMK_9_2026,
    SRC.PMK_106_2022_BK,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-kakao-getah-pinus-pmk68-2025',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Bea Keluar Biji Kakao (Penurunan Tarif 2025) & Getah Pinus 25% Menurut PMK 68 Tahun 2025',
  legalBasis:
    'Lampiran A & B PMK Nomor 38 Tahun 2024 stdd PMK Nomor 68 Tahun 2025 (Diundangkan 15 Okt 2025, Berlaku 22 Okt 2025)',
  effectiveDate: '22 Oktober 2025',
  readMinutes: 5,
  summary:
    'Perubahan Pertama atas PMK 38 Tahun 2024 melalui PMK 68 Tahun 2025 memangkas separuh tarif Bea Keluar Biji Kakao menjadi maksimal 7,5% guna menjaga keseimbangan harga tingkat petani, sembari mengenakan tarif flat 25% atas ekspor Getah Pinus.',
  sections: [
    {
      heading: 'Pemangkasan tarif progresif Biji Kakao dan komplementaritas Pungutan Ekspor BPDP',
      paragraphs: [
        'Sejak PMK 67/PMK.011/2010 hingga PMK 38 Tahun 2024 (HS 1801.00.10 dan 1801.00.90), tarif ad valorem ekspor biji kakao dipatok sebesar 0% (Harga Referensi <= USD 2.000/MT), 5% (> USD 2.000–2.750/MT), 10% (> USD 2.750–3.500/MT), dan 15% (> USD 3.500/MT). Ketika harga kakao dunia melonjak tinggi di atas USD 3.500/MT sepanjang 2024–2025, beban total eksportir meningkat tajam setelah adanya Pungutan Ekspor BLU BPDP untuk komoditas kakao.',
        'Oleh karena itu, PMK Nomor 68 Tahun 2025 (ditetapkan 10 Oktober 2025, diundangkan 15 Oktober 2025, berlaku efektif 22 Oktober 2025) menurunkan tarif Bea Keluar Biji Kakao menjadi 0% (<= USD 2.000/MT), 2,5% (> USD 2.000 s.d. USD 2.750/MT), 5% (> USD 2.750 s.d. USD 3.500/MT), dan maksimal 7,5% (> USD 3.500/MT).',
      ],
    },
    {
      heading: 'Objek baru Getah Pinus 25% (ex 1301.90.90) untuk ketahanan bahan baku industri',
      paragraphs: [
        'Selain penyesuaian kakao dan perluasan produk samping sawit (POME/HAPOR), PMK Nomor 68 Tahun 2025 memasukkan Getah Pinus (pos tarif ex 1301.90.90) sebagai komoditas ekspor baru yang dikenai tarif Bea Keluar flat sebesar 25% ad valorem dari Harga Ekspor.',
        'Kebijakan pengenaan tarif tinggi 25% pada getah pinus bertujuan menahan ekspor bahan mentah kehutanan serta menjamin ketersediaan pasokan bahan baku gondorukem dan terpentin bagi industri cat, kertas, perekat, dan sabun di dalam negeri.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 38 Tahun 2024 (3 Jun 2024 – 21 Okt 2025)',
    newHeader: 'PMK 68 Tahun 2025 (Mulai 22 Okt 2025 – Sekarang)',
    rows: [
      {
        aspek: 'Biji Kakao (HR <= USD 2.000 / MT)',
        aturanLama: '0%',
        aturanBaru: '0%',
      },
      {
        aspek: 'Biji Kakao (HR > USD 2.000 – 2.750 / MT)',
        aturanLama: '5%',
        aturanBaru: '2,5%',
      },
      {
        aspek: 'Biji Kakao (HR > USD 2.750 – 3.500 / MT)',
        aturanLama: '10%',
        aturanBaru: '5%',
      },
      {
        aspek: 'Biji Kakao (HR > USD 3.500 / MT)',
        aturanLama: '15%',
        aturanBaru: '7,5%',
      },
      {
        aspek: 'Getah Pinus (ex 1301.90.90)',
        aturanLama: 'Belum dikenakan Bea Keluar (0%)',
        aturanBaru: 'Tarif flat 25% Ad Valorem',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor 50 MT Biji Kakao saat Harga Referensi USD 4.200/MT (PMK 68/2025)',
    scenario:
      'Sebuah perusahaan perdagangan komoditas mengekspor 50 MT Biji Kakao dengan Harga Ekspor total USD 210.000 saat Harga Referensi dunia USD 4.200/MT (> USD 3.500/MT) dan kurs pajak NDPBM Rp 16.000/USD.',
    presetRegime: 'bea_keluar_kakao_pinus',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 210000,
        ndpbmKurs: 16000,
        tonaseMt: 50,
        tarifBkPersen: 7.5,
        skemaKakaoPinus: 'kakao_pmk68_2025',
        hargaReferensiKakaoUsd: 4200,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaKeluarKakaoPinusRule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const skema = input.skemaKakaoPinus ?? 'kakao_pmk68_2025';
    const hrKakao = Math.max(0, input.hargaReferensiKakaoUsd ?? 4200);
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    let tarif = 0;
    let keterangan = '';

    if (skema === 'getah_pinus_pmk68') {
      tarif = 25;
      keterangan = 'Getah Pinus (ex 1301.90.90) — Tarif Flat PMK 68/2025';
    } else if (skema === 'kakao_lama_pmk38_2024') {
      if (hrKakao > 3500) tarif = 15;
      else if (hrKakao > 2750) tarif = 10;
      else if (hrKakao > 2000) tarif = 5;
      else tarif = 0;
      keterangan = `Biji Kakao Era PMK 38/2024 Lama (HR USD ${hrKakao.toLocaleString('id-ID')}/MT)`;
    } else {
      if (hrKakao > 3500) tarif = 7.5;
      else if (hrKakao > 2750) tarif = 5;
      else if (hrKakao > 2000) tarif = 2.5;
      else tarif = 0;
      keterangan = `Biji Kakao PMK 68/2025 Berlaku 22 Okt 2025 (HR USD ${hrKakao.toLocaleString('id-ID')}/MT)`;
    }

    const beaKeluarUsd = nilaiEksporUsd * (tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);
    const netProceeds = Math.max(0, nilaiEksporIdr - beaKeluarIdr);

    const steps: CalculationStep[] = [
      {
        label: 'Komoditas & Skema Aturan',
        formula: keterangan,
        value: 0,
        format: 'text',
        displayValue:
          skema === 'getah_pinus_pmk68'
            ? 'Getah Pinus (ex 1301.90.90)'
            : `Biji Kakao HS 1801 (HR USD ${hrKakao.toLocaleString('id-ID')}/MT)`,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar Berlaku',
        formula: keterangan,
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: tarif,
      effectiveRateLabel: 'Tarif Bea Keluar Berlaku',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes: [
        'Sejak 22 Oktober 2025 (PMK 68/2025), Biji Kakao mengalami pemangkasan tarif 50% di tiap lapisan aktif (2,5% / 5% / 7,5%) dan Getah Pinus ex 1301.90.90 resmi dikenakan Bea Keluar 25%.',
        'Selain Bea Keluar DJBC, ekspor produk kakao tertentu juga dapat dikenai Pungutan Ekspor (PE) Badan Pengelola Dana Perkebunan (BPDP) sesuai PMK Nomor 69 Tahun 2025 stdd PMK Nomor 9 Tahun 2026.',
      ],
    };
  },
};
