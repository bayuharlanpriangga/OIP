import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_186_2022, SRC.PMK_78_2010, SRC.UU_42_2009, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'ppn_pmk186_2022_proporsional',
  taxType: 'ppn',
  name: 'PMK 186/PMK.03/2022 (Kredit Pajak Masukan Proporsional Penyerahan Campuran)',
  shortName: '2022–Kini (PM Proporsional Penyerahan Campuran)',
  legalBasis: 'Pasal 9 ayat (5)–(6) UU PPN & PMK 186/PMK.03/2022 (mencabut PMK 78/2010)',
  effectivePeriod: '12 Desember 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — PKP Penyerahan Terutang & Dibebaskan/Tidak Terutang',
  summary:
    'Menghitung Pajak Masukan (PM) awal yang boleh dikreditkan menggunakan perkiraan persentase penyerahan terutang (Z) serta koreksi pengkreditan ulang tahunan (Delta P) di SPT Masa bulan ke-3 berdasarkan realisasi penyerahan (Z\') dan masa manfaat (1, 4, atau 10 tahun).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk186-2022-proporsional',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Pengkreditan Pajak Masukan Proporsional untuk Penyerahan Campuran (PMK 186/PMK.03/2022)',
  legalBasis: 'Pasal 9 ayat (5)–(6) UU PPN jo. PMK 186/PMK.03/2022',
  effectiveDate: '12 Desember 2022',
  readMinutes: 6,
  summary:
    'Membahas rumus pengkreditan awal dan penghitungan kembali tahunan (re-kalkulasi Maret) bagi PKP yang memproduksi barang/jasa terutang PPN sekaligus dibebaskan PPN (misalnya kebun sawit/pangan strategis atau developer rumah subsidi & komersial).',
  sections: [
    {
      heading: 'Mengapa perlu proporsi Z dan masa manfaat T (1, 4, atau 10 tahun)?',
      paragraphs: [
        'Pengusaha Kena Pajak (PKP) yang menyerahkan barang/jasa terutang PPN (yang PM-nya dapat dikreditkan) sekaligus menyerahkan barang/jasa yang dibebaskan dari pengenaan PPN (misalnya rumah komersial dan rumah bersubsidi FLPP, atau perkebunan/penggilingan) sering membeli aset atau jasa bersama (common input tax) seperti listrik kantor, truk angkut, atau gedung pabrik.',
        'Berdasarkan Pasal 9 ayat (5) dan (6) UU PPN jo. PMK 186/PMK.03/2022 (yang menggantikan PMK 78/2010 stdd PMK 135/2014), Pajak Masukan atas barang/jasa yang pemanfaatannya tidak dapat dipisahkan pada awalnya dikreditkan memakai persentase perkiraan penyerahan yang terutang PPN dan dapat dikreditkan (Z).',
      ],
    },
    {
      heading: 'Rumus penghitungan kembali pada masa pajak ke-3 (Maret)',
      paragraphs: [
        'Setiap akhir tahun buku (paling lambat SPT Masa PPN bulan ke-3 tahun pajak berikutnya, yaitu Maret untuk tahun kalender), PKP wajib menghitung kembali PM yang benar-benar dapat dikreditkan memakai persentase realisasi penyerahan (Z\') dibagi masa manfaat (T): T = 1 tahun untuk BKP/JKP non-modal, T = 4 tahun untuk barang modal selain tanah/bangunan, dan T = 10 tahun untuk barang modal berupa tanah dan/atau bangunan.',
        'Selisih tahunan dihitung dengan rumus: Delta P = (PM / T x Z\') - (P_awal / T). Bila hasilnya positif, PKP boleh menambah pengkreditan di SPT Maret; bila negatif, PKP wajib mengurangi Pajak Masukan (membayar kembali ke kas negara).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 78/2010 stdd PMK 135/2014',
    newHeader: 'PMK 186/PMK.03/2022 (Berlaku Kini)',
    rows: [
      {
        aspek: 'Masa manfaat T barang modal',
        aturanLama: '1 thn (non-modal), 4 thn (mesin/aset), 10 thn (bangunan)',
        aturanBaru: 'Tetap 1 thn, 4 thn, dan 10 thn dengan konsolidasi norma proporsi',
      },
      {
        aspek: 'Cakupan penyerahan "Tidak Terutang PPN"',
        aturanLama: 'Dibedakan antara bukan BKP/JKP & PPN Dibebaskan',
        aturanBaru: 'Disatukan istilah penyerahan terutang yang PM-nya dapat dikreditkan vs tidak',
      },
      {
        aspek: 'Batas waktu re-kalkulasi tahunan',
        aturanLama: 'Paling lambat bulan ke-3 setelah tahun buku berakhir',
        aturanBaru: 'Tetap di SPT Masa PPN bulan ke-3 tahun pajak berikutnya',
      },
    ],
  },
  caseExample: {
    title: 'PKP beli mesin Rp 2 M (PM Rp 220 jt), estimasi Z = 70%, realisasi Z\' = 85% (T = 4 tahun)',
    scenario:
      'Pajak Masukan mesin pabrik bersama = Rp 220.000.000 dengan masa manfaat T = 4 tahun. Saat perolehan dikreditkan 70% x Rp 220 jt = Rp 154 jt (Rp 38,5 jt/tahun). Pada akhir tahun, realisasi penyerahan terutang PPN naik menjadi Z\' = 85%, sehingga alokasi wajar per tahun = (220 jt / 4) x 85% = Rp 46,75 jt/tahun. PKP berhak menambah kredit Pajak Masukan sebesar +Rp 8.250.000 di SPT Masa Maret.',
    presetRegime: 'ppn_pmk186_2022_proporsional',
    presetInput: {
      ppn: {
        hargaJualDpp: 220000000,
        goodsType: 'umum',
        termasukPpn: false,
        persenZEstimasi: 70,
        persenZRealisasi: 85,
        masaManfaatPpn: 4,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk186_2022ProporsionalRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const pmTotal = Math.max(0, input.hargaJualDpp);
    const zEst = Math.min(100, Math.max(0, input.persenZEstimasi ?? 70));
    const zReal = Math.min(100, Math.max(0, input.persenZRealisasi ?? 85));
    const t = input.masaManfaatPpn ?? 4;

    const pAwalDikreditkan = Math.round((pmTotal * zEst) / 100);
    const pAwalPerTahun = Math.round(pAwalDikreditkan / t);
    const pRealPerTahun = Math.round(((pmTotal / t) * zReal) / 100);
    const deltaPTahunan = pRealPerTahun - pAwalPerTahun;

    const isTambahKredit = deltaPTahunan >= 0;
    const effRateReal = pmTotal > 0 ? zReal : 0;

    const steps: CalculationStep[] = [
      {
        label: 'Total Pajak Masukan (PM) perolehan bersama dalam Faktur Pajak',
        value: pmTotal,
      },
      {
        label: `PM Awal yang dikreditkan saat perolehan (Estimasi Z = ${formatPersen(zEst)})`,
        formula: `${formatPersen(zEst)} x ${formatRupiah(pmTotal)}`,
        value: pAwalDikreditkan,
      },
      {
        label: `Beban/alokasi PM Awal per tahun (Masa manfaat T = ${t} tahun)`,
        formula: `${formatRupiah(pAwalDikreditkan)} ÷ ${t} tahun`,
        value: pAwalPerTahun,
      },
      {
        label: `Realisasi alokasi PM per tahun (Realisasi Z' = ${formatPersen(zReal)})`,
        formula: `(${formatRupiah(pmTotal)} ÷ ${t}) x ${formatPersen(zReal)}`,
        value: pRealPerTahun,
      },
      {
        label: isTambahKredit
          ? 'Penyesuaian SPT Maret (Delta P Positif — Tambahan Kredit PM)'
          : 'Penyesuaian SPT Maret (Delta P Negatif — Pengurang PM / Setor Kembali)',
        formula: `${formatRupiah(pRealPerTahun)} - ${formatRupiah(pAwalPerTahun)}`,
        value: deltaPTahunan,
        isHighlight: true,
        isNegative: deltaPTahunan < 0,
      },
    ];

    const notes: string[] = [
      isTambahKredit
        ? `Realisasi penyerahan kena PPN (${formatPersen(zReal)}) lebih tinggi dari estimasi awal (${formatPersen(zEst)}), sehingga PKP berhak menambah pengkreditan Pajak Masukan sebesar +${formatRupiah(deltaPTahunan)} pada SPT Masa PPN bulan ke-3 (Maret).`
        : `Realisasi penyerahan kena PPN (${formatPersen(zReal)}) turun di bawah estimasi awal (${formatPersen(zEst)}), sehingga PKP wajib mengurangi Pajak Masukan sebesar ${formatRupiah(deltaPTahunan)} pada SPT Masa PPN bulan ke-3 (Maret).`,
      `Penghitungan kembali tahunan ini diulang selama sisa masa manfaat (T = ${t} tahun) sesuai Pasal 4–7 PMK 186/PMK.03/2022.`,
    ];

    return {
      regime,
      primaryTaxLabel: isTambahKredit
        ? 'Koreksi Tahunan Delta P (Tambahan Kredit PM)'
        : 'Koreksi Tahunan Delta P (Wajib Dikembalikan)',
      primaryTaxAmount: deltaPTahunan,
      annualTaxLabel: 'PM Awal Boleh Dikreditkan Saat Pembelian (Z)',
      annualTaxAmount: pAwalDikreditkan,
      effectiveRatePercent: effRateReal,
      effectiveRateLabel: "Persentase realisasi penyerahan terutang PPN (Z')",
      takeHomeOrNetLabel: 'Total Pajak Masukan Final Terkoreksi Tahun Ini',
      takeHomeOrNetAmount: Math.max(0, pAwalDikreditkan + deltaPTahunan),
      steps,
      notes,
    };
  },
};
