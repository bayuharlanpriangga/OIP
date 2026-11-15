import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_keluar_minerba_2012_2017',
  taxType: 'bea_keluar',
  name: 'Era Transisi UU Minerba & Tarif Progresif 20%–60% (PMK 75/2012 – PMK 6/2014)',
  shortName: '2012–2017 (PMK 75 & PMK 6/2014)',
  legalBasis:
    'PMK Nomor 75/PMK.011/2012 stdd PMK Nomor 6/PMK.011/2014 (Dicabut oleh PMK 13/PMK.010/2017)',
  effectivePeriod: '16 Mei 2012 – 9 Februari 2017',
  isCurrent: false,
  summary:
    'Tonggak awal penerapan Bea Keluar pertambangan pasca-UU Minerba 4/2009: PMK 75/2012 mengenakan tarif flat 20% atas ekspor 65 jenis bijih mineral mentah (2012–11 Jan 2014), disusul larangan bijih mentah 12 Jan 2014 & eskalasi tarif konsentrat per semester 25% hingga 60% melalui PMK 6/PMK.011/2014.',
  sources: [
    SRC.PMK_75_2012,
    SRC.PMK_6_2014,
    SRC.PMK_13_2017,
  ],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-keluar-minerba-pmk75-2012-pmk6-2014',
  taxType: 'bea_keluar',
  taxTypeLabel: 'Bea Keluar',
  title: 'Historis Era Transisi Minerba: Bijih Mentah 20% (PMK 75/2012) & Konsentrat 25%–60% (PMK 6/2014)',
  legalBasis: 'PMK Nomor 75/PMK.011/2012 (16 Mei 2012) & PMK Nomor 6/PMK.011/2014 (11 Jan 2014 – 9 Feb 2017)',
  effectiveDate: '16 Mei 2012 – 9 Februari 2017',
  readMinutes: 5,
  summary:
    'Periode 2012–2017 menandai instrumen fiskal paling agresif sepanjang sejarah Bea Keluar Indonesia untuk memaksa hilirisasi mineral logam sebelum era relaksasi progres smelter PMK 13/2017.',
  sections: [
    {
      heading: 'PMK 75/PMK.011/2012: Bea Keluar perdana bijih mineral mentah 20%',
      paragraphs: [
        'Menjelang batas waktu larangan ekspor mineral mentah amanat UU Nomor 4 Tahun 2009 tentang Pertambangan Mineral dan Batubara pada 2014, pemerintah menerbitkan PMK Nomor 75/PMK.011/2012 (berlaku Mei 2012). Peraturan ini untuk pertama kalinya mengenakan Bea Keluar flat sebesar 20% atas ekspor 65 jenis bahan mentah bijih mineral (nikel, bauksit, tembaga, bijih besi, timah, mangan, dan konsentrat tertentu).',
        'Tujuannya adalah mengerem laju pengurasan bahan tambang mentah (raw ore) serta mendorong perusahaan tambang menyusun rencana pembangunan pabrik pengolahan dan pemurnian di dalam negeri.',
      ],
    },
    {
      heading: 'PMK 6/PMK.011/2014: Pelarangan bijih mentah & lonjakan progresif konsentrat hingga 60%',
      paragraphs: [
        'Diundangkan efektif 11 Januari 2014 selaras berlakunya larangan ekspor bijih mineral mentah pada 12 Januari 2014, ekspor hasil pengolahan berupa konsentrat (tembaga >= 15% Cu, besi, mangan, timbal, seng) masih diberi izin sementara dengan tarif Bea Keluar berjenjang naik setiap semester di bawah PMK Nomor 6/PMK.011/2014.',
        'Untuk konsentrat tembaga (ex 2603.00.00.00), jadwal tarifnya melonjak dari 25% (Jan–Des 2014) -> 35% (Jan–Jun 2015) -> 40% (Jul–Des 2015) -> 50% (Jan–Jun 2016) -> 60% (Jul–Des 2016). Pola serupa berlaku bagi konsentrat besi/mangan/timbal/seng (20% pada 2014 naik hingga 60% pada 2016), sebelum dirombak total oleh PMK 13/2017.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 75/2012 (Mei 2012 – 11 Jan 2014)',
    newHeader: 'PMK 6/2014 (12 Jan 2014 – Des 2016)',
    rows: [
      {
        aspek: 'Bijih Mineral Mentah (Raw Ore / Nikel / Bauksit)',
        aturanLama: 'Tarif Bea Keluar flat 20%',
        aturanBaru: 'Dilarang Ekspor (Ban Total UU Minerba)',
      },
      {
        aspek: 'Konsentrat Tembaga (>= 15% Cu)',
        aturanLama: '20% (bersama daftar bijih mineral)',
        aturanBaru: '25% (2014) -> 35% (S1 2015) -> 40% (S2 2015) -> 50% (S1 2016) -> 60% (S2 2016)',
      },
      {
        aspek: 'Konsentrat Besi, Mangan, Timbal & Seng',
        aturanLama: '20%',
        aturanBaru: '20% (2014) -> 30% (S1 2015) -> 40% (S2 2015) -> 50% (S1 2016) -> 60% (S2 2016)',
      },
    ],
  },
  caseExample: {
    title: 'Ekspor Konsentrat Tembaga Semester I 2016 dengan tarif progresif 50% (PMK 6/2014)',
    scenario:
      'Pada April 2016 (Semester I 2016), perusahaan tambang mengekspor konsentrat tembaga senilai USD 1.000.000 saat jadwal eskalasi tarif PMK 6/PMK.011/2014 mencapai 50% dan kurs pajak Rp 13.200/USD.',
    presetRegime: 'bea_keluar_minerba_2012_2017',
    presetInput: {
      bea_keluar: {
        nilaiEksporUsd: 1000000,
        ndpbmKurs: 13200,
        tonaseMt: 1000,
        tarifBkPersen: 50,
        periodeMinerba2012_2017: 'pmk6_2014_h1_2016_50',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

const MINERBA_RATE_META: Record<
  NonNullable<TaxCalculatorInput['bea_keluar']['periodeMinerba2012_2017']>,
  { label: string; tarif: number }
> = {
  pmk75_2012_ore_20: { label: 'PMK 75/2012 (Mei 2012 – 11 Jan 2014: Bijih Mineral Mentah) — 20%', tarif: 20 },
  pmk6_2014_h1_2014_25: { label: 'PMK 6/2014 (12 Jan – 31 Des 2014: Konsentrat Tembaga) — 25%', tarif: 25 },
  pmk6_2014_h1_2015_35: { label: 'PMK 6/2014 (Sem. I 2015: 1 Jan – 30 Jun 2015) — 35%', tarif: 35 },
  pmk6_2014_h2_2015_40: { label: 'PMK 6/2014 (Sem. II 2015: 1 Jul – 31 Des 2015) — 40%', tarif: 40 },
  pmk6_2014_h1_2016_50: { label: 'PMK 6/2014 (Sem. I 2016: 1 Jan – 30 Jun 2016) — 50%', tarif: 50 },
  pmk6_2014_h2_2016_60: { label: 'PMK 6/2014 (Sem. II 2016: 1 Jul – 31 Des 2016) — 60%', tarif: 60 },
};

export const beaKeluarMinerba2012Rule: TaxRuleModule<TaxCalculatorInput['bea_keluar']> = {
  regime,
  article,
  calculate(input) {
    const key = input.periodeMinerba2012_2017 ?? 'pmk6_2014_h1_2016_50';
    const meta = MINERBA_RATE_META[key];
    const nilaiEksporUsd = Math.max(0, input.nilaiEksporUsd);
    const ndpbmKurs = Math.max(0, input.ndpbmKurs);
    const nilaiEksporIdr = Math.round(nilaiEksporUsd * ndpbmKurs);

    const beaKeluarUsd = nilaiEksporUsd * (meta.tarif / 100);
    const beaKeluarIdr = Math.round(beaKeluarUsd * ndpbmKurs);

    const steps: CalculationStep[] = [
      {
        label: 'Periode Jadwal Tarif Minerba (2012–2016)',
        formula: 'Eskalasi kalender semesteran sebelum reformasi PMK 13/2017',
        value: 0,
        format: 'text',
        displayValue: meta.label,
      },
      {
        label: 'Nilai Ekspor Berdasarkan HPE (Rupiah)',
        formula: `USD ${nilaiEksporUsd.toLocaleString('id-ID')} x ${formatRupiah(ndpbmKurs)}`,
        value: nilaiEksporIdr,
      },
      {
        label: 'Tarif Bea Keluar Berlaku',
        formula: meta.label,
        value: meta.tarif,
        format: 'percent',
      },
      {
        label: 'Bea Keluar Terutang',
        formula: `${formatPersen(meta.tarif)} x ${formatRupiah(nilaiEksporIdr)}`,
        value: beaKeluarIdr,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Keluar Terutang (Era 2012–2017)',
      primaryTaxAmount: beaKeluarIdr,
      annualTaxLabel: 'Setara Bea Keluar (USD)',
      annualTaxAmount: Math.round(beaKeluarUsd),
      annualTaxDisplay: `USD ${beaKeluarUsd.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
      effectiveRatePercent: meta.tarif,
      effectiveRateLabel: 'Tarif Progresif Minerba',
      takeHomeOrNetLabel: 'Nilai Ekspor Neto Setelah BK',
      takeHomeOrNetAmount: Math.max(0, nilaiEksporIdr - beaKeluarIdr),
      steps,
      notes: [
        'Pada era PMK 6/PMK.011/2014, keterlambatan penyelesaian smelter memicu kenaikan tarif Bea Keluar konsentrat tembaga dari 25% hingga memuncak 60% pada paruh kedua 2016.',
        'Aturan lanjutan berupa PMK 153/PMK.011/2014 sempat memberi relaksasi tarif 0%–7,5% khusus bagi perusahaan yang menyerahkan jaminan kesungguhan dan mencapai progres konstruksi tertentu.',
      ],
    };
  },
};
