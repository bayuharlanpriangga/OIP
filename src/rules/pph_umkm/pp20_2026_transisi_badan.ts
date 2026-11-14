import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_20_2026, SRC.PP_55_2022, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'umkm_pp20_2026_transisi',
  taxType: 'pph_umkm',
  name: 'Transisi UMKM Badan PP 20/2026 (0,5% Final vs Tarif 11% Pasal 31E)',
  shortName: '2026–Sekarang (Komparasi Transisi CV/PT)',
  legalBasis: 'PP Nomor 20 Tahun 2026 jo. Pasal 31E UU PPh (UU HPP)',
  effectivePeriod: '22 April 2026 – Sekarang (Akhir Masa Transisi CV/PT)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Titik impas pajak 0,5% Final vs PPh Badan 11% atas laba bersih',
  summary:
    'Kalkulator analisis titik impas bagi CV, Firma, atau PT umum yang habis hak PPh Final 0,5%-nya di bawah PP 20/2026: membandingkan beban pajak 0,5% dari omzet terhadap skema pembukuan PPh Badan Pasal 31E (tarif efektif 11% atas laba neto fiskal jika omzet ≤ Rp 4,8 miliar). Pada margin laba di bawah ~4,55%, pindah ke pembukuan justru membuat pajak lebih hemat.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'umkm-pp20-2026-transisi',
  taxType: 'pph_umkm',
  taxTypeLabel: 'PPh Final UMKM',
  title: 'Setelah PPh Final 0,5% Berakhir di PP 20/2026: Kapan Pembukuan Pasal 31E Lebih Hemat?',
  legalBasis: 'PP Nomor 20 Tahun 2026 jo. Pasal 31E UU PPh',
  effectiveDate: '22 April 2026',
  readMinutes: 5,
  summary:
    'Membedah dampak peralihan CV, Firma, dan PT umum dari PPh Final 0,5% omzet menuju tarif umum PPh Badan Pasal 31E (11% dari laba bersih fiskal untuk omzet ≤ Rp 4,8 miliar).',
  sections: [
    {
      heading: 'Titik impas margin laba ~4,55% antara Final 0,5% vs Pasal 31E (11%)',
      paragraphs: [
        'Sejak berlakunya PP Nomor 20 Tahun 2026 (22 April 2026), CV, Firma, BUMDes, dan PT umum tidak lagi menjadi subjek baru PPh Final UMKM 0,5%, dan entitas lama hanya menuntaskan sisa jangka waktu transisinya sebelum beralih wajib ke pembukuan dan tarif PPh Badan umum.',
        'Bagi badan usaha dengan omzet tahunan ≤ Rp 4,8 miliar, Pasal 31E UU PPh memberi diskon 50% atas tarif normal 22%, sehingga tarif efektif PPh Badan menjadi 11% dari Penghasilan Kena Pajak (laba bersih fiskal). Jika margin laba bersih perusahaan sebesar 4,55%, beban pajaknya adalah 11% × 4,55% = 0,50% dari omzet — identik dengan tarif PPh Final! Bila margin laba di bawah 4,55% (atau mengalami rugi fiskal), pembukuan umum membuat pajak jauh lebih rendah bahkan Rp 0 saat merugi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PPh Final UMKM (0,5% dari Omzet)',
    newHeader: 'PPh Badan Pembukuan Pasal 31E (11% dari Laba)',
    rows: [
      {
        aspek: 'Dasar pengenaan pajak',
        aturanLama: 'Omzet bruto (tetap bayar pajak meski rugi)',
        aturanBaru: 'Laba bersih fiskal (jika rugi pajak = Rp 0 & dapat dikompensasi 5 tahun)',
      },
      {
        aspek: 'Titik impas beban pajak (omzet ≤ Rp 4,8 M)',
        aturanLama: '0,5% dari omzet',
        aturanBaru: 'Lebih hemat bila margin laba bersih < 4,55%',
      },
    ],
  },
  caseExample: {
    title: 'Perdagangan ritel CV omzet Rp 250 juta/bulan dengan margin laba bersih 3,5%',
    scenario:
      'Sebuah CV distributor beromzet Rp 250.000.000/bulan (Rp 3 miliar/tahun) bertransisi keluar dari PP 55/2022 ke tarif umum PPh Badan Pasal 31E dengan margin laba neto fiskal 3,5%.',
    presetRegime: 'umkm_pp20_2026_transisi',
    presetInput: {
      pph_umkm: {
        omzetBulanan: 250000000,
        akumulasiOmzetSebelumnya: 0,
        subjectType: 'badan_usaha',
        marginLabaPersen: 3.5,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const umkmPp20_2026TransisiRule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  article,
  calculate(input) {
    const omzetBulanan = Math.max(0, input.omzetBulanan);
    const omzetTahunan = omzetBulanan * 12;
    const marginPersen = Math.min(80, Math.max(0, input.marginLabaPersen ?? 10));
    const labaTahunan = Math.round((omzetTahunan * marginPersen) / 100);

    const pphFinalUmkmTahunan = Math.round(omzetTahunan * 0.005);
    const bagianFasilitas31E =
      omzetTahunan <= 4800000000
        ? labaTahunan
        : Math.round((4800000000 / Math.max(1, omzetTahunan)) * labaTahunan);
    const bagianNonFasilitas = Math.max(0, labaTahunan - bagianFasilitas31E);
    const pphBadanPasal31ETahunan = Math.round(
      bagianFasilitas31E * 0.11 + bagianNonFasilitas * 0.22
    );
    const angsuranBulanan31E = Math.round(pphBadanPasal31ETahunan / 12);
    const selisihTahunan = pphBadanPasal31ETahunan - pphFinalUmkmTahunan;

    const steps: CalculationStep[] = [
      { label: 'Proyeksi omzet bruto setahun (12 x omzet bulan)', value: omzetTahunan },
      {
        label: `Estimasi laba bersih fiskal (${formatPersen(marginPersen)} margin)`,
        formula: `${formatRupiah(omzetTahunan)} x ${formatPersen(marginPersen)}`,
        value: labaTahunan,
      },
      { label: 'Pembanding PPh Final UMKM 0,5% per tahun', value: pphFinalUmkmTahunan },
      {
        label: 'PPh Badan Pasal 31E per tahun (11% atas porsi omzet ≤ Rp 4,8 M)',
        value: pphBadanPasal31ETahunan,
        isHighlight: true,
      },
      {
        label: 'Estimasi angsuran PPh Badan rata-rata /bulan',
        value: angsuranBulanan31E,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Estimasi PPh Badan Pasal 31E /Bulan',
      primaryTaxAmount: angsuranBulanan31E,
      annualTaxLabel: 'PPh Badan Pembukuan Setahun',
      annualTaxAmount: pphBadanPasal31ETahunan,
      effectiveRatePercent: omzetTahunan > 0 ? (pphBadanPasal31ETahunan / omzetTahunan) * 100 : 0,
      effectiveRateLabel: 'Rasio PPh Badan terhadap omzet bruto',
      takeHomeOrNetLabel: 'Selisih Tahunan vs Tarif Final 0,5%',
      takeHomeOrNetAmount: Math.abs(selisihTahunan),
      steps,
      notes: [
        selisihTahunan <= 0
          ? `Pada margin laba ${formatPersen(marginPersen)}, tarif pembukuan Pasal 31E lebih hemat ${formatRupiah(Math.abs(selisihTahunan))}/tahun daripada PPh Final 0,5%.`
          : `Pada margin laba ${formatPersen(marginPersen)} (di atas titik impas ~4,55%), tarif umum Pasal 31E lebih tinggi ${formatRupiah(selisihTahunan)}/tahun dibandingkan PPh Final 0,5%.`,
        'Wajib Pajak Badan dapat mengkreditkan PPh 22/23 yang dipotong pihak lain sebagai pengurang PPh Badan tahunan saat memakai skema pembukuan.',
      ],
    };
  },
};
