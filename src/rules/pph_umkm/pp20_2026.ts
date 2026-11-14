import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'umkm_pp20_2026',
  taxType: 'pph_umkm',
  name: 'PP 20/2026 (Perubahan PP 55/2022)',
  shortName: 'Apr 2026–Sekarang (PP 20/2026)',
  legalBasis: 'PP Nomor 20 Tahun 2026 tentang Perubahan atas PP Nomor 55 Tahun 2022',
  effectivePeriod: '22 April 2026 – Sekarang',
  isCurrent: true,
  summary:
    'Mempertahankan tarif 0,5%, batas omzet Rp 4,8 miliar, dan bebas pajak Rp 500 juta untuk Orang Pribadi, namun menghapus batas jangka waktu Pasal 59, mengecualikan CV/PT umum serta jasa pekerjaan bebas, dan mencegah pemecahan usaha.',
  sources: [SRC.PP_20_2026, SRC.PP_20_2026_SETNEG, SRC.PP_20_2026_BPK, SRC.PP_55_2022],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'umkm-pp20-2026',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'PP 20/2026: Revisi PPh Final UMKM 0,5%, Hapusnya Pasal 59, dan Pengetatan Subjek',
  legalBasis: 'PP Nomor 20 Tahun 2026 jo. PP Nomor 55 Tahun 2022',
  effectiveDate: '22 April 2026',
  readMinutes: 5,
  summary:
    'Berlaku sejak 22 April 2026, PP 20/2026 mempertahankan tarif 0,5% dan pembebasan Rp 500 juta untuk Orang Pribadi, tetapi menghapus batas jangka waktu Pasal 59 serta mengeluarkan CV, PT umum, dan jasa pekerjaan bebas dari skema PPh Final UMKM.',
  sections: [
    {
      heading: 'Tarif 0,5% dan kuota bebas Rp 500 juta dipertahankan, Pasal 59 dihapus',
      paragraphs: [
        'PP Nomor 20 Tahun 2026 yang ditetapkan dan mulai berlaku pada 22 April 2026 merevisi ketentuan PPh Final UMKM dalam PP 55/2022. Besaran tarif tetap 0,5% dari peredaran bruto dengan ambang batas omzet usaha tetap Rp 4,8 miliar per tahun pajak.',
        'Fasilitas omzet bebas pajak sampai dengan Rp 500.000.000 per tahun bagi Wajib Pajak Orang Pribadi (Pasal 60 ayat (2) PP 55/2022) tetap dipertahankan. Perubahan besarnya adalah penghapusan Pasal 59 PP 55/2022 yang sebelumnya membatasi jangka waktu insentif (7 tahun OP, 4 tahun koperasi/CV/firma, 3 tahun PT), sehingga WP Orang Pribadi dan Perseroan Perorangan yang memenuhi syarat dapat memanfaatkannya selama omzet tidak melewati Rp 4,8 miliar.',
      ],
    },
    {
      heading: 'Pengetatan subjek penerima dan pencegahan pemecahan usaha',
      paragraphs: [
        'Agar tepat sasaran bagi pelaku usaha mikro dan kecil murni, PP 20/2026 mempersempit penerima fasilitas menjadi Wajib Pajak Orang Pribadi, Perseroan Perorangan (yang didirikan 1 orang), dan Koperasi dalam negeri. Badan usaha berbentuk CV, Firma, dan PT umum (non-perorangan) tidak lagi termasuk penerima fasilitas PPh Final 0,5% dan wajib beralih ke tarif umum PPh Badan.',
        'Selain itu, jasa sehubungan dengan pekerjaan bebas—seperti pengacara, akuntan, arsitek, dokter, notaris, konsultan, trainer, agen asuransi, hingga pembuat konten/influencer—dikecualikan dari skema PPh Final 0,5%. PP 20/2026 juga memperkenalkan ketentuan penggabungan omzet keluarga dan perseroan perorangan tertentu untuk mencegah praktik pemecahan usaha (fragmentation) guna menghindari ambang batas Rp 4,8 miliar.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 55/2022 (2022–Apr 2026)',
    newHeader: 'PP 20/2026 (22 Apr 2026–Kini)',
    rows: [
      {
        aspek: 'Tarif & batas omzet tahunan',
        aturanLama: '0,5% (omzet maks Rp 4,8 miliar/thn)',
        aturanBaru: 'Tetap 0,5% (omzet maks Rp 4,8 miliar/thn)',
      },
      {
        aspek: 'Batas bebas Rp 500 jt (WP OP)',
        aturanLama: 'Berlaku untuk WP Orang Pribadi',
        aturanBaru: 'Tetap berlaku untuk WP Orang Pribadi',
      },
      {
        aspek: 'Jangka waktu (Pasal 59)',
        aturanLama: '7 thn (OP), 4 thn (CV/Koperasi), 3 thn (PT)',
        aturanBaru: 'Pasal 59 dihapus (tanpa batas waktu bagi yang berhak)',
      },
      {
        aspek: 'Subjek Badan yang berhak',
        aturanLama: 'PT, CV, Firma, Koperasi, Perseroan Perorangan',
        aturanBaru: 'Hanya Perseroan Perorangan & Koperasi (CV/PT umum keluar)',
      },
      {
        aspek: 'Pekerjaan bebas & anti-pecah usaha',
        aturanLama: 'Pekerjaan bebas dikecualikan secara umum',
        aturanBaru: 'Pekerjaan bebas & kreator konten dikecualikan + penggabungan omzet',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi WP Orang Pribadi dan Perseroan Perorangan pasca-PP 20/2026',
    scenario:
      'WP Orang Pribadi memiliki akumulasi omzet sebelumnya Rp 465 juta dan omzet bulan ini Rp 68,5 juta di bawah PP 20/2026.',
    presetRegime: 'umkm_pp20_2026',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 68500000,
        akumulasiOmzetSebelumnya: 465000000,
        subjectType: 'orang_pribadi',
      },
    },
  },
};

export const umkmPp20_2026Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const totalAkumulasi = akumulasiPrev + omzetBulan;
    const notes: string[] = [];

    const isIneligibleEntity = input.subjectType === 'badan_usaha';

    if (isIneligibleEntity) {
      notes.push(
        'Peringatan: Berdasarkan PP 20/2026 (berlaku 22 April 2026), CV, Firma, dan PT umum tidak lagi berhak menggunakan skema PPh Final UMKM 0,5% dan wajib menghitung pajak menggunakan pembukuan serta tarif umum PPh Badan (termasuk fasilitas Pasal 31E).'
      );
      return {
        regime,
        primaryTaxLabel: 'PPh Final UMKM (Tidak Berlaku untuk CV/PT Umum)',
        primaryTaxAmount: 0,
        effectiveRatePercent: 0,
        takeHomeOrNetLabel: 'Omzet Bruto (Wajib Tarif Umum PPh Badan)',
        takeHomeOrNetAmount: omzetBulan,
        steps: [
          { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
          {
            label: 'Status subjek di bawah PP 20/2026',
            formula: 'CV / Firma / PT Umum dikecualikan dari PPh Final 0,5%',
            value: 0,
            format: 'percent',
          },
          { label: 'PPh Final UMKM terutang', value: 0, isHighlight: true },
        ],
        notes,
      };
    }

    const tarif = 0.5;
    let omzetBebas = 0;
    let omzetKenaPajak = omzetBulan;

    if (input.subjectType === 'orang_pribadi') {
      const batasBebas = 500000000;
      const sisaKuotaBebas = Math.max(0, batasBebas - akumulasiPrev);
      omzetBebas = Math.min(omzetBulan, sisaKuotaBebas);
      omzetKenaPajak = Math.max(0, omzetBulan - omzetBebas);
    }

    const taxAmount = Math.round((omzetKenaPajak * tarif) / 100);
    const effectiveRate = omzetBulan > 0 ? (taxAmount / omzetBulan) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
      { label: 'Akumulasi omzet s.d. bulan sebelumnya', value: akumulasiPrev },
    ];

    if (input.subjectType === 'orang_pribadi') {
      steps.push({
        label: 'Bagian omzet bebas pajak (kuota Rp 500 jt/thn)',
        formula: 'Pasal 60 ayat (2) PP 55/2022 jo. PP 20/2026',
        value: -omzetBebas,
        isNegative: true,
      });
    }

    steps.push(
      { label: 'Dasar pengenaan PPh Final UMKM bulan ini', value: omzetKenaPajak },
      { label: 'Tarif PPh Final PP 20/2026', value: tarif, format: 'percent' },
      { label: 'PPh Final UMKM terutang bulan ini', value: taxAmount, isHighlight: true }
    );

    if (input.subjectType === 'orang_pribadi') {
      if (taxAmount === 0) {
        notes.push(
          `Akumulasi omzet tahunan (${formatRupiah(totalAkumulasi)}) masih di bawah Rp 500.000.000, sehingga PPh Final bulan ini Rp 0. Jasa pekerjaan bebas (termasuk konsultan, dokter, pengacara, dan kreator konten) dikecualikan dari tarif 0,5%.`
        );
      } else if (omzetBebas > 0) {
        notes.push(
          `Sebesar ${formatRupiah(omzetBebas)} dari omzet bulan ini bebas pajak; hanya selisihnya (${formatRupiah(omzetKenaPajak)}) yang dikenakan tarif 0,5%.`
        );
      }
      notes.push(
        'Pasal 59 PP 55/2022 mengenai batas jangka waktu 7 tahun telah dihapus oleh PP 20/2026, sehingga WP OP non-pekerjaan bebas dapat terus menggunakan tarif 0,5% sepanjang omzet gabungan tidak melampaui Rp 4,8 miliar/tahun.'
      );
    } else {
      notes.push(
        'Perseroan Perorangan dan Koperasi dalam negeri tetap berhak atas tarif 0,5% di bawah PP 20/2026 (tanpa batas waktu Pasal 59), namun tidak memperoleh kuota bebas pajak Rp 500 juta sehingga dihitung dari Rupiah pertama.'
      );
    }

    notes.push(
      'PP 20/2026 menerapkan ketentuan penggabungan omzet keluarga/entitas terkait untuk mencegah pemecahan usaha (fragmentation) guna menghindari batas Rp 4,8 miliar.'
    );

    if (totalAkumulasi > 4800000000) {
      notes.push(
        'Peringatan: Akumulasi omzet melebihi Rp 4,8 miliar dalam satu tahun pajak. Mulai tahun pajak berikutnya Wajib Pajak wajib menggunakan pembukuan dan tarif umum.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Final UMKM Bulan Ini',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Sisa Omzet Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, omzetBulan - taxAmount),
      steps,
      notes,
    };
  },
};
