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
  id: 'pbjt_hkpd_provinsi_ototarif',
  taxType: 'pbjt',
  name: 'UU HKPD 1/2022 & PP 35/2023 (Pajak Provinsi: PKB, BBNKB Kendaraan Baru, PBBKB, & Rokok)',
  shortName: '2025–Kini (Pajak Provinsi HKPD: PKB/BBNKB/PBBKB/Rokok)',
  legalBasis: 'Pasal 7–34 UU Nomor 1 Tahun 2022 (HKPD) jo. PP Nomor 35 Tahun 2023',
  effectivePeriod: '5 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pokok PKB 1,2% / BBNKB 12% + Opsen 66% (Bekas Bebas BBNKB)',
  summary:
    'Menghitung pajak pokok tingkat Provinsi berdasarkan NJKB / nilai bahan bakar / cukai di dalam UU HKPD: PKB kepemilikan ke-1 maksimal 1,2% (+ Opsen Kab/Kota 66% = 1,992%; atau maks 2% di DK Jakarta), BBNKB kendaraan baru maksimal 12% (+ Opsen 66% = 19,92%; kendaraan bekas BEBAS 0%), PBBKB maksimal 10%, dan Pajak Rokok 10% dari cukai rokok.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-hkpd-provinsi-ototarif',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT & Pajak Daerah',
  title: 'Tarif Pajak Provinsi UU HKPD: PKB 1,2%, BBNKB 12% (+ Opsen 66%), Penghapusan BBNKB Bekas, PBBKB, & Rokok',
  legalBasis: 'Pasal 7–34 UU Nomor 1 Tahun 2022 (HKPD) jo. PP Nomor 35 Tahun 2023',
  effectiveDate: '5 Januari 2025',
  readMinutes: 5,
  summary:
    'Penurunan tarif pokok PKB dan BBNKB di UU HKPD agar penambahan Opsen 66% Kab/Kota tidak menaikkan beban wajib pajak, serta penghapusan BBNKB penyerahan kedua (kendaraan bekas).',
  sections: [
    {
      heading: 'Mengapa tarif pokok PKB turun ke 1,2% dan BBNKB menjadi 12% (non-DKI)?',
      paragraphs: [
        'Sebelum 2025 (UU PDRD 28/2009), Pemerintah Provinsi mengenakan PKB kepemilikan pertama maksimal 2% dan BBNKB kendaraan baru maksimal 20%, lalu membagi hasil penerimaannya secara bertahap kepada Kabupaten/Kota.',
        'Melalui UU HKPD berlaku 5 Januari 2025, sistem bagi hasil diganti dengan skema Opsen langsung sebesar 66% untuk Kabupaten/Kota. Supaya masyarakat tidak membayar pajak lebih mahal, batas atas tarif pokok Provinsi di luar DK Jakarta diturunkan: PKB menjadi maksimal 1,2% (1,2% × 1,66 = 1,992%, tetap di bawah 2%!) dan BBNKB maksimal 12% (12% × 1,66 = 19,92%). Khusus DK Jakarta yang tidak memiliki kabupaten/kota otonom, tarif tetap maksimal 2% PKB dan 20% BBNKB tanpa Opsen.',
      ],
    },
    {
      heading: 'Penghapusan BBNKB kendaraan bekas, PBBKB, dan Pajak Rokok',
      paragraphs: [
        'UU HKPD menetapkan bahwa BBNKB hanya dipungut atas penyerahan pertama (kendaraan bermotor baru), sehingga balik nama kendaraan bermotor bekas kini dibebaskan dari BBNKB (0%) di seluruh Indonesia (yang dibayar hanya PKB berjalan & PNBP STNK/BPKB). Sementara PBBKB atas bahan bakar kendaraan bermotor dibatasi maksimal 10% (angkutan umum maksimal 5%) dan Pajak Rokok dipungut sebesar 10% dari cukai rokok.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (s.d. 4 Jan 2025)',
    newHeader: 'UU HKPD 1/2022 (Efektif 5 Jan 2025)',
    rows: [
      {
        aspek: 'PKB Kepemilikan Pertama (Non-DKI)',
        aturanLama: 'Maks. 2% (dibagi hasilkan ke Kab/Kota)',
        aturanBaru: 'Pokok maks. 1,2% + Opsen 66% = maks. 1,992%',
      },
      {
        aspek: 'BBNKB Kendaraan Bekas (Penyerahan II+)',
        aturanLama: 'Maks. 1% dari NJKB',
        aturanBaru: '0% (Dihapus / Bukan Objek BBNKB di seluruh Indonesia)',
      },
      {
        aspek: 'BBNKB Kendaraan Baru (Non-DKI)',
        aturanLama: 'Maks. 20%',
        aturanBaru: 'Pokok maks. 12% + Opsen 66% = maks. 19,92%',
      },
    ],
  },
  caseExample: {
    title: 'Menghitung total PKB + Opsen 66% untuk mobil ber-NJKB Rp 300 juta (di luar DK Jakarta)',
    scenario:
      'Sebuah mobil kepemilikan pertama di Jawa Barat/Jawa Tengah/Jawa Timur memiliki NJKB Rp 300.000.000. Pokok PKB Provinsi maksimal 1,2% = Rp 3.600.000, dan Opsen PKB Kab/Kota 66% = Rp 2.376.000, sehingga total dibayar di Samsat Rp 5.976.000 (1,992%).',
    presetRegime: 'pbjt_hkpd_provinsi_ototarif',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 300000000,
        sectorType: 'makanan_minuman',
        jenisPajakProvinsiHkpd: 'pkb_non_dki',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbjtHkpdProvinsiOtotarifRule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const dasar = Math.max(0, input.nilaiTransaksi);
    const jenis = input.jenisPajakProvinsiHkpd ?? 'pkb_non_dki';

    let rateProv = 1.2;
    let opsenRatio = 0.66;
    let label = 'PKB Kepemilikan Pertama Non-DKI (Maks 1,2% NJKB)';
    let dasarLabel = 'Nilai Jual Kendaraan Bermotor (NJKB)';

    switch (jenis) {
      case 'pkb_non_dki':
        rateProv = 1.2;
        opsenRatio = 0.66;
        label = 'PKB Kepemilikan Pertama Non-DKI (Maks 1,2% NJKB + Opsen 66% Kab/Kota)';
        break;
      case 'pkb_dki':
        rateProv = 2;
        opsenRatio = 0;
        label = 'PKB Kepemilikan Pertama DK Jakarta (Maks 2% NJKB, tanpa Opsen)';
        break;
      case 'bbnkb_non_dki':
        rateProv = 12;
        opsenRatio = 0.66;
        label = 'BBNKB Kendaraan Baru Non-DKI (Maks 12% NJKB + Opsen 66%; bekas 0%)';
        break;
      case 'bbnkb_dki':
        rateProv = 20;
        opsenRatio = 0;
        label = 'BBNKB Kendaraan Baru DK Jakarta (Maks 20% NJKB, tanpa Opsen; bekas 0%)';
        break;
      case 'pbbkb_10':
        rateProv = 10;
        opsenRatio = 0;
        label = 'Pajak Bahan Bakar Kendaraan Bermotor / PBBKB (Plafon maks 10%)';
        dasarLabel = 'Nilai jual bahan bakar kendaraan bermotor (sebelum PPN)';
        break;
      case 'rokok_10':
        rateProv = 10;
        opsenRatio = 0;
        label = 'Pajak Rokok Nasional (Tarif seragam 10% dari cukai rokok)';
        dasarLabel = 'Besaran cukai rokok terutang';
        break;
    }

    const pokokProv = Math.round((dasar * rateProv) / 100);
    const opsenKabKota = Math.round(pokokProv * opsenRatio);
    const totalDibayar = pokokProv + opsenKabKota;
    const effTotalRate = rateProv * (1 + opsenRatio);

    const steps: CalculationStep[] = [
      { label: dasarLabel, value: dasar },
      {
        label: `Pokok Pajak Provinsi (${formatPersen(rateProv)})`,
        formula: label,
        value: pokokProv,
      },
      {
        label: opsenRatio > 0 ? 'Opsen Pajak Kab/Kota (66% dari Pokok Provinsi)' : 'Opsen Kab/Kota',
        formula: opsenRatio > 0 ? `${formatRupiah(pokokProv)} x 66%` : 'Tidak dikenai Opsen',
        value: opsenKabKota,
      },
      {
        label: 'Total Pajak Provinsi + Opsen yang Dibayar',
        formula: `Tarif gabungan ${formatPersen(effTotalRate)}`,
        value: totalDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pokok Pajak Provinsi',
      primaryTaxAmount: pokokProv,
      annualTaxLabel: 'Total Dibayar (Pokok + Opsen Kab/Kota)',
      annualTaxAmount: totalDibayar,
      effectiveRatePercent: effTotalRate,
      takeHomeOrNetLabel: 'Porsi Penerimaan Kabupaten/Kota (Opsen)',
      takeHomeOrNetAmount: opsenKabKota,
      steps,
      notes: [
        'Kendaraan bermotor listrik murni (KBLBB) maupun angkutan umum dibebaskan atau memperoleh tarif khusus 0% PKB dan BBNKB di UU HKPD jo. Permendagri terkait.',
        'Berdasarkan UU HKPD, penyerahan kedua dan seterusnya (kendaraan bekas) dibebaskan dari BBNKB (0%) di seluruh provinsi.',
      ],
    };
  },
};
