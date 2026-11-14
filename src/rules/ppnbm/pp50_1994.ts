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
  id: 'ppnbm_pp50_1994',
  taxType: 'ppnbm',
  name: 'PP 50/1994 jo. PP 20/1996 & PP 59/1999',
  shortName: '1995–2000 (PP 50/1994)',
  legalBasis: 'PP Nomor 50 Tahun 1994 stdd PP 20/1996 & PP 59/1999 (UU 11/1994)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Tarif PPnBM era UU 11/1994 (sebelum PP 145/2000): kendaraan niaga/minibus 20%, sedan <= 1.600 cc 35% (lalu struktur 10%/20%/25%/35%/50% di PP 59/1999), dan barang mewah kelompok tertinggi 35%–50%.',
  sources: [SRC.PP_50_1994, SRC.PP_20_1996, SRC.PP_59_1999, SRC.UU_11_1994],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pp50-1994',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'PP 50/1994 jo. PP 59/1999: Lapis Tarif 10% hingga 50% di Era UU 11/1994 (1995–2000)',
  legalBasis: 'PP Nomor 50 Tahun 1994 stdd PP 20/1996 & PP 59/1999',
  effectiveDate: '1 Januari 1995',
  readMinutes: 3,
  summary:
    'Aturan pelaksana PPnBM periode 1995–2000 yang menetapkan kelompok tarif 10%, 20%, 25%, dan 35% (lalu mencapai 50% pada PP 59/1999) sebelum beralih ke plafon 75% di tahun 2001.',
  sections: [
    {
      heading: 'Dari plafon 35% di PP 50/1994 menuju 50% di PP 59/1999',
      paragraphs: [
        'PP Nomor 50 Tahun 1994 diterbitkan sebagai paket pelaksanaan UU 11/1994 dengan struktur tarif PPnBM 10%, 20%, 25%, dan 35%. Kendaraan niaga ringan/minibus umumnya dikenai 20%, sedangkan sedan dan jeep berkapasitas lebih besar langsung terkena 35%.',
        'Menjelang pergantian milenium, melalui PP Nomor 59 Tahun 1999 pemerintah menaikkan tarif kelompok tertinggi untuk mobil mewah berkapasitas besar menjadi 50%, sesuai batas maksimal yang diizinkan oleh UU 11/1994 kala itu.',
      ],
    },
  ],
  caseExample: {
    title: 'Penyerahan sedan Rp 180 juta di era PP 50/1994',
    scenario:
      'Sedan di dalam negeri dengan harga jual pabrikan Rp 180.000.000 pada tahun 1997 dikenai PPnBM sebesar 35% atau Rp 63.000.000.',
    presetRegime: 'ppnbm_pp50_1994',
    presetInput: {
      ppnbm: {
        hargaJual: 180000000,
        categoryType: 'sedan_suv_menengah',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getPp50Meta(cat: PpnbmCategoryType): { rate: number; label: string } {
  switch (cat) {
    case 'listrik_bev':
    case 'lcgc':
      return {
        rate: 20,
        label: 'Kendaraan penumpang ringan / minibus era PP 50/1994 (20%; belum ada insentif BEV/LCGC)',
      };
    case 'hybrid_full':
      return {
        rate: 20,
        label: 'Kendaraan penumpang tipe van/jeep/minibus (20% — PP 50/1994)',
      };
    case 'sedan_suv_menengah':
      return {
        rate: 35,
        label: 'Sedan & kendaraan penumpang tertentu — PP 50/1994 (35%, sebelum naik ke 40% di PP 145/2000)',
      };
    case 'kendaraan_emisi_tinggi':
      return {
        rate: 50,
        label: 'Sedan / kendaraan mewah cc besar — batas tertinggi PP 59/1999 (50%)',
      };
    case 'hunian_mewah':
      return {
        rate: 20,
        label: 'Hunian mewah tertentu sesuai kelompok tarif 20% PP 50/1994',
      };
    case 'balon_udara_peluru':
    case 'helikopter_senjata_api':
      return {
        rate: 35,
        label: 'Kelompok barang mewah 35% (balon udara, senjata api, & pesawat non-niaga — PP 50/1994)',
      };
    case 'kapal_pesiar_pesawat':
      return {
        rate: 35,
        label: 'Kapal pesiar / pesawat udara non-niaga — kelompok tarif 35% PP 50/1994 (naik ke 75% di PP 145/2000)',
      };
  }
}

export const ppnbmPp50_1994Rule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const meta = getPp50Meta(input.categoryType);
    const ppnbm = Math.round((hargaJual * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Harga jual penyerahan pabrikan / nilai impor', value: hargaJual },
      { label: 'Tarif PPnBM era PP 50/1994', formula: meta.label, value: meta.rate, format: 'percent' },
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
        'PP 50/1994 (pelaksana UU 11/1994) menetapkan kelompok tarif 10%, 20%, 25%, dan 35%, sebelum diperluas hingga 50% melalui PP 59/1999 dan melonjak hingga 75% pada PP 145/2000.',
      ],
    };
  },
};
