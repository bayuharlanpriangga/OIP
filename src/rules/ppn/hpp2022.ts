import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_hpp_2022',
  taxType: 'ppn',
  name: 'UU Nomor 7 Tahun 2021 (HPP)',
  shortName: '2022–2024 (11%)',
  legalBasis: 'Pasal 7 ayat (1) huruf a UU HPP',
  effectivePeriod: '1 April 2022 – 31 Desember 2024',
  isCurrent: false,
  summary:
    'Tarif tunggal 11% langsung atas seluruh Harga Jual atau Penggantian tanpa pembedaan DPP antara barang umum dan barang mewah.',
  sources: [SRC.UU_7_2021_HPP, SRC.UU_7_2021_SETNEG],
};

const article: TaxArticle = {
  id: 'ppn-hpp-2022',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Kenaikan PPN 11% UU HPP (2022–2024): Penyesuaian Faktur & Fasilitas Barang Pokok',
  legalBasis: 'Pasal 7 ayat (1) huruf a UU Nomor 7 Tahun 2021 (HPP)',
  effectiveDate: '1 April 2022',
  readMinutes: 4,
  summary:
    'Fase pertama penyesuaian tarif PPN dalam UU HPP yang menaikkan tarif tunggal dari 10% menjadi 11% langsung dari Harga Jual sebelum diberlakukannya skema 12% DPP 11/12 pada 2025.',
  sections: [
    {
      heading: 'Berakhirnya rezim tarif 10% setelah hampir 37 tahun',
      paragraphs: [
        'Sejak mulai berlakunya UU PPN pada 1 April 1985 hingga 31 Maret 2022, Indonesia konsisten memakai tarif tunggal PPN sebesar 10%. Melalui UU Nomor 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan (HPP), pemerintah menaikkan tarif PPN tahap pertama menjadi 11% mulai 1 April 2022.',
        'Pada masa 2022–2024, penghitungan Faktur Pajak berjalan lurus: 11% dikalikan langsung dengan 100% Harga Jual/Nilai Penggantian tanpa menggunakan DPP Nilai Lain 11/12 (karena skema 11/12 baru dibutuhkan ketika tarif undang-undang naik ke 12% di tahun 2025).',
      ],
    },
    {
      heading: 'Pemindahan barang kebutuhan pokok menjadi BKP dibebaskan',
      paragraphs: [
        'Sejalan dengan kenaikan tarif ke 11%, UU HPP memindahkan barang kebutuhan pokok, jasa kesehatan, jasa pendidikan, dan jasa sosial dari daftar barang/jasa tidak kena PPN (non-BKP/non-JKP) menjadi Barang/Jasa Kena Pajak yang mendapat fasilitas pembebasan PPN (Pasal 16B) agar rantai faktur lebih transparan namun tetap 0% beban pajak bagi masyarakat luas.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 42/2009 (s.d. Mar 2022)',
    newHeader: 'UU HPP (Apr 2022–Des 2024)',
    rows: [
      {
        aspek: 'Tarif PPN penyerahan dalam negeri',
        aturanLama: '10% × Harga Jual',
        aturanBaru: '11% × Harga Jual',
      },
      {
        aspek: 'Klasifikasi kebutuhan pokok & jasa strategis',
        aturanLama: 'Non-BKP / Non-JKP (di luar sistem PPN)',
        aturanBaru: 'BKP/JKP Strategis dibebaskan dari pengenaan PPN',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan BKP senilai Rp 100 juta pada periode 2022–2024',
    scenario:
      'Penyerahan BKP di dalam daerah pabean dengan harga jual Rp 100.000.000 (belum termasuk PPN) dipungut PPN sebesar 11% atau Rp 11.000.000 sehingga total faktur Rp 111.000.000.',
    presetRegime: 'ppn_hpp_2022',
    presetInput: {
      ppn: {
        hargaJualDpp: 100000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
};

export const ppnHpp2022Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const rate = 11;

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
      { label: 'Tarif PPN', formula: 'Tarif 11% x DPP', value: rate, format: 'percent' },
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
      notes: [],
    };
  },
};
