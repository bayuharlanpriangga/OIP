import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_197_2013, SRC.PMK_68_2010, SRC.PMK_164_2023];

const regime: TaxRegime = {
  id: 'ppn_pkp_pmk197_2013',
  taxType: 'ppn',
  name: 'PMK 197/2013 jo. PMK 68/2010 & PMK 164/2023 (Batasan Pengusaha Kecil PKP)',
  shortName: '2014–Kini (Batas Pengusaha Kecil PKP)',
  legalBasis: 'PMK 197/PMK.03/2013 (Rp 4,8 M), PMK 68/2010 (Rp 600 Jt) & PMK 164/2023',
  effectivePeriod: '1 Januari 2014 – Sekarang (PMK 68/2010: 2010–2013)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji kewajiban pengukuhan PKP (omzet Rp 4,8 M)',
  summary:
    'Menentukan batas peredaran bruto pengusaha wajib dikukuhkan menjadi Pengusaha Kena Pajak (PKP) pemungut PPN: melonjak 8 kali lipat dari Rp 600 juta/tahun (PMK 68/PMK.03/2010) menjadi Rp 4,8 miliar/tahun sejak 1 Januari 2014 (PMK 197/PMK.03/2013), dengan penyederhanaan tenggat waktu pengukuhan di akhir tahun buku melalui PMK 164/2023.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk197-2013-pkp',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Batas Omzet Wajib PKP: Kenaikan Rp 600 Juta (PMK 68/2010) ke Rp 4,8 Miliar (PMK 197/2013 & PMK 164/2023)',
  legalBasis: 'PMK 197/PMK.03/2013 mencabut sebagian PMK 68/PMK.03/2010 & PMK 164 Tahun 2023',
  effectiveDate: '1 Januari 2014 (Sinkronisasi Tenggat Akhir Tahun Buku PMK 164/2023)',
  readMinutes: 4,
  summary:
    'Membandingkan ambang batas pengusaha kecil bebas kewajiban memungut PPN antara era 2010–2013 (Rp 600 juta) dan 2014–Sekarang (Rp 4,8 miliar) serta aturan baru jadwal pelaporan PKP di PMK 164/2023.',
  sections: [
    {
      heading: 'Mengapa batas PKP dinaikkan menjadi Rp 4,8 miliar dan disinkronkan di PMK 164/2023?',
      paragraphs: [
        'Pada 2010–2013 (PMK 68/PMK.03/2010), pelaku usaha yang omzetnya menembus Rp 600 juta setahun wajib mendaftarkan diri sebagai PKP dan menerbitkan Faktur Pajak PPN. Mulai 1 Januari 2014 (PMK 197/PMK.03/2013), ambang batas Pengusaha Kecil PPN dinaikkan menjadi Rp 4,8 miliar setahun agar selaras dengan definisi WP UMKM.',
        'Aturan pelaksana terbaru PMK 164 Tahun 2023 menyederhanakan masa transisi ketika omzet melampaui Rp 4,8 miliar di tengah tahun: Wajib Pajak tidak lagi harus langsung mengukuhkan PKP akhir bulan berikutnya, melainkan diberi batas waktu paling lambat akhir tahun buku saat omzet menembus Rp 4,8 miliar (dan kewajiban pungut PPN dimulai awal tahun buku berikutnya bila melaporkan tepat waktu).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 68/PMK.03/2010 (2010–2013)',
    newHeader: 'PMK 197/2013 & PMK 164/2023 (2014–Sekarang)',
    rows: [
      {
        aspek: 'Batasan omzet Pengusaha Kecil PPN per tahun',
        aturanLama: 'Rp 600.000.000 per tahun buku',
        aturanBaru: 'Rp 4.800.000.000 per tahun buku',
      },
      {
        aspek: 'Tenggat lapor pengukuhan PKP saat melewati batas',
        aturanLama: 'Akhir bulan berikutnya setelah batas Rp 600 jt dilampaui',
        aturanBaru: 'Akhir tahun buku (atau sesuai pilihan pengukuhan lebih awal di PMK 164/2023)',
      },
    ],
  },
  caseExample: {
    title: 'Uji status wajib PKP perusahaan dengan peredaran bruto tahunan Rp 3,2 miliar',
    scenario:
      'Usaha beromzet Rp 3,2 miliar setahun pada rezim PMK 68/2010 (batas Rp 600 juta) wajib berstatus PKP memungut PPN, namun di era PMK 197/2013 & PMK 164/2023 (batas Rp 4,8 miliar) masih berstatus Non-PKP (PPN Rp 0).',
    presetRegime: 'ppn_pkp_pmk197_2013',
    presetInput: {
      ppn: {
        hargaJualDpp: 3200000000,
        goodsType: 'umum',
        termasukPpn: false,
        eraPkp: 'pmk197_2013',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk197_2013PkpRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const omzetTahunan = Math.max(0, input.hargaJualDpp);
    const era = input.eraPkp ?? 'pmk197_2013';
    const threshold = era === 'pmk197_2013' ? 4800000000 : 600000000;
    const isWajibPkp = omzetTahunan > threshold;
    const activeRate = era === 'pmk197_2013' ? 11 : 10; // Effective PPN rate 11% (2025 11/12*12%) vs 10% (2010-2013)
    const ppnIfPkp = isWajibPkp ? Math.round((omzetTahunan * activeRate) / 100) : 0;

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto / omzet BKP-JKP dalam setahun', value: omzetTahunan },
      {
        label: era === 'pmk197_2013' ? 'Batas Pengusaha Kecil PMK 197/2013 jo. PMK 164/2023' : 'Batas Pengusaha Kecil historis PMK 68/2010',
        value: threshold,
      },
      {
        label: isWajibPkp ? 'Status: Wajib Pengukuhan PKP (Melampaui batas)' : 'Status: Non-PKP / Pengusaha Kecil (Belum wajib pungut PPN)',
        formula: isWajibPkp
          ? `Omzet > ${formatRupiah(threshold)} -> Wajib pungut PPN ${formatPersen(activeRate)}`
          : `Omzet <= ${formatRupiah(threshold)} -> Bebas kewajiban Faktur Pajak (0%)`,
        value: isWajibPkp ? activeRate : 0,
        format: 'percent',
      },
      {
        label: isWajibPkp ? `Estimasi PPN Keluaran setahun (${formatPersen(activeRate)})` : 'PPN wajib dipungut pengusaha kecil',
        value: ppnIfPkp,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isWajibPkp ? 'PPN Keluaran Wajib Dipungut (Wajib PKP)' : 'PPN Wajib Dipungut (Non-PKP)',
      primaryTaxAmount: ppnIfPkp,
      effectiveRatePercent: isWajibPkp ? activeRate : 0,
      takeHomeOrNetLabel: 'Sisa Kapasitas Omzet Sebelum Batas PKP',
      takeHomeOrNetAmount: Math.max(0, threshold - omzetTahunan),
      steps,
      notes: [
        isWajibPkp
          ? `Karena omzet melewati ${formatRupiah(threshold)}, berdasarkan PMK 164/2023 pengusaha wajib melaporkan usaha untuk dikukuhkan sebagai PKP paling lambat akhir tahun buku (atau boleh memilih dikukuhkan lebih awal untuk mengkreditkan Pajak Masukan).`
          : `Selama omzet tahunan belum melampaui ${formatRupiah(threshold)}, pengusaha kecil dibebaskan dari kewajiban memungut PPN meskipun tetap dapat memilih menjadi PKP secara sukarela.`,
      ],
    };
  },
};
