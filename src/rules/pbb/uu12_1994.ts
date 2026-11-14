import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbb_uu12_1994',
  taxType: 'pbb',
  name: 'UU Nomor 12 Tahun 1994 (PBB Pusat / P3)',
  shortName: '1995–2009 (Nasional & P3)',
  legalBasis: 'UU Nomor 12 Tahun 1994 & PP Nomor 25 Tahun 2002',
  effectivePeriod: '1 Januari 1995 – 2009 (masih berlaku untuk PBB-P3)',
  isCurrent: false,
  summary:
    'Tarif tunggal 0,5% dikalikan NJKP (20% untuk NJOP < Rp 1 M atau 40% untuk NJOP >= Rp 1 M), dengan NJOPTKP nasional Rp 12 juta.',
  sources: [SRC.UU_12_1994, SRC.PP_25_2002, SRC.UU_12_1985],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-uu12-1994',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'UU 12/1994 & PP 25/2002: NJOPTKP Gabungan dan NJKP 20%/40% PBB Pusat (1995–2009)',
  legalBasis: 'UU Nomor 12 Tahun 1994 & PP Nomor 25 Tahun 2002',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Pembaruan UU PBB 1994 yang mengganti pembebasan bangunan (NBTKP) menjadi NJOPTKP atas gabungan bumi dan bangunan serta membagi NJKP menjadi 20% atau 40% sebelum PBB-P2 diserahkan ke daerah.',
  sections: [
    {
      heading: 'Lahirnya NJOPTKP dan pembagian NJKP 20% vs. 40%',
      paragraphs: [
        'Melalui UU Nomor 12 Tahun 1994 (berlaku 1 Januari 1995), pemerintah mengganti konsep Nilai Bangunan Tidak Kena Pajak (NBTKP Rp 2 juta di UU 12/1985) menjadi Nilai Jual Objek Pajak Tidak Kena Pajak (NJOPTKP) yang dikurangkan dari total NJOP bumi dan bangunan sekaligus—semula Rp 8 juta lalu dinaikkan hingga paling tinggi Rp 12 juta melalui aturan pelaksana.',
        'Atas dasar penghitungan tersebut diterapkan tarif tunggal 0,5% dikalikan Nilai Jual Kena Pajak (NJKP). Melalui PP 46/2000 hingga PP 25 Tahun 2002, NJKP dibedakan menjadi 20% untuk objek dengan NJOP di bawah Rp 1 miliar (tarif efektif 0,1%) dan 40% untuk objek dengan NJOP Rp 1 miliar ke atas serta sektor perkebunan/perhutanan/pertambangan (tarif efektif 0,2%).',
      ],
    },
    {
      heading: 'Tetap berlaku untuk sektor P3 yang dikelola DJP',
      paragraphs: [
        'Meskipun PBB Perdesaan dan Perkotaan (PBB-P2) telah diserahkan ke kabupaten/kota sejak UU PDRD 2009 dan diperbarui di UU HKPD 2022, formula 0,5% × NJKP 40% berdasarkan UU 12/1994 masih tetap dipakai hingga kini untuk sektor PBB Perkebunan, Perhutanan, Pertambangan, dan Sektor Lainnya (PBB-P3/P5L) di tingkat pusat.',
      ],
    },
  ],
  caseExample: {
    title: 'Rumah ber-NJOP Rp 1,5 miliar dihitung memakai UU 12/1994 & PP 25/2002',
    scenario:
      'Total NJOP Rp 1.500.000.000 dikurangi NJOPTKP Rp 12.000.000 dikali NJKP 40% (karena NJOP >= Rp 1 M) lalu dikali 0,5% menghasilkan PBB setahun sebesar Rp 2.976.000.',
    presetRegime: 'pbb_uu12_1994',
    presetInput: {
      pbb: {
        njopBumi: 900000000,
        njopBangunan: 600000000,
        njoptkpPilihan: 12000000,
        tierRate: 'menengah',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pbbUu12_1994Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;
    const njoptkp = 12000000;
    const njopSetelahNjoptkp = Math.max(0, njopTotal - njoptkp);

    const njkpPercent = njopTotal >= 1000000000 ? 40 : 20;
    const tarif = 0.5;
    const njkpAmount = Math.round((njopSetelahNjoptkp * njkpPercent) / 100);
    const pbbTerutang = Math.round((njkpAmount * tarif) / 100);
    const effectiveRate = njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi', value: bumi },
      { label: 'NJOP Bangunan', value: bangunan },
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      {
        label: 'NJOPTKP Nasional (maks Rp 12 jt)',
        value: -Math.min(njopTotal, njoptkp),
        isNegative: true,
      },
      { label: 'NJOP Dasar Perhitungan', value: njopSetelahNjoptkp },
      {
        label: `NJKP PP 25/2002 (${njkpPercent}%)`,
        formula:
          njopTotal >= 1000000000
            ? 'NJOP >= Rp 1 M menggunakan NJKP 40%'
            : 'NJOP < Rp 1 M menggunakan NJKP 20%',
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
        'Ketentuan 0,5% x NJKP (20%/40%) dari UU PBB tetap berlaku sampai saat ini khusus untuk sektor Perkebunan, Perhutanan, dan Pertambangan (PBB-P3) yang dikelola DJP.',
      ],
    };
  },
};
