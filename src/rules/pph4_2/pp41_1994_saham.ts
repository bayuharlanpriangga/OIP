import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_41_1994, SRC.PP_14_1997, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph4_2_saham_pp41_1994',
  taxType: 'pph4_2',
  name: 'PP 41/1994 jo. PP 14/1997 (Penjualan Saham di Bursa Efek)',
  shortName: '1995–Kini (Transaksi Saham Bursa 0,1%)',
  legalBasis: 'PP Nomor 41 Tahun 1994 stdd PP Nomor 14 Tahun 1997 (Pasal 4 ayat 2 huruf c UU PPh)',
  effectivePeriod: '1 Januari 1995 – Sekarang (Saham Pendiri +0,5% mulai 29 Mei 1997)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Jual saham di BEI (0,1% & +0,5% pendiri)',
  summary:
    'Aturan yang berlaku sejak 1995 hingga kini atas penjualan saham di bursa efek Indonesia: 0,1% Final dari jumlah bruto nilai transaksi penjualan (dipotong oleh bursa/sekuritas), ditambah pungutan tambahan 0,5% dari nilai saham perusahaan pada saat IPO atau 30 Des 1996 bagi saham pendiri (PP 14/1997).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp41-1994-saham',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Pajak Penjualan Saham di Bursa Efek (BEI): PP 41/1994 jo. PP 14/1997 (0,1% + 0,5% Pendiri)',
  legalBasis: 'PP Nomor 41 Tahun 1994 jo. PP Nomor 14 Tahun 1997',
  effectiveDate: '1 Januari 1995 (Revisi Saham Pendiri 29 Mei 1997)',
  readMinutes: 4,
  summary:
    'Berbeda dari pajak capital gain umum, penjualan saham perusahaan terbuka di bursa efek dikenai PPh Final 0,1% langsung atas nilai bruto jual oleh BEI, ditambah 0,5% khusus bagi pemegang saham pendiri.',
  sections: [
    {
      heading: 'Mengapa penjualan saham bursa memakai tarif final 0,1% bruto?',
      paragraphs: [
        'Menghitung capital gain riil di pasar sekunder secara harian sangat rumit bagi jutaan investor ritel. Sejak 1 Januari 1995, PP Nomor 41 Tahun 1994 menetapkan PPh Final sebesar 0,1% langsung dari jumlah bruto nilai transaksi penjualan saham tanpa memperhitungkan apakah investor untung maupun rugi.',
        'Pemotongan dilakukan otomatis oleh penyelenggara bursa efek melalui perantara pedagang efek (sekuritas) pada saat penyelesaian transaksi jual (settlement), sehingga investor ritel menerima hasil penjualan yang sudah lunas pajaknya.',
      ],
    },
    {
      heading: 'Tambahan 0,5% atas Saham Pendiri (PP 14/1997)',
      paragraphs: [
        'Pada PP 41/1994 awal, tambahan PPh saham pendiri ditetapkan 5% saat saham dijual; namun untuk mendorong minat perusahaan melantai (IPO) di bursa, PP Nomor 14 Tahun 1997 menurunkannya secara drastis menjadi 0,5% final dari nilai saham perusahaan saat penawaran umum perdana (IPO) atau per 30 Desember 1996. Jika tambahan 0,5% ini dilunasi langsung oleh emiten setelah IPO, penjualan saham pendiri selanjutnya hanya terkena 0,1% biasa.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 41/1994 (1995–Mei 1997)',
    newHeader: 'PP 14/1997 (Mei 1997–Sekarang)',
    rows: [
      {
        aspek: 'Transaksi penjualan saham reguler di bursa',
        aturanLama: '0,1% Final dari nilai bruto transaksi jual',
        aturanBaru: 'Tetap 0,1% Final dari nilai bruto transaksi jual',
      },
      {
        aspek: 'Tambahan PPh Final khusus Saham Pendiri',
        aturanLama: '5% dari nilai bruto transaksi penjualan saat dijual',
        aturanBaru: '0,5% final dari nilai saham saat IPO / saat penyetoran emiten',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan portofolio saham reguler di BEI senilai Rp 200 juta',
    scenario:
      'Investor menjual saham emiten tercatat di BEI dengan nilai transaksi jual bruto Rp 200.000.000 (bukan saham pendiri). Sekuritas memotong PPh Final 0,1% sebesar Rp 200.000.',
    presetRegime: 'pph4_2_saham_pp41_1994',
    presetInput: {
      pph4_2: {
        nilaiBruto: 200000000,
        objectType: 'sewa_tanah_bangunan',
        isSahamPendiri: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2SahamPp41_1994Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiJual = Math.max(0, input.nilaiBruto);
    const isPendiri = Boolean(input.isSahamPendiri);
    const rateReguler = 0.1;
    const ratePendiri = isPendiri ? 0.5 : 0;
    const totalRate = rateReguler + ratePendiri;

    const taxReguler = Math.round((nilaiJual * rateReguler) / 100);
    const taxPendiri = Math.round((nilaiJual * ratePendiri) / 100);
    const totalTax = taxReguler + taxPendiri;
    const netReceived = Math.max(0, nilaiJual - totalTax);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi penjualan saham di bursa (BEI)', value: nilaiJual },
      { label: 'PPh Final penjualan saham reguler (0,1%)', formula: `${formatRupiah(nilaiJual)} x 0,1%`, value: taxReguler },
      ...(isPendiri
        ? [
            {
              label: 'Tambahan PPh Final Saham Pendiri PP 14/1997 (0,5%)',
              formula: `${formatRupiah(nilaiJual)} x 0,5% (bila belum dilunasi saat IPO)`,
              value: taxPendiri,
            },
          ]
        : []),
      { label: 'Total PPh Final penjualan saham bursa', value: totalTax, isHighlight: true },
      { label: 'Dana bersih diterima penjual (sebelum broker fee)', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Penjualan Saham Bursa',
      primaryTaxAmount: totalTax,
      effectiveRatePercent: totalRate,
      takeHomeOrNetLabel: 'Hasil Penjualan Saham Setelah PPh Final',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        isPendiri
          ? 'Tambahan 0,5% atas saham pendiri berlaku apabila emiten belum melunasi PPh Final 0,5% paling lambat 1 bulan setelah saham diperdagangkan di bursa/IPO (basis nilai saat IPO atau 30 Des 1996).'
          : 'PPh Final 0,1% hanya berlaku untuk penjualan saham di bursa efek Indonesia; pengalihan saham perusahaan tertutup (non-listed) dikenai PPh umum atas capital gain.',
      ],
    };
  },
};
