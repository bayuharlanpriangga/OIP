import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_208_2009, SRC.PMK_255_2008, SRC.KMK_522_2000, SRC.PMK_215_2018];

const regime: TaxRegime = {
  id: 'pph25_kmk522_2000_oppt',
  taxType: 'pph25',
  name: 'KMK 522/2000 jo. PMK 255/2008 & PMK 208/2009 (Angsuran PPh 25 OPPT 0,75%)',
  shortName: '2001–Kini (OPPT Eceran 0,75%)',
  legalBasis: 'KMK 522/KMK.04/2000 stdd PMK 255/PMK.03/2008, PMK 208/PMK.03/2009 & PMK 215/2018',
  effectivePeriod: '1 Januari 2001 – Sekarang (OPPT 0,75% Omzet)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Angsuran WP Orang Pribadi Pengusaha Tertentu (0,75%)',
  summary:
    'Ketentuan angsuran bulanan PPh Pasal 25 bagi Wajib Pajak Orang Pribadi Pengusaha Tertentu (OPPT — pedagang pengecer/penyerah jasa langsung di lebih dari satu tempat usaha/gerai atau omzet > Rp 4,8 M): 0,75% dari jumlah peredaran bruto setiap bulan per tempat usaha (sebelumnya 2% di era awal KMK 522/2000 lalu 0,75% di PMK 255/2008 jo. PMK 208/2009 dan berlanjut ke PMK 215/2018 & PMK 81/2024).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-kmk522-2000-oppt',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Angsuran PPh Pasal 25 Wajib Pajak OP Pengusaha Tertentu (OPPT 0,75% Omzet)',
  legalBasis: 'KMK 522/KMK.04/2000, PMK 255/PMK.03/2008, PMK 208/PMK.03/2009 & PMK 215/PMK.03/2018',
  effectiveDate: '1 Januari 2001 (Tarif 0,75% mulai 1 Januari 2009)',
  readMinutes: 4,
  summary:
    'Pelaku usaha ritel Orang Pribadi dengan banyak gerai atau tidak memakai tarif UMKM 0,5% menghitung cicilan PPh Pasal 25 langsung 0,75% dari omzet bruto bulanan di masing-masing lokasi usaha sebagai kredit pajak SPT Tahunan.',
  sections: [
    {
      heading: 'Dari 2% (KMK 522/2000) turun ke 0,75% (PMK 255/2008 jo. PMK 208/2009)',
      paragraphs: [
        'Pada awal penerapannya melalui KMK 522/KMK.04/2000, WP Orang Pribadi Pengusaha Tertentu (pedagang eceran dengan tempat usaha tersebar atau di mal) dikenakan angsuran PPh Pasal 25 sebesar 2% dari peredaran bruto bulanan, yang kemudian diringankan secara signifikan menjadi 0,75% melalui PMK 255/PMK.03/2008 jo. PMK 208/PMK.03/2009 per 1 Januari 2009.',
        'Aturan tarif 0,75% bagi OPPT terus dilanjutkan dalam PMK 215/PMK.03/2018 hingga PMK 81 Tahun 2024 dan menjadi alternatif utama bagi pengusaha toko ritel beromzet di atas Rp 4,8 miliar/tahun atau yang memilih pembukuan/norma dibanding PPh Final UMKM 0,5%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 522/KMK.04/2000 (2001–2008)',
    newHeader: 'PMK 208/2009 – PMK 81/2024 (2009–Kini)',
    rows: [
      {
        aspek: 'Tarif angsuran PPh 25 OPPT per bulan',
        aturanLama: '2% (lalu 1%) dari peredaran bruto bulanan',
        aturanBaru: '0,75% dari peredaran bruto bulanan tiap gerai/tempat usaha',
      },
      {
        aspek: 'Sifat setoran bulanan',
        aturanLama: 'Kredit Pajak (Tidak Final) di SPT Tahunan OP',
        aturanBaru: 'Kredit Pajak (Tidak Final), dikompensasikan dengan Pasal 17 tahunan',
      },
    ],
  },
  caseExample: {
    title: 'Pengusaha toko ritel OPPT beromzet Rp 450 juta/bulan di tiga cabang',
    scenario:
      'WP Orang Pribadi Pengusaha Tertentu yang sudah melewati batas omzet UMKM Rp 4,8 miliar/tahun mencatat peredaran bruto bulan ini Rp 450.000.000, sehingga angsuran PPh 25 OPPT adalah 0,75% × Rp 450.000.000 = Rp 3.375.000.',
    presetRegime: 'pph25_kmk522_2000_oppt',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 0,
        bulanBerjalan: 12,
        omzetOpptBulanan: 450000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Kmk522_2000OpptRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulanan = Math.max(0, input.omzetOpptBulanan ?? 0);
    const rate = 0.75;
    const angsuran = Math.round((omzetBulanan * rate) / 100);
    const proyeksiSetahun = angsuran * 12;

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto (omzet) usaha eceran/jasa OPPT bulan ini', value: omzetBulanan },
      { label: 'Tarif angsuran PPh 25 OPPT (PMK 208/2009 jo. PMK 215/2018)', value: rate, format: 'percent' },
      {
        label: 'Angsuran PPh Pasal 25 OPPT wajib disetor',
        formula: `${formatRupiah(omzetBulanan)} x ${formatPersen(rate)}`,
        value: angsuran,
        isHighlight: true,
      },
      { label: 'Proyeksi kredit pajak PPh 25 dalam 1 tahun (12x)', value: proyeksiSetahun },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh 25 OPPT (0,75% Omzet)',
      primaryTaxAmount: angsuran,
      annualTaxLabel: 'Akumulasi Kredit Pajak 12 Bulan',
      annualTaxAmount: proyeksiSetahun,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Omzet Bersih Setelah Angsuran PPh 25 OPPT',
      takeHomeOrNetAmount: Math.max(0, omzetBulanan - angsuran),
      steps,
      notes: [
        'Penyetoran 0,75% per bulan oleh OPPT bersifat Tidak Final dan berfungsi sebagai kredit pajak yang diperhitungkan terhadap PPh Orang Pribadi terutang pada SPT Tahunan.',
        'Apabila omzet masih <= Rp 4,8 M dan WP OP menggunakan skema PPh Final UMKM 0,5% (PP 55/2022), maka ketentuan angsuran OPPT 0,75% tidak perlu dibayar bersamaan.',
      ],
    };
  },
};
