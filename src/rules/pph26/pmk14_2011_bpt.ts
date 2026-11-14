import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_14_2011, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph26_pmk14_2011_bpt',
  taxType: 'pph26',
  name: 'PMK 14/PMK.03/2011 (Branch Profit Tax / Pasal 26 ayat 4 BUT)',
  shortName: '2011–Kini (Branch Profit Tax BUT 20%)',
  legalBasis: 'Pasal 26 ayat (4) UU PPh & PMK Nomor 14/PMK.03/2011',
  effectivePeriod: '24 Januari 2011 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Laba bersih sesudah pajak BUT (BPT 20% / P3B)',
  summary:
    'Pajak atas Penghasilan Kena Pajak sesudah dikurangi pajak dari suatu Bentuk Usaha Tetap (BUT) di Indonesia — dikenal sebagai Branch Profit Tax (BPT): dikenakan PPh Pasal 26 ayat (4) sebesar 20% (atau tarif BPT khusus dalam P3B), tetapi dikecualikan 0% seluruhnya bila seluruh laba sesudah pajak ditanamkan kembali di Indonesia sesuai syarat PMK 14/PMK.03/2011.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pmk14-2011-bpt',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Branch Profit Tax (Pasal 26 ayat 4) dan Pengecualian Reinvestasi BUT: PMK 14/2011',
  legalBasis: 'Pasal 26 ayat (4) UU PPh jo. PMK Nomor 14/PMK.03/2011',
  effectiveDate: '24 Januari 2011',
  readMinutes: 5,
  summary:
    'Mengulas pajak tambahan 20% (atau tarif P3B) atas laba neto setelah PPh Badan bagi cabang perusahaan asing (BUT) di Indonesia dan syarat bebas pajak 0% jika laba tersebut direinvestasikan di dalam negeri.',
  sections: [
    {
      heading: 'Cara kerja Branch Profit Tax dan syarat pembebasan PMK 14/2011',
      paragraphs: [
        'Bentuk Usaha Tetap (BUT) yang beroperasi di Indonesia wajib membayar PPh Badan layaknya perseroan dalam negeri (tarif 22%), lalu atas sisa Penghasilan Kena Pajak sesudah dikurangi PPh Badan tersebut (baik dikirimkan ke kantor pusat maupun tidak) langsung dikenakan PPh Pasal 26 ayat (4) sebesar 20% atau tarif BPT dalam P3B (umumnya 10%–15%).',
        'Berdasarkan PMK 14/PMK.03/2011, BUT dibebaskan dari Branch Profit Tax (0%) apabila SELURUH penghasilan kena pajak sesudah pajak ditanamkan kembali di Indonesia dalam bentuk penyertaan modal pada perusahaan baru di Indonesia, pembelian aktiva tetap, atau investasi aset tidak berwujud untuk usaha BUT tersebut, paling lambat tahun pajak berikutnya dan tidak dialihkan sekurang-kurangnya selama 2 tahun sejak berproduksi komersial.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'BUT Tidak Menanamkan Kembali Laba',
    newHeader: 'BUT Reinvestasi Laba 100% (PMK 14/2011)',
    rows: [
      {
        aspek: 'Tarif Branch Profit Tax Pasal 26 ayat (4)',
        aturanLama: '20% (atau tarif preferensial P3B jika ada SKD)',
        aturanBaru: '0% (Dikecualikan dari PPh Pasal 26 ayat 4)',
      },
      {
        aspek: 'Syarat waktu & masa tahan investasi',
        aturanLama: 'Terutang bersamaan dengan SPT Tahunan Badan BUT',
        aturanBaru: 'Investasi maks. akhir tahun berikut & tidak dialihkan minimal 2–3 tahun',
      },
    ],
  },
  caseExample: {
    title: 'Laba sesudah PPh Badan BUT sebesar Rp 2 miliar (kena BPT 20% vs reinvestasi 0%)',
    scenario:
      'Sebuah BUT perusahaan jasa konstruksi asing membukukan PKP sesudah dikurangi PPh Badan sebesar Rp 2.000.000.000 tanpa P3B dan tidak direinvestasikan: BPT Pasal 26 ayat (4) terutang 20% = Rp 400.000.000.',
    presetRegime: 'pph26_pmk14_2011_bpt',
    presetInput: {
      pph26: {
        nilaiBruto: 2000000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
        isBptReinvested: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pmk14_2011BptRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const labaSetelahPph = Math.max(0, input.nilaiBruto);
    const reinvested = Boolean(input.isBptReinvested);
    const rate = reinvested ? 0 : input.hasSkdP3b ? Math.min(20, Math.max(0, input.tarifP3bPersen)) : 20;
    const tax = Math.round((labaSetelahPph * rate) / 100);
    const netRemitted = Math.max(0, labaSetelahPph - tax);

    const steps: CalculationStep[] = [
      { label: 'PKP sesudah dikurangi PPh Badan dari BUT', value: labaSetelahPph },
      {
        label: reinvested
          ? 'Fasilitas pengecualian reinvestasi di Indonesia (PMK 14/2011)'
          : input.hasSkdP3b
            ? 'Tarif Branch Profit Tax dalam P3B (dengan SKD sah)'
            : 'Tarif domestik Branch Profit Tax Pasal 26 ayat (4)',
        value: rate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 26 ayat (4) / Branch Profit Tax terutang',
        formula: `${formatRupiah(labaSetelahPph)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Laba bersih BUT siap diremitansi / ditahan', value: netRemitted },
    ];

    return {
      regime,
      primaryTaxLabel: 'Branch Profit Tax (Pasal 26 ayat 4) BUT',
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Sisa Laba Bersih BUT',
      takeHomeOrNetAmount: netRemitted,
      steps,
      notes: [
        reinvested
          ? 'Karena 100% laba sesudah pajak direinvestasikan di Indonesia sesuai PMK 14/PMK.03/2011 (penyertaan modal atau aktiva tetap), BPT dibebaskan menjadi Rp 0 — syaratnya wajib menyampaikan pemberitahuan tertulis saat SPT Tahunan.'
          : 'Berdasarkan Pasal 26 ayat (4) UU PPh, BPT tetap terutang meskipun laba bersih sesudah pajak belum ditransfer secara tunai ke kantor pusat di luar negeri.',
      ],
    };
  },
};
