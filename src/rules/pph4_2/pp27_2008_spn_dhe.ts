import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_27_2008, SRC.PP_8_2025, SRC.PP_36_2023, SRC.PP_123_2015];

const regime: TaxRegime = {
  id: 'pph4_2_spn_pp27_2008',
  taxType: 'pph4_2',
  name: 'PP 27/2008 (Diskonto SPN 20%) & DHE SDA (PP 36/2023 jo. PP 8/2025)',
  shortName: '2008–Kini (SPN 20% & DHE SDA PP 8/2025)',
  legalBasis: 'PP Nomor 27 Tahun 2008 jo. PP Nomor 36 Tahun 2023 & PP Nomor 8 Tahun 2025',
  effectivePeriod: '2008 – Sekarang (DHE SDA 100% 12 Bln Berlaku 1 Mar 2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Diskonto SPN & Retensi DHE SDA 100% (PP 8/2025)',
  summary:
    'Mengatur PPh Final 20% atas diskonto Surat Perbendaharaan Negara (SPN <= 12 bulan) dalam PP 27/2008 serta integrasi insentif PPh Final bunga deposito DHE SDA di bawah PP 36/2023 jo. PP 8/2025 (wajib parkir 100% selama 12 bulan untuk non-migas mulai 1 Maret 2025).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-spn-pp27-2008',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final Diskonto SPN (PP 27/2008) dan Aturan Terbaru DHE SDA 100% (PP 8/2025)',
  legalBasis: 'PP Nomor 27 Tahun 2008 jo. PP Nomor 8 Tahun 2025 & PP Nomor 123 Tahun 2015',
  effectiveDate: '1 Maret 2025 (PP 8/2025); 2008 (PP 27/2008)',
  readMinutes: 5,
  summary:
    'Mengulas pengenaan PPh Final 20% atas diskonto SPN (Surat Utang Negara berjangka <= 12 bulan) serta pembaruan kebijakan Devisa Hasil Ekspor Sumber Daya Alam dalam PP 8/2025 yang mewajibkan retensi 100% selama 12 bulan (bunga deposito bebas PPh 0%).',
  sections: [
    {
      heading: 'Diskonto Surat Perbendaharaan Negara (SPN) — PP 27/2008',
      paragraphs: [
        'Surat Perbendaharaan Negara (SPN) adalah Surat Utang Negara jangka pendek (paling lama 12 bulan) yang diterbitkan dengan pembayaran bunga secara diskonto. Berdasarkan PP Nomor 27 Tahun 2008 jo. PMK 63/PMK.03/2008, selisih diskonto SPN dikenai PPh Final sebesar 20% bagi Wajib Pajak Dalam Negeri (dan 20% atau tarif P3B bagi WPLN).',
        'Pemotongan 20% tersebut dikecualikan apabila diskonto SPN diterima oleh bank yang didirikan di Indonesia / cabang bank asing, Dana Pensiun yang disahkan Menkeu, atau reksadana terdaftar selama 5 tahun pertama.',
      ],
    },
    {
      heading: 'Pembaruan DHE SDA: Dari PP 36/2023 (30% 3 Bulan) ke PP 8/2025 (100% 12 Bulan)',
      paragraphs: [
        'Untuk menjaga cadangan devisa nasional, PP Nomor 36 Tahun 2023 sebelumnya mewajibkan eksportir sektor pertambangan, perkebunan, kehutanan, dan perikanan menempatkan minimal 30% DHE SDA selama 3 bulan di rekening khusus bank nasional.',
        'Mulai 1 Maret 2025 melalui PP Nomor 8 Tahun 2025, kewajiban retensi untuk sektor non-migas (pertambangan selain migas, perkebunan, kehutanan, perikanan) dinaikkan menjadi 100% selama 12 bulan. Sesuai skema insentif PPh Final PP 123/2015, deposito DHE USD/IDR yang ditempatkan lebih dari 6 bulan (termasuk 12 bulan) memperoleh tarif PPh Final 0% (bebas pajak atas bunganya).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 36/2023 (Okt 2023–Feb 2025)',
    newHeader: 'PP Nomor 8 Tahun 2025 (Mulai 1 Maret 2025)',
    rows: [
      {
        aspek: 'Porsi DHE SDA non-migas wajib masuk Reksus DHE',
        aturanLama: 'Minimal 30% dari nilai DHE pada PPE >= USD 250.000',
        aturanBaru: '100% dari nilai DHE SDA non-migas (migas tetap 30%)',
      },
      {
        aspek: 'Jangka waktu retensi wajib',
        aturanLama: 'Minimal 3 bulan (bunga deposito DHE USD kena 7,5%)',
        aturanBaru: '12 bulan (bunga deposito DHE > 6 bulan menikmati PPh Final 0%)',
      },
      {
        aspek: 'Diskonto SPN <= 12 bulan (PP 27/2008)',
        aturanLama: '20% Final (kecuali Bank, Dapen, Reksadana 5 thn)',
        aturanBaru: 'Tetap 20% Final',
      },
    ],
  },
  caseExample: {
    title: 'Realisasi diskonto SPN Rp 100 juta oleh korporasi non-bank',
    scenario:
      'Sebuah perusahaan non-keuangan menerima diskonto SPN sebesar Rp 100.000.000 saat jatuh tempo: PPh Final Pasal 4(2) berdasarkan PP 27/2008 = 20% × Rp 100.000.000 = Rp 20.000.000.',
    presetRegime: 'pph4_2_spn_pp27_2008',
    presetInput: {
      pph4_2: {
        nilaiBruto: 100000000,
        objectType: 'sewa_tanah_bangunan',
        skemaSpnDhe: 'diskonto_spn_20',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph42Pp27_2008SpnDheRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const skema = input.skemaSpnDhe ?? 'diskonto_spn_20';

    const rate =
      skema === 'diskonto_spn_20' ? 20 : skema === 'dhe_nonmigas_pp8_2025_12bln' ? 0 : 7.5;
    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const skemaLabel: Record<NonNullable<TaxCalculatorInput['pph4_2']['skemaSpnDhe']>, string> = {
      diskonto_spn_20: 'Diskonto SPN <= 12 bulan (PP 27/2008 — 20% Final)',
      dhe_nonmigas_pp8_2025_12bln: 'Bunga Deposito DHE SDA Non-Migas Retensi 12 Bulan (PP 8/2025 & PP 123/2015 — 0%)',
      dhe_migas_pp36_2023_3bln: 'Bunga Deposito DHE SDA Migas USD Tenor 3 Bulan (PP 36/2023 & PP 123/2015 — 7,5%)',
    };

    const steps: CalculationStep[] = [
      { label: 'Nilai diskonto SPN atau bunga deposito DHE SDA (Rp)', value: bruto },
      { label: 'Skema penghasilan instrumen negara / devisa', formula: skemaLabel[skema], value: rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) dipotong',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Diskonto / imbal hasil bersih diterima', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: `PPh Final (${formatPersen(rate)})`,
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Hasil Bersih Diterima',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        skema === 'diskonto_spn_20'
          ? 'Berdasarkan PP 27/2008, diskonto SPN (SUN tenor <= 12 bulan) dipotong PPh Final 20% (kecuali diterima oleh bank di Indonesia, Dana Pensiun disahkan Menkeu, atau reksadana 5 tahun pertama).'
          : skema === 'dhe_nonmigas_pp8_2025_12bln'
          ? 'Berdasarkan PP 8/2025 (berlaku 1 Maret 2025), eksportir non-migas wajib menempatkan 100% DHE SDA selama 12 bulan, dan atas bunga deposito tenor > 6 bulan dibebaskan PPh Final (0% per PP 123/2015).'
          : 'Berdasarkan PP 8/2025 jo. PP 36/2023, sektor migas tetap mengacu kewajiban retensi 30% minimal 3 bulan (tarif bunga deposito DHE USD 3 bulan sebesar 7,5% per PP 123/2015).',
      ],
    };
  },
};
