import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_40_2010, SRC.PMK_81_2024, SRC.PMK_131_2024];

const regime: TaxRegime = {
  id: 'ppn_pmk40_2010_jln',
  taxType: 'ppn',
  name: 'PPN Jasa & BKP Tidak Berwujud Luar Negeri (PMK 40/2010 -> PMK 81/2024 & PMK 131/2024)',
  shortName: '2010–Kini (PPN Jasa Luar Negeri / Self-Assessed)',
  legalBasis: 'Pasal 4(1)(d)(e) UU PPN jo. PMK 81/2024 (Mencabut PMK 40/PMK.03/2010) & PMK 131/2024',
  effectivePeriod: '1 April 2010 – Sekarang (PPN 11% Efektif Sejak 2022/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Wajib setor sendiri paling lambat tgl 15 bulan berikutnya (11% efektif)',
  summary:
    'Menghitung PPN atas pemanfaatan Jasa Kena Pajak (JKP) maupun Barang Kena Pajak Tidak Berwujud (royalti/lisensi software/hak merek) dari luar Daerah Pabean di dalam Indonesia. Pihak yang memanfaatkan wajib menyetor sendiri PPN (self-assessment SSP/Billing Coretax) paling lambat tanggal 15 bulan berikutnya tanpa memandang apakah berstatus PKP atau Non-PKP.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppn-pmk40-2010-jln',
  taxType: 'ppn',
  taxTypeLabel: 'PPN',
  title: 'PPN Jasa & BKP Tidak Berwujud Luar Negeri (PPN JLN): PMK 40/2010 hingga PMK 81/2024',
  legalBasis: 'Pasal 4 ayat (1) huruf d & e UU PPN, PMK 40/PMK.03/2010, PMK 81/2024, & PMK 131/2024',
  effectiveDate: '1 April 2010 (Pembaruan Coretax & Tarif 1 Jan 2025)',
  readMinutes: 5,
  summary:
    'Kewajiban self-assessment PPN 11% atas pembayaran lisensi software, royalti, jasa konsultansi/cloud non-PMSE luar negeri, dan siapa saja yang berhak mengkreditkannya sebagai Pajak Masukan.',
  sections: [
    {
      heading: 'Mengapa perusahaan Indonesia tetap wajib menyetor PPN atas jasa dari luar negeri?',
      paragraphs: [
        'Sesuai prinsip destinasi UU PPN, jasa atau hak tidak berwujud (paten, hak cipta, perangkat lunak) yang berasal dari luar negeri namun dimanfaatkan di Indonesia tetap terutang PPN Indonesia. Karena penjual di luar negeri bukan PKP Indonesia (di luar pemungut PMSE ritel PMK 60/2022), kewajiban memungut dan menyetor PPN dialihkan ke pihak Indonesia yang memanfaatkannya.',
        'Penyetoran dilakukan paling lambat tanggal 15 bulan berikutnya setelah saat terutang (mana yang lebih dulu antara saat mulai dimanfaatkan, ditagih, atau dibayar) menggunakan SSP / kode billing Coretax atas nama pihak luar negeri dengan NPWP pemanfaat sebagai penyetor.',
      ],
    },
    {
      heading: 'Apakah kontrak gross-up (inclusive) atau murni nilai bersih (exclusive)?',
      paragraphs: [
        'Dalam kontrak B2B internasional, vendor luar negeri sering mensyaratkan jumlah dibayar bersih (di luar PPN Indonesia), sehingga PPN JLN dihitung langsung sebesar 11% efektif (12% × DPP Nilai Lain 11/12 sesuai PMK 131/2024) di atas nilai tagihan.',
        'Namun jika kontrak mencantumkan bahwa harga sudah termasuk PPN Indonesia (inclusive), DPP dihitung sebagai Nilai Kontrak ÷ 1,11 sehingga PPN sebesar 11/111 dari total kontrak. Bagi Pengusaha Kena Pajak (PKP), SSP PPN JLN berstatus sebagai dokumen yang dipersamakan dengan Faktur Pajak dan DAPAT dikreditkan sebagai Pajak Masukan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pemanfaat Non-PKP (OP / Badan Non-PKP)',
    newHeader: 'Pemanfaat Berstatus PKP',
    rows: [
      {
        aspek: 'Kewajiban setor PPN JLN (11% efektif tgl 15)',
        aturanLama: 'Tetap WAJIB menyetor sendiri PPN 11% meski bukan PKP',
        aturanBaru: 'Wajib menyetor sendiri PPN 11% via Billing/SSP Coretax',
      },
      {
        aspek: 'Hak pengkreditan sebagai Pajak Masukan',
        aturanLama: 'Tidak dapat dikreditkan (menjadi beban biaya PPh Badan)',
        aturanBaru: 'DAPAT dikreditkan di SPT Masa PPN (dokumen dipersamakan Faktur Pajak)',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran lisensi perangkat lunak & jasa konsultansi IT luar negeri Rp 200 juta',
    scenario:
      'PT di Jakarta (PKP) membayar tagihan Rp 200.000.000 (bersih di luar PPN) kepada vendor konsultan di Singapura. PT wajib menyetor sendiri PPN JLN sebesar 11% x Rp 200.000.000 = Rp 22.000.000 paling lambat tgl 15 bulan berikutnya, dan dapat mengkreditkannya sebagai Pajak Masukan.',
    presetRegime: 'ppn_pmk40_2010_jln',
    presetInput: {
      ppn: {
        hargaJualDpp: 200000000,
        goodsType: 'umum',
        termasukPpn: false,
        statusPkpJln: 'pkp_dapat_kredit',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnPmk40_2010JlnRule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  article,
  calculate(input) {
    const raw = Math.max(0, input.hargaJualDpp);
    const statusPkp = input.statusPkpJln ?? 'pkp_dapat_kredit';
    const dpp = input.termasukPpn ? Math.round(raw / 1.11) : raw;
    const dppNilaiLain = Math.round((dpp * 11) / 12);
    const ppnJln = input.termasukPpn ? Math.max(0, raw - dpp) : Math.round(dppNilaiLain * 0.12);
    const effRate = dpp > 0 ? (ppnJln / dpp) * 100 : 11;

    const steps: CalculationStep[] = [
      { label: 'Nilai pemanfaatan JKP / BKP Tidak Berwujud dari Luar Negeri (DPP)', value: dpp },
      { label: 'DPP Nilai Lain PMK 131/2024 (11/12 × DPP)', value: dppNilaiLain },
      {
        label: 'PPN JLN wajib disetor sendiri maksimal tgl 15 bulan berikutnya',
        formula: `${formatRupiah(dppNilaiLain)} x 12% (${formatPersen(effRate)} dari DPP)`,
        value: ppnJln,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN JLN Wajib Disetor Sendiri',
      primaryTaxAmount: ppnJln,
      annualTaxLabel:
        statusPkp === 'pkp_dapat_kredit'
          ? 'Nilai Dapat Dikreditkan (Pajak Masukan)'
          : 'Tambahan Biaya (Non-PKP Tidak Dapat Kredit)',
      annualTaxAmount: ppnJln,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Arus Kas Keluar (Tagihan LN + PPN JLN)',
      takeHomeOrNetAmount: dpp + ppnJln,
      steps,
      notes: [
        statusPkp === 'pkp_dapat_kredit'
          ? 'Bagi PKP, NTPN bukti setor PPN JLN merupakan dokumen tertentu yang kedudukannya dipersamakan dengan Faktur Pajak dan dapat dikreditkan sebagai Pajak Masukan (selama terkait kegiatan usaha 3M).'
          : 'Bagi pihak Non-PKP maupun Orang Pribadi, kewajiban setor PPN JLN tetap berlaku penuh, dan nilai PPN yang disetor dibebankan sebagai komponen harga perolehan / biaya.',
        'Jangan lupa membedakan kewajiban PPN JLN (11%) dengan pemotongan PPh Pasal 26 (20% atau tarif P3B) atas pembayaran royalti/jasa kepada penyedia luar negeri.',
      ],
    };
  },
};
