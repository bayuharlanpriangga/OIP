import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_18_2021, SRC.UU_6_2023_CK, SRC.UU_7_2021_HPP, SRC.PMK_192_2018];

const regime: TaxRegime = {
  id: 'badan_pmk18_2021_dividen_ln',
  taxType: 'pph_badan',
  name: 'Pasal 4(3)(f) UU PPh & PMK 18/2021 (Pengecualian Dividen Luar Negeri WP Badan — Reinvestasi 30%)',
  shortName: '2021–Sekarang (Dividen LN Badan Reinvestasi 30%)',
  legalBasis: 'Pasal 4 ayat (3) huruf f angka 2 UU PPh (UU Cipta Kerja/HPP) jo. PMK 18/PMK.03/2021',
  effectivePeriod: '2 November 2020 – Sekarang (Pelaksana PMK 18/2021: 17 Feb 2021)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Bebas PPh jika reinvestasi >= 30% laba setelah pajak selama 3 thn',
  summary:
    'Dividen yang diterima WP Badan dalam negeri dari badan usaha di luar negeri yang tidak diperdagangkan di bursa (non-bursa) dikecualikan dari objek PPh Badan (0%) sepanjang diinvestasikan kembali di Indonesia minimal 30% dari laba setelah pajak (sesuai porsi saham) dalam jangka waktu paling sedikit 3 tahun pajak sebelum batas akhir bulan ke-4 setelah tahun pajak berakhir.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pmk18-2021-dividen-ln',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Pembebasan Pajak Dividen Luar Negeri WP Badan (Syarat Reinvestasi >= 30% & 3 Tahun): PMK 18/2021',
  legalBasis: 'Pasal 4 ayat (3) huruf f UU PPh jo. PMK 18/PMK.03/2021',
  effectiveDate: '2 November 2020',
  readMinutes: 5,
  summary:
    'Panduan penghitungan pembebasan PPh Badan atas dividen dari anak usaha luar negeri non-bursa beserta konsekuensi PPh 22% dan kredit pajak PPh 24 bila nilai reinvestasi kurang dari ambang 30%.',
  sections: [
    {
      heading: 'Ambang Minimal Reinvestasi 30% Laba Setelah Pajak & Holding 3 Tahun',
      paragraphs: [
        'Melalui UU Cipta Kerja dan PMK 18/PMK.03/2021, dividen yang berasal dari badan usaha luar negeri (BULN) yang sahamnya TIDAK diperdagangkan di bursa efek dikecualikan dari objek PPh Badan apabila diinvestasikan atau digunakan untuk kegiatan usaha lainnya di wilayah Indonesia dalam jangka waktu tertentu (paling singkat 3 tahun pajak).',
        'Untuk menikmati pembebasan penuh (100% dividen bebas pajak), jumlah dividen yang diinvestasikan di Indonesia minimal sebesar 30% dari laba setelah pajak BULN non-bursa (sebanding dengan porsi kepemilikan saham WP Badan Indonesia). Investasi harus direalisasikan paling lambat akhir bulan ke-4 (untuk WP Badan) setelah tahun pajak diterimanya dividen.',
      ],
    },
    {
      heading: 'Perlakuan jika Reinvestasi Kurang dari 30% (Selisih Terutang PPh 22% - PPh 24)',
      paragraphs: [
        'Apabila dividen yang diinvestasikan di Indonesia kurang dari 30% dari porsi laba setelah pajak BULN non-bursa, maka: (a) bagian dividen yang benar-benar diinvestasikan tetap dikecualikan dari objek PPh; (b) selisih antara ambang wajib 30% dengan jumlah yang diinvestasikan terutang PPh Badan 22%; dan (c) sisa dividen di atas ambang 30% yang tidak diinvestasikan tetap dikecualikan sepanjang syarat minimal 30% terpenuhi — namun jika syarat 30% tidak tercapai, selisih dari 30% (atau bagian non-reinvestasi sesuai proporsi kurangnya syarat 30%) dikenai PPh 22%.',
        'Atas bagian dividen luar negeri yang akhirnya terutang PPh Badan di Indonesia, pajak penghasilan (withholding tax) yang telah dibayar atau dipotong di negara sumber dapat dikreditkan secara proporsional melalui mekanisme Kredit Pajak Luar Negeri PPh Pasal 24 sesuai PMK 192/2018.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum UU Cipta Kerja (UU 36/2008)',
    newHeader: 'PMK 18/PMK.03/2021 (Reinvestasi >= 30%)',
    rows: [
      {
        aspek: 'Status Dividen dari Anak Usaha LN Non-Bursa',
        aturanLama: 'Selalu objek PPh Badan 22%/25% (dikurangi PPh 24)',
        aturanBaru: 'Dikecualikan dari objek PPh (0%) jika memenuhi syarat reinvestasi',
      },
      {
        aspek: 'Ambang Batas Minimal & Durasi Investasi di RI',
        aturanLama: 'Tidak ada skema pembebasan bersyarat',
        aturanBaru: 'Minimal 30% dari proporsi laba setelah pajak BULN, ditahan >= 3 tahun pajak',
      },
    ],
  },
  caseExample: {
    title: 'WP Badan menerima dividen Rp 2 miliar dari anak usaha Singapura (porsi laba setelah pajak Rp 5 miliar)',
    scenario:
      'PT Induk RI memiliki 100% saham anak usaha non-bursa di Singapura yang membukukan laba setelah pajak setara Rp 5.000.000.000. Dividen yang dibagikan ke RI sebesar Rp 2.000.000.000 (sudah dipotong tax 0%/5% di negara sumber = Rp 100 juta). Batas minimal reinvestasi 30% x Rp 5 M = Rp 1.500.000.000. Karena PT Induk menginvestasikan Rp 1.500.000.000 di SBN/proyek RI selama 3 tahun, seluruh dividen Rp 2 M bebas PPh Badan (Rp 0).',
    presetRegime: 'badan_pmk18_2021_dividen_ln',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 0,
        penghasilanKenaPajak: 0,
        isTbk: false,
        labaSetelahPajakBuln: 5000000000,
        dividenLnDiterima: 2000000000,
        nilaiReinvestasiDividenLn: 1500000000,
        pajakDibayarDiLnDividen: 100000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk18_2021DividenLnRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const labaBuln = Math.max(0, input.labaSetelahPajakBuln ?? 0);
    const dividenDiterima = Math.max(0, input.dividenLnDiterima ?? 0);
    const nilaiReinvestasi = Math.min(dividenDiterima, Math.max(0, input.nilaiReinvestasiDividenLn ?? 0));
    const pajakLn = Math.max(0, input.pajakDibayarDiLnDividen ?? 0);

    // Ambang wajib reinvestasi = min(30% x porsi laba setelah pajak, total dividen diterima)
    const ambangWajib30 = Math.round(labaBuln * 0.3);
    const targetMinReinvestasi = Math.min(dividenDiterima, ambangWajib30);

    // Sesuai Pasal 24-25 PMK 18/2021:
    // Bila reinvestasi >= 30% laba setelah pajak, seluruh dividen dikecualikan (selisih kurang = 0).
    // Bila reinvestasi < 30% laba setelah pajak, selisih dari 30% laba setelah pajak (dibatasi dividen diterima) terutang PPh Badan 22%.
    const shortfallFromTarget = Math.max(0, targetMinReinvestasi - nilaiReinvestasi);
    const dividenBebasPajak = Math.max(0, dividenDiterima - shortfallFromTarget);

    const pphBadanBruto = Math.round(shortfallFromTarget * 0.22);
    // Kredit pajak PPh 24 atas dividen yang terutang PPh (proporsional atas dividen terutang)
    const porsiTerutang = dividenDiterima > 0 ? shortfallFromTarget / dividenDiterima : 0;
    const pajakLnProporsional = Math.round(pajakLn * porsiTerutang);
    const kreditPph24 = Math.min(pphBadanBruto, pajakLnProporsional);
    const pphNetoIndonesia = Math.max(0, pphBadanBruto - kreditPph24);

    const isFullExempt = shortfallFromTarget === 0;

    const steps: CalculationStep[] = [
      { label: 'Dividen luar negeri (BULN non-bursa) yang diterima', value: dividenDiterima },
      { label: 'Ambang minimal reinvestasi (30% x Laba Setelah Pajak BULN)', value: ambangWajib30 },
      { label: 'Realisasi investasi di Indonesia (>= 3 tahun pajak)', value: nilaiReinvestasi },
      {
        label: 'Bagian dividen luar negeri yang bebas PPh Badan (Pasal 4(3)(f))',
        value: dividenBebasPajak,
      },
      { label: 'Bagian selisih kurang reinvestasi yang terutang PPh Badan 22%', value: shortfallFromTarget },
      {
        label: 'Kredit Pajak Luar Negeri PPh 24 proporsional (jika ada bagian terutang)',
        value: -kreditPph24,
        isNegative: kreditPph24 > 0,
      },
      {
        label: 'PPh Badan neto wajib setor di Indonesia',
        value: pphNetoIndonesia,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isFullExempt
        ? 'PPh Badan Dividen LN (Bebas Pajak 0%)'
        : 'PPh Badan Kurang Reinvestasi (Neto PPh 24)',
      primaryTaxAmount: pphNetoIndonesia,
      annualTaxLabel: 'Potensi Pajak Jika Tidak Reinvestasi Sama Sekali (22% - PPh 24)',
      annualTaxAmount: Math.max(0, Math.round(targetMinReinvestasi * 0.22) - Math.min(Math.round(targetMinReinvestasi * 0.22), pajakLn)),
      effectiveRatePercent: dividenDiterima > 0 ? (pphNetoIndonesia / dividenDiterima) * 100 : 0,
      takeHomeOrNetLabel: 'Dividen Bersih Setelah PPh Indonesia',
      takeHomeOrNetAmount: Math.max(0, dividenDiterima - pphNetoIndonesia),
      steps,
      notes: [
        isFullExempt
          ? `Realisasi investasi di Indonesia (${formatRupiah(nilaiReinvestasi)}) telah memenuhi ambang minimal 30% dari laba setelah pajak (${formatRupiah(ambangWajib30)}). Seluruh dividen ${formatRupiah(dividenDiterima)} dikecualikan dari objek PPh Badan (0%).`
          : `Reinvestasi masih kurang ${formatRupiah(shortfallFromTarget)} dari ambang minimal 30% (${formatRupiah(targetMinReinvestasi)}), sehingga atas selisih kurang tersebut dikenai PPh Badan ${formatPersen(22)} dikurangi PPh 24 proporsional menjadi ${formatRupiah(pphNetoIndonesia)}.`,
        'Wajib diinvestasikan paling lambat akhir bulan ke-4 setelah akhir tahun pajak diterima, ditahan minimal 3 tahun pajak di instrumen sah PMK 18/2021 (SBN, saham/obligasi pasar modal, infrastruktur, sektor riil, dsb.), dan dilaporkan via Laporan Realisasi Investasi tahunan di DJP/Coretax.',
      ],
    };
  },
};
