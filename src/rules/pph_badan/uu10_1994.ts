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
  id: 'badan_uu10_1994',
  taxType: 'pph_badan',
  name: 'UU Nomor 10 Tahun 1994 (10/15/30%)',
  shortName: '1995–2000 (UU 10/1994)',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 10 Tahun 1994',
  effectivePeriod: 'Tahun Pajak 1995 – 2000',
  isCurrent: false,
  summary:
    'Struktur tarif progresif Pasal 17 UU 10/1994 untuk Orang Pribadi maupun Badan: 10% (s.d. Rp 25 jt), 15% (> Rp 25 jt s.d. Rp 50 jt), dan 30% (> Rp 50 jt). Belum mengenal Pasal 31E maupun diskon Tbk.',
  sources: [SRC.UU_10_1994, SRC.UU_7_1983],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-uu10-1994',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Tarif Progresif Terpadu Badan dan Orang Pribadi 10%/15%/30% Era UU 10/1994',
  legalBasis: 'Pasal 17 ayat (1) UU Nomor 10 Tahun 1994',
  effectiveDate: 'Tahun Pajak 1995 – 2000',
  readMinutes: 3,
  summary:
    'Pada periode 1995–2000, korporasi masih berbagi satu tabel tarif progresif Pasal 17 yang sama dengan wajib pajak orang pribadi, yaitu 10%, 15%, dan puncak 30% mulai PKP di atas Rp 50 juta.',
  sections: [
    {
      heading: 'Penurunan 5% di semua lapisan dari era UU 7/1983',
      paragraphs: [
        'UU Nomor 10 Tahun 1994 memangkas tarif tiga lapis sebelumnya (15%/25%/35%) menjadi 10% (s.d. Rp 25 juta), 15% (> Rp 25 juta s.d. Rp 50 juta), dan 30% (> Rp 50 juta) agar iklim investasi Indonesia tetap kompetitif di Asia Tenggara.',
        'Karena belum terpisah dari tarif orang pribadi, perusahaan berskala kecil dengan laba fiskal di bawah Rp 50 juta menikmati tarif efektif yang jauh lebih rendah dari 30%, sementara pada akhir periode UU 17/2000 barulah tabel Badan dipisahkan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 7/1983 (1984–1994)',
    newHeader: 'UU 10/1994 (1995–2000)',
    rows: [
      {
        aspek: 'Tarif lapisan pertama',
        aturanLama: '15% (s.d. Rp 10 juta)',
        aturanBaru: '10% (s.d. Rp 25 juta)',
      },
      {
        aspek: 'Tarif lapisan kedua',
        aturanLama: '25% (> Rp 10 jt s.d. Rp 50 jt)',
        aturanBaru: '15% (> Rp 25 jt s.d. Rp 50 jt)',
      },
      {
        aspek: 'Tarif lapisan puncak',
        aturanLama: '35% (> Rp 50 juta)',
        aturanBaru: '30% (> Rp 50 juta)',
      },
    ],
  },
  caseExample: {
    title: 'PT dengan PKP Rp 200 juta pada Tahun Pajak 1998',
    scenario:
      'Menghitung PPh Badan PT non-Tbk ber-PKP Rp 200.000.000 memakai lapisan progresif 10%/15%/30% UU 10/1994.',
    presetRegime: 'badan_uu10_1994',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 2000000000,
        penghasilanKenaPajak: 200000000,
        isTbk: false,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const badanUu10_1994Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;

    const layers = [
      { limit: 25000000, rate: 10 },
      { limit: 50000000, rate: 15 },
      { limit: Infinity, rate: 30 },
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
        label: 'Lapisan tarif progresif UU 10/1994 (10% / 15% / 30%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Pada UU 10/1994 (1995–2000), tarif PPh Badan masih disatukan dengan lapis progresif Pasal 17 (batas lapis Rp 25 juta & Rp 50 juta), serta belum tersedia fasilitas Pasal 31E maupun diskon emiten Tbk.',
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
