import {
  CalculationStep,
  Pph15SectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph15_kmk416_1996',
  taxType: 'pph15',
  name: 'KMK 416/1996, KMK 475/1996 & KMK 417/1996',
  shortName: '1996–Kini (Norma Khusus)',
  legalBasis: 'Pasal 15 UU PPh, KMK 416/KMK.04/1996, KMK 475/KMK.04/1996, & KMK 417/KMK.04/1996',
  effectivePeriod: '1996 – Sekarang (Administrasi PMK 81/2024)',
  isCurrent: true,
  summary:
    'Norma Penghitungan Khusus PPh Pasal 15 sektor transportasi: pelayaran dalam negeri 1,2% final, penerbangan charter dalam negeri 1,8% tidak final, dan pelayaran/penerbangan luar negeri 2,64% final.',
};

const article: TaxArticle = {
  id: 'pph15-pelayaran-penerbangan',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'Norma Penghitungan Khusus PPh Pasal 15 Pelayaran dan Penerbangan (1,2%, 1,8%, dan 2,64%)',
  legalBasis: 'KMK 416/KMK.04/1996, KMK 475/KMK.04/1996, & KMK 417/KMK.04/1996',
  effectiveDate: '1996',
  readMinutes: 4,
  summary:
    'Untuk menghitung penghasilan neto perusahaan pelayaran dan penerbangan yang sulit dihitung secara umum, pemerintah menetapkan norma penghasilan neto khusus dengan tarif efektif langsung dari peredaran bruto.',
  sections: [
    {
      heading: 'Tarif efektif pelayaran dalam negeri, charter penerbangan, dan BUT luar negeri',
      paragraphs: [
        'Berdasarkan KMK 416/KMK.04/1996, perusahaan pelayaran dalam negeri dikenai PPh Final sebesar 1,2% dari peredaran bruto (berasal dari norma penghasilan neto 4% dikali tarif PPh tertinggi kala itu 30%), baik untuk pengangkutan antar-pelabuhan Indonesia maupun rute dari/ke luar negeri.',
        'Sementara untuk perusahaan penerbangan dalam negeri berdasarkan perjanjian charter (KMK 475/KMK.04/1996), dikenai PPh sebesar 1,8% dari peredaran bruto (norma neto 6% x 30%) yang bersifat tidak final (kredit pajak). Untuk perusahaan pelayaran atau penerbangan luar negeri melalui BUT di Indonesia (KMK 417/KMK.04/1996), tarifnya sebesar 2,64% final (norma neto 6% x 44%).',
      ],
    },
  ],
  caseExample: {
    title: 'Jasa sewa kapal (freight) perusahaan pelayaran dalam negeri Rp 500 juta',
    scenario:
      'Perusahaan manufaktur menyewa jasa angkutan laut dari perusahaan pelayaran dalam negeri berizin SIUPAL dengan tagihan Rp 500.000.000.',
    presetRegime: 'pph15_kmk416_1996',
    presetInput: {
      pph15: {
        peredaranBruto: 500000000,
        sectorType: 'pelayaran_dn',
      },
    },
  },
};

function getPph15Meta(sector: Pph15SectorType): {
  normaNetoPersen: number;
  rate: number;
  nature: string;
  basis: string;
} {
  switch (sector) {
    case 'pelayaran_dn':
      return {
        normaNetoPersen: 4,
        rate: 1.2,
        nature: 'Final',
        basis: 'KMK 416/KMK.04/1996 (Norma neto 4% x 30% = 1,2% final)',
      };
    case 'penerbangan_dn_charter':
      return {
        normaNetoPersen: 6,
        rate: 1.8,
        nature: 'Tidak Final (Kredit Pajak)',
        basis: 'KMK 475/KMK.04/1996 (Norma neto 6% x 30% = 1,8% tidak final)',
      };
    case 'pelayaran_penerbangan_ln':
      return {
        normaNetoPersen: 6,
        rate: 2.64,
        nature: 'Final',
        basis: 'KMK 417/KMK.04/1996 (Norma neto 6% x 44% = 2,64% final)',
      };
  }
}

export const pph15Kmk416_1996Rule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.peredaranBruto);
    const meta = getPph15Meta(input.sectorType);
    const normaNeto = Math.round((bruto * meta.normaNetoPersen) / 100);
    const pph15 = Math.round((bruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto jasa pengangkutan / charter', value: bruto },
      {
        label: `Norma penghasilan neto khusus (${formatPersen(meta.normaNetoPersen)})`,
        formula: meta.basis,
        value: normaNeto,
      },
      {
        label: `PPh Pasal 15 terutang (${meta.nature})`,
        formula: `${formatRupiah(bruto)} x ${formatPersen(meta.rate)}`,
        value: pph15,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `PPh Pasal 15 Terutang (${meta.nature})`,
      primaryTaxAmount: pph15,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Pendapatan Bersih Setelah PPh 15',
      takeHomeOrNetAmount: Math.max(0, bruto - pph15),
      steps,
      notes: [
        meta.basis +
          '. Batas penyetoran masa kini mengikuti ketentuan seragam tanggal 15 bulan berikutnya (PMK 81/2024).',
      ],
    };
  },
};
