import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_bmt_pp34',
  taxType: 'bea_masuk',
  name: 'Bea Masuk Tambahan / Trade Remedies: BMAD, BMI & BMTP (PP Nomor 34 Tahun 2011)',
  shortName: '2011–Kini (BMAD / BMI / BMTP)',
  legalBasis:
    'Pasal 18–23D UU Nomor 10 Tahun 1995 jo. UU Nomor 17 Tahun 2006 & PP Nomor 34 Tahun 2011',
  effectivePeriod: '4 Juli 2011 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Trade Remedies)',
  summary:
    'Instrumen Bea Masuk Tambahan di luar tarif MFN/FTA: BMAD (Antidumping), BMI (Imbalan Subsidi), dan BMTP (Safeguard lonjakan impor) yang langsung menambah Bea Masuk terutang dan membesarkan DPP PPN/PPh 22 Impor.',
  sources: [SRC.PP_34_2011, SRC.UU_17_2006, SRC.PMK_26_2022],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-bmt-pp34-2011',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Bea Masuk Tambahan (BMAD, BMI, BMTP) sebagai Instrumen Pengamanan Industri (PP 34/2011)',
  legalBasis: 'Pasal 18–23D UU Kepabeanan & PP Nomor 34 Tahun 2011',
  effectiveDate: '4 Juli 2011',
  readMinutes: 5,
  summary:
    'PP Nomor 34 Tahun 2011 (menggantikan PP 34/1996 dan Keppres 84/2002) mengatur pengenaan Bea Masuk Tambahan di atas tarif BTKI/FTA berupa BMAD, BMI, dan BMTP berdasarkan penyelidikan KADI atau KPPI.',
  sections: [
    {
      heading: 'Tiga Jenis Instrumen Bea Masuk Tambahan (BMT)',
      paragraphs: [
        '1) Bea Masuk Antidumping (BMAD — Pasal 18 UU Kepabeanan) dikenakan atas barang impor yang dijual di Indonesia dengan harga ekspor lebih rendah daripada nilai normalnya di negara pengekspor (dumping) dan menyebabkan kerugian bagi industri dalam negeri, berdasarkan penyelidikan Komite Antidumping Indonesia (KADI).',
        '2) Bea Masuk Imbalan (BMI — Pasal 21) dikenakan apabila barang impor terbukti menerima subsidi pemerintah negara pengekspor. 3) Bea Masuk Tindakan Pengamanan (BMTP / Safeguard — Pasal 23A) dikenakan sementara waktu atas lonjakan volume impor barang tertentu (umumnya secara global tanpa memandang negara asal kecuali negara berkembang dikecualikan) berdasarkan hasil penyelidikan Komite Pengamanan Perdagangan Indonesia (KPPI).',
      ],
    },
    {
      heading: 'Sifat Tambahan dan Pengaruhnya pada Nilai Impor',
      paragraphs: [
        'Bea Masuk Tambahan bersifat kumulatif: artinya, walaupun barang telah menikmati tarif MFN rendah atau tarif preferensi FTA 0% dengan SKA yang sah, BMAD/BMI/BMTP tetap dipungut di atas Bea Masuk dasar sepanjang pos tarif HS dan negara asal tercakup dalam PMK pengenaan BMT yang berlaku.',
        'Seluruh nilai BMAD, BMI, maupun BMTP ikut ditambahkan ke dalam Nilai Impor (CIF + BM Dasar + BMT), sehingga otomatis meningkatkan dasar penghitungan PPN Impor (11%) dan PPh Pasal 22 Impor (2,5% / 7,5%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 34/1996 & Keppres 84/2002 (1996–2011)',
    newHeader: 'PP Nomor 34 Tahun 2011 (2011–Kini)',
    rows: [
      {
        aspek: 'Payung Hukum Pengaturan Trade Remedies',
        aturanLama: 'Terpisah antara PP 34/1996 (BMAD/BMI) & Keppres 84/2002 (Safeguard)',
        aturanBaru: 'Dikonsolidasikan terpadu dalam satu PP 34/2011 merujuk UU 17/2006',
      },
      {
        aspek: 'Hubungan dengan Tarif Preferensi FTA 0%',
        aturanLama: 'Tambahan di atas Bea Masuk dasar',
        aturanBaru: 'Tetap dipungut kumulatif meskipun Bea Masuk FTA bernilai 0%',
      },
      {
        aspek: 'Pembentukan DPP PPN & PPh 22',
        aturanLama: 'Menambah Nilai Impor',
        aturanBaru: 'Nilai Impor = Nilai Pabean + BM MFN/FTA + BMT (BMAD/BMI/BMTP)',
      },
    ],
  },
  caseExample: {
    title: 'Impor produk baja/tekstil Rp 2 miliar dengan BM MFN 5% + BMAD/BMTP 15%',
    scenario:
      'Importir memasukkan gulungan baja canai panas senilai Nilai Pabean Rp 2.000.000.000 yang dikenai tarif MFN 5% sekaligus dikenai BMAD sebesar 15% sesuai PMK pengenaan antidumping.',
    presetRegime: 'bea_masuk_bmt_pp34',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 2000000000,
        tarifBmPersen: 5,
        jenisBmt: 'bmad_antidumping',
        tarifBmtPersen: 15,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukBmtPp34Rule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarifBm = Math.max(0, Math.min(150, input.tarifBmPersen));
    const tarifBmt = Math.max(0, Math.min(200, input.tarifBmtPersen ?? 15));
    const jenisBmt = input.jenisBmt ?? 'bmad_antidumping';

    const bmtLabel =
      jenisBmt === 'bmi_imbalan'
        ? 'Bea Masuk Imbalan (BMI)'
        : jenisBmt === 'bmtp_safeguard'
          ? 'Bea Masuk Tindakan Pengamanan (BMTP / Safeguard)'
          : 'Bea Masuk Antidumping (BMAD)';

    const bmDasar = Math.round(nilaiPabean * (tarifBm / 100));
    const bmtNominal = Math.round(nilaiPabean * (tarifBmt / 100));
    const totalBeaMasuk = bmDasar + bmtNominal;
    const nilaiImpor = nilaiPabean + totalBeaMasuk;
    const effectiveRate = nilaiPabean > 0 ? (totalBeaMasuk / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean (CIF dalam Rupiah)', value: nilaiPabean },
      {
        label: `Bea Masuk Dasar MFN/FTA (${formatPersen(tarifBm)})`,
        formula: `${formatPersen(tarifBm)} x ${formatRupiah(nilaiPabean)}`,
        value: bmDasar,
      },
      {
        label: `${bmtLabel} (${formatPersen(tarifBmt)})`,
        formula: `${formatPersen(tarifBmt)} x ${formatRupiah(nilaiPabean)} (kumulatif)`,
        value: bmtNominal,
      },
      {
        label: 'Total Bea Masuk (BM Dasar + BMT)',
        formula: `${formatRupiah(bmDasar)} + ${formatRupiah(bmtNominal)}`,
        value: totalBeaMasuk,
        isHighlight: true,
      },
      {
        label: 'Nilai Impor (DPP PPN 11% & PPh 22)',
        formula: 'Nilai Pabean + BM Dasar + BMT',
        value: nilaiImpor,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Masuk (MFN + BMT)',
      primaryTaxAmount: totalBeaMasuk,
      annualTaxLabel: `Porsi ${jenisBmt.split('_')[0].toUpperCase()} Saja`,
      annualTaxAmount: bmtNominal,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Total Beban Tarif Gabungan (BM + BMT)',
      takeHomeOrNetLabel: 'Nilai Impor (DPP PPN & PPh 22)',
      takeHomeOrNetAmount: nilaiImpor,
      steps,
      notes: [
        'Pengenaan BMAD, BMI, maupun BMTP bersifat kumulatif di atas tarif BTKI MFN atau tarif FTA 0% apabila barang tidak dikecualikan dalam lampiran PMK BMT terkait.',
        'Bea Masuk Tambahan turut memperbesar Nilai Impor sebagai dasar pengenaan PPN dan PPh Pasal 22 Impor.',
      ],
    };
  },
};
