import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_60_2022, SRC.PMK_48_2020, SRC.PMK_50_2025, SRC.PMK_68_2022];

const regime: TaxRegime = {
  id: 'ppn_pmse_pmk60_2022',
  taxType: 'ppn',
  name: 'PMK 48/2020 jo. PMK 60/2022 (PPN PMSE Digital Asing) & Transisi Kripto PMK 50/2025',
  shortName: '2020–Kini (PPN PMSE & Kripto)',
  legalBasis: 'PMK 48/PMK.03/2020, PMK 60/PMK.03/2022, PMK 68/2022, & PMK 50/2025',
  effectivePeriod: '1 Juli 2020 – Sekarang (PPN Koin Kripto Dihapus per 1 Ags 2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Platform digital asing PMSE (11% eff.) & Kripto bebas PPN',
  summary:
    'Pemungutan PPN atas produk digital dari luar negeri via Perdagangan Melalui Sistem Elektronik (PMSE — Netflix, Spotify, cloud, App Store): 10% (2020–Mar 2022) -> 11% (Apr 2022–Sekarang mengikuti formula efektif PMK 131/2024). Sekaligus merekam peralihan PPN atas transaksi koin kripto dari 0,11%–0,22% (PMK 68/2022) menjadi 0% / bukan objek PPN sejak 1 Agustus 2025 (PMK 50/2025).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk60-2022-pmse',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Produk Digital Luar Negeri (PMSE — PMK 60/2022) & Penghapusan PPN Kripto (PMK 50/2025)',
  legalBasis: 'PMK 48/PMK.03/2020, PMK 60/PMK.03/2022, PMK 68/2022 & PMK 50/2025',
  effectiveDate: '1 Juli 2020 (Revisi PPN Kripto 0% mulai 1 Agustus 2025)',
  readMinutes: 5,
  summary:
    'Bagaimana Indonesia menarik PPN atas langganan aplikasi, streaming, dan layanan cloud global lewat PMSE (efektif 11% kini), serta dicabutnya PPN atas perdagangan koin aset kripto mulai Agustus 2025.',
  sections: [
    {
      heading: 'Mekanisme PPN PMSE lintas negara (PMK 48/2020 -> PMK 60/2022)',
      paragraphs: [
        'Sejak 1 Juli 2020 melalui PMK 48/PMK.03/2020 dan dilanjutkan PMK 60/PMK.03/2022, pelaku usaha PMSE luar negeri yang nilai transaksinya di Indonesia melebihi Rp 600 juta/tahun (atau Rp 50 juta/bulan) dan diakses > 12.000 traffic/tahun ditunjuk oleh DJP sebagai Pemungut PPN atas penjualan jasa digital, perangkat lunak, film, musik, dan gim kepada konsumen Indonesia.',
        'Tarifnya mula-mula 10% (2020–Mar 2022), naik ke 11% (Apr 2022–Des 2024), dan di tahun 2025 tetap efektif 11% (12% × DPP 11/12) agar harga langganan digital konsumen ritel Indonesia tidak mengalami kenaikan beban pajak.',
      ],
    },
    {
      heading: 'Aset kripto di PMK 68/2022 (0,11%) vs PMK 50/2025 (Bebas PPN)',
      paragraphs: [
        'Khusus perdagangan aset kripto, selama Mei 2022–Juli 2025 (PMK 68/2022), pembeli aset kripto dikenai PPN besaran tertentu 0,11% (di bursa terdaftar Bappebti) atau 0,22% (non-terdaftar). Sejak 1 Agustus 2025 melalui PMK 50/2025, penyerahan koin kripto dipersamakan dengan surat berharga/aset keuangan sehingga tidak dikenai PPN (0%), hanya jasa platform/fee exchanger dan penambangan yang tetap terutang PPN.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 48/2020 & PMK 68/2022',
    newHeader: 'PMK 60/2022 (Kini) & PMK 50/2025',
    rows: [
      {
        aspek: 'Langganan jasa digital luar negeri (PMSE)',
        aturanLama: '10% (2020–Mar 2022)',
        aturanBaru: '11% efektif (12% × DPP 11/12 pada 2025+)',
      },
      {
        aspek: 'Penyerahan koin aset kripto',
        aturanLama: '0,11% (exchanger resmi) / 0,22% (non-resmi) — PMK 68/2022',
        aturanBaru: '0% / Tidak Dikenai PPN (setara surat berharga) — PMK 50/2025',
      },
    ],
  },
  caseExample: {
    title: 'Langganan layanan cloud / SaaS luar negeri Rp 10 juta melalui PMSE',
    scenario:
      'Perusahaan di Indonesia berlangganan lisensi perangkat lunak/cloud global dari pemungut PMSE terdaftar seharga Rp 10.000.000 (belum termasuk PPN). Dipungut PPN PMSE efektif 11% sebesar Rp 1.100.000.',
    presetRegime: 'ppn_pmse_pmk60_2022',
    presetInput: {
      ppn: {
        hargaJualDpp: 10000000,
        goodsType: 'umum',
        termasukPpn: false,
        pmseChannel: 'pmse_jasa_digital',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk60_2022PmseRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const channel = input.pmseChannel ?? 'pmse_jasa_digital';
    let rate = 11;
    let label = 'PPN Jasa Digital Luar Negeri PMSE (12% x 11/12 = 11% efektif — PMK 60/2022 jo. PMK 131/2024)';
    if (channel === 'aset_kripto_pmk50_2025') {
      rate = 0;
      label = 'Penyerahan Koin Kripto (0% / Bukan Objek PPN sejak 1 Ags 2025 — PMK 50/2025)';
    } else if (channel === 'aset_kripto_pmk68_2022') {
      rate = 0.11;
      label = 'Penyerahan Koin Kripto Bursa Terdaftar (Historis 0,11% — PMK 68/2022)';
    }

    const dpp = input.termasukPpn ? Math.round(raw / (1 + rate / 100)) : raw;
    const ppn = Math.round((dpp * rate) / 100);
    const total = dpp + ppn;

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi / langganan digital (DPP)', value: dpp },
      { label: 'Tarif PPN', formula: label, value: rate, format: 'percent' },
      {
        label: 'PPN PMSE dipungut platform / exchanger',
        formula: `${formatRupiah(dpp)} x ${formatPersen(rate)}`,
        value: ppn,
        isHighlight: true,
      },
      { label: 'Total tagihan dibayar konsumen', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: channel === 'aset_kripto_pmk50_2025' ? 'PPN Penyerahan Aset Kripto (0%)' : 'PPN PMSE Terutang',
      primaryTaxAmount: ppn,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Pembayaran Konsumen',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        channel === 'aset_kripto_pmk50_2025'
          ? 'Sesuai PMK 50/2025 (berlaku 1 Agustus 2025), PPN 0,11%/0,22% atas penyerahan koin kripto dihapus; hanya jasa fee transaksi exchanger dan penambangan yang dikenai PPN.'
          : 'Dokumen bukti pungut PMSE yang mencantumkan identitas PKP pembeli di Indonesia dipersamakan kedudukannya dengan Faktur Pajak Masukan yang dapat dikreditkan.',
      ],
    };
  },
};
