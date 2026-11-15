import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PER_1_PJ_2023, SRC.UU_7_2021_HPP, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'pph23_per1_2023_royalti',
  taxType: 'pph23',
  name: 'PER-1/PJ/2023 (PPh 23 Royalti WPOP Pengguna NPPN — Tarif Efektif 6%)',
  shortName: '2023–Sekarang (Royalti WPOP NPPN 6%)',
  legalBasis: 'PER-1/PJ/2023 & Pasal 23 ayat (1) huruf a angka 3 UU PPh jo. UU HPP',
  effectivePeriod: '23 Maret 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — DPP 40% x Bruto (tarif efektif 6% dengan BPS NPPN)',
  summary:
    'Wajib Pajak Orang Pribadi (WPOP) dalam negeri seperti penulis, pencipta lagu, peneliti, dan kreator yang menggunakan Norma Penghitungan Penghasilan Neto (NPPN — omzet < Rp 4,8 miliar/thn) mendapat keringanan DPP PPh Pasal 23 atas royalti menjadi 40% dari penghasilan bruto, sehingga tarif pemotongan efektif turun dari 15% menjadi 6%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-per1-2023-royalti',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'PPh 23 Royalti Pencipta/Penulis WPOP Pengguna NPPN (Tarif Efektif 6%): PER-1/PJ/2023',
  legalBasis: 'PER-1/PJ/2023 & Pasal 23 UU PPh',
  effectiveDate: '23 Maret 2023',
  readMinutes: 4,
  summary:
    'Penjelasan perubahan pemotongan PPh 23 atas royalti bagi Wajib Pajak Orang Pribadi yang menghitung penghasilan netonya menggunakan NPPN agar pemotongan selaras dengan beban pajak tahunan.',
  sections: [
    {
      heading: 'Masalah Lebih Bayar 15% sebelum PER-1/PJ/2023',
      paragraphs: [
        'Sebelum diterbitkannya PER-1/PJ/2023, royalti yang diterima penulis buku, pencipta lagu, atau pemilik hak cipta orang pribadi dipotong PPh Pasal 23 sebesar 15% dari jumlah bruto. Padahal di SPT Tahunan PPh OP, WPOP beromzet di bawah Rp 4,8 miliar/tahun yang memakai NPPN hanya mengakui penghasilan neto sebesar norma (sekitar 40%–50%), sehingga kredit pajak 15% nyaris selalu mengakibatkan SPT Lebih Bayar.',
        'Untuk mengatasinya, PER-1/PJ/2023 menetapkan bahwa jumlah bruto sebagai dasar pemotongan PPh Pasal 23 atas penghasilan royalti bagi WPOP pengguna NPPN adalah sebesar 40% dari nilai royalti bruto. Karena tarif PPh Pasal 23 tetap 15%, pemotongan efektifnya menjadi 15% x 40% = 6%.',
      ],
    },
    {
      heading: 'Syarat mutlak: Bukti Penerimaan Surat (BPS) pemberitahuan NPPN',
      paragraphs: [
        'Untuk mendapatkan pemotongan tarif efektif 6%, WPOP wajib menyerahkan fotokopi/dokumen Bukti Penerimaan Surat (BPS) pemberitahuan penggunaan NPPN kepada pemotong PPh 23 (penerbit, label musik, atau perusahaan pengguna lisensi) sebelum saat pemotongan.',
        'Jika penerima royalti tidak menyerahkan BPS NPPN (atau memilih pembukuan/berstatus WP Badan), pemotong wajib tetap memotong PPh Pasal 23 normal 15% dari bruto penuh (atau 30% apabila penerima belum memiliki NPWP / NIK valid 16 digit).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tanpa BPS NPPN / Penerima Badan Usaha',
    newHeader: 'WPOP Pengguna NPPN + BPS NPPN (PER-1/PJ/2023)',
    rows: [
      {
        aspek: 'Dasar Pengenaan Pajak (DPP) Royalti',
        aturanLama: '100% dari jumlah bruto royalti',
        aturanBaru: '40% dari jumlah bruto royalti',
      },
      {
        aspek: 'Tarif Pemotongan PPh Pasal 23 Efektif',
        aturanLama: '15% penuh (30% jika non-NPWP)',
        aturanBaru: '6% efektif (15% x 40% bruto) dengan BPS NPPN',
      },
    ],
  },
  caseExample: {
    title: 'Royalti buku penulis WPOP pengguna NPPN senilai Rp 100 juta',
    scenario:
      'Seorang penulis buku berstatus WPOP dengan peredaran bruto di bawah Rp 4,8 miliar/tahun menyerahkan BPS NPPN kepada penerbit sebelum menerima pembayaran royalti Rp 100.000.000. DPP PPh 23 ditetapkan 40% x Rp 100 juta = Rp 40.000.000, sehingga PPh 23 yang dipotong penerbit hanya 15% x Rp 40 juta = Rp 6.000.000 (6%), bukan Rp 15.000.000.',
    presetRegime: 'pph23_per1_2023_royalti',
    presetInput: {
      pph23: {
        nilaiBruto: 100000000,
        objectType: 'royalti',
        hasNpwp: true,
        hasBpsNppnRoyalti: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Per1_2023RoyaltiRule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const hasBpsNppn = input.hasBpsNppnRoyalti !== false;
    const hasNpwp = input.hasNpwp !== false;

    const dpp = hasBpsNppn ? Math.round(bruto * 0.4) : bruto;
    const baseRate = 0.15;
    const penaltyMultiplier = !hasBpsNppn && !hasNpwp ? 2 : 1;
    const effectiveRate = hasBpsNppn ? 6 : 15 * penaltyMultiplier;
    const pph = Math.round(dpp * baseRate * penaltyMultiplier);

    const normalTax = Math.round(bruto * 0.15);
    const savings = hasBpsNppn ? Math.max(0, normalTax - pph) : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto royalti yang dibayarkan', value: bruto },
      {
        label: hasBpsNppn
          ? 'DPP PPh 23 Khusus PER-1/PJ/2023 (40% x Bruto — BPS NPPN valid)'
          : 'DPP PPh 23 Normal (100% Bruto — Tanpa BPS NPPN)',
        value: dpp,
      },
      {
        label: hasBpsNppn
          ? 'PPh Pasal 23 dipotong (15% x 40% Bruto = 6% efektif)'
          : hasNpwp
          ? 'PPh Pasal 23 dipotong (15% normal tanpa NPPN)'
          : 'PPh Pasal 23 dipotong (30% tanpa NPPN & non-NPWP)',
        value: pph,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: hasBpsNppn
        ? 'PPh 23 Royalti WPOP NPPN (6%)'
        : `PPh 23 Royalti Non-NPPN (${effectiveRate}%)`,
      primaryTaxAmount: pph,
      annualTaxLabel: hasBpsNppn
        ? 'Penghematan Pemotongan vs Tarif Normal 15%'
        : 'Selisih Kelebihan Potong Tanpa BPS NPPN',
      annualTaxAmount: hasBpsNppn ? savings : Math.max(0, pph - Math.round(bruto * 0.06)),
      effectiveRatePercent: bruto > 0 ? (pph / bruto) * 100 : 0,
      takeHomeOrNetLabel: 'Royalti Bersih Diterima Pencipta',
      takeHomeOrNetAmount: Math.max(0, bruto - pph),
      steps,
      notes: [
        hasBpsNppn
          ? `Sesuai PER-1/PJ/2023, dengan menyerahkan BPS pemberitahuan penggunaan NPPN kepada pemotong, DPP royalti hanya 40% (${formatRupiah(dpp)}) sehingga tarif pemotongan efektif menjadi 6% dan menghemat arus kas ${formatRupiah(savings)}.`
          : 'Tanpa melampirkan BPS NPPN (atau jika bukan WPOP pengguna NPPN), pemotong wajib mengenakan PPh 23 penuh 15% (atau 30% bila belum ber-NPWP/NIK valid 16 digit).',
        'Kredit pajak 6% yang telah dipotong bersifat tidak final dan tetap dikreditkan terhadap PPh terutang di SPT Tahunan OP menggunakan norma NPPN sektor yang berlaku.',
      ],
    };
  },
};
