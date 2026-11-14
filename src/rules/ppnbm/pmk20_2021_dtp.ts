import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_20_2021, SRC.PMK_31_2021, SRC.PMK_5_2022, SRC.PP_41_2013];

const regime: TaxRegime = {
  id: 'ppnbm_pmk20_2021_dtp',
  taxType: 'ppnbm',
  name: 'PMK 20/2021, PMK 31/2021 & PMK 5/2022 (PPnBM DTP Otomotif Pandemi 100%–25%)',
  shortName: '2021–2022 (DTP Otomotif COVID-19)',
  legalBasis: 'PMK 20/PMK.010/2021, PMK 31/PMK.010/2021, & PMK 5/PMK.010/2022',
  effectivePeriod: '1 Maret 2021 – 30 September 2022',
  isCurrent: false,
  summary:
    'Stimulus historis pemulihan industri otomotif nasional selama pandemi COVID-19: PPnBM Ditanggung Pemerintah (DTP) atas penyerahan mobil penumpang CKD dengan TKDN tinggi: diskon 100% (Maret–Desember 2021 lewat PMK 20/31/120 Tahun 2021 untuk <= 1.500 cc & 50% untuk 1.501–2.500 cc), serta fase tapering 100% LCGC dan 50% mobil <= Rp 250 juta pada tahun 2022 (PMK 5/2022).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pmk20-2021-dtp',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'PPnBM DTP Otomotif Era Pandemi: PMK 20/2021, PMK 31/2021, hingga PMK 5/2022',
  legalBasis: 'PMK 20/PMK.010/2021, PMK 31/PMK.010/2021 & PMK 5/PMK.010/2022',
  effectiveDate: '1 Maret 2021 (Berakhir 30 September 2022)',
  readMinutes: 5,
  summary:
    'Membedah skema diskon pajak mobil baru sebesar 100%, 50%, dan 25% dari tarif PPnBM normal sepanjang 2021–2022 yang menjadi katalis lonjakan penjualan mobil CKD bertingkat kandungan lokal tinggi.',
  sections: [
    {
      heading: 'Tahapan persentase DTP 100% -> 50% -> 25% pada 2021–2022',
      paragraphs: [
        'Melalui PMK 20/PMK.010/2021 (berlaku 1 Maret 2021), mobil 4x2 <= 1.500 cc dengan TKDN >= 70% memperoleh PPnBM DTP 100% (tarif normal 10% menjadi 0%). Kemudian PMK 31/PMK.010/2021 memperluas insentif bagi segmen 1.501–2.500 cc (TKDN >= 60%) dengan diskon 50% (untuk 4x2) atau 25% (untuk 4x4), sebelum seluruh segmen <= 1.500 cc diperpanjang DTP 100% hingga Desember 2021.',
        'Memasuki 2022, PMK 5/PMK.010/2022 menurunkan subsidi secara bertahap (tapering off): LCGC mendapat DTP 100% pada Q1 (menjadi 66,67% di Q2 dan 33,33% di Q3 2022 hingga habis di Q4), sedangkan mobil <= 1.500 cc dengan harga Rp 200–250 juta mendapat DTP 50% hanya pada Q1 2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 20/2021 & PMK 31/2021 (2021)',
    newHeader: 'PMK 5/PMK.010/2022 (Q1–Q3 2022)',
    rows: [
      {
        aspek: 'Mobil <= 1.500 cc TKDN >= 70%',
        aturanLama: 'PPnBM DTP 100% (0% bayar — Mar–Des 2021)',
        aturanBaru: 'DTP 50% hanya Q1 2022 untuk harga Rp 200–250 jt',
      },
      {
        aspek: 'Mobil 1.501–2.500 cc (PMK 31/2021) & LCGC (PMK 5/2022)',
        aturanLama: 'DTP 50% (4x2) & DTP 25% (4x4)',
        aturanBaru: 'LCGC tapering: DTP 100% (Q1), 66,7% (Q2), 33,3% (Q3)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi pembelian sedan/SUV menengah Rp 350 juta dengan diskon DTP 50% (PMK 31/2021)',
    scenario:
      'Konsumen membeli mobil penumpang 1.501–2.500 cc seharga Rp 350.000.000 yang tarif dasar PP 41/2013-nya 20%–30% (di sini disimulasikan tarif 20% menjadi Rp 70 juta); dengan diskon DTP 50% hanya dibayar Rp 35 juta.',
    presetRegime: 'ppnbm_pmk20_2021_dtp',
    presetInput: {
      ppnbm: {
        hargaJual: 350000000,
        categoryType: 'sedan_suv_menengah',
        dtpDiscountPersen: 50,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnbmPmk20_2021DtpRule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const discountPersen = input.dtpDiscountPersen ?? 100;
    let baseRate = 20;
    if (input.categoryType === 'lcgc') baseRate = 3;
    else if (input.categoryType === 'listrik_bev') baseRate = 0;
    else if (input.categoryType === 'sedan_suv_menengah') baseRate = 20;
    else if (input.categoryType === 'hybrid_full') baseRate = 10;
    else if (input.categoryType === 'kendaraan_emisi_tinggi') baseRate = 40;
    else if (input.categoryType === 'hunian_mewah') baseRate = 20;
    else baseRate = 75;

    const isVehicleEligible =
      input.categoryType !== 'hunian_mewah' && input.categoryType !== 'kapal_pesiar_pesawat';
    const appliedDiscount = isVehicleEligible ? discountPersen : 0;

    const baseTax = Math.round((hargaJual * baseRate) / 100);
    const dtpAmount = Math.round((baseTax * appliedDiscount) / 100);
    const finalTax = Math.max(0, baseTax - dtpAmount);
    const effRate = hargaJual > 0 ? (finalTax / hargaJual) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan CKD', value: hargaJual },
      { label: `PPnBM normal sebelum diskon DTP (${formatPersen(baseRate)})`, value: baseTax },
      {
        label: isVehicleEligible
          ? `Diskon PPnBM Ditanggung Pemerintah (${appliedDiscount}% — PMK 20/31/2021)`
          : 'Barang non-kendaraan tidak memperoleh fasilitas DTP otomotif',
        value: -dtpAmount,
        isNegative: true,
      },
      {
        label: 'PPnBM bersih dibayar konsumen',
        formula: `Tarif efektif menjadi ${formatPersen(effRate)}`,
        value: finalTax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `PPnBM Dibayar (Diskon DTP ${appliedDiscount}%)`,
      primaryTaxAmount: finalTax,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Harga Setelah PPnBM (Belum PPN)',
      takeHomeOrNetAmount: hargaJual + finalTax,
      steps,
      notes: [
        'Insentif DTP PMK 20/2021–PMK 5/2022 khusus mensyaratkan kandungan lokal (local purchase) minimal 60%–70% sesuai penetapan Kementerian Perindustrian pada 2021–2022.',
      ],
    };
  },
};
