import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph25_pmk215_2018',
  taxType: 'pph25',
  name: 'Pasal 25 UU PPh, KEP-537/2000 & PMK 215/2018',
  shortName: '2018–2024 (Pra-Coretax)',
  legalBasis: 'Pasal 25 UU PPh, KEP-537/PJ./2000 & PMK 215/PMK.03/2018 (WP Tertentu)',
  effectivePeriod: '31 Desember 2018 – 31 Desember 2024',
  isCurrent: false,
  summary:
    'Ketentuan sebelum PMK 81/2024: rumus reguler berdasarkan Pasal 25 UU PPh & KEP-537/PJ./2000, sedangkan WP baru, bank, BUMN/BUMD, emiten, dan OPPT diatur dalam PMK 215/PMK.03/2018.',
  sources: [SRC.PMK_215_2018, SRC.KEP_537_2000_DJP, SRC.UU_36_2008],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph25-pmk215-2018',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Angsuran PPh 25 Pra-Coretax: KEP-537/PJ./2000 & PMK 215/2018 (2018–2024)',
  legalBasis: 'Pasal 25 UU PPh, KEP-537/PJ./2000, & PMK 215/PMK.03/2018',
  effectiveDate: '31 Desember 2018',
  readMinutes: 4,
  summary:
    'Pengaturan angsuran PPh Pasal 25 sebelum dikonsolidasikan ke dalam PMK 81/2024: rumus 1/12 reguler serta penghitungan khusus untuk bank, BUMN, emiten bursa, dan WP OPPT (0,75% omzet).',
  sections: [
    {
      heading: 'Pemisahan aturan WP reguler dan Wajib Pajak tertentu',
      paragraphs: [
        'Sebelum PMK 81 Tahun 2024 berlaku pada 1 Januari 2025, penghitungan angsuran PPh Pasal 25 terpecah antara ketentuan umum Pasal 25 UU PPh jo. KEP-537/PJ./2000 (untuk penyesuaian angsuran bila penghasilan naik/turun drastis) dengan PMK 215/PMK.03/2018 khusus Wajib Pajak Baru, Bank, BUMN/BUMD, Perusahaan Masuk Bursa, serta WP Orang Pribadi Pengusaha Tertentu (OPPT).',
        'Bagi Bank dan BUMN/BUMD, angsuran bulanan dihitung dari laporan keuangan berkala (triwulanan/RKAP) daripada menunggu SPT Tahunan tahun sebelumnya agar cicilan pajak sejalan dengan realisasi kinerja tahun berjalan.',
      ],
    },
    {
      heading: 'Aturan OPPT 0,75% dan pencabutan oleh PMK 81/2024',
      paragraphs: [
        'Untuk pedagang pengecer Orang Pribadi yang memiliki lebih dari satu tempat usaha dan tidak menggunakan skema PPh Final UMKM (status OPPT), PMK 215/2018 menetapkan angsuran PPh 25 sebesar 0,75% dari jumlah peredaran bruto tiap bulan per gerai.',
        'Seluruh norma PMK 215/2018 kini dicabut dan dimodernisasi ke dalam Pasal 226–237 PMK 81/2024 dengan pelaporan terintegrasi di sistem Coretax.',
      ],
    },
  ],
  caseExample: {
    title: 'Cicilan PPh 25 perusahaan dengan PPh terutang Rp 240 juta (kredit pajak Rp 60 juta)',
    scenario:
      'PPh terutang tahun lalu sebesar Rp 240.000.000 dikurangi kredit PPh 22/23 Rp 60.000.000 dibagi 12 bulan menghasilkan angsuran PPh 25 sebesar Rp 15.000.000 per bulan.',
    presetRegime: 'pph25_pmk215_2018',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 240000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
      },
    },
  },
};

export const pph25Pmk215_2018Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
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
      { label: 'PPh terutang SPT Tahunan tahun lalu', value: pphTerutang },
      { label: 'Kredit pajak (PPh 21/22/23/24)', value: -kreditPajak, isNegative: true },
      { label: 'Dasar angsuran tahunan', value: dasarAngsuran },
      {
        label: `Angsuran PPh 25 per bulan (÷ ${pembagi} bulan)`,
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
      takeHomeOrNetLabel: 'Porsi PPh Ditutup Kredit Pajak',
      takeHomeOrNetAmount: Math.min(pphTerutang, kreditPajak),
      steps,
      notes: [
        'Pada PMK 215/2018, WP Orang Pribadi Pengusaha Tertentu (OPPT) dikenai angsuran 0,75% dari peredaran bruto per tempat usaha apabila tidak memakai PPh Final UMKM.',
      ],
    };
  },
};
