import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { getTerCategory, lookupTerRate } from './ter2024';

const sources = [SRC.PMK_168_2023, SRC.PP_58_2023, SRC.UU_7_2021_HPP, SRC.PER_16_PJ_2016];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_gross_up',
  taxType: 'pph21',
  name: 'PMK 168/2023 (Metode Gross-Up Tunjangan Pajak berbasis TER)',
  shortName: '2024–Kini (Gross-Up TER)',
  legalBasis: 'Pasal 5 & 15 PMK 168/PMK.03/2023 jo. PP Nomor 58 Tahun 2023 (TER)',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Simulasi Tunjangan Pajak Gross-Up berbasis TER',
  summary:
    'Menghitung besaran Tunjangan Pajak bulanan dengan metode Gross-Up di bawah rezim TER PP 58/2023 & PMK 168/2023 sehingga penghasilan setelah dipotong PPh 21 sama persis dengan gaji bersih sebelum tunjangan pajak (dan deductible bagi perusahaan).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-gross-up',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Metode Gross-Up PPh 21 Era TER (PMK 168/2023): Iterasi Tunjangan Pajak agar Take-Home Pay Utuh',
  legalBasis: 'PMK Nomor 168 Tahun 2023 & PP Nomor 58 Tahun 2023',
  effectiveDate: '1 Januari 2024',
  readMinutes: 6,
  summary:
    'Mengulas perbedaan metode Gross, Net, dan Gross-Up dalam penggajian korporasi di era TER PP 58/2023 beserta teknik iterasi untuk menghindari lompatan lapisan bruto TER yang menyebabkan selisih kurang/lebih tunjangan pajak.',
  sections: [
    {
      heading: 'Mengapa Gross-Up era TER berbeda dengan rumus aljabar lama?',
      paragraphs: [
        'Pada era PER-16/PJ/2016 sebelum 2024, perhitungan Gross-Up PPh 21 dapat diselesaikan dengan rumus aljabar linier sederhana pada masing-masing lapisan Pasal 17 (seperti 5/95 atau 15/85). Namun sejak PP 58/2023 berlaku pada 1 Januari 2024, pemotongan PPh 21 bulanan Januari–November menggunakan tabel Tarif Efektif Rata-Rata (TER) berbentuk tangga bertingkat berdasarkan rentang bruto bulanan.',
        'Penambahan Tunjangan Pajak ke dalam penghasilan bruto dapat mendorong total penghasilan bruto menembus batas atas lapisan TER tertentu sehingga tarif TER ikut naik 0,25% hingga 1%. Oleh karena itu, perhitungan Gross-Up di era TER wajib menggunakan iterasi titik tetap (fixed-point convergence) sampai nilai Tunjangan Pajak sama persis dengan PPh 21 TER yang dihitung dari (Bruto Dasar + Tunjangan Pajak).',
      ],
    },
    {
      heading: 'Keuntungan fiskal Gross-Up dibanding metode Net (ditanggung perusahaan)',
      paragraphs: [
        'Berbeda dengan skema Net di mana perusahaan menanggung PPh 21 pegawai dan biaya pajak tersebut menjadi koreksi fiskal positif (non-deductible expense bagi PPh Badan), skema Gross-Up memberikan tambahan tunjangan pajak resmi ke dalam penghasilan bruto pegawai.',
        'Tunjangan pajak tersebut merupakan komponen gaji/tunjangan yang sah sebagai biaya pengurang penghasilan bruto perusahaan (deductible expense sesuai Pasal 6 ayat (1) UU PPh) dan membuat pegawai menerima penghasilan sebelum iuran pensiun secara utuh tanpa tergerus potongan PPh 21.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Metode Net (Pajak Ditanggung Perusahaan)',
    newHeader: 'Metode Gross-Up TER (Tunjangan Pajak)',
    rows: [
      {
        aspek: 'Take-home pay pegawai',
        aturanLama: 'Gaji dasar diterima utuh tanpa potongan pajak',
        aturanBaru: 'Gaji dasar diterima utuh karena PPh 21 = Tunjangan Pajak',
      },
      {
        aspek: 'Koreksi fiskal di SPT Badan pemberi kerja',
        aturanLama: 'Non-deductible (dikoreksi positif di PPh Badan)',
        aturanBaru: 'Deductible expense 100% sebagai beban tunjangan karyawan',
      },
      {
        aspek: 'Cara hitung bulanan sejak 2024',
        aturanLama: 'Bruto tanpa tunjangan pajak dikali tarif TER langsung',
        aturanBaru: 'Iterasi konvergen hingga Tunjangan Pajak = TER(Bruto + Tunjangan)',
      },
    ],
  },
  caseExample: {
    title: 'Karyawan TK/0 gaji pokok + tunjangan tetap Rp 10 juta/bulan dengan Gross-Up TER',
    scenario:
      'Bruto dasar Rp 10.000.000/bln (Kategori A TK/0: lapisan awal Rp 10 jt kena TER 2%, namun setelah ditambah tunjangan pajak bruto melewati Rp 10.050.000 dan masuk lapisan TER 2,25%). Iterasi menemukan Tunjangan Pajak Rp 230.179 agar total bruto Rp 10.230.179 menghasilkan PPh 21 TER tepat Rp 230.179.',
    presetRegime: 'pph21_pmk168_2023_gross_up',
    presetInput: {
      pph21: {
        gajiBulanan: 10000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

function solveTerGrossUp(
  brutoBase: number,
  ptkpStatus: TaxCalculatorInput['pph21']['ptkpStatus'],
  hasNpwp: boolean
): { tunjanganPajak: number; totalBruto: number; effRatePercent: number; pphTer: number } {
  if (brutoBase <= 0) {
    return { tunjanganPajak: 0, totalBruto: 0, effRatePercent: 0, pphTer: 0 };
  }

  let tunjangan = 0;
  for (let iter = 0; iter < 40; iter += 1) {
    const candidateBruto = brutoBase + tunjangan;
    const baseRate = lookupTerRate(candidateBruto, ptkpStatus);
    const effRate = hasNpwp ? baseRate : baseRate * 1.2;
    const r = effRate / 100;
    const solved = r >= 1 ? 0 : Math.round((brutoBase * r) / (1 - r));
    const checkRate = lookupTerRate(brutoBase + solved, ptkpStatus) * (hasNpwp ? 1 : 1.2);
    const checkTax = Math.round(((brutoBase + solved) * checkRate) / 100);
    if (checkTax === solved || Math.abs(solved - tunjangan) === 0) {
      return {
        tunjanganPajak: checkTax,
        totalBruto: brutoBase + checkTax,
        effRatePercent: checkRate,
        pphTer: checkTax,
      };
    }
    tunjangan = solved;
  }

  const finalBruto = brutoBase + tunjangan;
  const finalRate = lookupTerRate(finalBruto, ptkpStatus) * (hasNpwp ? 1 : 1.2);
  const finalTax = Math.round((finalBruto * finalRate) / 100);
  return {
    tunjanganPajak: finalTax,
    totalBruto: brutoBase + finalTax,
    effRatePercent: finalRate,
    pphTer: finalTax,
  };
}

export const pph21Pmk168_2023GrossUpRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjanganTetap = Math.max(0, input.tunjanganTetap);
    const pensiunBulanan = Math.max(0, input.iuranPensiunBulanan);
    const brutoBase = gaji + tunjanganTetap;

    const terCat = getTerCategory(input.ptkpStatus);
    const grossMethodRate = lookupTerRate(brutoBase, input.ptkpStatus) * (input.hasNpwp ? 1 : 1.2);
    const grossMethodTax = Math.round((brutoBase * grossMethodRate) / 100);

    const solved = solveTerGrossUp(brutoBase, input.ptkpStatus, input.hasNpwp);
    const takeHomeGrossUp = Math.max(0, solved.totalBruto - solved.pphTer - pensiunBulanan);
    const takeHomeTanpaGrossUp = Math.max(0, brutoBase - grossMethodTax - pensiunBulanan);
    const selisihKenaikanBeban = solved.tunjanganPajak - grossMethodTax;

    const steps: CalculationStep[] = [
      {
        label: 'Penghasilan bruto dasar sebelum tunjangan pajak (Gaji + Tunjangan Tetap)',
        value: brutoBase,
      },
      {
        label: `Tunjangan Pajak Gross-Up konvergen (Kat. ${terCat} ${input.ptkpStatus})`,
        formula: `Bruto baru (${formatRupiah(solved.totalBruto)}) x ${formatPersen(solved.effRatePercent)}`,
        value: solved.tunjanganPajak,
      },
      {
        label: 'Total Penghasilan Bruto dalam Slip Gaji (Bruto Dasar + Tunjangan Pajak)',
        value: solved.totalBruto,
      },
      {
        label: 'PPh 21 TER dipotong & disetor perusahaan per bulan',
        formula: `${formatPersen(solved.effRatePercent)} x ${formatRupiah(solved.totalBruto)}`,
        value: solved.pphTer,
        isHighlight: true,
      },
      {
        label: 'Pembanding: PPh 21 bila memakai metode Gross biasa (ditanggung pegawai)',
        formula: `${formatPersen(grossMethodRate)} x ${formatRupiah(brutoBase)} (selisih +${formatRupiah(Math.max(0, selisihKenaikanBeban))})`,
        value: grossMethodTax,
      },
    ];

    if (pensiunBulanan > 0) {
      steps.push({
        label: 'Pengurang iuran pensiun/JHT porsi pegawai',
        value: -pensiunBulanan,
        isNegative: true,
      });
    }

    const notes: string[] = [
      `Dengan Tunjangan Pajak Gross-Up sebesar ${formatRupiah(solved.tunjanganPajak)}/bln, gaji bersih sebelum iuran pensiun tetap utuh sebesar ${formatRupiah(brutoBase)} (sedangkan dengan metode Gross biasa take-home pay tergerus menjadi ${formatRupiah(takeHomeTanpaGrossUp)}).`,
      'Berbeda dengan skema Net (pajak ditanggung perusahaan yang non-deductible di SPT Badan), seluruh Tunjangan Pajak Gross-Up boleh dibiayakan sebagai pengurang penghasilan bruto perusahaan.',
    ];

    if (!input.hasNpwp && brutoBase > 0) {
      notes.push(
        'Status Non-NPWP menerapkan tarif TER +20% lebih tinggi, sehingga biaya Tunjangan Pajak Gross-Up perusahaan ikut membengkak secara signifikan.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Tunjangan Pajak Gross-Up = PPh 21 TER (/bln)',
      primaryTaxAmount: solved.pphTer,
      annualTaxLabel: 'Proyeksi Total Tunjangan Pajak (12 Bulan TER)',
      annualTaxAmount: solved.pphTer * 12,
      effectiveRatePercent: solved.effRatePercent,
      effectiveRateLabel: `Tarif TER konvergen Kat. ${terCat}`,
      takeHomeOrNetLabel: 'Take-Home Pay Bersih Diterima Pegawai (/bln)',
      takeHomeOrNetAmount: takeHomeGrossUp,
      steps,
      notes,
    };
  },
};
