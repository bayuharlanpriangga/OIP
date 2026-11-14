import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_12_2025, SRC.PMK_9_2024, SRC.PP_74_2021];

const regime: TaxRegime = {
  id: 'ppnbm_pmk12_2025_dtp',
  taxType: 'ppnbm',
  name: 'PMK 12/2025 jo. PMK 9/2024 (PPnBM DTP Hybrid 3% & EV KBLBB)',
  shortName: '2024–2025 (DTP Hybrid 3% & EV)',
  legalBasis: 'PMK Nomor 12 Tahun 2025 & PMK Nomor 9 Tahun 2024 jo. PP 74/2021',
  effectivePeriod: '1 Januari 2024 – 31 Desember 2025 (Stimulus Berakhir 31 Des 2025)',
  isCurrent: false,
  summary:
    'Insentif pajak otomotif elektrifikasi TA 2024–2025 (berakhir 31 Desember 2025): (1) PPnBM Ditanggung Pemerintah sebesar 3% untuk kendaraan bermotor roda empat Low Carbon Emission Vehicle (Hybrid / Mild Hybrid / Plug-in Hybrid) di dalam PMK 12/2025 — memangkas beban efektif Full Hybrid PP 74/2021 dari 6% menjadi 3%; dan (2) Pembebasan PPnBM 100% (0%) atas impor CBU/CKD kendaraan listrik baterai (KBLBB/BEV) dengan komitmen TKDN (PMK 9/2024 jo. PMK 12/2025).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pmk12-2025-dtp',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Insentif PPnBM DTP 3% Mobil Hybrid & Mobil Listrik: PMK 12/2025 jo. PMK 9/2024',
  legalBasis: 'PMK Nomor 12 Tahun 2025, PMK Nomor 9 Tahun 2024, & PP Nomor 74 Tahun 2021',
  effectiveDate: '4 Februari 2025 (Berlaku Masa Pajak Jan–Des 2025; KBLBB sejak TA 2024)',
  readMinutes: 5,
  summary:
    'Untuk pertama kalinya sejak skema emisi PP 74/2021, kendaraan bermotor Hybrid (Full Hybrid, Mild Hybrid, Plug-in Hybrid) produksi dalam negeri menerima subsidi PPnBM DTP sebesar 3% sepanjang Tahun Anggaran 2025 melalui PMK 12/2025.',
  sections: [
    {
      heading: 'Diskon PPnBM DTP 3% atas Hybrid LCEV pada PMK 12/2025',
      paragraphs: [
        'Di bawah ketentuan normal PP Nomor 74 Tahun 2021, mobil Full Hybrid hemat emisi hingga 3.000 cc dikenai tarif PPnBM 15% dengan DPP 40%, sehingga tarif efektifnya 6% dari harga jual pabrikan (sedangkan Mild Hybrid 8%–12% tergantung kategori).',
        'Melalui PMK Nomor 12 Tahun 2025 (berlaku untuk Tahun Anggaran 2025), pemerintah memberikan PPnBM Ditanggung Pemerintah (DTP) sebesar 3% dari harga jual kepada pabrikan yang memproduksi LCEV (Full Hybrid, Mild Hybrid, atau Plug-in Hybrid) yang memenuhi syarat TKDN program KBLBB Kementerian Perindustrian. Artinya, untuk Full Hybrid bertarif efektif normal 6%, pembeli/pabrikan hanya membayar selisihnya sebesar 3%.',
      ],
    },
    {
      heading: 'Kelanjutan pembebasan CBU BEV 100% (PMK 9/2024 & PMK 12/2025)',
      paragraphs: [
        'Sejak Tahun Anggaran 2024 melalui PMK 9/2024 dan berlanjut di PMK 12/2025, kendaraan listrik baterai murni (BEV) baik CBU maupun CKD dengan komitmen investasi pembangunan pabrik di Indonesia memperoleh PPnBM DTP 100% (0% dibayar) bersama dengan PPN DTP 10% (pembeli hanya membayar PPN 2% atau 1% dengan DPP 11/12 untuk TKDN >= 40%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 74/2021 Normal (2021–2024)',
    newHeader: 'PMK Nomor 12 Tahun 2025 (Jan–Des 2025)',
    rows: [
      {
        aspek: 'Full Hybrid sangat hemat emisi <= 3.000 cc',
        aturanLama: '6% efektif (15% × DPP 40%) dibayar penuh',
        aturanBaru: 'Tarif 6% dikurangi 3% DTP -> hanya 3% efektif dibayar',
      },
      {
        aspek: 'Kendaraan Listrik Murni (BEV / FCEV)',
        aturanLama: '0% (CKD umum)',
        aturanBaru: '0% (CKD maupun CBU berkomitmen investasi — PMK 9/2024 & PMK 12/2025)',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan mobil Full Hybrid harga Rp 400 juta dengan insentif PPnBM DTP 3%',
    scenario:
      'Pabrikan menyerahkan SUV Full Hybrid LCEV memenuhi syarat TKDN dengan harga jual Rp 400.000.000 pada tahun 2025. Tarif PP 74/2021 sebesar 6% (Rp 24 juta) ditanggung pemerintah sebesar 3% (Rp 12 juta), sehingga PPnBM yang dipungut hanya 3% (Rp 12 juta).',
    presetRegime: 'ppnbm_pmk12_2025_dtp',
    presetInput: {
      ppnbm: {
        hargaJual: 400000000,
        categoryType: 'hybrid_full',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnbmPmk12_2025DtpRule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    let baseEffRate = 20;
    let dtpRate = 0;
    let desc = 'Kendaraan konvensional (tidak memperoleh DTP 3% Hybrid)';

    switch (input.categoryType) {
      case 'listrik_bev':
        baseEffRate = 0;
        dtpRate = 0;
        desc = 'KBLBB / BEV (Bebas PPnBM 0% — PMK 9/2024 jo. PMK 12/2025)';
        break;
      case 'lcgc':
        baseEffRate = 3;
        dtpRate = 0;
        desc = 'LCGC / KBH2 (Tetap 3% efektif PP 74/2021)';
        break;
      case 'hybrid_full':
        baseEffRate = 6;
        dtpRate = 3;
        desc = 'Full Hybrid LCEV <= 3.000 cc (6% dikurangi DTP 3% = 3% — PMK 12/2025)';
        break;
      case 'sedan_suv_menengah':
        baseEffRate = 20;
        dtpRate = 0;
        desc = 'Kendaraan penumpang konvensional 20% (tidak termasuk objek DTP 2025)';
        break;
      case 'kendaraan_emisi_tinggi':
        baseEffRate = 40;
        dtpRate = 0;
        desc = 'Kendaraan emisi tinggi 40% (non-DTP)';
        break;
      case 'hunian_mewah':
        baseEffRate = 20;
        dtpRate = 0;
        desc = 'Hunian mewah >= Rp 30 M (non-kendaraan, non-DTP)';
        break;
      case 'balon_udara_peluru':
        baseEffRate = 40;
        dtpRate = 0;
        desc = 'Balon udara, pesawat tanpa penggerak, & peluru 40% (non-kendaraan, non-DTP)';
        break;
      case 'helikopter_senjata_api':
        baseEffRate = 50;
        dtpRate = 0;
        desc = 'Helikopter/pesawat komersial non-niaga & senjata api 50% (non-kendaraan, non-DTP)';
        break;
      case 'kapal_pesiar_pesawat':
        baseEffRate = 75;
        dtpRate = 0;
        desc = 'Kapal pesiar / pesawat pribadi 75% (non-DTP)';
        break;
    }

    const netRate = Math.max(0, baseEffRate - dtpRate);
    const normalTax = Math.round((hargaJual * baseEffRate) / 100);
    const dtpSubsidy = Math.round((hargaJual * dtpRate) / 100);
    const payableTax = Math.max(0, normalTax - dtpSubsidy);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / impor', value: hargaJual },
      { label: `PPnBM normal PP 74/2021 (${formatPersen(baseEffRate)})`, value: normalTax },
      {
        label: dtpRate > 0 ? `Insentif PPnBM Ditanggung Pemerintah PMK 12/2025 (${formatPersen(dtpRate)})` : 'Insentif DTP PMK 12/2025',
        formula: desc,
        value: -dtpSubsidy,
        isNegative: true,
      },
      {
        label: 'PPnBM wajib dipungut / dibayar pembeli',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(netRate)}`,
        value: payableTax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPnBM Dibayar Pembeli (Setelah DTP 2025)',
      primaryTaxAmount: payableTax,
      effectiveRatePercent: netRate,
      takeHomeOrNetLabel: 'Harga Setelah PPnBM (Belum Termasuk PPN)',
      takeHomeOrNetAmount: hargaJual + payableTax,
      steps,
      notes: [
        dtpRate > 0
          ? `Sesuai PMK 12/2025, subsidi PPnBM DTP 3% menghemat ${formatRupiah(dtpSubsidy)} untuk kendaraan Full Hybrid LCEV memenuhi syarat TKDN selama tahun 2025.`
          : 'Pilih kategori Full Hybrid untuk melihat dampak diskon PPnBM DTP 3% PMK 12/2025, atau BEV untuk pembebasan 0%.',
      ],
    };
  },
};
