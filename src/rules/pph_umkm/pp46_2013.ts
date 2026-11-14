import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'umkm_pp46_2013',
  taxType: 'pph_umkm',
  name: 'PP 46 Tahun 2013',
  shortName: '2013–2018 (Tarif 1%)',
  legalBasis: 'PP Nomor 46 Tahun 2013',
  effectivePeriod: '1 Juli 2013 – 30 Juni 2018',
  isCurrent: false,
  summary:
    'Tarif final 1% dari peredaran bruto bulanan bagi usaha beromzet maksimal Rp 4,8 miliar setahun tanpa fasilitas pembebasan omzet.',
  sources: [SRC.PP_46_2013, SRC.PP_23_2018],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'umkm-pp46-2013',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'PPh Final 1% PP 46/2013 dan Transisi Menuju PP 23/2018',
  legalBasis: 'PP Nomor 46 Tahun 2013 & PP Nomor 23 Tahun 2018',
  effectiveDate: '1 Juli 2013',
  readMinutes: 4,
  summary:
    'Kilas balik penerapan pertama pajak final berbasis omzet bruto 1% untuk pelaku UMKM sebelum dipangkas menjadi 0,5% pada pertengahan 2018.',
  sections: [
    {
      heading: 'Tujuan penyederhanaan pembukuan di PP 46/2013',
      paragraphs: [
        'PP 46/2013 diterbitkan untuk memberi kemudahan administrasi bagi Wajib Pajak dengan peredaran bruto di bawah Rp 4,8 miliar dalam satu tahun pajak. Pelaku usaha cukup menyetor 1% dari total penjualan kotor setiap bulan paling lambat tanggal 15 bulan berikutnya tanpa harus menyusun rekonsiliasi fiskal laba-rugi.',
        'Namun dalam praktiknya, tarif 1% dari omzet dirasa berat bagi pedagang dengan margin laba tipis. Ketika margin bersih usaha hanya 5% hingga 8%, pajak 1% dari omzet setara dengan 12% hingga 20% dari laba bersih.',
      ],
    },
    {
      heading: 'Pemangkasan tarif dan batas waktu pemanfaatan di PP 23/2018',
      paragraphs: [
        'Mulai 1 Juli 2018, PP 23/2018 menurunkan tarif menjadi 0,5% sekaligus memperkenalkan batas jangka waktu pemakaian skema final: 7 tahun bagi Orang Pribadi, 4 tahun bagi CV/Firma/Koperasi, dan 3 tahun bagi Perseroan Terbatas.',
      ],
    },
  ],
  caseExample: {
    title: 'Simulasi omzet bulanan Rp 68,5 juta di era tarif 1%',
    scenario:
      'Usaha dagang beromzet Rp 68.500.000 per bulan dihitung menggunakan tarif final 1% PP 46/2013 tanpa lapisan bebas omzet.',
    presetRegime: 'umkm_pp46_2013',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 68500000,
        akumulasiOmzetSebelumnya: 465000000,
        subjectType: 'orang_pribadi',
      },
    },
  },
};

export const umkmPp46_2013Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const tarif = 1.0;
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
