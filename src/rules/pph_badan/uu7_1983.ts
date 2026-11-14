import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'badan_uu7_1983',
  taxType: 'pph_badan',
  name: 'UU Nomor 7 Tahun 1983 & UU 7/1991',
  shortName: '1984–1994 (15/25/35%)',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 7 Tahun 1983 stdd UU Nomor 7 Tahun 1991',
  effectivePeriod: 'Tahun Pajak 1984 – 1994',
  isCurrent: false,
  summary:
    'Struktur tarif progresif generasi awal reformasi pajak 1983: 15% (s.d. Rp 10 jt), 25% (> Rp 10 jt s.d. Rp 50 jt), dan 35% (> Rp 50 jt) untuk Orang Pribadi maupun Badan.',
  sources: [SRC.UU_7_1983, SRC.UU_7_1991],
};

const article: TaxArticle = {
  id: 'pph-badan-uu7-1983',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Tarif Awal PPh Badan Reformasi 1983: Menghapus Ordonansi PPs 1925 dengan 15%/25%/35%',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 7 Tahun 1983 stdd UU Nomor 7 Tahun 1991',
  effectiveDate: 'Tahun Pajak 1984 – 1994',
  readMinutes: 4,
  summary:
    'Reformasi pajak 1984 menggantikan Ordonansi Pajak Perseroan 1925 (PPs 1925) dengan UU 7/1983 yang menyatukan pajak penghasilan badan dan perorangan dalam satu tarif 3 lapis: 15%, 25%, dan 35%.',
  sections: [
    {
      heading: 'Dari Pajak Perseroan (PPs 1925) ke UU Pajak Penghasilan 1983',
      paragraphs: [
        'Sebelum 1984, perusahaan dikenai Ordonansi Pajak Perseroan 1925 dengan tarif hingga 45%. UU Nomor 7 Tahun 1983 mengintegrasikan pajak perseorangan dan badan dalam satu undang-undang berdasarkan sistem self-assessment serta menurunkan tarif puncak menjadi 35%.',
        'Setiap WP Badan menghitung PPh tahunan dengan lapisan 15% (PKP s.d. Rp 10 juta), 25% (> Rp 10 juta s.d. Rp 50 juta), dan 35% (> Rp 50 juta). Skema ini berjalan satu dekade hingga diperbarui UU 10/1994.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 7/1983 (1984–1994)',
    newHeader: 'UU HPP (2022–Sekarang)',
    rows: [
      {
        aspek: 'Struktur tarif Badan',
        aturanLama: 'Progresif 15% / 25% / 35%',
        aturanBaru: 'Tarif tunggal 22% (Tbk 19%)',
      },
      {
        aspek: 'Ambang tarif puncak',
        aturanLama: 'PKP di atas Rp 50 juta kena 35%',
        aturanBaru: 'Seluruh PKP non-31E flat 22%',
      },
      {
        aspek: 'Fasilitas usaha kecil',
        aturanLama: 'Lapis 15% & 25% di bawah Rp 50 jt',
        aturanBaru: 'Pasal 31E (11%) & PPh Final UMKM 0,5%',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan dengan PKP Rp 120 juta di tahun 1990',
    scenario:
      'Menghitung PPh Badan PT dengan PKP Rp 120.000.000 pada tahun 1990 memakai lapisan 15%/25%/35% UU 7/1983.',
    presetRegime: 'badan_uu7_1983',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 1200000000,
        penghasilanKenaPajak: 120000000,
        isTbk: false,
      },
    },
  },
};

export const badanUu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;

    const layers = [
      { limit: 10000000, rate: 15 },
      { limit: 50000000, rate: 25 },
      { limit: Infinity, rate: 35 },
    ];

    let remaining = pkp;
    let prevLimit = 0;
    let totalTax = 0;
    const parts: string[] = [];

    for (const layer of layers) {
      if (remaining <= 0) break;
      const span = layer.limit === Infinity ? remaining : Math.min(remaining, layer.limit - prevLimit);
      const layerTax = Math.round((span * layer.rate) / 100);
      totalTax += layerTax;
      parts.push(`${layer.rate}% x ${formatRupiah(span)}`);
      remaining -= span;
      prevLimit = layer.limit;
    }

    const effectiveRate = pkp > 0 ? (totalTax / pkp) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Penghasilan Kena Pajak (PKP dibulatkan ribuan)', value: pkp },
      {
        label: 'Lapisan tarif progresif UU 7/1983 (15% / 25% / 35%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Sejak reformasi perpajakan 1984 hingga 1994 (UU 7/1983 jo. UU 7/1991), WP Badan dan WP Orang Pribadi menggunakan lapisan tarif Pasal 17 yang sama (15% / 25% / 35%) dengan batas Rp 10 juta & Rp 50 juta.',
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Badan Terutang Setahun',
      primaryTaxAmount: totalTax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Laba Fiskal Bersih Setelah PPh',
      takeHomeOrNetAmount: Math.max(0, pkp - totalTax),
      steps,
      notes,
    };
  },
};
