import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_215_2018, SRC.PMK_81_2024, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph25_pmk215_2018_bank_bumn',
  taxType: 'pph25',
  name: 'PMK 215/PMK.03/2018 (Angsuran PPh 25 WP Tertentu: Bank, BUMN/BUMD, & Emiten)',
  shortName: '2018–Sekarang (WP Tertentu Bank/BUMN PMK 215)',
  legalBasis: 'PMK Nomor 215/PMK.03/2018 jo. PMK 81/2024 & Pasal 25 ayat (7) UU PPh',
  effectivePeriod: '31 Desember 2018 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Bank (Lapkeu Triwulan OJK), BUMN (RKAP), & Emiten (Lapkeu BEI)',
  summary:
    'Berbeda dengan WP umum yang memakai SPT Tahun Lalu ÷ 12, PMK 215/PMK.03/2018 mengatur basis khusus penghitungan angsuran PPh Pasal 25 bagi: (1) Bank berdasarkan laporan keuangan triwulanan ke OJK; (2) BUMN/BUMD berdasarkan RKAP yang disahkan RUPS/Menteri; dan (3) Emiten/WP Masuk Bursa selain bank berdasarkan laporan keuangan berkala semesteran/kuartalan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pmk215-2018-wp-tertentu',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Angsuran PPh 25 WP Tertentu (Bank, BUMN, & Emiten): PMK Nomor 215/PMK.03/2018',
  legalBasis: 'PMK Nomor 215/PMK.03/2018',
  effectiveDate: '31 Desember 2018',
  readMinutes: 5,
  summary:
    'Menghitung angsuran bulanan PPh Pasal 25 untuk perbankan, BUMN/BUMD, dan emiten pasar modal yang tidak mengacu pada SPT Tahunan tahun lalu melainkan data keuangan berjalan/proyeksi resmi.',
  sections: [
    {
      heading: 'Mengapa Bank, BUMN, dan Emiten tidak memakai SPT Tahunan tahun lalu?',
      paragraphs: [
        'Pasal 25 ayat (7) UU PPh memberi kewenangan kepada Menteri Keuangan menetapkan penghitungan angsuran tersendiri bagi Wajib Pajak baru, bank, BUMN, BUMD, Wajib Pajak masuk bursa (emiten), dan Wajib Pajak lainnya yang wajib membuat laporan keuangan berkala.',
        'Berdasarkan PMK 215/PMK.03/2018 (yang menggantikan PMK 255/2008 & PMK 208/2009): (a) Bank menghitung PPh 25 dari penghasilan neto kumulatif laporan keuangan triwulanan yang disetahunkan, dikali tarif PPh Badan (22%), dikurangi PPh 25 yang sudah dibayar pada masa pajak sebelumnya, dibagi sisa bulan; (b) BUMN/BUMD memakai RKAP yang telah disahkan ÷ 12; dan (c) Emiten memakai laporan keuangan berkala per 6 bulan atau triwulanan yang disetahunkan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'WP Umum (Pasal 25 ayat 1)',
    newHeader: 'WP Tertentu (PMK 215/2018)',
    rows: [
      {
        aspek: 'Bank Umum / Bank Syariah',
        aturanLama: 'SPT Tahunan tahun lalu ÷ 12',
        aturanBaru: 'Penghasilan neto laporan keuangan triwulanan OJK yang disetahunkan',
      },
      {
        aspek: 'BUMN & BUMD',
        aturanLama: 'SPT Tahunan tahun lalu ÷ 12',
        aturanBaru: 'Proyeksi Penghasilan Kena Pajak dalam RKAP ÷ 12 (dikurangi kredit pajak)',
      },
      {
        aspek: 'Emiten / Perusahaan Terbuka non-Bank',
        aturanLama: 'SPT Tahunan tahun lalu ÷ 12',
        aturanBaru: 'Laporan keuangan berkala disampaikan ke Bursa Efek / OJK',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi angsuran PPh 25 BUMN berdasarkan laba RKAP Rp 60.000.000.000',
    scenario:
      'Sebuah BUMN memiliki proyeksi Penghasilan Kena Pajak pada RKAP tahun berjalan Rp 60 miliar dengan kredit pajak PPh 22/23 proyeksi Rp 1,2 miliar.',
    presetRegime: 'pph25_pmk215_2018_bank_bumn',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 1200000000,
        bulanBerjalan: 12,
        skemaWpTertentu: 'bumn_bumd_rkap',
        labaTriwulanAtauRkap: 60000000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pmk215_2018WpTertentuRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const skema = input.skemaWpTertentu ?? 'bank_ojk';
    const labaBasis = Math.max(0, input.labaTriwulanAtauRkap ?? input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);

    let pphDisetahunkan = 0;
    let labelBasis = '';
    if (skema === 'bank_ojk') {
      const labaDisetahunkan = labaBasis * 4;
      pphDisetahunkan = Math.round(labaDisetahunkan * 0.22);
      labelBasis = 'Laba neto 1 triwulan OJK disetahunkan (x 4) x 22%';
    } else if (skema === 'emiten_berkala') {
      const labaDisetahunkan = labaBasis * 2;
      pphDisetahunkan = Math.round(labaDisetahunkan * 0.19);
      labelBasis = 'Laba neto semesteran BEI disetahunkan (x 2) x 19% (tarif Tbk)';
    } else {
      pphDisetahunkan = Math.round(labaBasis * 0.22);
      labelBasis = 'Proyeksi Penghasilan Kena Pajak RKAP x 22%';
    }

    const dasarAngsuranTahunan = Math.max(0, pphDisetahunkan - kreditPajak);
    const angsuranBulanan = Math.round(dasarAngsuranTahunan / 12);

    const steps: CalculationStep[] = [
      { label: 'Laba neto / PKP dasar laporan berkala atau RKAP', value: labaBasis },
      { label: 'PPh terutang disetahunkan', formula: labelBasis, value: pphDisetahunkan },
      { label: 'Kredit pajak yang dapat diperhitungkan (PPh 22/23/24)', value: -kreditPajak, isNegative: true },
      { label: 'Dasar angsuran PPh 25 setahun', value: dasarAngsuranTahunan },
      { label: 'Angsuran PPh Pasal 25 per bulan', value: angsuranBulanan, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh 25 WP Tertentu (/Bulan)',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: 'Total Proyeksi PPh 25 Setahun',
      annualTaxAmount: dasarAngsuranTahunan,
      effectiveRatePercent: labaBasis > 0 ? (angsuranBulanan / labaBasis) * 100 : 0,
      takeHomeOrNetLabel: 'Kewajiban Setor Triwulanan (3 Bulan)',
      takeHomeOrNetAmount: angsuranBulanan * 3,
      steps,
      notes: [
        skema === 'bank_ojk'
          ? 'Bagi Bank, perhitungan diselaraskan setiap berakhirnya triwulan berdasarkan laporan keuangan triwulanan yang disampaikan ke OJK sesuai PMK 215/2018.'
          : skema === 'emiten_berkala'
            ? 'Bagi Emiten non-Bank, apabila memenuhi syarat saham publik ≥ 40% (PP 30/2020), tarif yang digunakan pada hitungan disetahunkan adalah 19% (22% - 3%).'
            : 'Bagi BUMN/BUMD, jika RKAP belum disahkan awal tahun pajak, angsuran bulan sebelum pengesahan sementara memakai angsuran bulan Desember tahun pajak sebelumnya.',
      ],
    };
  },
};
