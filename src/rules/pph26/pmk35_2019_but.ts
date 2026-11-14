import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_35_2019, SRC.PMK_112_2025, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph26_pmk35_2019_but',
  taxType: 'pph26',
  name: 'PMK 35/PMK.03/2019 (Penentuan Bentuk Usaha Tetap / BUT & Time Test 60 Hari)',
  shortName: '2019–Sekarang (Penentuan BUT PMK 35/2019)',
  legalBasis: 'PMK Nomor 35/PMK.03/2019 jo. Pasal 2 ayat (5) UU PPh',
  effectivePeriod: '1 April 2019 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji time test jasa > 60 hari & pemicu BUT bagi WPLN',
  summary:
    'Kriteria penentuan Bentuk Usaha Tetap (BUT) bagi Subjek Pajak Luar Negeri di Indonesia: pemberian jasa oleh pegawai atau pihak lain di Indonesia melebihi 60 hari dalam jangka waktu 12 bulan (atau sesuai time test P3B) memicu status BUT sehingga penghasilannya dipajaki secara neto layaknya PPh Badan + Branch Profit Tax (bukan sekadar PPh 26 final 20% bruto).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pmk35-2019-but',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Penentuan Bentuk Usaha Tetap (BUT) menurut PMK 35/PMK.03/2019: Time Test 60 Hari & Implikasinya',
  legalBasis: 'PMK Nomor 35/PMK.03/2019',
  effectiveDate: '1 April 2019',
  readMinutes: 5,
  summary:
    'Mengulas ambang batas keberadaan fisik dan time test pemberian jasa > 60 hari dalam 12 bulan di PMK 35/2019 serta perbandingan beban pajaknya antara non-BUT (PPh 26 / P3B) vs BUT (PPh Badan + BPT).',
  sections: [
    {
      heading: 'Ambang waktu 60 hari menurut UU PPh vs time test pada P3B',
      paragraphs: [
        'Berdasarkan PMK 35/PMK.03/2019, bentuk usaha tetap meliputi tempat kedudukan manajemen, cabang, kantor perwakilan, gedung pabrik, proyek konstruksi/instalasi/perakitan, maupun pemberian jasa dalam bentuk apa pun oleh pegawai atau orang lain sepanjang dilakukan lebih dari 60 hari dalam jangka waktu 12 bulan.',
        'Jika WPLN berasal dari negara mitra P3B dan melampirkan SKD valid, time test jasa mengikuti ketentuan dalam masing-masing P3B (umumnya 60, 90, 120, atau 183 hari) dan turut diawasi terhadap praktik pemecahan durasi kontrak (anti-fragmentation PMK 112/2025). Bila melewati ambang waktu sehingga menjadi BUT, entitas asing wajib ber-NPWP BUT dan dikenai PPh Badan 22% atas laba neto ditambah Branch Profit Tax (Pasal 26 ayat 4).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Non-BUT (Hari Kerja ≤ Time Test)',
    newHeader: 'Terbentuk BUT (Hari Kerja > 60 Hari / Melewati Time Test)',
    rows: [
      {
        aspek: 'Kewajiban NPWP & pelaporan SPT',
        aturanLama: 'Cukup dipotong PPh 26 oleh pembayar Indonesia (atau 0% P3B)',
        aturanBaru: 'Wajib ber-NPWP BUT, pembukuan, & lapor SPT Tahunan Badan',
      },
      {
        aspek: 'Basis pemajakan',
        aturanLama: 'Bruto × 20% (atau tarif P3B)',
        aturanBaru: 'Neto fiskal × 22% PPh Badan + Branch Profit Tax atas sisa laba',
      },
    ],
  },
  caseExample: {
    title: 'Kontrak jasa teknik WPLN 75 hari di Indonesia senilai Rp 2.000.000.000',
    scenario:
      'Konsultan korporasi asing mengirim tim ahli bekerja di Indonesia selama 75 hari dalam 12 bulan (melewati batas 60 hari PMK 35/2019 tanpa P3B lebih panjang) atas kontrak Rp 2 miliar.',
    presetRegime: 'pph26_pmk35_2019_but',
    presetInput: {
      pph26: {
        nilaiBruto: 2000000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 0,
        nilaiPenyerahanJasaBut: 2000000000,
        hariDiIndonesia: 75,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pmk35_2019ButRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiPenyerahanJasaBut ?? input.nilaiBruto);
    const hari = Math.max(0, Math.round(input.hariDiIndonesia ?? 0));
    const memicuBut = hari > 60;

    // Jika memicu BUT (asumsi ilustrasi margin neto 30% + PPh Badan 22% + BPT 20% atas sisa) atau non-BUT PPh 26 20%/P3B
    const estimasiLabaNetoBut = Math.round(nilai * 0.3);
    const pphBadanBut = Math.round(estimasiLabaNetoBut * 0.22);
    const sisaSetelahBadan = Math.max(0, estimasiLabaNetoBut - pphBadanBut);
    const bptRate = input.hasSkdP3b ? (input.tarifP3bPersen ?? 10) : 20;
    const bptBut = Math.round((sisaSetelahBadan * bptRate) / 100);
    const totalPajakBut = pphBadanBut + bptBut;

    const pph26NonBut = input.hasSkdP3b
      ? 0 // jasa bisnis di bawah time test tanpa BUT hak pemajakan di negara domisili
      : Math.round(nilai * 0.2);

    const taxDisplay = memicuBut ? totalPajakBut : pph26NonBut;

    const steps: CalculationStep[] = [
      { label: 'Nilai kontrak penyerahan jasa WPLN di Indonesia', value: nilai },
      {
        label: `Durasi pemberian jasa: ${hari} hari (Ambang batas PMK 35/2019 = 60 hari)`,
        value: hari,
      },
      ...(memicuBut
        ? [
            { label: 'Estimasi laba neto fiskal BUT (ilustrasi 30% margin)', value: estimasiLabaNetoBut },
            { label: 'PPh Badan BUT (22% atas laba neto)', value: pphBadanBut },
            { label: `Branch Profit Tax Pasal 26(4) (${bptRate}%)`, value: bptBut },
            { label: 'Total beban pajak skema BUT (PPh Badan + BPT)', value: totalPajakBut, isHighlight: true },
          ]
        : [
            {
              label: input.hasSkdP3b
                ? 'Non-BUT + SKD P3B (Article 7 Business Profits -> 0% di Indonesia)'
                : 'Non-BUT tanpa SKD (PPh 26 Final 20% Bruto)',
              value: pph26NonBut,
              isHighlight: true,
            },
          ]),
    ];

    return {
      regime,
      primaryTaxLabel: memicuBut
        ? 'Total Beban Pajak BUT (PPh Badan + BPT)'
        : input.hasSkdP3b
          ? 'PPh 26 Non-BUT Ber-SKD (0%)'
          : 'PPh 26 Non-BUT Tanpa SKD (20%)',
      primaryTaxAmount: taxDisplay,
      effectiveRatePercent: nilai > 0 ? (taxDisplay / nilai) * 100 : 0,
      takeHomeOrNetLabel: memicuBut ? 'Status: Terbentuk BUT Wajib NPWP' : 'Nilai Bersih Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilai - taxDisplay),
      steps,
      notes: [
        memicuBut
          ? `Durasi ${hari} hari melampaui ambang 60 hari dalam 12 bulan (PMK 35/2019) sehingga membentuk BUT — perhitungan memakai estimasi laba neto 30% dengan PPh Badan 22% + BPT ${bptRate}%.`
          : `Durasi ${hari} hari tidak melampaui batas 60 hari PMK 35/2019 sehingga belum memicu BUT (jika ada SKD P3B umumnya dibebaskan sesuai Article 7; tanpa SKD dipotong PPh 26 20%).`,
      ],
    };
  },
};
