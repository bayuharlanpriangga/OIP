import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_141_2021, SRC.PP_74_2021, SRC.PP_73_2019];

const regime: TaxRegime = {
  id: 'ppnbm_pmk141_2021_pembebasan',
  taxType: 'ppnbm',
  name: 'PMK 141/PMK.010/2021 (Pembebasan PPnBM Kendaraan Dinas/Umum/Khusus)',
  shortName: '2021–Kini (Pembebasan PPnBM PMK 141/2021)',
  legalBasis: 'Pasal 16–22 PMK Nomor 141/PMK.010/2021 jo. PP Nomor 74 Tahun 2021',
  effectivePeriod: '16 Oktober 2021 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pembebasan PPnBM ambulans, jenazah, damkar, angkutan umum, & protokol',
  summary:
    'Mengatur pemberian Surat Keterangan Bebas (SKB) PPnBM 0% atas impor atau penyerahan kendaraan bermotor yang digunakan untuk kepentingan layanan publik, pertahanan/keamanan negara (TNI/Polri), ambulans, mobil jenazah, pemadam kebakaran, tahanan, angkutan umum/taksi berizin, serta kendaraan protokoler kenegaraan.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'ppnbm-pmk141-2021-pembebasan',
  taxType: 'ppnbm',
  taxTypeLabel: 'PPnBM',
  title: 'Pembebasan PPnBM Kendaraan Khusus & Angkutan Umum via SKB DJP (PMK 141/PMK.010/2021)',
  legalBasis: 'PMK Nomor 141/PMK.010/2021 jo. PP Nomor 73/2019 stdd PP Nomor 74/2021',
  effectiveDate: '16 Oktober 2021',
  readMinutes: 4,
  summary:
    'Rincian kriteria kendaraan yang dibebaskan dari PPnBM meskipun berbasis sasis penumpang/SUV, beserta konsekuensi apabila dialihfungsikan sebelum jangka waktu pemakaian berakhir.',
  sections: [
    {
      heading: 'Daftar kendaraan penerima fasilitas SKB PPnBM 0%',
      paragraphs: [
        'Walaupun secara spesifikasi kapasitas mesin atau emisi suatu kendaraan termasuk objek PPnBM tarif 15%–40% di PP 73/2019 jo. PP 74/2021, Pasal 16 PMK 141/PMK.010/2021 mengecualikan/membebaskan PPnBM untuk: (1) kendaraan ambulans, jenazah, pemadam kebakaran, tahanan, dan angkutan umum; (2) kendaraan protokoler kenegaraan, pengawalan Presiden/Wapres, dan dinas TNI/Polri; serta (3) kendaraan patroli berizin khusus.',
        'Pembebasan diberikan menggunakan mekanisme Surat Keterangan Bebas (SKB) PPnBM sebelum impor atau penyerahan pabrikan. Apabila dalam waktu 4 tahun sejak impor/perolehan kendaraan tersebut dipindahtangankan atau dialihfungsikan ke penggunaan pribadi/komersial biasa, PPnBM yang dibebaskan wajib dibayar kembali ditambah sanksi.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Kendaraan Pribadi / Korporasi Non-Fasilitas',
    newHeader: 'Kendaraan Dinas/Publik Ber-SKB (PMK 141/2021)',
    rows: [
      {
        aspek: 'Tarif PPnBM sedan/MPV/SUV penggerak bensin',
        aturanLama: '15% – 40% sesuai emisi CO2 & cc (PP 74/2021)',
        aturanBaru: '0% (Dibebaskan dari pengenaan PPnBM dengan SKB DJP)',
      },
      {
        aspek: 'Syarat larangan alih fungsi (clawback)',
        aturanLama: 'Bebas dipindahtangankan',
        aturanBaru: 'Dilarang dipindahtangankan/ubah fungsi selama 4 tahun (atau wajib bayar ulang)',
      },
    ],
  },
  caseExample: {
    title: 'Pengadaan armada ambulans / angkutan umum Rp 600 juta dengan SKB PMK 141/2021',
    scenario:
      'Rumah sakit / yayasan mengimpor atau membeli sasis kendaraan penumpang Rp 600.000.000 yang dikaroseri menjadi ambulans dengan SKB PPnBM PMK 141/2021. Tarif normal 20% (Rp 120.000.000) dibebaskan 100% menjadi Rp 0.',
    presetRegime: 'ppnbm_pmk141_2021_pembebasan',
    presetInput: {
      ppnbm: {
        hargaJual: 600000000,
        categoryType: 'sedan_suv_menengah',
        isPembebasanPmk141: true,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const ppnbmPmk141_2021PembebasanRule: TaxRuleModule<TaxCalculatorInput['ppnbm']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.hargaJual);
    const hasSkbInput = input.isPembebasanPmk141 ?? true;
    const isVehicle = ![
      'hunian_mewah',
      'balon_udara_peluru',
      'helikopter_senjata_api',
      'kapal_pesiar_pesawat',
    ].includes(input.categoryType);
    const hasSkb = hasSkbInput && isVehicle;

    const normalRate =
      input.categoryType === 'listrik_bev'
        ? 0
        : input.categoryType === 'lcgc'
        ? 3
        : input.categoryType === 'hybrid_full'
        ? 6
        : input.categoryType === 'kendaraan_emisi_tinggi'
        ? 40
        : input.categoryType === 'balon_udara_peluru'
        ? 40
        : input.categoryType === 'helikopter_senjata_api'
        ? 50
        : input.categoryType === 'kapal_pesiar_pesawat'
        ? 75
        : 20;

    const normalTax = Math.round((hargaJual * normalRate) / 100);
    const ppnbm = hasSkb ? 0 : normalTax;
    const effRate = hasSkb ? 0 : normalRate;

    const steps: CalculationStep[] = [
      { label: 'Harga jual / nilai impor barang mewah', value: hargaJual },
      { label: `PPnBM normal tanpa SKB (${formatPersen(normalRate)})`, value: normalTax },
      ...(hasSkb
        ? [
            {
              label: 'Pembebasan PPnBM berdasar SKB PMK 141/PMK.010/2021',
              formula: 'Ambulans / jenazah / damkar / angkutan umum / TNI-Polri',
              value: -normalTax,
              isNegative: true,
            },
          ]
        : []),
      {
        label: 'PPnBM wajib dibayar',
        formula: `${formatRupiah(hargaJual)} x ${formatPersen(effRate)}`,
        value: ppnbm,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: hasSkb ? 'PPnBM Dibayar (SKB PMK 141/2021)' : 'PPnBM Terutang Tanpa SKB',
      primaryTaxAmount: ppnbm,
      effectiveRatePercent: effRate,
      takeHomeOrNetLabel: 'Total Harga Kendaraan + PPnBM',
      takeHomeOrNetAmount: hargaJual + ppnbm,
      steps,
      notes: [
        !isVehicle
          ? 'PMK 141/PMK.010/2021 hanya mengatur pembebasan PPnBM atas kendaraan bermotor; barang mewah non-kendaraan mengacu pada PMK 96/2021 jo. PMK 15/2023.'
          : hasSkb
          ? 'Pembebasan PPnBM 0% berlaku sepanjang pemohon memperoleh SKB PPnBM sebelum impor/penyerahan dan tidak mengalihfungsikan kendaraan dalam 4 tahun.'
          : 'Tanpa SKB PMK 141/2021 atau jika kendaraan dipindahtangankan sebelum 4 tahun, tarif normal PP 74/2021 berlaku penuh.',
      ],
    };
  },
};
