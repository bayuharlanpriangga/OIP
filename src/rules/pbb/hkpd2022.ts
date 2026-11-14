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
  id: 'pbb_hkpd_2022',
  taxType: 'pbb',
  name: 'UU Nomor 1 Tahun 2022 (HKPD)',
  shortName: '2024–Sekarang (UU HKPD)',
  legalBasis: 'Pasal 40–41 UU Nomor 1 Tahun 2022 (HKPD)',
  effectivePeriod: '5 Januari 2024 – Sekarang',
  isCurrent: true,
  summary:
    'PBB-P2 menggunakan NJOPTKP minimal Rp 10 juta per Wajib Pajak, penilaian NJKP daerah 20%–100%, serta batas tarif maksimal naik menjadi 0,5%.',
  sources: [SRC.UU_1_2022_HKPD, SRC.UU_28_2009_PDRD],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-hkpd-2022',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'Pembaruan PBB-P2 dalam UU HKPD: Skema NJKP 20%–100% dan Batas Tarif 0,5%',
  legalBasis: 'Pasal 40–41 UU Nomor 1 Tahun 2022 tentang HKPD',
  effectiveDate: '5 Januari 2024',
  readMinutes: 5,
  summary:
    'UU HKPD mengembalikan mekanisme persentase NJKP (20% hingga 100%) dan menaikkan batas tarif maksimal PBB-P2 daerah dari 0,3% menjadi 0,5%.',
  sections: [
    {
      heading: 'Perubahan struktur perhitungan dari UU PDRD ke UU HKPD',
      paragraphs: [
        'Di bawah UU PDRD 28/2009, PBB-P2 dihitung dengan mengalikan langsung tarif Perda (maksimal 0,3%) terhadap NJOP setelah dikurangi NJOPTKP. Mulai berlakunya UU Nomor 1 Tahun 2022 (HKPD) dan Perda daerah paling lambat Januari 2024, dasar pengenaan PBB-P2 terlebih dahulu dikalikan persentase Nilai Jual Kena Pajak (NJKP) antara 20% sampai dengan 100%.',
        'Besaran NJKP ditetapkan oleh masing-masing pemerintah kabupaten/kota dengan mempertimbangkan kenaikan NJOP, bentuk pemanfaatan objek pajak, serta klasterisasi nilai objek pajak.',
      ],
    },
    {
      heading: 'Batas minimal NJOPTKP dan tarif maksimal 0,5%',
      paragraphs: [
        'NJOPTKP dalam UU HKPD ditetapkan paling rendah Rp 10.000.000 untuk satu objek pajak per Wajib Pajak. Sementara batas atas tarif dinaikkan dari 0,3% menjadi paling tinggi 0,5%—sehingga apabila Perda menetapkan NJKP 40% dan tarif 0,5%, beban efektifnya tetap setara 0,2% dari NJOP kena pajak.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (2010–2023)',
    newHeader: 'UU HKPD 1/2022 (2024–Kini)',
    rows: [
      {
        aspek: 'Penggunaan NJKP (20%–100%)',
        aturanLama: 'Tidak ada (tarif langsung ke NJOP - NJOPTKP)',
        aturanBaru: 'Ditetapkan Perda 20% s.d. 100%',
      },
      {
        aspek: 'Tarif maksimal PBB-P2',
        aturanLama: '0,3%',
        aturanBaru: '0,5%',
      },
      {
        aspek: 'NJOPTKP minimal',
        aturanLama: 'Rp 10.000.000 per WP',
        aturanBaru: 'Rp 10.000.000 per WP',
      },
    ],
  },
  caseExample: {
    title: 'Rumah tinggal dengan total NJOP Rp 1,5 miliar',
    scenario:
      'NJOP Bumi Rp 950.000.000 dan NJOP Bangunan Rp 550.000.000 dengan NJOPTKP Rp 10.000.000 dan skema NJKP 40% × tarif 0,5%.',
    presetRegime: 'pbb_hkpd_2022',
    presetInput: {
      pbb: {
        njopBumi: 950000000,
        njopBangunan: 550000000,
        njoptkpPilihan: 10000000,
        tierRate: 'menengah',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pbbHkpd2022Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const bumi = Math.max(0, input.njopBumi);
    const bangunan = Math.max(0, input.njopBangunan);
    const njopTotal = bumi + bangunan;
    const njoptkp = Math.max(10000000, input.njoptkpPilihan);
    const njopSetelahNjoptkp = Math.max(0, njopTotal - njoptkp);

    const njkpPercent =
      input.tierRate === 'rendah'
        ? 20
        : input.tierRate === 'menengah'
          ? 40
          : input.tierRate === 'tinggi'
            ? 60
            : 100;
    const tarifPerda = 0.5;
    const njkpAmount = Math.round((njopSetelahNjoptkp * njkpPercent) / 100);
    const pbbTerutang = Math.round((njkpAmount * tarifPerda) / 100);
    const effectiveRate = njopTotal > 0 ? (pbbTerutang / njopTotal) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi', value: bumi },
      { label: 'NJOP Bangunan', value: bangunan },
      { label: 'Total NJOP Bumi dan Bangunan', value: njopTotal },
      {
        label: 'NJOPTKP (batas minimal UU HKPD Rp 10 jt)',
        value: -Math.min(njopTotal, njoptkp),
        isNegative: true,
      },
      { label: 'NJOP sebagai dasar perhitungan PBB', value: njopSetelahNjoptkp },
      {
        label: `NJKP ditetapkan Perda (${njkpPercent}%)`,
        formula: `${njkpPercent}% x ${formatRupiah(njopSetelahNjoptkp)}`,
        value: njkpAmount,
      },
      {
        label: 'Tarif PBB-P2 UU HKPD (maksimal 0,5%)',
        formula: `${formatPersen(tarifPerda)} x NJKP (efektif ${formatPersen((njkpPercent * tarifPerda) / 100)})`,
        value: tarifPerda,
        format: 'percent',
      },
      { label: 'PBB-P2 terutang setahun', value: pbbTerutang, isHighlight: true },
    ];

    const notes: string[] = [];
    if (njopTotal > 0 && njopSetelahNjoptkp === 0) {
      notes.push(
        `Total NJOP (${formatRupiah(njopTotal)}) tidak melebihi NJOPTKP (${formatRupiah(njoptkp)}), sehingga PBB-P2 terutang Rp 0.`
      );
    } else if (njopTotal > 0) {
      notes.push(
        `Dengan NJKP ${njkpPercent}% dan tarif Perda 0,5%, tarif efektif atas NJOP kena pajak adalah ${formatPersen((njkpPercent * tarifPerda) / 100)}.`
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PBB-P2 Terutang Setahun',
      primaryTaxAmount: pbbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Dasar Nilai Jual Kena Pajak (NJKP)',
      takeHomeOrNetAmount: njkpAmount,
      steps,
      notes,
    };
  },
};
