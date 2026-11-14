import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_1_2022_HKPD, SRC.PP_35_2023];

const regime: TaxRegime = {
  id: 'pbjt_hkpd_opsen',
  taxType: 'pbjt',
  name: 'UU HKPD Pasal 83–84 & PP 35/2023 (Opsen PKB & Opsen BBNKB 66%)',
  shortName: '2025–Kini (Opsen PKB & BBNKB 66%)',
  legalBasis: 'Pasal 83–84 & Pasal 191 UU Nomor 1 Tahun 2022 (HKPD) jo. PP Nomor 35 Tahun 2023',
  effectivePeriod: '5 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pungutan tambahan Kabupaten/Kota 66% atas pokok PKB & BBNKB Provinsi',
  summary:
    'Berlaku efektif mulai 5 Januari 2025 sesuai UU HKPD: mengalihkan sistem bagi hasil pajak provinsi menjadi pemungutan langsung (split-payment) Opsen Pajak Kendaraan Bermotor (PKB) dan Opsen BBNKB sebesar 66% dihitung dari pokok pajak terutang provinsi (bersamaan dengan penurunan plafon tarif PKB maks 1,2% dan BBNKB maks 12%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-hkpd-opsen',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT',
  title: 'Opsen PKB dan Opsen BBNKB 66% Mulai 5 Januari 2025 (Pasal 83–84 UU HKPD jo. PP 35/2023)',
  legalBasis: 'Pasal 83–84 UU Nomor 1 Tahun 2022 (HKPD) jo. PP Nomor 35 Tahun 2023',
  effectiveDate: '5 Januari 2025',
  readMinutes: 5,
  summary:
    'Menjelaskan mengapa muncul baris Opsen PKB dan Opsen BBNKB 66% pada STNK/BBN mulai Januari 2025 namun tidak otomatis menaikkan total beban pajak secara ekstrem karena tarif induk PKB/BBNKB Provinsi diturunkan.',
  sections: [
    {
      heading: 'Mekanisme Opsen 66% atas pokok PKB/BBNKB, bukan atas NJKB',
      paragraphs: [
        'Salah satu kesalahpahaman paling umum sejak 5 Januari 2025 adalah mengira Opsen PKB dan Opsen BBNKB sebesar 66% dikalikan dengan harga jual/Nilai Jual Kendaraan Bermotor (NJKB). Padahal Pasal 83 ayat (1) UU HKPD tegas menetapkan bahwa dasar pengenaan Opsen adalah POKOK PAJAK PKB atau BBNKB provinsi terutang.',
        'Sebagai kompensasi agar total beban masyarakat tidak melonjak, UU HKPD menurunkan tarif maksimal PKB kepemilikan pertama dari 2% (UU PDRD) menjadi maksimal 1,2%, dan BBNKB penyerahan pertama dari 20% menjadi maksimal 12%. Dengan Opsen 66% di atas pokok pajak, total efektifnya setara ~1,99% NJKB (untuk PKB) dan ~19,92% (untuk BBNKB), sementara kabupaten/kota langsung menerima porsi 66% pokok tersebut ke kas daerah secara real-time (split payment) tanpa menunggu transfer bagi hasil dari provinsi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (s.d. 4 Jan 2025)',
    newHeader: 'UU HKPD 1/2022 (Mulai 5 Jan 2025)',
    rows: [
      {
        aspek: 'Mekanisme porsi Kabupaten/Kota atas PKB & BBNKB',
        aturanLama: 'Bagi hasil 30% disetor via Provinsi secara periodik',
        aturanBaru: 'Opsen 66% atas pokok PKB/BBNKB langsung ke kas Kab/Kota (split payment)',
      },
      {
        aspek: 'Plafon tarif induk PKB (kepemilikan ke-1) & BBNKB ke-1',
        aturanLama: 'PKB maks 2%; BBNKB maks 20%',
        aturanBaru: 'PKB maks 1,2%; BBNKB maks 12% (+ Opsen 66% dari pokok pajak)',
      },
    ],
  },
  caseExample: {
    title: 'Menghitung Opsen PKB 66% atas pokok PKB tahunan sebesar Rp 3.000.000',
    scenario:
      'Kendaraan bermotor memiliki pokok PKB terutang provinsi sebesar Rp 3.000.000 (setelah penurunan tarif PKB Perda Provinsi di bawah UU HKPD). Opsen PKB Kab/Kota = 66% × Rp 3.000.000 = Rp 1.980.000, sehingga total bayar = Rp 4.980.000.',
    presetRegime: 'pbjt_hkpd_opsen',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 3000000,
        sectorType: 'makanan_minuman',
        jenisOpsenHkpd: 'opsen_pkb_66',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbjtHkpdOpsenRule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const pokokPajakProvinsi = Math.max(0, input.nilaiTransaksi);
    const jenis = input.jenisOpsenHkpd ?? 'opsen_pkb_66';
    const labelJenis = jenis === 'opsen_bbnkb_66' ? 'Opsen BBNKB Kabupaten/Kota' : 'Opsen PKB Kabupaten/Kota';
    const opsenRate = 66;
    const opsen = Math.round((pokokPajakProvinsi * opsenRate) / 100);
    const totalBayar = pokokPajakProvinsi + opsen;

    const steps: CalculationStep[] = [
      {
        label: jenis === 'opsen_bbnkb_66' ? 'Pokok BBNKB Terutang Provinsi' : 'Pokok PKB Terutang Provinsi',
        value: pokokPajakProvinsi,
      },
      {
        label: `${labelJenis} (66% dari Pokok Pajak — Pasal 83 UU HKPD)`,
        formula: `66% x ${formatRupiah(pokokPajakProvinsi)}`,
        value: opsen,
        isHighlight: true,
      },
      { label: 'Total tagihan pokok + Opsen di STNK/SKPD', value: totalBayar },
    ];

    return {
      regime,
      primaryTaxLabel: `${labelJenis} (66%)`,
      primaryTaxAmount: opsen,
      annualTaxLabel: 'Total Dibayar Wajib Pajak (Pokok + Opsen)',
      annualTaxAmount: totalBayar,
      effectiveRatePercent: opsenRate,
      effectiveRateLabel: 'Persentase Opsen terhadap Pokok Pajak',
      takeHomeOrNetLabel: 'Total Tagihan Pokok Provinsi + Opsen Kab/Kota',
      takeHomeOrNetAmount: totalBayar,
      steps,
      notes: [
        `Tarif Opsen sebesar ${formatPersen(opsenRate)} dikenakan atas POKOK PAJAK PKB/BBNKB provinsi terutang (bukan dari harga jual kendaraan), mulai berlaku serentak pada 5 Januari 2025.`,
        'Sebagian daerah dapat memberikan insentif/relaksasi persentase pengurangan pokok PKB/BBNKB atau Opsen di tahun transisi sesuai Perkada masing-masing.',
      ],
    };
  },
};
