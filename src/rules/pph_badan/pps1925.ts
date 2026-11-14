import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.UU_8_1970_PPS, SRC.UU_7_1983];

const regime: TaxRegime = {
  id: 'badan_pps1925',
  taxType: 'pph_badan',
  name: 'Ordonansi Pajak Perseroan 1925 jo. UU Nomor 8 Tahun 1970 (Pra-UU 7/1983)',
  shortName: '1970–1983 (PPs 1925: 20%–45%)',
  legalBasis: 'Ordonansi Pajak Perseroan 1925 stdd UU Nomor 8 Tahun 1970 Pasal 10 (Dicabut UU 7/1983)',
  effectivePeriod: '1970 – 31 Desember 1983',
  isCurrent: false,
  summary:
    'Rezim Pajak Perseroan (PPs) sebelum Reformasi Perpajakan 1983–1984: tarif progresif 20% atas laba kena pajak sampai Rp 10 juta (sempat menjadi Rp 25 juta di akhir era), dan 45% atas seluruh lapisan laba di atasnya (dengan tarif tengah 30% pasca penyesuaian akhir Orde Baru).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pps1925',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Sejarah Pajak Perseroan Pra-Reformasi 1983: Ordonansi PPs 1925 jo. UU Nomor 8 Tahun 1970',
  legalBasis: 'Ordonansi Pajak Perseroan 1925 stdd UU Nomor 8 Tahun 1970 Pasal 10',
  effectiveDate: '1970 (Dicabut mulai 1 Januari 1984 oleh UU 7/1983)',
  readMinutes: 4,
  summary:
    'Mengenal Pajak Perseroan (PPs) sebelum lahirnya UU PPh 1983: tarif korporasi kala itu memungut 20% untuk laba hingga Rp 10 juta dan langsung melonjak menjadi 45% untuk seluruh laba di atasnya.',
  sections: [
    {
      heading: 'Dari Pajak Perseroan (PPs) 45% ke penyederhanaan UU 7/1983',
      paragraphs: [
        'Sebelum Reformasi Perpajakan Nasional 1983, pajak atas laba perusahaan dipungut terpisah dari pajak individu di bawah nama Pajak Perseroan (PPs) yang berakar dari Ordonansi 1925 dan diperbarui melalui UU Nomor 8 Tahun 1970.',
        'Sesuai Pasal 10 Ordonansi PPs jo. UU Nomor 8 Tahun 1970, tarif PPs terdiri atas 20% terhadap laba kena pajak sampai dengan Rp 10.000.000 (serta tambahan pajak sebesar 25% atas kelebihan laba di atas Rp 10.000.000 — sehingga tarif marginal lapisan atas mencapai tepat 45%). Beban tarif marjinal 45% ini kemudian dipangkas dan disatukan dalam UU Nomor 7 Tahun 1983 dengan lapisan 15%, 25%, dan 35%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Ordonansi PPs 1925 jo. UU 8/1970 (1970–1983)',
    newHeader: 'UU Nomor 7 Tahun 1983 (1984–1994)',
    rows: [
      {
        aspek: 'Tarif dasar laba kecil',
        aturanLama: '20% s.d. laba Rp 10.000.000',
        aturanBaru: '15% s.d. Rp 10.000.000',
      },
      {
        aspek: 'Tarif marginal tertinggi',
        aturanLama: '45% atas laba di atas Rp 10.000.000 (20% dasar + 25% tambahan)',
        aturanBaru: '35% atas PKP di atas Rp 50.000.000',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi laba kena pajak perseroan Rp 100 juta pada era PPs 1925 / UU 8/1970',
    scenario:
      'Perseroan dengan laba kena pajak Rp 100.000.000 pada era UU 8/1970 dikenai 20% atas Rp 10 juta pertama (Rp 2 juta) dan 45% atas sisa Rp 90 juta (Rp 40,5 juta) sehingga total pajak mencapai Rp 42.500.000 (tarif efektif 42,5%).',
    presetRegime: 'badan_pps1925',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 500000000,
        penghasilanKenaPajak: 100000000,
        isTbk: false,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanPps1925Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkp = Math.floor(Math.max(0, input.penghasilanKenaPajak) / 1000) * 1000;
    const lapis1 = Math.min(pkp, 10000000);
    const lapis2 = Math.max(0, pkp - 10000000);

    const tax1 = Math.round(lapis1 * 0.2);
    const tax2 = Math.round(lapis2 * 0.45);
    const totalTax = tax1 + tax2;
    const effectiveRate = pkp > 0 ? (totalTax / pkp) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Laba kena pajak perseroan (PPs 1925 jo. UU 8/1970)', value: pkp },
      { label: 'Lapis 1: s.d. Rp 10.000.000 (tarif 20%)', formula: `${formatRupiah(lapis1)} x 20%`, value: tax1 },
      {
        label: 'Lapis 2: > Rp 10.000.000 (tarif marginal 45%)',
        formula: `${formatRupiah(lapis2)} x 45%`,
        value: tax2,
      },
      {
        label: 'Total Pajak Perseroan (PPs) terutang',
        formula: `Tarif efektif ${formatPersen(effectiveRate)}`,
        value: totalTax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Perseroan (PPs) Era 1970–1983',
      primaryTaxAmount: totalTax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Laba Bersih Perseroan Setelah PPs',
      takeHomeOrNetAmount: Math.max(0, pkp - totalTax),
      steps,
      notes: [
        'Struktur Pasal 10 Ordonansi PPs 1925 jo. UU 8/1970 mengenakan tarif dasar 20% atas seluruh laba ditambah pajak tambahan 25% atas kelebihan di atas Rp 10 juta (ekuivalen tarif 20% + 45%).',
      ],
    };
  },
};
