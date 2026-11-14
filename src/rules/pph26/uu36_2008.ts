import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph26_uu36_2008',
  taxType: 'pph26',
  name: 'UU 36/2008 & PP 16/2009 (Pra-PP 9/2021)',
  shortName: '2009–2021 (UU 36/2008)',
  legalBasis: 'Pasal 26 UU Nomor 36 Tahun 2008 & PP 16/2009',
  effectivePeriod: '1 Januari 2009 – 1 Agustus 2021',
  isCurrent: false,
  summary:
    'Aturan sebelum PP 9/2021: bunga obligasi Wajib Pajak Luar Negeri tanpa P3B masih dikenai tarif penuh 20% (belum turun menjadi 10%).',
  sources: [SRC.UU_36_2008, SRC.PP_16_2009, SRC.KMK_624_1994],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-uu36-2008',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'PPh Pasal 26 Era UU 36/2008 & PP 16/2009: Bunga Obligasi WPLN 20% (2009–2021)',
  legalBasis: 'Pasal 26 UU Nomor 36 Tahun 2008 & PP Nomor 16 Tahun 2009',
  effectiveDate: '1 Januari 2009',
  readMinutes: 4,
  summary:
    'Ketentuan PPh Pasal 26 sebelum pemberlakuan PP 9/2021, ketika tarif domestik bunga obligasi yang diterima investor luar negeri non-P3B masih dipotong penuh 20% dari jumlah bruto.',
  sections: [
    {
      heading: 'Tarif bunga obligasi 20% sebelum penurunan PP 9/2021',
      paragraphs: [
        'Sepanjang periode 2009 hingga pertengahan 2021, Pasal 26 UU Nomor 36 Tahun 2008 jo. PP Nomor 16 Tahun 2009 menetapkan tarif pemotongan final sebesar 20% atas penghasilan bunga obligasi maupun diskonto Surat Berharga Negara yang diterima Wajib Pajak Luar Negeri non-BUT (atau sesuai tarif P3B bila tersedia SKD/Form DGT yang sah).',
        'Tarif 20% tersebut baru diturunkan menjadi 10% pada Agustus 2021 melalui Pasal 3 PP Nomor 9 Tahun 2021 untuk memperdalam pasar obligasi domestik dan menjaga daya saing biaya pendanaan.',
      ],
    },
    {
      heading: 'Penyempurnaan mekanisme SKD DGT di era 2009–2021',
      paragraphs: [
        'Pada dekade ini, tata cara penerapan P3B diperketat berturut-turut mulai dari PER-61/PJ/2009 hingga PER-25/PJ/2018 agar manfaat tarif treaty (misalnya 10% atau 0%) hanya dinikmati pemilik manfaat sebenarnya (beneficial owner) dan bukan entitas cangkang (treaty shopping).',
      ],
    },
  ],
  caseExample: {
    title: 'Pembayaran kupon obligasi Rp 200 juta ke investor non-P3B pada tahun 2019',
    scenario:
      'Emiten membayar bunga obligasi Rp 200.000.000 kepada WPLN tanpa SKD P3B di bawah rezim PP 16/2009 sehingga dipotong PPh Pasal 26 sebesar 20% atau Rp 40.000.000.',
    presetRegime: 'pph26_uu36_2008',
    presetInput: {
      pph26: {
        nilaiBruto: 200000000,
        objectType: 'bunga_obligasi_wpln',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph26Uu36_2008Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 UU 36/2008 (20% bruto)';

    if (input.objectType === 'premi_asuransi_ln') {
      const basePremiRate = 10;
      if (input.hasSkdP3b && treatyRate < basePremiRate) {
        effectiveRate = treatyRate;
        basisLabel = `Tarif P3B dengan SKD DGT-1 (${formatPersen(treatyRate)})`;
      } else {
        effectiveRate = basePremiRate;
        basisLabel = 'Perkiraan penghasilan neto 50% x 20% = 10%';
      }
    } else if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B dengan SKD (${formatPersen(treatyRate)})`;
    } else if (input.objectType === 'bunga_obligasi_wpln') {
      effectiveRate = 20;
      basisLabel = 'Bunga obligasi WPLN era PP 16/2009 sebelum PP 9/2021 (20%)';
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
        'Sebelum PP 9/2021 berlaku pada Agustus 2021, bunga obligasi WPLN tanpa P3B dipotong PPh Pasal 26 sebesar 20% (dua kali lipat tarif PP 9/2021 yang sebesar 10%).',
      ],
    };
  },
};
