import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bea_masuk_pra1996',
  taxType: 'bea_masuk',
  name: 'Era Kolonial & Pra-UU Kepabeanan (Indische Tariefwet 1873, Rechten Ordonnantie 1882 & PP 6/1969)',
  shortName: '1873–Mar 1996 (Ordonansi & PP 6/1969)',
  legalBasis:
    'Indische Tariefwet 1873 (Stb. 1873 No. 35), Rechten Ordonnantie 1882 (Stb. 1882 No. 240), Tarief Ordonnantie 1910 (Stb. 1910 No. 628) & PP Nomor 6 Tahun 1969 stdd PP 35/1977 & PP 26/1988',
  effectivePeriod: '1873 – 31 Maret 1996 (Dicabut Pasal 117 UU 10/1995)',
  isCurrent: false,
  summary:
    'Arsip hukum pabean Hindia Belanda (diberlakukan lewat Aturan Peralihan UUD 1945) beserta penataan tarif nasional PP 6/1969 berbasis penetapan pejabat (official assessment) dan daftar patokan harga impor hingga 31 Maret 1996.',
  sources: [SRC.PP_6_1969, SRC.PP_26_1988, SRC.UU_10_1995],
  verifiedAt: '15 November 2026',
};

const article: TaxArticle = {
  id: 'bea-masuk-ordonansi-pra1996',
  taxType: 'bea_masuk',
  taxTypeLabel: 'Bea Masuk',
  title: 'Sejarah Bea Masuk Pra-1996: Indische Tariefwet 1873, Rechten Ordonnantie 1882 & PP 6/1969',
  legalBasis:
    'Stb. 1873 No. 35, Stb. 1882 No. 240, Stb. 1910 No. 628, & PP Nomor 6 Tahun 1969 stdd PP 35/1977 & PP 26/1988',
  effectiveDate: '1873 – 31 Maret 1996',
  readMinutes: 5,
  summary:
    'Selama lebih dari satu abad (1873–1996), pemungutan Bea Masuk di Indonesia bertumpu pada ordonansi hukum kolonial yang diteruskan Aturan Peralihan UUD 1945 dan diselaraskan secara nasional lewat PP Nomor 6 Tahun 1969 sebelum dicabut oleh UU Nomor 10 Tahun 1995.',
  sections: [
    {
      heading: 'Tiga Ordonansi Pabean Era Kolonial (1873, 1882, & 1910)',
      paragraphs: [
        'Hukum kepabeanan tertulis pertama di Hindia Belanda berpijak pada Indische Tariefwet 1873 (Staatsblad 1873 No. 35, yang kemudian diundangkan ulang dalam Stb. 1924 No. 487 tentang tarif bea), Rechten Ordonnantie 1882 (Staatsblad 1882 No. 240 tentang tata laksana pemungutan bea masuk/keluar oleh Douane), serta Tarief Ordonnantie 1910 (Stb. 1910 No. 628).',
        'Pasca-kemerdekaan, melalui Pasal II Aturan Peralihan UUD 1945, ketiga perangkat hukum kolonial tersebut tetap diberlakukan dengan penyesuaian kelembagaan Jawatan Bea dan Cukai (kini DJBC) dan menganut prinsip penetapan langsung oleh pejabat pemeriksa (official assessment) beserta inspeksi fisik penuh (di masa 1985 sempat dialihdayakan melalui pemeriksaan pra-apalan SGS via Inpres 4/1985).',
      ],
    },
    {
      heading: 'Penataan Tarif Nasional PP 6/1969 hingga Pencabutan pada 1 April 1996',
      paragraphs: [
        'Untuk menyesuaikan struktur proteksi industri dan penerimaan negara pada awal Orde Baru serta adopsi nomenklatur perdagangan internasional (BTN/CCCN hingga HS awal), pemerintah menerbitkan PP Nomor 6 Tahun 1969 tentang Pembebanan Atas Impor yang diubah berulang kali hingga PP Nomor 35 Tahun 1977 dan PP Nomor 26 Tahun 1988. Pada masa itu, tarif proteksi barang konsumsi/mewah dapat melampaui 50%–100%.',
        'Seluruh era ordonansi kolonial dan mekanisme PP 6/1969 berakhir resmi pada tanggal 31 Maret 1996 ketika Pasal 117 jo. Pasal 118 UU Nomor 10 Tahun 1995 mencabut Indische Tariefwet 1873, Rechten Ordonnantie 1882, dan Tarief Ordonnantie 1910 mulai 1 April 1996.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era Kolonial & PP 6/1969 (1873 – 31 Mar 1996)',
    newHeader: 'UU 10/1995 (Mulai 1 April 1996)',
    rows: [
      {
        aspek: 'Sumber Hukum Utama',
        aturanLama: 'Ordonansi Stb. 1873/35, Stb. 1882/240, Stb. 1910/628 & PP 6/1969',
        aturanBaru: 'Undang-Undang Kepabeanan Nasional (UU 10/1995)',
      },
      {
        aspek: 'Mekanisme Pemeriksaan & Penetapan',
        aturanLama: 'Official assessment & pemeriksaan pre-shipment (Inpres 4/1985 / SGS)',
        aturanBaru: 'Self-assessment via PIB oleh importir & audit kepabeanan DJBC',
      },
      {
        aspek: 'Struktur Tarif Maksimal Umum',
        aturanLama: 'Tarif proteksi tinggi (dapat > 50%–100% sesuai pos CCCN/BTBMI awal)',
        aturanBaru: 'Dibatasi maksimal 40% untuk tarif umum (Pasal 12 UU 10/1995)',
      },
    ],
  },
  caseExample: {
    title: 'Ilustrasi penetapan Bea Masuk era PP 6/1969 stdd PP 26/1988 (Tarif Proteksi 30%)',
    scenario:
      'Impor barang jadi pada tahun 1990 dengan nilai patokan impor setara Rp 100.000.000 pada rezim tarif PP 6/1969 jo. PP 26/1988 bertarif 30%.',
    presetRegime: 'bea_masuk_pra1996',
    presetInput: {
      bea_masuk: {
        nilaiPabeanIdr: 100000000,
        tarifBmPersen: 30,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '15 November 2026',
};

export const beaMasukPra1996Rule: TaxRuleModule<TaxCalculatorInput['bea_masuk']> = {
  regime,
  article,
  calculate(input) {
    const nilaiPabean = Math.max(0, input.nilaiPabeanIdr);
    const tarif = Math.max(0, Math.min(200, input.tarifBmPersen));
    const beaMasuk = Math.round(nilaiPabean * (tarif / 100));
    const totalNilai = nilaiPabean + beaMasuk;
    const effectiveRate = nilaiPabean > 0 ? (beaMasuk / nilaiPabean) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai Patokan / Dasar Impor Era Pra-1996', value: nilaiPabean },
      {
        label: 'Tarif Bea Masuk Ordonansi / PP 6/1969 stdd PP 26/1988',
        formula: 'Belum mengenal pagu umum 40% UU 10/1995',
        value: tarif,
        format: 'percent',
      },
      {
        label: 'Bea Masuk Terutang (Official Assessment)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(nilaiPabean)}`,
        value: beaMasuk,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Masuk Era Pra-1996',
      primaryTaxAmount: beaMasuk,
      effectiveRatePercent: effectiveRate,
      effectiveRateLabel: 'Tarif Pembebanan Impor',
      takeHomeOrNetLabel: 'Total Nilai Impor + Bea Masuk',
      takeHomeOrNetAmount: totalNilai,
      steps,
      notes: [
        'Arsip Historis: Indische Tariefwet 1873, Rechten Ordonnantie 1882, dan Tarief Ordonnantie 1910 resmi dicabut oleh Pasal 117 UU Nomor 10 Tahun 1995 sejak 1 April 1996.',
      ],
    };
  },
};
