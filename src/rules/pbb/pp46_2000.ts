import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const NJOPTKP_2000 = 12000000;
const TARIF_PBB = 0.5;

const sources = [SRC.PP_46_2000, SRC.KMK_201_2000, SRC.PP_25_2002];

const regime: TaxRegime = {
  id: 'pbb_pp46_2000',
  taxType: 'pbb',
  name: 'PP 46/2000 jo. KMK 201/2000 (Transisi NJKP 40% Perkebunan/Tambang & NJOPTKP Rp 12 Jt)',
  shortName: '2000–2002 (PP 46/2000 & KMK 201)',
  legalBasis: 'PP Nomor 46 Tahun 2000 (NJKP 20%/40%) & KMK 201/KMK.04/2000 (NJOPTKP maks. Rp 12 jt)',
  effectivePeriod: '1 Januari 2001 – 12 Mei 2002 (Berlanjut ke PP 25/2002)',
  isCurrent: false,
  summary:
    'Tonggak pemisahan NJKP 40% vs 20% dalam sejarah PBB sebelum PP 25/2002: PP 46/2000 menaikkan NJKP menjadi 40% khusus sektor perkebunan dan kehutanan serta NJOP >= Rp 1 miliar, sementara pertambangan saat itu masih 20% sebelum akhirnya PP 25/2002 memasukkan pertambangan ke 40% pada tahun 2002; bersamaan KMK 201/2000 menetapkan plafon NJOPTKP Rp 12 juta.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-pp46-2000',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'Transisi NJKP 40% dan NJOPTKP Rp 12 Juta: PP Nomor 46 Tahun 2000 & KMK 201/KMK.04/2000',
  legalBasis: 'PP Nomor 46 Tahun 2000 & KMK Nomor 201/KMK.04/2000',
  effectiveDate: '1 Januari 2001 (Digantikan PP 25/2002 per 13 Mei 2002)',
  readMinutes: 4,
  summary:
    'Mengisi fase penting antara era seragam 20% (1985–2000) dan penyempurnaan PP 25/2002: bagaimana PP 46/2000 membedakan NJKP 40% untuk perkebunan/kehutanan dan properti Rp 1 miliar sementara sektor pertambangan masih 20%.',
  sections: [
    {
      heading: 'Perbedaan unik NJKP Pertambangan di PP 46/2000 vs PP 25/2002',
      paragraphs: [
        'Pada awal dekade 2000-an, pemerintah menaikkan batas NJOPTKP dari Rp 8 juta menjadi setinggi-tingginya Rp 12.000.000 melalui KMK 201/KMK.04/2000 dan mulai menaikkan NJKP dari seragam 20% menjadi 40% melalui PP Nomor 46 Tahun 2000.',
        'Namun pada PP Nomor 46 Tahun 2000, kategori wajib NJKP 40% baru mencakup objek pajak perkebunan, objek pajak kehutanan, serta objek pajak lainnya dengan NJOP >= Rp 1 miliar — sementara objek pertambangan sempat masih dikenai 20% sebelum direvisi menjadi 40% bersama perkebunan dan kehutanan dalam PP Nomor 25 Tahun 2002.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP Nomor 46 Tahun 2000 (2001–Mei 2002)',
    newHeader: 'PP Nomor 25 Tahun 2002 (Mei 2002–2009 / P3 Kini)',
    rows: [
      {
        aspek: 'NJKP Perkebunan & Kehutanan',
        aturanLama: '40% (tarif efektif 0,2%)',
        aturanBaru: '40% (tarif efektif 0,2%)',
      },
      {
        aspek: 'NJKP Pertambangan (meskipun NJOP berapapun)',
        aturanLama: '20% (bila NJOP < Rp 1 M) / mengacu objek khusus PP 46/2000',
        aturanBaru: 'Wajib 40% untuk seluruh objek pertambangan tanpa ambang Rp 1 M',
      },
      {
        aspek: 'Plafon NJOPTKP Daerah',
        aturanLama: 'Maksimal Rp 12.000.000 (KMK 201/KMK.04/2000)',
        aturanBaru: 'Rp 12.000.000 hingga desentralisasi PBB-P2 ke Pemda',
      },
    ],
  },
  caseExample: {
    title: 'Objek perkebunan NJOP Rp 800 juta terkena NJKP 40% pada era PP 46/2000',
    scenario:
      'Meskipun NJOP perkebunan di bawah Rp 1 miliar (Rp 800 juta), berdasarkan Pasal 1 huruf a PP 46/2000 langsung dikenai NJKP 40% (bukan 20%) setelah dikurangi NJOPTKP Rp 12 juta.',
    presetRegime: 'pbb_pp46_2000',
    presetInput: {
      pbb: {
        njopBumi: 650000000,
        njopBangunan: 150000000,
        njoptkpPilihan: 12000000,
        tierRate: 'menengah',
        sektorPp46: 'perkebunan_kehutanan',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbbPp46_2000Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const njopTotal = Math.max(0, input.njopBumi) + Math.max(0, input.njopBangunan);
    const sektor = input.sektorPp46 ?? 'perkebunan_kehutanan';
    const njopKenaPajak = Math.max(0, njopTotal - NJOPTKP_2000);

    let njkpRatio = 20;
    let formula = 'NJKP 20% (NJOP < Rp 1 M / sektor umum PP 46/2000)';
    if (sektor === 'perkebunan_kehutanan') {
      njkpRatio = 40;
      formula = 'NJKP 40% langsung (Objek Perkebunan/Kehutanan — Pasal 1 huruf a PP 46/2000)';
    } else if (sektor === 'pertambangan') {
      njkpRatio = njopTotal >= 1000000000 ? 40 : 20;
      formula =
        njopTotal >= 1000000000
          ? 'NJKP 40% (Pertambangan NJOP >= Rp 1 M sebelum disamakan di PP 25/2002)'
          : 'NJKP 20% (Pertambangan < Rp 1 M era PP 46/2000 sebelum naik ke 40% di PP 25/2002)';
    } else if (njopTotal >= 1000000000) {
      njkpRatio = 40;
      formula = 'NJKP 40% (Objek lain dengan NJOP >= Rp 1 miliar — PP 46/2000)';
    }

    const njkp = Math.round((njopKenaPajak * njkpRatio) / 100);
    const pbb = Math.round((njkp * TARIF_PBB) / 100);

    const steps: CalculationStep[] = [
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      { label: 'Pengurang NJOPTKP KMK 201/KMK.04/2000', value: -Math.min(njopTotal, NJOPTKP_2000), isNegative: true },
      { label: 'NJOP sebagai dasar pengenaan PBB', value: njopKenaPajak },
      { label: `NJKP PP 46/2000 (${njkpRatio}%)`, formula, value: njkp },
      {
        label: 'PBB terutang (0,5% × NJKP)',
        formula: `${formatRupiah(njkp)} x ${formatPersen(TARIF_PBB)}`,
        value: pbb,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: `PBB Era PP 46/2000 (NJKP ${njkpRatio}%)`,
      primaryTaxAmount: pbb,
      effectiveRatePercent: njopKenaPajak > 0 ? (pbb / njopKenaPajak) * 100 : 0,
      takeHomeOrNetLabel: 'Sisa NJOP Setelah PBB Tahunan',
      takeHomeOrNetAmount: Math.max(0, njopTotal - pbb),
      steps,
      notes: [
        'PP 46/2000 menjadi jembatan antara rezim lama NJKP seragam 20% dan penyempurnaan PP 25/2002 yang menetapkan pertambangan mutlak 40% terlepas dari besaran NJOP.',
      ],
    };
  },
};
