import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_82_2009, SRC.PMK_258_2008, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph26_pmk82_2009_harta',
  taxType: 'pph26',
  name: 'PMK 82/PMK.03/2009 (PPh 26 Penjualan Harta di Indonesia oleh WPLN — 5%)',
  shortName: '2009–Kini (PMK 82/2009 Pengalihan Harta)',
  legalBasis: 'Pasal 26 ayat (2) UU PPh jo. PMK Nomor 82/PMK.03/2009',
  effectivePeriod: '1 Januari 2009 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Penjualan harta > Rp 10 juta di Indonesia oleh WPLN',
  summary:
    'Pemotongan PPh Pasal 26 Final sebesar 20% atas perkiraan penghasilan neto 25% (= 5% efektif dari harga jual) atas penjualan/pengalihan harta di Indonesia oleh WPLN non-BUT (seperti perhiasan mewah, emas, barang seni, mobil mewah, dan kapal pesiar bernilai > Rp 10 juta).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pmk82-2009-harta',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'PMK 82/PMK.03/2009: Pajak 5% atas Penjualan Harta di Indonesia oleh Wajib Pajak Luar Negeri',
  legalBasis: 'Pasal 26 ayat (2) UU PPh jo. PMK Nomor 82/PMK.03/2009',
  effectiveDate: '1 Januari 2009',
  readMinutes: 4,
  summary:
    'Menjelaskan bagaimana penghasilan WPLN dari menjual harta bergerak bernilai di atas Rp 10 juta di Indonesia dikenai pemotongan PPh 26 dengan tarif efektif 5% (norma neto 25% × 20%), beserta pengecualian melalui P3B.',
  sections: [
    {
      heading: 'Objek harta dan batas pengecualian Rp 10 juta',
      paragraphs: [
        'Berdasarkan Pasal 26 ayat (2) UU 36/2008 jo. PMK Nomor 82/PMK.03/2009, penghasilan yang diterima WPLN selain BUT dari penjualan atau pengalihan harta di Indonesia (di luar harta yang sudah dikenai PPh Final Pasal 4(2) seperti properti/saham bursa) dipotong PPh Pasal 26 Final oleh pembelinya yang merupakan pemotong pajak.',
        'Harta yang dimaksud mencakup perhiasan mewah, berlian, emas, intan, jam tangan mewah, barang antik, lukisan, mobil, motor, kapal pesiar, dan pesawat terbang ringan. Apabila nilai transaksi pengalihan harta tersebut tidak melebihi Rp 10.000.000 untuk setiap jenis transaksi (dan pembelinya bukan badan/pemotong), maka dikecualikan dari pemotongan PPh 26 PMK 82/2009.',
      ],
    },
    {
      heading: 'Norma neto 25% × 20% = 5% dan pengaruh SKD P3B',
      paragraphs: [
        'Karena sulitnya memverifikasi harga perolehan historis barang milik WPLN, PMK 82/2009 menetapkan perkiraan penghasilan neto sebesar 25% dari harga jual, yang dikalikan tarif PPh Pasal 26 sebesar 20%, sehingga tarif efektif finalnya tepat 5% dari harga jual. Apabila WPLN menyerahkan SKD (Form DGT) dan perjanjian P3B negara mitra memberikan hak pemajakan capital gain atas harta bergerak hanya di negara domisili WPLN, maka tarif dapat disesuaikan menjadi 0% / sesuai P3B.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum UU 36/2008 (s.d. 2008)',
    newHeader: 'PMK 82/PMK.03/2009 (2009–Kini)',
    rows: [
      {
        aspek: 'Pemotongan penjualan harta non-properti WPLN > Rp 10 jt',
        aturanLama: 'Belum ada aturan pelaksana norma neto khusus harta mewah',
        aturanBaru: 'Perkiraan neto 25% × 20% = 5% Final dari harga jual',
      },
      {
        aspek: 'Batas aman transaksi kecil',
        aturanLama: '—',
        aturanBaru: 'Dikecualikan untuk nilai transaksi <= Rp 10.000.000',
      },
    ],
  },
  caseExample: {
    title: 'Kolektor PT di Jakarta membeli lukisan milik WPLN seharga Rp 600 juta',
    scenario:
      'Sebuah PT membeli lukisan dari warga negara asing (WPLN tanpa SKD) seharga Rp 600.000.000 di Jakarta. Terutang PPh Pasal 26 Final PMK 82/2009 sebesar 25% × 20% × Rp 600.000.000 = Rp 30.000.000 (5%).',
    presetRegime: 'pph26_pmk82_2009_harta',
    presetInput: {
      pph26: {
        nilaiBruto: 600000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 0,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pmk82_2009HartaRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.nilaiBruto);
    const diBawahAmbang = hargaJual <= 10000000;
    const perkiraanNeto = diBawahAmbang ? 0 : Math.round(hargaJual * 0.25);

    const rateOnPrice = diBawahAmbang
      ? 0
      : input.hasSkdP3b
      ? Math.max(0, Math.min(20, input.tarifP3bPersen))
      : 5;
    const tax = diBawahAmbang
      ? 0
      : input.hasSkdP3b
      ? Math.round((hargaJual * rateOnPrice) / 100)
      : Math.round(perkiraanNeto * 0.2);
    const netReceived = Math.max(0, hargaJual - tax);

    const steps: CalculationStep[] = [
      { label: 'Harga jual / nilai pengalihan harta WPLN di Indonesia', value: hargaJual },
      {
        label: 'Perkiraan penghasilan neto (25% x Harga Jual)',
        formula: diBawahAmbang
          ? 'Nilai transaksi <= Rp 10 juta -> Dikecualikan PMK 82/2009'
          : `25% x ${formatRupiah(hargaJual)}`,
        value: perkiraanNeto,
      },
      {
        label: 'PPh Pasal 26 Final dipotong pembeli',
        formula: diBawahAmbang
          ? 'Dikecualikan (0%)'
          : input.hasSkdP3b
          ? `Sesuai SKD/P3B: ${formatPersen(rateOnPrice)} atas transaksi`
          : `20% x ${formatRupiah(perkiraanNeto)} (= 5% dari harga jual)`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Hasil penjualan bersih ditransfer ke WPLN', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Pengalihan Harta (PMK 82/2009)',
      primaryTaxAmount: tax,
      effectiveRatePercent: hargaJual > 0 ? (tax / hargaJual) * 100 : 0,
      takeHomeOrNetLabel: 'Dana Bersih Diterima Penjual WPLN',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        diBawahAmbang
          ? 'Berdasarkan Pasal 3 PMK 82/PMK.03/2009, penjualan harta bernilai tidak lebih dari Rp 10.000.000 per jenis transaksi dikecualikan dari pemotongan PPh 26.'
          : 'Tarif domestik PMK 82/2009 atas penjualan harta mewah/barang seni/kapal oleh WPLN efektif 5% (perkiraan neto 25% x tarif 20%), kecuali dibebaskan/dikurangi P3B dengan SKD sah.',
      ],
    };
  },
};
