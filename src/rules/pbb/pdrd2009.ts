import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbb_pdrd_2009',
  taxType: 'pbb',
  name: 'UU Nomor 28 Tahun 2009 (PDRD)',
  shortName: '2010–2023 (UU PDRD)',
  legalBasis: 'Pasal 77–84 UU Nomor 28 Tahun 2009 (PDRD)',
  effectivePeriod: '1 Januari 2010 – 4 Januari 2024',
  isCurrent: false,
  summary:
    'PBB-P2 resmi dialihkan menjadi pajak daerah kabupaten/kota. Tidak menggunakan NJKP, tarif Perda maksimal 0,3% langsung dari (NJOP - NJOPTKP).',
  sources: [SRC.UU_28_2009_PDRD, SRC.UU_12_1994],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pbb-pdrd-2009',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'Pengalihan PBB-P2 ke Daerah dalam UU PDRD 28/2009 dan Tarif Maksimal 0,3%',
  legalBasis: 'UU Nomor 28 Tahun 2009 tentang PDRD',
  effectiveDate: '1 Januari 2010',
  readMinutes: 4,
  summary:
    'Sejarah pemindahan kewenangan pemungutan PBB sektor perdesaan dan perkotaan dari pemerintah pusat ke pemerintah daerah dengan penghapusan NJKP.',
  sections: [
    {
      heading: 'Desentralisasi penuh PBB Perdesaan dan Perkotaan',
      paragraphs: [
        'Melalui UU Nomor 28 Tahun 2009 (PDRD), pemungutan PBB sektor Perdesaan dan Perkotaan (PBB-P2) dialihkan bertahap menjadi pajak kabupaten/kota paling lambat tahun 2014, sementara sektor Perkebunan, Perhutanan, dan Pertambangan (PBB-P3) tetap dikelola pusat.',
        'Pada rezim UU PDRD, formula PBB-P2 dibuat lebih langsung: pemerintah daerah menetapkan tarif maksimal 0,3% (umumnya berjenjang 0,1% hingga 0,2% atau 0,3% tergantung besaran NJOP) tanpa mengalikannya dengan rasio NJKP 20% atau 40% seperti di era UU 12/1994.',
      ],
    },
  ],
  caseExample: {
    title: 'Perhitungan PBB-P2 era UU PDRD 28/2009 untuk NJOP Rp 1,5 miliar',
    scenario:
      'NJOP Total Rp 1,5 miliar dikurangi NJOPTKP Rp 10 juta langsung dikali tarif Perda 0,2% tanpa komponen NJKP.',
    presetRegime: 'pbb_pdrd_2009',
    presetInput: {
      pbb: {
        njopBumi: 950000000,
        njopBangunan: 550000000,
        njoptkpPilihan: 10000000,
        tierRate: 'menengah',
      },
    },
  },
};

export const pbbPdrd2009Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;
    const njoptkp = Math.max(10000000, input.njoptkpPilihan);
    const njopKenaPajak = Math.max(0, njopTotal - njoptkp);

    const tarifPerda =
      input.tierRate === 'rendah'
        ? 0.1
        : input.tierRate === 'menengah'
          ? 0.2
          : 0.3; // Maksimal UU PDRD 0,3%

    const pbbTerutang = Math.round((njopKenaPajak * tarifPerda) / 100);
    const effectiveRate = njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi', value: bumi },
      { label: 'NJOP Bangunan', value: bangunan },
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      {
        label: 'NJOPTKP (minimal Rp 10 jt sesuai UU PDRD)',
        value: -Math.min(njopTotal, njoptkp),
        isNegative: true,
      },
      { label: 'NJOP Dasar Pengenaan Pajak', value: njopKenaPajak },
      {
        label: 'Tarif Perda UU PDRD (maksimal 0,3%)',
        formula: `${formatPersen(tarifPerda)} x ${formatRupiah(njopKenaPajak)}`,
        value: tarifPerda,
        format: 'percent',
      },
      { label: 'PBB-P2 terutang setahun', value: pbbTerutang, isHighlight: true },
    ];

    const notes: string[] = [];
    if (input.tierRate === 'maksimal') {
      notes.push(
        'Pada era UU PDRD 28/2009, batas tarif tertinggi yang diperbolehkan adalah 0,3% (belum 0,5% seperti di UU HKPD).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PBB-P2 Terutang Setahun',
      primaryTaxAmount: pbbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'NJOP Kena Pajak (Setelah NJOPTKP)',
      takeHomeOrNetAmount: njopKenaPajak,
      steps,
      notes,
    };
  },
};
