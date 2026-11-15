import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_52_2017, SRC.PMK_205_2018, SRC.PMK_56_2021];

const regime: TaxRegime = {
  id: 'badan_pmk52_2017_merger',
  taxType: 'pph_badan',
  name: 'PMK 52/2017 stdd PMK 205/2018 & PMK 56/2021 (Penggunaan Nilai Buku Merger & Restrukturisasi)',
  shortName: '2017–Sekarang (Merger Nilai Buku vs Nilai Pasar)',
  legalBasis: 'Pasal 10 ayat (3) UU PPh jo. PMK 52/PMK.010/2017 stdd PMK 205/2018 & PMK 56/2021',
  effectivePeriod: '19 April 2017 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Nilai buku (Rp 0 saat merger) dengan persetujuan DJP',
  summary:
    'Secara prinsip pajak, pengalihan harta dalam rangka penggabungan (merger), peleburan, pemekaran, atau pengambilalihan usaha harus menggunakan Nilai Pasar sehingga selisih lebih di atas Nilai Sisa Buku Fiskal terutang PPh Badan 22%. Melalui PMK 52/2017 stdd PMK 205/2018 & PMK 56/2021, Wajib Pajak dapat menggunakan Nilai Buku (menangguhkan pajak Rp 0) atas persetujuan DJP.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pmk52-2017-merger',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Penggunaan Nilai Buku dalam Merger, Peleburan & Pemekaran Usaha: PMK 52/2017 stdd PMK 56/2021',
  legalBasis: 'Pasal 10 ayat (3) UU PPh jo. PMK 52/PMK.010/2017 stdd PMK 56/PMK.010/2021',
  effectiveDate: '19 April 2017 (Perubahan Kedua: 3 Juni 2021)',
  readMinutes: 5,
  summary:
    'Mengupas perbedaan beban PPh Badan antara pengalihan aset berdasarkan Nilai Pasar (taxable capital gain 22%) dan persetujuan Nilai Buku (tax-neutral restructuring).',
  sections: [
    {
      heading: 'Prinsip Nilai Pasar (Pasal 10(3) UU PPh) vs Pengecualian Nilai Buku',
      paragraphs: [
        'Pasal 10 ayat (3) UU PPh mensyaratkan agar pengalihan dan perolehan harta dalam penggabungan (merger), peleburan (konsolidasi), pemekaran (spin-off), atau pengambilalihan (akuisisi) dinilai berdasarkan harga pasar wajar. Konsekuensinya, keuntungan berupa selisih antara Nilai Pasar dan Nilai Sisa Buku Fiskal langsung terutang PPh Badan 22%.',
        'Namun untuk mendorong efisiensi korporasi, penawaran umum perdana (IPO), restrukturisasi BUMN/BUMD, hingga spin-off unit usaha syariah, PMK 52/PMK.010/2017 beserta perubahannya (PMK 205/2018 dan PMK 56/2021) mengizinkan penggunaan Nilai Sisa Buku Fiskal sehingga pengakuan keuntungan pengalihan aset ditangguhkan (PPh saat merger = Rp 0).',
      ],
    },
    {
      heading: 'Syarat Persetujuan DJP: Business Purpose Test & Larangan Pengalihan Harta',
      paragraphs: [
        'Penggunaan nilai buku tidak bersifat otomatis; Wajib Pajak harus mengajukan permohonan tertulis kepada Direktur Jenderal Pajak paling lama 6 bulan setelah tanggal efektif aksi korporasi serta melunasi seluruh utang pajak terkait.',
        'DJP mewajibkan uji tujuan bisnis (business purpose test) bahwa merger/pemekaran dilakukan untuk memperkuat struktur usaha, bukan semata-mata menghindari pajak (misalnya menyedot akumulasi rugi fiskal atau tidak menukar penyertaan dengan uang tunai melampaui ketentuan holding).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tanpa Persetujuan DJP (Default Nilai Pasar)',
    newHeader: 'Dengan Persetujuan Nilai Buku (PMK 52/2017 stdd PMK 56/2021)',
    rows: [
      {
        aspek: 'Dasar Penilaian Pengalihan Harta',
        aturanLama: 'Harga / Nilai Pasar Wajar (Fair Market Value)',
        aturanBaru: 'Nilai Sisa Buku Fiskal',
      },
      {
        aspek: 'PPh Badan saat Penggabungan / Pemekaran',
        aturanLama: '22% x (Nilai Pasar - Nilai Buku Fiskal)',
        aturanBaru: 'Rp 0 (Pengenaan pajak atas capital gain ditangguhkan)',
      },
    ],
  },
  caseExample: {
    title: 'Merger dua perusahaan manufaktur dengan Nilai Pasar aset Rp 50 M vs Nilai Buku Rp 30 M',
    scenario:
      'PT A menggabungkan diri ke PT B dengan nilai pasar wajar aset tetap & inventori Rp 50.000.000.000, sementara nilai sisa buku fiskalnya Rp 30.000.000.000 (selisih capital gain Rp 20 miliar). Jika tidak mengajukan persetujuan nilai buku, terutang PPh Badan 22% x Rp 20 M = Rp 4.400.000.000; dengan persetujuan nilai buku PMK 52/2017, PPh saat merger menjadi Rp 0.',
    presetRegime: 'badan_pmk52_2017_merger',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 0,
        penghasilanKenaPajak: 0,
        isTbk: false,
        nilaiPasarHartaMerger: 50000000000,
        nilaiBukuFiskalMerger: 30000000000,
        isPersetujuanNilaiBuku: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk52_2017MergerRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPasar = Math.max(0, input.nilaiPasarHartaMerger ?? 0);
    const nilaiBuku = Math.max(0, input.nilaiBukuFiskalMerger ?? 0);
    const isNilaiBuku = input.isPersetujuanNilaiBuku !== false;

    const selisihKeuntungan = Math.max(0, nilaiPasar - nilaiBuku);
    const pphNilaiPasar = Math.round(selisihKeuntungan * 0.22);
    const pphSaatMerger = isNilaiBuku ? 0 : pphNilaiPasar;

    const steps: CalculationStep[] = [
      { label: 'Nilai pasar wajar harta yang dialihkan', value: nilaiPasar },
      { label: 'Nilai sisa buku fiskal harta', value: nilaiBuku },
      { label: 'Potensi keuntungan pengalihan harta (Nilai Pasar - Nilai Buku)', value: selisihKeuntungan },
      {
        label: isNilaiBuku
          ? 'PPh Badan saat merger (Disetujui Nilai Buku PMK 52/2017 — Ditangguhkan)'
          : 'PPh Badan terutang (22% Nilai Pasar tanpa persetujuan Nilai Buku)',
        value: pphSaatMerger,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isNilaiBuku
        ? 'PPh Badan Saat Merger (Nilai Buku)'
        : 'PPh Badan Terutang (Nilai Pasar 22%)',
      primaryTaxAmount: pphSaatMerger,
      annualTaxLabel: isNilaiBuku
        ? 'Pajak yang Ditangguhkan vs Skema Nilai Pasar'
        : 'Potensi Penghematan jika Pakai Nilai Buku',
      annualTaxAmount: pphNilaiPasar,
      effectiveRatePercent:
        nilaiPasar > 0 ? (pphSaatMerger / nilaiPasar) * 100 : 0,
      takeHomeOrNetLabel: isNilaiBuku
        ? 'Nilai Aset Tercatat pada Perusahaan Penerima (Buku Fiskal)'
        : 'Nilai Bersih Pengalihan Setelah PPh Badan',
      takeHomeOrNetAmount: isNilaiBuku ? nilaiBuku : Math.max(0, nilaiPasar - pphSaatMerger),
      steps,
      notes: [
        isNilaiBuku
          ? `Dengan persetujuan penggunaan Nilai Buku dari DJP (PMK 52/2017 stdd PMK 56/2021), selisih nilai sebesar ${formatRupiah(selisihKeuntungan)} tidak dikenai PPh saat penggabungan sehingga menjaga kas perusahaan sebesar ${formatRupiah(pphNilaiPasar)}.`
          : `Tanpa persetujuan Nilai Buku, selisih lebih ${formatRupiah(selisihKeuntungan)} terutang PPh Badan ${formatPersen(22)} sebesar ${formatRupiah(pphSaatMerger)} sesuai Pasal 10 ayat (3) UU PPh.`,
        'Wajib memenuhi Business Purpose Test dan mengajukan permohonan paling lambat 6 bulan setelah tanggal efektif merger/pemekaran beserta pelunasan utang pajak dan bukti tidak ada kompensasi rugi fiktif.',
      ],
    };
  },
};
