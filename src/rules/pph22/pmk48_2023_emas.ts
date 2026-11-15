import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_48_2023, SRC.PMK_52_2025, SRC.PMK_51_2025, SRC.PMK_11_2025, SRC.PMK_41_2022];

const regime: TaxRegime = {
  id: 'pph22_pmk48_2023_emas',
  taxType: 'pph22',
  name: 'PMK 48/2023 jo. PMK 51/2025 & PMK 52/2025 (PPh 22 & PPN Emas)',
  shortName: '2023–Kini (PMK 48/2023 & PMK 52/2025 Emas)',
  legalBasis: 'PMK Nomor 48 Tahun 2023 sttd PMK Nomor 52 Tahun 2025 & PMK Nomor 51 Tahun 2025',
  effectivePeriod: '1 Mei 2023 – Sekarang (Penyesuaian LJK Bulion 1 Ags 2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pabrikan/pedagang emas perhiasan & emas batangan',
  summary:
    'Menata ulang pajak niaga emas mulai 1 Mei 2023: PPh Pasal 22 atas penjualan emas perhiasan maupun emas batangan diturunkan menjadi 0,25% (tidak dipungut kepada konsumen akhir, UMKM Suket, SKB, serta sesuai PMK 52/2025 dikecualikan tanpa SKB untuk penjualan ke LJK Bulion berizin OJK, Bank Indonesia, & pasar fisik emas digital), disertai PPN Besaran Tertentu 1,1% atau 1,65%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk48-2023-emas',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PMK 48/2023 jo. PMK 52/2025: PPh Pasal 22 (0,25%) & PPN Emas Perhiasan/Batangan',
  legalBasis: 'PMK Nomor 48 Tahun 2023 sttd PMK Nomor 52 Tahun 2025 & PMK Nomor 51 Tahun 2025',
  effectiveDate: '1 Mei 2023 (Pembaruan PMK 51/2025 & PMK 52/2025 per 1 Agustus 2025)',
  readMinutes: 5,
  summary:
    'Membedakan kewajiban PPh Pasal 22 sebesar 0,25% dan PPN Besaran Tertentu (1,1% vs 1,65%) di sepanjang rantai pabrikan, pedagang emas perhiasan, konsumen akhir, serta pengecualian tanpa SKB kepada LJK Bulion berizin OJK (PMK 52/2025).',
  sections: [
    {
      heading: 'Penyeragaman tarif PPh 22 menjadi 0,25% & pengecualian LJK Bulion (PMK 52/2025)',
      paragraphs: [
        'Sebelum Mei 2023 (era PMK 34/2017 jo. PMK 41/2022), penjualan emas batangan oleh produsen dalam negeri dikenai PPh 22 sebesar 0,45%, sedangkan pedagang emas perhiasan kerap menghadapi kerumitan administrasi faktur. Melalui PMK Nomor 48 Tahun 2023, pemerintah menurunkan tarif PPh Pasal 22 atas penjualan emas perhiasan dan emas batangan menjadi 0,25% dari harga jual (bersifat tidak final dan dapat dikreditkan).',
        'Pemungutan PPh Pasal 22 sebesar 0,25% ini dikecualikan (0%) apabila pembeli adalah konsumen akhir, Wajib Pajak UMKM yang menyerahkan fotokopi Surat Keterangan PP 23/55/20, atau Wajib Pajak pemilik SKB PPh 22. Sejak 1 Agustus 2025 melalui PMK Nomor 52 Tahun 2025 (perubahan kedua PMK 48/2023), penjualan emas perhiasan/batangan oleh pengusaha emas kepada LJK penyelenggara kegiatan usaha bulion berizin OJK, Bank Indonesia, maupun melalui pasar fisik emas digital Bappebti juga dikecualikan dari PPh 22 tanpa memerlukan SKB guna menghindari pemungutan ganda dengan PMK 51/2025.',
      ],
    },
    {
      heading: 'PPN Besaran Tertentu 1,1% vs 1,65% atas emas perhiasan',
      paragraphs: [
        'Khusus emas perhiasan, PMK 48/2023 menerapkan skema PPN Besaran Tertentu (dengan Pajak Masukan tidak dapat dikreditkan): Pabrikan yang menjual ke pedagang lain mengenakan PPN 1,1% (10% × tarif PPN), sedangkan penjualan pabrikan langsung kepada konsumen akhir dikenai 1,65% (15% × tarif PPN).',
        'Bagi Pedagang Emas Perhiasan (toko emas), tarif PPN-nya adalah 1,1% apabila pedagang memiliki Faktur Pajak atas perolehan emas yang dijualnya, atau 1,65% apabila tidak memiliki Faktur Pajak atas perolehannya. Adapun emas batangan yang memenuhi kriteria investasi tetap mendapat fasilitas PPN Tidak Dipungut (0%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum Mei 2023 (PMK 34/2017 & PMK 30/2014)',
    newHeader: 'PMK 48/2023 jo. PMK 51/2025 (1 Mei 2023–Kini)',
    rows: [
      {
        aspek: 'PPh 22 penjualan emas batangan / perhiasan (antar pelaku usaha)',
        aturanLama: '0,45% (emas batangan PMK 34/2017)',
        aturanBaru: '0,25% (tidak final; 0% jika pembeli konsumen akhir)',
      },
      {
        aspek: 'PPN Pedagang Emas Perhiasan punya Faktur Pajak perolehan',
        aturanLama: '2% / 2,2% (DPP nilai lain 20% dari harga jual)',
        aturanBaru: '1,1% (10% dari tarif PPN; Pajak Masukan tidak dikreditkan)',
      },
      {
        aspek: 'PPN Pabrikan ke Konsumen Akhir / Pedagang tanpa Faktur Pajak',
        aturanLama: '2% / 2,2% (DPP nilai lain 20%)',
        aturanBaru: '1,65% (15% dari tarif PPN)',
      },
    ],
  },
  caseExample: {
    title: 'Toko emas (Pedagang dengan Faktur Pajak) menjual perhiasan ke pedagang lain Rp 200 juta',
    scenario:
      'Pedagang emas perhiasan yang memiliki Faktur Pajak perolehan menjual perhiasan senilai Rp 200.000.000 kepada pedagang PKP lain: terutang PPh Pasal 22 sebesar 0,25% (Rp 500.000) dan PPN Besaran Tertentu 1,1% (Rp 2.200.000).',
    presetRegime: 'pph22_pmk48_2023_emas',
    presetInput: {
      pph22: {
        nilaiDasar: 200000000,
        objectType: 'bulion_emas',
        hasNpwp: true,
        skemaEmas: 'pedagang_punya_fp',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk48_2023EmasRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiDasar);
    const skema = input.skemaEmas ?? 'pabrikan_ke_pedagang_pkp';

    const configMap: Record<
      NonNullable<TaxCalculatorInput['pph22']['skemaEmas']>,
      { label: string; pph22Rate: number; ppnRate: number }
    > = {
      pabrikan_ke_pedagang_pkp: {
        label: 'Pabrikan emas perhiasan -> Pedagang / Pabrikan lain (PPh 22 0,25% + PPN 1,1%)',
        pph22Rate: 0.25,
        ppnRate: 1.1,
      },
      pabrikan_ke_konsumen: {
        label: 'Pabrikan emas perhiasan -> Konsumen Akhir (PPh 22 0% + PPN 1,65%)',
        pph22Rate: 0,
        ppnRate: 1.65,
      },
      pedagang_punya_fp: {
        label: 'Pedagang emas (punya Faktur Pajak perolehan) -> Pelaku Usaha (PPh 22 0,25% + PPN 1,1%)',
        pph22Rate: 0.25,
        ppnRate: 1.1,
      },
      pedagang_punya_fp_konsumen: {
        label: 'Pedagang emas (punya Faktur Pajak perolehan) -> Konsumen Akhir (PPh 22 0% + PPN 1,1%)',
        pph22Rate: 0,
        ppnRate: 1.1,
      },
      pedagang_tanpa_fp_usaha: {
        label: 'Pedagang emas (tanpa Faktur Pajak perolehan) -> Pelaku Usaha (PPh 22 0,25% + PPN 1,65%)',
        pph22Rate: 0.25,
        ppnRate: 1.65,
      },
      pedagang_tanpa_fp: {
        label: 'Pedagang emas (tanpa Faktur Pajak perolehan) -> Konsumen Akhir (PPh 22 0% + PPN 1,65%)',
        pph22Rate: 0,
        ppnRate: 1.65,
      },
      emas_batangan: {
        label: 'Penjualan emas batangan / bulion non-konsumen akhir (PPh 22 0,25% + PPN 0%)',
        pph22Rate: 0.25,
        ppnRate: 0,
      },
    };

    const cfg = configMap[skema];
    const pph22 = Math.round((nilai * cfg.pph22Rate) / 100);
    const ppn = Math.round((nilai * cfg.ppnRate) / 100);
    const totalPajak = pph22 + ppn;
    const totalBayar = nilai + totalPajak;

    const steps: CalculationStep[] = [
      { label: 'Harga jual emas perhiasan / emas batangan', value: nilai },
      { label: 'Skema transaksi PMK 48/2023', formula: cfg.label, value: cfg.pph22Rate + cfg.ppnRate, format: 'percent' },
      {
        label: `PPh Pasal 22 dipungut (${formatPersen(cfg.pph22Rate)})`,
        formula: `${formatRupiah(nilai)} x ${formatPersen(cfg.pph22Rate)}`,
        value: pph22,
        isHighlight: true,
      },
      {
        label: `PPN Besaran Tertentu (${formatPersen(cfg.ppnRate)})`,
        formula: cfg.ppnRate > 0 ? `${formatRupiah(nilai)} x ${formatPersen(cfg.ppnRate)}` : 'Tidak dipungut / Bebas PPN',
        value: ppn,
      },
      { label: 'Total tagihan (Harga Jual + PPh 22 + PPN)', value: totalBayar },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Emas (PMK 48/2023)',
      primaryTaxAmount: pph22,
      annualTaxLabel: 'Total PPh 22 + PPN Emas',
      annualTaxAmount: totalPajak,
      effectiveRatePercent: cfg.pph22Rate,
      effectiveRateLabel: 'Tarif PPh Pasal 22',
      takeHomeOrNetLabel: 'Total Tagihan Transaksi',
      takeHomeOrNetAmount: totalBayar,
      steps,
      notes: [
        'PPh Pasal 22 sebesar 0,25% bersifat tidak final (kredit pajak pembeli) dan dikecualikan tanpa SKB bila pembeli merupakan konsumen akhir, LJK Bulion berizin OJK, Bank Indonesia, atau melalui pasar fisik emas digital (PMK 52/2025 efektif 1 Agustus 2025), maupun pemegang SKB/Suket UMKM.',
        'Sesuai PMK 48/2023 jo. PMK 11/2025, PPN Besaran Tertentu emas perhiasan tetap efektif 1,1% (10% x 11/12 x 12%) atau 1,65% (15% x 11/12 x 12%) dan Pajak Masukan perolehan tidak dapat dikreditkan.',
      ],
    };
  },
};
