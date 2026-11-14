import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_72_2023, SRC.UU_7_2021_HPP, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'badan_pmk72_2023_penyusutan',
  taxType: 'pph_badan',
  name: 'PMK 72/2023 (Penyusutan Harta Berwujud & Amortisasi Bangunan > 20 Tahun)',
  shortName: '2023–Sekarang (Penyusutan & Amortisasi PMK 72/2023)',
  legalBasis: 'Pasal 11 & 11A UU HPP jo. PMK Nomor 72 Tahun 2023',
  effectivePeriod: '17 Juli 2023 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Tarif penyusutan Kelompok 1–4 & Bangunan Permanen > 20 thn',
  summary:
    'Aturan pelaksana baru penyusutan fiskal di bawah UU HPP (PMK 72/2023): menyinkronkan masa manfaat Kelompok 1 (4 thn: 25% GL / 50% SM), Kelompok 2 (8 thn: 12,5% GL / 25% SM), Kelompok 3 (16 thn: 6,25% GL / 12,5% SM), Kelompok 4 (20 thn: 5% GL / 10% SM), serta memberi opsi penyusutan sesuai masa manfaat sebenarnya bagi bangunan permanen dan harta tak berwujud dengan masa manfaat > 20 tahun.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'badan-pmk72-2023-penyusutan',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Penyusutan Fiskal & Amortisasi Era PMK 72/2023: Kelompok 1–4 hingga Bangunan Permanen',
  legalBasis: 'PMK Nomor 72 Tahun 2023 jo. Pasal 11 & 11A UU PPh (UU HPP)',
  effectiveDate: '17 Juli 2023',
  readMinutes: 5,
  summary:
    'Membandingkan metode Garis Lurus (Straight Line) dan Saldo Menurun (Declining Balance) per kelompok harta fiskal serta hak memilih masa manfaat sebenarnya bagi bangunan permanen > 20 tahun di PMK 72/2023.',
  sections: [
    {
      heading: 'Pilihan Garis Lurus vs Saldo Menurun serta inovasi masa manfaat > 20 tahun',
      paragraphs: [
        'Dalam menghitung Penghasilan Kena Pajak PPh Badan, Wajib Pajak dapat menyusutkan aset tetap berwujud non-bangunan menggunakan metode Garis Lurus (persentase tetap dari nilai perolehan) atau Saldo Menurun (persentase ganda dari nilai sisa buku fiskal dan disusutkan sekaligus di akhir masa manfaat). Untuk bangunan permanen hanya diperbolehkan metode Garis Lurus sebesar 5% per tahun (20 tahun).',
        'Pembaruan utama pada UU HPP dan PMK 72/2023 adalah apabila perusahaan memiliki bangunan permanen atau harta tak berwujud yang masa manfaat ekonomisnya lebih dari 20 tahun (misalnya 30 atau 40 tahun), Wajib Pajak diberikan pilihan untuk menyusutkan sesuai masa manfaat sebenarnya menurut pembukuan setelah menyampaikan pemberitahuan kepada DJP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Kelompok Harta Fiskal (PMK 72/2023)',
    newHeader: 'Tarif Garis Lurus vs Saldo Menurun',
    rows: [
      {
        aspek: 'Kelompok 1 (4 thn) & Kelompok 2 (8 thn)',
        aturanLama: 'Laptop, kendaraan ringan, mesin kantor',
        aturanBaru: 'Kel 1: 25% GL / 50% SM · Kel 2: 12,5% GL / 25% SM',
      },
      {
        aspek: 'Kelompok 3 (16 thn) & Kelompok 4 (20 thn)',
        aturanLama: 'Mesin berat pertambangan/manufaktur, kapal, pesawat',
        aturanBaru: 'Kel 3: 6,25% GL / 12,5% SM · Kel 4: 5% GL / 10% SM',
      },
      {
        aspek: 'Bangunan Permanen (≥ 20 thn)',
        aturanLama: 'Gedung, pabrik, gudang komersial',
        aturanBaru: '5% Garis Lurus (atau sesuai umur pembukuan bila > 20 thn & lapor DJP)',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan penyusutan mesin produksi Kelompok 2 senilai Rp 2.000.000.000 & penghematan PPh Badan',
    scenario:
      'Korporasi memperoleh mesin pabrik Kelompok 2 (8 tahun) senilai Rp 2.000.000.000 di awal tahun pajak dan membukukan laba fiskal sebelum penyusutan Rp 3.000.000.000.',
    presetRegime: 'badan_pmk72_2023_penyusutan',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 30000000000,
        penghasilanKenaPajak: 3000000000,
        isTbk: false,
        nilaiInvestasiAtauRnd: 2000000000,
        kelompokHartaPenyusutan: 'kel_2_8thn',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPmk72_2023PenyusutanRule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const nilaiHarta = Math.max(0, input.nilaiInvestasiAtauRnd ?? 0);
    const pkpSebelumSusut = Math.max(0, input.penghasilanKenaPajak);
    const kel = input.kelompokHartaPenyusutan ?? 'kel_2_8thn';

    const rateMap: Record<
      NonNullable<TaxCalculatorInput['pph_badan']['kelompokHartaPenyusutan']>,
      { gl: number; sm: number | null; label: string }
    > = {
      kel_1_4thn: { gl: 25, sm: 50, label: 'Kelompok 1 (4 Tahun)' },
      kel_2_8thn: { gl: 12.5, sm: 25, label: 'Kelompok 2 (8 Tahun)' },
      kel_3_16thn: { gl: 6.25, sm: 12.5, label: 'Kelompok 3 (16 Tahun)' },
      kel_4_20thn: { gl: 5, sm: 10, label: 'Kelompok 4 (20 Tahun)' },
      bangunan_20thn: { gl: 5, sm: null, label: 'Bangunan Permanen (20 Tahun — Garis Lurus)' },
    };

    const info = rateMap[kel];
    const penyusutanGlTahun1 = Math.round((nilaiHarta * info.gl) / 100);
    const penyusutanSmTahun1 = info.sm !== null ? Math.round((nilaiHarta * info.sm) / 100) : penyusutanGlTahun1;
    const dipakai = info.sm !== null ? penyusutanSmTahun1 : penyusutanGlTahun1;

    const pkpSetelahSusut = Math.max(0, pkpSebelumSusut - dipakai);
    const tarifBadan = input.isTbk ? 0.19 : 0.22;
    const pphBadan = Math.round(pkpSetelahSusut * tarifBadan);
    const taxShieldTahun1 = Math.round(dipakai * tarifBadan);

    const steps: CalculationStep[] = [
      { label: `Harga perolehan harta (${info.label})`, value: nilaiHarta },
      { label: `Penyusutan Tahun 1 Garis Lurus (${formatPersen(info.gl)})`, value: penyusutanGlTahun1 },
      ...(info.sm !== null
        ? [{ label: `Penyusutan Tahun 1 Saldo Menurun (${formatPersen(info.sm)})`, value: penyusutanSmTahun1 }]
        : []),
      { label: 'PKP setelah pengurang biaya penyusutan fiskal', value: pkpSetelahSusut },
      {
        label: `PPh Badan terutang (${formatPersen(tarifBadan * 100)})`,
        value: pphBadan,
        isHighlight: true,
      },
      { label: 'Penghematan kas pajak (tax shield penyusutan Tahun 1)', value: taxShieldTahun1 },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Setelah Penyusutan Tahun 1',
      primaryTaxAmount: pphBadan,
      annualTaxLabel: 'Tax Shield Penyusutan Tahun 1',
      annualTaxAmount: taxShieldTahun1,
      effectiveRatePercent: pkpSetelahSusut > 0 ? (pphBadan / pkpSetelahSusut) * 100 : 0,
      takeHomeOrNetLabel: 'Beban Penyusutan Fiskal Tahun 1',
      takeHomeOrNetAmount: dipakai,
      steps,
      notes: [
        info.sm !== null
          ? `Metode Saldo Menurun (${formatPersen(info.sm)}) menghasilkan beban penyusutan Tahun 1 dua kali lebih besar daripada Garis Lurus (${formatPersen(info.gl)}), menunda pembayaran pajak lebih cepat.`
          : 'Bangunan permanen wajib disusutkan dengan metode Garis Lurus 5%/tahun (atau sesuai umur sebenarnya > 20 tahun jika memberitahukan ke DJP per PMK 72/2023).',
      ],
    };
  },
};
