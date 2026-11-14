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
const NJKP_P3_RATE = 40;
const TARIF_P3 = 0.5;

const sources = [SRC.PMK_186_2019, SRC.PMK_234_2022, SRC.PMK_23_2014, SRC.UU_12_1994];

const regime: TaxRegime = {
  id: 'pbb_pmk186_2019_p3',
  taxType: 'pbb',
  name: 'PMK 186/PMK.03/2019 jo. PMK 234/2022 & PMK 23/2014 (PBB-P3 Pusat)',
  shortName: '2019–Kini (PBB-P3 Perkebunan/Tambang)',
  legalBasis: 'UU 12/1994, PMK 23/PMK.03/2014, PMK 186/PMK.03/2019 jo. PMK 234/PMK.03/2022',
  effectivePeriod: '1 Januari 2020 – Sekarang (Penyelarasan PMK 234/2022)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PBB Sektor P3 (Perkebunan, Perhutanan, Pertambangan)',
  summary:
    'Aturan teknis PBB Sektor Perkebunan, Perhutanan, Pertambangan (Migas, Panas Bumi, Minerba), serta Sektor Lainnya (perikanan/kelautan) yang tetap dikelola Direktorat Jenderal Pajak (Pemerintah Pusat): NJOPTKP Rp 12.000.000 (PMK 23/2014), NJKP 40%, dan tarif 0,5% -> tarif efektif 0,2% atas NJOP di atas Rp 12 juta.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-pmk186-2019-p3',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'PBB Sektor P3 (Perkebunan, Perhutanan, Pertambangan) yang Dikelola Pusat: PMK 186/2019 jo. PMK 234/2022',
  legalBasis: 'PMK 186/PMK.03/2019 stdd PMK 234/PMK.03/2022 & PMK 23/PMK.03/2014',
  effectiveDate: '1 Januari 2020 (Revisi Penyesuaian HKPD 30 Desember 2022)',
  readMinutes: 5,
  summary:
    'Sementara PBB-P2 (perdesaan dan perkotaan) dialihkan ke Pemda, PBB sektor P3 dan Sektor Lainnya tetap dipungut oleh DJP pusat dengan formula NJKP tetap 40% dan NJOPTKP Rp 12 juta.',
  sections: [
    {
      heading: 'Mengapa PBB-P3 tetap memakai NJKP 40% dan tarif 0,5% (bukan UU HKPD)?',
      paragraphs: [
        'UU PDRD 2009 dan UU HKPD 2022 hanya mengalihkan pemungutan PBB Perdesaan dan Perkotaan (PBB-P2) ke pemerintah kabupaten/kota. Adapun PBB untuk sektor strategis berskala besar — yakni Perkebunan, Perhutanan, Pertambangan (Migas, Panas Bumi, dan Mineral/Batubara), serta Sektor Lainnya (perairan lepas pantai, kabel laut, perikanan tangkap) — tetap menggunakan payung hukum UU 12/1985 jo. UU 12/1994 oleh DJP.',
        'Melalui PMK 186/PMK.03/2019 yang diperbarui oleh PMK 234/PMK.03/2022 (sebagai tindak lanjut UU HKPD agar batas perairan dan objek P3 tidak tumpang tindih dengan PBB-P2), DJP menyempurnakan penetapan NJOP berbasis kapitalisasi pendapatan dan biaya investasi serta mempertahankan NJOPTKP nasional Rp 12.000.000 (PMK 23/2014) dan NJKP 40% (tarif efektif 0,20%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PBB-P2 Daerah (UU 1/2022 HKPD)',
    newHeader: 'PBB-P3 & Sektor Lainnya Pusat (PMK 186/2019 jo. PMK 234/2022)',
    rows: [
      {
        aspek: 'Otoritas pemungut & pengelola',
        aturanLama: 'Pemerintah Kabupaten/Kota (Pemda)',
        aturanBaru: 'Direktorat Jenderal Pajak (Pemerintah Pusat — KPP)',
      },
      {
        aspek: 'NJOPTKP & Rasio NJKP',
        aturanLama: 'NJOPTKP min. Rp 10 jt; NJKP 20%–100%',
        aturanBaru: 'NJOPTKP Rp 12 jt (PMK 23/2014); NJKP tetap 40% (PP 25/2002)',
      },
      {
        aspek: 'Tarif & Tarif Efektif maksimal',
        aturanLama: 'Plafon 0,5% (efektif 0,1%–0,5%)',
        aturanBaru: '0,5% × 40% = 0,2% seragam (untuk NJOP >= Rp 1 M maupun sektor P3)',
      },
    ],
  },
  caseExample: {
    title: 'Areal perkebunan / pertambangan P3 dengan total NJOP Rp 50 miliar',
    scenario:
      'Perusahaan perkebunan atau tambang memiliki objek PBB-P3 dengan NJOP Bumi Rp 45 M dan NJOP Bangunan Rp 5 M (total Rp 50 M). Dikurangi NJOPTKP Rp 12 juta -> NJOP Kena Pajak Rp 49.988.000.000 -> NJKP 40% -> PBB 0,5% = Rp 99.976.000.',
    presetRegime: 'pbb_pmk186_2019_p3',
    presetInput: {
      pbb: {
        njopBumi: 45000000000,
        njopBangunan: 5000000000,
        njoptkpPilihan: 12000000,
        tierRate: 'menengah',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbbPmk186_2019P3Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const njopTotal = Math.max(0, input.njopBumi) + Math.max(0, input.njopBangunan);
    const njopKenaPajak = Math.max(0, njopTotal - NJOPTKP_P3);
    const njkp = Math.round((njopKenaPajak * NJKP_P3_RATE) / 100);
    const pbb = Math.round((njkp * TARIF_P3) / 100);
    const effRate = njopKenaPajak > 0 ? (pbb / njopKenaPajak) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'NJOP Bumi & Areal Produktif P3', value: Math.max(0, input.njopBumi) },
      { label: 'NJOP Bangunan & Fasilitas Tambang/Pabrik', value: Math.max(0, input.njopBangunan) },
      { label: 'Total NJOP Objek Pajak PBB-P3', value: njopTotal },
      { label: 'Pengurang NJOPTKP P3 (PMK 23/2014)', value: -Math.min(njopTotal, NJOPTKP_P3), isNegative: true },
      { label: 'Dasar Penghitungan PBB (NJOP - NJOPTKP)', value: njopKenaPajak },
      { label: `NJKP Tetap P3 (${NJKP_P3_RATE}% — PP 25/2002 & PMK 186/2019)`, value: njkp },
      {
        label: 'PBB Sektor P3 terutang ke Kas Negara (0,5% × NJKP)',
        formula: `${formatRupiah(njkp)} x ${formatPersen(TARIF_P3)} = efektif 0,20%`,
        value: pbb,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBB-P3 Terutang Pusat (0,5% × 40%)',
      primaryTaxAmount: pbb,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Sisa NJOP Setelah Dikurangi Pajak Tahunan',
      takeHomeOrNetAmount: Math.max(0, njopTotal - pbb),
      steps,
      notes: [
        'Berbeda dengan PBB-P2 daerah, pemegang objek PBB-P3 wajib menyampaikan Surat Pemberitahuan Objek Pajak (SPOP) setiap tahun kepada KPP dan menerima SPPT dari DJP.',
        'Khusus pertambangan dan perkebunan, nilai NJOP tidak hanya dihitung dari harga pasar tanah melainkan memakai metode kapitalisasi hasil produksi / biaya pengembangan teknis sesuai PMK 186/2019 jo. PMK 234/2022.',
      ],
    };
  },
};
