import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_81_2015, SRC.PP_48_2020, SRC.PP_12_2001, SRC.PP_49_2022];

const regime: TaxRegime = {
  id: 'ppn_pp81_2015_strategis',
  taxType: 'ppn',
  name: 'PP 12/2001, PP 81/2015 jo. PP 48/2020 (BKP Strategis Dibebaskan PPN 2001–2022)',
  shortName: '2001–2022 (BKP Strategis PP 81/2015)',
  legalBasis: 'PP Nomor 81 Tahun 2015 jo. PP Nomor 48 Tahun 2020 & PP Nomor 12 Tahun 2001 (Dicabut PP 49/2022)',
  effectivePeriod: '1 Januari 2001 – 11 Desember 2022',
  isCurrent: false,
  summary:
    'Rezim historis pembebasan PPN (0%, Pajak Masukan tidak dapat dikreditkan) atas impor dan/atau penyerahan BKP strategis — mesin pabrik industri, hasil pertanian tertentu, pakan ternak, bibit/benih, listrik rumah tangga <= 6.600 VA, serta air bersih — sebelum dikonsolidasikan bersama barang kebutuhan pokok ke dalam PP 49/2022.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pp81-2015-strategis-lama',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Sejarah Fasilitas BKP Strategis Dibebaskan PPN (PP 12/2001 hingga PP 81/2015 jo. PP 48/2020)',
  legalBasis: 'PP 12/2001, PP 81/2015 stdd PP 48/2020',
  effectiveDate: '1 Januari 2001 – 11 Desember 2022',
  readMinutes: 4,
  summary:
    'Menelusuri cakupan BKP tertentu bersifat strategis yang dibebaskan PPN sebelum era UU HPP dan PP 49/2022, termasuk pencabutan pembebasan hasil pertanian oleh Putusan MA pada 2014 lalu pemulihannya.',
  sections: [
    {
      heading: 'Evolusi dari PP 12/2001 ke PP 81/2015 dan PP 48/2020',
      paragraphs: [
        'Sejak PP Nomor 12 Tahun 2001, pemerintah membebaskan PPN atas barang modal mesin pabrik, bahan baku pakan ternak, bibit/benih pertanian, air bersih, dan listrik rumah tangga hingga daya 6.600 VA agar tidak menaikkan biaya investasi industri maupun beban masyarakat.',
        'Melalui PP 81/2015 jo. PP 48/2020, daftar BKP strategis diselaraskan (termasuk perluasan untuk barang hasil kelautan/perikanan dan LNG tertentu) dengan mekanisme Kode Faktur 08 (tarif PPN dibebaskan 0%, Pajak Masukan perolehan tidak dapat dikreditkan), sebelum akhirnya seluruh aturan fasilitas strategis digabung dan diperbarui menjadi PP Nomor 49 Tahun 2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 12/2001 & PP 81/2015 jo. PP 48/2020',
    newHeader: 'PP Nomor 49 Tahun 2022 (Kini)',
    rows: [
      {
        aspek: 'Tarif PPN dibebaskan (Kode Faktur 08)',
        aturanLama: '0% (BKP strategis terbatas mesin pabrik, listrik <= 6.600 VA, air, bibit)',
        aturanBaru: '0% (Dikonsolidasi dengan sembako, jasa kesehatan, & pendidikan dari eks Pasal 4A)',
      },
      {
        aspek: 'Perlakuan Pajak Masukan penjual',
        aturanLama: 'Tidak dapat dikreditkan',
        aturanBaru: 'Tetap tidak dapat dikreditkan untuk kategori Dibebaskan',
      },
    ],
  },
  caseExample: {
    title: 'Impor mesin dan peralatan pabrik BKP Strategis Rp 2 miliar (PP 81/2015)',
    scenario:
      'Pabrikan mengimpor mesin produksi yang memperoleh Surat Keterangan Bebas (SKB) BKP Strategis sesuai PP 81/2015 senilai Rp 2.000.000.000. PPN impor dibebaskan sebesar Rp 0.',
    presetRegime: 'ppn_pp81_2015_strategis',
    presetInput: {
      ppn: {
        hargaJualDpp: 2000000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPp81_2015StrategisRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const dpp = Math.max(0, input.hargaJualDpp);
    const ppn = 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai impor / harga jual BKP Strategis (DPP)', value: dpp },
      { label: 'Fasilitas PPN Dibebaskan (PP 81/2015 jo. PP 48/2020 — Kode 08)', value: 0, format: 'percent' },
      { label: 'PPN terutang dibayar pembeli / importir', value: ppn, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Dibayar (Dibebaskan PP 81/2015)',
      primaryTaxAmount: ppn,
      effectiveRatePercent: 0,
      takeHomeOrNetLabel: 'Total Pembayaran Nilai BKP Strategis',
      takeHomeOrNetAmount: dpp,
      steps,
      notes: [
        'Penyerahan BKP tertentu yang bersifat strategis sesuai PP 12/2001 jo. PP 81/2015 & PP 48/2020 mendapat fasilitas PPN Dibebaskan (0%) namun Pajak Masukan terkait tidak dapat dikreditkan oleh penjual.',
        `Tarif efektif ${formatPersen(0)} berlaku bagi penyerahan dengan SKB / syarat BKP strategis sebelum dikonsolidasikan ke PP 49/2022.`,
      ],
    };
  },
};
