import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_12_2023, SRC.PP_29_2024, SRC.PMK_69_2024, SRC.PMK_130_2020];

const regime: TaxRegime = {
  id: 'badan_pp12_2023_ikn',
  taxType: 'pph_badan',
  name: 'PP 12/2023 jo. PP 29/2024 (Tax Holiday IKN & Daerah Mitra 100% s.d. 30 Tahun + Super Tax Deduction)',
  shortName: '2023–Sekarang (Insentif Fiskal IKN & Financial Center)',
  legalBasis: 'PP Nomor 12 Tahun 2023 jo. PP Nomor 29 Tahun 2024 & PMK Nomor 69 Tahun 2024',
  effectivePeriod: '6 Maret 2023 – Sekarang (Revisi PP 29/2024 & PMK 69/2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tax Holiday IKN 100% (min Rp 10 M), Financial Center, & Super Deduction 350%',
  summary:
    'Paket insentif PPh Badan terlengkap untuk investasi di Ibu Kota Nusantara (IKN) & Daerah Mitra (PP 12/2023 jo. PP 29/2024): (1) Pengurangan PPh Badan 100% (Tax Holiday) mulai investasi minimal Rp 10 miliar (jauh di bawah standar nasional Rp 100 miliar di PMK 130/2020); (2) Tax Holiday sektor Financial Center di IKN; dan (3) Super Tax Deduction litbang (R&D) hingga 350% & vokasi hingga 250%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pp12-2023-ikn',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Fasilitas Tax Holiday IKN & Super Tax Deduction 350%: PP Nomor 12 Tahun 2023 jo. PP Nomor 29 Tahun 2024',
  legalBasis: 'PP Nomor 12 Tahun 2023 jo. PP Nomor 29 Tahun 2024',
  effectiveDate: '6 Maret 2023 (Diperbarui PP 29/2024 pada 12 Agustus 2024)',
  readMinutes: 5,
  summary:
    'Membandingkan kemudahan syarat investasi minimum Rp 10 miliar dan tarif pengurangan PPh Badan hingga 100% selama 10–30 tahun di kawasan IKN dibandingkan skema Tax Holiday nasional PMK 130/2020 jo. PMK 69/2024.',
  sections: [
    {
      heading: 'Ambang investasi Rp 10 miliar & durasi Tax Holiday hingga 30 tahun',
      paragraphs: [
        'Melalui PP Nomor 12 Tahun 2023 (yang diperluas ke Daerah Mitra oleh PP Nomor 29 Tahun 2024), Wajib Pajak badan dalam negeri yang menanamkan modal minimal Rp 10 miliar di IKN pada bidang usaha infrastruktur, layanan umum, atau bangkitan ekonomi berhak memperoleh pengurangan PPh Badan sebesar 100% selama 10 hingga 30 tahun pajak (tergantung tahun mulai investasi dan sektor), disusul masa transisi pengurangan 50% atau tarif khusus sektor keuangan.',
        'Khusus lembaga keuangan, perbankan, asuransi, dan pengelolaan investasi di Financial Center IKN, diberikan fasilitas pengurangan PPh Badan sebesar 100% atau 85% sesuai klasifikasi waktu dan aktivitas. Sementara untuk kegiatan riset (litbang/R&D) tertentu di IKN tersedia tambahan pengurangan penghasilan bruto hingga 350% (di atas standar PP 45/2019 sebesar 300%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tax Holiday Nasional (PMK 130/2020 jo. PMK 69/2024)',
    newHeader: 'Tax Holiday Khusus IKN (PP 12/2023 jo. PP 29/2024)',
    rows: [
      {
        aspek: 'Nilai investasi minimum',
        aturanLama: 'Rp 100 miliar (mini tax holiday) / Rp 500 miliar (penuh)',
        aturanBaru: 'Rp 10 miliar sudah memenuhi syarat Tax Holiday 100%',
      },
      {
        aspek: 'Jangka waktu pengurangan 100%',
        aturanLama: '5 s.d. 20 tahun pajak',
        aturanBaru: '10 s.d. 30 tahun pajak (tergantung sektor & fase investasi)',
      },
      {
        aspek: 'Super Tax Deduction R&D',
        aturanLama: 'Maksimal 300% (PP 45/2019)',
        aturanBaru: 'Hingga 350% dari biaya litbang tertentu di IKN',
      },
    ],
  },
  caseExample: {
    title: 'Investasi pusat data / layanan publik di IKN Rp 50 miliar dengan PKP Rp 20 miliar',
    scenario:
      'Korporasi menanamkan modal baru di IKN senilai Rp 50 miliar (melampaui batas minimal Rp 10 miliar PP 12/2023) dan membukukan PKP dari kegiatan tersebut sebesar Rp 20 miliar.',
    presetRegime: 'badan_pp12_2023_ikn',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 80000000000,
        penghasilanKenaPajak: 20000000000,
        isTbk: false,
        nilaiInvestasiAtauRnd: 50000000000,
        skemaIknPfii: 'ikn_tax_holiday_100',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPp12_2023IknRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkp = Math.max(0, input.penghasilanKenaPajak);
    const nilaiInvestasi = Math.max(0, input.nilaiInvestasiAtauRnd ?? 0);
    const skema = input.skemaIknPfii ?? 'ikn_tax_holiday_100';
    const pphNormal = Math.round(pkp * 0.22);

    let pphTerutang = pphNormal;
    let penghematan = 0;
    let keterangan = '';

    if (skema === 'ikn_supertax_350') {
      const tambahanDeduction = Math.round(nilaiInvestasi * 2.5); // total 350% = 100% pokok + 250% tambahan
      const pkpSetelahSuper = Math.max(0, pkp - tambahanDeduction);
      pphTerutang = Math.round(pkpSetelahSuper * 0.22);
      penghematan = Math.max(0, pphNormal - pphTerutang);
      keterangan = 'Tambahan pengurang bruto 250% (total 350% biaya R&D IKN)';
    } else if (skema === 'financial_center_ikn') {
      const eligible = nilaiInvestasi >= 10000000000;
      pphTerutang = eligible ? Math.round(pphNormal * 0.15) : pphNormal; // contoh klaster pengurangan 85% / 100%
      penghematan = Math.max(0, pphNormal - pphTerutang);
      keterangan = eligible
        ? 'Simulasi klaster Financial Center IKN (pengurangan 85% -> bayar 15% dari normal)'
        : 'Investasi < Rp 10 miliar -> tidak memenuhi syarat minimum PP 12/2023';
    } else {
      const eligible = nilaiInvestasi >= 10000000000;
      pphTerutang = eligible ? 0 : pphNormal;
      penghematan = Math.max(0, pphNormal - pphTerutang);
      keterangan = eligible
        ? 'Investasi ≥ Rp 10 M -> Pengurangan PPh Badan 100% (Tax Holiday IKN)'
        : 'Investasi < Rp 10 M -> Tarif normal 22%';
    }

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak (PKP) dari kegiatan usaha di IKN', value: pkp },
      { label: 'PPh Badan normal sebelum insentif IKN (22%)', value: pphNormal },
      { label: keterangan, value: -penghematan, isNegative: true },
      { label: 'PPh Badan dibayar setelah fasilitas IKN', value: pphTerutang, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Setelah Fasilitas IKN',
      primaryTaxAmount: pphTerutang,
      annualTaxLabel: 'Penghematan Pajak IKN Setahun',
      annualTaxAmount: penghematan,
      effectiveRatePercent: pkp > 0 ? (pphTerutang / pkp) * 100 : 0,
      effectiveRateLabel: `Tarif efektif (${formatPersen(pkp > 0 ? (pphTerutang / pkp) * 100 : 0)})`,
      takeHomeOrNetLabel: 'Laba Bersih Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, pkp - pphTerutang),
      steps,
      notes: [
        `PP 12/2023 jo. PP 29/2024 memangkas syarat investasi minimum Tax Holiday 100% menjadi Rp 10 miliar (dibanding Rp 100 miliar di PMK 130/2020) dan tetap memperhatikan klausul minimum pajak global (GMT 15% PMK 136/2024) bagi grup multinasional raksasa.`,
      ],
    };
  },
};
