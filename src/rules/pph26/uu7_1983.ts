import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph26_uu7_1983',
  taxType: 'pph26',
  name: 'UU Nomor 7 Tahun 1983 (Pasal 26)',
  shortName: '1984–1994 (UU 7/1983 — 20%)',
  legalBasis: 'Pasal 26 UU Nomor 7 Tahun 1983',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Ketentuan awal pemotongan final 20% atas penghasilan yang bersumber dari Indonesia bagi Wajib Pajak Luar Negeri selain BUT (dividen, bunga, royalti, sewa, jasa, dan laba setelah pajak BUT), kecuali ada P3B.',
  sources: [SRC.UU_7_1983, SRC.UU_10_1994],
};

const article: TaxArticle = {
  id: 'pph26-uu7-1983',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Konstruksi Perdana Pemotongan WPLN 20% dalam Pasal 26 UU 7/1983 (1984–1994)',
  legalBasis: 'Pasal 26 UU Nomor 7 Tahun 1983',
  effectiveDate: '1 Januari 1984',
  readMinutes: 3,
  summary:
    'Kelahiran Pasal 26 dalam sistem PPh modern Indonesia yang mematok tarif pemotongan final 20% atas penghasilan lintas batas ke Wajib Pajak Luar Negeri non-BUT.',
  sections: [
    {
      heading: 'Prinsip withholding final 20% atas arus kas ke luar negeri',
      paragraphs: [
        'Melalui UU Nomor 7 Tahun 1983, Indonesia menetapkan mekanisme pemotongan di sumber (withholding tax) sebesar 20% yang bersifat final atas pembayaran dividen, bunga, royalti, sewa, serta imbalan jasa kepada Wajib Pajak Luar Negeri selain Bentuk Usaha Tetap (BUT).',
        'Tarif 20% tersebut juga dikenakan atas Penghasilan Kena Pajak sesudah dikurangi pajak dari suatu BUT di Indonesia (branch profit tax), yang tetap menjadi ciri khas sistem pajak internasional Indonesia hingga era UU HPP.',
      ],
    },
    {
      heading: 'Keterbukaan terhadap tarif P3B (Tax Treaty)',
      paragraphs: [
        'Sejak 1984, tarif domestik 20% tunduk pada Persetujuan Penghindaran Pajak Berganda (P3B) bilateral sebagai lex specialis apabila penerima di luar negeri berasal dari negara mitra perjanjian.',
      ],
    },
  ],
  caseExample: {
    title: 'Pembayaran royalti Rp 150 juta ke WPLN non-treaty pada tahun 1990',
    scenario:
      'Perusahaan Indonesia membayar royalti paten sebesar Rp 150.000.000 ke pemberi lisensi di luar negeri tanpa P3B sehingga dipotong PPh Pasal 26 final 20% atau Rp 30.000.000.',
    presetRegime: 'pph26_uu7_1983',
    presetInput: {
      pph26: {
        nilaiBruto: 150000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
      },
    },
  },
};

export const pph26Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 UU 7/1983 (20% bruto)';

    if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B dengan surat keterangan domisili (${formatPersen(treatyRate)})`;
    } else if (input.objectType === 'premi_asuransi_ln') {
      effectiveRate = 20;
      basisLabel = 'Tarif umum 20% bruto (norma 50% KMK 624/1994 baru terbit Desember 1994)';
    }

    const pph26 = Math.round((bruto * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayar ke WPLN', value: bruto },
      { label: 'Dasar tarif pemotongan', formula: basisLabel, value: effectiveRate, format: 'percent' },
      {
        label: 'PPh Pasal 26 final dipotong',
        formula: `${formatRupiah(bruto)} x ${formatPersen(effectiveRate)}`,
        value: pph26,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Dipotong (Final)',
      primaryTaxAmount: pph26,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Pembayaran Bersih Ditransfer ke WPLN',
      takeHomeOrNetAmount: Math.max(0, bruto - pph26),
      steps,
      notes: [
        'Sejak UU 7/1983 (berlaku 1984), tarif domestik pemotongan final PPh Pasal 26 ditetapkan 20% atas penghasilan pasif maupun imbalan jasa WPLN selain BUT, tunduk pada batas maksimal tarif P3B (Tax Treaty) yang berlaku.',
      ],
    };
  },
};
