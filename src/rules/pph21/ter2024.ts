import {
  CalculationStep,
  PtkpStatus,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { computeProgressivePph21, getPtkpAmount } from './shared';

interface TerBracket {
  max: number;
  rate: number;
}

const TER_CATEGORY_A: TerBracket[] = [
  { max: 5400000, rate: 0 },
  { max: 5650000, rate: 0.25 },
  { max: 5950000, rate: 0.5 },
  { max: 6300000, rate: 0.75 },
  { max: 6750000, rate: 1 },
  { max: 7500000, rate: 1.25 },
  { max: 8550000, rate: 1.5 },
  { max: 9650000, rate: 1.75 },
  { max: 10050000, rate: 2 },
  { max: 10350000, rate: 2.25 },
  { max: 10700000, rate: 2.5 },
  { max: 11050000, rate: 3 },
  { max: 11600000, rate: 3.5 },
  { max: 12500000, rate: 4 },
  { max: 13750000, rate: 5 },
  { max: 15100000, rate: 6 },
  { max: 16950000, rate: 7 },
  { max: 19750000, rate: 8 },
  { max: 24150000, rate: 9 },
  { max: 26450000, rate: 10 },
  { max: 28000000, rate: 11 },
  { max: 30050000, rate: 12 },
  { max: 32400000, rate: 13 },
  { max: 35400000, rate: 14 },
  { max: 39100000, rate: 15 },
  { max: 43850000, rate: 16 },
  { max: 47800000, rate: 17 },
  { max: 51400000, rate: 18 },
  { max: 56300000, rate: 19 },
  { max: 62200000, rate: 20 },
  { max: 68600000, rate: 21 },
  { max: 77500000, rate: 22 },
  { max: 89000000, rate: 23 },
  { max: 103000000, rate: 24 },
  { max: 125000000, rate: 25 },
  { max: 157000000, rate: 26 },
  { max: 206000000, rate: 27 },
  { max: 337000000, rate: 28 },
  { max: 454000000, rate: 29 },
  { max: 550000000, rate: 30 },
  { max: 695000000, rate: 31 },
  { max: 910000000, rate: 32 },
  { max: 1400000000, rate: 33 },
  { max: Infinity, rate: 34 },
];

const TER_CATEGORY_B: TerBracket[] = [
  { max: 6200000, rate: 0 },
  { max: 6500000, rate: 0.25 },
  { max: 6850000, rate: 0.5 },
  { max: 7300000, rate: 0.75 },
  { max: 9200000, rate: 1 },
  { max: 10750000, rate: 1.5 },
  { max: 11250000, rate: 2 },
  { max: 11600000, rate: 2.5 },
  { max: 12600000, rate: 3 },
  { max: 13600000, rate: 4 },
  { max: 14950000, rate: 5 },
  { max: 16400000, rate: 6 },
  { max: 18450000, rate: 7 },
  { max: 21850000, rate: 8 },
  { max: 26000000, rate: 9 },
  { max: 27700000, rate: 10 },
  { max: 29350000, rate: 11 },
  { max: 31450000, rate: 12 },
  { max: 33950000, rate: 13 },
  { max: 37100000, rate: 14 },
  { max: 41100000, rate: 15 },
  { max: 45800000, rate: 16 },
  { max: 49500000, rate: 17 },
  { max: 53800000, rate: 18 },
  { max: 58500000, rate: 19 },
  { max: 64000000, rate: 20 },
  { max: 71000000, rate: 21 },
  { max: 80000000, rate: 22 },
  { max: 93000000, rate: 23 },
  { max: 109000000, rate: 24 },
  { max: 129000000, rate: 25 },
  { max: 163000000, rate: 26 },
  { max: 211000000, rate: 27 },
  { max: 374000000, rate: 28 },
  { max: 459000000, rate: 29 },
  { max: 555000000, rate: 30 },
  { max: 704000000, rate: 31 },
  { max: 957000000, rate: 32 },
  { max: 1405000000, rate: 33 },
  { max: Infinity, rate: 34 },
];

const TER_CATEGORY_C: TerBracket[] = [
  { max: 6600000, rate: 0 },
  { max: 6950000, rate: 0.25 },
  { max: 7350000, rate: 0.5 },
  { max: 7800000, rate: 0.75 },
  { max: 8850000, rate: 1 },
  { max: 9800000, rate: 1.25 },
  { max: 10950000, rate: 1.5 },
  { max: 11200000, rate: 1.75 },
  { max: 12050000, rate: 2 },
  { max: 12950000, rate: 3 },
  { max: 14150000, rate: 4 },
  { max: 15550000, rate: 5 },
  { max: 17050000, rate: 6 },
  { max: 19500000, rate: 7 },
  { max: 22700000, rate: 8 },
  { max: 26600000, rate: 9 },
  { max: 28100000, rate: 10 },
  { max: 30100000, rate: 11 },
  { max: 32600000, rate: 12 },
  { max: 35400000, rate: 13 },
  { max: 38900000, rate: 14 },
  { max: 43000000, rate: 15 },
  { max: 47400000, rate: 16 },
  { max: 51200000, rate: 17 },
  { max: 55800000, rate: 18 },
  { max: 60400000, rate: 19 },
  { max: 66700000, rate: 20 },
  { max: 74500000, rate: 21 },
  { max: 83200000, rate: 22 },
  { max: 95600000, rate: 23 },
  { max: 110400000, rate: 24 },
  { max: 134000000, rate: 25 },
  { max: 169000000, rate: 26 },
  { max: 221000000, rate: 27 },
  { max: 390000000, rate: 28 },
  { max: 463000000, rate: 29 },
  { max: 561000000, rate: 30 },
  { max: 709000000, rate: 31 },
  { max: 965000000, rate: 32 },
  { max: 1419000000, rate: 33 },
  { max: Infinity, rate: 34 },
];

function getTerCategory(status: PtkpStatus): 'A' | 'B' | 'C' {
  if (status === 'TK/0' || status === 'TK/1' || status === 'K/0') return 'A';
  if (status === 'K/3') return 'C';
  return 'B';
}

function lookupTerRate(brutoBulanan: number, status: PtkpStatus): number {
  const category = getTerCategory(status);
  const table =
    category === 'A' ? TER_CATEGORY_A : category === 'B' ? TER_CATEGORY_B : TER_CATEGORY_C;
  const row = table.find((b) => brutoBulanan <= b.max);
  return row ? row.rate : 34;
}

const regime: TaxRegime = {
  id: 'pph21_ter_2024',
  taxType: 'pph21',
  name: 'PP 58/2023 & PMK 168/2023 (TER)',
  shortName: '2024–Sekarang (TER)',
  legalBasis: 'PP Nomor 58 Tahun 2023 & PMK 168/PMK.03/2023',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  summary:
    'Masa Januari–November memakai Tarif Efektif Rata-Rata (TER) bulanan kategori A, B, atau C; Masa Desember direkonsiliasi ulang dengan tarif Pasal 17 UU HPP.',
};

const article: TaxArticle = {
  id: 'pph21-ter-2024',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Mekanisme Tarif Efektif Rata-Rata (TER) PP 58/2023 dan Rekonsiliasi Desember',
  legalBasis: 'PP Nomor 58 Tahun 2023 & PMK 168/PMK.03/2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 6,
  summary:
    'Penyederhanaan pemotongan PPh 21 bulanan Januari–November menggunakan tabel TER Kategori A, B, dan C tanpa mengurangi jumlah beban pajak setahun.',
  sections: [
    {
      heading: 'Latar belakang perubahan dari skema disetahunkan',
      paragraphs: [
        'Sebelum 2024, pemberi kerja harus menghitung proyeksi penghasilan disetahunkan setiap bulan berdasarkan PER-16/PJ/2016. Perubahan tunjangan, lembur, atau bonus di tengah tahun sering membuat administrasi pemotongan rumit dan menimbulkan selisih lebih atau kurang potong di akhir tahun.',
        'Mulai 1 Januari 2024, PP 58/2023 memperkenalkan Tarif Efektif Rata-Rata (TER) bulanan yang langsung dikalikan dengan penghasilan bruto pada masa pajak Januari hingga November. Kategori TER ditentukan dari status PTKP pada awal tahun pajak: Kategori A (TK/0, TK/1, K/0), Kategori B (TK/2, TK/3, K/1, K/2), dan Kategori C (K/3).',
      ],
    },
    {
      heading: 'Rekonsiliasi wajib di Masa Pajak Desember',
      paragraphs: [
        'TER tidak mengubah beban pajak tahunan Wajib Pajak. Pada masa pajak terakhir (Desember atau saat pegawai berhenti bekerja), pemberi kerja tetap menghitung ulang PPh 21 terutang setahun menggunakan Pasal 17 ayat (1) huruf a UU HPP setelah dikurangi Biaya Jabatan (5% maksimal Rp 6.000.000/tahun), iuran pensiun/JHT, zakat wajib melalui pemberi kerja, dan PTKP.',
        'Jika pemotongan akumulatif Januari–November lebih kecil daripada pajak setahun, selisihnya dipotong di Desember. Sebaliknya, bila terdapat kelebihan potong, pemberi kerja wajib mengembalikan kelebihan tersebut kepada pegawai paling lambat akhir bulan berikutnya.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PER-16/PJ/2016 (s.d. 2023)',
    newHeader: 'PP 58/2023 & PMK 168/2023 (2024–Kini)',
    rows: [
      {
        aspek: 'Rumus Januari–November',
        aturanLama: 'Neto disetahunkan minus PTKP dikali tarif progresif Pasal 17',
        aturanBaru: 'Penghasilan bruto bulanan langsung dikali tarif tabel TER A/B/C',
      },
      {
        aspek: 'Perlakuan bonus & THR di bulan berjalan',
        aturanLama: 'Dua kali hitung (gaji rutin vs gaji + bonus disetahunkan)',
        aturanBaru: 'Digabung dalam bruto bulan tersebut lalu dikali satu lapis tarif TER',
      },
      {
        aspek: 'Beban pajak akhir tahun',
        aturanLama: 'Mengikuti tarif Pasal 17 UU HPP (2022–2023)',
        aturanBaru: 'Tetap sama persis memakai tarif Pasal 17 UU HPP di Masa Desember',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan K/1 dengan gaji bulanan dan bonus tahunan',
    scenario:
      'Gaji Rp 14.500.000 + tunjangan tetap Rp 1.500.000/bulan, iuran pensiun dibayar sendiri Rp 250.000/bulan, status K/1, serta bonus akhir tahun Rp 18.000.000.',
    presetRegime: 'pph21_ter_2024',
    presetInput: {
      pph21: {
        gajiBulanan: 14500000,
        tunjanganTetap: 1500000,
        bonusTahunan: 18000000,
        iuranPensiunBulanan: 250000,
        ptkpStatus: 'K/1',
        hasNpwp: true,
      },
    },
  },
};

export const pph21Ter2024Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);

    const brutoBulananRutin = gaji + tunjangan;
    const brutoTahunan = brutoBulananRutin * 12 + bonus;
    const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, 6000000);
    const pensiunTahunan = pensiunBulanan * 12;
    const netoTahunan = Math.max(0, brutoTahunan - biayaJabatanTahunan - pensiunTahunan);

    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');
    const pkpRaw = Math.max(0, netoTahunan - ptkp);
    const pkpRounded = Math.floor(pkpRaw / 1000) * 1000;

    const { tax: pphTahunan, breakdown } = computeProgressivePph21(
      pkpRounded,
      'hpp',
      input.hasNpwp
    );

    const terCat = getTerCategory(input.ptkpStatus);
    const terRateRutin = lookupTerRate(brutoBulananRutin, input.ptkpStatus);
    const effectiveTerRate = input.hasNpwp ? terRateRutin : terRateRutin * 1.2;
    const pphJanNovPerBulan = Math.round((brutoBulananRutin * effectiveTerRate) / 100);
    const totalPphJanNov = pphJanNovPerBulan * 11;
    const pphDesember = pphTahunan - totalPphJanNov;

    const steps: CalculationStep[] = [
      {
        label: 'Penghasilan bruto rutin per bulan',
        formula: 'Gaji pokok + tunjangan tetap',
        value: brutoBulananRutin,
      },
      {
        label: `Tarif TER Kategori ${terCat} (${input.ptkpStatus})`,
        formula: input.hasNpwp
          ? `PP 58/2023 Kategori ${terCat}`
          : `TER ${formatPersen(terRateRutin)} x 120% (Non-NPWP)`,
        value: effectiveTerRate,
        format: 'percent',
      },
      {
        label: 'PPh 21 dipotong tiap bulan (Jan–Nov)',
        formula: `${formatPersen(effectiveTerRate)} x ${formatRupiah(brutoBulananRutin)}`,
        value: pphJanNovPerBulan,
        isHighlight: true,
      },
      {
        label: 'Bruto setahun (termasuk bonus)',
        formula: `(12 x ${formatRupiah(brutoBulananRutin)}) + ${formatRupiah(bonus)}`,
        value: brutoTahunan,
      },
      {
        label: 'Biaya jabatan (5%, maks Rp 6 jt/thn) & pensiun',
        formula: `${formatRupiah(biayaJabatanTahunan)} + ${formatRupiah(pensiunTahunan)}`,
        value: -(biayaJabatanTahunan + pensiunTahunan),
        isNegative: true,
      },
      {
        label: `PTKP (${input.ptkpStatus}) era PMK 101/2016`,
        value: -ptkp,
        isNegative: true,
      },
      {
        label: 'PKP disetahunkan (dibulatkan ribuan ke bawah)',
        value: pkpRounded,
      },
      {
        label: 'Total PPh 21 terutang setahun (Pasal 17 UU HPP)',
        formula: breakdown,
        value: pphTahunan,
        isHighlight: true,
      },
      {
        label: 'Rekonsiliasi Masa Desember (Setahun - 11 bln TER)',
        formula: `${formatRupiah(pphTahunan)} - ${formatRupiah(totalPphJanNov)}`,
        value: pphDesember,
      },
    ];

    const notes: string[] = [
      `Pada Masa Januari–November, pemotongan memakai tabel TER Kategori ${terCat} sebesar ${formatPersen(effectiveTerRate)} dari bruto bulanan.`,
    ];

    if (pphDesember < 0) {
      notes.push(
        `Terjadi lebih potong di akhir tahun sebesar ${formatRupiah(Math.abs(pphDesember))} yang wajib dikembalikan pemberi kerja pada masa Desember.`
      );
    } else {
      notes.push(
        `Kekurangan potong di Masa Desember sebesar ${formatRupiah(pphDesember)} mencakup pelunasan pajak atas bonus tahunan dan selisih TER.`
      );
    }

    const effectiveAnnualRate = brutoTahunan > 0 ? (pphTahunan / brutoTahunan) * 100 : 0;
    const takeHomeBulanRutin = Math.max(0, brutoBulananRutin - pensiunBulanan - pphJanNovPerBulan);

    return {
      regime,
      primaryTaxLabel: 'Potongan Bulanan (Jan–Nov via TER)',
      primaryTaxAmount: pphJanNovPerBulan,
      annualTaxLabel: 'Total PPh 21 Setahun (Pasal 17)',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent: effectiveAnnualRate,
      takeHomeOrNetLabel: 'Penghasilan Bersih Bulanan (Jan–Nov)',
      takeHomeOrNetAmount: takeHomeBulanRutin,
      steps,
      notes,
    };
  },
};
