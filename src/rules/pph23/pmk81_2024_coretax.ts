import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';
import { getPph23Label } from './pmk141_2015';

const sources = [SRC.PMK_81_2024, SRC.PMK_141_2015, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph23_pmk81_2024',
  taxType: 'pph23',
  name: 'PMK 81/2024 & PMK 141/2015 (Unifikasi PPh 23 Era Coretax)',
  shortName: '2025–Kini (Coretax PMK 81/2024)',
  legalBasis: 'PMK Nomor 81 Tahun 2024 jo. PMK 141/PMK.03/2015 & Pasal 23 UU PPh',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — e-Bupot Unifikasi & validasi NIK/NPWP 16 digit',
  summary:
    'Penyelarasan tata cara pemotongan, penyetoran (tanggal 15), dan pelaporan SPT Masa PPh Unifikasi dalam sistem Coretax per 1 Januari 2025 (PMK 81/2024): tarif pokok tetap 2% (jasa/sewa harta) dan 15% (royalti/dividen non-pengecualian), dengan integrasi penuh NIK sebagai NPWP 16 digit.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph23-pmk81-2024',
  taxType: 'pph23',
  taxTypeLabel: 'PPh Pasal 23',
  title: 'PPh Pasal 23 Era Coretax (PMK 81/2024): SPT Masa Unifikasi, Tanggal Setor 15, & Validasi NIK',
  legalBasis: 'PMK Nomor 81 Tahun 2024 jo. PMK Nomor 141/PMK.03/2015',
  effectiveDate: '1 Januari 2025',
  readMinutes: 4,
  summary:
    'Mengurai dampak pemberlakuan Coretax melalui PMK 81/2024 terhadap pemotongan PPh Pasal 23: penggabungan administrasi bukti potong dalam SPT Unifikasi, tenggat setor seragam tanggal 15, serta validasi identitas NIK sebagai NPWP 16 digit.',
  sections: [
    {
      heading: 'Tarif pokok tetap mengacu PMK 141/2015 & UU PPh, administrasi beralih ke Coretax',
      paragraphs: [
        'Dari sisi tarif material, PMK 81 Tahun 2024 tidak mengubah besaran tarif pemotongan PPh Pasal 23: tetap 2% dari jumlah bruto atas jasa teknik, manajemen, konsultan, jenis jasa lain (62 kelompok jasa dalam PMK 141/2015), serta sewa harta selain tanah/bangunan; dan 15% atas royalti, bunga non-bank, hadiah/penghargaan, serta dividen yang bukan objek pengecualian UU HPP.',
        'Perubahan utama terletak pada sistem administrasi Coretax: bukti potong PPh 23 diterbitkan dalam modul e-Bupot Unifikasi yang langsung mengisi SPT Masa Unifikasi (tenggat setor seragam paling lambat tanggal 15 dan lapor tanggal 20 bulan berikutnya).',
      ],
    },
    {
      heading: 'Validasi NIK 16 digit vs penalti tarif +100% tanpa NPWP',
      paragraphs: [
        'Berdasarkan UU PPh Pasal 23 ayat (1a), penerima penghasilan yang tidak memiliki NPWP dipotong tarif 100% lebih tinggi (menjadi 4% untuk jasa atau 30% untuk royalti). Di era PMK 81/2024, Wajib Pajak Orang Pribadi penduduk yang NIK-nya telah dipadankan sebagai NPWP 16 digit dikenai tarif normal 2% / 15% (penalti ganda hanya aktif jika pihak penerima benar-benar tidak memiliki identitas perpajakan valid).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum Coretax (s.d. 31 Des 2024)',
    newHeader: 'Era Coretax — PMK 81/2024 (1 Jan 2025–Kini)',
    rows: [
      {
        aspek: 'Batas waktu penyetoran PPh 23',
        aturanLama: 'Tanggal 10 bulan berikutnya',
        aturanBaru: 'Diseragamkan menjadi tanggal 15 bulan berikutnya',
      },
      {
        aspek: 'Identitas penerima Orang Pribadi',
        aturanLama: 'NPWP 15 digit terpisah (sering kena 4% bila lupa bawa kartu)',
        aturanBaru: 'NIK / NPWP 16 digit tervalidasi sistem Coretax',
      },
      {
        aspek: 'Tarif 2% Jasa / Sewa & 15% Royalti',
        aturanLama: '2% & 15% (PMK 141/2015 & UU PPh)',
        aturanBaru: 'Tetap 2% & 15% (100% lebih tinggi jika tanpa NPWP/NIK valid)',
      },
    ],
  },
  caseExample: {
    title: 'Jasa konsultan IT senilai Rp 100 juta pada masa pajak 2025 (e-Bupot Unifikasi)',
    scenario:
      'PT Nusantara membayar jasa konsultan IT Rp 100.000.000 kepada vendor ber-NPWP/NIK valid di era Coretax 2025. PPh Pasal 23 dipotong 2% = Rp 2.000.000 dan disetor maksimal tanggal 15 bulan berikutnya.',
    presetRegime: 'pph23_pmk81_2024',
    presetInput: {
      pph23: {
        nilaiBruto: 100000000,
        objectType: 'jasa_konsultan',
        hasNpwp: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph23Pmk81_2024Rule: TaxRuleModule<TaxCalculatorInput['pph23']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const is15Percent = input.objectType === 'royalti' || input.objectType === 'dividen_badan';
    const baseRate = is15Percent ? 15 : 2;
    const rate = input.hasNpwp ? baseRate : baseRate * 2;
    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const steps: CalculationStep[] = [
      { label: `Penghasilan bruto (${getPph23Label(input.objectType)})`, value: bruto },
      {
        label: 'Tarif PPh 23 Era Coretax',
        formula: input.hasNpwp
          ? `Tarif normal Pasal 23 (${formatPersen(baseRate)})`
          : `Tarif +100% tanpa NPWP/NIK valid (${formatPersen(baseRate)} x 2)`,
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 23 dipotong (Bukti Potong Unifikasi)',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Pembayaran bersih diterima rekanan', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 23 Terutang (PMK 81/2024)',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Pembayaran Bersih ke Rekanan',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'Di era PMK 81/2024, batas penyetoran PPh Pasal 23 diseragamkan menjadi tanggal 15 bulan berikutnya dan pelaporan melalui SPT Masa Unifikasi Coretax paling lambat tanggal 20.',
        is15Percent && input.objectType === 'dividen_badan'
          ? 'Dividen yang diterima PT/Badan Dalam Negeri dikecualikan dari pemotongan PPh 23 (0%) sejak UU Cipta Kerja/UU HPP tanpa syarat kepemilikan minimum 25%.'
          : 'Pastikan NIK atau NPWP 16 digit rekanan tervalidasi pada sistem Coretax untuk menghindari pemotongan tarif ganda.',
      ],
    };
  },
};
