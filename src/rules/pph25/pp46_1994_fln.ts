import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_46_1994, SRC.PP_17_1998, SRC.PP_42_2000, SRC.PP_80_2008];

const regime: TaxRegime = {
  id: 'pph25_pp46_1994_fln',
  taxType: 'pph25',
  name: 'PP 46/1994 & PP 17/1998 (Fiskal Luar Negeri 1995–2000)',
  shortName: '1995–2000 (Fiskal LN PP 46/1994 & PP 17/1998)',
  legalBasis: 'PP Nomor 46 Tahun 1994 (1995–1998) & PP Nomor 17 Tahun 1998 (1998–2000)',
  effectivePeriod: '1 Januari 1995 – 22 Juni 2000',
  isCurrent: false,
  summary:
    'Rantai historis Fiskal Luar Negeri (FLN) sebelum PP 42/2000 dan PP 80/2008: pada PP 46/1994 tarifnya Rp 250.000 (pesawat udara) dan Rp 100.000 (kapal laut); lalu dinaikkan 4–5 kali lipat saat krisis moneter 1998 melalui PP 17/1998 menjadi Rp 1.000.000 (pesawat udara) dan Rp 500.000 (kapal laut).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pp46-1994-fln',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Sejarah Awal Fiskal Luar Negeri (1995–2000): Lonjakan Krisis Moneter PP 46/1994 ke PP 17/1998',
  legalBasis: 'PP Nomor 46 Tahun 1994 & PP Nomor 17 Tahun 1998',
  effectiveDate: '1 Januari 1995 – 22 Juni 2000',
  readMinutes: 4,
  summary:
    'Mendokumentasikan evolusi tarif Fiskal Luar Negeri per keberangkatan sebelum era Rp 1 juta/500 ribu dipertegas ulang di PP 42/2000 dan dinaikkan lagi menjadi Rp 2,5 juta di PP 80/2008.',
  sections: [
    {
      heading: 'Dari Rp 250 ribu (1995) melompat menjadi Rp 1 juta (Januari 1998)',
      paragraphs: [
        'Melalui PP Nomor 46 Tahun 1994 (berlaku sejak 1 Januari 1995), orang pribadi yang bertolak ke luar negeri wajib membayar PPh Pasal 25 di muka sebesar Rp 250.000 per keberangkatan menggunakan pesawat udara, Rp 100.000 dengan kapal laut, dan Rp 50.000 lewat darat.',
        'Ketika krisis ekonomi melanda Indonesia pada awal 1998, pemerintah menerbitkan PP Nomor 17 Tahun 1998 (berlaku 26 Januari 1998) untuk menahan arus keluar devisa: tarif pesawat udara naik empat kali lipat menjadi Rp 1.000.000, kapal laut menjadi Rp 500.000, dan lintas darat menjadi Rp 200.000 — sebelum akhirnya disusun ulang dalam PP 42/2000 dan dihapus permanen sejak 1 Januari 2011.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 46/1994 (1995–Jan 1998)',
    newHeader: 'PP 17/1998 (Jan 1998–2000)',
    rows: [
      {
        aspek: 'Keberangkatan pesawat udara',
        aturanLama: 'Rp 250.000 per orang/keberangkatan',
        aturanBaru: 'Rp 1.000.000 per orang/keberangkatan',
      },
      {
        aspek: 'Keberangkatan kapal laut',
        aturanLama: 'Rp 100.000 per orang/keberangkatan',
        aturanBaru: 'Rp 500.000 per orang/keberangkatan',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan FLN pesawat udara tahun 1996 (PP 46/1994) vs tahun 1998 (PP 17/1998)',
    scenario:
      'Pelancong orang pribadi berangkat ke luar negeri melalui bandara internasional pada era PP 17/1998 (Rp 1.000.000).',
    presetRegime: 'pph25_pp46_1994_fln',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 0,
        kreditPajakTahunLalu: 0,
        bulanBerjalan: 1,
        flnTransport: 'udara',
        flnEra1994: 'pp17_1998',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pp46_1994FlnRule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const era = input.flnEra1994 ?? 'pp17_1998';
    const moda = input.flnTransport ?? 'udara';
    const jumlahKeberangkatan = Math.max(1, Math.round(input.bulanBerjalan || 1));

    let tarifSatuan = 0;
    const effectiveModa = moda === 'laut' || moda === 'darat' ? moda : 'udara';
    if (era === 'pp46_1994') {
      tarifSatuan = effectiveModa === 'udara' ? 250000 : effectiveModa === 'laut' ? 100000 : 50000;
    } else {
      tarifSatuan = effectiveModa === 'udara' ? 1000000 : effectiveModa === 'laut' ? 500000 : 200000;
    }

    const totalFln = tarifSatuan * jumlahKeberangkatan;
    const steps: CalculationStep[] = [
      {
        label: `Tarif Fiskal Luar Negeri per keberangkatan (${era === 'pp46_1994' ? 'PP 46/1994' : 'PP 17/1998'})`,
        value: tarifSatuan,
      },
      {
        label: `Total FLN untuk ${jumlahKeberangkatan}x keberangkatan`,
        formula: `${formatRupiah(tarifSatuan)} x ${jumlahKeberangkatan}`,
        value: totalFln,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Fiskal Luar Negeri Dibayar',
      primaryTaxAmount: totalFln,
      effectiveRatePercent: 0,
      takeHomeOrNetLabel: 'Kredit PPh Pasal 25 Tahun Pajak Berjalan',
      takeHomeOrNetAmount: totalFln,
      steps,
      notes: [
        moda === 'punya_npwp'
          ? 'Pada era 1995–2000 (sebelum PP 80/2008), kepemilikan NPWP belum membebaskan FLN secara otomatis di bandara, melainkan FLN dikreditkan di SPT Tahunan.'
          : 'Tanda Bukti Pembayaran Fiskal Luar Negeri (TBPFLN) menjadi kredit pajak PPh Pasal 25 bagi Wajib Pajak di SPT Tahunan.',
      ],
    };
  },
};
