import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_64_2022, SRC.PMK_11_2025, SRC.UU_42_2009];

const regime: TaxRegime = {
  id: 'ppn_pmk64_2022_pertanian',
  taxType: 'ppn',
  name: 'PMK 64/PMK.03/2022 (PPN Besaran Tertentu Barang Hasil Pertanian Tertentu 1,1%)',
  shortName: '2022–Kini (PPN Hasil Pertanian 1,1%)',
  legalBasis: 'PMK Nomor 64/PMK.03/2022 jo. Pasal 9A UU PPN (UU HPP)',
  effectivePeriod: '1 April 2022 – Sekarang (Diselaraskan PMK 11/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PKP pemungut hasil pertanian/perkebunan/kehutanan tertentu (1,1%)',
  summary:
    'Skema pemungutan PPN Besaran Tertentu sebesar 1,1% (10% × tarif PPN 11%) atas penyerahan Barang Hasil Pertanian Tertentu (BHPT) seperti tandan buah segar sawit, cangkang sawit, biji kopi/kakao sangrai, karet, dan hasil hutan tertentu sebagaimana diatur pada Lampiran PMK 64/PMK.03/2022.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk64-2022-pertanian',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Besaran Tertentu 1,1% Barang Hasil Pertanian Tertentu (PMK 64/PMK.03/2022)',
  legalBasis: 'PMK Nomor 64/PMK.03/2022 jo. PMK 11/2025',
  effectiveDate: '1 April 2022',
  readMinutes: 4,
  summary:
    'Membahas tarif final administrasi 1,1% bagi PKP penjual hasil perkebunan/pertanian tertentu sebagai pilihan pemungutan sederhana menggantikan mekanisme umum Pajak Keluaran – Pajak Masukan.',
  sections: [
    {
      heading: 'Pilihan skema Besaran Tertentu 1,1% untuk hasil perkebunan dan pertanian',
      paragraphs: [
        'Berdasarkan PMK Nomor 64/PMK.03/2022, Pengusaha Kena Pajak (PKP) yang menyerahkan Barang Hasil Pertanian Tertentu (seperti hasil perkebunan kelapa sawit/TBS, cangkang, kakao kering, teh, tebu, hasil kehutanan kayu gelondongan, dan tanaman perkebunan lain di lampiran PMK) dapat memilih memungut dan menyetor PPN menggunakan besaran tertentu sebesar 10% dari tarif PPN (yakni 1,1% dari harga jual).',
        'Dengan memilih skema 1,1% PMK 64/2022, PKP tidak lagi memperhitungkan Pajak Masukan atas perolehan BKP/JKP terkait penyerahan BHPT tersebut, sedangkan bagi PKP pembeli (pabrik pengolahan/eksportir), PPN 1,1% pada Faktur Pajak tetap dapat dikreditkan sepanjang memenuhi ketentuan pengkreditan Pajak Masukan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Skema Umum UU PPN (PMK 131/2024)',
    newHeader: 'Skema Besaran Tertentu (PMK 64/2022 jo. PMK 11/2025)',
    rows: [
      {
        aspek: 'Tarif PPN yang dipungut di faktur',
        aturanLama: '11% efektif (12% × DPP 11/12)',
        aturanBaru: '1,1% dari Harga Jual',
      },
      {
        aspek: 'Pengkreditan Pajak Masukan oleh penjual',
        aturanLama: 'Dapat dikreditkan',
        aturanBaru: 'Tidak dapat dikreditkan (sudah diperhitungkan dalam 1,1%)',
      },
      {
        aspek: 'Pengkreditan Pajak Masukan oleh pembeli (PKP)',
        aturanLama: 'Dapat dikreditkan',
        aturanBaru: 'Tetap DAPAT dikreditkan oleh PKP pembeli',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan hasil perkebunan (TBS / cangkang sawit) Rp 500 juta dengan PMK 64/2022',
    scenario:
      'PKP perkebunan menjual hasil pertanian tertentu senilai Rp 500.000.000 kepada pabrik pengolahan dengan memilih skema PMK 64/2022. PPN Besaran Tertentu yang dipungut adalah 1,1% × Rp 500.000.000 = Rp 5.500.000.',
    presetRegime: 'ppn_pmk64_2022_pertanian',
    presetInput: {
      ppn: {
        hargaJualDpp: 500000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk64_2022PertanianRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const rate = 1.1;
    const dpp = input.termasukPpn ? Math.round(raw / (1 + rate / 100)) : raw;
    const ppn = Math.round((dpp * rate) / 100);
    const total = dpp + ppn;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual Barang Hasil Pertanian Tertentu (DPP)',
        formula: input.termasukPpn ? 'Diekstrak dari total inklusif PPN 1,1%' : undefined,
        value: dpp,
      },
      { label: 'Besaran tertentu PPN BHPT (PMK 64/2022)', value: rate, format: 'percent' },
      {
        label: 'PPN Besaran Tertentu wajib dipungut & disetor',
        formula: `${formatRupiah(dpp)} x ${formatPersen(rate)}`,
        value: ppn,
        isHighlight: true,
      },
      { label: 'Total tagihan kepada pembeli', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Hasil Pertanian (1,1% PMK 64/2022)',
      primaryTaxAmount: ppn,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Tagihan Penjualan',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        'PKP wajib menyampaikan pemberitahuan penggunaan besaran tertentu kepada DJP paling lambat saat batas penyampaian SPT Masa PPN masa pajak pertama digunakannya skema ini.',
        'Pajak Masukan atas perolehan barang/jasa yang berhubungan dengan penyerahan BHPT tidak dapat dikreditkan oleh PKP penjual yang memakai PMK 64/2022.',
      ],
    };
  },
};
