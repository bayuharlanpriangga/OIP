import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_49_2022, SRC.PMK_59_2022, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pp49_2022_strategis',
  taxType: 'ppn',
  name: 'PP 49/2022 & PMK 59/2022 (PPN Dibebaskan, Tidak Dipungut, & WAPU Pemerintah)',
  shortName: '2022–Kini (Strategis PP 49/2022 & WAPU)',
  legalBasis: 'PP Nomor 49 Tahun 2022 & PMK Nomor 59/PMK.03/2022',
  effectivePeriod: '12 Desember 2022 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — BKP/JKP Strategis (0%) & Ambang WAPU Instansi Pemerintah Rp 2 Jt',
  summary:
    'Mengatur BKP/JKP strategis (kebutuhan pokok, jasa kesehatan, pendidikan, angkutan umum, buku pelajaran, listrik rumah tangga <= 6.600 VA) yang mendapat fasilitas Dibebaskan dari PPN atau Tidak Dipungut PPN, serta mekanisme pemungutan PPN oleh Instansi Pemerintah (WAPU > Rp 2 juta tidak termasuk PPN).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pp49-2022-strategis',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Dibebaskan vs Tidak Dipungut (PP 49/2022) & WAPU Instansi Pemerintah (PMK 59/2022)',
  legalBasis: 'PP Nomor 49 Tahun 2022 jo. PMK Nomor 59/PMK.03/2022',
  effectiveDate: '12 Desember 2022 (PMK 59/2022 sejak 1 Mei 2022)',
  readMinutes: 5,
  summary:
    'Membedah konsekuensi Pajak Masukan antara fasilitas PPN Dibebaskan (08) dengan PPN Tidak Dipungut (07) dalam PP 49/2022, serta kapan Bendahara Pemerintah wajib memungut PPN sendiri (> Rp 2 juta).',
  sections: [
    {
      heading: 'Perbedaan strategis: Dibebaskan (Kode Faktur 08) vs Tidak Dipungut (Kode 07)',
      paragraphs: [
        'Melalui UU HPP jo. PP Nomor 49 Tahun 2022, barang kebutuhan pokok, jasa pelayanan kesehatan medis, jasa pendidikan, jasa angkutan umum, serta buku pelajaran dipindahkan dari daftar negatif (non-BKP/non-JKP) menjadi BKP/JKP yang mendapat fasilitas Dibebaskan dari Pengenaan PPN. Bagi konsumen akhir harganya sama-sama 0% PPN, namun secara hukum bagi PKP penjual, Pajak Masukan terkait penyerahan Dibebaskan TIDAK dapat dikreditkan.',
        'Sebaliknya, untuk penyerahan strategis yang mendapat fasilitas PPN Tidak Dipungut (misalnya pemasukan ke Kawasan Berikat/KEK tertentu, atau alat angkutan tertentu yang memenuhi ketentuan khusus PP 49/2022), PKP tetap memungut PPN 0% namun tetap berhak mengkreditkan Pajak Masukan terkait pembelian bahan bakunya.',
      ],
    },
    {
      heading: 'Kewajiban Pemungut PPN (WAPU) Instansi Pemerintah di PMK 59/2022',
      paragraphs: [
        'Dalam transaksi pengadaan barang/jasa kepada Bendahara/Instansi Pemerintah, Pasal 18 ayat (1) huruf a PMK 59/PMK.03/2022 menetapkan bahwa apabila jumlah pembayaran paling banyak Rp 2.000.000 TIDAK termasuk PPN dan/atau PPnBM (serta bukan merupakan pembayaran yang dipecah-pecah), PPN tidak dipungut oleh instansi pemerintah melainkan tetap dipungut dan disetor oleh PKP rekanan (Kode Faktur 01). Bila nilai DPP melebihi Rp 2.000.000, Instansi Pemerintah bertindak sebagai WAPU yang memungut dan menyetor langsung PPN efektif 11% atas nama rekanan (Kode Faktur 02).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum UU HPP & PMK 231/2019',
    newHeader: 'PP 49/2022 & PMK 59/2022 (Kini)',
    rows: [
      {
        aspek: 'Sembako, Kesehatan Medis, Pendidikan',
        aturanLama: 'Non-BKP / Non-JKP (Pasal 4A UU PPN)',
        aturanBaru: 'BKP/JKP Strategis Dibebaskan dari PPN (PP 49/2022) — Tarif 0%, PM tak dapat dikreditkan',
      },
      {
        aspek: 'Batas nilai pengadaan tidak dipungut WAPU Pemerintah',
        aturanLama: 'Rp 1.000.000 (PMK 231/2019 awal)',
        aturanBaru: 'Rp 2.000.000 (tidak termasuk PPN — PMK 59/2022)',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan sembako / jasa kesehatan strategis Rp 100 juta (PPN Dibebaskan PP 49/2022)',
    scenario:
      'Distributor menjual komoditas beras kebutuhan pokok (BKP Strategis PP 49/2022) senilai Rp 100.000.000. Faktur pajak diterbitkan dengan kode 08 (PPN Dibebaskan): PPN dibayar pembeli Rp 0 (0%).',
    presetRegime: 'ppn_pp49_2022_strategis',
    presetInput: {
      ppn: {
        hargaJualDpp: 100000000,
        goodsType: 'umum',
        termasukPpn: false,
        skemaStrategis: 'bkp_jkp_dibebaskan_pp49',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPp49_2022StrategisRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const dpp = Math.max(0, input.hargaJualDpp);
    const skema = input.skemaStrategis ?? 'bkp_jkp_dibebaskan_pp49';
    const isFacilityZero =
      skema === 'bkp_jkp_dibebaskan_pp49' || skema === 'tidak_dipungut_kawasan';
    const effectiveRate = isFacilityZero ? 0 : 11;
    const ppnAmount = isFacilityZero ? 0 : Math.round(dpp * 0.11);
    const total = dpp + ppnAmount;

    const isWapuDiatas =
      skema === 'wapu_diatas_2jt' ? dpp === 0 || dpp > 2000000 : dpp > 2000000;
    const collectorDesc =
      skema === 'bkp_jkp_dibebaskan_pp49'
        ? 'PPN Dibebaskan (Kode Faktur 08) — Tarif 0%, Pajak Masukan tidak dapat dikreditkan'
        : skema === 'tidak_dipungut_kawasan'
        ? 'PPN Tidak Dipungut (Kode Faktur 07) — Tarif 0%, Pajak Masukan DAPAT dikreditkan'
        : isWapuDiatas
        ? 'Dipungut oleh Instansi Pemerintah / WAPU (Kode Faktur 02, nilai DPP > Rp 2 juta)'
        : 'Dipungut & Disetor sendiri oleh PKP Rekanan (Kode 01, nilai DPP <= Rp 2 juta)';

    const notes: string[] = [collectorDesc];
    if (skema === 'wapu_dibawah_2jt' && dpp > 2000000) {
      notes.push(
        'Peringatan: Nilai penyerahan (tidak termasuk PPN) melampaui batas Rp 2.000.000, sehingga sesuai Pasal 18 PMK 59/2022 kewajiban pungut PPN otomatis beralih kepada Instansi Pemerintah (Kode 02).'
      );
    } else if (skema === 'wapu_diatas_2jt' && dpp > 0 && dpp <= 2000000) {
      notes.push(
        'Peringatan: Nilai penyerahan paling banyak Rp 2.000.000 (tidak termasuk PPN), sehingga sesuai Pasal 18 PMK 59/2022 PPN dipungut dan disetor sendiri oleh PKP Rekanan (Kode 01) kecuali merupakan pembayaran terpecah.'
      );
    }

    const steps: CalculationStep[] = [
      { label: 'Nilai penyerahan BKP/JKP (DPP)', value: dpp },
      { label: 'Perlakuan PPN & Penanggung Pungut', formula: collectorDesc, value: effectiveRate, format: 'percent' },
      {
        label: isFacilityZero ? 'PPN terutang dibebaskan / tidak dipungut' : 'PPN efektif 11% (12% x DPP 11/12)',
        formula: `${formatRupiah(dpp)} x ${formatPersen(effectiveRate)}`,
        value: ppnAmount,
        isHighlight: true,
      },
      { label: 'Total nilai transaksi', value: total },
    ];

    return {
      regime,
      primaryTaxLabel: isFacilityZero ? 'PPN Dibayar Konsumen (Fasilitas 0%)' : 'PPN Dipungut WAPU / Rekanan',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Nilai Transaksi',
      takeHomeOrNetAmount: total,
      steps,
      notes,
    };
  },
};
