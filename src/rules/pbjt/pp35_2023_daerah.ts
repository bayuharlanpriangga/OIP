import {
  CalculationStep,
  PbjtSectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_35_2023, SRC.UU_1_2022_HKPD, SRC.UU_28_2009_PDRD];

const regime: TaxRegime = {
  id: 'pbjt_pp35_2023_daerah',
  taxType: 'pbjt',
  name: 'PP 35/2023 (Ketentuan Umum & Tata Cara Pemungutan PBJT Daerah)',
  shortName: '2023–Kini (PP 35/2023 Pelaksana PBJT)',
  legalBasis: 'PP Nomor 35 Tahun 2023 Pasal 18–24 & Pasal 53–58 UU 1/2022 (HKPD)',
  effectivePeriod: '16 Juni 2023 – Sekarang (Perda HKPD Efektif 5 Jan 2024)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Aturan pelaksana objek, DPP, & saat terutang PBJT',
  summary:
    'Peraturan Pemerintah pelaksana UU HKPD yang merinci objek, pengecualian (warung kecil sesuai batas Perda, hotel non-komersial, parkir bebas), saat terutang saat pembayaran/penyerahan, serta pembagian tarif khusus PBJT Tenaga Listrik (10% umum, maks 3% industri, maks 1,5% dihasilkan sendiri) dan hiburan malam 40%–75%.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-pp35-2023-daerah',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'PP 35 Tahun 2023 Pelaksana PBJT: Pengecualian Objek, Listrik 1,5%–3%, dan Saat Terutang',
  legalBasis: 'PP Nomor 35 Tahun 2023 jo. UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '16 Juni 2023',
  readMinutes: 5,
  summary:
    'Mengurai aturan operasional PP 35/2023 tentang siapa yang wajib memungut PBJT, batas pengecualian usaha kecil, serta penerapan DPP dan tarif sektor konsumsi daerah.',
  sections: [
    {
      heading: 'Kejelasan objek, pengecualian, dan saat terutang PBJT',
      paragraphs: [
        'UU HKPD menetapkan kerangka besar PBJT, sedangkan PP Nomor 35 Tahun 2023 mengatur secara teknis apa yang termasuk dan dikecualikan dari objek PBJT pada 5 kelompok barang dan jasa tertentu: Makanan dan/atau Minuman, Tenaga Listrik, Jasa Perhotelan, Jasa Parkir, serta Jasa Kesenian dan Hiburan.',
        'Contohnya, PP 35/2023 mengecualikan jasa katering/penjualan makanan dengan peredaran usaha di bawah ambang tertentu sesuai Perda, penyediaan akomodasi rumah kos dengan jumlah kamar tertentu/kontrakan keluarga, serta parkir oleh penyelenggara yang semata-mata bukan untuk umum. Saat terutangnya ditetapkan sejak pembayaran oleh konsumen atau penyerahan barang/jasa dilakukan.',
      ],
    },
    {
      heading: 'Pembedaan tarif PBJT Tenaga Listrik dan mekanisme Perda Seragam',
      paragraphs: [
        'PP 35/2023 dan Pasal 58 UU HKPD mewajibkan Pemda menuangkan seluruh 5 sektor PBJT ke dalam satu Perda Pajak Daerah dan Retribusi Daerah (paling lambat berlaku 5 Januari 2024). Selain plafon umum 10%, tarif khusus diberikan untuk Tenaga Listrik guna menjaga daya saing industri: paling tinggi 3% untuk sumber lain yang digunakan industri, pertambangan minyak bumi dan gas alam, serta paling tinggi 1,5% untuk listrik yang dihasilkan sendiri (captive power).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Perda Terpisah Era UU PDRD 2009',
    newHeader: 'Satu Perda Terintegrasi PP 35/2023 & UU HKPD',
    rows: [
      {
        aspek: 'Instrumen hukum daerah',
        aturanLama: '5 Perda terpisah (Hotel, Restoran, Hiburan, Parkir, PPJ)',
        aturanBaru: 'Dikonsolidasi dalam 1 Perda PDRD (berlaku serentak Jan 2024)',
      },
      {
        aspek: 'PBJT Tenaga Listrik industri vs dihasilkan sendiri',
        aturanLama: 'PPJ industri maks 3%, dihasilkan sendiri maks 1,5%',
        aturanBaru: 'Ditegaskan maks 3% (industri/migas) & maks 1,5% (dihasilkan sendiri)',
      },
      {
        aspek: 'Dasar Pengenaan Pajak (DPP)',
        aturanLama: 'Jumlah pembayaran atau yang seharusnya dibayar',
        aturanBaru: 'Jumlah yang dibayarkan konsumen termasuk service charge (non-PPN)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi PBJT Jasa Perhotelan Rp 2.500.000 di bawah ketentuan PP 35/2023',
    scenario:
      'Tamu hotel membayar tarif kamar dan fasilitas hotel sebesar Rp 2.500.000 (sebelum pajak daerah). Pemungut PBJT menerapkan tarif Perda 10% sehingga total tagihan menjadi Rp 2.750.000.',
    presetRegime: 'pbjt_pp35_2023_daerah',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 2500000,
        sectorType: 'perhotelan',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

function getPp35PbjtRate(
  sector: PbjtSectorType,
  listrikSkema?: 'umum_10' | 'industri_migas_3' | 'sendiri_1_5'
): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
      return { rate: 10, label: 'PBJT Makanan & Minuman (PP 35/2023 jo. Pasal 58 UU HKPD — maks 10%)' };
    case 'perhotelan':
      return { rate: 10, label: 'PBJT Jasa Perhotelan (PP 35/2023 — maks 10%)' };
    case 'parkir':
      return { rate: 10, label: 'PBJT Jasa Parkir (PP 35/2023 — maks 10%)' };
    case 'hiburan_umum':
      return { rate: 10, label: 'PBJT Jasa Kesenian & Hiburan Umum (PP 35/2023 — maks 10%)' };
    case 'hiburan_khusus':
      return {
        rate: 40,
        label: 'PBJT Hiburan Khusus: diskotek, karaoke, kelab, bar, spa (40%–75% — PP 35/2023)',
      };
    case 'tenaga_listrik':
      if (listrikSkema === 'industri_migas_3') {
        return {
          rate: 3,
          label: 'PBJT Tenaga Listrik industri, pertambangan, & migas (batas maks 3% — PP 35/2023)',
        };
      }
      if (listrikSkema === 'sendiri_1_5') {
        return {
          rate: 1.5,
          label: 'PBJT Tenaga Listrik dihasilkan sendiri / captive power (batas maks 1,5% — PP 35/2023)',
        };
      }
      return {
        rate: 10,
        label: 'PBJT Tenaga Listrik konsumsi umum (maks 10%; industri 3%; dihasilkan sendiri 1,5%)',
      };
  }
}

export const pbjtPp35_2023DaerahRule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getPp35PbjtRate(input.sectorType, input.listrikSkema);
    const pbjt = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'DPP PBJT (jumlah dibayarkan konsumen — PP 35/2023)', value: nilaiTransaksi },
      { label: 'Tarif PBJT sektor terkait', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PBJT wajib dipungut dan disetor ke kas daerah',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pbjt,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBJT Terutang (PP 35/2023)',
      primaryTaxAmount: pbjt,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Tagihan Termasuk PBJT',
      takeHomeOrNetAmount: nilaiTransaksi + pbjt,
      steps,
      notes: [
        'PP 35/2023 juga mengatur kewenangan Kepala Daerah memberikan insentif fiskal pengurangan PBJT untuk sektor usaha kecil/UMKM atau mendukung investasi daerah.',
        'Atas pemakaian listrik oleh industri/pertambangan batas tarif maksimal 3%, dan listrik yang dihasilkan sendiri (genset/PLTS captive) maksimal 1,5%.',
      ],
    };
  },
};
