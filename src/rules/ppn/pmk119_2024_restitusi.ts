import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_119_2024, SRC.PMK_209_2021, SRC.PMK_39_2018, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'ppn_pmk119_2024_restitusi',
  taxType: 'ppn',
  name: 'PMK 39/2018 stdd PMK 209/2021 & PMK 119/2024 (Restitusi Pendahuluan PPN <= Rp 5 M / 17C & 17D)',
  shortName: '2018–Sekarang (Restitusi Pendahuluan PMK 119/2024)',
  legalBasis: 'Pasal 17C & 17D UU KUP, Pasal 9(4c) UU PPN, PMK 39/2018 stdd PMK 119/2024',
  effectivePeriod: '12 April 2018 – Sekarang (Pembaruan Coretax PMK 119/2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — SKPPKP terbit <= 1 bulan (batas 17D <= Rp 5 M) vs risiko sanksi 100%',
  summary:
    'Mengatur mekanisme pengembalian pendahuluan kelebihan pembayaran PPN dalam waktu maksimal 1 bulan melalui penelitian formal (tanpa pemeriksaan lapangan terlebih dahulu) bagi WP Kriteria Tertentu (Pasal 17C), WP Persyaratan Tertentu dengan lebih bayar <= Rp 5 miliar per masa (Pasal 17D), dan PKP Berisiko Rendah (Pasal 9 ayat 4c UU PPN). Jika pemeriksaan susulan menerbitkan SKPKB, berlaku sanksi kenaikan 100%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk119-2024-restitusi',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Restitusi Pendahuluan PPN (PKP Risiko Rendah, Pasal 17C & Pasal 17D <= Rp 5 M): PMK 119/2024',
  legalBasis: 'Pasal 17C & 17D UU KUP, Pasal 9(4c) UU PPN, & PMK 119 Tahun 2024',
  effectiveDate: '31 Desember 2024 (PMK 119/2024 — Coretax)',
  readMinutes: 5,
  summary:
    'Membandingkan kecepatan pencairan, batas nominal lebih bayar PPN, serta risiko sanksi administrasi kenaikan 100% antara jalur restitusi pendahuluan dan pemeriksaan reguler.',
  sections: [
    {
      heading: '3 Jalur Restitusi Pendahuluan PPN (Maksimal 1 Bulan Sejak Permohonan Lengkap)',
      paragraphs: [
        'Melalui PMK 39/PMK.03/2018 yang diubah berturut-turut hingga PMK 209/2021 dan PMK 119 Tahun 2024 (penyelarasan Coretax), PKP dapat memperoleh Surat Keputusan Pengembalian Pendahuluan Kelebihan Pajak (SKPPKP) dalam waktu paling lama 1 (satu) bulan sejak permohonan lengkap tanpa menunggu pemeriksaan penuh 12 bulan.',
        'Jalur tersebut meliputi: (1) PKP Berisiko Rendah (Pasal 9 ayat 4c UU PPN — eksportir/perusahaan terbuka/industri tertentu setiap masa pajak); (2) WP Persyaratan Tertentu Pasal 17D dengan lebih bayar PPN per masa paling banyak Rp 5.000.000.000; serta (3) WP Kriteria Tertentu / Golden Taxpayer Pasal 17C tanpa batasan plafon nominal.',
      ],
    },
    {
      heading: 'Konsekuensi Pemeriksaan Pasca-Restitusi: Sanksi Kenaikan 100% (Pasal 17C/17D UU KUP)',
      paragraphs: [
        'Fasilitas kecepatan 1 bulan memiliki instrumen pengaman: DJP tetap berwenang melakukan pemeriksaan di kemudian hari (dalam daluwarsa 5 tahun). Apabila hasil pemeriksaan menyatakan pajak terutang lebih besar (terdapat kekurangan bayar atas pajak yang telah dikembalikan lewat SKPPKP), diterbitkan SKPKB ditambah sanksi administrasi kenaikan sebesar 100% sesuai Pasal 17C ayat (5) dan Pasal 17D ayat (5) UU KUP.',
        'Jika lebih bayar PPN WP Persyaratan Tertentu (Pasal 17D) melampaui Rp 5 miliar dan WP tidak berstatus 17C/Berisiko Rendah, permohonan otomatis dialihkan ke jalur restitusi pemeriksaan reguler (Pasal 17B UU KUP dengan jangka waktu maksimal 12 bulan, namun bila kurang bayar hanya kena sanksi bunga per bulan tanpa kenaikan 100%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Restitusi Pemeriksaan Reguler (Pasal 17B UU KUP)',
    newHeader: 'Restitusi Pendahuluan (17C / 17D <= Rp 5 M / 9(4c) PMK 119/2024)',
    rows: [
      {
        aspek: 'Jangka Waktu Penerbitan SKP / SKPPKP PPN',
        aturanLama: 'Paling lama 12 bulan sejak permohonan lengkap',
        aturanBaru: 'Paling lama 1 bulan (via penelitian formal Coretax)',
      },
      {
        aspek: 'Plafon Lebih Bayar PPN per Masa Pajak',
        aturanLama: 'Tidak ada batas nominal',
        aturanBaru: 'Pasal 17D maks Rp 5 M; Pasal 17C & 9(4c) tanpa batas plafon',
      },
      {
        aspek: 'Risiko Sanksi jika Pemeriksaan Susulan Kurang Bayar',
        aturanLama: 'Sanksi bunga administratif per bulan (UU HPP)',
        aturanBaru: 'Sanksi kenaikan 100% dari jumlah kekurangan pajak',
      },
    ],
  },
  caseExample: {
    title: 'Klaim Lebih Bayar PPN Masa Rp 3,5 miliar lewat jalur Pasal 17D (PMK 119/2024)',
    scenario:
      'PKP eksportir kecil mengajukan restitusi PPN Lebih Bayar Rp 3.500.000.000 pada SPT Masa PPN Coretax melalui jalur Wajib Pajak Persyaratan Tertentu (Pasal 17D UU KUP). Karena <= Rp 5.000.000.000, permohonan diproses maksimal 1 bulan melalui penelitian dan SKPPKP cair Rp 3,5 miliar penuh (dengan catatan potensi sanksi kenaikan 100% jika kelak ada temuan SKPKB pemeriksaan).',
    presetRegime: 'ppn_pmk119_2024_restitusi',
    presetInput: {
      ppn: {
        hargaJualDpp: 3500000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaRestitusiPpn: 'wp_17d_sd_5m',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk119_2024RestitusiRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const lebihBayar = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaRestitusiPpn ?? 'wp_17d_sd_5m';
    const limit17d = 5000000000;

    const overLimit17d = skema === 'wp_17d_sd_5m' && lebihBayar > limit17d;
    const isJalurPendahuluan = skema !== 'reguler_17b_pemeriksaan' && !overLimit17d;
    const slaText = isJalurPendahuluan ? 'Maksimal 1 Bulan (SKPPKP)' : 'Maksimal 12 Bulan (Pemeriksaan 17B)';
    const potensiSanksiAudit = isJalurPendahuluan ? lebihBayar : 0; // Kenaikan 100% maks atas pokok yang direstitusi jika batal seluruhnya

    const steps: CalculationStep[] = [
      { label: 'Nilai Lebih Bayar PPN yang dimohonkan restitusi pada SPT Masa', value: lebihBayar },
      {
        label: 'Batas maksimal jalur Pasal 17D (PMK 209/2021 jo. PMK 119/2024)',
        value: skema === 'wp_17d_sd_5m' ? limit17d : 0,
        format: skema === 'wp_17d_sd_5m' ? 'currency' : 'text',
        displayValue: skema === 'wp_17d_sd_5m' ? undefined : 'Tanpa Plafon Nominal',
      },
      {
        label: 'Estimasi waktu penyelesaian (SLA DJP)',
        value: isJalurPendahuluan ? 1 : 12,
        format: 'text',
        displayValue: slaText,
      },
      {
        label: isJalurPendahuluan
          ? 'Nilai SKPPKP PPN cair dipercepat (<= 1 bulan)'
          : 'Nilai PPN dalam proses pemeriksaan reguler (<= 12 bulan)',
        value: lebihBayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isJalurPendahuluan
        ? 'Restitusi Pendahuluan PPN (SKPPKP)'
        : 'Restitusi Reguler Pemeriksaan (17B)',
      primaryTaxAmount: lebihBayar,
      annualTaxLabel: isJalurPendahuluan
        ? 'Eksposur Maks Sanksi Kenaikan 100% jika Temuan Pemeriksaan'
        : 'Eksposur Sanksi Kenaikan 100% Pasal 17C/17D',
      annualTaxAmount: potensiSanksiAudit,
      effectiveRatePercent: lebihBayar > 0 ? 100 : 0,
      effectiveRateLabel: 'Persentase klaim lebih bayar',
      takeHomeOrNetLabel: 'Estimasi Waktu Pencairan (SLA)',
      takeHomeOrNetAmount: 0,
      takeHomeOrNetDisplay: slaText,
      steps,
      notes: [
        overLimit17d
          ? `Nilai Lebih Bayar ${formatRupiah(lebihBayar)} melebihi batas Rp 5.000.000.000 untuk jalur Pasal 17D sehingga otomatis masuk pemeriksaan reguler Pasal 17B (maksimal 12 bulan) kecuali PKP ditetapkan sebagai PKP Berisiko Rendah (Pasal 9(4c)) atau Kriteria Tertentu (Pasal 17C).`
          : isJalurPendahuluan
          ? `Melalui jalur ${skema === 'pkp_risiko_rendah_9_4c' ? 'PKP Berisiko Rendah (Pasal 9 ayat 4c UU PPN)' : skema === 'wp_17c_golden' ? 'WP Kriteria Tertentu (Pasal 17C)' : 'WP Persyaratan Tertentu (Pasal 17D <= Rp 5 M)'}, SKPPKP diterbitkan <= 1 bulan melalui penelitian formal Coretax.`
          : 'Pada jalur pemeriksaan reguler Pasal 17B UU KUP, pengembalian menunggu hasil pemeriksaan lengkap (maksimal 12 bulan), namun terhindar dari sanksi kenaikan 100% (temuan hanya dikenai sanksi bunga per bulan).',
        'Peringatan Risiko Pasal 17C(5)/17D(5) UU KUP: Jika pemeriksaan di kemudian hari menemukan kekurangan bayar atas restitusi pendahuluan, dikenai sanksi administrasi kenaikan 100% dari selisih kekurangan.',
      ],
    };
  },
};
