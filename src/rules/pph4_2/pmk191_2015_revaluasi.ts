import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_79_2008, SRC.PMK_191_2015, SRC.PMK_233_2015];

const regime: TaxRegime = {
  id: 'pph4_2_pmk191_2015_revaluasi',
  taxType: 'pph4_2',
  name: 'PMK 79/2008 (10% Reguler) & PMK 191/2015 jo. PMK 233/2015 (Revaluasi Aktiva Tetap 3%/4%/6%)',
  shortName: '2008–Kini (Revaluasi Aktiva Tetap)',
  legalBasis: 'Pasal 19 UU PPh jo. PMK 79/PMK.03/2008 & PMK 191/PMK.010/2015 stdd PMK 233/PMK.03/2015',
  effectivePeriod: '23 Mei 2008 – Sekarang (Insentif Khusus Okt 2015 – Des 2016)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tarif reguler 10% PMK 79/2008 (& riwayat diskon 3%/4%/6% PMK 191/2015)',
  summary:
    'PPh Final Pasal 19 UU PPh atas selisih lebih penilaian kembali (revaluasi) aktiva tetap perusahaan (Nilai Pasar Wajar KJPP dikurangi Nilai Sisa Buku Fiskal): tarif permanen 10% di PMK 79/2008, serta paket insentif tarif khusus 3% (2015), 4% (H1 2016), dan 6% (H2 2016) di PMK 191/2015 jo. PMK 233/2015.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pmk191-2015-revaluasi',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final Revaluasi Aktiva Tetap: Tarif Reguler 10% (PMK 79/2008) vs. Diskon 3%–6% (PMK 191/2015)',
  legalBasis: 'PMK 79/PMK.03/2008 & PMK 191/PMK.010/2015 jo. PMK 233/PMK.03/2015',
  effectiveDate: '23 Mei 2008 / 20 Oktober 2015 (Insentif Khusus)',
  readMinutes: 5,
  summary:
    'Mengupas perlakuan pajak final atas revaluasi aset tetap (tanah, bangunan, mesin/pabrik) untuk menaikkan basis penyusutan fiskal dan memperkuat rasio modal perusahaan, termasuk risiko larangan pengalihan aset (clawback).',
  sections: [
    {
      heading: 'Cara kerja PPh Final 10% PMK 79/2008 sebagai tarif reguler yang masih berlaku',
      paragraphs: [
        'Apabila nilai pasar aktiva tetap perusahaan (khususnya tanah dan bangunan yang dibeli puluhan tahun lalu) melonjak jauh melampaui nilai sisa buku fiskalnya, Wajib Pajak Badan dapat mengajukan penilaian kembali aktiva tetap kepada DJP berdasarkan penilaian KJPP/ahli penilai.',
        'Atas selisih lebih (Nilai Pasar Wajar minus Nilai Sisa Buku Fiskal), dikenai PPh Final sebesar 10% berdasarkan PMK 79/PMK.03/2008. Sebagai imbal balik, mulai tahun pajak revaluasi disetujui, nilai penyusutan fiskal aset tetap dihitung menggunakan nilai baru yang lebih tinggi sehingga mengurangi beban PPh Badan 22% di tahun-tahun mendatang.',
      ],
    },
    {
      heading: 'Insentif khusus 3%, 4%, dan 6% pada Paket Kebijakan Ekonomi V (PMK 191/2015)',
      paragraphs: [
        'Pada Oktober 2015 hingga Desember 2016, melalui PMK 191/PMK.010/2015 jo. PMK 233/PMK.03/2015, pemerintah memangkas tarif PPh Final revaluasi menjadi: 3% (permohonan s.d. 31 Desember 2015), 4% (Januari–Juni 2016), dan 6% (Juli–Desember 2016). Aset yang memperoleh diskon tarif tidak boleh dijual sebelum masa penyusutan berakhir (atau 10 tahun untuk tanah/bangunan) kecuali terkena sanksi tambahan selisih tarif normal 10%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 191/2015 jo. PMK 233/2015 (2015–2016)',
    newHeader: 'PMK 79/PMK.03/2008 (Reguler Berlaku Kini)',
    rows: [
      {
        aspek: 'Tarif PPh Final atas selisih lebih revaluasi',
        aturanLama: '3% (2015), 4% (H1 2016), 6% (H2 2016)',
        aturanBaru: '10% bersifat final dari selisih lebih penilaian kembali',
      },
      {
        aspek: 'Holding period / larangan pengalihan aset',
        aturanLama: 'Mengikuti sisa masa manfaat baru (10 thn untuk tanah/bangunan)',
        aturanBaru: 'Jika dialihkan sebelum masa manfaat/10 thn (tanah/bangunan), selisih tarif 10% (atau tambahan PPh) ditagih',
      },
    ],
  },
  caseExample: {
    title: 'Revaluasi tanah & gudang pabrik dengan nilai pasar Rp 25 M dan nilai buku Rp 5 M',
    scenario:
      'Sebuah perusahaan merevaluasi aset tetap senilai pasar Rp 25.000.000.000 terhadap nilai sisa buku fiskal Rp 5.000.000.000 (selisih lebih Rp 20.000.000.000). Menggunakan tarif reguler 10% PMK 79/2008, PPh Final terutang adalah Rp 2.000.000.000 (dibanding hanya Rp 600 juta saat periode diskon 3% 2015).',
    presetRegime: 'pph4_2_pmk191_2015_revaluasi',
    presetInput: {
      pph4_2: {
        nilaiBruto: 25000000000,
        objectType: 'sewa_tanah_bangunan',
        nilaiBukuFiskal: 5000000000,
        skemaRevaluasi: 'reguler_10_pmk79',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pmk191_2015RevaluasiRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPasar = Math.max(0, input.nilaiBruto);
    const nilaiBuku = Math.max(0, input.nilaiBukuFiskal ?? 0);
    const selisihLebih = Math.max(0, nilaiPasar - nilaiBuku);
    const skema = input.skemaRevaluasi ?? 'reguler_10_pmk79';

    let rate = 10;
    let skemaLabel = 'Tarif reguler permanen — PMK 79/PMK.03/2008 (10%)';
    if (skema === 'insentif_2015_3') {
      rate = 3;
      skemaLabel = 'Insentif khusus s.d. 31 Des 2015 — PMK 191/2015 (3%)';
    } else if (skema === 'insentif_h1_2016_4') {
      rate = 4;
      skemaLabel = 'Insentif khusus Jan–Jun 2016 — PMK 191/2015 (4%)';
    } else if (skema === 'insentif_h2_2016_6') {
      rate = 6;
      skemaLabel = 'Insentif khusus Jul–Des 2016 — PMK 191/2015 (6%)';
    }

    const pphFinal = Math.round((selisihLebih * rate) / 100);
    const steps: CalculationStep[] = [
      { label: 'Nilai pasar wajar aktiva tetap (hasil penilaian KJPP)', value: nilaiPasar },
      { label: 'Nilai sisa buku fiskal semula', value: -nilaiBuku, isNegative: true },
      { label: 'Selisih lebih penilaian kembali aktiva tetap (DPP PPh Final)', value: selisihLebih },
      { label: 'Tarif PPh Final Revaluasi', formula: skemaLabel, value: rate, format: 'percent' },
      {
        label: 'PPh Final Revaluasi Aktiva Tetap terutang',
        formula: `${formatRupiah(selisihLebih)} x ${formatPersen(rate)}`,
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Revaluasi Terutang',
      primaryTaxAmount: pphFinal,
      annualTaxLabel: 'Kenaikan Basis Penyusutan Fiskal',
      annualTaxAmount: selisihLebih,
      effectiveRatePercent: selisihLebih > 0 ? rate : 0,
      takeHomeOrNetLabel: 'Kenaikan Ekuitas Neto Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, selisihLebih - pphFinal),
      steps,
      notes: [
        'Apabila nilai sisa buku fiskal tidak diinput (Rp 0), nilai bruto dianggap langsung merupakan selisih lebih revaluasi.',
        'Berdasarkan Pasal 19 UU PPh jo. PMK 79/2008 dan PMK 233/2015, revaluasi untuk tujuan pajak saat ini memakai tarif reguler 10% dan melarang pengalihan aset sebelum masa manfaat berakhir (atau 10 tahun untuk tanah/bangunan) kecuali dengan sanksi tambahan.',
      ],
    };
  },
};
