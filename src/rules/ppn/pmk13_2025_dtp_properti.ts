import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [
  SRC.PMK_90_2025,
  SRC.PMK_60_2025,
  SRC.PMK_13_2025,
  SRC.PMK_61_2024,
  SRC.PMK_7_2024,
  SRC.PMK_131_2024,
];

const regime: TaxRegime = {
  id: 'ppn_dtp_properti_pmk13_2025',
  taxType: 'ppn',
  name: 'PMK 90/2025, PMK 13/2025 jo. PMK 60/2025 & PMK 7/2024 (PPN DTP Rumah Tapak & Rusun)',
  shortName: '2024–2026 (PPN DTP Properti 100%)',
  legalBasis: 'PMK Nomor 90 Tahun 2025, PMK Nomor 13/2025 jo. PMK 60/2025, PMK 61/2024 & PMK 7/2024',
  effectivePeriod: '1 Januari 2024 – 31 Desember 2026 (Diperpanjang PMK 90/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku 2026 (PMK 90/2025) — Pembelian rumah tapak/rusun baru siap huni <= Rp 5 M',
  summary:
    'Fasilitas PPN Ditanggung Pemerintah (DTP) atas penyerahan rumah tapak atau satuan rumah susun baru dengan harga jual paling tinggi Rp 5 miliar atas bagian DPP s.d. Rp 2 miliar: berlanjut 100% penuh sepanjang 1 Januari–31 Desember 2026 melalui PMK 90/2025 (melanjutkan skema 100% Semester I & II 2025 di PMK 13/2025 jo. PMK 60/2025).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk13-2025-dtp-properti',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN DTP Properti 2025–2026 (PMK 13/2025, PMK 60/2025 & PMK 90/2025): DTP 100% Hingga Akhir 2026',
  legalBasis: 'PMK Nomor 90 Tahun 2025 jo. PMK Nomor 13/2025 & PMK Nomor 60/2025',
  effectiveDate: '1 Januari 2025 – 31 Desember 2026',
  readMinutes: 5,
  summary:
    'Simulasi dan ketentuan lengkap PPN DTP pembelian rumah tapak/rusun baru maksimal Rp 5 miliar hingga Tahun Anggaran 2026 (PMK 90/2025), mencakup perpanjangan penuh 100% pada bagian DPP sampai dengan Rp 2 miliar.',
  sections: [
    {
      heading: 'Berlanjut hingga 31 Desember 2026 dengan PMK 90/2025 (DTP 100% Setahun Penuh)',
      paragraphs: [
        'Melanjutkan stimulus PMK 7/2024, PMK 61/2024, dan PMK 13/2025 jo. PMK 60/2025, pemerintah menerbitkan PMK Nomor 90 Tahun 2025 pada akhir Desember 2025 untuk menjaga daya beli sektor perumahan sepanjang Tahun Anggaran 2026 (1 Januari–31 Desember 2026).',
        'Sama seperti Semester II 2025 pasca PMK 60/2025, PMK 90/2025 menetapkan besaran PPN DTP sebesar 100% atas bagian Dasar Pengenaan Pajak (DPP) sampai dengan Rp 2 miliar untuk rumah tapak baru atau satuan rumah susun baru dengan Harga Jual maksimal Rp 5 miliar dan serah terima (BAST) 1 Januari–31 Desember 2026. Selisih harga di atas Rp 2 miliar s.d. Rp 5 miliar tetap dipungut PPN efektif 11% (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024).',
      ],
    },
    {
      heading: 'Batas mutlak Rp 5 miliar dan ketentuan satu NIK/NPWP per unit',
      paragraphs: [
        'Apabila Harga Jual properti melebihi Rp 5 miliar, seluruh transaksi gugur dari fasilitas PPN DTP dan pembeli menanggung PPN efektif 11% secara penuh. Setiap satu Orang Pribadi (ber-NPWP atau NIK tervalidasi) hanya dapat memanfaatkan fasilitas PMK 90/2025 untuk pembelian satu unit properti siap huni yang memiliki kode identitas rumah dari aplikasi Sikumbang/Kementerian PKP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 13/2025 & PMK 60/2025 (TA 2025)',
    newHeader: 'PMK 90 Tahun 2025 (TA 2026)',
    rows: [
      {
        aspek: 'Tarif dasar PPN acuan atas properti umum',
        aturanLama: 'Efektif 11% (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024)',
        aturanBaru: 'Tetap efektif 11% (12% × DPP Nilai Lain 11/12)',
      },
      {
        aspek: 'PPN DTP atas bagian DPP s.d. Rp 2 miliar',
        aturanLama: 'Semula 100% (Sem I) & 50% (Sem II), lalu menjadi 100% penuh via PMK 60/2025',
        aturanBaru: '100% penuh sepanjang 1 Januari – 31 Desember 2026 (Semester I & II)',
      },
      {
        aspek: 'Plafon Harga Jual & syarat pemanfaatan',
        aturanLama: 'Maksimal Rp 5 miliar; 1 unit per Orang Pribadi',
        aturanBaru: 'Tetap maksimal Rp 5 miliar; wajib BAST & kode identitas rumah 2026',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah baru Rp 3 miliar dengan BAST Tahun 2026 (PMK 90/2025 — DTP 100%)',
    scenario:
      'Wajib Pajak membeli rumah tapak baru seharga Rp 3.000.000.000 (belum termasuk PPN) dengan serah terima pada Tahun 2026 sesuai PMK 90/2025. Bagian Rp 2.000.000.000 mendapat DTP 100% (Rp 220 jt ditanggung negara), sedangkan selisih Rp 1.000.000.000 dikenai PPN efektif 11% = Rp 110.000.000 dibayar pembeli.',
    presetRegime: 'ppn_dtp_properti_pmk13_2025',
    presetInput: {
      ppn: {
        hargaJualDpp: 3000000000,
        goodsType: 'umum',
        termasukPpn: false,
        periodePropertiDtp: 'ta_2026_100_pmk90',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk13_2025DtpPropertiRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJualDpp);
    const period = input.periodePropertiDtp ?? 'ta_2026_100_pmk90';
    const dtpShare = period === 'jul_des_2025_50' ? 0.5 : 1;

    const effectivePpnRate = 0.11; // 12% x 11/12 per PMK 131/2024 untuk rumah non-hunian-mewah <= 5M
    const ppnPenuh = Math.round(hargaJual * effectivePpnRate);
    const eligibleMax5M = hargaJual <= 5000000000;
    const dppBagianDtp = eligibleMax5M ? Math.min(hargaJual, 2000000000) : 0;
    const ppnBagian2M = Math.round(dppBagianDtp * effectivePpnRate);
    const ppnDitanggungPemerintah = Math.round(ppnBagian2M * dtpShare);
    const ppnDibayarPembeli = Math.max(0, ppnPenuh - ppnDitanggungPemerintah);
    const totalBayar = hargaJual + ppnDibayarPembeli;
    const effRatePembeli = hargaJual > 0 ? (ppnDibayarPembeli / hargaJual) * 100 : 0;

    const periodNote =
      period === 'ta_2026_100_pmk90'
        ? 'Jan–Des 2026 (DTP 100% — Perpanjangan PMK 90/2025)'
        : period === 'jan_jun_2025_100'
        ? 'Jan–Jun 2025 (DTP 100% — PMK 13/2025)'
        : period === 'jul_des_2025_100_pmk60'
        ? 'Jul–Des 2025 (DTP 100% — Perluasan PMK 60/2025)'
        : 'Jul–Des 2025 skema awal PMK 13/2025 sebelum PMK 60/2025 (DTP 50%)';

    const steps: CalculationStep[] = [
      { label: 'Harga jual properti (batas maksimal PMK 90/2025 & PMK 13/2025 = Rp 5 miliar)', value: hargaJual },
      {
        label: 'PPN terutang normal sebelum insentif (12% x DPP 11/12 = 11% efektif)',
        value: ppnPenuh,
      },
      {
        label: 'Bagian DPP yang mendapat fasilitas DTP (maksimal Rp 2 miliar)',
        formula: eligibleMax5M
          ? `Harga <= Rp 5 M -> bagian DPP DTP ${formatRupiah(dppBagianDtp)}`
          : 'Harga > Rp 5 M -> Gugur dari fasilitas PPN DTP',
        value: dppBagianDtp,
      },
      {
        label: `PPN Ditanggung Pemerintah (DTP ${dtpShare * 100}%)`,
        formula: eligibleMax5M
          ? `${dtpShare * 100}% x ${formatPersen(11)} x ${formatRupiah(dppBagianDtp)}`
          : 'Rp 0 (Melebihi pagu Rp 5 miliar)',
        value: -ppnDitanggungPemerintah,
        isNegative: true,
      },
      {
        label: 'PPN yang wajib dibayar oleh pembeli',
        formula: `${formatRupiah(ppnPenuh)} - ${formatRupiah(ppnDitanggungPemerintah)}`,
        value: ppnDibayarPembeli,
        isHighlight: true,
      },
      { label: 'Total harga + PPN dibayar pembeli', value: totalBayar },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Dibayar Pembeli (Setelah DTP)',
      primaryTaxAmount: ppnDibayarPembeli,
      annualTaxLabel: 'PPN Ditanggung Pemerintah (DTP)',
      annualTaxAmount: ppnDitanggungPemerintah,
      effectiveRatePercent: effRatePembeli,
      effectiveRateLabel: 'Beban PPN efektif atas harga jual',
      takeHomeOrNetLabel: 'Total Pembayaran Pembeli ke Developer',
      takeHomeOrNetAmount: totalBayar,
      steps,
      notes: [
        eligibleMax5M
          ? `Pada periode ${periodNote}, pembeli menghemat PPN sebesar ${formatRupiah(ppnDitanggungPemerintah)} yang ditanggung APBN.`
          : 'Karena Harga Jual melebihi Rp 5.000.000.000, seluruh transaksi tidak berhak memperoleh PPN DTP sesuai PMK 90/2025 jo. PMK 13/2025.',
      ],
    };
  },
};
