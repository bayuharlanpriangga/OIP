import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_uu8_1983',
  taxType: 'ppn',
  name: 'UU Nomor 8 Tahun 1983 jo. PP 1/1985',
  shortName: 'Apr 1985–1994 (10%)',
  legalBasis: 'Pasal 7 UU Nomor 8 Tahun 1983 & PP Nomor 1 Tahun 1985',
  effectivePeriod: '1 April 1985 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Lahirnya sistem Pajak Pertambahan Nilai (PPN) 10% di Indonesia menggantikan Pajak Penjualan (PPn) 1951 dengan mekanisme kredit Pajak Masukan–Pajak Keluaran.',
  sources: [SRC.UU_8_1983, SRC.PP_1_1985, SRC.UU_11_1994],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'ppn-uu8-1983',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Sejarah Reformasi PPN 1983–2000: Dari UU 8/1983 hingga UU 18/2000',
  legalBasis: 'UU Nomor 8 Tahun 1983, UU 11/1994 & UU 18/2000',
  effectiveDate: '1 April 1985',
  readMinutes: 4,
  summary:
    'Rekam jejak penerapan PPN tarif 10% sejak 1 April 1985 (PP 1/1985) yang menggantikan PPn 1951 bertingkat, lalu diperluas cakupannya oleh UU 11/1994 dan UU 18/2000.',
  sections: [
    {
      heading: 'Menggantikan Pajak Penjualan (PPn) 1951 yang bersifat berganda',
      paragraphs: [
        'UU Nomor 8 Tahun 1983 diundangkan pada 31 Desember 1983 dan mulai berlaku efektif secara nasional pada 1 April 1985 berdasarkan PP Nomor 1 Tahun 1985. Reformasi ini menggantikan Pajak Penjualan (PPn 1951) yang menimbulkan pajak berganda (cascading tax) menjadi sistem PPN dengan kredit Pajak Masukan terhadap Pajak Keluaran.',
        'Sejak awal diberlakukan, tarif standar PPN ditetapkan 10% (dengan koridor fleksibilitas undang-undang 5% hingga 15%, serta 0% untuk ekspor). Tarif 10% ini bertahan selama 37 tahun hingga 31 Maret 2022.',
      ],
    },
    {
      heading: 'Perluasan bertahap di UU 11/1994 dan UU 18/2000',
      paragraphs: [
        'Pada 1 Januari 1995, UU 11/1994 memperluas basis PPN ke penyerahan jasa yang lebih luas, pemanfaatan BKP tidak berwujud/JKP luar negeri, serta kegiatan membangun sendiri. Kemudian sejak 1 Januari 2001, UU 18/2000 menata ulang daftar barang dan jasa yang dikecualikan dari PPN (negative list) untuk memperkuat kepastian hukum sebelum berlanjut ke UU 42/2009.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 8/1983 (1985–1994)',
    newHeader: 'UU 11/1994 & UU 18/2000 (1995–2010)',
    rows: [
      {
        aspek: 'Tarif standar PPN dalam negeri',
        aturanLama: '10% (koridor 5%–15%)',
        aturanBaru: 'Tetap 10% (koridor 5%–15%)',
      },
      {
        aspek: 'Cakupan Jasa Kena Pajak',
        aturanLama: 'Terbatas (jasa konstruksi awal & beberapa jasa tertentu)',
        aturanBaru: 'Negative list luas (semua jasa kena PPN kecuali yang dikecualikan)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi PPN awal era UU 8/1983 atas penjualan Rp 85 juta',
    scenario:
      'Penyerahan Barang Kena Pajak oleh pabrikan pada tahun 1986 senilai Rp 85.000.000 di luar PPN.',
    presetRegime: 'ppn_uu8_1983',
    presetInput: {
      ppn: {
        hargaJualDpp: 85000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
};

export const ppnUu8_1983Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const rate = 10;

    const hargaJualBersih = input.termasukPpn ? Math.round(nominal / (1 + rate / 100)) : nominal;
    const ppnAmount = input.termasukPpn
      ? nominal - hargaJualBersih
      : Math.round((hargaJualBersih * rate) / 100);
    const totalFaktur = hargaJualBersih + ppnAmount;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual sebelum PPN',
        formula: input.termasukPpn
          ? `Diekstrak dari total termasuk PPN (${formatRupiah(nominal)})`
          : undefined,
        value: hargaJualBersih,
      },
      { label: 'Dasar Pengenaan Pajak (DPP)', formula: '100% x Harga Jual', value: hargaJualBersih },
      { label: 'Tarif PPN UU 8/1983', formula: 'Tarif 10% x DPP (PP 1/1985)', value: rate, format: 'percent' },
      { label: 'PPN terutang yang dipungut', value: ppnAmount, isHighlight: true },
      { label: 'Total nilai tagihan (Harga Jual + PPN)', value: totalFaktur },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Terutang',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Nilai Faktur (Termasuk PPN)',
      takeHomeOrNetAmount: totalFaktur,
      steps,
      notes: [
        'UU 8/1983 mulai berlaku efektif 1 April 1985 (PP 1/1985) menggantikan PPn 1951 dengan tarif tunggal PPN 10% pada tingkat pabrikan/importir sebelum diperluas ke pedagang besar dan eceran.',
      ],
    };
  },
};
