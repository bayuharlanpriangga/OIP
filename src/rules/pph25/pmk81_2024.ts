import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph25_pmk81_2024',
  taxType: 'pph25',
  name: 'Pasal 25 UU PPh jo. PMK 81 Tahun 2024',
  shortName: '2025–Kini (PMK 81/2024)',
  legalBasis: 'Pasal 25 UU PPh stdd UU HPP & Pasal 94 PMK Nomor 81 Tahun 2024',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  summary:
    'Angsuran PPh bulanan sebesar 1/12 dari selisih PPh terutang tahun lalu dikurangi kredit pajak (PPh 21/22/23/24), dengan jatuh tempo setor seragam tanggal 15 bulan berikutnya di Coretax.',
};

const article: TaxArticle = {
  id: 'pph25-pmk81-2024',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Penghitungan Angsuran Bulanan PPh Pasal 25 dan Penyelarasan Jatuh Tempo PMK 81/2024',
  legalBasis: 'Pasal 25 UU PPh & PMK Nomor 81 Tahun 2024',
  effectiveDate: '1 Januari 2025',
  readMinutes: 4,
  summary:
    'PPh Pasal 25 berfungsi meringankan beban pembayaran pajak tahunan dengan mencicil setiap bulan berdasarkan SPT Tahunan tahun pajak sebelumnya, dengan batas setor tanggal 15 di era Coretax.',
  sections: [
    {
      heading: 'Rumus dasar angsuran PPh Pasal 25 reguler',
      paragraphs: [
        'Besarnya angsuran pajak yang harus dibayar sendiri setiap bulan dihitung dari Pajak Penghasilan yang terutang menurut SPT Tahunan tahun pajak yang lalu, dikurangi PPh yang telah dipotong/dipungut pihak lain (PPh 21, 22, 23) serta pajak luar negeri yang boleh dikreditkan (PPh 24), lalu dibagi 12 atau banyaknya bulan dalam bagian tahun pajak.',
        'Jika kredit pajak tahun sebelumnya melebihi atau sama dengan PPh terutang, angsuran PPh Pasal 25 menjadi nihil (Rp 0). Selain itu, penghasilan bersifat final dan penghasilan tidak teratur dikeluarkan dari dasar penghitungan angsuran.',
      ],
    },
    {
      heading: 'Kewajiban setor & lapor di era Coretax (PMK 81/2024)',
      paragraphs: [
        'Melalui PMK 81 Tahun 2024, batas waktu penyetoran PPh Pasal 25 tetap paling lambat tanggal 15 bulan berikutnya setelah masa pajak berakhir. Wajib Pajak yang telah menyetor PPh Pasal 25 sesuai validasi NTPN dianggap telah menyampaikan SPT Masa PPh Pasal 25.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KEP-537/PJ./2000 & PMK 215/2018',
    newHeader: 'PMK 81 Tahun 2024 (Era Coretax)',
    rows: [
      {
        aspek: 'Formula dasar angsuran',
        aturanLama: '(PPh Terutang - Kredit Pajak) ÷ 12',
        aturanBaru: '(PPh Terutang - Kredit Pajak) ÷ 12',
      },
      {
        aspek: 'Batas penyetoran bulanan',
        aturanLama: 'Tanggal 15 bulan berikutnya',
        aturanBaru: 'Tanggal 15 bulan berikutnya (terintegrasi Coretax)',
      },
      {
        aspek: 'Tarif acuan PPh Badan',
        aturanLama: '25% (pra-2020) / 22%',
        aturanBaru: '22% (UU HPP)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi angsuran PPh 25 PT dengan kredit pajak PPh 22 & 23',
    scenario:
      'PPh Badan terutang SPT Tahunan tahun lalu sebesar Rp 300.000.000 dengan total kredit pajak PPh 22 & 23 sebesar Rp 60.000.000 untuk periode 12 bulan.',
    presetRegime: 'pph25_pmk81_2024',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 300000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
      },
    },
  },
};

export const pph25Pmk81_2024Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphTerutang = Math.max(0, input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);
    const pembagi = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));

    const dasarAngsuran = Math.max(0, pphTerutang - kreditPajak);
    const angsuranBulanan = Math.round(dasarAngsuran / pembagi);
    const totalSetahun = angsuranBulanan * pembagi;
    const effectiveRate = pphTerutang > 0 ? (totalSetahun / pphTerutang) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'PPh terutang menurut SPT Tahunan tahun lalu', value: pphTerutang },
      {
        label: 'Kredit pajak dipotong/dipungut pihak lain (PPh 21/22/23/24)',
        value: -kreditPajak,
        isNegative: true,
      },
      { label: 'Dasar penghitungan angsuran PPh 25 setahun', value: dasarAngsuran },
      {
        label: `Angsuran PPh Pasal 25 per bulan (÷ ${pembagi} bulan)`,
        formula: `${formatRupiah(dasarAngsuran)} ÷ ${pembagi}`,
        value: angsuranBulanan,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh Pasal 25 per Bulan',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: `Total Cicilan PPh 25 (${pembagi} Bulan)`,
      annualTaxAmount: totalSetahun,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Porsi PPh Terutang Sudah Ditutup Kredit Pajak',
      takeHomeOrNetAmount: Math.min(pphTerutang, kreditPajak),
      steps,
      notes: [
        'Penyetoran dilakukan paling lambat tanggal 15 bulan berikutnya setelah masa pajak berakhir.',
        'Untuk bank, BUMN/BUMD, perusahaan masuk bursa, dan WP tertentu, dasar angsuran menggunakan laporan keuangan berkala sesuai PMK 215/PMK.03/2018.',
      ],
    };
  },
};
