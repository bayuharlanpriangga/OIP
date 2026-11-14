import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_9_1970_PPD, SRC.UU_7_1983];

const regime: TaxRegime = {
  id: 'pph21_ppd1944',
  taxType: 'pph21',
  name: 'Ordonansi Pajak Pendapatan 1944 (PPd 1944) jo. UU 9/1970',
  shortName: 'Pra-1984 (PPd 1944 / 10%–50%)',
  legalBasis: 'Ordonansi Pajak Pendapatan 1944 (Stbl. 1944 No. 17) jo. UU Nomor 9 Tahun 1970',
  effectivePeriod: '1944 – 31 Desember 1983',
  isCurrent: false,
  summary:
    'Sistem pajak penghasilan orang pribadi sebelum reformasi UU 7/1983. Menggunakan penetapan jabatan (official assessment) dan tarif progresif curam 10% hingga puncak 50% (setelah UU 9/1970) atas pendapatan sisa kena pajak.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-ppd1944',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Sejarah Pajak Orang Pribadi Pra-1984: Ordonansi Pajak Pendapatan 1944 (PPd 1944)',
  legalBasis: 'Stbl. 1944 No. 17 (Ordonansi PPd 1944) stdd UU Nomor 9 Tahun 1970',
  effectiveDate: '1944 (Pembaruan Terakhir UU 9/1970)',
  readMinutes: 5,
  summary:
    'Menelusuri sistem perpajakan warisan kolonial Belanda yang dipakai hingga 1983: pemisahan PPd, Pajak Kekayaan, dan Pajak Perseroan, sistem official assessment melalui SKP, serta tarif puncak 50%.',
  sections: [
    {
      heading: 'Sistem Official Assessment sebelum reformasi 1983',
      paragraphs: [
        'Sebelum lahirnya UU Nomor 7 Tahun 1983 (berlaku 1 Januari 1984), pajak penghasilan orang pribadi di Indonesia diatur lewat Ordonansi Pajak Pendapatan 1944 (Verordening op de Inkomstenbelasting 1944). Pada masa ini, besaran pajak tahunan ditentukan oleh inspektur pajak melalui Surat Ketetapan Pajak (SKP), sementara untuk buruh/pegawai dipotong Pajak Pendapatan Buruh (P.Pd. Buruh) sebagai uang muka.',
        'Struktur tarif PPd 1944 awalnya memiliki banyak lapisan dengan tarif puncak yang sempat mencapai di atas 60%, lalu disederhanakan secara bertahap melalui UU 23/1964 dan terakhir UU Nomor 9 Tahun 1970 menjadi tarif progresif mulai dari 10% hingga maksimal 50% atas pendapatan sisa kena pajak.',
      ],
    },
    {
      heading: 'Mengapa digantikan total oleh UU Nomor 7 Tahun 1983?',
      paragraphs: [
        'Banyaknya lapisan tarif, kerumitan pengurangan batas bebas pajak berdasarkan jenis keluarga/status, dan ketergantungan pada penetapan fiskus memicu tingkat kepatuhan yang rendah serta sengketa penetapan.',
        'Reformasi Perpajakan Nasional 1983 menyatukan PPd 1944, Pajak Perseroan 1925, dan Pajak Dividen 1959 ke dalam satu UU Pajak Penghasilan (UU 7/1983) berlandaskan asas self-assessment serta sistem pemotongan PPh Pasal 21 yang modern dengan hanya 3 lapis tarif (15%, 25%, 35%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Ordonansi PPd 1944 jo. UU 9/1970 (Pra-1984)',
    newHeader: 'UU Nomor 7 Tahun 1983 (Mulai 1984)',
    rows: [
      {
        aspek: 'Sistem penetapan pajak',
        aturanLama: 'Official assessment (SKP oleh jawatan pajak)',
        aturanBaru: 'Self-assessment & withholding PPh Pasal 21 oleh pemberi kerja',
      },
      {
        aspek: 'Rentang tarif progresif',
        aturanLama: '10% hingga puncak 50% (banyak lapisan pendapatan sisa)',
        aturanBaru: 'Disederhanakan menjadi 3 lapis: 15%, 25%, dan 35%',
      },
      {
        aspek: 'Landasan hukum utama',
        aturanLama: 'Ordonansi Pajak Pendapatan 1944 (warisan Stbl. 1944)',
        aturanBaru: 'Produk hukum nasional penuh UU Nomor 7 Tahun 1983',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi konversi lapisan tarif historis PPd 1944 stdd UU 9/1970',
    scenario:
      'Membandingkan beban pajak historis memakai rentang tarif progresif 10%–50% era UU 9/1970 atas penghasilan setara nilai uang kini Rp 120.000.000 per tahun.',
    presetRegime: 'pph21_ppd1944',
    presetInput: {
      pph21: {
        gajiBulanan: 10000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

// Lapisan tarif historis UU 9/1970 (10%-50%) dikonversi ke ilustrasi lapisan nominal tahunan untuk komparasi tarif era pra-1984
function computePpd1944LegacyTax(netoTahunan: number): { tax: number; detail: string } {
  const bebasPajakIlustrasi = 900000;
  const pkp = Math.max(0, netoTahunan - bebasPajakIlustrasi);
  if (pkp <= 0) return { tax: 0, detail: 'Pendapatan di bawah batas bebas pajak' };

  const layers = [
    { limit: 1500000, rate: 0.1 },
    { limit: 5000000, rate: 0.2 },
    { limit: 15000000, rate: 0.3 },
    { limit: 40000000, rate: 0.4 },
    { limit: Infinity, rate: 0.5 },
  ];

  let remaining = pkp;
  let prev = 0;
  let tax = 0;
  const parts: string[] = [];

  for (const l of layers) {
    if (remaining <= 0) break;
    const span = l.limit === Infinity ? remaining : Math.min(remaining, l.limit - prev);
    tax += span * l.rate;
    parts.push(`${Math.round(l.rate * 100)}% x ${formatRupiah(span)}`);
    remaining -= span;
    prev = l.limit;
  }

  return { tax: Math.round(tax), detail: parts.join(' + ') };
}

export const pph21Ppd1944Rule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji = Math.max(0, input.gajiBulanan);
    const tunjangan = Math.max(0, input.tunjanganTetap);
    const bonus = Math.max(0, input.bonusTahunan);
    const brutoBulanan = gaji + tunjangan;
    const brutoTahunan = brutoBulanan * 12 + bonus;

    const { tax: pphTahunan, detail } = computePpd1944LegacyTax(brutoTahunan);
    const pphBulanan = Math.round(pphTahunan / 12);
    const takeHomeBulanan = Math.max(0, brutoBulanan - pphBulanan);

    const steps: CalculationStep[] = [
      { label: 'Penghasilan bruto setahun', value: brutoTahunan },
      { label: 'Simulasi batas bebas pajak (era UU 9/1970)', value: -900000, isNegative: true },
      {
        label: 'Pajak Pendapatan setahun (tarif 10%–50%)',
        formula: detail,
        value: pphTahunan,
        isHighlight: true,
      },
      {
        label: 'Rata-rata cicilan P.Pd. Buruh per bulan',
        formula: `${formatRupiah(pphTahunan)} ÷ 12`,
        value: pphBulanan,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Simulasi Pajak Pendapatan per Bulan',
      primaryTaxAmount: pphBulanan,
      annualTaxLabel: 'Total Pajak Pendapatan Setahun (10%–50%)',
      annualTaxAmount: pphTahunan,
      effectiveRatePercent: brutoTahunan > 0 ? (pphTahunan / brutoTahunan) * 100 : 0,
      takeHomeOrNetLabel: 'Sisa Penghasilan Bulanan',
      takeHomeOrNetAmount: takeHomeBulanan,
      steps,
      notes: [
        'Ordonansi PPd 1944 stdd UU 9/1970 memakai batas bebas pajak nominal rupiah periode 1970-an dengan tarif progresif curam hingga 50% (sehingga penghasilan bernominal masa kini tampak langsung masuk ke lapis atas 50%).',
        'Aturan ini dicabut per 1 Januari 1984 bersamaan berlakunya UU Nomor 7 Tahun 1983 tentang PPh.',
      ],
    };
  },
};
