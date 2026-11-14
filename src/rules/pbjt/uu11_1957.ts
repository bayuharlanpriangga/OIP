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

const sources = [SRC.UU_DARURAT_11_1957, SRC.UU_1_1961, SRC.UU_18_1997];

const regime: TaxRegime = {
  id: 'pbjt_uu11_1957',
  taxType: 'pbjt',
  name: 'UU Darurat 11/1957 jo. UU 1/1961 (Peraturan Umum Pajak Daerah Pra-1997)',
  shortName: '1957–1997 (UU Drt 11/1957 & PPb I)',
  legalBasis: 'UU Darurat Nomor 11 Tahun 1957 jo. UU Nomor 1 Tahun 1961 & Pajak Pembangunan I',
  effectivePeriod: '1957 – 22 Mei 1997 (Pra-UU 18/1997)',
  isCurrent: false,
  summary:
    'Landasan hukum pajak daerah selama 40 tahun sebelum UU 18/1997: menggantikan puluhan pajak daerah lama dengan Perda daerah atas Pajak Pembangunan I (PPb I 10% untuk restoran & penginapan), Pajak Tontonan (hiburan), serta Pajak Penerangan Jalan sebelum dikodifikasi seragam pada 1997.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-uu11-1957',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'Sejarah Pajak Daerah Pra-1997: UU Darurat 11/1957, Pajak Pembangunan I (10%), & Pajak Tontonan',
  legalBasis: 'UU Darurat Nomor 11 Tahun 1957 jo. UU Nomor 1 Tahun 1961',
  effectiveDate: '27 Mei 1957 (Dicabut UU 18/1997 per 23 Mei 1997)',
  readMinutes: 4,
  summary:
    'Menelusuri cikal bakal Pajak Hotel, Restoran, dan Hiburan jauh sebelum istilah PBJT lahir: bagaimana Pajak Pembangunan I (PPb I) 10% dan Pajak Tontonan dipungut berdasarkan UU Darurat 11/1957 selama empat dekade.',
  sections: [
    {
      heading: 'Dari UU Darurat 11/1957 dan PPb I (10%) menuju UU 18/1997',
      paragraphs: [
        'Sejak tahun 1957 hingga terbitnya UU Nomor 18 Tahun 1997, sistem pajak daerah Indonesia mengacu pada UU Darurat Nomor 11 Tahun 1957 tentang Peraturan Umum Pajak Daerah (yang ditetapkan menjadi UU Nomor 1 Tahun 1961). Pada era tersebut, daerah tingkat II (kabupaten/kotapraja) memiliki daftar jenis pajak yang sangat beragam seperti Pajak Tontonan, Pajak Radio, Pajak Pembangunan I (PPb I), Pajak Penerangan Jalan, Pajak Reklame, dan retribusi/pungutan lokal lainnya.',
        'Khusus atas transaksi makanan di rumah makan/restoran dan menginap di hotel/losmen, dipungut Pajak Pembangunan I (PPb I) dengan tarif umum 10% dari pembayaran konsumen (yang secara historis berakar dari UU Nomor 10 Tahun 1947 tentang Pajak Pembangunan I dan diserahkan pengelolaannya kepada daerah). Sementara pertunjukan bioskop dan tontonan dipungut Pajak Tontonan menurut Perda masing-masing daerah.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU Drt 11/1957 jo. UU 1/1961 (1957–1997)',
    newHeader: 'UU 18/1997 -> UU HKPD 1/2022',
    rows: [
      {
        aspek: 'Pajak restoran & hotel',
        aturanLama: 'Pajak Pembangunan I (PPb I) umumnya 10%',
        aturanBaru: 'Pajak Hotel & Restoran (1997) -> kini PBJT maks 10% (HKPD)',
      },
      {
        aspek: 'Pajak bioskop & hiburan',
        aturanLama: 'Pajak Tontonan per Perda (bervariasi, kisaran 10%–35%)',
        aturanBaru: 'Pajak Hiburan (1997) -> PBJT Hiburan 10% umum / 40–75% khusus',
      },
      {
        aspek: 'Pajak parkir',
        aturanLama: 'Belum ada sebagai pajak (dikelola sebagai retribusi parkir daerah)',
        aturanBaru: 'Pajak Parkir (UU 34/2000) -> PBJT Jasa Parkir maks 10%',
      },
    ],
  },
  caseExample: {
    title: 'Tagihan rumah makan / losmen Rp 300.000 dengan Pajak Pembangunan I (10%) era 1980-an',
    scenario:
      'Konsumen membayar jasa rumah makan sebesar Rp 300.000 pada masa berlakunya UU Darurat 11/1957; dipungut Pajak Pembangunan I (PPb I) sebesar 10% = Rp 30.000.',
    presetRegime: 'pbjt_uu11_1957',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 300000,
        sectorType: 'makanan_minuman',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

function getUu11_1957Meta(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
    case 'perhotelan':
      return { rate: 10, label: 'Pajak Pembangunan I (PPb I) atas rumah makan / hotel (umumnya 10%)' };
    case 'parkir':
      return {
        rate: 0,
        label: 'Belum menjadi Pajak Daerah di era UU Drt 11/1957 (dipungut sebagai Retribusi Parkir)',
      };
    case 'hiburan_umum':
    case 'hiburan_khusus':
      return { rate: 25, label: 'Pajak Tontonan / Pertunjukan per Perda Dati II (simulasi tarif rata-rata 25%)' };
    case 'tenaga_listrik':
      return { rate: 10, label: 'Pajak Penerangan Jalan (PPJ) menurut Perda era UU Drt 11/1957 (~10%)' };
  }
}

export const pbjtUu11_1957Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getUu11_1957Meta(input.sectorType);
    const pajak = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi pembayaran (era UU Drt 11/1957)', value: nilaiTransaksi },
      { label: 'Tarif pajak daerah historis', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak daerah terutang',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pajak,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Daerah Era Pra-1997 (PPb I / Pajak Tontonan)',
      primaryTaxAmount: pajak,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pajak,
      steps,
      notes: [
        'Pada masa berlakunya UU Darurat 11/1957 jo. UU 1/1961 (sebelum UU 18/1997), pajak daerah belum diseragamkan batas atasnya dalam satu UU khusus melainkan diatur melalui Perda Daerah Tingkat II dengan persetujuan Menteri Dalam Negeri.',
      ],
    };
  },
};
