import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_51_2025, SRC.PMK_81_2024, SRC.PMK_34_2017];

const regime: TaxRegime = {
  id: 'pph22_bbm_industri',
  taxType: 'pph22',
  name: 'PMK 51/2025 & PMK 34/2017 (PPh 22 BBM, BBG, Pelumas & Industri Tertentu)',
  shortName: '2017–Kini (BBM & Industri Khusus)',
  legalBasis: 'PMK Nomor 51 Tahun 2025 Pasal 2 jo. PMK 34/PMK.010/2017 (Sektor Industri)',
  effectivePeriod: '1 April 2017 – Sekarang (Diperbarui di PMK 51/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Penebusan BBM/BBG, semen, baja, otomotif, farmasi',
  summary:
    'Pungutan PPh Pasal 22 produsen atas penjualan BBM SPBU Pertamina (0,25% final), BBM SPBU swasta/non-SPBU (0,3% final/kredit), BBG & pelumas (0,3%), semen (0,25%), kertas (0,1%), baja (0,3%), otomotif (0,45%), dan farmasi (0,3%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-bbm-industri',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Tarif Khusus PPh Pasal 22 BBM, BBG, Pelumas, Semen, Baja, Otomotif, dan Farmasi',
  legalBasis: 'PMK Nomor 51 Tahun 2025 jo. PMK 34/PMK.010/2017 & PMK 81/2024',
  effectiveDate: '1 April 2017 (Kodifikasi Terkini 1 Agustus 2025)',
  readMinutes: 4,
  summary:
    'Selain impor dan belanja instansi, Pasal 22 UU PPh memberi kewenangan kepada produsen/importir migas, semen, kertas, baja, otomotif, dan farmasi memungut PPh Pasal 22 di tingkat distribusi awal (tarif 0,1%–0,45%).',
  sections: [
    {
      heading: 'Sifat Final vs Tidak Final pada penjualan BBM, BBG, dan Pelumas',
      paragraphs: [
        'Produsen atau importir bahan bakar minyak (BBM), bahan bakar gas (BBG), dan pelumas wajib memungut PPh Pasal 22 pada saat penerbitan surat perintah pengeluaran barang (delivery order): 0,25% untuk penjualan BBM ke SPBU/agen penyalur Pertamina; dan 0,3% untuk penjualan BBM ke SPBU selain Pertamina, konsumen akhir non-SPBU, BBG, dan pelumas.',
        'Aturan membedakan sifatnya secara tegas: penjualan BBM/BBG kepada penyalur atau agen bersifat Final, sedangkan penjualan kepada selain penyalur/agen (misalnya pembelian industri langsung) serta penjualan pelumas bersifat Tidak Final dan menjadi kredit pajak pembeli.',
      ],
    },
    {
      heading: 'Sektor industri strategis lain (Semen 0,25%, Baja 0,3%, Kertas 0,1%, Otomotif 0,45%)',
      paragraphs: [
        'Badan usaha yang bergerak di bidang industri semen, industri kertas, industri baja, industri otomotif, dan industri farmasi ditunjuk memungut PPh Pasal 22 atas penjualan hasil produksinya kepada distributor di dalam negeri dari DPP PPN dengan tarif masing-masing 0,25% (semen), 0,1% (kertas), 0,3% (baja dan farmasi), serta 0,45% (otomotif/ATPM). Seluruh pungutan sektor industri non-migas tersebut bersifat tidak final (kredit pajak distributor).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sektor Distribusi',
    newHeader: 'Tarif PPh 22 & Sifat Pemungutan (PMK 51/2025)',
    rows: [
      {
        aspek: 'Penebusan BBM SPBU Pertamina vs Non-Pertamina',
        aturanLama: 'Penyalur Pertamina: 0,25%',
        aturanBaru: '0,25% (Final penyalur Pertamina) · 0,3% (Swasta/Non-SPBU)',
      },
      {
        aspek: 'BBG & Pelumas / Baja / Farmasi',
        aturanLama: 'Distributor & penyalur',
        aturanBaru: '0,3% dari penjualan (BBG penyalur Final; Pelumas/Baja/Farmasi Kredit)',
      },
      {
        aspek: 'Kertas / Semen / Otomotif',
        aturanLama: 'Penjualan pabrikan dalam negeri',
        aturanBaru: '0,1% (Kertas) · 0,25% (Semen) · 0,45% (Otomotif) — Kredit Pajak',
      },
    ],
  },
  caseExample: {
    title: 'Penebusan BBM Rp 500 juta oleh agen penyalur SPBU Pertamina',
    scenario:
      'Pengusaha SPBU Pertamina menebus DO BBM senilai Rp 500.000.000 (tidak termasuk PPN). Dipungut PPh Pasal 22 Final sebesar 0,25% = Rp 1.250.000.',
    presetRegime: 'pph22_bbm_industri',
    presetInput: {
      pph22: {
        nilaiDasar: 500000000,
        objectType: 'impor_api',
        hasNpwp: true,
        sektorIndustri: 'bbm_spbu_pertamina',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

function getIndustriMeta(sektor: NonNullable<TaxCalculatorInput['pph22']['sektorIndustri']>) {
  switch (sektor) {
    case 'bbm_spbu_pertamina':
      return { rate: 0.25, label: 'BBM ke Penyalur / SPBU Pertamina (0,25% — Final)', isFinal: true };
    case 'bbm_spbu_non_pertamina':
      return { rate: 0.3, label: 'BBM ke SPBU Non-Pertamina / Non-Penyalur (0,3%)', isFinal: true };
    case 'bbg_pelumas':
      return { rate: 0.3, label: 'Penjualan Bahan Bakar Gas (BBG) & Pelumas (0,3%)', isFinal: false };
    case 'semen':
      return { rate: 0.25, label: 'Penjualan hasil produksi industri semen (0,25% — Tidak Final)', isFinal: false };
    case 'kertas':
      return { rate: 0.1, label: 'Penjualan hasil produksi industri kertas (0,1% — Tidak Final)', isFinal: false };
    case 'baja':
      return { rate: 0.3, label: 'Penjualan hasil produksi industri baja (0,3% — Tidak Final)', isFinal: false };
    case 'otomotif':
      return { rate: 0.45, label: 'Penjualan kendaraan bermotor ATPM/APM (0,45% — Tidak Final)', isFinal: false };
    case 'farmasi':
      return { rate: 0.3, label: 'Penjualan hasil produksi industri farmasi (0,3% — Tidak Final)', isFinal: false };
  }
}

export const pph22BbmIndustriRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const sektor = input.sektorIndustri ?? 'bbm_spbu_pertamina';
    const meta = getIndustriMeta(sektor);
    const effectiveRate = input.hasNpwp ? meta.rate : meta.rate * 2;
    const tax = Math.round((nilaiDasar * effectiveRate) / 100);
    const totalDibayarPembeli = nilaiDasar + tax;

    const steps: CalculationStep[] = [
      { label: 'Dasar Pengenaan Pajak (Harga Jual / DO non-PPN)', value: nilaiDasar },
      { label: 'Sektor & tarif dasar PMK 51/2025', formula: meta.label, value: meta.rate, format: 'percent' },
      ...(input.hasNpwp
        ? []
        : [
            {
              label: 'Sanksi tanpa NPWP/NIK (+100%)',
              formula: `2 x ${formatPersen(meta.rate)} = ${formatPersen(effectiveRate)}`,
              value: effectiveRate,
              format: 'percent' as const,
            },
          ]),
      {
        label: 'PPh Pasal 22 dipungut produsen/importir',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(effectiveRate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Total tagihan tebus ke pembeli (di luar PPN)', value: totalDibayarPembeli },
    ];

    return {
      regime,
      primaryTaxLabel: `PPh 22 Industri Khusus (${meta.isFinal ? 'Final Penyalur' : 'Kredit Pajak'})`,
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Pembayaran Pembeli + PPh 22 (non-PPN)',
      takeHomeOrNetAmount: totalDibayarPembeli,
      steps,
      notes: [
        meta.isFinal
          ? 'Pungutan BBM/BBG atas agen atau penyalur SPBU bersifat Final sehingga atas margin penyalur tersebut tidak dikenai PPh lagi pada SPT Tahunan.'
          : 'Pungutan PPh 22 atas industri semen, kertas, baja, otomotif, farmasi, dan pelumas bersifat Tidak Final (dapat dikreditkan di SPT Tahunan pembeli).',
      ],
    };
  },
};
