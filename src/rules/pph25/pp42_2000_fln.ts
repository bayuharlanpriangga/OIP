import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_42_2000, SRC.PP_80_2008, SRC.UU_17_2000];

const regime: TaxRegime = {
  id: 'pph25_pp42_2000_fln',
  taxType: 'pph25',
  name: 'PP 42/2000 (Fiskal Luar Negeri Rp 1 Jt / Rp 500 Rb — Era 2000–2008)',
  shortName: '2000–2008 (Fiskal LN PP 42/2000)',
  legalBasis: 'PP Nomor 42 Tahun 2000 jo. PP Nomor 41 Tahun 2001 & Pasal 25 ayat (8) UU PPh',
  effectivePeriod: '23 Juni 2000 – 31 Desember 2008',
  isCurrent: false,
  summary:
    'Ketentuan Fiskal Luar Negeri (exit tax sebagai angsuran PPh 25 ayat 8) sebelum era PP 80/2008: seluruh pelancong ke luar negeri (tanpa pengecualian NPWP) dikenai Rp 1.000.000 per keberangkatan pesawat udara dan Rp 500.000 per kapal laut.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pp42-2000-fln',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Fiskal Luar Negeri Era PP 42/2000 (Rp 1 Juta / Rp 500 Ribu) Sebelum Bebas NPWP 2009',
  legalBasis: 'PP Nomor 42 Tahun 2000 jo. PP Nomor 41 Tahun 2001',
  effectiveDate: '23 Juni 2000 – 31 Desember 2008',
  readMinutes: 4,
  summary:
    'Mengulas perbedaan krusial Fiskal Luar Negeri era PP 42/2000 (Rp 1 juta pesawat & Rp 500 ribu kapal laut tanpa pembebasan bagi pemilik NPWP) dibanding PP 80/2008 yang membebaskan pemegang NPWP.',
  sections: [
    {
      heading: 'Tarif Rp 1 Juta & Rp 500 Ribu tanpa fasilitas bebas NPWP',
      paragraphs: [
        'Berdasarkan PP Nomor 42 Tahun 2000 (menggantikan PP 46/1994 & PP 78/1998 yang sempat mematok tarif Rp 1 juta/Rp 500 ribu sejak krisis 1998), setiap Orang Pribadi bertolak ke luar negeri wajib membayar Fiskal Luar Negeri (FLN) di bandara atau pelabuhan sebagai pembayaran angsuran PPh Pasal 25.',
        'Berbeda dengan rezim PP 80/2008 (mulai 2009), pada era PP 42/2000 memiliki NPWP TIDAK membebaskan pelancong dari FLN (kecuali pekerja dinas/kriteria bebas khusus seperti TKI, awak kapal, atau lintas batas darat dengan pengecualian tersendiri). Nilai Rp 1.000.000 (pesawat udara) atau Rp 500.000 (kapal laut) baru dapat dikreditkan di SPT Tahunan PPh OP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 42/2000 (2000–2008)',
    newHeader: 'PP 80/2008 (2009–2010) & Penghapusan 2011',
    rows: [
      {
        aspek: 'Tarif keberangkatan Pesawat Udara',
        aturanLama: 'Rp 1.000.000 / orang / keberangkatan',
        aturanBaru: 'Rp 2.500.000 (2009–2010), lalu Rp 0 (hapus mulai 2011)',
      },
      {
        aspek: 'Tarif keberangkatan Kapal Laut',
        aturanLama: 'Rp 500.000 / orang / keberangkatan',
        aturanBaru: 'Rp 1.000.000 (2009–2010), lalu Rp 0 (hapus mulai 2011)',
      },
      {
        aspek: 'Pemegang NPWP',
        aturanLama: 'Tetap bayar penuh (dapat dikreditkan di SPT)',
        aturanBaru: 'Dibebaskan 100% mulai 1 Januari 2009',
      },
    ],
  },
  caseExample: {
    title: 'Keberangkatan pesawat udara ke Singapura pada 2006 oleh pemegang NPWP',
    scenario:
      'Seorang direktur ber-NPWP berangkat ke luar negeri via Bandara Soekarno-Hatta tahun 2006: tetap wajib membayar FLN Rp 1.000.000 berdasarkan PP 42/2000 dan bukti bayarnya dikreditkan sebagai PPh Pasal 25 pada SPT Tahunan.',
    presetRegime: 'pph25_pp42_2000_fln',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 0,
        bulanBerjalan: 1,
        flnTransport: 'udara',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pp42_2000FlnRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const mode = input.flnTransport ?? 'udara';
    const perTrip = mode === 'laut' ? 500000 : 1000000;
    const jumlahKeberangkatan = Math.max(1, Math.min(24, Math.round(input.bulanBerjalan || 1)));
    const total = perTrip * jumlahKeberangkatan;

    const steps: CalculationStep[] = [
      {
        label: 'Moda keberangkatan keluar wilayah Indonesia (PP 42/2000)',
        formula: mode === 'laut' ? 'Kapal laut (Rp 500.000/keberangkatan)' : 'Pesawat udara (Rp 1.000.000/keberangkatan)',
        value: perTrip,
      },
      { label: 'Jumlah keberangkatan (simulasi)', value: jumlahKeberangkatan },
      {
        label: 'Total Fiskal Luar Negeri (FLN) dibayar',
        formula: `${jumlahKeberangkatan} x ${formatRupiah(perTrip)}`,
        value: total,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Fiskal Luar Negeri (PP 42/2000)',
      primaryTaxAmount: total,
      effectiveRatePercent: 0,
      effectiveRateLabel: 'Tarif tetap per keberangkatan',
      takeHomeOrNetLabel: 'Kredit Angsuran PPh 25 di SPT OP',
      takeHomeOrNetAmount: total,
      steps,
      notes: [
        'Pada periode PP 42/2000 (2000–2008), memiliki NPWP TIDAK membebaskan Fiskal Luar Negeri — pemilik NPWP tetap membayar Rp 1 juta (pesawat) atau Rp 500 ribu (kapal laut) lalu mengkreditkannya di SPT Tahunan.',
        'Pembebasan bagi pemegang NPWP baru berlaku 1 Januari 2009 lewat PP 80/2008, dan FLN dihapus permanen mulai 1 Januari 2011.',
      ],
    };
  },
};
