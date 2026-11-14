import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_96_2021, SRC.PMK_15_2023, SRC.PMK_106_2015, SRC.PMK_35_2017, SRC.PMK_620_2004];

const regime: TaxRegime = {
  id: 'ppnbm_pmk106_2015_nonkendaraan',
  taxType: 'ppnbm',
  name: 'PMK 620/2004, PMK 106/2015, PMK 35/2017 -> PMK 96/2021 & PMK 15/2023 (Non-Kendaraan)',
  shortName: '2004–Kini (Barang Mewah Non-Kendaraan)',
  legalBasis: 'PMK 96/PMK.03/2021 stdd PMK 15/2023 mencabut PMK 106/2015 jo. PMK 35/2017 & PMK 620/2004',
  effectivePeriod: '31 Desember 2004 – Sekarang (Pembaruan Batasan di PMK 15/2023)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Hunian mewah >= Rp 30M (20%) & yacht/pesawat (75%)',
  summary:
    'Pelacakan historis deregulasi daftar barang kena PPnBM non-kendaraan bermotor: mulai dari puluhan kelompok elektronik, parfum, barang kulit hingga karpet (PMK 620/2004), penyempitan ke kelompok hunian & olahraga mahal di PMK 106/2015 jo. PMK 35/2017 (rumah >= Rp 20M / apartemen >= Rp 10M), hingga penyederhanaan mutakhir hanya 4 kategori tarif 20%, 40%, 50%, dan 75% (hunian >= Rp 30M) di PMK 96/2021 jo. PMK 15/2023.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pmk106-2015-nonkendaraan',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Deregulasi PPnBM Non-Kendaraan: Dari PMK 620/2004 & PMK 106/2015 ke PMK 96/2021 jo. PMK 15/2023',
  legalBasis: 'PMK 620/2004, PMK 106/2015 jo. PMK 35/2017, & PMK 96/2021 jo. PMK 15/2023',
  effectiveDate: '31 Desember 2004 (Revisi Terakhir PMK 15/2023)',
  readMinutes: 5,
  summary:
    'Mengapa barang elektronik seperti kulkas, televisi, jam tangan mewah, dan pakaian bermerek tidak lagi dipungut PPnBM: sejarah pemangkasan daftar barang mewah selain kendaraan selama 20 tahun terakhir.',
  sections: [
    {
      heading: 'Pemangkasan objek dari elektronik & furnitur menuju super-luxury goods saja',
      paragraphs: [
        'Pada era PMK 620/PMK.03/2004 (lalu PMK 130/2013), hampir seluruh barang elektronik konsumsi kelas atas (kulkas, AC, mesin cuci, televisi > 21 inci), barang kulit bermerek, peralatan golf, hingga tas mewah masih dikenai PPnBM 10%–75%. Mulai PMK 106/PMK.010/2015 jo. PMK 35/PMK.010/2017, barang elektronik dan kebutuhan rumah tangga tersebut resmi dihapus dari objek PPnBM untuk mendorong konsumsi domestik.',
        'Kini berdasarkan PMK 96/PMK.03/2021 jo. PMK 15/PMK.03/2023, PPnBM selain kendaraan bermotor difokuskan hanya pada kelompok super-mewah: (a) 20% untuk kelompok hunian mewah (rumah/apartemen/kondominium dengan harga jual Rp 30 miliar atau lebih — naik dari ambang lama Rp 20M/Rp 10M di PMK 35/2017); (b) 40% untuk kelompok balon udara & peluru senjata api; (c) 50% untuk helikopter/pesawat komersial non-angkutan niaga dan senjata api non-negara; serta (d) 75% untuk kapal pesiar, yacht, dan pesawat pribadi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 106/2015 jo. PMK 35/2017 (2015–2021)',
    newHeader: 'PMK 96/2021 jo. PMK 15/2023 (Kini)',
    rows: [
      {
        aspek: 'Ambang batas hunian mewah (tarif 20%)',
        aturanLama: 'Rumah >= Rp 20 M atau Apartemen/Kondominium >= Rp 10 M',
        aturanBaru: 'Diseragamkan menjadi >= Rp 30 M untuk seluruh jenis hunian mewah',
      },
      {
        aspek: 'Kapal pesiar, yacht & pesawat pribadi non-niaga',
        aturanLama: 'Tarif 75%',
        aturanBaru: 'Tetap tarif 75% (selain kepentingan negara/angkutan umum)',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan apartemen / rumah mewah Rp 32 miliar (PMK 96/2021 jo. PMK 15/2023)',
    scenario:
      'Pengembang menyerahkan unit apartemen/rumah mewah seharga Rp 32.000.000.000 (>= batas Rp 30 M): dikenai PPnBM non-kendaraan sebesar 20% = Rp 6.400.000.000 (bersamaan dengan PPh 22 barang sangat mewah 1% & PPN 12% penuh).',
    presetRegime: 'ppnbm_pmk106_2015_nonkendaraan',
    presetInput: {
      ppnbm: {
        hargaJual: 32000000000,
        categoryType: 'hunian_mewah',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnbmPmk106_2015NonKendaraanRule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    let rate = 20;
    let label = 'Hunian mewah >= Rp 30 miliar (PMK 96/2021 jo. PMK 15/2023 — 20%)';
    if (input.categoryType === 'kapal_pesiar_pesawat') {
      rate = 75;
      label = 'Kapal pesiar, yacht, dan pesawat udara non-niaga (75%)';
    } else if (input.categoryType === 'hunian_mewah') {
      if (hargaJual > 0 && hargaJual < 30000000000) {
        rate = 0;
        label = 'Di bawah batas Rp 30 miliar (Bebas PPnBM di era PMK 96/2021; sempat kena 20% bila >= 10M/20M di PMK 35/2017)';
      } else {
        rate = 20;
        label = 'Hunian mewah >= Rp 30 miliar (20% — PMK 96/2021 jo. PMK 15/2023)';
      }
    } else {
      rate = 0;
      label = 'Pilih "Hunian mewah" atau "Kapal pesiar / pesawat" untuk objek PPnBM non-kendaraan';
    }

    const tax = Math.round((hargaJual * rate) / 100);
    const steps: CalculationStep[] = [
      { label: 'Harga jual / nilai impor barang mewah non-kendaraan', value: hargaJual },
      { label: 'Kelompok & tarif PMK 96/2021 jo. PMK 15/2023', formula: label, value: rate, format: 'percent' },
      {
        label: 'PPnBM Non-Kendaraan terutang',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPnBM Non-Kendaraan Terutang',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Harga Jual + PPnBM (Sebelum PPN & PPh 22)',
      takeHomeOrNetAmount: hargaJual + tax,
      steps,
      notes: [
        'Bila jenis barang dipilih sebagai Hunian Mewah di bawah Rp 30 miliar, berdasarkan PMK 96/2021 jo. PMK 15/2023 tidak lagi terutang PPnBM (namun antara 2015–2021 apartemen >= Rp 10 M dan rumah >= Rp 20 M sempat terutang 20%).',
      ],
    };
  },
};
