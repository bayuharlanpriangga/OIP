import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_132_2000, SRC.PP_42_1994, SRC.PP_15_2009];

const regime: TaxRegime = {
  id: 'pph4_2_undian_koperasi',
  taxType: 'pph4_2',
  name: 'PP 132/2000 (Hadiah Undian 25%) & PP 15/2009 (Bunga Simpanan Koperasi)',
  shortName: '2001–Kini (Hadiah Undian 25% & Koperasi)',
  legalBasis: 'PP Nomor 132 Tahun 2000 (mencabut PP 42/1994) & PP Nomor 15 Tahun 2009',
  effectivePeriod: '1 Januari 2001 – Sekarang (Koperasi sejak 1 Januari 2009)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Hadiah undian (25%) & bunga simpanan koperasi (0%/10%)',
  summary:
    'PPh Final atas dua objek spesifik masyarakat umum: (1) Hadiah undian dengan nama dan bentuk apa pun sebesar 25% Final dari nilai bruto hadiah atau nilai pasar (PP 132/2000, menaikkan tarif lama 20% PP 42/1994); dan (2) Bunga simpanan anggota koperasi OP sebesar 0% jika <= Rp 240.000/bulan atau 10% Final dari seluruh bruto jika > Rp 240.000/bulan (PP 15/2009).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-undian-koperasi',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final Hadiah Undian 25% (PP 132/2000) dan Bunga Simpanan Koperasi (PP 15/2009)',
  legalBasis: 'PP Nomor 132 Tahun 2000, PP Nomor 42 Tahun 1994, & PP Nomor 15 Tahun 2009',
  effectiveDate: '1 Januari 2001 (Koperasi 1 Januari 2009)',
  readMinutes: 4,
  summary:
    'Memisahkan pemotongan pajak hadiah undian (25% Final tanpa mengenal PTKP) dari hadiah perlombaan/penghargaan (PPh 21/23), serta aturan batas bebas Rp 240.000/bulan pada bunga simpanan anggota koperasi orang pribadi.',
  sections: [
    {
      heading: 'Hadiah Undian 25% Final (PP 132/2000 vs PP 42/1994)',
      paragraphs: [
        'Pada 1995–2000 berdasarkan PP Nomor 42 Tahun 1994, hadiah undian sempat dikenai tarif 20% Final. Sejak 1 Januari 2001 melalui PP Nomor 132 Tahun 2000, tarif PPh Final hadiah undian dinaikkan menjadi 25% dari jumlah bruto hadiah uang atau nilai pasar hadiah barang/kendaraan/rumah yang dipotong langsung oleh penyelenggara undian sebelum diserahkan.',
        'Perlu dibedakan: hadiah yang diundi (lottery/sweepstake) selalu terkena 25% PPh 4(2) Final, sedangkan hadiah perlombaan/keahlian atau penghargaan agen dikenai PPh 21 (bila OP), PPh 23 15% (bila Badan), atau PPh 26 20% (bila WPLN).',
      ],
    },
    {
      heading: 'Aturan "All-or-Nothing" Rp 240.000/bulan pada Simpanan Koperasi (PP 15/2009)',
      paragraphs: [
        'Berdasarkan PP Nomor 15 Tahun 2009, bunga simpanan yang dibayarkan oleh koperasi didirikan di Indonesia kepada anggota orang pribadi dikenai PPh Final 0% apabila jumlah bunganya sampai dengan Rp 240.000 dalam satu bulan. Namun jika melebihi Rp 240.000 pada bulan tersebut, tarif 10% Final langsung dikenakan atas SELURUH jumlah bruto bunga (bukan hanya selisih di atas Rp 240.000).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 42/1994 / Tanpa Ambang Batas',
    newHeader: 'PP 132/2000 & PP 15/2009 (Berlaku Kini)',
    rows: [
      {
        aspek: 'Tarif hadiah undian (uang atau barang)',
        aturanLama: '20% Final (PP 42/1994, 1995–2000)',
        aturanBaru: '25% Final dari bruto / nilai pasar (PP 132/2000)',
      },
      {
        aspek: 'Bunga simpanan koperasi anggota OP <= Rp 240.000/bln',
        aturanLama: 'Belum dipisahkan khusus dari bunga umum',
        aturanBaru: '0% Final (PP 15/2009)',
      },
      {
        aspek: 'Bunga simpanan koperasi anggota OP > Rp 240.000/bln',
        aturanLama: 'Tarif umum',
        aturanBaru: '10% Final dari seluruh jumlah bruto bunga yang dibayarkan',
      },
    ],
  },
  caseExample: {
    title: 'Hadiah undian uang tunai Rp 50 juta dipotong PPh Final 25%',
    scenario:
      'Peserta undian berhadiah memenangkan hadiah utama senilai Rp 50.000.000. Penyelenggara memotong PPh Final Pasal 4(2) sebesar 25% = Rp 12.500.000.',
    presetRegime: 'pph4_2_undian_koperasi',
    presetInput: {
      pph4_2: {
        nilaiBruto: 50000000,
        objectType: 'sewa_tanah_bangunan',
        undianAtauKoperasi: 'hadiah_undian',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2UndianKoperasiRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const mode = input.undianAtauKoperasi ?? 'hadiah_undian';

    let rate = 25;
    let label = 'Tarif PPh Final Hadiah Undian PP 132/2000 (25%)';
    if (mode === 'simpanan_koperasi') {
      if (bruto <= 240000) {
        rate = 0;
        label = '0% Final — Bunga simpanan koperasi <= Rp 240.000/bulan (PP 15/2009)';
      } else {
        rate = 10;
        label = '10% Final — Bunga simpanan koperasi > Rp 240.000/bulan atas seluruh bruto (PP 15/2009)';
      }
    }

    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      {
        label: mode === 'hadiah_undian' ? 'Nilai bruto / nilai pasar hadiah undian' : 'Bunga simpanan koperasi per bulan',
        value: bruto,
      },
      { label: 'Ketentuan tarif PPh Final', formula: label, value: rate, format: 'percent' },
      {
        label: mode === 'hadiah_undian' ? 'PPh Final Hadiah Undian dipotong penyelenggara' : 'PPh Final Bunga Simpanan dipotong koperasi',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Nilai bersih diterima pemenang / anggota', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: mode === 'hadiah_undian' ? 'PPh Final Hadiah Undian (25%)' : 'PPh Final Simpanan Koperasi',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        mode === 'hadiah_undian'
          ? 'Berlaku tarif 25% Final sejak 1 Januari 2001 (menggantikan tarif 20% era PP 42/1994). Tidak ada perbedaan tarif bagi penerima yang ber-NPWP maupun tidak ber-NPWP.'
          : 'Berdasarkan PP 15/2009, apabila bunga simpanan dalam sebulan melebihi Rp 240.000, tarif 10% berlaku penuh atas keseluruhan jumlah bunga (bukan hanya atas selisih di atas Rp 240.000).',
      ],
    };
  },
};
