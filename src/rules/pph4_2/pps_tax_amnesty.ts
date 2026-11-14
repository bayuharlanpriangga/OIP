import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_11_2016, SRC.PMK_118_2016, SRC.UU_7_2021_HPP, SRC.PMK_196_2021];

const regime: TaxRegime = {
  id: 'pph4_2_pps_tax_amnesty',
  taxType: 'pph4_2',
  name: 'UU 11/2016 (Tax Amnesty 2016–2017) & UU HPP jo. PMK 196/2021 (PPS 2022)',
  shortName: '2016–2022 (Uang Tebusan TA & PPh Final PPS)',
  legalBasis: 'UU 11/2016 jo. PMK 118/PMK.03/2016 & Pasal 5–12 UU 7/2021 (HPP) jo. PMK 196/PMK.03/2021',
  effectivePeriod: '1 Juli 2016 – 31 Maret 2017 (TA) & 1 Januari – 30 Juni 2022 (PPS)',
  isCurrent: false,
  summary:
    'Mendokumentasikan tarif historis dua program pengungkapan harta sukarela terbesar di Indonesia: (1) Uang Tebusan Tax Amnesty UU 11/2016 (2%/3%/5% DN/Repatriasi, 4%/6%/10% Deklarasi LN, 0,5%/2% UMKM) dan (2) PPh Final PPS UU HPP PMK 196/2021 (Kebijakan I: 6%/8%/11% bagi peserta TA; Kebijakan II: 12%/14%/18% bagi WP OP atas harta 2016–2020).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pps-tax-amnesty',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Tarif Tax Amnesty (UU 11/2016) & Program Pengungkapan Sukarela / PPS (PMK 196/2021)',
  legalBasis: 'UU Nomor 11 Tahun 2016 & Pasal 5–12 UU Nomor 7 Tahun 2021 jo. PMK 196/PMK.03/2021',
  effectiveDate: '1 Juli 2016 – 30 Juni 2022 (Historis Pengujian Harta Bersih)',
  readMinutes: 6,
  summary:
    'Membandingkan struktur lapis tarif Uang Tebusan Pengampunan Pajak 2016–2017 dan tarif PPh Final PPS Tahun 2022 beserta kewajiban investasi SBN/hilirisasi SDA selama 5 tahun dan implikasi pemeriksaan PAS-Final.',
  sections: [
    {
      heading: 'Struktur Uang Tebusan Tax Amnesty 2016–2017 (UU 11/2016)',
      paragraphs: [
        'Pengampunan Pajak (Tax Amnesty) Jilid I pada 1 Juli 2016 – 31 Maret 2017 mengenakan tarif Uang Tebusan bertingkat berdasarkan periode penyampaian SPH dan lokasi harta: Deklarasi Dalam Negeri / Repatriasi 2% (Jul–Sep 2016), 3% (Okt–Des 2016), dan 5% (Jan–Mar 2017); Deklarasi Luar Negeri tanpa repatriasi 4% / 6% / 10%; serta tarif khusus UMKM 0,5% (total harta <= Rp 10 miliar) dan 2% (> Rp 10 miliar).',
      ],
    },
    {
      heading: 'Kebijakan I & Kebijakan II PPS Tahun 2022 (UU HPP jo. PMK 196/2021)',
      paragraphs: [
        'Pada 1 Januari – 30 Juni 2022, pemerintah menyelenggarakan PPS dengan dua skema PPh Final atas harta bersih: Kebijakan I untuk peserta TA atas harta perolehan s.d. 2015 yang belum diungkap (11% Deklarasi LN, 8% DN/Repatriasi, dan 6% bila diinvestasikan ke SBN / proyek hilirisasi SDA & EBT minimal 5 tahun).',
        'Kebijakan II berlaku khusus Wajib Pajak Orang Pribadi atas harta perolehan 2016–2020 yang belum dilaporkan di SPT Tahunan 2020: tarif 18% Deklarasi LN, 14% DN/Repatriasi, dan 12% bila diinvestasikan pada SBN / hilirisasi SDA & EBT.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Tax Amnesty (UU 11/2016)',
    newHeader: 'PPS Kebijakan I & II (PMK 196/2021)',
    rows: [
      {
        aspek: 'Tarif Deklarasi DN / Repatriasi standar',
        aturanLama: '2% (Periode I), 3% (Periode II), 5% (Periode III)',
        aturanBaru: '8% (Kebijakan I) / 14% (Kebijakan II OP)',
      },
      {
        aspek: 'Diskon investasi SBN / Hilirisasi SDA / EBT',
        aturanLama: 'Lock-up repatriasi 3 tahun (tanpa potongan tarif tambahan)',
        aturanBaru: 'Turun -2% menjadi 6% (Kebijakan I) atau 12% (Kebijakan II), lock-up 5 thn',
      },
      {
        aspek: 'Tarif Deklarasi Luar Negeri tanpa repatriasi',
        aturanLama: '4% / 6% / 10%',
        aturanBaru: '11% (Kebijakan I) / 18% (Kebijakan II OP)',
      },
    ],
  },
  caseExample: {
    title: 'Pengungkapan harta bersih dalam negeri Rp 2 miliar lewat PPS Kebijakan II (14%)',
    scenario:
      'Wajib Pajak Orang Pribadi mengungkapkan aset properti dalam negeri senilai bersih Rp 2.000.000.000 perolehan tahun 2019 melalui Kebijakan II PPS tanpa investasi SBN (tarif 14% = Rp 280.000.000; lebih rendah dibanding tarif sanksi 30% bila ditemukan pemeriksaan pajak).',
    presetRegime: 'pph4_2_pps_tax_amnesty',
    presetInput: {
      pph4_2: {
        nilaiBruto: 2000000000,
        objectType: 'sewa_tanah_bangunan',
        skemaTaPps: 'pps_k2_14',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

type TaPpsScheme = NonNullable<TaxCalculatorInput['pph4_2']['skemaTaPps']>;

const TA_PPS_META: Record<TaPpsScheme, { rate: number; label: string; group: string }> = {
  ta_dn_2: { rate: 2, label: 'TA 2016 Periode I — DN / Repatriasi (2%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_dn_3: { rate: 3, label: 'TA 2016 Periode II — DN / Repatriasi (3%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_dn_5: { rate: 5, label: 'TA 2017 Periode III — DN / Repatriasi (5%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_ln_4: { rate: 4, label: 'TA 2016 Periode I — Deklarasi Luar Negeri (4%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_ln_6: { rate: 6, label: 'TA 2016 Periode II — Deklarasi Luar Negeri (6%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_ln_10: { rate: 10, label: 'TA 2017 Periode III — Deklarasi Luar Negeri (10%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_umkm_0_5: { rate: 0.5, label: 'TA UMKM (Harta <= Rp 10 M) — Tarif Tunggal (0,5%)', group: 'Tax Amnesty (UU 11/2016)' },
  ta_umkm_2: { rate: 2, label: 'TA UMKM (Harta > Rp 10 M) — Tarif Tunggal (2%)', group: 'Tax Amnesty (UU 11/2016)' },
  pps_k1_6: { rate: 6, label: 'PPS 2022 Kebijakan I — DN/Repatriasi + Investasi SBN/Hilirisasi (6%)', group: 'PPS Kebijakan I (PMK 196/2021)' },
  pps_k1_8: { rate: 8, label: 'PPS 2022 Kebijakan I — Deklarasi DN / Repatriasi (8%)', group: 'PPS Kebijakan I (PMK 196/2021)' },
  pps_k1_11: { rate: 11, label: 'PPS 2022 Kebijakan I — Deklarasi Luar Negeri (11%)', group: 'PPS Kebijakan I (PMK 196/2021)' },
  pps_k2_12: { rate: 12, label: 'PPS 2022 Kebijakan II OP — DN/Repatriasi + Investasi SBN/Hilirisasi (12%)', group: 'PPS Kebijakan II (PMK 196/2021)' },
  pps_k2_14: { rate: 14, label: 'PPS 2022 Kebijakan II OP — Deklarasi DN / Repatriasi (14%)', group: 'PPS Kebijakan II (PMK 196/2021)' },
  pps_k2_18: { rate: 18, label: 'PPS 2022 Kebijakan II OP — Deklarasi Luar Negeri (18%)', group: 'PPS Kebijakan II (PMK 196/2021)' },
};

export const pph4_2PpsTaxAmnestyRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const hartaBersih = Math.max(0, input.nilaiBruto);
    const skema = input.skemaTaPps ?? 'pps_k2_14';
    const meta = TA_PPS_META[skema];
    const tax = Math.round((hartaBersih * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai harta bersih yang diungkapkan (Harta - Utang relevan)', value: hartaBersih },
      { label: `Skema ${meta.group}`, formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Uang Tebusan / PPh Final PPS terutang',
        formula: `${formatRupiah(hartaBersih)} x ${formatPersen(meta.rate)}`,
        value: tax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: skema.startsWith('ta_') ? 'Uang Tebusan Tax Amnesty' : 'PPh Final PPS Terutang',
      primaryTaxAmount: tax,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Harta Bersih Setelah Pajak Pengungkapan',
      takeHomeOrNetAmount: Math.max(0, hartaBersih - tax),
      steps,
      notes: [
        'Baik Tax Amnesty (2016–2017) maupun PPS (2022) telah berakhir masa pengajuannya; modul ini berfungsi sebagai pembanding beban tebusan terhadap sanksi pemeriksaan PAS-Final (200% di UU TA atau 30% + sanksi bunga di PPS).',
      ],
    };
  },
};
