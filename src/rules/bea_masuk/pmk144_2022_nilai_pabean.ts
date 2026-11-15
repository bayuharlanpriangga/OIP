import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_nilai_pabean',
  taxType: 'bea_masuk',
  name: 'Nilai Pabean CIF, Norma Freight/Asuransi & NDPBM (PMK 144/PMK.04/2022)',
  shortName: '2023–Kini (Nilai Pabean CIF)',
  legalBasis:
    'Pasal 15 UU Kepabeanan & PMK Nomor 144/PMK.04/2022 (Mencabut PMK 160/PMK.04/2010 stdd PMK 62/2018)',
  effectivePeriod: '1 Januari 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku saat ini (Nilai Pabean CIF)',
  summary:
    'Penetapan Nilai Pabean berbasis Cost, Insurance, and Freight (CIF) x kurs NDPBM mingguan, termasuk norma Freight laut (5%/10%/15% dari FOB) dan norma Asuransi (0,5% CFR vs Rp 0 bila polis lokal sah).',
  sources: [SRC.PMK_144_2022, SRC.PMK_160_2010, SRC.UU_17_2006],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-nilai-pabean-pmk144',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Penghitungan Nilai Pabean (CIF x NDPBM), Norma Freight 5%/10%/15% & Asuransi (PMK 144/2022)',
  legalBasis: 'Pasal 15 UU Kepabeanan & PMK Nomor 144/PMK.04/2022',
  effectiveDate: '1 Januari 2023',
  readMinutes: 5,
  summary:
    'PMK 144/PMK.04/2022 menggantikan PMK 160/2010 sebagai pedoman penetapan Nilai Pabean dengan enam metode berjenjang, pembuktian kewajaran nilai transaksi, serta norma pengangkutan dan asuransi bila transaksi menggunakan terminologi FOB.',
  sections: [
    {
      heading: 'Incoterm CIF dan Norma Biaya Angkut (Pasal 8 PMK 144/2022)',
      paragraphs: [
        'Nilai Pabean Indonesia selalu dihitung dalam kondisi Cost, Insurance, and Freight (CIF) pada pelabuhan atau tempat pemasukan di Daerah Pabean dan dikonversi menggunakan Nilai Dasar Penghitungan Bea Masuk (NDPBM / Kurs Pajak mingguan Kemenkeu) yang berlaku pada tanggal pendaftaran PIB.',
        'Apabila pembelian dilakukan dengan harga Free On Board (FOB) atau Ex-Works dan importir tidak melampirkan bukti nyata (Bill of Lading/Airway Bill) atau data objektif mengenai biaya pengangkutan laut, Pasal 8 PMK 144/2022 menetapkan norma Freight sebesar 5% dari FOB untuk barang asal ASEAN, 10% dari FOB untuk Asia non-ASEAN dan Australia, serta 15% dari FOB untuk negara lain (sedangkan angkutan udara merujuk tarif IATA).',
      ],
    },
    {
      heading: 'Norma Asuransi 0,5% vs Polis Dalam Negeri Rp 0 (Pasal 9 PMK 144/2022)',
      paragraphs: [
        'Bila biaya asuransi tidak tercantum pada invoice dan tidak ada polis nyata, Pasal 9 ayat (1) menetapkan norma asuransi sebesar 0,5% dari nilai Cost and Freight (CFR = FOB + Freight). Sebaliknya, apabila pengangkutan ditutup dengan polis asuransi di dalam Daerah Pabean oleh perusahaan asuransi Indonesia yang sah dan dilampirkan dalam dokumen pabean, biaya asuransi yang ditambahkan pada Nilai Pabean adalah Rp 0 (nol).',
        'Dalam hal Pejabat Bea dan Cukai meragukan kewajaran Nilai Transaksi (Metode I), pemeriksaan bergerak berjenjang ke Metode II (barang identik), Metode III (barang serupa), Metode IV (deduksi), Metode V (komputasi), hingga Metode VI (pengulangan/fallback).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 160/PMK.04/2010 stdd PMK 62/2018',
    newHeader: 'PMK 144/PMK.04/2022 (Mulai 1 Jan 2023)',
    rows: [
      {
        aspek: 'Norma Freight Angkutan Laut Tanpa B/L Nyata',
        aturanLama: '5% ASEAN / 10% Asia Non-ASEAN & Australia / 15% Lainnya',
        aturanBaru: 'Tetap 5% ASEAN / 10% Asia Non-ASEAN & Australia / 15% Lainnya (Pasal 8)',
      },
      {
        aspek: 'Norma Asuransi Tanpa Polis Luar Negeri',
        aturanLama: '0,5% dari CFR; polis dalam negeri = 0',
        aturanBaru: 'Tetap 0,5% x CFR; polis dalam negeri yang sah = 0 (Pasal 9)',
      },
      {
        aspek: 'Digitalisasi & Pengujian Nilai Transaksi (INP/DNP)',
        aturanLama: 'Prosedur kertas/manual INP & DNP',
        aturanBaru: 'Terintegrasi CEISA 4.0 & penyederhanaan penelitian kewajaran dokumen digital',
      },
    ],
  },
  caseExample: {
    title: 'Impor FOB USD 20.000 dari Tiongkok (Asia Non-ASEAN) dengan Asuransi Lokal & Tarif 10%',
    scenario:
      'Importir membeli komponen mesin senilai FOB USD 20.000 dari Shanghai (Asia non-ASEAN) tanpa bukti freight nyata, menutup polis asuransi dalam negeri yang sah (Rp 0), NDPBM Rp 16.000/USD, dan tarif Bea Masuk BTKI 10%.',
    presetRegime: 'bea_masuk_nilai_pabean',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 0,
        nilaiFobUsd: 20000,
        ndpbmKurs: 16000,
        asalWilayahFreight: 'asia_australia_10',
        statusAsuransiPabean: 'polis_dalam_negeri_0',
        tarifBmPersen: 10,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukNilaiPabeanRule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const fobUsd = Math.max(0, input.nilaiFobUsd ?? 0);
    const ndpbm = Math.max(0, input.ndpbmKurs ?? 16000);
    const asal = input.asalWilayahFreight ?? 'asia_australia_10';
    const asuransiStatus = input.statusAsuransiPabean ?? 'norma_0_5';
    const tarifBm = Math.max(0, Math.min(150, input.tarifBmPersen));

    const freightRate =
      asal === 'asean_5'
        ? 0.05
        : asal === 'asia_australia_10'
          ? 0.1
          : asal === 'lainnya_15'
            ? 0.15
            : 0;

    const freightUsd = fobUsd * freightRate;
    const cfrUsd = fobUsd + freightUsd;
    const insuranceRate = asal === 'cif_lengkap' || asuransiStatus === 'polis_dalam_negeri_0' ? 0 : 0.005;
    const insuranceUsd = cfrUsd * insuranceRate;
    const cifUsd = cfrUsd + insuranceUsd;

    const nilaiPabeanIdr = Math.round(cifUsd * ndpbm);
    const beaMasukIdr = Math.round(nilaiPabeanIdr * (tarifBm / 100));
    const nilaiImporIdr = nilaiPabeanIdr + beaMasukIdr;
    const effectiveRate = nilaiPabeanIdr > 0 ? (beaMasukIdr / nilaiPabeanIdr) * 100 : 0;

    const formatUsd = (val: number) =>
      `USD ${val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const steps: CalculationStep[] = [
      {
        label: 'Nilai Transaksi Awal (FOB / CIF Input)',
        formula: asal === 'cif_lengkap' ? 'Harga sudah termasuk CIF' : 'Harga FOB negara asal',
        value: 0,
        format: 'text',
        displayValue: formatUsd(fobUsd),
      },
      {
        label: 'Norma Biaya Angkut / Freight (Pasal 8 PMK 144/2022)',
        formula:
          asal === 'cif_lengkap'
            ? 'Sudah termasuk dalam nilai CIF'
            : `${formatPersen(freightRate * 100)} x FOB`,
        value: 0,
        format: 'text',
        displayValue: formatUsd(freightUsd),
      },
      {
        label: 'Norma Asuransi (Pasal 9 PMK 144/2022)',
        formula:
          insuranceRate === 0
            ? 'Rp 0 (Polis asuransi dalam negeri sah / sudah CIF)'
            : '0,5% x CFR (FOB + Freight)',
        value: 0,
        format: 'text',
        displayValue: formatUsd(insuranceUsd),
      },
      {
        label: 'Total Nilai Pabean (CIF dalam Valas)',
        formula: 'FOB + Freight + Insurance',
        value: 0,
        format: 'text',
        displayValue: formatUsd(cifUsd),
      },
      {
        label: 'Kurs NDPBM (Kurs Pajak Mingguan KMK)',
        formula: 'Konversi valas ke Rupiah per 1 USD',
        value: 0,
        format: 'text',
        displayValue: `${formatRupiah(ndpbm)} / USD`,
      },
      {
        label: 'Nilai Pabean (CIF dalam Rupiah)',
        formula: `${formatUsd(cifUsd)} x ${formatRupiah(ndpbm)}`,
        value: nilaiPabeanIdr,
      },
      {
        label: `Bea Masuk Terutang (${formatPersen(tarifBm)})`,
        formula: `${formatPersen(tarifBm)} x ${formatRupiah(nilaiPabeanIdr)}`,
        value: beaMasukIdr,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Jika importir memiliki bukti nyata Freight (Bill of Lading/Airway Bill) dan polis asuransi luar negeri dengan nilai wajar, yang digunakan adalah nilai aktual pada dokumen pengangkutan, bukan norma persentase.',
    ];
    if (asuransiStatus === 'polis_dalam_negeri_0' && asal !== 'cif_lengkap') {
      notes.push(
        'Sesuai Pasal 9 ayat (2) PMK 144/2022, karena asuransi ditutup di dalam Daerah Pabean dan dilampirkan polis asuransi lokal yang sah pada PIB, unsur asuransi luar negeri bernilai USD 0.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk dari Nilai Pabean CIF',
      primaryTaxAmount: beaMasukIdr,
      annualTaxLabel: 'Nilai Pabean (CIF Rp)',
      annualTaxAmount: nilaiPabeanIdr,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Bea Masuk thd Nilai Pabean',
      takeHomeOrNetLabel: 'Nilai Impor (CIF + Bea Masuk)',
      takeHomeOrNetAmount: nilaiImporIdr,
      steps,
      notes,
    };
  },
};
