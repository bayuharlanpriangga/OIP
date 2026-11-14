import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph25_pmk81_2024',
  taxType: 'pph25',
  name: 'Pasal 25 UU PPh jo. PMK 81 Tahun 2024',
  shortName: '2025–Kini (PMK 81/2024)',
  legalBasis: 'Pasal 25 UU PPh stdd UU HPP, Pasal 94 ayat (2) & Pasal 226–237 PMK 81 Tahun 2024',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  summary:
    'Angsuran PPh bulanan sebesar 1/12 dari selisih PPh terutang tahun lalu dikurangi kredit pajak (PPh 21/22/23/24). PMK 81/2024 tetap mematok jatuh tempo PPh 25 tanggal 15 sekaligus mencabut PMK 215/2018.',
  sources: [SRC.PMK_81_2024, SRC.UU_7_2021_HPP, SRC.KEP_537_2000_DJP],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pmk81-2024',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Penghitungan Angsuran Bulanan PPh Pasal 25 dan Penyelarasan Jatuh Tempo PMK 81/2024',
  legalBasis: 'Pasal 25 UU PPh & Pasal 94 ayat (2), Pasal 226–237 PMK Nomor 81 Tahun 2024',
  effectiveDate: '1 Januari 2025',
  readMinutes: 4,
  summary:
    'PPh Pasal 25 mencicil pajak terutang berdasarkan SPT Tahunan tahun pajak sebelumnya. Di era Coretax (PMK 81/2024), jatuh tempo PPh 25 tetap tanggal 15 sementara PPh 21/22/23/26/4(2)/15 diseragamkan ikut menjadi tanggal 15.',
  sections: [
    {
      heading: 'Rumus dasar angsuran PPh Pasal 25 reguler',
      paragraphs: [
        'Besarnya angsuran pajak yang harus dibayar sendiri setiap bulan dihitung dari Pajak Penghasilan yang terutang menurut SPT Tahunan tahun pajak yang lalu, dikurangi PPh yang telah dipotong/dipungut pihak lain (PPh 21, 22, 23) serta pajak luar negeri yang boleh dikreditkan (PPh 24), lalu dibagi 12 atau banyaknya bulan dalam bagian tahun pajak.',
        'Jika kredit pajak tahun sebelumnya melebihi atau sama dengan PPh terutang, angsuran PPh Pasal 25 menjadi nihil (Rp 0). Penghasilan bersifat final dan penghasilan tidak teratur dikeluarkan dari dasar penghitungan angsuran.',
      ],
    },
    {
      heading: 'Jatuh tempo Pasal 94 dan pencabutan PMK 215/2018 (Pasal 226–237)',
      paragraphs: [
        'Pasal 94 ayat (2) PMK 81 Tahun 2024 menyeragamkan batas penyetoran seluruh PPh masa—baik yang sebelumnya jatuh tempo tanggal 10 (PPh 21, 23, 26, 4(2), 15) maupun yang sejak awal tanggal 15 (PPh 25)—menjadi paling lambat tanggal 15 bulan berikutnya. Penyetoran PPh 25 yang telah divalidasi NTPN diakui sekaligus sebagai penyampaian SPT Masa PPh 25.',
        'Selain itu, PMK 81/2024 secara resmi mencabut PMK 215/PMK.03/2018 dan mengintegrasikan ketentuan angsuran khusus bagi Wajib Pajak Baru, Bank, BUMN/BUMD, Perusahaan Masuk Bursa, WP Lembaga Keuangan Lainnya, serta WP OPPT (0,75% omzet) ke dalam Pasal 226–237 PMK 81/2024.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 242/2014 & PMK 215/2018 (Pra-2025)',
    newHeader: 'PMK 81 Tahun 2024 (Era Coretax)',
    rows: [
      {
        aspek: 'Formula dasar angsuran WP reguler',
        aturanLama: '(PPh Terutang - Kredit Pajak) ÷ 12 (Pasal 25 UU PPh)',
        aturanBaru: '(PPh Terutang - Kredit Pajak) ÷ 12 (tidak berubah)',
      },
      {
        aspek: 'Jatuh tempo setor PPh 25 vs PPh potong/pungut',
        aturanLama: 'PPh 25 tanggal 15; PPh 21/23/26 tanggal 10',
        aturanBaru: 'Seragam tanggal 15 bulan berikutnya (Pasal 94 ayat 2)',
      },
      {
        aspek: 'Angsuran WP Bank, BUMN, Tbk, & OPPT',
        aturanLama: 'Diatur terpisah di PMK 215/PMK.03/2018',
        aturanBaru: 'Diintegrasikan ke Pasal 226–237 PMK 81/2024',
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
  sources: regime.sources,
  verifiedAt: '14 November 2026',
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
      effectiveRateLabel: 'Rasio angsuran thd. PPh terutang',
      takeHomeOrNetLabel: 'Porsi PPh Terutang Sudah Ditutup Kredit Pajak',
      takeHomeOrNetAmount: Math.min(pphTerutang, kreditPajak),
      steps,
      notes: [
        'Penyetoran dilakukan paling lambat tanggal 15 bulan berikutnya setelah masa pajak berakhir.',
        'Untuk bank, BUMN/BUMD, perusahaan masuk bursa, dan WP tertentu, dasar angsuran menggunakan laporan keuangan berkala sesuai Pasal 226–237 PMK 81 Tahun 2024.',
      ],
    };
  },
};
