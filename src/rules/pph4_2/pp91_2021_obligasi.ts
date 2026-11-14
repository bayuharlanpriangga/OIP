import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_91_2021, SRC.PP_55_2019, SRC.PP_16_2009, SRC.PP_139_2000];

const regime: TaxRegime = {
  id: 'pph4_2_obligasi_pp91_2021',
  taxType: 'pph4_2',
  name: 'PP 91/2021 jo. PP 16/2009 & PP 139/2000 (Bunga Obligasi WPDN)',
  shortName: '2021–Kini (Bunga Obligasi 10%)',
  legalBasis: 'PP Nomor 91 Tahun 2021 (10%), PP 16/2009 jo. PP 55/2019 (15%/5%), & PP 139/2000 (20%)',
  effectivePeriod: '30 Agustus 2021 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Kupon & diskonto obligasi WPDN/BUT (10%)',
  summary:
    'Penurunan tarif PPh Final atas bunga/diskonto obligasi yang diterima Wajib Pajak Dalam Negeri dan BUT menjadi seragam 10% di PP 91/2021 (mencabut tarif lama 15% obligasi umum & 5%–10% reksa dana di PP 16/2009 jo. PP 55/2019 serta tarif awal 20% di PP 139/2000).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp91-2021-obligasi',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final Bunga Obligasi & SUN: PP 91/2021 (10%), PP 16/2009 (15%), & PP 139/2000 (20%)',
  legalBasis: 'PP Nomor 91 Tahun 2021 mencabut PP 16/2009 stdd PP 55/2019 & PP 139/2000',
  effectiveDate: '30 Agustus 2021',
  readMinutes: 4,
  summary:
    'Menelusuri penurunan bertahap pajak kupon dan diskonto obligasi/SBN bagi investor dalam negeri dari 20% (tahun 2001), 15% (tahun 2009), hingga menjadi 10% tunggal mulai Agustus 2021.',
  sections: [
    {
      heading: 'Harmonisasi ke tarif tunggal 10% melalui PP 91/2021',
      paragraphs: [
        'Sebelumnya, PP 16/2009 jo. PP 55/2019 memberlakukan tarif 15% untuk bunga/diskonto obligasi bagi WPDN umum namun memberi insentif khusus 5% (lalu 10% mulai 2021) bagi Reksa Dana terdaftar OJK. Hal tersebut memicu ketimpangan beban antara investor ritel langsung dan investor via reksa dana.',
        'Melalui PP Nomor 91 Tahun 2021 (diundangkan dan berlaku 30 Agustus 2021), pemerintah menyeragamkan seluruh tarif PPh Final bunga dan diskonto obligasi (termasuk SBN/SUN/SBSN serta obligasi daerah) untuk WPDN dan BUT menjadi 10% — menyamai tarif insentif WPLN di PP 9/2021 agar pasar surat utang domestik lebih kompetitif.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 139/2000 & PP 16/2009 (2001–Ags 2021)',
    newHeader: 'PP Nomor 91 Tahun 2021 (30 Ags 2021–Kini)',
    rows: [
      {
        aspek: 'Tarif bunga/diskonto obligasi WPDN & BUT',
        aturanLama: '20% (PP 139/2000) lalu 15% (PP 16/2009)',
        aturanBaru: '10% tunggal dari jumlah bruto bunga / selisih harga diskonto',
      },
      {
        aspek: 'Kupon obligasi diterima Reksa Dana / DINFRA',
        aturanLama: '5% (s.d. 2020) dan 10% (2021+) di PP 55/2019',
        aturanBaru: 'Diseragamkan menjadi 10% di PP 91/2021',
      },
    ],
  },
  caseExample: {
    title: 'Kupon SBN / Obligasi korporasi Rp 20 juta diterima investor WPDN',
    scenario:
      'Investor individu dalam negeri menerima kupon obligasi bruto Rp 20.000.000. Sejak PP 91/2021, dipotong PPh Final 10% sebesar Rp 2.000.000 (turun dari Rp 3.000.000 era PP 16/2009).',
    presetRegime: 'pph4_2_obligasi_pp91_2021',
    presetInput: {
      pph4_2: {
        nilaiBruto: 20000000,
        objectType: 'sewa_tanah_bangunan',
        eraObligasi: 'pp91_2021',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2ObligasiPp91_2021Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const era = input.eraObligasi ?? 'pp91_2021';
    const meta =
      era === 'pp91_2021'
        ? { rate: 10, label: 'PP Nomor 91 Tahun 2021 (30 Ags 2021–Kini): Tarif tunggal 10% Final' }
        : era === 'pp16_2009'
          ? { rate: 15, label: 'PP 16/2009 jo. PP 55/2019 (2009–Ags 2021): Tarif umum WPDN 15% Final' }
          : { rate: 20, label: 'PP Nomor 139 Tahun 2000 (2001–2008): Tarif historis 20% Final' };

    const tax = Math.round((bruto * meta.rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Jumlah bruto bunga kupon / selisih diskonto obligasi', value: bruto },
      { label: 'Tarif PPh Final Obligasi', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) dipotong kustodian / emiten',
        formula: `${formatRupiah(bruto)} x ${formatPersen(meta.rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Kupon bersih diterima investor', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Bunga Obligasi (WPDN)',
      primaryTaxAmount: tax,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Bunga Obligasi Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'PP 91/2021 hanya mengatur obligasi bagi WPDN dan BUT (10% Final); untuk pemegang obligasi WPLN di luar negeri diatur sejalan lewat PP 9/2021 pada rezim PPh Pasal 26 (juga 10%).',
      ],
    };
  },
};
