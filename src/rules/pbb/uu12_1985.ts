import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbb_uu12_1985',
  taxType: 'pbb',
  name: 'UU Nomor 12 Tahun 1985',
  shortName: '1986–1994 (UU 12/1985)',
  legalBasis: 'UU Nomor 12 Tahun 1985 tentang Pajak Bumi dan Bangunan & PP 46/1985',
  effectivePeriod: '1 Januari 1986 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Undang-undang PBB pertama (menggantikan Ipeda/Pajak Kekayaan): tarif tunggal 0,5%, NJKP seragam 20% (PP 46/1985), serta batas bebas khusus Nilai Bangunan Tidak Kena Pajak (NBTKP) Rp 2 juta per satuan bangunan.',
  sources: [SRC.UU_12_1985, SRC.PP_46_1985, SRC.UU_12_1994],
};

const article: TaxArticle = {
  id: 'pbb-uu12-1985',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'UU 12/1985: Awal PBB Nasional, NBTKP Bangunan Rp 2 Juta, dan NJKP 20%',
  legalBasis: 'UU Nomor 12 Tahun 1985 & PP Nomor 46 Tahun 1985',
  effectiveDate: '1 Januari 1986',
  readMinutes: 3,
  summary:
    'Sebelum UU 12/1994 memperkenalkan NJOPTKP Rp 8 juta atas gabungan bumi dan bangunan, UU 12/1985 hanya membebaskan Nilai Bangunan Tidak Kena Pajak sebesar Rp 2 juta dengan NJKP seragam 20%.',
  sections: [
    {
      heading: 'Dari batas bebas bangunan Rp 2 juta menjadi NJOPTKP gabungan',
      paragraphs: [
        'UU Nomor 12 Tahun 1985 yang berlaku mulai 1 Januari 1986 menyatukan berbagai pungutan properti lama (seperti Ipeda) menjadi satu Pajak Bumi dan Bangunan nasional dengan tarif tunggal 0,5% atas Nilai Jual Kena Pajak (NJKP).',
        'Berdasarkan Pasal 3 ayat (3) UU 12/1985, pengurang tidak kena pajak pada periode 1986–1994 hanya berlaku untuk bangunan, yakni Nilai Bangunan Tidak Kena Pajak (NBTKP) sebesar Rp 2.000.000 per satuan bangunan (sehingga tanah/bumi tetap dihitung penuh). Melalui PP 46/1985, NJKP ditetapkan seragam 20% sebelum kemudian dibedakan menjadi 20%/40% di UU 12/1994 & PP 25/2002.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 12/1985 (1986–1994)',
    newHeader: 'UU 12/1994 (1995–2009)',
    rows: [
      {
        aspek: 'Batas bebas tidak kena pajak',
        aturanLama: 'NBTKP Rp 2.000.000 khusus atas bangunan',
        aturanBaru: 'NJOPTKP Rp 8 jt (lalu Rp 12 jt) atas bumi + bangunan',
      },
      {
        aspek: 'Persentase NJKP',
        aturanLama: 'Seragam 20% (PP 46/1985)',
        aturanBaru: '20% (< Rp 1 M) atau 40% (>= Rp 1 M)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi perhitungan PBB era UU 12/1985',
    scenario:
      'Objek properti dengan NJOP Bumi Rp 40 juta dan NJOP Bangunan Rp 30 juta dihitung menggunakan NBTKP Rp 2 juta dan NJKP 20%.',
    presetRegime: 'pbb_uu12_1985',
    presetInput: {
      pbb: {
        njopBumi: 40000000,
        njopBangunan: 30000000,
        njoptkpPilihan: 10000000,
        tierRate: 'menengah',
      },
    },
  },
};

export const pbbUu12_1985Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;

    const nbtkpBangunan = Math.min(bangunan, 2000000);
    const njopDasar = Math.max(0, njopTotal - nbtkpBangunan);
    const njkpPercent = 20;
    const tarif = 0.5;
    const njkpAmount = Math.round((njopDasar * njkpPercent) / 100);
    const pbbTerutang = Math.round((njkpAmount * tarif) / 100);
    const effectiveRate = njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi', value: bumi },
      { label: 'NJOP Bangunan', value: bangunan },
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      {
        label: 'NBTKP khusus Bangunan (Pasal 3 ayat 3 UU 12/1985, maks Rp 2 jt)',
        value: -nbtkpBangunan,
        isNegative: true,
      },
      { label: 'NJOP Dasar Perhitungan', value: njopDasar },
      {
        label: 'NJKP Seragam PP 46/1985 (20%)',
        formula: '20% x NJOP Dasar',
        value: njkpAmount,
      },
      {
        label: 'Tarif Tunggal UU PBB (0,5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(njkpAmount)}`,
        value: tarif,
        format: 'percent',
      },
      { label: 'PBB terutang setahun', value: pbbTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBB Terutang Setahun',
      primaryTaxAmount: pbbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Nilai Jual Kena Pajak (NJKP)',
      takeHomeOrNetAmount: njkpAmount,
      steps,
      notes: [
        'Pada UU 12/1985 (1986–1994), pengurang sebesar Rp 2.000.000 hanya memotong nilai bangunan (NBTKP) sehingga tanah kosong tidak mendapat pengurang, sebelum diubah menjadi NJOPTKP Rp 8 juta (lalu Rp 12 juta) melalui UU 12/1994.',
      ],
    };
  },
};
