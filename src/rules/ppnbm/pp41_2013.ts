import {
  CalculationStep,
  PpnbmCategoryType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppnbm_pp41_2013',
  taxType: 'ppnbm',
  name: 'PP 41/2013 jo. PP 22/2014 & PMK 35/2017',
  shortName: '2013–2021 (PP 41/2013 CC)',
  legalBasis: 'PP 41/2013 jo. PP 22/2014 (Kendaraan) & PMK 106/2015 jo. PMK 35/2017 (Non-Kendaraan)',
  effectivePeriod: '23 Mei 2013 – 15 Oktober 2021',
  isCurrent: false,
  summary:
    'Aturan PPnBM lama berbasis kapasitas isi silinder (cc), tipe bodi (sedan vs minibus), dan 4x2/4x4 (0% LCGC, 10%–125%), serta 20% hunian mewah / 75% kapal & pesawat.',
  sources: [SRC.PP_41_2013, SRC.PP_22_2014, SRC.PMK_106_2015, SRC.PMK_35_2017],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pp41-2013',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'PP 41/2013: Era PPnBM Berbasis Kapasitas Mesin (CC), Bodi Sedan, dan LCGC 0%',
  legalBasis: 'PP Nomor 41 Tahun 2013 jo. PP 22/2014 & PMK 106/2015 jo. PMK 35/2017',
  effectiveDate: '23 Mei 2013',
  readMinutes: 4,
  summary:
    'Skema PPnBM kendaraan bermotor berdasarkan isi silinder (cc) dan bentuk bodi (10% s.d. 125%), serta pengenalan program insentif mobil hemat energi dan harga terjangkau (KBH2/LCGC 0%).',
  sections: [
    {
      heading: 'Diskriminasi tarif sedan vs. MPV/minibus dan puncak tarif 125%',
      paragraphs: [
        'Selama berlakunya PP Nomor 41 Tahun 2013 (lalu diperbaiki melalui PP 22/2014), tarif PPnBM kendaraan bermotor sangat ditentukan oleh jenis bodi dan isi silinder. Mobil penumpang 4x2 hingga 1.500 cc tipe minibus/MPV hanya dikenai 10%, sedangkan tipe sedan dengan kapasitas mesin yang sama langsung dikenai 30%.',
        'Untuk kendaraan mewah bermesin bensin di atas 3.000 cc (dan diesel di atas 2.500 cc), tarif PPnBM melonjak dari 75% (era PP 145/2000) menjadi 125% mengikuti batas maksimal revisi dalam UU 42/2009.',
      ],
    },
    {
      heading: 'Lahirnya KBH2/LCGC 0% dan pemisahan barang mewah non-kendaraan',
      paragraphs: [
        'PP 41/2013 merupakan regulasi yang melahirkan insentif mobil LCGC (KBH2) dengan DPP 0% sehingga tarif efektif PPnBM-nya 0%—sebelum akhirnya dinaikkan menjadi efektif 3% di PP 73/2019 jo. PP 74/2021. Adapun barang mewah selain kendaraan (hunian mewah >= Rp 20 miliar rumah / Rp 10 miliar apartemen, serta pesawat/kapal pesiar) dipisah pengaturannya lewat PMK 106/2015 jo. PMK 35/2017.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 41/2013 (2013–Okt 2021)',
    newHeader: 'PP 74/2021 (Okt 2021–Kini)',
    rows: [
      {
        aspek: 'Kendaraan LCGC (KBH2)',
        aturanLama: '0% (DPP 0%)',
        aturanBaru: '3% efektif (tarif 15% × DPP 20%)',
      },
      {
        aspek: 'Sedan 1.500–3.000 cc',
        aturanLama: '30%–40% berbasis bodi sedan',
        aturanBaru: '15%–40% berbasis emisi gram CO2/km',
      },
    ],
  },
  caseExample: {
    title: 'Sedan 2.000 cc harga pabrikan Rp 600 juta di era PP 41/2013',
    scenario:
      'Penyerahan sedan 1.500–3.000 cc dengan harga jual pabrikan Rp 600.000.000 terkena tarif PPnBM berbasis bodi sedan sebesar 30% atau Rp 180.000.000.',
    presetRegime: 'ppnbm_pp41_2013',
    presetInput: {
      ppnbm: {
        hargaJual: 600000000,
        categoryType: 'sedan_suv_menengah',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getOldPpnbmMeta(cat: PpnbmCategoryType): { rate: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
      return {
        rate: 10,
        label: 'Kendaraan penumpang < 1.500 cc non-sedan (belum ada insentif BEV 0% -> min. 10%)',
      };
    case 'lcgc':
      return { rate: 0, label: 'KBH2 / LCGC kriteria PP 41/2013 (DPP 0% -> 0%)' };
    case 'hybrid_full':
      return {
        rate: 20,
        label: 'Kendaraan penumpang 1.500–2.500 cc non-sedan/MPV era PP 41/2013 (20%)',
      };
    case 'sedan_suv_menengah':
      return { rate: 30, label: 'Sedan / SUV 1.500–3.000 cc era PP 41/2013 (30%)' };
    case 'kendaraan_emisi_tinggi':
      return { rate: 125, label: 'Kendaraan mewah > 3.000 cc bensin (125%)' };
    case 'hunian_mewah':
      return {
        rate: 20,
        label: 'Hunian mewah (rumah >= Rp 20M / apartemen >= Rp 10M) — PMK 106/2015 jo. PMK 35/2017 (20%)',
      };
    case 'balon_udara_peluru':
      return {
        rate: 40,
        label: 'Balon udara, pesawat udara tanpa penggerak, & peluru — PMK 106/2015 jo. PP 41/2013 (40%)',
      };
    case 'helikopter_senjata_api':
      return {
        rate: 50,
        label: 'Pesawat udara/helikopter non-angkutan umum & senjata api — PMK 106/2015 (50%)',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 75,
        label: 'Kapal pesiar & pesawat pribadi non-niaga — PMK 106/2015 jo. PMK 35/2017 (75%)',
      };
  }
}

export const ppnbmPp41_2013Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getOldPpnbmMeta(input.categoryType);
    const ppnbm = Math.round((hargaJual * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / nilai impor', value: hargaJual },
      { label: 'Tarif PPnBM era PP 41/2013', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPnBM terutang',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(meta.rate)}`,
        value: ppnbm,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPnBM Terutang',
      primaryTaxAmount: ppnbm,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Harga Setelah PPnBM (Belum Termasuk PPN)',
      takeHomeOrNetAmount: hargaJual + ppnbm,
      steps,
      notes: [
        'Pada era PP 41/2013, mobil sedan dan kendaraan di atas 3.000 cc terkena tarif jauh lebih berat (30% hingga 125%) dibandingkan rezim berbasis emisi PP 74/2021.',
      ],
    };
  },
};
