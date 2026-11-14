import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_12_2025, SRC.PMK_8_2024, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_dtp_ev_pmk12_2025',
  taxType: 'ppn',
  name: 'PMK 12/2025 jo. PMK 8/2024 (PPN DTP Kendaraan Listrik Berbasis Baterai / KBLBB)',
  shortName: '2024–2025 (PPN DTP Mobil/Bus Listrik)',
  legalBasis: 'PMK Nomor 12 Tahun 2025 jo. PMK Nomor 8 Tahun 2024',
  effectivePeriod: '1 Januari 2025 – 31 Desember 2025',
  isCurrent: true,
  currentScopeLabel: 'Berlaku 2025 — KBLBB Roda 4 TKDN >= 40% (bayar 2%) & Bus TKDN >= 20% (bayar 7%)',
  summary:
    'Insentif PPN DTP Kendaraan Listrik (KBLBB) Tahun Anggaran 2025 dalam PMK 12/2025: mobil listrik & bus dengan TKDN >= 40% mendapat DTP 10% dari tarif PPN 12% (pembeli bayar 2%), sedangkan bus TKDN 20%–<40% mendapat DTP 5% (pembeli bayar 7%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk12-2025-dtp-ev',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN DTP Kendaraan Listrik (KBLBB) 2025: Hitungan 10% DTP dari Tarif 12% dalam PMK 12/2025',
  legalBasis: 'PMK Nomor 12 Tahun 2025 (Melanjutkan PMK 8/2024 & PMK 38/2023)',
  effectiveDate: '1 Januari 2025 – 31 Desember 2025',
  readMinutes: 4,
  summary:
    'Membedah skema PPN DTP 10% dan 5% untuk mobil dan bus listrik ber-TKDN sesuai PMK 12/2025 di tengah berlakunya tarif PPN 12% pada tahun 2025, sekaligus perbandingannya terhadap era PMK 8/2024 (bayar 1%).',
  sections: [
    {
      heading: 'Mengapa pembeli KBLBB membayar 2% di 2025 (dibanding 1% di 2024)?',
      paragraphs: [
        'Kendaraan bermotor listrik berbasis baterai (KBLBB) pada PMK 12 Tahun 2025 tetap memperoleh besaran PPN Ditanggung Pemerintah (DTP) sebesar 10% dari Harga Jual untuk unit dengan Tingkat Komponen Dalam Negeri (TKDN) minimal 40%, serta 5% dari Harga Jual untuk bus listrik TKDN 20% sampai dengan kurang dari 40%.',
        'Karena mulai 1 Januari 2025 tarif PPN undang-undang adalah 12% atas penyerahan kendaraan mewah/tertentu (sebelumnya 11% di TA 2024), maka selisih PPN yang wajib dibayar oleh konsumen pada PMK 12/2025 menjadi 2% (12% − 10% DTP) untuk mobil listrik TKDN >= 40% dan 7% (12% − 5% DTP) untuk bus listrik TKDN 20%–<40%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 8/2024 (TA 2024 — Tarif Dasar 11%)',
    newHeader: 'PMK 12/2025 (TA 2025 — Tarif Dasar 12%)',
    rows: [
      {
        aspek: 'KBLBB Roda 4 & Bus TKDN >= 40%',
        aturanLama: 'DTP 10% -> Pembeli bayar 1%',
        aturanBaru: 'DTP 10% -> Pembeli bayar 2%',
      },
      {
        aspek: 'Bus KBLBB TKDN 20% s.d. < 40%',
        aturanLama: 'DTP 5% -> Pembeli bayar 6%',
        aturanBaru: 'DTP 5% -> Pembeli bayar 7%',
      },
    ],
  },
  caseExample: {
    title: 'Pembelian mobil listrik CKD (TKDN >= 40%) seharga Rp 450 juta pada 2025',
    scenario:
      'Konsumen membeli mobil listrik rakitan lokal ber-TKDN >= 40% dengan Harga Jual DPP Rp 450.000.000 di tahun 2025. PPN 12% = Rp 54.000.000, DTP 10% = Rp 45.000.000, sehingga pembeli cukup membayar PPN 2% = Rp 9.000.000.',
    presetRegime: 'ppn_dtp_ev_pmk12_2025',
    presetInput: {
      ppn: {
        hargaJualDpp: 450000000,
        goodsType: 'barang_mewah',
        termasukPpn: false,
        skemaEvDtp: 'kblbb_tkdn40_pmk12_2025',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk12_2025DtpEvRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const dpp = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaEvDtp ?? 'kblbb_tkdn40_pmk12_2025';
    const basePpnRate = skema === 'kblbb_tkdn40_pmk8_2024' ? 11 : 12;
    const dtpRate = skema === 'bus_tkdn20_pmk12_2025' ? 5 : 10;
    const buyerRate = basePpnRate - dtpRate;

    const ppnPenuh = Math.round((dpp * basePpnRate) / 100);
    const ppnDtp = Math.round((dpp * dtpRate) / 100);
    const ppnPembeli = Math.max(0, ppnPenuh - ppnDtp);
    const totalBayar = dpp + ppnPembeli;

    const steps: CalculationStep[] = [
      { label: 'Harga jual KBLBB (Dasar Pengenaan Pajak)', value: dpp },
      {
        label: `PPN terutang penuh sebelum DTP (${basePpnRate}%)`,
        formula: `${basePpnRate}% x ${formatRupiah(dpp)}`,
        value: ppnPenuh,
      },
      {
        label: `PPN Ditanggung Pemerintah (DTP ${dtpRate}%)`,
        formula: `${dtpRate}% x ${formatRupiah(dpp)}`,
        value: -ppnDtp,
        isNegative: true,
      },
      {
        label: `PPN yang dibayar konsumen (${formatPersen(buyerRate)})`,
        formula: `${formatPersen(basePpnRate)} - ${formatPersen(dtpRate)} DTP = ${formatPersen(buyerRate)}`,
        value: ppnPembeli,
        isHighlight: true,
      },
      { label: 'Total pembayaran kendaraan listrik (Harga + PPN Dibayar)', value: totalBayar },
    ];

    return {
      regime,
      primaryTaxLabel: `PPN Dibayar Konsumen (${formatPersen(buyerRate)})`,
      primaryTaxAmount: ppnPembeli,
      annualTaxLabel: `PPN DTP Negara (${formatPersen(dtpRate)})`,
      annualTaxAmount: ppnDtp,
      effectiveRatePercent: buyerRate,
      takeHomeOrNetLabel: 'Total Harga OTR Dasar Sebelum BBNKB',
      takeHomeOrNetAmount: totalBayar,
      steps,
      notes: [
        skema === 'kblbb_tkdn40_pmk8_2024'
          ? 'Simulasi memakai patokan PMK 8/2024 (TA 2024, tarif PPN 11% sehingga DTP 10% menyisakan 1% untuk pembeli).'
          : `Pada PMK 12/2025 (TA 2025), DTP tetap ${dtpRate}% namun tarif dasar PPN menjadi 12%, sehingga porsi yang dibayar konsumen adalah ${formatPersen(buyerRate)}.`,
      ],
    };
  },
};
