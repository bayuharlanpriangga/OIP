import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_163_2012, SRC.PMK_61_2022, SRC.PMK_11_2025];

const regime: TaxRegime = {
  id: 'ppn_pmk163_2012_kms',
  taxType: 'ppn',
  name: 'PMK 163/PMK.03/2012 jo. PMK 61/PMK.03/2022 (PPN Kegiatan Membangun Sendiri / KMS)',
  shortName: '2012–2024 (KMS 2% -> 2,2%)',
  legalBasis: 'PMK Nomor 163/PMK.03/2012 & PMK Nomor 61/PMK.03/2022 (sebelum PMK 11/2025)',
  effectivePeriod: '22 November 2012 – 31 Desember 2024 (Era Tarif 2% & 2,2%)',
  isCurrent: false,
  summary:
    'Membandingkan tarif efektif PPN Kegiatan Membangun Sendiri (KMS) bangunan seluas >= 200 m2 yang tidak dilakukan dalam kegiatan usaha/pekerjaan: era PMK 163/2012 sebesar 2% (10% × DPP 20% biaya bangunan) dan era PMK 61/2022 sebesar 2,2% (11% × DPP 20%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk163-2012-kms-lama',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Evolusi PPN Kegiatan Membangun Sendiri (KMS): Dari 2% (PMK 163/2012) ke 2,2% (PMK 61/2022)',
  legalBasis: 'PMK Nomor 163/PMK.03/2012 jo. PMK Nomor 61/PMK.03/2022',
  effectiveDate: '22 November 2012 – 31 Desember 2024',
  readMinutes: 4,
  summary:
    'Mengulas syarat luas minimal 200 m2 dan komponen biaya pembangunan tidak termasuk harga perolehan tanah dalam PPN KMS pada era PMK 163/2012 (2%) dan PMK 61/2022 (2,2%).',
  sections: [
    {
      heading: 'DPP 20% dari total biaya bulanan tidak termasuk harga tanah',
      paragraphs: [
        'Sesuai PMK 163/PMK.03/2012 (berlaku mulai November 2012) dan diperbarui oleh PMK 61/PMK.03/2022 (mulai 1 April 2022), orang pribadi atau badan yang membangun bangunan sendiri secara sekaligus maupun bertahap dalam jangka waktu maksimal 2 tahun dengan luas keseluruhan minimal 200 m2 wajib menyetor PPN KMS setiap bulan paling lambat tanggal 15 bulan berikutnya.',
        'Dasar Pengenaan Pajak (DPP) adalah 20% dari seluruh biaya yang dikeluarkan untuk membangun (termasuk material dan upah tukang), TIDAK termasuk harga perolehan tanah. Sebelum 1 April 2022 tarif efektifnya 10% × 20% = 2%, lalu naik menjadi 11% × 20% = 2,2% di PMK 61/2022, dan selanjutnya disetarakan kembali pada 2,2% efektif (12% × 11/12 × 20%) sejak PMK 11/2025.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 163/PMK.03/2012 (2012–Mar 2022)',
    newHeader: 'PMK 61/PMK.03/2022 (Apr 2022–2024)',
    rows: [
      {
        aspek: 'Luas bangunan minimal & jangka waktu bertahap',
        aturanLama: '>= 200 m2 (tahapan s.d. 2 tahun)',
        aturanBaru: '>= 200 m2 (tetap, tahapan s.d. 2 tahun)',
      },
      {
        aspek: 'Formula & tarif efektif atas biaya bangunan',
        aturanLama: '10% × 20% = 2,0% efektif',
        aturanBaru: '11% × 20% = 2,2% efektif',
      },
    ],
  },
  caseExample: {
    title: 'Biaya pembangunan rumah sendiri 240 m2 sebesar Rp 600 juta (PMK 163/2012 — 2%)',
    scenario:
      'Orang pribadi mengeluarkan biaya material dan upah pembangunan Rp 600.000.000 (di luar harga tanah). Pada era PMK 163/2012, DPP 20% = Rp 120.000.000 sehingga PPN KMS = 10% × Rp 120.000.000 = Rp 12.000.000 (2% efektif).',
    presetRegime: 'ppn_pmk163_2012_kms',
    presetInput: {
      ppn: {
        hargaJualDpp: 600000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaKmsLama: 'pmk163_2012_2persen',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk163_2012KmsRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const biayaBangun = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaKmsLama ?? 'pmk163_2012_2persen';
    const isPmk61 = skema === 'pmk61_2022_2_2persen';
    const effRate = isPmk61 ? 2.2 : 2.0;
    const dppTertentu = Math.round(biayaBangun * 0.2);
    const ppn = Math.round((biayaBangun * effRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Total biaya membangun sendiri (di luar harga perolehan tanah)', value: biayaBangun },
      { label: 'DPP KMS (20% dari total biaya bangunan)', value: dppTertentu },
      {
        label: isPmk61 ? 'Tarif efektif KMS (PMK 61/2022: 11% x 20%)' : 'Tarif efektif KMS (PMK 163/2012: 10% x 20%)',
        value: effRate,
        format: 'percent',
      },
      {
        label: 'PPN KMS wajib disetor sendiri ke Kas Negara',
        formula: `${formatRupiah(biayaBangun)} x ${formatPersen(effRate)}`,
        value: ppn,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `PPN KMS (${formatPersen(effRate)} Efektif)`,
      primaryTaxAmount: ppn,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Biaya Bangun + PPN KMS',
      takeHomeOrNetAmount: biayaBangun + ppn,
      steps,
      notes: [
        'Objek PPN KMS mensyaratkan luas bangunan keseluruhan paling sedikit 200 m2 dan diperuntukkan bagi tempat tinggal maupun tempat usaha.',
        'Pajak Masukan yang dibayar atas pembelian bahan bangunan pada skema KMS tidak dapat dikreditkan karena memakai skema penghitungan khusus.',
      ],
    };
  },
};
