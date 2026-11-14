import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_215_2018, SRC.PMK_81_2024, SRC.KEP_537_2000_DJP];

const regime: TaxRegime = {
  id: 'pph25_pmk81_2024_wp_baru_transisi',
  taxType: 'pph25',
  name: 'PMK 215/2018 & Pasal 25(2) UU PPh jo. PMK 81/2024 (WP Baru, Masa Sebelum SPT, & Merger)',
  shortName: '2018–Kini (WP Baru & Masa Sebelum SPT)',
  legalBasis: 'Pasal 25 ayat (2) & (7) UU PPh jo. Pasal 10 PMK 215/2018 & PMK 81/2024',
  effectivePeriod: '31 Desember 2018 – Sekarang (Jatuh Tempo Tgl 15)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — WP Baru Nihil (Rp 0), Masa Sebelum SPT (Des Tahun Lalu), & Merger',
  summary:
    'Mengatur skenario khusus angsuran bulanan PPh Pasal 25 yang paling sering menimbulkan kekeliruan saat pelaporan masa: (1) Wajib Pajak baru terdaftar berangsuran Nihil Rp 0 hingga SPT Tahunan pertamanya; (2) Masa pajak Jan–Feb/Mar sebelum batas waktu SPT Tahunan memakai nilai angsuran bulan Desember tahun lalu; (3) WP hasil merger menjumlahkan angsuran entitas pembentuknya; serta (4) WP Baru OPPT tetap setor 0,75% omzet.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pmk81-2024-wp-baru-transisi',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Angsuran PPh Pasal 25 WP Baru, Masa Sebelum SPT Tahunan, & Penggabungan Usaha (PMK 215/2018 jo. PMK 81/2024)',
  legalBasis: 'Pasal 25 ayat (2) UU PPh, Pasal 10 PMK 215/PMK.03/2018, & PMK 81/2024',
  effectiveDate: '31 Desember 2018 (Jatuh Tempo Coretax 1 Januari 2025)',
  readMinutes: 4,
  summary:
    'Mengapa perusahaan yang baru berdiri di tahun berjalan mempunyai angsuran PPh 25 Nihil (Rp 0) dan bagaimana menentukan angsuran masa Januari–Maret sebelum SPT Tahunan Badan dilaporkan.',
  sections: [
    {
      heading: 'Wajib Pajak Baru berangsuran Nihil Rp 0 (menggantikan aturan lama 1/12 disetahunkan)',
      paragraphs: [
        'Sebelumnya di era KEP-537/PJ./2000 & PMK 255/2008, Wajib Pajak baru harus menghitung angsuran PPh 25 dari laba pembukuan bulan pertama yang disetahunkan. Sejak berlakunya PMK 215/PMK.03/2018 (Pasal 10), Wajib Pajak baru (selain bank, BUMN, emiten, OPPT, atau hasil restrukturisasi usaha) ditetapkan angsuran PPh Pasal 25-nya sebesar NIHIL (Rp 0) sampai dengan akhir tahun pajak pertama.',
      ],
    },
    {
      heading: 'Masa pajak sebelum batas SPT Tahunan & penggabungan usaha (merger)',
      paragraphs: [
        'Berdasarkan Pasal 25 ayat (2) UU PPh, untuk bulan-bulan sebelum batas waktu penyampaian SPT Tahunan (Januari–Februari bagi OP atau Januari–Maret bagi Badan dengan tahun buku kalender), besaran angsuran PPh 25 sama dengan angsuran bulan terakhir tahun pajak sebelumnya (Desember). Baru setelah SPT Tahunan disampaikan, angsuran disesuaikan ulang.',
        'Adapun bagi perusahaan hasil penggabungan, peleburan, atau pemekaran usaha, jumlah angsuran PPh 25 untuk sisa bulan tahun berjalan dihitung dari penjumlahan angsuran PPh 25 seluruh entitas peserta merger.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 522 / KEP-537 Lama (Pra-2018)',
    newHeader: 'PMK 215/2018 jo. PMK 81/2024 (Kini)',
    rows: [
      {
        aspek: 'Wajib Pajak Baru (non-Bank/BUMN/OPPT/Merger)',
        aturanLama: 'Laba neto bulan berjalan × 12 × tarif PPh ÷ 12',
        aturanBaru: 'Ditetapkan NIHIL (Rp 0) hingga SPT Tahunan tahun pertama (Pasal 10 PMK 215/2018)',
      },
      {
        aspek: 'Angsuran masa Jan–Mar sebelum SPT Badan',
        aturanLama: 'Sama dengan angsuran bulan Desember tahun pajak lalu',
        aturanBaru: 'Tetap sama dengan bulan Desember tahun pajak lalu (Pasal 25 ayat 2 UU PPh)',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan PT baru berdiri Mei 2026 (bukan OPPT/Bank/BUMN) berstatus PPh 25 Nihil',
    scenario:
      'Sebuah PT swasta baru berdiri pada Mei 2026 dan belum memiliki SPT Tahunan sebelumnya. Berdasarkan Pasal 10 PMK 215/2018, angsuran PPh Pasal 25 setiap bulan selama tahun pajak 2026 adalah Nihil (Rp 0).',
    presetRegime: 'pph25_pmk81_2024_wp_baru_transisi',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 0,
        bulanBerjalan: 12,
        skemaWpBaruTransisi: 'wp_baru_umum',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pmk81_2024WpBaruTransisiRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const skema = input.skemaWpBaruTransisi ?? 'wp_baru_umum';
    const baseDesember = Math.max(0, input.pphTerutangTahunLalu);
    const secondEntity = Math.max(0, input.kreditPajakTahunLalu);
    const omzetOppt = Math.max(0, input.omzetOpptBulanan ?? 0);

    let angsuranBulanan = 0;
    let formulaLabel = '';

    if (skema === 'wp_baru_umum') {
      angsuranBulanan = 0;
      formulaLabel = 'Pasal 10 PMK 215/2018: WP Baru ditetapkan Nihil (Rp 0)';
    } else if (skema === 'masa_sebelum_spt') {
      angsuranBulanan = baseDesember;
      formulaLabel = `Pasal 25(2) UU PPh: Mengikuti angsuran Des tahun lalu (${formatRupiah(baseDesember)})`;
    } else if (skema === 'penggabungan_peleburan') {
      angsuranBulanan = baseDesember + secondEntity;
      formulaLabel = `${formatRupiah(baseDesember)} + ${formatRupiah(secondEntity)} (akumulasi peserta merger)`;
    } else {
      angsuranBulanan = Math.round(omzetOppt * 0.0075);
      formulaLabel = `${formatRupiah(omzetOppt)} x 0,75% (khusus WP Baru OP Pengusaha Tertentu)`;
    }

    const steps: CalculationStep[] = [
      {
        label: 'Angsuran PPh Pasal 25 yang harus disetor bulan berjalan',
        formula: formulaLabel,
        value: angsuranBulanan,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh Pasal 25 / Bulan',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: 'Proyeksi Setoran 12 Masa',
      annualTaxAmount: angsuranBulanan * 12,
      effectiveRatePercent: skema === 'wp_baru_oppt' ? 0.75 : 0,
      takeHomeOrNetLabel: 'Kewajiban Setor Maksimal Tanggal 15 Bulan Berikutnya',
      takeHomeOrNetAmount: angsuranBulanan,
      steps,
      notes: [
        skema === 'wp_baru_umum'
          ? 'WP Baru (selain bank/BUMN/emiten/OPPT/penggabungan) berangsuran Nihil Rp 0 pada tahun pertama; pajak kurang bayar diselesaikan sekaligus sebagai PPh Pasal 29 saat SPT Tahunan pertama dilaporkan.'
          : 'Penyetoran PPh Pasal 25 dilakukan paling lambat tanggal 15 bulan berikutnya (sesuai PMK 81/2024 era Coretax, penyetoran PPh 25 Nihil tetap dapat terlapor secara sistem atau nihil tanpa SSP).',
      ],
    };
  },
};
