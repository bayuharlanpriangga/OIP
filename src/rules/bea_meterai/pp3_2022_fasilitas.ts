import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_3_2022, SRC.UU_10_2020, SRC.PMK_78_2024];

const regime: TaxRegime = {
  id: 'meterai_pp3_2022',
  taxType: 'bea_meterai',
  name: 'PP 3/2022 (Fasilitas Pembebasan Bea Meterai — 0% / Rp 0)',
  shortName: '2022–Kini (PP 3/2022 Bebas Meterai)',
  legalBasis: 'PP Nomor 3 Tahun 2022 tentang Fasilitas Pembebasan Bea Meterai jo. Pasal 22 UU 10/2020',
  effectivePeriod: '12 Januari 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pembebasan Rp 0 (bencana, sosial/keagamaan, & program pemerintah)',
  summary:
    'Pelaksanaan Pasal 22 UU 10/2020: membebaskan Bea Meterai Rp 10.000 menjadi Rp 0 untuk empat kelompok dokumen strategis — pengalihan hak tanah/bangunan bencana alam, kegiatan semata-mata keagamaan & sosial, akad/dokumen program pemerintah atau moneter, serta perjanjian internasional.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bea-meterai-pp3-2022',
  taxType: 'bea_meterai',
  taxTypeLabel: 'Bea Meterai',
  title: 'PP Nomor 3 Tahun 2022: Empat Kategori Dokumen yang Dibebaskan dari Bea Meterai',
  legalBasis: 'PP Nomor 3 Tahun 2022 Pasal 2–6 jo. Pasal 22 UU Nomor 10 Tahun 2020',
  effectiveDate: '12 Januari 2022',
  readMinutes: 4,
  summary:
    'Tidak semua perjanjian bernilai > Rp 5 juta wajib membayar Rp 10.000; PP 3/2022 merinci dokumen kemanusiaan, sosial/keagamaan, perjanjian perdagangan syariah tertentu, dan program pemerintah yang dibebaskan dari pengenaan Bea Meterai.',
  sections: [
    {
      heading: 'Empat kelompok fasilitas pembebasan Bea Meterai (PP 3/2022)',
      paragraphs: [
        'Berdasarkan Pasal 2 PP Nomor 3 Tahun 2022, fasilitas pembebasan dari pengenaan Bea Meterai (Rp 0) berlaku atas: (1) dokumen yang menyatakan pengalihan hak atas tanah dan/atau bangunan dalam rangka mempercepat penanganan dan pemulihan kondisi sosial ekonomi daerah terdampak bencana alam yang ditetapkan sebagai bencana nasional;',
        '(2) dokumen yang semata-mata digunakan untuk melaksanakan kegiatan bersifat keagamaan dan/atau sosial yang tidak bersifat komersial; (3) dokumen dalam rangka mendorong atau melaksanakan program pemerintah serta kebijakan lembaga berwenang di bidang moneter atau jasa keuangan (seperti akad pembiayaan/transaksi instrumen operasi moneter syariah/perbankan syariah dan instrumen pasar uang); dan (4) dokumen terkait perjanjian internasional berdasarkan asas timbal balik.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Dokumen Komersial Umum UU 10/2020',
    newHeader: 'Dokumen Fasilitas PP Nomor 3 Tahun 2022',
    rows: [
      {
        aspek: 'Akta pengalihan properti di zona bencana nasional',
        aturanLama: 'Rp 10.000 per dokumen asli',
        aturanBaru: 'Dibebaskan 100% (Rp 0)',
      },
      {
        aspek: 'Dokumen hibah/kegiatan murni sosial & keagamaan',
        aturanLama: 'Rp 10.000 per dokumen asli (> Rp 5 juta)',
        aturanBaru: 'Dibebaskan 100% (Rp 0)',
      },
      {
        aspek: 'Instrumen kebijakan moneter / program pemerintah tertentu',
        aturanLama: 'Rp 10.000 per dokumen transaksi',
        aturanBaru: 'Dibebaskan 100% (Rp 0) sepanjang memenuhi syarat PP 3/2022',
      },
    ],
  },
  caseExample: {
    title: 'Akta wakaf / penyaluran dana sosial keagamaan Rp 250 juta bebas Bea Meterai (PP 3/2022)',
    scenario:
      'Lembaga sosial/keagamaan menerbitkan 2 dokumen asli serah terima bantuan non-komersial senilai Rp 250.000.000. Sesuai Pasal 4 PP 3/2022, dokumen tersebut mendapat pembebasan Bea Meterai 100% (Rp 0).',
    presetRegime: 'meterai_pp3_2022',
    presetInput: {
      bea_meterai: {
        nilaiDokumen: 250000000,
        jumlahDokumen: 2,
        isBebasMeteraiPp3: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const beaMeteraiPp3_2022Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));
    const isTaxable = nilaiDokumen > 5000000;
    const isBebas = Boolean(input.isBebasMeteraiPp3 ?? true);

    const normalPerDoc = isTaxable ? 10000 : 0;
    const totalNormal = normalPerDoc * jumlahDokumen;
    const totalDibayar = isBebas ? 0 : totalNormal;
    const penghematan = Math.max(0, totalNormal - totalDibayar);
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalDibayar / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang dalam dokumen', value: nilaiDokumen },
      { label: `Bea Meterai normal UU 10/2020 (${jumlahDokumen} dokumen)`, value: totalNormal },
      ...(isBebas && totalNormal > 0
        ? [
            {
              label: 'Fasilitas pembebasan PP Nomor 3 Tahun 2022 (100%)',
              value: -penghematan,
              isNegative: true,
            },
          ]
        : []),
      {
        label: 'Bea Meterai wajib dilunasi',
        formula: isBebas ? 'Dibebaskan berdasarkan PP 3/2022 -> Rp 0' : `${formatRupiah(normalPerDoc)} x ${jumlahDokumen} dok`,
        value: totalDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isBebas ? 'Bea Meterai Setelah Pembebasan PP 3/2022' : 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalDibayar,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: isBebas ? 'Penghematan Fasilitas PP 3/2022' : 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: isBebas ? penghematan : normalPerDoc,
      steps,
      notes: [
        isBebas
          ? 'Berdasarkan PP Nomor 3 Tahun 2022, dokumen yang termasuk kriteria bencana, sosial/keagamaan, atau program pemerintah/moneter dibebaskan dari pengenaan Bea Meterai (tanpa perlu SKB khusus untuk kategori sosial/keagamaan & bencana sesuai ketentuan Pasal 3–5).'
          : 'Karena fasilitas pembebasan PP 3/2022 tidak dipilih/tidak terpenuhi, berlaku tarif normal Rp 10.000 per dokumen apabila nominal > Rp 5 juta.',
      ],
    };
  },
};
