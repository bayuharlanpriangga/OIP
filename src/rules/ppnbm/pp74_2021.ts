import {
  CalculationStep,
  PpnbmCategoryType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'ppnbm_pp74_2021',
  taxType: 'ppnbm',
  name: 'PP 73/2019 jo. PP 74/2021 & PMK 15/2023',
  shortName: '2021–Kini (PP 74/2021 Emisi)',
  legalBasis: 'PP Nomor 73 Tahun 2019 jo. PP Nomor 74 Tahun 2021 & PMK 15/PMK.03/2023',
  effectivePeriod: '16 Oktober 2021 – Sekarang',
  isCurrent: true,
  summary:
    'PPnBM kendaraan bermotor berbasis emisi CO2 dan efisiensi BBM (BEV 0%, hybrid efisien mulai 6% efektif / DPP khusus, konvensional 15%–40%), serta barang mewah non-kendaraan 20%–75%.',
};

const article: TaxArticle = {
  id: 'ppnbm-pp74-2021',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Transformasi PPnBM Berbasis Emisi Karbon (PP 74/2021) dan Barang Mewah Non-Kendaraan',
  legalBasis: 'PP Nomor 73 Tahun 2019 jo. PP Nomor 74 Tahun 2021 & PMK 15/2023',
  effectiveDate: '16 Oktober 2021',
  readMinutes: 5,
  summary:
    'Menggantikan rezim berbasis isi silinder dan jenis penggerak 4x2/4x4 (PP 41/2013), PP 73/2019 jo. PP 74/2021 menetapkan tarif PPnBM mobil berdasarkan emisi CO2 sekaligus membebaskan kendaraan listrik murni (0%).',
  sections: [
    {
      heading: 'Dari kapasitas mesin (cc) ke emisi karbon (gram CO2/km)',
      paragraphs: [
        'Pada PP 41/2013, mobil sedan dikenai PPnBM jauh lebih tinggi dibanding minibus/MPV meskipun berkapasitas mesin sama. Mulai 16 Oktober 2021 lewat PP 73/2019 jo. PP 74/2021, perlakuan antar-model bodi disamakan dan diukur dari emisi CO2 serta konsumsi bahan bakar.',
        'Kendaraan listrik murni (BEV) dan sel bahan bakar (FCEV) memperoleh tarif efektif 0% (tarif 15% dengan Dasar Pengenaan Pajak 0%), sedangkan kendaraan LCGC dan hybrid efisien memperoleh DPP khusus sehingga tarif efektifnya lebih rendah (misalnya 3% hingga 8%). Kendaraan konvensional di bawah 3.000 cc dikenai tarif 15%, 20%, 25%, hingga 40% sesuai tingkat emisi.',
      ],
    },
    {
      heading: 'Barang mewah selain kendaraan bermotor (PMK 15/2023)',
      paragraphs: [
        'Untuk barang kena pajak tergolong mewah selain kendaraan bermotor, pemerintah menetapkan tarif 20% bagi hunian mewah (apartemen/rumah mewah di atas Rp 30 miliar), 40%–50% untuk balon udara, peluru, dan senjata api, serta 75% untuk kapal pesiar, yacht, dan pesawat udara pribadi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 41/2013 (2013–2021)',
    newHeader: 'PP 73/2019 jo. PP 74/2021 (Kini)',
    rows: [
      {
        aspek: 'Tolok ukur utama kendaraan',
        aturanLama: 'Kapasitas cc, tipe bodi (sedan/MPV), & 4x2/4x4',
        aturanBaru: 'Emisi CO2 (g/km) & teknologi rendah emisi',
      },
      {
        aspek: 'Mobil listrik murni (BEV)',
        aturanLama: 'Belum diatur khusus di klaster EV',
        aturanBaru: '0% (tarif 15% dengan DPP 0%)',
      },
      {
        aspek: 'Tarif mobil penumpang < 3.000 cc',
        aturanLama: '10% – 40% (sedan & 4x4 hingga 75%/125%)',
        aturanBaru: '15% – 40% (3.000–4.000 cc hingga 70%)',
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
    case 'lcgc_hybrid_hemat':
      return {
        rate: 15,
        dppRatio: 0.2,
        label: 'LCGC / Hybrid sangat hemat emisi (Tarif 15% x DPP 20% = 3% efektif)',
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
    case 'hunian_mewah_kapal_pesawat':
      return {
        rate: 75,
        dppRatio: 1,
        label: 'Kapal pesiar, yacht, & pesawat pribadi non-niaga — PMK 15/2023 (75%)',
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
