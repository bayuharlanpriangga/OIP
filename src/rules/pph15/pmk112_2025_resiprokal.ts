import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_112_2025, SRC.KMK_417_1996_DJP, SRC.PER_25_PJ_2018_DJP];

const regime: TaxRegime = {
  id: 'pph15_pmk112_2025_resiprokal',
  taxType: 'pph15',
  name: 'P3B Article 8 & PMK 112/2025 (Pembebasan Resiprokal Pelayaran/Penerbangan Asing)',
  shortName: '2026–Sekarang (Resiprokal P3B Pelayaran/Penerbangan Asing)',
  legalBasis: 'P3B Article 8 (Shipping & Air Transport) jo. PMK 112/2025 & KMK 417/KMK.04/1996',
  effectivePeriod: 'Berlaku Terkini (Penyelarasan SKD di PMK 112/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PPh Final 2,64% LN vs Pembebasan 0% P3B Asas Resiprokal',
  summary:
    'Perbandingan pemajakan perusahaan pelayaran dan/atau penerbangan luar negeri (jalur internasional ke/dari Indonesia): tanpa SKD atau negara non-treaty dikenai PPh Final Pasal 15 sebesar 2,64% bruto (KMK 417/1996); namun dengan SKD valid + asas timbal balik (Article 8 P3B / PMK 112/2025), hak pemajakan berada di negara domisili sehingga dipotong 0% di Indonesia.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph15-pmk112-2025-resiprokal',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'PPh Pasal 15 Pelayaran/Penerbangan Asing: Tarif Domestik 2,64% vs P3B Article 8 Resiprokal',
  legalBasis: 'KMK 417/KMK.04/1996 jo. P3B Article 8 & PMK Nomor 112 Tahun 2025',
  effectiveDate: '31 Desember 2025 (Penyelarasan Prosedur P3B)',
  readMinutes: 4,
  summary:
    'Mengulas cara kerja asas resiprokal (timbal balik) dalam Article 8 P3B bagi maskapai dan pelayaran internasional asing yang wajib didukung SKD/DGT valid di bawah PMK 112/2025.',
  sections: [
    {
      heading: 'Mengapa maskapai/pelayaran asing bisa bebas dari tarif 2,64% Final?',
      paragraphs: [
        'Sesuai KMK Nomor 417/KMK.04/1996, perusahaan pelayaran atau penerbangan luar negeri yang beroperasi di jalur internasional dari Indonesia dikenai norma penghasilan neto 6% dan tarif PPh Final 2,64% dari peredaran bruto freight/tiket.',
        'Namun hampir seluruh Perjanjian Penghindaran Pajak Berganda (P3B) menganut ketentuan Article 8 (Shipping and Air Transport) yang memberikan hak pemajakan eksklusif kepada negara tempat manajemen efektif maskapai/pelayaran berada — atau diskon 50% pada beberapa P3B tertentu. Melalui penyelarasan prosedur SKD dalam PMK 112/2025 (berlaku 31 Desember 2025), pembebasan 0% baru sah apabila SKD diunggah di Coretax dan uji substansi terpenuhi, dengan ketentuan peralihan bahwa SKD format PER-25/PJ/2018 yang sudah terbit sebelumnya tetap berlaku hingga masa cakupannya berakhir.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Non-Treaty / Gagal SKD (KMK 417/1996)',
    newHeader: 'Memenuhi Article 8 P3B + SKD Valid (PMK 112/2025)',
    rows: [
      {
        aspek: 'Tarif PPh Pasal 15 di Indonesia',
        aturanLama: '2,64% Final dari peredaran bruto (6% neto × 44% tarif lama)',
        aturanBaru: '0% (hak pemajakan eksklusif di negara domisili sesuai asas resiprokal)',
      },
      {
        aspek: 'Syarat administrasi pemanfaatan',
        aturanLama: 'Tidak ada pembebasan tanpa SKD yang tervalidasi',
        aturanBaru: 'Wajib SKD elektronik & lulus uji anti-abuse PMK 112/2025',
      },
    ],
  },
  caseExample: {
    title: 'Pendapatan freight pelayaran luar negeri Rp 3.000.000.000 dengan SKD P3B Article 8',
    scenario:
      'Maskapai pelayaran asing berdomisili di negara mitra P3B memperoleh peredaran bruto Rp 3 miliar atas pengangkutan kargo ekspor dari Pelabuhan Tanjung Priok.',
    presetRegime: 'pph15_pmk112_2025_resiprokal',
    presetInput: {
      pph15: {
        peredaranBruto: 3000000000,
        sectorType: 'pelayaran_penerbangan_ln',
        hasSkdP3bArticle8: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph15Pmk112_2025ResiprokalRule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.peredaranBruto);
    const hasSkd = Boolean(input.hasSkdP3bArticle8);
    const taxDomestik = Math.round(bruto * 0.0264);
    const taxApplied = hasSkd ? 0 : taxDomestik;
    const effRate = hasSkd ? 0 : 2.64;

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto freight / pengangkutan internasional LN', value: bruto },
      { label: 'PPh Pasal 15 tarif domestik KMK 417/1996 (2,64% Final)', value: taxDomestik },
      {
        label: hasSkd
          ? 'Pembebasan Article 8 P3B + SKD valid (PMK 112/2025)'
          : 'Tidak ada SKD Article 8 -> Tarif 2,64% tetap dipotong',
        value: hasSkd ? -taxDomestik : 0,
        isNegative: hasSkd,
      },
      {
        label: hasSkd ? 'PPh Pasal 15 dipotong di Indonesia (0%)' : 'PPh Pasal 15 Final dipotong (2,64%)',
        formula: hasSkd ? 'Dibebaskan berdasarkan Article 8 P3B' : `${formatRupiah(bruto)} x 2,64%`,
        value: taxApplied,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: hasSkd ? 'PPh Pasal 15 Resiprokal P3B (0%)' : 'PPh Pasal 15 LN Normal (2,64%)',
      primaryTaxAmount: taxApplied,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Pendapatan Bruto Bersih Diterima Operator',
      takeHomeOrNetAmount: Math.max(0, bruto - taxApplied),
      steps,
      notes: [
        hasSkd
          ? `Dengan SKD valid sesuai PMK 112/2025 dan klausul resiprokal Article 8 P3B, operator asing bebas dari potongan 2,64% (${formatRupiah(taxDomestik)}) di Indonesia.`
          : 'Tanpa SKD valid atau berasal dari yurisdiksi non-treaty, berlaku tarif final PPh Pasal 15 sebesar 2,64% (KMK 417/1996).',
      ],
    };
  },
};
