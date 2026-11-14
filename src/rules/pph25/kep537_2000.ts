import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KEP_537_2000_DJP, SRC.PMK_255_2008, SRC.PMK_215_2018];

const regime: TaxRegime = {
  id: 'pph25_kep537_2000',
  taxType: 'pph25',
  name: 'KEP-537/PJ./2000 & PMK 255/2008 (Angsuran Hal-Hal Tertentu 2001–2018)',
  shortName: '2001–2018 (KEP-537/PJ Hal Tertentu)',
  legalBasis: 'Pasal 25 ayat (6) UU PPh jo. KEP-537/PJ./2000 & PMK 255/PMK.03/2008',
  effectivePeriod: '1 Januari 2001 – 30 Desember 2018',
  isCurrent: false,
  summary:
    'Aturan penghitungan angsuran PPh Pasal 25 untuk kondisi khusus selama periode 2001–2018 sebelum digantikan PMK 215/2018: mencakup kompensasi kerugian fiskal, Wajib Pajak baru/bank/BUMN, serta permohonan pengurangan angsuran bila estimasi PPh tahun berjalan turun >= 25%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-kep537-2000',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'KEP-537/PJ./2000 & PMK 255/2008: Penghitungan PPh Pasal 25 dalam Hal-Hal Tertentu (2001–2018)',
  legalBasis: 'KEP-537/PJ./2000 jo. PMK 255/PMK.03/2008 & Pasal 25 UU PPh',
  effectiveDate: '1 Januari 2001 – 30 Desember 2018',
  readMinutes: 5,
  summary:
    'Menjembatani masa 18 tahun aturan PPh Pasal 25 sebelum PMK 215/2018, termasuk hak pengurangan angsuran apabila omzet/laba merosot sehingga proyeksi PPh setahun akan kurang dari 75% dasar tahun lalu.',
  sections: [
    {
      heading: 'Kapan dasar 1/12 dari SPT Tahun Lalu dapat diubah di tengah tahun?',
      paragraphs: [
        'Secara umum, PPh Pasal 25 dihitung sebesar 1/12 dari (PPh Terutang SPT Tahunan lalu − Kredit Pajak PPh 21/22/23/24). Namun KEP-537/PJ./2000 memberikan enam skenario penyesuaian penting bagi Wajib Pajak, antara lain akibat berhak atas kompensasi kerugian fiskal, menerima penghasilan tidak teratur, keterlambatan penyampaian SPT, maupun perubahan keadaan usaha.',
        'Berdasarkan Pasal 7 KEP-537/PJ./2000, apabila setelah 3 bulan atau lebih berjalannya suatu tahun pajak Wajib Pajak dapat menunjukkan bahwa PPh yang akan terutang untuk tahun pajak tersebut kurang dari 75% (turun minimal 25%) dari PPh yang menjadi dasar penghitungan PPh 25, Wajib Pajak berhak mengajukan permohonan pengurangan besarnya angsuran PPh Pasal 25 kepada Kepala KPP.',
      ],
    },
    {
      heading: 'PMK 255/2008 untuk Wajib Pajak Baru, Bank, dan BUMN/BUMD',
      paragraphs: [
        'Melengkapi KEP-537/PJ./2000, sejak 1 Januari 2009 diterbitkan PMK 255/PMK.03/2008 yang mengatur dasar angsuran berdasarkan laporan keuangan berkala (bulanan/triwulanan) bagi Wajib Pajak Baru, Bank, Sewa Guna Usaha dengan Hak Opsi, serta BUMN/BUMD, sebelum seluruh ketentuan WP Tertentu tersebut disatukan kembali di dalam PMK 215/PMK.03/2018.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KEP-537/PJ./2000 & PMK 255/2008 (2001–2018)',
    newHeader: 'PMK 215/2018 & PMK 81/2024 (2019–Kini)',
    rows: [
      {
        aspek: 'Syarat pengurangan angsuran akibat penurunan usaha',
        aturanLama: 'Proyeksi PPh terutang < 75% (turun >= 25%) setelah 3 bulan berjalan',
        aturanBaru: 'Mekanisme pengajuan berlanjut (mengacu KEP-537 sepanjang tidak dicabut)',
      },
      {
        aspek: 'Laporan dasar bank/BUMN/perusahaan terbuka',
        aturanLama: 'Laporan triwulanan (PMK 255/2008)',
        aturanBaru: 'Penyelarasan basis laporan berkala di PMK 215/2018 & Coretax PMK 81/2024',
      },
    ],
  },
  caseExample: {
    title: 'Pengajuan pengurangan PPh 25 setelah 3 bulan karena proyeksi PPh turun > 25%',
    scenario:
      'PPh terutang tahun lalu Rp 600 jt dan kredit pajak Rp 120 jt (angsuran normal Rp 40 jt/bln). Setelah kuartal I, proyeksi PPh neto baru hanya Rp 240 jt (< 75% dari Rp 480 jt). Angsuran baru = Rp 240 jt / 12 = Rp 20 jt/bln.',
    presetRegime: 'pph25_kep537_2000',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 600000000,
        kreditPajakTahunLalu: 120000000,
        bulanBerjalan: 12,
        isKondisiTurun25: true,
        estimasiPphSetahunBaru: 240000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Kep537_2000Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphLalu = Math.max(0, input.pphTerutangTahunLalu);
    const kreditLalu = Math.min(pphLalu, Math.max(0, input.kreditPajakTahunLalu));
    const dasarNormal = Math.max(0, pphLalu - kreditLalu);
    const angsuranNormal = Math.round(dasarNormal / 12);

    const isPenurunan = Boolean(input.isKondisiTurun25);
    const estimasiBaru = Math.max(0, input.estimasiPphSetahunBaru ?? 0);
    const memenuhiSyarat75 = dasarNormal > 0 && estimasiBaru < dasarNormal * 0.75;
    const angsuranEfektif =
      isPenurunan && memenuhiSyarat75 ? Math.round(estimasiBaru / 12) : angsuranNormal;
    const proyeksiSetahun = angsuranEfektif * Math.min(12, Math.max(1, input.bulanBerjalan));

    const steps: CalculationStep[] = [
      { label: 'Dasar PPh dibayar sendiri tahun lalu (PPh Terutang - Kredit)', value: dasarNormal },
      { label: 'Angsuran normal PPh 25 (1/12)', formula: `${formatRupiah(dasarNormal)} / 12`, value: angsuranNormal },
      ...(isPenurunan
        ? [
            { label: 'Batas maksimal 75% untuk permohonan pengurangan (KEP-537)', value: Math.round(dasarNormal * 0.75) },
            { label: 'Estimasi PPh dibayar sendiri tahun berjalan', value: estimasiBaru },
          ]
        : []),
      {
        label: 'Angsuran bulanan PPh Pasal 25 berlaku',
        formula: isPenurunan && memenuhiSyarat75
          ? `Disetujui pengurangan (< 75% dasar lalu): ${formatRupiah(estimasiBaru)} / 12`
          : 'Tarif standar 1/12 dasar tahun lalu',
        value: angsuranEfektif,
        isHighlight: true,
      },
      { label: `Akumulasi setor (${input.bulanBerjalan} bulan)`, value: proyeksiSetahun },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh Pasal 25 / Bulan',
      primaryTaxAmount: angsuranEfektif,
      annualTaxLabel: `Akumulasi ${input.bulanBerjalan} Bulan`,
      annualTaxAmount: proyeksiSetahun,
      effectiveRatePercent: dasarNormal > 0 ? (angsuranEfektif / (dasarNormal / 12)) * 100 : 0,
      effectiveRateLabel: 'Rasio terhadap angsuran normal',
      takeHomeOrNetLabel: `Akumulasi Setoran (${input.bulanBerjalan} Bln)`,
      takeHomeOrNetAmount: proyeksiSetahun,
      steps,
      notes: [
        isPenurunan && !memenuhiSyarat75 && dasarNormal > 0
          ? `Estimasi PPh berjalan (${formatRupiah(estimasiBaru)}) belum kurang dari 75% dasar tahun lalu (${formatRupiah(Math.round(dasarNormal * 0.75))}), sehingga pengurangan KEP-537/PJ./2000 belum terpenuhi.`
          : isPenurunan && memenuhiSyarat75
          ? `Sesuai Pasal 7 KEP-537/PJ./2000, karena proyeksi PPh turun >= 25%, WP berhak mengajukan pengurangan angsuran menjadi ${formatRupiah(angsuranEfektif)}/bulan.`
          : 'KEP-537/PJ./2000 & PMK 255/2008 menjadi rujukan utama penghitungan angsuran PPh 25 periode 2001–2018 sebelum diterbitkannya PMK 215/2018.',
      ],
    };
  },
};
