import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'umkm_pp23_2018',
  taxType: 'pph_umkm',
  name: 'PP 23 Tahun 2018',
  shortName: '2018–2021 (0,5% Penuh)',
  legalBasis: 'PP Nomor 23 Tahun 2018',
  effectivePeriod: '1 Juli 2018 – 31 Desember 2021',
  isCurrent: false,
  summary:
    'Tarif turun menjadi 0,5%, tetapi seluruh Wajib Pajak Orang Pribadi maupun Badan tetap dikenakan sejak Rupiah pertama tanpa batas bebas Rp 500 juta.',
  sources: [SRC.PP_23_2018, SRC.PP_46_2013],
};

const article: TaxArticle = {
  id: 'umkm-pp23-2018',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'PP 23/2018: Pemangkasan PPh Final UMKM 0,5% dan Batas Jangka Waktu (2018–2021)',
  legalBasis: 'PP Nomor 23 Tahun 2018',
  effectiveDate: '1 Juli 2018',
  readMinutes: 4,
  summary:
    'Menggantikan tarif 1% PP 46/2013 menjadi 0,5% dari omzet bruto disertai masa transisi maksimal 3–7 tahun, namun belum memiliki kuota bebas pajak Rp 500 juta bagi Orang Pribadi.',
  sections: [
    {
      heading: 'Dari tarif 1% ke 0,5% tanpa lapisan bebas pajak Rp 500 juta',
      paragraphs: [
        'Berlaku mulai 1 Juli 2018, PP Nomor 23 Tahun 2018 merespons keluhan pelaku usaha kecil dengan memangkas tarif PPh Final UMKM dari 1% menjadi 0,5% dari peredaran bruto setiap bulan, tetap dengan ambang omzet tahunan paling banyak Rp 4,8 miliar.',
        'Berbeda dari PP 55/2022 yang baru lahir tahun 2022, pada era PP 23/2018 Wajib Pajak Orang Pribadi belum mendapatkan batas omzet bebas pajak Rp 500 juta. Sejak rupiah pertama penjualan dalam bulan berjalan, pelaku usaha langsung menyetor 0,5%.',
      ],
    },
    {
      heading: 'Pembatasan jangka waktu 7, 4, dan 3 tahun',
      paragraphs: [
        'PP 23/2018 memosisikan tarif 0,5% sebagai masa belajar pembukuan dengan batas waktu maksimal: 7 tahun pajak untuk Wajib Pajak Orang Pribadi, 4 tahun untuk Koperasi/CV/Firma, dan 3 tahun untuk Perseroan Terbatas, sebelum Wajib Pajak beralih menghitung pajak berbasis penghasilan neto.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 46/2013 (2013–Jun 2018)',
    newHeader: 'PP 23/2018 (Jul 2018–2021)',
    rows: [
      {
        aspek: 'Tarif PPh Final dari omzet bruto',
        aturanLama: '1% (sejak rupiah pertama)',
        aturanBaru: '0,5% (sejak rupiah pertama)',
      },
      {
        aspek: 'Batas jangka waktu fasilitas',
        aturanLama: 'Tidak dibatasi jangka waktu',
        aturanBaru: '7 th (OP), 4 th (CV/Firma/Koperasi), 3 th (PT)',
      },
    ],
  },
  caseExample: {
    title: 'Toko retail beromzet Rp 45 juta/bulan di era PP 23/2018',
    scenario:
      'Pedagang Orang Pribadi dengan akumulasi omzet Rp 250 juta membukukan omzet Rp 45.000.000 pada bulan berjalan. Di era PP 23/2018 (belum ada bebas Rp 500 juta), terutang 0,5% penuh yaitu Rp 225.000.',
    presetRegime: 'umkm_pp23_2018',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 45000000,
        akumulasiOmzetSebelumnya: 250000000,
        subjectType: 'orang_pribadi',
      },
    },
  },
};

export const umkmPp23_2018Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const tarif = 0.5;
    const taxAmount = Math.round((omzetBulan * tarif) / 100);
    const totalAkumulasi = akumulasiPrev + omzetBulan;
    const notes: string[] = [];

    if (totalAkumulasi > 4800000000) {
      notes.push(
        'Peringatan: Akumulasi omzet melebihi Rp 4,8 miliar dalam satu tahun pajak. Mulai tahun pajak berikutnya wajib memakai tarif umum.'
      );
    }

    const steps: CalculationStep[] = [
      { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
      { label: 'Akumulasi omzet s.d. bulan sebelumnya', value: akumulasiPrev },
      { label: 'Dasar pengenaan PPh Final UMKM bulan ini', value: omzetBulan },
      { label: `Tarif PPh Final (${regime.shortName})`, value: tarif, format: 'percent' },
      { label: 'PPh Final UMKM terutang bulan ini', value: taxAmount, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final UMKM Bulan Ini',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: omzetBulan > 0 ? tarif : 0,
      takeHomeOrNetLabel: 'Sisa Omzet Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, omzetBulan - taxAmount),
      steps,
      notes,
    };
  },
};
