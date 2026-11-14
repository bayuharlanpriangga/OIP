import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_112_2025, SRC.PER_25_PJ_2018_DJP, SRC.PER_61_PJ_2009];

const regime: TaxRegime = {
  id: 'pph26_per61_2009_skd',
  taxType: 'pph26',
  name: 'PER-61/PJ/2009 jo. PER-25/PJ/2018 & PMK 112/2025 (Penerapan SKD P3B)',
  shortName: '2010–Kini (SKD & Anti-Treaty Abuse)',
  legalBasis: 'PER-61/PJ/2009 stdd PER-25/PJ/2018 & PMK Nomor 112 Tahun 2025',
  effectivePeriod: '1 Januari 2010 – Sekarang (Pembaruan Coretax PMK 112/2025)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Syarat Form DGT & Beneficial Owner P3B',
  summary:
    'Tata cara administratif penggunaan tarif preferensial Perjanjian Penghindaran Pajak Berganda (P3B / Tax Treaty): tanpa Form DGT yang sah dari otoritas pajak negara mitra dan uji Principal Purpose Test (PPT) / Beneficial Owner, tarif otomatis gugur kembali ke PPh 26 sebesar 20%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-per61-2009-skd',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Evolusi Syarat Penerapan Tax Treaty (P3B): PER-61/PJ/2009, PER-25/PJ/2018, ke PMK 112/2025',
  legalBasis: 'PER-61/PJ/2009, PER-25/PJ/2018, & PMK Nomor 112 Tahun 2025',
  effectiveDate: '1 Januari 2010 (Konsolidasi PMK 112/2025 per Coretax)',
  readMinutes: 5,
  summary:
    'Membandingkan penerapan Surat Keterangan Domisili (Form DGT-1/DGT-2 pada PER-61/2009, penyederhanaan satu Form DGT di PER-25/2018, hingga kodifikasi ke level Peraturan Menteri Keuangan melalui PMK 112/2025).',
  sections: [
    {
      heading: 'Mengapa memiliki SKD saja tidak selalu cukup (Uji Anti-Treaty Shopping)',
      paragraphs: [
        'Sejak PER-61/PJ/2009 (berlaku 1 Januari 2010) hingga PER-25/PJ/2018, DJP mensyaratkan Wajib Pajak Luar Negeri (WPLN) menyerahkan Form DGT yang disahkan pejabat berwenang negara mitra sekaligus mengisi pernyataan tidak terjadinya penyalahgunaan P3B serta status Beneficial Owner untuk dividen, bunga, dan royalti.',
        'Pada PMK Nomor 112 Tahun 2025, syarat tersebut dinaikkan ke tingkat PMK dan terintegrasi langsung dengan pelaporan tanda terima SKD elektronik serta Principal Purpose Test (PPT) MLI OECD: bila salah satu syarat formal atau substansi ekonomis tidak terpenuhi, pemotong wajib menerapkan tarif domestik PPh Pasal 26 sebesar 20%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PER-61/PJ/2009 & PER-25/PJ/2018',
    newHeader: 'PMK Nomor 112 Tahun 2025',
    rows: [
      {
        aspek: 'Strata hukum regulasi tata cara P3B',
        aturanLama: 'Peraturan Direktur Jenderal Pajak (PER-61/2009 lalu PER-25/2018)',
        aturanBaru: 'Peraturan Menteri Keuangan (PMK 112/2025) berbasis Coretax',
      },
      {
        aspek: 'Dampak kegagalan uji Beneficial Owner / PPT',
        aturanLama: 'Manfaat tarif P3B ditolak (kembali ke tarif 20% PPh 26)',
        aturanBaru: 'Tarif domestik 20% berlaku penuh beserta konsekuensi sanksi jika kurang potong',
      },
    ],
  },
  caseExample: {
    title: 'Pembayaran royalti lisensi perangkat lunak Rp 500 juta ke Singapura dengan P3B 8%',
    scenario:
      'PT di Indonesia membayar royalti Rp 500.000.000 kepada perusahaan di Singapura yang menyerahkan tanda terima Form DGT sah dan memenuhi uji Beneficial Owner (tarif P3B 8%–10%), sehingga terutang PPh 26 sebesar Rp 40.000.000 (menghemat Rp 60 juta vs tarif normal 20%).',
    presetRegime: 'pph26_per61_2009_skd',
    presetInput: {
      pph26: {
        nilaiBruto: 500000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: true,
        tarifP3bPersen: 8,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Per61_2009SkdRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const hasValidSkd = input.hasSkdP3b;
    const p3bRate = Math.min(20, Math.max(0, input.tarifP3bPersen));
    const effectiveRate = hasValidSkd ? p3bRate : 20;
    const tax = Math.round((bruto * effectiveRate) / 100);
    const normalTax = Math.round(bruto * 0.2);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayar ke WPLN', value: bruto },
      {
        label: hasValidSkd
          ? 'Tarif preferensial P3B sesuai tanda terima Form DGT sah'
          : 'Tanpa Form DGT sah / Gagal uji anti-abuse -> Tarif domestik PPh 26',
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 26 Final dipotong pemotong pajak Indonesia',
        formula: `${formatRupiah(bruto)} x ${formatPersen(effectiveRate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Transfer bersih dikirim ke penerima di luar negeri', value: Math.max(0, bruto - tax) },
    ];

    return {
      regime,
      primaryTaxLabel: hasValidSkd ? 'PPh 26 Tarif P3B (Dengan Form DGT Sah)' : 'PPh 26 Tarif Umum 20% (Tanpa SKD)',
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Dana Bersih Dikirim ke Luar Negeri',
      takeHomeOrNetAmount: Math.max(0, bruto - tax),
      steps,
      notes: [
        hasValidSkd
          ? `Manfaat P3B menurunkan potongan sebesar ${formatRupiah(Math.max(0, normalTax - tax))} dibanding tarif umum 20%, dengan syarat nomor tanda terima SKD elektronik/Form DGT dilaporkan di SPT Masa Unifikasi.`
          : 'Peringatan: Tanpa Form DGT yang valid sebelum jatuh tempo penyetoran SPT Masa, fasilitas tarif P3B tidak dapat dipakai dan wajib memotong 20% penuh.',
      ],
    };
  },
};
