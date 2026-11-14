import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'umkm_pp20_2026',
  taxType: 'pph_umkm',
  name: 'PP 20/2026 (Perubahan PP 55/2022)',
  shortName: 'Apr 2026–Sekarang (PP 20/2026)',
  legalBasis: 'PP Nomor 20 Tahun 2026 tentang Perubahan atas PP Nomor 55 Tahun 2022',
  effectivePeriod: '22 April 2026 – Sekarang',
  isCurrent: true,
  summary:
    'Mempertahankan tarif 0,5%, batas omzet Rp 4,8 miliar, dan bebas pajak Rp 500 juta bagi Orang Pribadi. Tanpa batas waktu untuk WP OP dan Perseroan Perorangan, sedangkan Koperasi dibatasi maks 4 tahun (transisi s.d. 2029) dan CV/Firma/PT umum dikeluarkan kecuali sisa masa transisinya.',
  sources: [SRC.PP_20_2026, SRC.PP_20_2026_SETNEG, SRC.PP_20_2026_BPK, SRC.PP_55_2022],
  verifiedAt: '14 November 2026',
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
        'Fasilitas omzet bebas pajak sampai dengan Rp 500.000.000 per tahun bagi Wajib Pajak Orang Pribadi (Pasal 60 ayat (2) PP 55/2022) tetap dipertahankan. Perubahan utamanya adalah penghapusan Pasal 59 PP 55/2022 sehingga WP Orang Pribadi dan Perseroan Perorangan yang memenuhi syarat dapat memanfaatkannya tanpa batas jangka waktu selama omzet gabungan tidak melewati Rp 4,8 miliar. Namun demikian, untuk Koperasi jangka waktunya tetap dibatasi maksimal 4 tahun pajak sejak terdaftar (Pasal 57 PP 55/2022 stdd PP 20/2026), dengan perpanjangan transisi sampai Tahun Pajak 2029 bagi koperasi terdaftar sebelumnya yang masa pemanfaatannya berakhir pada 2024–2029.',
      ],
    },
    {
      heading: 'Pengetatan subjek penerima, masa transisi CV/PT, dan pencegahan pemecahan usaha',
      paragraphs: [
        'Agar tepat sasaran bagi pelaku usaha mikro dan kecil murni, PP 20/2026 mempersempit penerima fasilitas baru menjadi Wajib Pajak Orang Pribadi, Perseroan Perorangan (yang didirikan 1 orang), dan Koperasi dalam negeri. Badan usaha berbentuk CV, Firma, BUMDes, dan PT umum (non-perorangan) tidak lagi berhak menjadi subjek baru PPh Final 0,5%; namun entitas yang telah terdaftar sebelumnya tetap menyelesaikan sisa masa pemanfaatannya di bawah PP 55/2022 hingga habis (maksimal 3 tahun pajak untuk PT dan 4 tahun pajak untuk CV/Firma/BUMDes — misalnya CV yang terdaftar pada 2023 masih berhak hingga akhir TP 2026) sebelum beralih ke tarif umum PPh Badan.',
        'Selain itu, jasa sehubungan dengan pekerjaan bebas—seperti pengacara, akuntan, arsitek, dokter, notaris, konsultan, trainer, agen asuransi, hingga pembuat konten/influencer—dikecualikan dari skema PPh Final 0,5%. PP 20/2026 juga memperkenalkan ketentuan penggabungan omzet keluarga dan entitas terkait untuk mencegah praktik pemecahan usaha (fragmentation) guna menghindari ambang batas Rp 4,8 miliar.',
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
        aspek: 'Jangka waktu pemanfaatan',
        aturanLama: '7 thn (OP), 4 thn (CV/Koperasi), 3 thn (PT) — Pasal 59',
        aturanBaru: 'OP & Perseroan Perorangan tanpa batas waktu; Koperasi maks 4 thn (transisi s.d. 2029)',
      },
      {
        aspek: 'Subjek Badan yang berhak',
        aturanLama: 'PT, CV, Firma, Koperasi, Perseroan Perorangan',
        aturanBaru: 'Hanya Perseroan Perorangan & Koperasi (CV/Firma/PT umum cek masa transisi)',
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
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const umkmPp20_2026Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const omzetTerkaitPrev = Math.max(0, input.omzetTerkaitSebelumnya ?? 0);
    const totalAkumulasiSendiri = akumulasiPrev + omzetBulan;
    const totalOmzetGabungan = totalAkumulasiSendiri + omzetTerkaitPrev;
    const notes: string[] = [];

    const isFreeProfExcluded =
      input.subjectType === 'orang_pribadi' && Boolean(input.isFreeProfession);
    const isBadanUmum = input.subjectType === 'badan_usaha';
    const inEntityTransition = isBadanUmum && Boolean(input.isEntityInTransition);

    if (isFreeProfExcluded) {
      notes.push(
        'Peringatan: Jasa sehubungan dengan pekerjaan bebas (dokter, pengacara, akuntan, arsitek, notaris, konsultan, agen, maupun kreator konten/influencer) dikecualikan dari fasilitas PPh Final UMKM 0,5% berdasarkan PP 55/2022 jo. PP 20/2026. Penghasilan tersebut dikenai tarif progresif Pasal 17 UU PPh (menggunakan Norma Penghitungan Penghasilan Neto / NPPN bila omzet < Rp 4,8 miliar dan menyampaikan pemberitahuan, atau pembukuan).'
      );
      return {
        regime,
        primaryTaxLabel: 'Status Fasilitas PPh Final UMKM (Pekerjaan Bebas)',
        primaryTaxAmount: 0,
        isNotCalculated: true,
        primaryTaxDisplay: 'Dikecualikan — pakai NPPN / Pasal 17',
        effectiveRatePercent: 0,
        takeHomeOrNetLabel: 'Omzet Bruto (Dihitung via PPh Umum / NPPN)',
        takeHomeOrNetAmount: omzetBulan,
        steps: [
          { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
          {
            label: 'Status kategori usaha di PP 20/2026',
            formula: 'Pekerjaan bebas / kreator konten dikecualikan dari PPh Final 0,5%',
            value: 0,
            format: 'percent',
          },
        ],
        notes,
      };
    }

    if (isBadanUmum && !inEntityTransition) {
      notes.push(
        'Peringatan: Berdasarkan PP 20/2026 (berlaku 22 April 2026), CV, Firma, BUMDes, dan PT umum bukan lagi subjek baru PPh Final UMKM 0,5%. Entitas yang sudah terdaftar sebelumnya hanya tetap berhak sampai sisa jangka waktu ketentuan lama habis (maksimal 3 tahun pajak untuk PT dan 4 tahun pajak untuk CV/Firma/BUMDes sejak terdaftar — misalnya CV terdaftar sejak 2023 menyelesaikan haknya s.d. akhir TP 2026). Centang opsi "Masih memiliki sisa masa transisi" bila badan usaha Anda masih berada dalam sisa jangka waktu tersebut.'
      );
      return {
        regime,
        primaryTaxLabel: 'Status PPh Final UMKM (CV / Firma / PT Umum / BUMDes)',
        primaryTaxAmount: 0,
        isNotCalculated: true,
        primaryTaxDisplay: 'Tidak dihitung — wajib PPh Badan umum',
        effectiveRatePercent: 0,
        takeHomeOrNetLabel: 'Omzet Bruto (Gunakan Tarif PPh Badan Pasal 17 / 31E)',
        takeHomeOrNetAmount: omzetBulan,
        steps: [
          { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
          { label: 'Akumulasi omzet s.d. bulan sebelumnya', value: akumulasiPrev },
          {
            label: 'Kewajiban pajak di bawah PP 20/2026',
            formula: 'Bukan subjek baru; beralih ke PPh Badan umum (atau centang sisa masa transisi)',
            value: 0,
            format: 'percent',
          },
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
      { label: 'Akumulasi omzet sendiri s.d. bulan sebelumnya', value: akumulasiPrev },
    ];

    if (omzetTerkaitPrev > 0) {
      steps.push({
        label: 'Omzet gabungan keluarga / entitas terkait (anti-pecah usaha)',
        formula: 'Diperhitungkan terhadap batas Rp 4,8 miliar/thn PP 20/2026',
        value: omzetTerkaitPrev,
      });
    }

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
      {
        label: inEntityTransition
          ? 'Tarif PPh Final UMKM (sisa masa transisi PP 55/2022)'
          : 'Tarif PPh Final PP 20/2026',
        value: tarif,
        format: 'percent',
      },
      { label: 'PPh Final UMKM terutang bulan ini', value: taxAmount, isHighlight: true }
    );

    if (inEntityTransition) {
      notes.push(
        'Simulasi ini menghitung PPh Final 0,5% sejak Rupiah pertama bagi CV, Firma, BUMDes, atau PT umum yang masih memiliki sisa jangka waktu ketentuan lama (maksimal 3 tahun pajak PT atau 4 tahun pajak CV/Firma/BUMDes sejak terdaftar). Setelah masa tersebut berakhir, badan usaha wajib memakai pembukuan dan tarif PPh Badan umum.'
      );
    } else if (input.subjectType === 'orang_pribadi') {
      if (taxAmount === 0) {
        notes.push(
          `Akumulasi omzet tahunan (${formatRupiah(totalAkumulasiSendiri)}) masih di bawah Rp 500.000.000, sehingga PPh Final bulan ini Rp 0. Jasa pekerjaan bebas dikecualikan dari tarif 0,5%.`
        );
      } else if (omzetBebas > 0) {
        notes.push(
          `Sebesar ${formatRupiah(omzetBebas)} dari omzet bulan ini bebas pajak; hanya selisihnya (${formatRupiah(omzetKenaPajak)}) yang dikenakan tarif 0,5%.`
        );
      }
      notes.push(
        'Pasal 59 PP 55/2022 mengenai batas jangka waktu 7 tahun telah dihapus oleh PP 20/2026, sehingga WP OP non-pekerjaan bebas dapat terus menggunakan tarif 0,5% sepanjang omzet gabungan tidak melampaui Rp 4,8 miliar/tahun.'
      );
    } else if (input.subjectType === 'koperasi') {
      notes.push(
        'Koperasi dalam negeri tetap berhak atas tarif PPh Final 0,5% di bawah PP 20/2026, namun tidak memperoleh kuota bebas pajak Rp 500 juta (dihitung sejak Rupiah pertama) dan dibatasi maksimal 4 tahun pajak sejak terdaftar (Pasal 57 PP 55/2022 stdd PP 20/2026). Koperasi yang telah terdaftar sebelum PP 20/2026 dengan akhir masa pemanfaatan 2024–2029 memperoleh perpanjangan masa transisi hingga Tahun Pajak 2029.'
      );
    } else {
      notes.push(
        'Perseroan Perorangan yang memenuhi syarat berhak atas tarif 0,5% tanpa batas jangka waktu setelah Pasal 59 dihapus, namun tidak memperoleh kuota bebas pajak Rp 500 juta (dihitung sejak Rupiah pertama).'
      );
    }

    if (omzetTerkaitPrev > 0) {
      notes.push(
        `Total omzet gabungan (sendiri + keluarga/entitas terkait) sebesar ${formatRupiah(totalOmzetGabungan)} diuji terhadap ambang batas Rp 4,8 miliar berdasarkan ketentuan anti-pecah usaha PP 20/2026.`
      );
    } else {
      notes.push(
        'PP 20/2026 menerapkan ketentuan penggabungan omzet keluarga/entitas terkait untuk mencegah pemecahan usaha (fragmentation) guna menghindari batas Rp 4,8 miliar.'
      );
    }

    if (totalOmzetGabungan > 4800000000) {
      notes.push(
        `Peringatan: Akumulasi omzet gabungan (${formatRupiah(totalOmzetGabungan)}) melampaui Rp 4,8 miliar dalam satu tahun pajak. Mulai tahun pajak berikutnya Wajib Pajak wajib menggunakan pembukuan dan tarif PPh umum.`
      );
    }

    return {
      regime,
      primaryTaxLabel: inEntityTransition
        ? 'PPh Final UMKM Bulan Ini (Masa Transisi)'
        : 'PPh Final UMKM Bulan Ini',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Sisa Omzet Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, omzetBulan - taxAmount),
      steps,
      notes,
    };
  },
};
