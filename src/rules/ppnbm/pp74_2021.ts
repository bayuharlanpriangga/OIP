import {
  CalculationStep,
  PpnbmCategoryType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppnbm_pp74_2021',
  taxType: 'ppnbm',
  name: 'PP 73/2019 jo. PP 74/2021, PMK 141/2021 & PMK 15/2023',
  shortName: '2021–Kini (PP 74/2021 Emisi)',
  legalBasis:
    'PP 73/2019 jo. PP 74/2021 & PMK 141/PMK.010/2021 (Kendaraan); PMK 96/PMK.03/2021 jo. PMK 15/2023 (Non-Kendaraan)',
  effectivePeriod: '16 Oktober 2021 – Sekarang',
  isCurrent: true,
  summary:
    'PPnBM kendaraan bermotor berbasis emisi CO2 (BEV 0%, LCGC 3% efektif, full hybrid efisien 6% efektif, konvensional 15%–40%), serta barang mewah non-kendaraan 20% (hunian >= Rp 30M) s.d. 75% (kapal/pesawat).',
  sources: [SRC.PP_74_2021, SRC.PP_73_2019, SRC.PMK_141_2021, SRC.PMK_96_2021, SRC.PMK_15_2023],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'ppnbm-pp74-2021',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Transformasi PPnBM Berbasis Emisi Karbon (PP 74/2021) dan Barang Mewah Non-Kendaraan',
  legalBasis:
    'PP 73/2019 jo. PP 74/2021 & PMK 141/PMK.010/2021; PMK 96/PMK.03/2021 jo. PMK 15/PMK.03/2023',
  effectiveDate: '16 Oktober 2021',
  readMinutes: 5,
  summary:
    'Menggantikan rezim berbasis isi silinder (PP 41/2013), PP 73/2019 jo. PP 74/2021 dan PMK 141/PMK.010/2021 menetapkan tarif PPnBM kendaraan berdasarkan emisi CO2, sementara barang mewah non-kendaraan diatur melalui PMK 96/PMK.03/2021 jo. PMK 15/PMK.03/2023.',
  sections: [
    {
      heading: 'Dari kapasitas mesin (cc) ke emisi karbon (gram CO2/km)',
      paragraphs: [
        'Pada PP 41/2013, mobil sedan dikenai PPnBM jauh lebih tinggi dibanding minibus/MPV meskipun berkapasitas mesin sama. Mulai 16 Oktober 2021 lewat PP 73/2019 jo. PP 74/2021 serta aturan pelaksananya PMK 141/PMK.010/2021, perlakuan antar-model bodi disamakan dan diukur dari emisi CO2 serta konsumsi bahan bakar.',
        'Kendaraan listrik murni (BEV) memperoleh tarif efektif 0% (tarif 15% dengan DPP 0%). Kendaraan LCGC (KBH2) dikenai tarif 15% dengan DPP 20% sehingga efektif 3%, sedangkan mobil full hybrid hemat emisi hingga 3.000 cc dikenai tarif 15% dengan DPP 40% sehingga efektif 6%. Kendaraan konvensional s.d. 3.000 cc dikenai tarif 15%, 20%, 25%, hingga 40% sesuai tingkat emisi.',
      ],
    },
    {
      heading: 'Barang mewah selain kendaraan bermotor (PMK 96/2021 jo. PMK 15/2023)',
      paragraphs: [
        'Terpisah dari PMK 141/PMK.010/2021 yang khusus mengatur kendaraan bermotor, PPnBM atas barang kena pajak tergolong mewah selain kendaraan diatur dalam PMK 96/PMK.03/2021 jo. PMK 15/PMK.03/2023 (pelaksana PP 61/2020): tarif 20% untuk hunian mewah (rumah/apartemen dengan harga jual Rp 30 miliar atau lebih), 40%–50% untuk balon udara, peluru, dan senjata api, serta 75% untuk kapal pesiar, yacht, dan pesawat udara pribadi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 41/2013 & PMK 35/2017 (2013–2021)',
    newHeader: 'PP 74/2021 & PMK 15/2023 (Kini)',
    rows: [
      {
        aspek: 'Tolok ukur utama kendaraan',
        aturanLama: 'Kapasitas cc, tipe bodi (sedan/MPV), & 4x2/4x4',
        aturanBaru: 'Emisi CO2 (g/km) & teknologi elektrifikasi (PMK 141/2021)',
      },
      {
        aspek: 'LCGC & Mobil Listrik (BEV)',
        aturanLama: 'LCGC 0% (PP 41/2013); BEV belum khusus',
        aturanBaru: 'BEV 0%; LCGC 3% efektif (15% x DPP 20%)',
      },
      {
        aspek: 'Full Hybrid hemat emisi (< 3.000 cc)',
        aturanLama: 'Mengikuti cc mesin bensin (10% – 40%)',
        aturanBaru: '6% efektif (15% x DPP 40%) di PP 74/2021',
      },
      {
        aspek: 'Hunian mewah non-kendaraan',
        aturanLama: '20% (batasan mulai Rp 10M/20M di PMK 35/2017)',
        aturanBaru: '20% (batasan >= Rp 30M di PMK 96/2021 jo. PMK 15/2023)',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan SUV beremisi menengah dengan harga jual Rp 450 juta',
    scenario:
      'Pabrikan menyerahkan kendaraan penumpang beremisi sedang (tarif PPnBM 20%) dengan Dasar Pengenaan Pajak Rp 450.000.000.',
    presetRegime: 'ppnbm_pp74_2021',
    presetInput: {
      ppnbm: {
        hargaJual: 450000000,
        categoryType: 'sedan_suv_menengah',
      },
    },
  },
};

function getCurrentPpnbmMeta(cat: PpnbmCategoryType): { rate: number; dppRatio: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
      return {
        rate: 15,
        dppRatio: 0,
        label: 'Kendaraan listrik murni BEV/FCEV (Tarif 15% x DPP 0% = 0% efektif)',
      };
    case 'lcgc':
      return {
        rate: 15,
        dppRatio: 0.2,
        label: 'LCGC / KBH2 (Tarif 15% x DPP 20% = 3% efektif — PP 74/2021)',
      };
    case 'hybrid_full':
      return {
        rate: 15,
        dppRatio: 0.4,
        label: 'Full Hybrid sangat hemat emisi <= 3.000 cc (Tarif 15% x DPP 40% = 6% efektif — PP 74/2021)',
      };
    case 'sedan_suv_menengah':
      return {
        rate: 20,
        dppRatio: 1,
        label: 'Mobil penumpang emisi menengah s.d. 3.000 cc (20% x DPP 100%)',
      };
    case 'kendaraan_emisi_tinggi':
      return {
        rate: 40,
        dppRatio: 1,
        label: 'Kendaraan konvensional emisi tinggi s.d. 3.000 cc (40% x DPP 100%)',
      };
    case 'hunian_mewah':
      return {
        rate: 20,
        dppRatio: 1,
        label: 'Hunian mewah >= Rp 30 miliar — PMK 96/2021 jo. PMK 15/2023 (20%)',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 75,
        dppRatio: 1,
        label: 'Kapal pesiar, yacht, & pesawat pribadi non-niaga — PMK 96/2021 jo. PMK 15/2023 (75%)',
      };
  }
}

export const ppnbmPp74_2021Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getCurrentPpnbmMeta(input.categoryType);
    const dppKhusus = Math.round(hargaJual * meta.dppRatio);
    const effectiveRate = meta.rate * meta.dppRatio;
    const ppnbm = Math.round((dppKhusus * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan BKP tergolong mewah (sebelum pajak)', value: hargaJual },
      {
        label: `DPP PPnBM (${Math.round(meta.dppRatio * 100)}% dari harga jual)`,
        formula: meta.label,
        value: dppKhusus,
      },
      {
        label: 'Tarif PPnBM efektif',
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPnBM terutang',
        formula: `${formatRupiah(dppKhusus)} x ${formatPersen(meta.rate)}`,
        value: ppnbm,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPnBM Terutang',
      primaryTaxAmount: ppnbm,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Harga Setelah PPnBM (Belum Termasuk PPN)',
      takeHomeOrNetAmount: hargaJual + ppnbm,
      steps,
      notes: [
        'PPnBM hanya dipungut satu kali pada tingkat penyerahan oleh pabrikan atau saat impor dan tidak dapat dikreditkan seperti PPN.',
        'Berdasarkan PMK 131/2024, BKP tergolong mewah juga dikenakan PPN 12% penuh dengan DPP harga jual.',
      ],
    };
  },
};
