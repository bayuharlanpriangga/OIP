import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_fasilitas',
  taxType: 'bea_masuk',
  name: 'Pembebasan & Penangguhan Bea Masuk (Pasal 25–26, PMK 99/2025, BKPM, KITE & KB/KEK/IKN)',
  shortName: '2009–Kini (KITE / BKPM / KEK)',
  legalBasis:
    'Pasal 25–26 UU Kepabeanan, PMK 99 Tahun 2025 (Hibah Sosial/Bencana), PMK 176/PMK.011/2009 stdd PMK 188/2015, PMK 149/PMK.04/2022, PMK 145/PMK.04/2022, PMK 131/2018, PP 40/2021 & PMK 28/2024',
  effectivePeriod: '16 November 2009 – Sekarang (Hibah PMK 99/2025 Berlaku 27 Feb 2026)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Fasilitas Kepabeanan + PMK 99/2025)',
  summary:
    'Fasilitas pembebasan mutlak Pasal 25 termasuk hibah ibadah/sosial/bencana (PMK 99/2025), pembebasan mesin/bahan baku BKPM (PMK 176/2009 jo. PMK 188/2015), KITE Pembebasan (PMK 149/2022), KITE Pengembalian (PMK 145/2022), serta penangguhan/pembebasan di Kawasan Berikat, KEK, dan IKN.',
  sources: [
    SRC.PMK_99_2025,
    SRC.PMK_149_2022,
    SRC.PMK_145_2022,
    SRC.PMK_176_2009,
    SRC.PMK_188_2015,
    SRC.PMK_131_2018,
    SRC.PP_40_2021,
    SRC.PMK_28_2024,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-fasilitas-kite-bkpm',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Fasilitas Pembebasan & Penangguhan Bea Masuk: Pasal 25–26, PMK 99/2025, BKPM, KITE, KB, KEK & IKN',
  legalBasis:
    'Pasal 25–26 UU Kepabeanan, PMK 99/2025, PMK 176/2009 stdd PMK 188/2015, PMK 149/2022, PMK 145/2022, PMK 131/2018, PP 40/2021 & PMK 28/2024',
  effectiveDate: '16 November 2009 (Diperbarui KITE 2022, IKN 2024 & PMK 99/2025 pada 27 Feb 2026)',
  readMinutes: 6,
  summary:
    'Undang-Undang Kepabeanan menyediakan beragam fasilitas pembebasan, penangguhan, dan pengembalian Bea Masuk bagi diplomasi/riset, hibah sosial/bencana (PMK 99/2025), industri penanaman modal (BKPM/OSS), eksportir KITE, Kawasan Berikat, KEK, dan pembangunan IKN.',
  sections: [
    {
      heading: 'Pembebasan Mutlak Pasal 25, PMK 99/2025 (Hibah/Bencana) & Masterlist BKPM (Pasal 26)',
      paragraphs: [
        'Pasal 25 UU Kepabeanan mengatur pembebasan mutlak (absolut) Bea Masuk atas barang perwakilan negara asing/badan internasional berdasarkan timbal balik, barang ilmu pengetahuan & penelitian universitas, serta peralatan pertahanan/keamanan negara. Khusus barang kiriman hadiah/hibah untuk keperluan ibadah umum, amal, sosial, kebudayaan, maupun penanggulangan bencana alam, sejak 27 Februari 2026 diatur terpadu dalam PMK Nomor 99 Tahun 2025 (mencabut PMK 69/PMK.04/2012 & PMK 70/PMK.04/2012) dengan pengajuan elektronik terintegrasi DJBC/SINSW.',
        'Sementara itu, Pasal 26 mengatur pembebasan atau keringanan bersyarat untuk pembangunan dan pengembangan industri. Melalui PMK 176/PMK.011/2009 stdd PMK 188/PMK.010/2015 (diajukan lewat OSS BKPM), perusahaan manufaktur dan jasa tertentu mendapat pembebasan Bea Masuk 100% atas impor mesin selama jangka waktu pengimporan 2 tahun (dapat diperpanjang) serta bahan baku untuk produksi awal 2 tahun (atau 4 tahun bila memakai mesin dalam negeri minimal 30%).',
      ],
    },
    {
      heading: 'KITE Pembebasan vs KITE Pengembalian (PMK 149/2022 & PMK 145/2022) serta Kawasan Khusus',
      paragraphs: [
        'Untuk industri berorientasi ekspor di luar kawasan pabean tertutup, PMK 149/PMK.04/2022 (KITE Pembebasan) membebaskan Bea Masuk dan Tidak Dipungut PPN/PPnBM sejak saat impor bahan baku sepanjang hasil produksinya direalisasikan untuk ekspor dalam 12 bulan (dengan penyerahan jaminan kepabeanan). Sebaliknya, PMK 145/PMK.04/2022 (KITE Pengembalian) mewajibkan Bea Masuk dibayar lunas di awal saat PIB lalu dapat diajukan pengembalian tunai (drawback/refund) setelah realisasi ekspor.',
        'Untuk entitas di dalam Kawasan Berikat (PMK 131/2018), Kawasan Ekonomi Khusus (PP 40/2021), atau proyek infrastruktur/industri di Ibu Kota Nusantara (PMK 28/2024), Bea Masuk ditangguhkan atau dibebaskan pada saat pemasukan barang modal maupun bahan baku. Khusus Kawasan Berikat, penjualan hasil produksi ke pasar dalam negeri (TLDDP) dibatasi maksimal 50% realisasi ekspor tahun sebelumnya dengan wajib melunasi Bea Masuk bahan baku terkait.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KITE Lama (2018) & Hibah Lama (PMK 69–70/2012)',
    newHeader: 'KITE (PMK 145–149/2022) & Hibah (PMK 99/2025)',
    rows: [
      {
        aspek: 'Pemangkasan Syarat & Integrasi Rantai Pasok KITE',
        aturanLama: 'Persyaratan luasan lokasi & keterhubungan rantai ekspor lebih kaku',
        aturanBaru: 'Memudahkan penyerahan antar-penerima KITE/TPB serta integrasi IT Inventory daring CEISA 4.0',
      },
      {
        aspek: 'Pembebasan Barang Kiriman Hibah / Bencana Alam',
        aturanLama: 'Terpisah pada PMK 69/2012 (bencana) & PMK 70/2012 (ibadah/sosial)',
        aturanBaru: 'Dikonsolidasikan di PMK 99/2025 (berlaku 27 Feb 2026) berbasis SINSW/CEISA',
      },
      {
        aspek: 'Mekanisme Pembayaran Awal Bea Masuk KITE',
        aturanLama: 'Pembebasan (jaminan) vs Pengembalian (bayar dahulu)',
        aturanBaru: 'KITE Pembebasan = Rp 0 saat impor (jaminan); KITE Pengembalian = bayar awal lalu restitusi pasca-ekspor',
      },
    ],
  },
  caseExample: {
    title: 'Impor bahan baku tujuan ekspor Rp 5 miliar (Tarif MFN 10%) via KITE Pembebasan',
    scenario:
      'Perusahaan garmen berorientasi ekspor mengimpor kain bahan baku senilai Nilai Pabean Rp 5.000.000.000 dengan tarif MFN 10% menggunakan SKep KITE Pembebasan PMK 149/2022.',
    presetRegime: 'bea_masuk_fasilitas',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 5000000000,
        tarifBmPersen: 10,
        skemaFasilitasBm: 'kite_pembebasan_149',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukFasilitasRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifMfn = Math.max(0, Math.min(150, input.tarifBmPersen));
    const skema = input.skemaFasilitasBm ?? 'kite_pembebasan_149';

    const bmNormal = Math.round(nilaiPabean * (tarifMfn / 100));
    const isPengembalian = skema === 'kite_pengembalian_145';
    const bmBayarSaatImpor = isPengembalian ? bmNormal : 0;
    const bmEfektifSetelahFasilitas = 0;

    const labelSkema =
      skema === 'pasal25_mutlak'
        ? 'Pembebasan Mutlak Pasal 25 UU Kepabeanan (Diplomatik/Riset/Hankam)'
        : skema === 'hibah_bencana_pmk99_2025'
          ? 'Hibah Ibadah, Sosial, Kebudayaan & Bencana Alam (PMK 99/2025 — efektif 27 Feb 2026)'
          : skema === 'bkpm_pmk176_mesin'
            ? 'Masterlist BKPM / OSS PMK 176/2009 stdd PMK 188/2015 (Mesin/Bahan Baku 2 Thn)'
            : skema === 'kite_pengembalian_145'
              ? 'KITE Pengembalian PMK 145/2022 (Bayar Saat Impor -> Refund Pasca-Ekspor)'
              : skema === 'kb_kek_ikn'
                ? 'Kawasan Berikat (PMK 131/2018), KEK (PP 40/2021) & IKN (PMK 28/2024)'
                : 'KITE Pembebasan PMK 149/2022 (Bebas BM & Tidak Dipungut PPN)';

    const effectiveRate = nilaiPabean > 0 ? (bmBayarSaatImpor / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean (CIF dalam Rupiah)', value: nilaiPabean },
      {
        label: 'Skema Fasilitas Kepabeanan Dipilih',
        formula: 'Dasar pengecualian / penangguhan / pengembalian Bea Masuk',
        value: 0,
        format: 'text',
        displayValue: labelSkema,
      },
      {
        label: `Bea Masuk Normal MFN (${formatPersen(tarifMfn)})`,
        formula: `${formatPersen(tarifMfn)} x ${formatRupiah(nilaiPabean)}`,
        value: bmNormal,
      },
      {
        label: isPengembalian
          ? 'Bea Masuk Wajib Disetor Saat PIB (Dapat Direstitusi)'
          : 'Bea Masuk Disetor ke Kas Negara Saat Impor',
        formula: isPengembalian
          ? 'Dibayar penuh di awal, lalu diklaim kembali setelah ekspor terealisasi'
          : 'Dibebaskan / ditangguhkan 100% (Rp 0) berdasarkan SKep Fasilitas',
        value: bmBayarSaatImpor,
        isHighlight: true,
      },
      {
        label: isPengembalian
          ? 'Potensi Refund Bea Masuk Pasca-Ekspor'
          : 'Penghematan / Pembebasan Bea Masuk',
        formula: isPengembalian
          ? 'Pengembalian tunai oleh Bea Cukai sesuai PMK 145/2022'
          : 'Selisih Bea Masuk MFN yang tidak dipungut/dibebaskan',
        value: bmNormal,
      },
    ];

    const notes: string[] = [];
    if (isPengembalian) {
      notes.push(
        `Pada skema KITE Pengembalian (PMK 145/2022), importir tetap menyetor Bea Masuk sebesar ${formatRupiah(bmNormal)} saat pengajuan PIB, lalu mengajukan permohonan pengembalian (drawback) setelah barang hasil produksi diekspor.`
      );
    } else if (skema === 'kb_kek_ikn') {
      notes.push(
        'Barang yang mendapat penangguhan di Kawasan Berikat/KEK tetap wajib melunasi Bea Masuk apabila hasil olahan dijual ke pasar dalam negeri (TLDDP) dan bukan diekspor.'
      );
    } else {
      notes.push(
        `Fasilitas ini membebaskan Bea Masuk saat impor sebesar ${formatRupiah(bmNormal)}. Apabila syarat ekspor atau penggunaan proyek investasi tidak dipenuhi dalam jangka waktu ketentuan, Bea Masuk terutang wajib dilunasi beserta sanksi denda/bunga.`
      );
    }

    return {
      regime,
      primaryTaxLabel: isPengembalian
        ? 'Bea Masuk Dibayar Saat Impor (Refundable)'
        : 'Bea Masuk Dibayar Saat Impor',
      primaryTaxAmount: bmBayarSaatImpor,
      annualTaxLabel: isPengembalian
        ? 'Estimasi Refund Pasca-Ekspor'
        : 'Bea Masuk MFN yang Dibebaskan',
      annualTaxAmount: bmNormal,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Rasio Setoran Awal thd Nilai Pabean',
      takeHomeOrNetLabel: 'Beban Bea Masuk Neto Akhir',
      takeHomeOrNetAmount: bmEfektifSetelahFasilitas,
      steps,
      notes,
    };
  },
};
