import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_btbmi_uu10_1995',
  taxType: 'bea_masuk',
  name: 'UU Kepabeanan Nasional & Era BTBMI (UU 10/1995, UU 17/2006, KMK 545/2003 & PMK 110/2006)',
  shortName: '1996–2011 (UU 10/1995 & BTBMI)',
  legalBasis:
    'UU Nomor 10 Tahun 1995 (berlaku 1 April 1996), UU Nomor 17 Tahun 2006, KMK Nomor 545/KMK.01/2003 & PMK Nomor 110/PMK.010/2006',
  effectivePeriod: '1 April 1996 – 31 Desember 2011',
  isCurrent: false,
  summary:
    'Lahirnya hukum kepabeanan nasional modern yang mencabut tiga ordonansi kolonial, mengintroduksi sistem self-assessment PIB, membatasi pagu umum tarif Bea Masuk 40%, serta menerapkan nomenklatur BTBMI berbasis HS/AHTN.',
  sources: [SRC.UU_10_1995, SRC.UU_17_2006, SRC.KMK_545_2003, SRC.PMK_110_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-uu10-1995-btbmi',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Reformasi UU 10/1995, UU 17/2006, & Era Buku Tarif Bea Masuk Indonesia (BTBMI 1996–2011)',
  legalBasis:
    'UU Nomor 10 Tahun 1995, UU Nomor 17 Tahun 2006, KMK 545/KMK.01/2003 & PMK 110/PMK.010/2006',
  effectiveDate: '1 April 1996 – 31 Desember 2011',
  readMinutes: 5,
  summary:
    'Pasal 118 UU Nomor 10 Tahun 1995 menandai lahirnya era kepabeanan modern pada 1 April 1996 dengan prinsip self-assessment PIB, plafon tarif umum 40% (Pasal 12), dan penerapan BTBMI yang mengadopsi AHTN ASEAN.',
  sections: [
    {
      heading: 'UU 10/1995 (Efektif 1 April 1996) & Pembaruan UU 17/2006',
      paragraphs: [
        'Disahkan pada 30 Desember 1995 dan berlaku efektif mulai 1 April 1996 (Pasal 118), UU Nomor 10 Tahun 1995 secara resmi mencabut seluruh ordonansi pabean warisan kolonial Belanda (Pasal 117) serta memindahkan kewenangan penghitungan pabean dari penetapan pejabat (official assessment) menjadi penghitungan sendiri oleh importir (self-assessment melalui PIB) dengan pengawasan post-clearance audit.',
        'Pasal 12 menetapkan bahwa tarif Bea Masuk umum paling tinggi 40% dari Nilai Pabean berbasis nilai transaksi CIF (sesuai kesepakatan GATT/WTO Valuation Agreement), dengan pengecualian bagi produk pertanian tertentu (Schedule XXI) serta Bea Masuk Tambahan. Satu dekade kemudian, UU Nomor 17 Tahun 2006 (berlaku 15 November 2006) memperkuat ketentuan penyelundupan, pelacakan narkotika/prekursori, transparansi, dan pengaturan BMT.',
      ],
    },
    {
      heading: 'Era Buku Tarif Bea Masuk Indonesia (BTBMI) — KMK 545/2003 & PMK 110/2006',
      paragraphs: [
        'Sebelum nomenklatur BTKI lahir pada 2012, pengklasifikasian dan tarif impor menggunakan Buku Tarif Bea Masuk Indonesia (BTBMI). Melalui KMK Nomor 545/KMK.01/2003, Indonesia mengadopsi sistem AHTN untuk menyelaraskan pos tarif antaranggota ASEAN, yang kemudian diperbarui lebih lanjut dalam BTBMI 2007 melalui PMK Nomor 110/PMK.010/2006 seiring amandemen HS 2007.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Ordonansi Kolonial & PP 6/1969 (Pra-1 April 1996)',
    newHeader: 'UU 10/1995, UU 17/2006 & BTBMI (1996–2011)',
    rows: [
      {
        aspek: 'Sistem Penetapan & Pemeriksaan',
        aturanLama: 'Official assessment & pemeriksaan fisik menyeluruh di pelabuhan',
        aturanBaru: 'Self-assessment (PIB/EDI), jalur hijau/merah, & audit kepabeanan (post-audit)',
      },
      {
        aspek: 'Penilaian Nilai Pabean',
        aturanLama: 'Sistem harga patokan/Brussels Definition of Value',
        aturanBaru: 'Nilai Transaksi CIF sesuai GATT/WTO Customs Valuation Code (Pasal 15)',
      },
      {
        aspek: 'Plafon Tarif Ad Valorem Umum',
        aturanLama: 'Rentang tarif sangat tinggi untuk proteksi (hingga > 100%)',
        aturanBaru: 'Batas umum maks 40% (Pasal 12 UU 10/1995) kecuali Schedule XXI & BMT',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi PIB Era BTBMI 2007 dengan Nilai Pabean Rp 500 juta & Tarif MFN 15%',
    scenario:
      'Importir mengimpor bahan baku manufaktur pada tahun 2008 senilai CIF Rp 500.000.000 dengan tarif BTBMI 15% di bawah payung UU 10/1995 jo. UU 17/2006.',
    presetRegime: 'bea_masuk_btbmi_uu10_1995',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 500000000,
        tarifBmPersen: 15,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukBtbmiUu101995Rule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const rawTarif = Math.max(0, input.tarifBmPersen);
    const appliedTarif = Math.min(rawTarif, 40);
    const beaMasuk = Math.round(nilaiPabean * (appliedTarif / 100));
    const nilaiImpor = nilaiPabean + beaMasuk;
    const effectiveRate = nilaiPabean > 0 ? (beaMasuk / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Pabean CIF Era BTBMI (Pasal 15 UU 10/1995)', value: nilaiPabean },
      {
        label: 'Tarif Bea Masuk BTBMI (Plafon Umum 40% Pasal 12)',
        formula: rawTarif > 40 ? 'Dibatasi ke pagu umum 40% Pasal 12 UU 10/1995' : 'Tarif ad valorem BTBMI',
        value: appliedTarif,
        format: 'percent',
      },
      {
        label: 'Bea Masuk Terutang Era UU 10/1995 – UU 17/2006',
        formula: `${formatPersen(appliedTarif)} x ${formatRupiah(nilaiPabean)}`,
        value: beaMasuk,
        isHighlight: true,
      },
      {
        label: 'Nilai Impor (CIF + Bea Masuk)',
        formula: 'DPP PPN Impor (10%) & PPh 22 era BTBMI',
        value: nilaiImpor,
      },
    ];

    const notes: string[] = [
      'UU 10/1995 mulai berlaku efektif pada 1 April 1996 (Pasal 118) menggantikan ordonansi pabean kolonial dan memperkenalkan PIB self-assessment.',
    ];
    if (rawTarif > 40) {
      notes.push(
        'Catatan: Tarif di atas 40% dibatasi ke plafon umum Pasal 12 ayat (1) UU 10/1995 (kecuali komoditas pertanian tertentu Schedule XXI GATT-WTO atau bila dikenai BMAD/BMI).'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Era UU 10/1995 & BTBMI',
      primaryTaxAmount: beaMasuk,
      annualTaxLabel: 'Nilai Impor Era BTBMI',
      annualTaxAmount: nilaiImpor,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk BTBMI',
      takeHomeOrNetLabel: 'Nilai Impor (DPP PPN 10%)',
      takeHomeOrNetAmount: nilaiImpor,
      steps,
      notes,
    };
  },
};
