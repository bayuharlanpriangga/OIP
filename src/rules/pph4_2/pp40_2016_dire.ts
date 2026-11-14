import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_40_2016, SRC.PP_34_2016, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph4_2_pp40_2016_dire',
  taxType: 'pph4_2',
  name: 'PP 40/2016 (PPh Final Pengalihan Real Estat ke KIK-DIRE 0,5%)',
  shortName: '2016–Sekarang (KIK-DIRE 0,5% PP 40/2016)',
  legalBasis: 'PP Nomor 40 Tahun 2016 (Paket Kebijakan Ekonomi V / XI)',
  effectivePeriod: '17 Oktober 2016 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengalihan real estat kepada SPC / KIK-DIRE (0,5% Final)',
  summary:
    'Insentif perpajakan pasar modal untuk mendorong produk Dana Investasi Real Estat (DIRE/REIT): penghasilan dari pengalihan real estat kepada Special Purpose Company (SPC) atau Kontrak Investasi Kolektif (KIK-DIRE) dikenai PPh Final khusus 0,5% (turun tajam dari tarif normal PHTB 2,5% atau sebelumnya 5%).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp40-2016-dire',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final 0,5% Pengalihan Real Estat dalam Skema KIK-DIRE: PP Nomor 40 Tahun 2016',
  legalBasis: 'PP Nomor 40 Tahun 2016',
  effectiveDate: '17 Oktober 2016',
  readMinutes: 4,
  summary:
    'Mengulas penurunan tarif PPh Final pengalihan properti komersial (mal, gedung perkantoran, hotel, gudang) dari 2,5%/5% menjadi 0,5% apabila dialihkan ke dalam wadah KIK-DIRE atau SPC yang dimilikinya.',
  sections: [
    {
      heading: 'Pemangkasan tarif PHTB dari 2,5% menjadi 0,5% untuk KIK-DIRE',
      paragraphs: [
        'Sebelum terbitnya PP 40/2016, penjualan aset properti kepada Kontrak Investasi Kolektif Dana Investasi Real Estat (KIK-DIRE) dikenai tarif PPh Final umum 5% (PP 71/2008) dan 2,5% (PP 34/2016). Melalui PP Nomor 40 Tahun 2016, tarif atas penghasilan pengalihan real estat kepada SPC atau KIK dalam skema KIK tertentu dipangkas menjadi hanya 0,5% bersifat final dari nilai bruto pengalihan.',
        'Fasilitas ini bertujuan meningkatkan daya saing instrumen DIRE Indonesia di tingkat regional agar pengembang maupun pemilik aset properti bersedia mengemas asetnya ke pasar modal domestik.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PHTB Umum (PP 34/2016)',
    newHeader: 'Skema KIK-DIRE (PP 40/2016)',
    rows: [
      {
        aspek: 'Tarif PPh Final atas nilai bruto pengalihan',
        aturanLama: '2,5% (umum)',
        aturanBaru: '0,5% (khusus pengalihan kepada SPC / KIK-DIRE)',
      },
      {
        aspek: 'Sifat pajak & penerima manfaat',
        aturanLama: 'Final, penjual umum ke pembeli umum',
        aturanBaru: 'Final, wajib memenuhi syarat kepemilikan SPC ≥ 99,9% oleh KIK-DIRE',
      },
    ],
  },
  caseExample: {
    title: 'Pengalihan gedung perkantoran Rp 200.000.000.000 ke KIK-DIRE',
    scenario:
      'Korporasi properti mengalihkan menara perkantoran senilai Rp 200 miliar kepada Special Purpose Company (SPC) dalam skema KIK-DIRE yang memenuhi syarat PP 40/2016.',
    presetRegime: 'pph4_2_pp40_2016_dire',
    presetInput: {
      pph4_2: {
        nilaiBruto: 200000000000,
        objectType: 'pengalihan_tanah_bangunan',
        skemaDireVentura: 'kik_dire_0_5',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pp40_2016DireRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(0, input.nilaiBruto);
    const taxDire = Math.round(nilai * 0.005);
    const taxUmum = Math.round(nilai * 0.025);
    const penghematan = Math.max(0, taxUmum - taxDire);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto pengalihan real estat kepada SPC / KIK-DIRE', value: nilai },
      { label: 'Pembanding PPh Final PHTB umum (2,5% — PP 34/2016)', value: taxUmum },
      { label: 'Penghematan tarif insentif KIK-DIRE (2,0 poin persen)', value: -penghematan, isNegative: true },
      {
        label: 'PPh Final KIK-DIRE terutang (0,5% — PP 40/2016)',
        formula: `${formatRupiah(nilai)} x 0,5%`,
        value: taxDire,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Pengalihan Real Estat KIK-DIRE (0,5%)',
      primaryTaxAmount: taxDire,
      effectiveRatePercent: 0.5,
      takeHomeOrNetLabel: 'Hasil Pengalihan Setelah PPh Final 0,5%',
      takeHomeOrNetAmount: Math.max(0, nilai - taxDire),
      steps,
      notes: [
        `Dengan tarif khusus 0,5% PP 40/2016, pajak terutang sebesar ${formatRupiah(taxDire)} — menghemat ${formatRupiah(penghematan)} dibandingkan tarif PHTB umum 2,5% PP 34/2016.`,
      ],
    };
  },
};
