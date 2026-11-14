import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_112_2025, SRC.PP_9_2021, SRC.PER_25_PJ_2018_DJP];

const regime: TaxRegime = {
  id: 'pph26_pmk112_2025_p3b',
  taxType: 'pph26',
  name: 'PMK 112/2025 (Penerapan P3B, Uji Beneficial Owner & Principal Purpose Test / Anti-Abuse)',
  shortName: '2026–Sekarang (Uji BO & PPT P3B PMK 112/2025)',
  legalBasis: 'PMK Nomor 112 Tahun 2025 (Berlaku 31 Desember 2025)',
  effectivePeriod: '31 Desember 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tata cara klaim tarif P3B, uji substansi BO & PPT',
  summary:
    'Aturan pelaksana baru tata cara penerapan Persetujuan Penghindaran Pajak Berganda (P3B) mulai akhir 2025/2026 yang menggantikan/mengonsolidasikan prosedur PER-25/PJ/2018: memperketat uji Beneficial Ownership (BO) dan Principal Purpose Test (PPT) anti-penyalahgunaan treaty. Jika entitas luar negeri terindikasi conduit atau treaty shopping, manfaat tarif P3B ditolak dan kembali dikenai tarif domestik Pasal 26 sebesar 20%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pmk112-2025-p3b',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'PMK Nomor 112 Tahun 2025: Tata Cara P3B Terpadu, Uji Beneficial Owner, & Principal Purpose Test',
  legalBasis: 'PMK Nomor 112 Tahun 2025',
  effectiveDate: '31 Desember 2025',
  readMinutes: 5,
  summary:
    'Menjelaskan pengetatan uji substansi ekonomi (anti-avoidance, Beneficial Owner, dan Principal Purpose Test) dalam PMK 112/2025 ketika WPLN mengklaim pemotongan PPh Pasal 26 tarif P3B yang lebih rendah.',
  sections: [
    {
      heading: 'Konsekuensi gagal uji BO atau PPT: tarif P3B gugur kembali ke 20%',
      paragraphs: [
        'Melalui PMK Nomor 112 Tahun 2025 (berlaku 31 Desember 2025), pemanfaatan tarif pemotongan P3B (misalnya dividen/royalti/bunga 10% atau 15%, ataupun 0% untuk jasa teknis tanpa BUT) tidak hanya menuntut kelengkapan administratif SKD/DGT melalui Coretax, tetapi juga kepatuhan substansi.',
        'Apabila dalam pengujian ditemukan bahwa penerima penghasilan di negara mitra hanyalah entitas perantara (conduit), tidak memiliki kendali atas penggunaan dana (gagal Beneficial Ownership), atau pengaturan struktur kontrak dilakukan semata-mata untuk menghindari pajak (gagal Principal Purpose Test / PPT), DJP berwenang menolak fasilitas P3B dan memungut PPh Pasal 26 tarif domestik penuh 20%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Klaim Formal SKD Lama (PER-25/PJ/2018)',
    newHeader: 'Uji Substansi Anti-Abuse (PMK 112/2025)',
    rows: [
      {
        aspek: 'Pengujian Principal Purpose Test (PPT)',
        aturanLama: 'Fokus uji penyalahgunaan umum di Form DGT Part III',
        aturanBaru: 'Diperkuat uji anti-fragmentasi kontrak, agen independen, dan PPT terpadu',
      },
      {
        aspek: 'Dampak kegagalan uji substansi BO/PPT',
        aturanLama: 'Tarif P3B gugur -> dikenai tarif Pasal 26 domestik 20%',
        aturanBaru: 'Tarif P3B gugur -> dikenai PPh 26 sebesar 20% + sanksi administrasi',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran royalti ke entitas luar negeri Rp 500 jt (Uji BO Lolos 10% vs Gagal PPT 20%)',
    scenario:
      'PT di Indonesia membayar royalti Rp 500.000.000 kepada perusahaan mitra di negara P3B (tarif treaty 10%) yang diuji kelayakan BO & PPT-nya di bawah PMK 112/2025.',
    presetRegime: 'pph26_pmk112_2025_p3b',
    presetInput: {
      pph26: {
        nilaiBruto: 500000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: true,
        tarifP3bPersen: 10,
        skemaButPpt: 'beneficial_owner_valid',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pmk112_2025P3bRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const skema = input.skemaButPpt ?? 'beneficial_owner_valid';
    const isTreatyEligible = Boolean(input.hasSkdP3b) && skema === 'beneficial_owner_valid';
    const p3bRate = Math.min(20, Math.max(0, input.tarifP3bPersen ?? 10));
    const appliedRate = isTreatyEligible ? p3bRate : 20;

    const taxDomestik = Math.round(bruto * 0.2);
    const taxApplied = Math.round((bruto * appliedRate) / 100);
    const savings = Math.max(0, taxDomestik - taxApplied);

    const statusLabel = isTreatyEligible
      ? `Lolos SKD + Uji BO & PPT (Tarif P3B ${formatPersen(p3bRate)})`
      : !input.hasSkdP3b
        ? 'Tidak melampirkan SKD WPLN -> Kembali ke Tarif Domestik 20%'
        : skema === 'ppt_fragmentasi_ditolak'
          ? 'Gagal Principal Purpose Test / Fragmentasi -> P3B Ditolak (20%)'
          : 'Gagal Uji Beneficial Owner / Conduit -> P3B Ditolak (20%)';

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayarkan ke WPLN', value: bruto },
      { label: 'PPh Pasal 26 tarif domestik penuh (20%)', value: taxDomestik },
      { label: statusLabel, value: -savings, isNegative: true },
      {
        label: `PPh Pasal 26 wajib dipotong (${formatPersen(appliedRate)})`,
        formula: `${formatRupiah(bruto)} x ${formatPersen(appliedRate)}`,
        value: taxApplied,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isTreatyEligible ? `PPh 26 Tarif P3B (${formatPersen(p3bRate)})` : 'PPh 26 Domestik (20%)',
      primaryTaxAmount: taxApplied,
      effectiveRatePercent: appliedRate,
      takeHomeOrNetLabel: 'Net Transfer ke WPLN Setelah PPh 26',
      takeHomeOrNetAmount: Math.max(0, bruto - taxApplied),
      steps,
      notes: [
        isTreatyEligible
          ? `Karena SKD valid dan memenuhi uji Beneficial Ownership & Principal Purpose Test PMK 112/2025, pemotongan memakai tarif P3B ${formatPersen(p3bRate)} (hemat ${formatRupiah(savings)}).`
          : 'Sesuai PMK 112/2025, kegagalan SKD atau indikasi treaty abuse (conduit / gagal BO / gagal PPT) menggugurkan manfaat P3B sehingga dipotong penuh 20%.',
      ],
    };
  },
};
