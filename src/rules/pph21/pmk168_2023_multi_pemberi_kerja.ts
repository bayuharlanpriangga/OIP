import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { computeProgressivePph21, getPtkpAmount } from './shared';

const sources = [SRC.PMK_168_2023, SRC.UU_7_2021_HPP, SRC.PP_58_2023, SRC.PMK_101_2016];

const regime: TaxRegime = {
  id: 'pph21_pmk168_2023_multi_pemberi_kerja',
  taxType: 'pph21',
  name: 'PMK 168/2023 Pasal 10(3) (2 Pemberi Kerja & Kurang Bayar SPT Tahunan OP)',
  shortName: '2024–Kini (2 Pemberi Kerja / PPh 29)',
  legalBasis: 'Pasal 10 ayat (3) PMK 168/PMK.03/2023 & Pasal 17 / Pasal 29 UU PPh',
  effectivePeriod: '1 Januari 2024 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pegawai Tetap di >1 Pemberi Kerja Sekaligus',
  summary:
    'Menghitung potensi Kurang Bayar PPh Pasal 29 di SPT Tahunan Orang Pribadi bagi pegawai tetap yang bekerja pada dua pemberi kerja secara bersamaan, termasuk perhitungan Biaya Jabatan terpisah per pemberi kerja (maks Rp 6 jt x 2) dan penggabungan PTKP tunggal.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph21-pmk168-2023-multi-pemberi-kerja',
  taxType: 'pph21',
  taxTypeLabel: 'PPh Pasal 21',
  title: 'Bekerja di Dua Pemberi Kerja Sekaligus: Aturan Biaya Jabatan PMK 168/2023 & PPh 29 di SPT Tahunan',
  legalBasis: 'Pasal 10 ayat (3) PMK 168/2023 & Pasal 7 / 17 / 29 UU PPh',
  effectiveDate: '1 Januari 2024',
  readMinutes: 6,
  summary:
    'Menjelaskan mengapa pegawai dengan dua Bukti Potong 1721-A1/BPA1 dari dua perusahaan hampir selalu mengalami Kurang Bayar PPh Pasal 29 saat lapor SPT Tahunan OP, dan bagaimana Biaya Jabatan tetap diakui pada masing-masing pemberi kerja.',
  sections: [
    {
      heading: 'Mengapa 2 bukti potong memicu Kurang Bayar PPh Pasal 29?',
      paragraphs: [
        'Meskipun sepanjang Januari–November tiap pemberi kerja memotong memakai tabel TER PP 58/2023 dan di Masa Desember merekonsiliasi dengan tarif progresif Pasal 17 untuk menerbitkan Bukti Potong BPA1 (eks 1721-A1), setiap pemberi kerja menghitung pemotongan PPh 21 secara terpisah tanpa mengetahui penghasilan pegawai dari perusahaan lain. Akibatnya, baik Pemberi Kerja ke-1 maupun Pemberi Kerja ke-2 masing-masing mengurangkan PTKP penuh (misalnya Rp 54.000.000) dan memulai lapisan tarif progresif Pasal 17 dari lapis terbawah 5% lagi.',
        'Saat pegawai menggabungkan kedua BPA1 tersebut dalam SPT Tahunan Orang Pribadi, Wajib Pajak hanya berhak atas SATU kali pengurangan PTKP dalam setahun pajak dan total Penghasilan Kena Pajak (PKP) gabungan terdorong ke lapisan tarif lebih tinggi (15%, 25%, dst.), sehingga timbul selisih kurang bayar PPh Pasal 29 yang wajib dilunasi sebelum lapor SPT.',
      ],
    },
    {
      heading: 'Hak Biaya Jabatan pada masing-masing pemberi kerja (Pasal 10 ayat 3)',
      paragraphs: [
        'Pasal 10 ayat (3) PMK 168/2023 menegaskan bahwa dalam hal Pegawai Tetap menerima penghasilan dari lebih dari satu pemberi kerja, Biaya Jabatan sebesar 5% (paling banyak Rp 500.000/bulan atau Rp 6.000.000/tahun) dihitung pada masing-masing pemberi kerja.',
        'Artinya, dalam pengisian SPT Tahunan PPh OP dengan dua bukti potong tetap penuh 12 bulan, akumulasi pengurangan Biaya Jabatan dari kedua pemberi kerja dapat mencapai Rp 12.000.000 setahun.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pemotongan Masing-Masing Perusahaan (Bukti Potong)',
    newHeader: 'Rekonsiliasi Gabungan di SPT Tahunan OP',
    rows: [
      {
        aspek: 'Pengurang Biaya Jabatan',
        aturanLama: '5% maks Rp 6 juta di Pemberi Kerja 1 & maks Rp 6 juta di ke-2',
        aturanBaru: 'Tetap diakui per pemberi kerja (total maks Rp 12 juta setahun)',
      },
      {
        aspek: 'Pengurang PTKP',
        aturanLama: 'Diperhitungkan ganda (1x di perusahaan A + 1x di perusahaan B)',
        aturanBaru: 'Hanya boleh dikurangkan 1 (satu) kali PTKP setahun penuh',
      },
      {
        aspek: 'Penerapan Lapisan Tarif Pasal 17',
        aturanLama: 'Dimulai ulang dari lapis 5% di masing-masing bukti potong',
        aturanBaru: 'Digabung seluruh PKP sehingga naik ke lapis 15% / 25% -> PPh 29',
      },
    ],
  },
  caseExample: {
    title: 'Pegawai TK/0 bekerja bersamaan di 2 perusahaan (gaji Rp 10 jt & Rp 8 jt per bulan)',
    scenario:
      'Gaji Pemberi Kerja 1 = Rp 10 jt/bln (Rp 120 jt/thn, PPh 21 = Rp 3 jt) dan Pemberi Kerja 2 = Rp 8 jt/bln (Rp 96 jt/thn, PPh 21 = Rp 1,86 jt). Biaya jabatan diakui di kedua perusahaan (Rp 6 jt + Rp 4,8 jt). Ketika digabung di SPT Tahunan hanya dengan 1 PTKP TK/0 (Rp 54 jt), PPh setahun melonjak menjadi Rp 16.680.000 sehingga kurang bayar PPh 29 mencapai Rp 11.820.000.',
    presetRegime: 'pph21_pmk168_2023_multi_pemberi_kerja',
    presetInput: {
      pph21: {
        gajiBulanan: 10000000,
        tunjanganTetap: 0,
        bonusTahunan: 0,
        iuranPensiunBulanan: 0,
        gajiPemberiKerja2: 8000000,
        ptkpStatus: 'TK/0',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph21Pmk168_2023MultiPemberiKerjaRule: TaxRuleModule<TaxCalculatorInput['pph21']> = {
  regime,
  article,
  calculate(input) {
    const gaji1 = Math.max(0, input.gajiBulanan);
    const gaji2 = Math.max(0, input.gajiPemberiKerja2 ?? 0);

    const bruto1 = gaji1 * 12;
    const bruto2 = gaji2 * 12;
    const totalBruto = bruto1 + bruto2;

    const biayaJabatan1 = Math.min(bruto1 * 0.05, 6000000);
    const biayaJabatan2 = Math.min(bruto2 * 0.05, 6000000);
    const totalBiayaJabatan = biayaJabatan1 + biayaJabatan2;

    const neto1 = Math.max(0, bruto1 - biayaJabatan1);
    const neto2 = Math.max(0, bruto2 - biayaJabatan2);
    const totalNeto = neto1 + neto2;

    const ptkp = getPtkpAmount(input.ptkpStatus, 'pmk101_2016');

    const pkp1 = Math.floor(Math.max(0, neto1 - ptkp) / 1000) * 1000;
    const pkp2 = Math.floor(Math.max(0, neto2 - ptkp) / 1000) * 1000;
    const pph1 = computeProgressivePph21(pkp1, 'hpp', input.hasNpwp).tax;
    const pph2 = computeProgressivePph21(pkp2, 'hpp', input.hasNpwp).tax;
    const totalKreditBuktiPotong = pph1 + pph2;

    const pkpGabungan = Math.floor(Math.max(0, totalNeto - ptkp) / 1000) * 1000;
    const { tax: totalPphGabungan, breakdown } = computeProgressivePph21(
      pkpGabungan,
      'hpp',
      input.hasNpwp
    );

    const pph29KurangBayar = Math.max(0, totalPphGabungan - totalKreditBuktiPotong);
    const effRate = totalBruto > 0 ? (totalPphGabungan / totalBruto) * 100 : 0;
    const netTahunanSetelahSpt = Math.max(0, totalBruto - totalPphGabungan);

    const steps: CalculationStep[] = [
      {
        label: 'Bruto setahun Pemberi Kerja 1 & 2 (12 bulan)',
        formula: `${formatRupiah(bruto1)} + ${formatRupiah(bruto2)}`,
        value: totalBruto,
      },
      {
        label: 'Biaya Jabatan terpisah per pemberi kerja (maks Rp 6 jt x 2)',
        formula: `PK-1 ${formatRupiah(biayaJabatan1)} + PK-2 ${formatRupiah(biayaJabatan2)}`,
        value: -totalBiayaJabatan,
        isNegative: true,
      },
      {
        label: `PTKP tunggal SPT Tahunan (${input.ptkpStatus})`,
        formula: 'PTKP hanya dikurangkan 1 kali saat penggabungan',
        value: -ptkp,
        isNegative: true,
      },
      {
        label: 'PKP gabungan dalam SPT Tahunan OP',
        value: pkpGabungan,
      },
      {
        label: 'Total PPh 21 terutang gabungan setahun (Pasal 17 UU HPP)',
        formula: breakdown,
        value: totalPphGabungan,
      },
      {
        label: 'Kredit pajak sudah dipotong (Bukti Potong 1 + Bukti Potong 2)',
        formula: `${formatRupiah(pph1)} + ${formatRupiah(pph2)}`,
        value: -totalKreditBuktiPotong,
        isNegative: true,
      },
      {
        label: 'Sisa PPh Pasal 29 Kurang Bayar di SPT Tahunan OP',
        formula: `${formatRupiah(totalPphGabungan)} - ${formatRupiah(totalKreditBuktiPotong)}`,
        value: pph29KurangBayar,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      `Sesuai Pasal 10 ayat (3) PMK 168/2023, Biaya Jabatan dihitung per pemberi kerja sehingga diakui total ${formatRupiah(totalBiayaJabatan)} dalam setahun.`,
      `Karena kedua bukti potong sama-sama mengurangkan PTKP ${formatRupiah(ptkp)} dan memulai lapis 5%, terjadi kurang bayar PPh Pasal 29 sebesar ${formatRupiah(pph29KurangBayar)} yang harus disetor sendiri sebelum pelaporan SPT Tahunan 31 Maret.`,
    ];

    if (gaji2 === 0 && gaji1 > 0) {
      notes.push(
        'Isi nominal gaji Pemberi Kerja ke-2 untuk melihat lonjakan kurang bayar PPh Pasal 29 akibat hilangnya PTKP ganda.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'Kurang Bayar PPh Pasal 29 di SPT Tahunan OP',
      primaryTaxAmount: pph29KurangBayar,
      annualTaxLabel: 'Total PPh Terutang Gabungan Setahun',
      annualTaxAmount: totalPphGabungan,
      effectiveRatePercent: effRate,
      effectiveRateLabel: 'Tarif efektif PPh gabungan atas bruto',
      takeHomeOrNetLabel: 'Total Penghasilan Neto Setelah Lunas SPT (Setahun)',
      takeHomeOrNetAmount: netTahunanSetelahSpt,
      steps,
      notes,
    };
  },
};
