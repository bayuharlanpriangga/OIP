import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_543_2002, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph15_kmk543_2002_maklon',
  taxType: 'pph15',
  name: 'KMK 543/KMK.03/2002 (Norma Khusus Jasa Maklon Mainan Anak 2,1%)',
  shortName: '2003–Kini (Jasa Maklon Mainan 2,1%)',
  legalBasis: 'Pasal 15 UU PPh jo. KMK Nomor 543/KMK.03/2002',
  effectivePeriod: '1 Januari 2003 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — WP Badan jasa maklon internasional mainan anak (2,1%)',
  summary:
    'Norma Penghitungan Khusus PPh Pasal 15 bagi Wajib Pajak Badan dalam negeri yang melakukan jasa maklon (contract manufacturing) internasional di bidang produksi mainan anak: Penghasilan neto ditetapkan 7% dari seluruh jumlah biaya pembuatan/perakitan (tidak termasuk biaya bahan baku) dan dikenai tarif 30% -> 2,1% Final.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph15-kmk543-2002-maklon',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'Norma Khusus PPh Pasal 15 Jasa Maklon Internasional Mainan Anak: KMK 543/2002 (2,1%)',
  legalBasis: 'KMK Nomor 543/KMK.03/2002 Pasal 2 & Pasal 3',
  effectiveDate: '1 Januari 2003',
  readMinutes: 4,
  summary:
    'Memberi kepastian biaya pajak bagi pabrik maklon mainan anak di Indonesia: daripada membedah margin transfer pricing dari prinsipal luar negeri, penghasilan neto ditetapkan 7% dari biaya manufaktur dengan PPh Final 2,1%.',
  sections: [
    {
      heading: 'Cara kerja norma 7% × 30% = 2,1% Final dalam KMK 543/2002',
      paragraphs: [
        'Melalui KMK Nomor 543/KMK.03/2002, Wajib Pajak Badan dalam negeri yang mengerjakan jasa maklon internasional pembuatan atau perakitan mainan anak dengan bahan baku seluruhnya disediakan pemesan di luar negeri diperbolehkan menghitung PPh menggunakan Norma Penghitungan Khusus Pasal 15.',
        'Dasar pengenaan norma neto adalah 7% dari seluruh jumlah biaya pembuatan atau perakitan barang (upah buruh, penyusutan, utilitas pabrik, overhead), tidak termasuk biaya pemakaian bahan baku yang dimiliki pemesan asing. Atas norma neto 7% tersebut dikenai tarif PPh Badan tertinggi tahun 2002 (30%) sehingga pajak terutangnya tepat sebesar 2,1% bersifat Final dari total biaya manufaktur.',
      ],
    },
  ],
  caseExample: {
    title: 'Biaya perakitan maklon mainan anak Rp 5 miliar (PPh 15 Final 2,1%)',
    scenario:
      'Pabrik maklon mainan ekspor di Jawa Barat mencatat total biaya perakitan dan manufaktur (non-bahan baku) sebesar Rp 5.000.000.000 dalam setahun, sehingga terutang PPh Pasal 15 Final sebesar 2,1% = Rp 105.000.000.',
    presetRegime: 'pph15_kmk543_2002_maklon',
    presetInput: {
      pph15: {
        peredaranBruto: 5000000000,
        sectorType: 'pelayaran_dn',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph15Kmk543_2002MaklonRule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const biayaManufaktur = Math.max(0, input.peredaranBruto);
    const normaNeto = Math.round(biayaManufaktur * 0.07);
    const rate = 2.1;
    const tax = Math.round((biayaManufaktur * rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Total biaya pembuatan/perakitan (tidak termasuk bahan baku)', value: biayaManufaktur },
      { label: 'Norma penghasilan neto khusus (7% × biaya perakitan)', value: normaNeto },
      { label: 'Tarif efektif PPh Pasal 15 Final (30% × 7%)', value: rate, format: 'percent' },
      {
        label: 'PPh Pasal 15 Final Jasa Maklon terutang',
        formula: `${formatRupiah(biayaManufaktur)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 15 Final Maklon Mainan (2,1%)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Biaya Manufaktur Netto Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, biayaManufaktur - tax),
      steps,
      notes: [
        'Fasilitas norma 2,1% Final dalam KMK 543/2002 hanya berlaku apabila Wajib Pajak tidak mengadakan perjanjian Penghindaran Pajak Berganda / Advance Pricing Agreement lain dan seluruh bahan baku dimiliki pemesan luar negeri.',
      ],
    };
  },
};
