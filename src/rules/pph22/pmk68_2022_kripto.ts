import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_68_2022, SRC.PMK_50_2025, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph22_pmk68_2022_kripto',
  taxType: 'pph22',
  name: 'PMK 68/PMK.03/2022 (PPh 22 & PPN Kripto Era Bappebti)',
  shortName: 'Mei 2022–Jul 2025 (Kripto PMK 68/2022)',
  legalBasis: 'PMK Nomor 68/PMK.03/2022 (Dicabut PMK Nomor 50 Tahun 2025 per 1 Ags 2025)',
  effectivePeriod: '1 Mei 2022 – 31 Juli 2025',
  isCurrent: false,
  summary:
    'Ketentuan perdana pajak aset kripto selama berada di bawah pengawasan Bappebti sebagai komoditas tidak berwujud: mengenakan PPh Pasal 22 Final 0,1% + PPN 0,11% (bursa terdaftar) atau PPh 22 Final 0,2% + PPN 0,22% (bursa non-terdaftar), sebelum digantikan PMK 50/2025.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk68-2022-kripto',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PMK 68/PMK.03/2022: Rezim Perdana Pajak Aset Kripto Era Bappebti (Mei 2022–Jul 2025)',
  legalBasis: 'PMK Nomor 68/PMK.03/2022 Pasal 5 & Pasal 21',
  effectiveDate: '1 Mei 2022 – 31 Juli 2025',
  readMinutes: 4,
  summary:
    'Memahami skema pajak ganda komoditas pada PMK 68/2022 (PPh 22 Final 0,1%/0,2% ditambah PPN Besaran Tertentu 0,11%/0,22%) sebelum dihapusnya PPN koin di PMK 50/2025.',
  sections: [
    {
      heading: 'Aset kripto diperlakukan sebagai komoditas tidak berwujud (BKP)',
      paragraphs: [
        'Pada 1 Mei 2022 hingga 31 Juli 2025, perdagangan aset kripto berada di bawah pengawasan Bappebti dan diklasifikasikan sebagai komoditas digital. Oleh karena itu, transaksi jual-beli koin dikenai dua lapis pungutan sekaligus berdasarkan PMK 68/PMK.03/2022.',
        'Pertama, penjual dikenai PPh Pasal 22 Final sebesar 0,1% (jika melalui Pedagang Fisik Aset Kripto / PPMSE terdaftar Bappebti) atau 0,2% (jika tidak terdaftar). Kedua, pembeli dikenai PPN Besaran Tertentu sebesar 1% × tarif PPN 11% = 0,11% (terdaftar) atau 2% × 11% = 0,22% (non-terdaftar).',
      ],
    },
    {
      heading: 'Pencabutan oleh PMK 50/2025 per 1 Agustus 2025',
      paragraphs: [
        'Sejak beralihnya otoritas pengawasan ke OJK melalui UU P2SK, Kementerian Keuangan menerbitkan PMK Nomor 50 Tahun 2025 (berlaku 1 Agustus 2025) yang memperlakukan kripto setara aset keuangan/surat berharga: PPN atas penyerahan koin dihapus (0%), dan PPh 22 Final menjadi 0,21% (bursa dalam negeri) atau 1% (bursa luar negeri).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 68/PMK.03/2022 (Mei 2022–Jul 2025)',
    newHeader: 'PMK Nomor 50 Tahun 2025 (Mulai 1 Ags 2025)',
    rows: [
      {
        aspek: 'PPh 22 Final Bursa Terdaftar (Dalam Negeri)',
        aturanLama: '0,10% dari nilai transaksi',
        aturanBaru: '0,21% dari nilai transaksi (PPMSE OJK)',
      },
      {
        aspek: 'PPN Penyerahan Koin (Bursa Terdaftar)',
        aturanLama: '0,11% (total beban pajak 0,21%)',
        aturanBaru: '0% (bukan objek PPN)',
      },
      {
        aspek: 'Exchanger Luar Negeri / Non-Terdaftar',
        aturanLama: '0,20% PPh 22 + 0,22% PPN (total 0,42%)',
        aturanBaru: '1,00% PPh 22 Final + 0% PPN',
      },
    ],
  },
  caseExample: {
    title: 'Transaksi jual aset kripto Rp 100 juta di exchanger Bappebti (periode 2022–Jul 2025)',
    scenario:
      'Pada Juni 2024, investor menjual aset kripto Rp 100.000.000 melalui exchanger terdaftar Bappebti: PPh Pasal 22 Final 0,1% = Rp 100.000 dan PPN penyerahan 0,11% = Rp 110.000 (total beban pajak Rp 210.000).',
    presetRegime: 'pph22_pmk68_2022_kripto',
    presetInput: {
      pph22: {
        nilaiDasar: 100000000,
        objectType: 'impor_api',
        hasNpwp: true,
        kriptoChannel: 'dalam_negeri_ojk',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk68_2022KriptoRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiDasar);
    const channel = input.kriptoChannel ?? 'dalam_negeri_ojk';
    const isTerdaftar = channel === 'dalam_negeri_ojk';

    const pph22Rate = isTerdaftar ? 0.1 : 0.2;
    const ppnRate = isTerdaftar ? 0.11 : 0.22;
    const pph22 = Math.round((nilai * pph22Rate) / 100);
    const ppn = Math.round((nilai * ppnRate) / 100);
    const totalTax = pph22 + ppn;
    const netReceived = Math.max(0, nilai - pph22);

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi aset kripto (Fiat / Konversi IDR)', value: nilai },
      {
        label: `PPh Pasal 22 Final (${formatPersen(pph22Rate)})`,
        formula: isTerdaftar
          ? `${formatRupiah(nilai)} x 0,1% (Bursa terdaftar Bappebti)`
          : `${formatRupiah(nilai)} x 0,2% (Non-terdaftar)`,
        value: pph22,
        isHighlight: true,
      },
      {
        label: `PPN Besaran Tertentu (${formatPersen(ppnRate)})`,
        formula: `${formatRupiah(nilai)} x ${formatPersen(ppnRate)} (Era Bappebti s.d. Jul 2025)`,
        value: ppn,
      },
      { label: 'Total beban pajak transaksi (PPh 22 + PPN)', value: totalTax },
      { label: 'Hasil bersih penjual setelah potong PPh 22 Final', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Final Kripto (PMK 68/2022)',
      primaryTaxAmount: pph22,
      annualTaxLabel: 'Total Pajak (PPh 22 + PPN)',
      annualTaxAmount: totalTax,
      effectiveRatePercent: pph22Rate + ppnRate,
      effectiveRateLabel: 'Total Tarif Gabungan (PPh + PPN)',
      takeHomeOrNetLabel: 'Hasil Bersih Penjual (Sebelum Fee)',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        `Pada rezim historis PMK 68/PMK.03/2022 (Mei 2022–Juli 2025), total beban pajak koin terdaftar adalah 0,21% (0,1% PPh 22 + 0,11% PPN), atau 0,42% jika non-terdaftar.`,
        'Sejak 1 Agustus 2025 aturan ini dicabut oleh PMK 50/2025: PPN penyerahan koin dihapus dan tarif PPh 22 Final naik menjadi 0,21% (dalam negeri OJK) atau 1% (luar negeri).',
      ],
    };
  },
};
