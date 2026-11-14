import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

// Dicabut secara resmi oleh Pasal 17 UU Nomor 13 Tahun 1985; merujuk ke UU 13/1985 & UU 10/2020 pada arsip JDIH Kemenkeu
const sources = [SRC.UU_13_1985, SRC.UU_10_2020];

const regime: TaxRegime = {
  id: 'meterai_zegel1921',
  taxType: 'bea_meterai',
  name: 'Zegelverordening 1921 / Aturan Bea Meterai 1921 (Stbl. 1921 No. 498)',
  shortName: '1921–1985 (Zegelverordening 1921)',
  legalBasis: 'Aturan Bea Meterai 1921 (Zegelverordening 1921, Stbl. 1921 No. 498 — Dicabut Pasal 17 UU 13/1985)',
  effectivePeriod: '1921 – 31 Desember 1985',
  isCurrent: false,
  summary:
    'Ketentuan Bea Meterai warisan kolonial yang berlaku lebih dari enam dekade hingga akhir 1985: terdiri atas 167 pasal dengan meterai umum/tetap, meterai luar biasa, serta meterai sebanding (proporsional 0,1%–0,5%) atas surat berharga, kredit bank, dan perjanjian bernilai besar sebelum disederhanakan UU 13/1985.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-zegel-1921',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'Zegelverordening 1921: Bea Meterai Proporsional Era Pra-Reformasi Perpajakan (1921–1985)',
  legalBasis: 'Aturan Bea Meterai 1921 (Stbl. 1921 No. 498) jo. Pasal 17 UU Nomor 13 Tahun 1985',
  effectiveDate: '1921 – 31 Desember 1985',
  readMinutes: 4,
  summary:
    'Mengulas sistem Bea Meterai sebelum reformasi 1985: mengapa tarif proporsional (sebanding) dalam Aturan Bea Meterai 1921 dihapus dan diganti tarif tetap Rp 500 & Rp 1.000.',
  sections: [
    {
      heading: 'Struktur 167 pasal & meterai sebanding (proporsional) dalam Zegelverordening 1921',
      paragraphs: [
        'Sebelum UU Nomor 13 Tahun 1985 berlaku pada 1 Januari 1986, dasar hukum Bea Meterai di Indonesia adalah Aturan Bea Meterai 1921 (Zegelverordening 1921, Staatsblad 1921 Nomor 498) beserta puluhan peraturan perubahannya pasca-kemerdekaan. Peraturan ini sangat kompleks dengan ratusan objek dokumen yang terbagi atas meterai umum tetap, meterai menurut ukuran kertas, dan meterai sebanding (proporsional).',
        'Untuk dokumen tertentu seperti pengakuan utang/kredit, wesel, obligasi, dan modal pendirian perseroan, Aturan Bea Meterai 1921 pernah mengenakan tarif sebanding berdasarkan persentase nilai nominal (umumnya 0,1% atau 1 permil hingga 0,5%). Beban proporsional yang memberatkan dunia usaha tersebut akhirnya dicabut sepenuhnya melalui Pasal 17 UU 13/1985.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Zegelverordening 1921 (s.d. 1985)',
    newHeader: 'UU 13/1985 (1986–1995) & UU 10/2020 (Kini)',
    rows: [
      {
        aspek: 'Mekanisme tarif atas dokumen utang/perjanjian besar',
        aturanLama: 'Kombinasi meterai tetap & sebanding (proporsional ~0,1%–0,5%)',
        aturanBaru: 'Sepenuhnya tarif tetap per dokumen (Rp 500/1rb di 1986 -> Rp 10rb kini)',
      },
      {
        aspek: 'Jumlah objek dan kompleksitas pasal',
        aturanLama: '167 pasal dengan ragam tarif & kertas bermeterai',
        aturanBaru: 'Diringkas menjadi 2 lapis (UU 13/1985) lalu tarif tunggal (UU 10/2020)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi meterai sebanding 0,1% (1 permil) atas dokumen kredit/efek Rp 10 juta',
    scenario:
      'Membandingkan dokumen bernilai Rp 10.000.000 dengan simulasi tarif proporsional 0,1% (1 permil) era Zegelverordening 1921 (= Rp 10.000 per dokumen) vs tarif tetap Rp 1.000 saat reformasi UU 13/1985.',
    presetRegime: 'meterai_zegel1921',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 10000000,
        jumlahDokumen: 1,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiZegel1921Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));
    // Simulasi tarif sebanding 0,1% (1 permil) dokumen berharga / pengakuan utang era Zegelverordening 1921 (min Rp 500 jika nominal > 0)
    const ratePersen = 0.1;
    const perDokumen = nilaiDokumen > 0 ? Math.max(500, Math.round((nilaiDokumen * ratePersen) / 100)) : 0;
    const total = perDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (total / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal transaksi / kredit dalam dokumen', value: nilaiDokumen },
      {
        label: 'Simulasi tarif meterai sebanding (1 permil / 0,1%, min Rp 500)',
        formula: nilaiDokumen > 0 ? `${formatRupiah(nilaiDokumen)} x ${formatPersen(ratePersen)}` : 'Nominal Rp 0',
        value: perDokumen,
      },
      {
        label: `Total Bea Meterai Zegelverordening 1921 (${jumlahDokumen} dokumen)`,
        formula: `${formatRupiah(perDokumen)} x ${jumlahDokumen} dok`,
        value: total,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Meterai (Simulasi Sebanding 1921)',
      primaryTaxAmount: total,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: perDokumen,
      steps,
      notes: [
        'Zegelverordening 1921 mengenal baik meterai tetap (misalnya Rp 25–Rp 500 pada penyesuaian tahun 1960–1985 untuk kuitansi/akta) maupun meterai sebanding (0,1% s.d. 0,5% untuk efek/kredit/modal).',
        'Pasal 17 UU Nomor 13 Tahun 1985 mencabut Aturan Bea Meterai 1921 dan mengganti seluruh sistem proporsional dengan tarif tetap sederhana mulai 1 Januari 1986.',
      ],
    };
  },
};
