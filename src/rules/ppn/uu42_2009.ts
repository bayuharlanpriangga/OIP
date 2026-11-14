import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'ppn_uu42_2009',
  taxType: 'ppn',
  name: 'UU Nomor 42 Tahun 2009',
  shortName: '2010–2022 (10%)',
  legalBasis: 'Pasal 7 ayat (1) UU Nomor 42 Tahun 2009',
  effectivePeriod: '1 April 2010 – 31 Maret 2022',
  isCurrent: false,
  summary:
    'Tarif PPN tunggal sebesar 10% atas seluruh penyerahan Barang Kena Pajak dan Jasa Kena Pajak di dalam daerah pabean.',
  sources: [SRC.UU_42_2009, SRC.UU_7_2021_HPP],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-uu42-2009',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Tarif PPN 10% UU 42/2009 dan Kenaikan Bertahap Menjadi 11% di Tahun 2022',
  legalBasis: 'UU Nomor 42 Tahun 2009 & UU Nomor 7 Tahun 2021 (HPP)',
  effectiveDate: '1 April 2010',
  readMinutes: 4,
  summary:
    'Ketentuan tarif tunggal 10% yang berlaku lebih dari satu dekade sebelum dinaikkan menjadi 11% pada April 2022 melalui UU Harmonisasi Peraturan Perpajakan.',
  sections: [
    {
      heading: 'Stabilitas tarif 10% di bawah UU 42/2009',
      paragraphs: [
        'Selama periode berlakunya UU Nomor 42 Tahun 2009 (perubahan ketiga UU PPN), seluruh penyerahan Barang Kena Pajak dan Jasa Kena Pajak di dalam daerah pabean dikenakan tarif tunggal 10% langsung dari Dasar Pengenaan Pajak, sedangkan ekspor BKP maupun JKP tertentu dikenakan tarif 0%.',
        'Pengusaha Kena Pajak (PKP) menerbitkan Faktur Pajak dengan nilai PPN sebesar 10% dari Harga Jual atau Nilai Penggantian, baik untuk barang konsumsi sehari-hari maupun barang tergolong mewah.',
      ],
    },
    {
      heading: 'Peralihan ke 11% pada 1 April 2022',
      paragraphs: [
        'Melalui UU Nomor 7 Tahun 2021 (HPP), tarif PPN dinaikkan secara bertahap dimulai dari 11% sejak 1 April 2022 sebagai bagian dari perluasan basis penerimaan negara dan harmonisasi fasilitas pembebasan PPN untuk kebutuhan pokok serta jasa strategis tertentu.',
      ],
    },
  ],
  caseExample: {
    title: 'Simulasi faktur penjualan Rp 85 juta di era PPN 10%',
    scenario:
      'Penyerahan barang/jasa senilai Rp 85.000.000 (sebelum pajak) menggunakan tarif tunggal historis 10% UU 42/2009.',
    presetRegime: 'ppn_uu42_2009',
    presetInput: {
      ppn: {
        hargaJualDpp: 85000000,
        goodsType: 'umum',
        termasukPpn: false,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const ppnUu42_2009Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
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
      { label: 'Tarif PPN', formula: 'Tarif 10% x DPP', value: rate, format: 'percent' },
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
