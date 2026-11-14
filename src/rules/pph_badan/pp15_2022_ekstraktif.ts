import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_15_2022, SRC.PP_18_2025, SRC.PP_37_2018, SRC.PP_53_2017];

const regime: TaxRegime = {
  id: 'badan_pp15_2022_ekstraktif',
  taxType: 'pph_badan',
  name: 'PP 15/2022 jo. PP 18/2025, PP 37/2018 & PP 53/2017 (PPh Badan Sektor Ekstraktif: Batubara, Mineral & Migas)',
  shortName: '2017–Sekarang (Ekstraktif Batubara/Mineral/Migas)',
  legalBasis: 'PP Nomor 15 Tahun 2022 jo. PP Nomor 18 Tahun 2025 (Batubara), PP 37/2018 (Mineral), & PP 53/2017 (Migas)',
  effectivePeriod: '2017 / 2018 / 2022 – Sekarang (Update PNBP Batubara PP 18/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Ringfencing IUPK Batubara (PP 15/2022 jo. PP 18/2025), Mineral & Migas',
  summary:
    'Rezim PPh Badan lex specialis sektor sumber daya alam ekstraktif: (1) Pertambangan Batubara (PP 15/2022 stdd PP 18/2025) menetapkan tarif PPh Badan 22% mengikuti UU HPP untuk pemegang IUP/IUPK kelanjutan eks-PKP2B beserta skema royalti PNBP progresif harga batubara acuan (HBA); (2) Pertambangan Mineral (PP 37/2018) mengatur DMO, DHE, & batas pemotongan biaya; dan (3) Hulu Migas Gross Split (PP 53/2017) memberikan perpanjangan kompensasi rugi fiskal 10 tahun & fasilitas tidak dipungut saat eksplorasi.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pp15-2022-ekstraktif',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'PPh Badan Sektor Ekstraktif: Batubara (PP 15/2022 jo. PP 18/2025), Mineral (PP 37/2018), & Migas Gross Split (PP 53/2017)',
  legalBasis: 'PP 15/2022 jo. PP 18/2025, PP 37/2018, & PP 53/2017',
  effectiveDate: '11 April 2022 (PP 15/2022) & 11 April 2025 (PP 18/2025)',
  readMinutes: 5,
  summary:
    'Membedah aturan perpajakan khusus pertambangan batubara (kelanjutan operasi eks-PKP2B hingga tarif royalti terbaru PP 18/2025), mineral (PP 37/2018), dan kontrak hulu migas gross split (PP 53/2017).',
  sections: [
    {
      heading: 'Harmonisasi PPh Badan 22% & PNBP Batubara dalam PP 15/2022 jo. PP 18/2025',
      paragraphs: [
        'Sebelum PP 15/2022, pemegang PKP2B Generasi I masih memakai rezim kontrak tetap (nailed-down) dengan tarif PPh Badan 45% namun dibebaskan dari beberapa pungutan baru. Ketika PKP2B beralih menjadi IUPK sebagai Kelanjutan Operasi Kontrak/Perjanjian, PP 15/2022 menetapkan tarif PPh Badan sebesar 22% (prevailing UU HPP) disertai penyesuaian tarif Iuran Produksi / PNBP progresif berdasarkan Harga Batubara Acuan (HBA) dan pembagian 10% bagian pemerintah atas laba bersih (IUPK khusus Pasal 129 UU Minerba).',
        'Melalui PP Nomor 18 Tahun 2025 (ditetapkan 11 April 2025), pemerintah memperbarui struktur tarif PNBP dan kepastian hukum bagi IUPK batubara kelanjutan operasi agar selaras dengan fluktuasi harga komoditas global.',
      ],
    },
    {
      heading: 'Mineral (PP 37/2018) & Hulu Migas Gross Split (PP 53/2017)',
      paragraphs: [
        'Pada sektor pertambangan mineral (PP 37/2018), nilai penjualan berpatokan pada harga patokan mineral atau harga pasar dan biaya pengurang mengikuti batas khusus (termasuk cadangan reklamasi). Sedangkan pada kontrak bagi hasil Gross Split hulu migas (PP 53/2017), Kontraktor K3S mendapat pembebasan PPN/bea masuk masa eksplorasi serta kompensasi kerugian fiskal hingga 10 tahun (lebih panjang dari batas umum 5 tahun di Pasal 6 UU PPh).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Rezim PPh Badan Umum (UU HPP)',
    newHeader: 'Lex Specialis Ekstraktif (PP 15/18, PP 37, & PP 53)',
    rows: [
      {
        aspek: 'Tarif PPh Badan & penentuan harga jual',
        aturanLama: '22% dengan harga transaksi wajar umum',
        aturanBaru: '22% (IUPK Batubara/Mineral/Gross Split) dengan patokan HBA/HPM + PNBP progresif',
      },
      {
        aspek: 'Kompensasi kerugian fiskal (loss carry forward)',
        aturanLama: 'Maksimal 5 tahun',
        aturanBaru: 'Hingga 10 tahun pada kontrak hulu migas Gross Split (PP 53/2017)',
      },
    ],
  },
  caseExample: {
    title: 'IUPK Batubara eks-PKP2B (PP 15/2022 jo. PP 18/2025) laba fiskal Rp 100 miliar',
    scenario:
      'Pemegang IUPK Batubara Kelanjutan Operasi mencatat PKP Rp 100 miliar pada tahun pajak berjalan dengan kewajiban PPh Badan 22% serta kewajiban tambahan bagian pemerintah pusat/daerah 10% dari keuntungan bersih.',
    presetRegime: 'badan_pp15_2022_ekstraktif',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 800000000000,
        penghasilanKenaPajak: 100000000000,
        isTbk: false,
        skemaEkstraktif: 'batubara_iupk_pp15_18',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPp15_2022EkstraktifRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkp = Math.max(0, input.penghasilanKenaPajak);
    const skema = input.skemaEkstraktif ?? 'batubara_iupk_pp15_18';

    const pphBadan22 = Math.round(pkp * 0.22);
    const bagianLabaPemerintah = skema === 'batubara_iupk_pp15_18' ? Math.round(Math.max(0, pkp - pphBadan22) * 0.1) : 0;
    const totalBebanNegara = pphBadan22 + bagianLabaPemerintah;

    const noteSkema =
      skema === 'batubara_iupk_pp15_18'
        ? 'IUPK Batubara Kelanjutan Operasi (PP 15/2022 stdd PP 18/2025): PPh Badan 22% + simulasi kewajiban 10% bagian pemerintah dari keuntungan bersih (4% Pusat + 6% Daerah).'
        : skema === 'mineral_pp37_2018'
          ? 'Pertambangan Mineral (PP 37/2018): PPh Badan prevailing 22% atas PKP berdasarkan harga patokan mineral & pengurang reklamasi.'
          : 'Hulu Migas Gross Split (PP 53/2017): PPh Badan 22% dengan hak kompensasi rugi fiskal s.d. 10 tahun & fasilitas PPN tidak dipungut eksplorasi.';

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak (PKP) sektor ekstraktif', value: pkp },
      { label: 'PPh Badan terutang (22% — UU HPP / PP Ekstraktif)', value: pphBadan22, isHighlight: true },
      ...(skema === 'batubara_iupk_pp15_18'
        ? [
            {
              label: 'Bagian Pemerintah 10% atas laba bersih IUPK khusus (4% Pusat + 6% Daerah)',
              value: bagianLabaPemerintah,
            },
            { label: 'Total PPh Badan + Bagian Laba IUPK', value: totalBebanNegara },
          ]
        : []),
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Sektor Ekstraktif (22%)',
      primaryTaxAmount: pphBadan22,
      annualTaxLabel: skema === 'batubara_iupk_pp15_18' ? 'Total PPh Badan + Bagian Laba 10%' : 'Total PPh Badan',
      annualTaxAmount: totalBebanNegara,
      effectiveRatePercent: pkp > 0 ? (totalBebanNegara / pkp) * 100 : 0,
      takeHomeOrNetLabel: 'Laba Bersih Setelah PPh & Kewajiban Laba',
      takeHomeOrNetAmount: Math.max(0, pkp - totalBebanNegara),
      steps,
      notes: [noteSkema],
    };
  },
};
