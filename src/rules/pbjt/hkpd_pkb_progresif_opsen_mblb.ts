import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_1_2022_HKPD, SRC.PP_35_2023, SRC.UU_28_2009_PDRD];

const regime: TaxRegime = {
  id: 'pbjt_hkpd_pkb_progresif_opsen_mblb',
  taxType: 'pbjt',
  name: 'UU HKPD Pasal 10 & 83 (Tarif Progresif PKB Maks 6% & Opsen MBLB 25%)',
  shortName: '2025–Kini (PKB Progresif & Opsen MBLB 25%)',
  legalBasis: 'Pasal 10 & Pasal 83 UU Nomor 1 Tahun 2022 (HKPD) jo. PP 35 Tahun 2023',
  effectivePeriod: '5 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tarif Progresif Kepemilikan ke-2+ PKB & Opsen MBLB',
  summary:
    'Mensimulasikan tarif progresif Pajak Kendaraan Bermotor (PKB) mulai kepemilikan ke-1 hingga ke-5 (plafon maks 6% Pasal 10 UU HKPD) beserta Opsen PKB Kab/Kota 66%, serta perhitungan Opsen Pajak Mineral Bukan Logam & Batuan (MBLB) Provinsi sebesar 25%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-hkpd-pkb-progresif-opsen-mblb',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'Tarif Progresif PKB (Maks 6%) & Opsen Pajak MBLB Provinsi 25% dalam UU HKPD 1/2022',
  legalBasis: 'Pasal 10 ayat (1)–(3) & Pasal 83–84 UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '5 Januari 2025 (Opsen PKB & MBLB)',
  readMinutes: 5,
  summary:
    'Mengupas plafon baru PKB progresif untuk kepemilikan kendaraan ke-2 dan seterusnya (turun dari 10% di UU PDRD menjadi maksimal 6% di UU HKPD) serta mekanisme Opsen MBLB 25% untuk memperkuat pengawasan pertambangan oleh Provinsi.',
  sections: [
    {
      heading: 'Plafon PKB Progresif Non-DKI (maks 6% + Opsen 66%) vs DKI Jakarta',
      paragraphs: [
        'Di era UU 28/2009 PDRD, tarif progresif PKB kepemilikan ke-2 dan seterusnya dapat ditetapkan daerah dari 2% hingga maksimal 10%. Melalui Pasal 10 ayat (1) UU Nomor 1 Tahun 2022 (HKPD), plafon PKB diturunkan secara signifikan: untuk provinsi dengan Opsen Kab/Kota (Non-DKI), kepemilikan pertama dibatasi maksimal 1,2% dan kepemilikan ke-2 dan seterusnya ditetapkan secara progresif paling tinggi 6% (ditambah Opsen 66% untuk Kabupaten/Kota).',
        'Khusus provinsi berstatus tanpa daerah otonom Kab/Kota seperti DKI Jakarta (Pasal 10 ayat 2 UU HKPD), tarif kepemilikan pertama maksimal 2% dan kepemilikan ke-2 dan seterusnya dibatasi paling tinggi 6% tanpa tambahan Opsen.',
      ],
    },
    {
      heading: 'Opsen Pajak MBLB Provinsi sebesar 25% atas Pokok MBLB Kab/Kota',
      paragraphs: [
        'Berbeda dengan Opsen PKB & BBNKB yang mengalir dari Provinsi ke Kab/Kota (66%), Opsen Pajak Mineral Bukan Logam dan Batuan (MBLB) bekerja dengan arah sebaliknya: Pajak MBLB dipungut oleh Kabupaten/Kota dengan plafon turun dari 25% (PDRD) menjadi maksimal 20% (HKPD), lalu Provinsi memungut Opsen MBLB sebesar 25% dari pokok Pajak MBLB terutang (ekuivalen tambahan 5% terhadap nilai jual MBLB, total beban maksimal tetap 25%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 28/2009 PDRD (2010–2024)',
    newHeader: 'UU 1/2022 HKPD (Efektif 2025–Kini)',
    rows: [
      {
        aspek: 'Plafon PKB Progresif ke-2 dst.',
        aturanLama: '2% s.d. paling tinggi 10%',
        aturanBaru: 'Diturunkan menjadi paling tinggi 6% (+ Opsen 66% Non-DKI)',
      },
      {
        aspek: 'Tarif MBLB + Opsen Provinsi',
        aturanLama: 'MBLB murni Kab/Kota maks 25% (tanpa Opsen)',
        aturanBaru: 'Pokok Kab/Kota maks 20% + Opsen Provinsi 25% dari pokok (= 25%)',
      },
    ],
  },
  caseExample: {
    title: 'Kepemilikan mobil pribadi ke-3 (NJKB Rp 400 juta) di provinsi Non-DKI dengan tarif progresif 3%',
    scenario:
      'Untuk kendaraan ke-3 di Perda Non-DKI (mis. tarif progresif pokok 3% dari plafon maks 6%), pokok PKB Provinsi = 3% x Rp 400 jt = Rp 12.000.000, dan Opsen PKB Kab/Kota 66% = Rp 7.920.000, sehingga total PKB + Opsen dibayar pemilik kendaraan mencapai Rp 19.920.000 (4,98%).',
    presetRegime: 'pbjt_hkpd_pkb_progresif_opsen_mblb',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 400000000,
        sectorType: 'makanan_minuman',
        skemaProgresifMblb: 'pkb_progresif_non_dki',
        tingkatKepemilikanPkb: 3,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbjtHkpdPkbProgresifOpsenMblbRule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const njkbOrMblb = Math.max(0, input.nilaiTransaksi);
    const skema = input.skemaProgresifMblb ?? 'pkb_progresif_non_dki';
    const urutan = input.tingkatKepemilikanPkb ?? 2;

    if (skema === 'opsen_mblb_25') {
      const mblbPokokRate = 20;
      const mblbPokok = Math.round((njkbOrMblb * mblbPokokRate) / 100);
      const opsenMblbProvinsi = Math.round(mblbPokok * 0.25);
      const totalMblb = mblbPokok + opsenMblbProvinsi;
      const effTotal = njkbOrMblb > 0 ? (totalMblb / njkbOrMblb) * 100 : 0;

      return {
        regime,
        primaryTaxLabel: 'Opsen Pajak MBLB Provinsi (25% dari Pokok)',
        primaryTaxAmount: opsenMblbProvinsi,
        annualTaxLabel: 'Total Pajak MBLB Kab/Kota + Opsen Provinsi (25%)',
        annualTaxAmount: totalMblb,
        effectiveRatePercent: effTotal,
        effectiveRateLabel: 'Tarif efektif gabungan terhadap nilai jual MBLB',
        takeHomeOrNetLabel: 'Nilai Bersih Penambang Setelah MBLB + Opsen',
        takeHomeOrNetAmount: Math.max(0, njkbOrMblb - totalMblb),
        steps: [
          { label: 'Nilai jual hasil pertambangan Mineral Bukan Logam & Batuan (MBLB)', value: njkbOrMblb },
          {
            label: 'Pokok Pajak MBLB Kabupaten/Kota (plafon maks 20% HKPD)',
            formula: `20% x ${formatRupiah(njkbOrMblb)}`,
            value: mblbPokok,
          },
          {
            label: 'Opsen MBLB Provinsi (25% x Pokok MBLB Kab/Kota = 5% nilai jual)',
            formula: `25% x ${formatRupiah(mblbPokok)}`,
            value: opsenMblbProvinsi,
            isHighlight: true,
          },
          {
            label: 'Total beban MBLB & Opsen (Kab/Kota 20% + Provinsi 5% = 25%)',
            value: totalMblb,
          },
        ],
        notes: [
          `Sesuai Pasal 83 UU HKPD, plafon tarif pokok MBLB Kabupaten/Kota turun ke 20%, lalu Provinsi mengenakan Opsen MBLB 25% atas pokok tersebut (${formatRupiah(opsenMblbProvinsi)}) sehingga total gabungan maksimal tetap 25%.`,
        ],
      };
    }

    const isNonDki = skema === 'pkb_progresif_non_dki';
    const nonDkiRateTable: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 1.2,
      2: 2.0,
      3: 3.0,
      4: 4.0,
      5: 5.0,
    };
    const dkiRateTable: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 2.0,
      2: 3.0,
      3: 4.0,
      4: 5.0,
      5: 6.0,
    };
    const pokokRate = isNonDki ? nonDkiRateTable[urutan] : dkiRateTable[urutan];
    const pkbPokok = Math.round((njkbOrMblb * pokokRate) / 100);
    const opsenPkb = isNonDki ? Math.round(pkbPokok * 0.66) : 0;
    const totalBayar = pkbPokok + opsenPkb;
    const effTotal = njkbOrMblb > 0 ? (totalBayar / njkbOrMblb) * 100 : 0;

    return {
      regime,
      primaryTaxLabel: `Pokok PKB Progresif Kendaraan ke-${urutan} (${formatPersen(pokokRate)})`,
      primaryTaxAmount: pkbPokok,
      annualTaxLabel: isNonDki ? 'Total PKB + Opsen 66% (Dibayar Pemilik)' : 'Total PKB DKI Jakarta (Tanpa Opsen)',
      annualTaxAmount: totalBayar,
      effectiveRatePercent: effTotal,
      effectiveRateLabel: 'Tarif efektif gabungan terhadap NJKB',
      takeHomeOrNetLabel: isNonDki ? 'Porsi Opsen PKB Kab/Kota (66% Pokok)' : 'Porsi Opsen (N/A di DKI Jakarta)',
      takeHomeOrNetAmount: opsenPkb,
      steps: [
        { label: 'Nilai Jual Kendaraan Bermotor (NJKB x bobot koefisien)', value: njkbOrMblb },
        {
          label: `Tarif Progresif PKB Kepemilikan ke-${urutan} (Plafon UU HKPD maks 6%)`,
          value: pokokRate,
          format: 'percent',
        },
        {
          label: 'Pokok PKB Provinsi',
          formula: `${formatPersen(pokokRate)} x ${formatRupiah(njkbOrMblb)}`,
          value: pkbPokok,
          isHighlight: true,
        },
        {
          label: isNonDki ? 'Tambahan Opsen PKB Kab/Kota (66% dari Pokok PKB)' : 'Opsen Kab/Kota (DKI Jakarta tidak mengenal Opsen)',
          formula: isNonDki ? `66% x ${formatRupiah(pkbPokok)}` : 'Otonomi khusus provinsi tunggal',
          value: opsenPkb,
        },
        {
          label: 'Total Tagihan PKB Tahun Berjalan (Pokok + Opsen)',
          value: totalBayar,
        },
      ],
      notes: [
        isNonDki
          ? `Simulasi menggunakan contoh skala Perda HKPD Non-DKI untuk kendaraan ke-${urutan} sebesar ${formatPersen(pokokRate)} (plafon UU maks 6% untuk kepemilikan ke-2 dst.), ditambah Opsen Kab/Kota 66% menjadi total efektif ${formatPersen(effTotal)}.`
          : `Provinsi DKI Jakarta menerapkan progresif 2%–6% (kendaraan ke-${urutan} = ${formatPersen(pokokRate)}) sesuai Pasal 10 ayat (2) UU HKPD tanpa Opsen tambahan.`,
      ],
    };
  },
};
