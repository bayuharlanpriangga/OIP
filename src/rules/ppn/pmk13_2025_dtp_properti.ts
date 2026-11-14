import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_13_2025, SRC.PMK_61_2024, SRC.PMK_7_2024, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_dtp_properti_pmk13_2025',
  taxType: 'ppn',
  name: 'PMK 13/2025 jo. PMK 61/2024 & PMK 7/2024 (PPN DTP Rumah Tapak & Rusun)',
  shortName: '2024–2025 (PPN DTP Properti)',
  legalBasis: 'PMK Nomor 13 Tahun 2025 jo. PMK 61/2024 & PMK 7/2024',
  effectivePeriod: '1 Januari 2025 – 31 Desember 2025 (Melanjutkan Insentif 2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku 2025 — Pembelian rumah tapak/rusun baru siap huni <= Rp 5 M',
  summary:
    'Fasilitas PPN Ditanggung Pemerintah (DTP) atas penyerahan rumah tapak atau satuan rumah susun baru dengan harga jual paling tinggi Rp 5 miliar: DTP diberikan atas bagian DPP s.d. Rp 2 miliar sebesar 100% untuk periode 1 Januari–30 Juni 2025 dan 50% untuk periode 1 Juli–31 Desember 2025.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk13-2025-dtp-properti',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN DTP Properti Tahun 2025 (PMK 13/2025): Pembebasan 100% dan 50% hingga DPP Rp 2 Miliar',
  legalBasis: 'PMK Nomor 13 Tahun 2025 (Ditetapkan 4 Februari 2025)',
  effectiveDate: '1 Januari 2025 – 31 Desember 2025',
  readMinutes: 5,
  summary:
    'Simulasi dan ketentuan lengkap PPN DTP pembelian rumah tapak/rusun baru maksimal Rp 5 miliar sepanjang 2025, termasuk proporsi pajak yang ditanggung negara vs yang wajib dibayar pembeli jika harga rumah di antara Rp 2 miliar dan Rp 5 miliar.',
  sections: [
    {
      heading: 'Skema 2 tahap periode penyerahan (BAST) di PMK 13/2025',
      paragraphs: [
        'Melanjutkan stimulus PMK 7/2024 dan PMK 61/2024, pemerintah menerbitkan PMK Nomor 13 Tahun 2025 untuk menjaga daya beli sektor properti sepanjang 2025. Fasilitas PPN DTP berlaku untuk rumah tapak baru dan satuan rumah susun baru yang telah memperoleh kode identitas rumah dan dilakukan Berita Acara Serah Terima (BAST) pada periode insentif.',
        'Aturannya menetapkan batas Harga Jual maksimal Rp 5.000.000.000, namun bagian DPP yang ditanggung pemerintah dibatasi paling tinggi Rp 2.000.000.000: (1) BAST 1 Januari – 30 Juni 2025 memperoleh DTP 100% atas bagian DPP s.d. Rp 2 miliar; (2) BAST 1 Juli – 31 Desember 2025 memperoleh DTP 50% atas bagian DPP s.d. Rp 2 miliar. Untuk harga rumah di atas Rp 2 miliar hingga Rp 5 miliar, selisih di atas Rp 2 miliar tetap dipungut PPN normal efektif 11% (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024).',
      ],
    },
    {
      heading: 'Batas mutlak Rp 5 miliar dan satu orang pribadi per unit',
      paragraphs: [
        'Jika Harga Jual properti melebihi Rp 5 miliar, seluruh transaksi gugur dari fasilitas PPN DTP dan pembeli menanggung PPN secara penuh. Setiap satu Orang Pribadi (ber-NPWP atau NIK tervalidasi) hanya dapat memanfaatkan fasilitas ini untuk pembelian satu unit properti.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 7/2024 & PMK 61/2024 (TA 2024)',
    newHeader: 'PMK 13/2025 (TA 2025)',
    rows: [
      {
        aspek: 'Tarif dasar PPN acuan atas properti umum',
        aturanLama: '11% (UU HPP)',
        aturanBaru: 'Efektif 11% (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024)',
      },
      {
        aspek: 'PPN DTP Periode Semester I (Jan–Jun)',
        aturanLama: '100% atas bagian DPP s.d. Rp 2 miliar',
        aturanBaru: '100% atas bagian DPP s.d. Rp 2 miliar (1 Jan – 30 Jun 2025)',
      },
      {
        aspek: 'PPN DTP Periode Semester II (Jul–Des)',
        aturanLama: 'Semula 50%, lalu dinaikkan jadi 100% (Sep–Des via PMK 61/2024)',
        aturanBaru: '50% atas bagian DPP s.d. Rp 2 miliar (1 Jul – 31 Des 2025)',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian rumah baru Rp 3 miliar dengan BAST Maret 2025 (DTP 100%)',
    scenario:
      'Wajib Pajak membeli rumah tapak baru seharga Rp 3.000.000.000 (belum termasuk PPN) dengan serah terima Maret 2025. Bagian Rp 2.000.000.000 mendapat DTP 100% (Rp 220 jt ditanggung negara), sedangkan selisih Rp 1.000.000.000 dikenai PPN efektif 11% = Rp 110.000.000 dibayar pembeli.',
    presetRegime: 'ppn_dtp_properti_pmk13_2025',
    presetInput: {
      ppn: {
        hargaJualDpp: 3000000000,
        goodsType: 'umum',
        termasukPpn: false,
        periodePropertiDtp: 'jan_jun_2025_100',
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
    const period = input.periodePropertiDtp ?? 'jan_jun_2025_100';
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

    const steps: CalculationStep[] = [
      { label: 'Harga jual properti (batas maksimal PMK 13/2025 = Rp 5 miliar)', value: hargaJual },
      {
        label: 'PPN terutang normal sebelum insentif (12% x DPP 11/12 = 11% efektif)',
        value: ppnPenuh,
      },
      {
        label: 'Bagian DPP yang mendapat fasilitas DTP (maksimal Rp 2 miliar)',
        formula: eligibleMax5M
          ? `Harga <= Rp 5 M -> bagian DPP DTP ${formatRupiah(dppBagianDtp)}`
          : 'Harga > Rp 5 M -> Gugur dari fasilitas PPN DTP (PMK 13/2025)',
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
          ? `Pada periode ${period === 'jan_jun_2025_100' ? 'Jan–Jun 2025 (DTP 100%)' : 'Jul–Des 2025 (DTP 50%)'}, pembeli menghemat PPN sebesar ${formatRupiah(ppnDitanggungPemerintah)} yang ditanggung APBN.`
          : 'Karena Harga Jual melebihi Rp 5.000.000.000, seluruh transaksi tidak berhak memperoleh PPN DTP sesuai Pasal 4 PMK 13/2025.',
      ],
    };
  },
};
