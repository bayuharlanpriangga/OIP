import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_80_2008, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph25_pp80_2008_fln',
  taxType: 'pph25',
  name: 'PP 80/2008 (Fiskal Luar Negeri — Dihapus 1 Januari 2011)',
  shortName: '2009–2010 (Fiskal Luar Negeri PP 80/2008)',
  legalBasis: 'Pasal 25 ayat (8) & (8a) UU Nomor 36 Tahun 2008 jo. PP Nomor 80 Tahun 2008',
  effectivePeriod: '1 Januari 2009 – 31 Desember 2010 (Berakhir 1 Jan 2011)',
  isCurrent: false,
  summary:
    'Aturan historis pembayaran PPh Pasal 25 ayat (8) saat penduduk bertolak ke luar negeri (Fiskal Luar Negeri): dibebaskan (Rp 0) bagi pemegang NPWP/keluarga, namun dikenakan Rp 2.500.000 per keberangkatan udara dan Rp 1.000.000 per keberangkatan laut bagi yang tidak memiliki NPWP sebelum dihapus permanen mulai 1 Januari 2011.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pp80-2008-fln',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Sejarah Fiskal Luar Negeri (FLN): PP 80/2008 sebagai Kredit PPh 25 Sebelum Dihapus 2011',
  legalBasis: 'Pasal 25 ayat (8a) UU Nomor 36 Tahun 2008 jo. PP Nomor 80 Tahun 2008',
  effectiveDate: '1 Januari 2009 (Berakhir 31 Desember 2010)',
  readMinutes: 4,
  summary:
    'Salah satu instrumen paling dikenang dalam sejarah ekstensifikasi NPWP Indonesia: pembebasan Fiskal Luar Negeri Rp 2,5 juta (udara) dan Rp 1 juta (laut) hanya bagi pemilik NPWP pada 2009–2010 sebelum resmi dihapus selamanya mulai 1 Januari 2011.',
  sections: [
    {
      heading: 'Insentif NPWP 2009–2010: Rp 2,5 juta per terbang vs bebas NPWP',
      paragraphs: [
        'Sebelumnya, setiap WNI atau penduduk asing yang bertolak ke luar negeri (termasuk pemilik NPWP) wajib membayar Fiskal Luar Negeri sebesar Rp 1.000.000 (pesawat) atau Rp 500.000 (kapal laut) sebagai angsuran/pembayaran PPh Pasal 25.',
        'Melalui UU 36/2008 dan PP Nomor 80 Tahun 2008, selama masa transisi dua tahun (2009–2010), tarif FLN justru dinaikkan menjadi Rp 2.500.000 (keberangkatan udara) dan Rp 1.000.000 (keberangkatan laut) khusus bagi pelancong berusia >= 21 tahun yang tidak ber-NPWP, sementara pemilik NPWP dan tanggungannya dibebaskan (Rp 0). Kebijakan tersebut berhasil mendongkrak kepemilikan NPWP secara masif sebelum Fiskal Luar Negeri dihapus total per 1 Januari 2011.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Non-NPWP Usia >= 21 Thn (2009–2010)',
    newHeader: 'Pemilik NPWP & Setelah 1 Januari 2011',
    rows: [
      {
        aspek: 'Fiskal Luar Negeri pesawat udara',
        aturanLama: 'Rp 2.500.000 per orang per keberangkatan',
        aturanBaru: 'Rp 0 (Bebas FLN)',
      },
      {
        aspek: 'Fiskal Luar Negeri kapal laut',
        aturanLama: 'Rp 1.000.000 per orang per keberangkatan',
        aturanBaru: 'Rp 0 (Bebas FLN)',
      },
    ],
  },
  caseExample: {
    title: 'Keberangkatan pesawat luar negeri tanpa NPWP pada 2010 (Rp 2,5 juta)',
    scenario:
      'Penumpang usia dewasa tanpa NPWP bertolak melalui Bandara Soekarno-Hatta menuju Singapura pada tahun 2010 wajib membayar FLN sebesar Rp 2.500.000 sebagai angsuran PPh Pasal 25.',
    presetRegime: 'pph25_pp80_2008_fln',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 0,
        bulanBerjalan: 12,
        flnTransport: 'udara',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pp80_2008FlnRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const mode = input.flnTransport ?? 'udara';
    const fee = mode === 'punya_npwp' ? 0 : mode === 'laut' ? 1000000 : 2500000;
    const label =
      mode === 'punya_npwp'
        ? 'Pemegang NPWP / Tanggungan Sah / Pasca 2011 (Dibebaskan)'
        : mode === 'laut'
          ? 'Berangkat via Angkutan Laut Tanpa NPWP (PP 80/2008)'
          : 'Berangkat via Pesawat Udara Tanpa NPWP (PP 80/2008)';

    const steps: CalculationStep[] = [
      { label: 'Kategori keberangkatan & status NPWP (PP 80/2008)', formula: label, value: fee },
      { label: 'Fiskal Luar Negeri (Angsuran PPh 25) per orang', value: fee, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'Fiskal Luar Negeri Dibayar di Bandara/Pelabuhan',
      primaryTaxAmount: fee,
      effectiveRatePercent: 0,
      takeHomeOrNetLabel: 'Sisa Biaya (Jika Punya NPWP, Anda Hemat)',
      takeHomeOrNetAmount: mode === 'punya_npwp' ? 2500000 : 0,
      steps,
      notes: [
        mode === 'punya_npwp'
          ? 'Pemilik NPWP (termasuk istri/anak dalam kartu keluarga) bebas dari pembayaran FLN sepanjang 2009–2010; per 1 Januari 2011, kewajiban FLN dihapus seluruhnya berdasarkan Pasal 25 ayat (8a) UU 36/2008.'
          : `Pembayaran FLN sebesar ${formatRupiah(fee)} di loket bandara/pelabuhan dapat diperhitungkan sebagai angsuran/kredit pajak PPh Pasal 25 apabila yang bersangkutan mendaftarkan NPWP dan melapor SPT Tahunan.`,
      ],
    };
  },
};
