import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_55_2022, SRC.PP_20_2026, SRC.PMK_141_2015, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph23_suket_pengecualian',
  taxType: 'pph23',
  name: 'PP 55/2022 & Pasal 23 ayat (4) UU PPh (Suket UMKM 0,5% & Pengecualian Pemotongan)',
  shortName: '2018–Sekarang (Suket UMKM 0,5% & Bebas PPh 23)',
  legalBasis: 'Pasal 23 ayat (4) UU PPh jo. PP 55/2022 & PP 20/2026',
  effectivePeriod: '1 Juli 2018 – Sekarang (Disesuaikan PP 55/2022 & PP 20/2026)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Vendor ber-Suket UMKM (0,5% vs 2%) & Pengecualian Bank/Leasing',
  summary:
    'Mekanisme pengurangan beban potong vendor jasa PPh Pasal 23: (1) Jika penyedia jasa menyerahkan Surat Keterangan (Suket) UMKM PP 55/2022 (atau PP 20/2026 bagi OP/Perseroan Perorangan/Koperasi) yang tervalidasi sistem DJP, pemotong menyetor PPh Final 0,5% alih-alih memotong PPh Pasal 23 sebesar 2%; dan (2) Pembayaran jasa ke Bank, Sewa Guna Usaha (leasing) dengan hak opsi, atau dividen pengecualian Pasal 23 ayat (4) bebas pemotongan 0%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-suket-pengecualian',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'Pemotongan PPh 23 vs Suket UMKM 0,5% & Pengecualian Pasal 23 ayat (4)',
  legalBasis: 'Pasal 23 ayat (4) UU PPh jo. PP 55/2022 & PP 20/2026',
  effectiveDate: '20 Desember 2022 (Suket UMKM PP 55/2022) & 22 April 2026 (PP 20/2026)',
  readMinutes: 5,
  summary:
    'Membandingkan kewajiban pemotongan PPh 23 normal 2% terhadap skema Surat Keterangan UMKM (0,5% Final yang disetor pemotong) serta objek yang dikecualikan mutlak oleh Pasal 23 ayat (4) UU PPh.',
  sections: [
    {
      heading: 'Kapan pemotong wajib memotong 0,5% (bukan 2%) atas tagihan vendor?',
      paragraphs: [
        'Vendor UMKM Orang Pribadi, Perseroan Perorangan, atau Koperasi (serta CV/PT selama masih dalam sisa masa transisi PP 20/2026) yang telah memperoleh Surat Keterangan (Suket) melalui Coretax dapat menyerahkan fotokopi/konfirmasi validitas Suket tersebut kepada pengguna jasa sebelum pembayaran.',
        'Atas transaksi tersebut, pengguna jasa tidak memotong PPh Pasal 23 sebesar 2% (atau 15% untuk bunga/royalti non-UMKM), melainkan memungut dan menyetorkan PPh Final Pasal 4(2) sebesar 0,5% dari nilai bruto dengan kode akun pajak setor PPh Final UMKM (411128-423) dan menerbitkan bukti potong PPh Final (yang di era Coretax disiapkan terpadu).',
      ],
    },
    {
      heading: 'Pengecualian mutlak pemotongan Pasal 23 ayat (4) UU PPh',
      paragraphs: [
        'Berdasarkan Pasal 23 ayat (4) UU PPh, pemotongan PPh Pasal 23 tidak dilakukan (0%) atas: penghasilan yang dibayar/terutang kepada bank, sewa yang dibayarkan sehubungan dengan Sewa Guna Usaha (SGU) dengan hak opsi (financial lease), dividen badan dalam negeri (dikecualikan di UU HPP), serta bagian laba anggota persekutuan CV/Firma yang modalnya tidak terbagi atas saham.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pemotongan Normal PMK 141/2015',
    newHeader: 'Dengan Suket UMKM / Pengecualian Pasal 23(4)',
    rows: [
      {
        aspek: 'Jasa teknik, manajemen, konsultan, sewa non-tanah',
        aturanLama: 'Dipotong PPh 23 sebesar 2% (kredit pajak tahunan)',
        aturanBaru: 'Disetor PPh Final 0,5% (bila Suket UMKM valid di DJP)',
      },
      {
        aspek: 'Jasa keuangan kepada Bank / Leasing Hak Opsi',
        aturanLama: 'Dikecualikan dari pemotongan sejak UU PPh',
        aturanBaru: 'Tetap dikecualikan 0% sesuai Pasal 23 ayat (4)',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran jasa maintenance Rp 50.000.000 kepada vendor ber-Suket UMKM',
    scenario:
      'Perusahaan membayar tagihan jasa perawatan peralatan Rp 50.000.000 kepada penyedia jasa Perseroan Perorangan yang menyerahkan Suket PP 55/2022 / PP 20/2026 valid.',
    presetRegime: 'pph23_suket_pengecualian',
    presetInput: {
      pph23: {
        nilaiBruto: 50000000,
        objectType: 'jasa_teknik_manajemen',
        hasNpwp: true,
        isSuketUmkm: true,
        isPengecualianPasal23_4: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23SuketPengecualianRule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const isDividenBadanExempt = input.objectType === 'dividen_badan';
    const isExempt = isDividenBadanExempt || Boolean(input.isPengecualianPasal23_4);
    const hasSuket = !isExempt && Boolean(input.isSuketUmkm);

    const normalRate = isDividenBadanExempt ? 0 : input.objectType === 'royalti' ? 15 : 2;
    const appliedRate = isExempt ? 0 : hasSuket ? 0.5 : normalRate;
    const taxNormal = Math.round((bruto * normalRate) / 100);
    const taxApplied = Math.round((bruto * appliedRate) / 100);
    const savings = Math.max(0, taxNormal - taxApplied);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto pembayaran jasa / objek PPh 23', value: bruto },
      {
        label: isDividenBadanExempt
          ? 'Tarif normal PPh 23 dividen badan DN (Dikecualikan 0% UU HPP / Cipta Kerja)'
          : `Simulasi pemotongan PPh 23 normal (${formatPersen(normalRate)})`,
        value: taxNormal,
      },
      {
        label: isExempt
          ? isDividenBadanExempt
            ? 'Status: Dividen Badan DN Dikecualikan dari Objek Pajak (0% UU HPP)'
            : 'Status: Dikecualikan Pasal 23 ayat (4) UU PPh (Bank / SGU Hak Opsi)'
          : hasSuket
            ? 'Status: Validasi Suket PP 55/2022 / PP 20/2026 (0,5% Final)'
            : 'Status: Tanpa Suket UMKM (Tarif Normal)',
        value: -savings,
        isNegative: true,
      },
      {
        label: isExempt
          ? 'PPh dipotong (Dikecualikan 0%)'
          : hasSuket
            ? 'PPh Final disetor pemotong (0,5%)'
            : `PPh Pasal 23 dipotong (${formatPersen(normalRate)})`,
        formula: `${formatRupiah(bruto)} x ${formatPersen(appliedRate)}`,
        value: taxApplied,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isExempt
        ? 'Pemotongan Pajak (Dikecualikan)'
        : hasSuket
          ? 'PPh Final Disetor via Suket UMKM (0,5%)'
          : `PPh Pasal 23 Normal (${formatPersen(normalRate)})`,
      primaryTaxAmount: taxApplied,
      effectiveRatePercent: appliedRate,
      takeHomeOrNetLabel: 'Pembayaran Bersih Diterima Vendor',
      takeHomeOrNetAmount: Math.max(0, bruto - taxApplied),
      steps,
      notes: [
        isExempt
          ? 'Karena termasuk objek pengecualian Pasal 23 ayat (4) UU PPh (pembayaran ke bank, SGU dengan hak opsi, atau dividen bebas), tidak ada pemotongan PPh Pasal 23 (0%).'
          : hasSuket
            ? `Vendor menyerahkan Suket UMKM valid sehingga pajak disetor cukup 0,5% Final (${formatRupiah(taxApplied)}), menghemat pemotongan kas vendor ${formatRupiah(savings)}. Perhatikan bahwa sejak 22 Apr 2026 (PP 20/2026), Suket baru berlaku bagi OP, Perseroan Perorangan, & Koperasi (atau sisa transisi CV/PT).`
            : 'Tanpa Suket UMKM atau SKB yang sah di sistem DJP, pemotong wajib memotong tarif normal Pasal 23.',
      ],
    };
  },
};
