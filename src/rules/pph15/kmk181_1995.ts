import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_181_1995, SRC.KMK_416_1996, SRC.UU_10_1994];

const regime: TaxRegime = {
  id: 'pph15_kmk181_1995',
  taxType: 'pph15',
  name: 'KMK 181/KMK.04/1995 (Pelayaran & Penerbangan 1995–1996 — Digantikan KMK 416/417/475)',
  shortName: '1995–1996 (Historis KMK 181/1995)',
  legalBasis: 'KMK Nomor 181/KMK.04/1995 (Dicabut oleh KMK 416/417/475 Tahun 1996)',
  effectivePeriod: '1995 – September 1996',
  isCurrent: false,
  summary:
    'Aturan perdana Pasal 15 sektor transportasi pasca-UU 10/1994 sebelum dipecah ke KMK 416, 417, dan 475 Tahun 1996: sempat menetapkan tarif norma awal seragam lebih tinggi (norma neto 4%–6% x 30%–44% dengan lingkup penerimaan yang lebih luas termasuk penerbangan domestik non-charter).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph15-kmk181-1995',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'Tonggak Awal Norma Khusus Pelayaran & Penerbangan: KMK 181/KMK.04/1995 (1995–1996)',
  legalBasis: 'KMK Nomor 181/KMK.04/1995 jo. KMK 416/KMK.04/1996',
  effectiveDate: '1 Mei 1995',
  readMinutes: 4,
  summary:
    'Menelusuri peraturan pelaksana pertama Pasal 15 pasca-UU 10/1994 sebelum pemerintah memisahkan aturan spesifik pelayaran dalam negeri (KMK 416/1996), charter penerbangan dalam negeri (KMK 475/1996), dan angkutan luar negeri (KMK 417/1996).',
  sections: [
    {
      heading: 'Mengapa KMK 181/1995 hanya bertahan satu tahun sebelum dipecah di 1996?',
      paragraphs: [
        'KMK 181/KMK.04/1995 menjadi aturan pertama yang menyatukan norma penghitungan neto perusahaan pelayaran dan penerbangan (norma neto 4% -> efektif 1,2% untuk pelayaran DN, norma 6% -> 1,8% untuk penerbangan DN, serta 6% -> 2,64% untuk BUT luar negeri).',
        'Namun dalam praktiknya timbul sengketa mengenai apakah penerbangan berjadwal (non-charter) juga dikenai norma khusus final 1,8%, sehingga pada 1996 pemerintah menerbitkan paket terpisah: KMK 416/1996 (pelayaran DN tetap 1,2% final), KMK 475/1996 (khusus charter penerbangan DN 1,8% tidak final / kredit pajak, sedangkan penerbangan berjadwal pakai pembukuan umum), dan KMK 417/1996 (BUT angkutan luar negeri 2,64% final).',
      ],
    },
  ],
  caseExample: {
    title: 'Pendapatan freight pelayaran / penerbangan charter Rp 500 juta pada 1995',
    scenario:
      'Maskapai dalam negeri memperoleh peredaran bruto penerbangan charter Rp 500.000.000 pada masa berlaku KMK 181/1995 (norma neto 6% × 30% = 1,8% atau Rp 9.000.000).',
    presetRegime: 'pph15_kmk181_1995',
    presetInput: {
      pph15: {
        peredaranBruto: 500000000,
        sectorType: 'penerbangan_dn_charter',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph15Kmk181_1995Rule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.peredaranBruto);
    const rate =
      input.sectorType === 'pelayaran_dn'
        ? 1.2
        : input.sectorType === 'penerbangan_dn_charter'
          ? 1.8
          : 2.64;
    const tax = Math.round((bruto * rate) / 100);
    const netAmount = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto usaha pelayaran / penerbangan', value: bruto },
      {
        label: 'Tarif efektif norma khusus KMK 181/KMK.04/1995',
        formula:
          input.sectorType === 'pelayaran_dn'
            ? 'Pelayaran DN: 4% x 30% = 1,2%'
            : input.sectorType === 'penerbangan_dn_charter'
              ? 'Penerbangan DN: 6% x 30% = 1,8% (sebelum diperjelas charter di KMK 475/1996)'
              : 'Pelayaran/Penerbangan LN: 6% x 44% = 2,64%',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 15 terutang era 1995–1996',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Pendapatan bersih setelah PPh 15', value: netAmount },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 15 (Era KMK 181/1995)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Pendapatan Bersih Setelah PPh 15',
      takeHomeOrNetAmount: netAmount,
      steps,
      notes: [
        'KMK 181/1995 selanjutnya digantikan sejak 1996 oleh tiga keputusan khusus (KMK 416/1996, KMK 475/1996, dan KMK 417/1996) untuk mempertegas pemisahan antara penerbangan charter vs berjadwal serta pelayaran.',
      ],
    };
  },
};
