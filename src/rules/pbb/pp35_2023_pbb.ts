import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_35_2023, SRC.UU_1_2022_HKPD];

const regime: TaxRegime = {
  id: 'pbb_pp35_2023',
  taxType: 'pbb',
  name: 'PP Nomor 35 Tahun 2023 (Pelaksana PBB-P2 UU HKPD: NJOPTKP & Klasterisasi NJKP)',
  shortName: '2023–Kini (PP 35/2023 Pelaksana HKPD)',
  legalBasis: 'PP Nomor 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah',
  effectivePeriod: '16 Juni 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pedoman NJOPTKP 1 objek tertinggi & klasterisasi NJKP 20%–100%',
  summary:
    'Aturan pelaksana UU HKPD yang menstandarkan pemberian NJOPTKP paling sedikit Rp 10 juta hanya untuk satu objek bernilai tertinggi per Wajib Pajak per tahun pajak, serta mengatur kriteria penetapan persentase NJKP 20%–100% oleh kepala daerah berdasarkan klasterisasi NJOP dan pemanfaatan objek.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-pp35-2023',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'PP Nomor 35 Tahun 2023: Aturan Teknis NJOPTKP Satu Objek dan Assessment Ratio NJKP PBB-P2',
  legalBasis: 'PP Nomor 35 Tahun 2023 jo. UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '16 Juni 2023',
  readMinutes: 4,
  summary:
    'Menjelaskan pedoman nasional penyusunan Perda/Perkada PBB-P2 pasca UU HKPD dalam menentukan objek penerima NJOPTKP serta alasan pemanfaatan persentase NJKP 20%–100%.',
  sections: [
    {
      heading: 'Aturan NJOPTKP dan mekanisme peredam lonjakan PBB melalui NJKP',
      paragraphs: [
        'PP Nomor 35 Tahun 2023 (mencabut PP 55/2016 dan PP 10/2021) menjadi pedoman resmi pemerintah daerah dalam mengimplementasikan UU HKPD. Untuk menghindari beban pajak yang melonjak akibat pemutakhiran NJOP mendekati harga pasar, daerah dapat menetapkan Assessment Ratio berupa NJKP antara 20% hingga 100% dari (NJOP − NJOPTKP) berdasarkan bentuk pemanfaatan (lahan pangan/hunian vs komersial) atau klasterisasi NJOP.',
        'PP 35/2023 menegaskan bahwa apabila seorang Wajib Pajak memiliki lebih dari satu objek PBB-P2 dalam satu kabupaten/kota, NJOPTKP minimal Rp 10.000.000 hanya dikurangkan pada satu objek pajak dengan nilai paling tinggi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 55/2016 (Pelaksana UU PDRD)',
    newHeader: 'PP 35/2023 (Pelaksana UU HKPD)',
    rows: [
      {
        aspek: 'Penerapan NJKP pada PBB-P2',
        aturanLama: 'Tidak digunakan (tarif Perda langsung ke NJOP − NJOPTKP)',
        aturanBaru: 'Ditetapkan 20%–100% berdasar klasterisasi NJOP & pemanfaatan objek',
      },
      {
        aspek: 'Pemberian NJOPTKP jika punya > 1 objek',
        aturanLama: 'Diberikan 1 objek per WP (nilai terbesar)',
        aturanBaru: 'Tetap paling rendah Rp 10 juta untuk 1 objek nilai tertinggi',
      },
    ],
  },
  caseExample: {
    title: 'Objek komersial NJOP Rp 2 miliar dengan NJKP 60% & tarif Perda 0,5%',
    scenario:
      'Tanah & bangunan komersial dengan total NJOP Rp 2.000.000.000, NJOPTKP Rp 10.000.000, klaster NJKP Perkada 60%, dan tarif Perda 0,5%. NJKP = 60% × Rp 1,99 M = Rp 1,194 M; PBB-P2 = 0,5% × Rp 1,194 M = Rp 5.970.000.',
    presetRegime: 'pbb_pp35_2023',
    presetInput: {
      pbb: {
        njopBumi: 1200000000,
        njopBangunan: 800000000,
        njoptkpPilihan: 10000000,
        tierRate: 'tinggi',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbbPp35_2023Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;
    const njoptkp = Math.max(10000000, input.njoptkpPilihan);
    const dasarNjop = Math.max(0, njopTotal - njoptkp);

    const njkpPercent =
      input.tierRate === 'rendah'
        ? 20
        : input.tierRate === 'menengah'
        ? 40
        : input.tierRate === 'tinggi'
        ? 60
        : 100;
    const tarifPerda = 0.5;
    const njkpAmount = Math.round((dasarNjop * njkpPercent) / 100);
    const pbbTerutang = Math.round((njkpAmount * tarifPerda) / 100);

    const steps: CalculationStep[] = [
      { label: 'Total NJOP Bumi & Bangunan', value: njopTotal },
      { label: 'NJOPTKP (1 objek nilai tertinggi per WP — min. Rp 10 jt)', value: -Math.min(njopTotal, njoptkp), isNegative: true },
      { label: 'NJOP setelah NJOPTKP', value: dasarNjop },
      { label: `Assessment Ratio NJKP PP 35/2023 (${njkpPercent}%)`, formula: `${njkpPercent}% x ${formatRupiah(dasarNjop)}`, value: njkpAmount },
      { label: 'PBB-P2 Terutang (Tarif maks. 0,5% x NJKP)', formula: `0,5% x ${formatRupiah(njkpAmount)} (efektif ${formatPersen((njkpPercent * tarifPerda) / 100)})`, value: pbbTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBB-P2 Terutang Setahun (PP 35/2023)',
      primaryTaxAmount: pbbTerutang,
      effectiveRatePercent: njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0,
      takeHomeOrNetLabel: 'Nilai Jual Kena Pajak (NJKP)',
      takeHomeOrNetAmount: njkpAmount,
      steps,
      notes: [
        'PP 35/2023 menetapkan bahwa tarif efektif PBB-P2 aktual merupakan kombinasi NJKP Perkada (20%–100%) dikali tarif Perda (maksimal 0,5%), sementara NJOPTKP hanya diberikan pada 1 objek dengan nilai terbesar.',
      ],
    };
  },
};
