import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_32_2019, SRC.PMK_70_2010, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pmk32_2019_ekspor_jkp',
  taxType: 'ppn',
  name: 'PMK 32/PMK.010/2019 (Ekspor Jasa Kena Pajak Tarif 0% — 10 Jenis JKP)',
  shortName: '2019–Kini (Ekspor JKP Tarif 0%)',
  legalBasis: 'Pasal 4(1)(h) UU PPN & PMK Nomor 32/PMK.010/2019 (mencabut PMK 70/2010)',
  effectivePeriod: '29 Maret 2019 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Uji Kepatuhan Tarif 0% Ekspor Jasa (IT, Maklon, Konsultansi)',
  summary:
    'Memverifikasi apakah ekspor jasa ke luar daerah pabean memenuhi daftar jenis jasa dan 2 syarat formal PMK 32/2019 untuk memperoleh PPN tarif 0% (dengan Pajak Masukan tetap dapat dikreditkan/direstitusi) versus gugur ke tarif PPN dalam negeri 11%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk32-2019-ekspor-jkp',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'Ekspor Jasa Kena Pajak PPN 0% (PMK 32/PMK.010/2019): Perluasan 10 Kelompok JKP & Syarat Formal',
  legalBasis: 'Pasal 4–6 PMK Nomor 32/PMK.010/2019',
  effectiveDate: '29 Maret 2019',
  readMinutes: 6,
  summary:
    'Membandingkan pembatasan ketat 3 jenis jasa era PMK 70/2010 dengan perluasan 10 kelompok Ekspor JKP tarif 0% di bawah PMK 32/2019, termasuk jasa TI/software, konsultansi manajemen/hukum, riset, hingga perdagangan interkoneksi.',
  sections: [
    {
      heading: 'Perluasan daftar Ekspor JKP dari 3 jenis menjadi 10 kelompok',
      paragraphs: [
        'Sebelumnya di bawah PMK 70/PMK.03/2010 stdd PMK 30/PMK.03/2011, fasilitas Ekspor JKP bertarif 0% hanya terbatas pada 3 jenis jasa (maklon, perbaikan/perawatan barang bergerak di luar pabean, dan konsultansi konstruksi bangunan di luar negeri). Akibatnya, ekspor jasa pengembangan software atau konsultansi bisnis ke luar negeri dahulu kerap terkena PPN dalam negeri 10%.',
        'Sejak 29 Maret 2019, PMK 32/PMK.010/2019 memperluas cakupan Ekspor JKP tarif 0% menjadi jasa melekat pada barang bergerak (maklon, perawatan, pengurusan transportasi ekspor), jasa melekat pada barang tidak bergerak di luar negeri (konsultansi konstruksi), serta jasa yang hasilnya dimanfaatkan di luar daerah pabean: teknologi informasi (software, hosting, cloud), penelitian & pengembangan, persewaan pesawat/kapal internasional, jasa konsultansi bisnis/manajemen/hukum/akuntansi/desain interior, jasa perdagangan pencari pemasok ekspor, serta interkoneksi telekomunikasi/satelit.',
      ],
    },
    {
      heading: 'Dua syarat formal kumulatif wajib agar tidak terkena PPN 11%',
      paragraphs: [
        'Pasal 3 dan Pasal 6 PMK 32/2019 mensyaratkan dua bukti wajib: (1) didasarkan atas kontrak/perikatan tertulis antara PKP di Indonesia dan penerima ekspor di luar daerah pabean yang mencantumkan jenis, rincian kegiatan, serta nilai penggantian, DAN (2) terdapat pembayaran resmi disertai bukti pembayaran yang sah dari penerima ekspor di luar daerah pabean kepada PKP di Indonesia (Pemberitahuan Ekspor JKP / PEJKP).',
        'Apabila jenis jasanya di luar daftar PMK 32/2019 atau tidak memenuhi syarat formal kontrak/pembayaran luar negeri, penyerahan tersebut dianggap sebagai penyerahan di dalam daerah pabean dan terutang PPN efektif 11% (PMK 131/2024).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 70/PMK.03/2010 (2010–Mar 2019)',
    newHeader: 'PMK 32/PMK.010/2019 (Mar 2019–Kini)',
    rows: [
      {
        aspek: 'Jasa TI, software house, & konsultansi hukum/bisnis ke LN',
        aturanLama: 'Tidak masuk daftar 0% (kena PPN dalam negeri 10%)',
        aturanBaru: 'Masuk kelompok Ekspor JKP bertarif 0% (PM tetap bisa dikreditkan)',
      },
      {
        aspek: 'Dokumen ekspor',
        aturanLama: 'Terbatas maklon/perbaikan/konstruksi LN',
        aturanBaru: 'Wajib Kontrak Tertulis + Bukti Pembayaran LN + PEJKP',
      },
    ],
  },
  caseExample: {
    title: 'Software house PKP di Jakarta mengekspor jasa pengembangan sistem Rp 500 juta ke klien Singapura',
    scenario:
      'Jasa pengembangan IT termasuk daftar Ekspor JKP PMK 32/2019, dilengkapi kontrak tertulis dan transfer pembayaran dari entitas Singapura (tanpa BUT di Indonesia). PPN Ekspor JKP = 0% (Rp 0), menghemat Rp 55.000.000 dibanding bila gagal syarat formal yang terutang PPN 11%.',
    presetRegime: 'ppn_pmk32_2019_ekspor_jkp',
    presetInput: {
      ppn: {
        hargaJualDpp: 500000000,
        goodsType: 'umum',
        termasukPpn: false,
        jenisEksporJkp: 'maklon_desain_it',
        isMemenuhiSyaratEksporJkp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk32_2019EksporJkpRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPenggantian = Math.max(0, input.hargaJualDpp);
    const jenis = input.jenisEksporJkp ?? 'maklon_desain_it';
    const syaratFormal = input.isMemenuhiSyaratEksporJkp !== false;

    const isEligibleList = jenis !== 'jasa_lain_non_list';
    const isZeroRated = isEligibleList && syaratFormal;

    const effRate = isZeroRated ? 0 : 11;
    const ppnTerutang = isZeroRated ? 0 : Math.round(nilaiPenggantian * 0.11);
    const ppnJikaDomestik = Math.round(nilaiPenggantian * 0.11);
    const hematPpnEkspor = isZeroRated ? ppnJikaDomestik : 0;

    const jenisLabelMap: Record<NonNullable<TaxCalculatorInput['ppn']['jenisEksporJkp']>, string> = {
      maklon_desain_it: 'Jasa Maklon / TI & Software / Perawatan Barang Ekspor (Eligible 0%)',
      konsultansi_konstruksi_hukum: 'Jasa Konsultansi Bisnis, Hukum, Akuntansi, Arsitektur & Konstruksi LN (Eligible 0%)',
      riset_perdagangan_interkoneksi: 'Jasa Litbang (R&D), Perdagangan Ekspor & Interkoneksi Satelit (Eligible 0%)',
      jasa_lain_non_list: 'Jasa selain daftar PMK 32/2019 atau dikonsumsi di Indonesia (Non-0%)',
    };

    const steps: CalculationStep[] = [
      {
        label: 'Nilai penggantian kontrak jasa kepada penerima di luar negeri',
        value: nilaiPenggantian,
      },
      {
        label: 'Uji Jenis Jasa PMK 32/PMK.010/2019',
        formula: jenisLabelMap[jenis],
        value: isEligibleList ? 1 : 0,
        format: 'text',
        displayValue: isEligibleList ? 'Eligible 0%' : 'Non-0%',
      },
      {
        label: 'Uji Syarat Formal (Kontrak Tertulis LN + Bukti Bayar LN + PEJKP)',
        formula: syaratFormal ? 'Terpenuhi lengkap (Berhak Tarif 0%)' : 'Tidak lengkap (Gugur ke PPN 11%)',
        value: effRate,
        format: 'percent',
      },
      {
        label: isZeroRated ? 'PPN Ekspor JKP Tarif 0% (PEJKP)' : 'PPN Terutang Dianggap Penyerahan Dalam Negeri (11%)',
        formula: isZeroRated
          ? `0% x ${formatRupiah(nilaiPenggantian)}`
          : `12% x (11/12 x ${formatRupiah(nilaiPenggantian)})`,
        value: ppnTerutang,
        isHighlight: true,
      },
    ];

    const notes: string[] = [];
    if (isZeroRated) {
      notes.push(
        `Transaksi memenuhi syarat Ekspor JKP PMK 32/PMK.010/2019 sehingga dikenai PPN 0% (menghemat beban tagihan ke klien luar negeri sebesar ${formatRupiah(hematPpnEkspor)}), sedangkan Pajak Masukan terkait tetap dapat dikreditkan.`
      );
    } else if (!isEligibleList) {
      notes.push(
        'Jenis jasa berada di luar cakupan Pasal 4 PMK 32/2019 atau pemanfaatannya berlangsung di dalam daerah pabean Indonesia, sehingga terutang PPN efektif 11% (PMK 131/2024).'
      );
    } else {
      notes.push(
        'Meskipun jenis jasa termasuk dalam daftar PMK 32/2019, kegagalan memenuhi kontrak tertulis atau bukti pembayaran dari luar negeri membuat fasilitas 0% gugur dan terutang PPN dalam negeri 11%.'
      );
    }

    return {
      regime,
      primaryTaxLabel: isZeroRated ? 'PPN Ekspor JKP (Tarif 0%)' : 'PPN Terutang Akibat Gugur Syarat (11%)',
      primaryTaxAmount: ppnTerutang,
      annualTaxLabel: isZeroRated ? 'Nilai Manfaat Tarif 0% vs Penyerahan Domestik' : 'Beban PPN Tambahan',
      annualTaxAmount: isZeroRated ? hematPpnEkspor : ppnTerutang,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Tagihan Kontrak ke Penerima Luar Negeri',
      takeHomeOrNetAmount: nilaiPenggantian + ppnTerutang,
      steps,
      notes,
    };
  },
};
