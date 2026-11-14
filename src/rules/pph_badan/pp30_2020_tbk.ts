import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_55_2022, SRC.PP_30_2020, SRC.PP_77_2013, SRC.PP_81_2007];

const regime: TaxRegime = {
  id: 'badan_pp30_2020_tbk',
  taxType: 'pph_badan',
  name: 'PP 81/2007, PP 77/2013, PP 30/2020 & PP 55/2022 (Tarif Perseroan Terbuka / Tbk)',
  shortName: '2008–Kini (Diskon Tarif Emiten Tbk)',
  legalBasis: 'Pasal 17 ayat (2b) UU PPh, PP 81/2007, PP 77/2013, PP 30/2020 & PP 55/2022',
  effectivePeriod: '1 Januari 2008 – Sekarang (Diskon -3% sejak 2020)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Emiten BEI saham publik >= 40% (19%)',
  summary:
    'Ketentuan khusus penurunan tarif PPh Badan bagi Perseroan Terbuka (Tbk) yang sahamnya diperdagangkan di Bursa Efek Indonesia minimal 40%: pengurangan 5% pada rezim PP 81/2007 & PP 77/2013 (menjadi 20% saat tarif umum 25%), lalu pengurangan 3% pada rezim PP 30/2020 jo. PP 55/2022 (menjadi 19% di bawah tarif umum 22%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pp30-2020-tbk',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Diskon Tarif PPh Badan Emiten Bursa (Tbk): Evolusi PP 81/2007, PP 77/2013, hingga PP 30/2020',
  legalBasis: 'PP 81/2007, PP 77/2013, PP 30/2020 & PP 55/2022 (Pasal 17 ayat 2b UU PPh)',
  effectiveDate: '1 Januari 2008 (Diskon 3% berlaku Tahun Pajak 2020 dst.)',
  readMinutes: 5,
  summary:
    'Insentif permanen pasar modal: emiten tercatat di BEI dengan free float >= 40% yang dimiliki minimal 300 pihak berhak membayar tarif PPh Badan 3% lebih rendah dari tarif korporasi umum (19% saat ini).',
  sections: [
    {
      heading: 'Dari diskon 5% (tarif 20%) ke diskon 3% (tarif 19%)',
      paragraphs: [
        'Pada PP Nomor 81 Tahun 2007 (berlaku 2008–2012) lalu digantikan PP Nomor 77 Tahun 2013 (berlaku 2013–2019), Perseroan Terbuka dengan kepemilikan saham publik >= 40% memperoleh penurunan tarif 5% di bawah tarif normal Pasal 17 ayat (2a) UU 36/2008 (sehingga tarifnya 23% pada 2009 dan 20% sepanjang 2010–2019).',
        'Seiring penurunan tarif umum PPh Badan menjadi 22% mulai Tahun Pajak 2020 melalui UU 2/2020 dan UU HPP, penurunan tarif bagi Perseroan Terbuka pada PP Nomor 30 Tahun 2020 dan PP Nomor 55 Tahun 2022 ditetapkan sebesar 3% lebih rendah sehingga tarif efektif emiten Tbk menjadi 19% (syarat: saham publik >= 40%, dimiliki paling sedikit 300 pihak, masing-masing memiliki < 5%, serta dipenuhi minimal 183 hari kalender dalam 1 tahun pajak).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 81/2007 & PP 77/2013 (2009–2019)',
    newHeader: 'PP 30/2020 & PP 55/2022 (2020–Sekarang)',
    rows: [
      {
        aspek: 'Tarif PPh Badan umum vs pengurangan Tbk',
        aturanLama: '25% umum dikurangi 5% = 20% Tbk (28%-5%=23% di 2009)',
        aturanBaru: '22% umum dikurangi 3% = 19% Tbk',
      },
      {
        aspek: 'Syarat free float, jumlah investor & holding period',
        aturanLama: '>= 40% publik, >= 300 pemegang saham, masing-masing < 5%, min 183 hari',
        aturanBaru: 'Tetap sama (termasuk buyback khusus akibat kondisi pasar tertentu)',
      },
    ],
  },
  caseExample: {
    title: 'Emiten Tbk dengan laba fiskal Rp 50 miliar memenuhi syarat free float 40% (19%)',
    scenario:
      'Sebuah perusahaan publik di BEI dengan porsi saham beredar 42% (minimal 300 pihak) membukukan PKP Rp 50.000.000.000 pada Tahun Pajak 2025: tarif 19% menghasilkan PPh Badan Rp 9,5 miliar (hemat Rp 1,5 miliar dibanding tarif 22%).',
    presetRegime: 'badan_pp30_2020_tbk',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 300000000000,
        penghasilanKenaPajak: 50000000000,
        isTbk: true,
        tbkEra: 'pp30_2020',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPp30_2020TbkRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkp = Math.floor(Math.max(0, input.penghasilanKenaPajak) / 1000) * 1000;
    const era = input.tbkEra ?? 'pp30_2020';

    const meta =
      era === 'pp30_2020'
        ? { normalRate: 22, discount: 3, label: 'PP 30/2020 jo. PP 55/2022 (2020–Kini): 22% - 3% = 19%' }
        : era === 'pp77_2013'
          ? { normalRate: 25, discount: 5, label: 'PP 77/2013 (2013–2019): 25% - 5% = 20%' }
          : { normalRate: 28, discount: 5, label: 'PP 81/2007 (2009): 28% - 5% = 23% (20% di 2010–2012)' };

    const effectiveRate = input.isTbk ? meta.normalRate - meta.discount : meta.normalRate;
    const tax = Math.round((pkp * effectiveRate) / 100);
    const normalTax = Math.round((pkp * meta.normalRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak (PKP bulat ribuan)', value: pkp },
      {
        label: input.isTbk ? `Tarif Perseroan Terbuka memenuhi syarat (${meta.label})` : `Tarif umum non-Tbk / gagal syarat 40% (${meta.normalRate}%)`,
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Badan Terutang Setahun',
        formula: `${formatRupiah(pkp)} x ${formatPersen(effectiveRate)}`,
        value: tax,
        isHighlight: true,
      },
      {
        label: 'Penghematan pajak dibanding tarif umum korporasi',
        value: Math.max(0, normalTax - tax),
      },
    ];

    return {
      regime,
      primaryTaxLabel: input.isTbk ? `PPh Badan Emiten Tbk (${effectiveRate}%)` : `PPh Badan Normal (${effectiveRate}%)`,
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Laba Fiskal Bersih Setelah PPh Badan',
      takeHomeOrNetAmount: Math.max(0, pkp - tax),
      steps,
      notes: [
        input.isTbk
          ? 'Syarat kumulatif Tbk: >= 40% saham dicatatkan dan diperdagangkan di BEI, dimiliki min. 300 pihak (maks. < 5% per pihak), dan terpenuhi minimal 183 hari kalender dalam 1 tahun pajak.'
          : 'Centang opsi Perseroan Terbuka (Tbk) pada panel kiri untuk mengaktifkan diskon tarif 3% (PP 30/2020) atau 5% (PP 77/2013 & PP 81/2007).',
      ],
    };
  },
};
