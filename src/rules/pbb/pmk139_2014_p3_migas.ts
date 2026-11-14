import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const NJOPTKP_P3 = 12000000;

const sources = [SRC.PMK_76_2013, SRC.PMK_122_2019, SRC.PMK_139_2014, SRC.PMK_186_2019];

const regime: TaxRegime = {
  id: 'pbb_pmk139_2014_migas',
  taxType: 'pbb',
  name: 'PMK 76/2013 jo. PMK 122/2019 & PMK 139/2014 (PBB-P3 Hulu Migas & Panas Bumi)',
  shortName: '2013–2019 (PBB Migas & Panas Bumi)',
  legalBasis: 'PMK Nomor 76/PMK.03/2013 jo. PMK 122/2019 & PMK Nomor 139/PMK.03/2014 (Pra-PMK 186/2019)',
  effectivePeriod: '11 April 2013 – 31 Desember 2019 (Penatausahaan PBB Migas Tetap Relevan)',
  isCurrent: false,
  summary:
    'Mengatur metode khusus pengenaan PBB Sektor Pertambangan Migas dan Panas Bumi (PMK 76/2013 jo. PMK 122/2019) yang mencakup NJOP permukaan bumi (onshore/offshore) dan NJOP tubuh bumi berbasis kapitalisasi lifting produksi, serta klasifikasi NJOP sektor P3 era PMK 139/2014 sebelum dikodifikasikan di PMK 186/2019.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-pmk139-2014-migas',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'PBB Hulu Migas, Tubuh Bumi, & Klasifikasi P3 (PMK 76/2013 jo. PMK 122/2019 & PMK 139/2014)',
  legalBasis: 'PMK 76/PMK.03/2013 jo. PMK 122/2019 & PMK 139/PMK.03/2014',
  effectiveDate: '11 April 2013 – 31 Desember 2019',
  readMinutes: 5,
  summary:
    'Membahas komponen unik NJOP Tubuh Bumi (sub-surface cadangan migas/geotermal) dalam PMK 76/2013 dan pembaruan penatausahaan fasilitas PSC Hulu Migas pada PMK 122/2019.',
  sections: [
    {
      heading: 'Konsep NJOP Permukaan Bumi dan Tubuh Bumi di Sektor Migas/Panas Bumi',
      paragraphs: [
        'Berbeda dengan PBB tanah biasa, PBB Pertambangan Migas dan Panas Bumi dalam PMK 76/PMK.03/2013 mengenal dua objek bumi sekaligus: (1) Areal Permukaan Bumi (wilayah kerja onshore maupun perairan offshore termasuk sumur/kilang lapangan), dan (2) Tubuh Bumi (sub-surface), yakni ruang di bawah permukaan tempat cadangan hidrokarbon atau uap panas bumi berada.',
        'NJOP Tubuh Bumi pada fase eksplorasi umumnya ditetapkan dengan nilai dasar tertentu oleh Dirjen Pajak, sedangkan pada fase eksploitasi/produksi dihitung dari hasil penjualan minyak/gas/panas bumi selama satu tahun kalender sebelum tahun pajak dikalikan Angka Kapitalisasi.',
      ],
    },
    {
      heading: 'Konsolidasi klasifikasi NJOP P3 di PMK 139/2014 lalu PMK 186/2019',
      paragraphs: [
        'Penghitungan akhir PBB tetap menggunakan NJOPTKP sektor P3 Rp 12.000.000 (PMK 23/2014), NJKP 40%, dan tarif 0,5% (tarif efektif 0,20%). Pada kontrak kerja sama hulu migas tertentu yang ditanggung/reimburse negara sesuai PMK 122/PMK.03/2019, kewajiban SPPT PBB dicatat sebagai bagian tata kelola hulu migas melalui KPP Minyak dan Gas Bumi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 76/2013 & PMK 139/2014 (2013–2019)',
    newHeader: 'PMK 186/2019 jo. PMK 234/2022 (Kini)',
    rows: [
      {
        aspek: 'Payung penatausahaan PBB Migas & Panas Bumi',
        aturanLama: 'PMK 76/2013 (terpisah dari sektor perkebunan/minerba di PMK 139/2014)',
        aturanBaru: 'Dikodifikasi dalam PMK 186/2019 jo. PMK 234/2022 & PMK 122/2019',
      },
      {
        aspek: 'NJKP & Tarif Efektif PBB-P3',
        aturanLama: 'NJKP 40% × Tarif 0,5% = 0,20% efektif',
        aturanBaru: 'Tetap NJKP 40% × Tarif 0,5% = 0,20% efektif',
      },
    ],
  },
  caseExample: {
    title: 'Wilayah kerja Migas dengan NJOP Bumi & Tubuh Bumi Rp 80 M + Fasilitas Rp 20 M',
    scenario:
      'Kontraktor KKS Hulu Migas memiliki total NJOP permukaan/tubuh bumi Rp 80 M dan bangunan fasilitas Rp 20 M (total Rp 100 M). Dikurangi NJOPTKP Rp 12 juta -> NJOP Kena Pajak Rp 99.988.000.000 -> NJKP 40% -> PBB 0,5% = Rp 199.976.000.',
    presetRegime: 'pbb_pmk139_2014_migas',
    presetInput: {
      pbb: {
        njopBumi: 80000000000,
        njopBangunan: 20000000000,
        njoptkpPilihan: 12000000,
        tierRate: 'menengah',
        sektorP3Lama: 'migas_panas_bumi_pmk76',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbbPmk139_2014MigasRule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const sektor = input.sektorP3Lama ?? 'migas_panas_bumi_pmk76';
    const njopBumi = Math.max(0, input.njopBumi);
    const njopBangunan = Math.max(0, input.njopBangunan);
    const totalNjop = njopBumi + njopBangunan;
    const njopKenaPajak = Math.max(0, totalNjop - NJOPTKP_P3);
    const njkp = Math.round(njopKenaPajak * 0.4);
    const pbb = Math.round(njkp * 0.005);
    const effRate = njopKenaPajak > 0 ? (pbb / njopKenaPajak) * 100 : 0;

    const steps: CalculationStep[] = [
      {
        label:
          sektor === 'migas_panas_bumi_pmk76'
            ? 'NJOP Permukaan Bumi & Tubuh Bumi (PMK 76/2013)'
            : 'NJOP Bumi Perkebunan/Perhutanan (PMK 139/2014)',
        value: njopBumi,
      },
      { label: 'NJOP Bangunan & Fasilitas Penunjang', value: njopBangunan },
      { label: 'Total NJOP Objek Pajak P3', value: totalNjop },
      { label: 'Pengurang NJOPTKP P3', value: -Math.min(totalNjop, NJOPTKP_P3), isNegative: true },
      { label: 'NJKP (40% dari NJOP Kena Pajak)', value: njkp },
      {
        label: 'PBB-P3 Terutang (0,5% × NJKP = 0,20% efektif)',
        formula: `${formatRupiah(njkp)} x ${formatPersen(0.5)}`,
        value: pbb,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel:
        sektor === 'migas_panas_bumi_pmk76'
          ? 'PBB Migas/Panas Bumi (PMK 76/2013)'
          : 'PBB-P3 Sektor Lain (PMK 139/2014)',
      primaryTaxAmount: pbb,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Sisa NJOP Setelah PBB Tahunan',
      takeHomeOrNetAmount: Math.max(0, totalNjop - pbb),
      steps,
      notes: [
        sektor === 'migas_panas_bumi_pmk76'
          ? 'Pada sektor Hulu Migas/Panas Bumi (PMK 76/2013 jo. PMK 122/2019), objek pajak meliputi permukaan bumi dan tubuh bumi (sub-surface cadangan produksi).'
          : 'Pada era 2014–2019, klasifikasi NJOP sektor perkebunan dan perhutanan mengacu pada PMK 139/PMK.03/2014 sebelum disatukan di PMK 186/2019.',
      ],
    };
  },
};
