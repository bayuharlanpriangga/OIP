import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_50_2025, SRC.PMK_68_2022, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph22_pmk50_2025_kripto',
  taxType: 'pph22',
  name: 'PMK 50/2025 (PPh 22 Final Aset Kripto — Pencabut PMK 68/2022)',
  shortName: 'Ags 2025–Kini (Kripto PMK 50/2025)',
  legalBasis: 'PMK Nomor 50 Tahun 2025 (Berlaku 1 Agustus 2025) & PMK 68/PMK.03/2022 (Historis)',
  effectivePeriod: '1 Agustus 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Transaksi aset kripto (PPN 0%)',
  summary:
    'Menggantikan PMK 68/2022 seiring pengklasifikasian ulang aset kripto sebagai aset keuangan setara surat berharga: PPh Pasal 22 Final penjual aset kripto sebesar 0,21% (PPMSE dalam negeri berizin OJK) atau 1% (luar negeri/non-berizin), sementara penyerahan koin bebas PPN.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph22-pmk50-2025-kripto',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Pajak Aset Kripto Terbaru: PMK 50/2025 Mencabut PMK 68/2022 (PPh 22 Final 0,21%–1%)',
  legalBasis: 'PMK Nomor 50 Tahun 2025 jo. PMK 68/PMK.03/2022',
  effectiveDate: '1 Agustus 2025',
  readMinutes: 5,
  summary:
    'Mulai 1 Agustus 2025, transaksi jual-beli aset kripto tidak lagi dipungut PPN atas penyerahan koinnya karena disamakan dengan aset keuangan/surat berharga, sementara tarif PPh Pasal 22 Final atas penjual menjadi 0,21% (bursa berizin dalam negeri) atau 1% (bursa luar negeri).',
  sections: [
    {
      heading: 'Dari PMK 68/2022 (0,1% + PPN) ke PMK 50/2025 (0,21% / 1% tanpa PPN)',
      paragraphs: [
        'Sejak 1 Mei 2022 hingga 31 Juli 2025, perdagangan aset kripto di Indonesia diatur oleh PMK 68/PMK.03/2022 yang memperlakukan kripto sebagai komoditas tidak berwujud: dikenakan PPh Pasal 22 Final 0,1% (bursa terdaftar Bappebti) atau 0,2% (non-terdaftar), ditambah PPN besaran tertentu 0,11% atau 0,22%.',
        'Pasca pengalihan pengawasan kripto kepada OJK berdasarkan UU P2SK, Kementerian Keuangan menerbitkan PMK Nomor 50 Tahun 2025 yang berlaku 1 Agustus 2025. Aset kripto dipersamakan dengan surat berharga sehingga penyerahan aset kriptonya tidak dikenai PPN (0% atas transaksi koin), dan PPh Pasal 22 Final ditetapkan 0,21% apabila melalui PPMSE dalam negeri berizin OJK atau 1% apabila melalui PPMSE luar negeri/tanpa izin.',
      ],
    },
    {
      heading: 'Kewajiban lapor SPT dan perlakuan jasa platform / penambangan',
      paragraphs: [
        'Meskipun penyerahan koin kripto bebas PPN, jasa penyediaan sarana elektronik oleh PPMSE maupun jasa penambangan kripto tetap merupakan JKP yang terutang PPN sesuai ketentuan umum (termasuk DPP nilai lain 11/12 dari tarif PPN 12% atau PPh umum untuk jasa penambangan sejak PMK 50/2025).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 68/PMK.03/2022 (Mei 2022–Jul 2025)',
    newHeader: 'PMK Nomor 50 Tahun 2025 (Mulai 1 Ags 2025)',
    rows: [
      {
        aspek: 'PPh 22 Final — Exchanger Dalam Negeri Berizin',
        aturanLama: '0,1% dari nilai transaksi',
        aturanBaru: '0,21% dari nilai transaksi (PPMSE OJK)',
      },
      {
        aspek: 'PPh 22 Final — Exchanger Luar Negeri / Non-Berizin',
        aturanLama: '0,2% dari nilai transaksi (setor sendiri)',
        aturanBaru: '1% dari nilai transaksi',
      },
      {
        aspek: 'PPN atas Penyerahan Aset Kripto',
        aturanLama: '0,11% (terdaftar) / 0,22% (non-terdaftar)',
        aturanBaru: '0% / Bukan Objek PPN (setara surat berharga)',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan aset kripto Rp 100 juta di exchanger dalam negeri berizin OJK',
    scenario:
      'Investor menjual aset kripto senilai Rp 100.000.000 melalui pedagang aset keuangan digital dalam negeri yang mengantongi izin OJK pada Agustus 2025.',
    presetRegime: 'pph22_pmk50_2025_kripto',
    presetInput: {
      pph22: {
        nilaiDasar: 100000000,
        objectType: 'impor_api',
        hasNpwp: true,
        kriptoChannel: 'dalam_negeri_ojk',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph22Pmk50_2025KriptoRule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiDasar);
    const channel = input.kriptoChannel ?? 'dalam_negeri_ojk';
    const isDomestik = channel === 'dalam_negeri_ojk';
    const rate = isDomestik ? 0.21 : 1;
    const oldPphRate = isDomestik ? 0.1 : 0.2;
    const oldPpnRate = isDomestik ? 0.11 : 0.22;
    const tax = Math.round((nilaiTransaksi * rate) / 100);
    const netReceived = Math.max(0, nilaiTransaksi - tax);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi penjualan aset kripto', value: nilaiTransaksi },
      {
        label: isDomestik
          ? 'Tarif PPh 22 Final PPMSE dalam negeri berizin OJK (PMK 50/2025)'
          : 'Tarif PPh 22 Final PPMSE luar negeri / non-berizin (PMK 50/2025)',
        formula: isDomestik
          ? `0,21% (menggantikan PPh 0,1% + PPN 0,11% PMK 68/2022)`
          : `1% (menggantikan PPh 0,2% + PPN 0,22% PMK 68/2022)`,
        value: rate,
        format: 'percent',
      },
      { label: 'PPN atas penyerahan aset kripto', formula: 'Bebas PPN per PMK 50/2025', value: 0 },
      {
        label: 'PPh Pasal 22 Final dipungut / disetor sendiri',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Hasil penjualan bersih diterima penjual (sebelum fee bursa)', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh 22 Final Aset Kripto Terutang',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Transaksi Setelah PPh 22 Final',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        `Di era PMK 50/2025 (mulai 1 Agustus 2025), PPh 22 Final bersifat final dan tidak lagi disertai pungutan PPN atas koin (${formatPersen(rate)} total vs rezim lama PMK 68/2022 total ${formatPersen(oldPphRate + oldPpnRate)}).`,
        'Apabila transaksi dilakukan melalui exchanger luar negeri yang belum ditunjuk sebagai pemungut, Wajib Pajak wajib menghitung dan menyetor sendiri PPh 22 Final 1% paling lambat tanggal 15 bulan berikutnya.',
      ],
    };
  },
};
