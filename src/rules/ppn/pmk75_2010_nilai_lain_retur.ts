import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_11_2025, SRC.PMK_75_2010, SRC.PMK_121_2015, SRC.PMK_65_2010, SRC.PMK_81_2024];

const regime: TaxRegime = {
  id: 'ppn_pmk75_2010_nilai_lain_retur',
  taxType: 'ppn',
  name: 'PMK 11/2025 (eks PMK 75/2010) & PMK 65/2010 (Pemakaian Sendiri, Cuma-Cuma, Film & Nota Retur)',
  shortName: '2010–Kini (DPP Nilai Lain Spesifik & Nota Retur)',
  legalBasis: 'PMK 11 Tahun 2025 (eks PMK 75/2010–PMK 121/2015) & PMK 65/PMK.03/2010 jo. PMK 81/2024',
  effectivePeriod: '1 April 2010 – Sekarang (Penyesuaian 11/12 di PMK 11/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pemberian Cuma-Cuma (HPP), Film Cerita & Nota Retur',
  summary:
    'Menghitung PPN DPP Nilai Lain atas pemakaian sendiri non-produktif & pemberian cuma-cuma (sampel/hadiah memakai Harga Pokok Penjualan / harga jual dikurangi laba kotor), film cerita, serta pengurangan PPN melalui Nota Retur/Pembatalan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk75-2010-nilai-lain-retur',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'DPP Nilai Lain (Pemakaian Sendiri, Pemberian Cuma-Cuma, Film) & Nota Retur (PMK 11/2025 & PMK 65/2010)',
  legalBasis: 'PMK 11/2025, PMK 75/PMK.03/2010, PMK 65/PMK.03/2010 & PMK 81/2024',
  effectiveDate: '1 April 2010 (Pembaruan PMK 11/2025 mulai 4 Februari 2025)',
  readMinutes: 6,
  summary:
    'Menjelaskan cara mengeluarkan komponen laba kotor saat memberi barang sampel/hadiah promosi (Faktur Pajak Kode 040), aturan PPN film cerita, dan mekanisme Nota Retur BKP / Nota Pembatalan JKP.',
  sections: [
    {
      heading: 'Pemakaian sendiri non-produktif & pemberian cuma-cuma (DPP = HPP x 11/12)',
      paragraphs: [
        'Ketika PKP memberikan barang dagangannya secara gratis sebagai sampel promosi, souvenir, sumbangan, atau dipakai sendiri untuk tujuan non-produktif (konsumtif), transaksi tersebut tetap terutang PPN dengan Kode Faktur 040.',
        'Sesuai PMK 75/PMK.03/2010 yang kini diperbarui dalam PMK 11 Tahun 2025, Dasar Pengenaan Pajaknya bukanlah harga jual pasar kepada konsumen, melainkan 11/12 dari (Harga Jual dikurangi Laba Kotor / HPP). Dengan tarif 12%, pajak efektifnya tepat sebesar 11% dari Harga Pokok Penjualan (HPP).',
      ],
    },
    {
      heading: 'Nota Retur BKP & Nota Pembatalan JKP (PMK 65/2010 jo. PMK 81/2024)',
      paragraphs: [
        'Apabila barang yang sudah diterbitkan Faktur Pajak dikembalikan oleh pembeli (retur) atau jasa dibatalkan sebagian/seluruhnya, pembeli wajib membuat Nota Retur (atau Nota Pembatalan Jasa) pada masa pajak saat pengembalian terjadi.',
        'Berdasarkan PMK 65/PMK.03/2010 jo. PMK 81/2024 (melalui modul faktur Coretax), Nota Retur secara langsung MENGURANGI Pajak Keluaran penjual dan MENGURANGI Pajak Masukan pembeli pada masa pajak dibuatnya Nota Retur tersebut.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Penjualan Normal Kode 010/040',
    newHeader: 'DPP Nilai Lain & Nota Retur (PMK 11/2025 & PMK 65/2010)',
    rows: [
      {
        aspek: 'Pemberian cuma-cuma / sampel produk',
        aturanLama: '11% x Harga Jual penuh termasuk margin laba',
        aturanBaru: '12% x 11/12 x (Harga Jual - Laba Kotor), yakni 11% dari HPP',
      },
      {
        aspek: 'Barang dikembalikan (Retur)',
        aturanLama: 'Pajak Keluaran tetap sebesar faktur awal',
        aturanBaru: 'Nota Retur mengurangi Pajak Keluaran penjual & PM pembeli',
      },
    ],
  },
  caseExample: {
    title: 'PKP membagikan produk promosi senilai harga jual Rp 100 juta dengan margin laba kotor 25%',
    scenario:
      'Harga jual ritel barang sebesar Rp 100.000.000 dan laba kotor 25% (HPP = Rp 75.000.000). Berdasarkan PMK 11/2025 (eks PMK 75/2010), DPP Nilai Lain = 11/12 x Rp 75 jt = Rp 68.750.000 sehingga PPN Kode 040 = 12% x Rp 68,75 jt = Rp 8.250.000 (hemat Rp 2,75 jt dibanding dihitung dari harga jual penuh).',
    presetRegime: 'ppn_pmk75_2010_nilai_lain_retur',
    presetInput: {
      ppn: {
        hargaJualDpp: 100000000,
        goodsType: 'umum',
        termasukPpn: false,
        persenLabaKotor: 25,
        skemaNilaiLainRetur: 'pemakaian_cuma_cuma',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk75_2010NilaiLainReturRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaNilaiLainRetur ?? 'pemakaian_cuma_cuma';
    const labaKotorPersen = Math.min(99, Math.max(0, input.persenLabaKotor ?? 20));

    if (skema === 'nota_retur_bkp_jkp') {
      const nilaiRetur = input.termasukPpn ? Math.round((raw * 100) / 111) : raw;
      const ppnKoreksi = -Math.round(nilaiRetur * 0.11);
      const effRate = nilaiRetur > 0 ? 11 : 0;

      const steps: CalculationStep[] = [
        {
          label: 'Nilai BKP dikembalikan / JKP dibatalkan dalam Nota Retur (non-PPN)',
          value: nilaiRetur,
        },
        {
          label: 'DPP Nilai Lain 11/12 atas nilai retur',
          value: Math.round((nilaiRetur * 11) / 12),
        },
        {
          label: 'Pengurang Pajak Keluaran (Penjual) & Pajak Masukan (Pembeli)',
          formula: `-12% x (11/12 x ${formatRupiah(nilaiRetur)})`,
          value: ppnKoreksi,
          isHighlight: true,
          isNegative: true,
        },
      ];

      return {
        regime,
        primaryTaxLabel: 'Koreksi Pengurang PPN Nota Retur (PK Penjual & PM Pembeli)',
        primaryTaxAmount: ppnKoreksi,
        annualTaxLabel: 'Total Nilai Pengembalian Nota Retur (Termasuk PPN)',
        annualTaxAmount: nilaiRetur + Math.abs(ppnKoreksi),
        effectiveRatePercent: effRate,
        effectiveRateLabel: 'Persentase koreksi PPN atas DPP retur',
        takeHomeOrNetLabel: 'Nilai Retur Bersih Sebelum PPN',
        takeHomeOrNetAmount: nilaiRetur,
        steps,
        notes: [
          `Nota Retur / Pembatalan Jasa wajib dibuat oleh pembeli pada masa pajak saat pengembalian BKP atau pembatalan JKP terjadi (PMK 65/2010 jo. PMK 81/2024), mengurangi Pajak Keluaran penjual sebesar ${formatRupiah(Math.abs(ppnKoreksi))}.`,
        ],
      };
    }

    if (skema === 'film_cerita_nilai_lain') {
      const perkiraanHasil = raw;
      const dpp1112 = Math.round((perkiraanHasil * 11) / 12);
      const ppnFilm = Math.round(perkiraanHasil * 0.11);
      const effRate = perkiraanHasil > 0 ? 11 : 0;

      return {
        regime,
        primaryTaxLabel: 'PPN Film Cerita (DPP Nilai Lain Kode 040)',
        primaryTaxAmount: ppnFilm,
        effectiveRatePercent: effRate,
        takeHomeOrNetLabel: 'Total Tagihan Penyerahan Film Termasuk PPN',
        takeHomeOrNetAmount: perkiraanHasil + ppnFilm,
        steps: [
          { label: 'Perkiraan hasil rata-rata per judul film cerita', value: perkiraanHasil },
          { label: 'DPP Nilai Lain 11/12 (PMK 11/2025)', value: dpp1112 },
          {
            label: 'PPN terutang (12% x 11/12 = 11% efektif)',
            formula: `12% x ${formatRupiah(dpp1112)}`,
            value: ppnFilm,
            isHighlight: true,
          },
        ],
        notes: [
          'Sesuai PMK 11/2025 (pembaruan dari PMK 75/2010–PMK 121/2015), penyerahan film cerita dihitung menggunakan DPP Nilai Lain sebesar 11/12 dari perkiraan hasil rata-rata per judul film.',
        ],
      };
    }

    const hargaJual = raw;
    const nilaiLabaKotor = Math.round((hargaJual * labaKotorPersen) / 100);
    const hpp = Math.max(0, hargaJual - nilaiLabaKotor);
    const dppNilaiLain = Math.round((hpp * 11) / 12);
    const ppnTerutang = Math.round(hpp * 0.11);
    const effAgainstHargaJual = hargaJual > 0 ? (ppnTerutang / hargaJual) * 100 : 0;
    const hematPpn = Math.max(0, Math.round(hargaJual * 0.11) - ppnTerutang);

    return {
      regime,
      primaryTaxLabel: 'PPN Pemberian Cuma-Cuma / Pakai Sendiri (Kode 040)',
      primaryTaxAmount: ppnTerutang,
      annualTaxLabel: 'Penghematan PPN dibanding Harga Jual Penuh',
      annualTaxAmount: hematPpn,
      effectiveRatePercent: effAgainstHargaJual,
      effectiveRateLabel: 'Rasio PPN HPP terhadap harga jual ritel',
      takeHomeOrNetLabel: 'Dasar HPP (Harga Jual - Laba Kotor)',
      takeHomeOrNetAmount: hpp,
      steps: [
        { label: 'Harga jual komersial barang/jasa', value: hargaJual },
        {
          label: `Dikurangi Laba Kotor (${formatPersen(labaKotorPersen)})`,
          value: -nilaiLabaKotor,
          isNegative: true,
        },
        { label: 'Harga Pokok Penjualan / Biaya Pokok (Dasar Nilai Lain)', value: hpp },
        { label: 'DPP Nilai Lain 11/12 sesuai PMK 11/2025', value: dppNilaiLain },
        {
          label: 'PPN Terutang (12% x 11/12 dari HPP = 11% x HPP)',
          formula: `12% x ${formatRupiah(dppNilaiLain)}`,
          value: ppnTerutang,
          isHighlight: true,
        },
      ],
      notes: [
        `Pemberian cuma-cuma/sampel dan pemakaian sendiri non-produktif menggunakan DPP Nilai Lain sebesar HPP (Harga Jual dikurangi laba kotor ${formatPersen(labaKotorPersen)}), menghemat PPN sebesar ${formatRupiah(hematPpn)}.`,
      ],
    };
  },
};
