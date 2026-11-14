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
  id: 'badan_uu17_2000',
  taxType: 'pph_badan',
  name: 'UU Nomor 17 Tahun 2000 (Progresif 3 Lapis)',
  shortName: '2001–2008 (10/15/30%)',
  legalBasis: 'Pasal 17 ayat (1) huruf b UU 17/2000 & PP 81/2007 (Diskon Tbk TP 2008)',
  effectivePeriod: 'Tahun Pajak 2001 – 2008',
  isCurrent: false,
  summary:
    'Sebelum tarif tunggal berlaku di 2009, PPh Badan menggunakan tarif progresif tiga lapis: 10% (s.d. Rp 50 jt), 15% (> Rp 50 jt–100 jt), dan 30% (> Rp 100 jt) tanpa Pasal 31E; khusus TP 2008 emiten Tbk mendapat diskon 5% di PP 81/2007.',
  sources: [SRC.UU_17_2000, SRC.PP_81_2007],
};

const article: TaxArticle = {
  id: 'pph-badan-uu17-2000',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Tarif Progresif Badan 10%/15%/30% dan Lahirnya Diskon Tbk di PP 81/2007',
  legalBasis: 'Pasal 17 ayat (1) huruf b UU 17/2000 jo. PP Nomor 81 Tahun 2007',
  effectiveDate: 'Tahun Pajak 2001 – 2008',
  readMinutes: 4,
  summary:
    'Selama 2001–2008, Wajib Pajak Badan masih dikenai tiga lapisan progresif berdasarkan besarnya PKP (10%, 15%, 30%) tanpa memandang besaran omzet, dan pada 2008 pertama kali diperkenalkan insentif penurunan tarif 5% bagi perusahaan terbuka.',
  sections: [
    {
      heading: 'Pemisahan tabel tarif Badan dari Orang Pribadi di UU 17/2000',
      paragraphs: [
        'Berbeda dari UU 7/1983 dan UU 10/1994 yang menyatukan lapisan tarif Orang Pribadi dan Badan, UU Nomor 17 Tahun 2000 memisahkan Pasal 17 ayat (1) huruf a (OP 5 lapis) dan huruf b (WP Badan 3 lapis).',
        'Untuk WP Badan dan BUT, tarifnya adalah 10% atas PKP sampai Rp 50 juta, 15% atas PKP di atas Rp 50 juta s.d. Rp 100 juta, dan 30% atas PKP di atas Rp 100 juta—tanpa fasilitas Pasal 31E maupun batas omzet Rp 4,8 miliar.',
      ],
    },
    {
      heading: 'Insentif awal pasar modal melalui PP 81/2007',
      paragraphs: [
        'Guna mendorong emiten melepas saham ke publik, pemerintah menerbitkan PP 81/2007 yang mulai efektif Tahun Pajak 2008 dengan memberikan penurunan tarif sebesar 5% (menjadi 5%/10%/25%) apabila minimal 40% saham dimiliki masyarakat publik melalui bursa efek.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 10/1994 (1995–2000)',
    newHeader: 'UU 17/2000 (2001–2008)',
    rows: [
      {
        aspek: 'Batas lapisan tarif 10%',
        aturanLama: 'PKP s.d. Rp 25.000.000',
        aturanBaru: 'Diperluas s.d. Rp 50.000.000',
      },
      {
        aspek: 'Batas lapisan tarif 15%',
        aturanLama: 'PKP > Rp 25 jt s.d. Rp 50 jt',
        aturanBaru: 'PKP > Rp 50 jt s.d. Rp 100 jt',
      },
      {
        aspek: 'Tarif puncak & diskon Tbk',
        aturanLama: '30% (> Rp 50 jt), tanpa diskon Tbk',
        aturanBaru: '30% (> Rp 100 jt), diskon 5% Tbk (TP 2008)',
      },
    ],
  },
  caseExample: {
    title: 'Perusahaan dengan laba fiskal Rp 350 juta pada tahun 2006',
    scenario:
      'Menghitung PPh Badan ber-PKP Rp 350 juta di tahun 2006 yang terbagi ke lapis 10% (Rp 50 jt), 15% (Rp 50 jt), dan 30% (Rp 250 jt).',
    presetRegime: 'badan_uu17_2000',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 4000000000,
        penghasilanKenaPajak: 350000000,
        isTbk: false,
      },
    },
  },
};

export const badanUu17_2000Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const pkpRaw = Math.max(0, input.penghasilanKenaPajak);
    const pkp = Math.floor(pkpRaw / 1000) * 1000;
    const tbkDiscount = input.isTbk ? 5 : 0;

    const layers = [
      { limit: 50000000, rate: Math.max(0, 10 - tbkDiscount) },
      { limit: 100000000, rate: Math.max(0, 15 - tbkDiscount) },
      { limit: Infinity, rate: Math.max(0, 30 - tbkDiscount) },
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
        label: input.isTbk
          ? 'Lapisan progresif UU 17/2000 dikurangi diskon 5% Tbk (PP 81/2007 — TP 2008)'
          : 'Lapisan tarif progresif 3 lapis UU 17/2000 (10% / 15% / 30%)',
        formula: parts.length > 0 ? parts.join(' + ') : 'PKP <= Rp 0',
        value: totalTax,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Di era UU 17/2000 (TP 2001–2008), tarif tidak bergantung pada batas omzet Rp 4,8M/Rp 50M karena fasilitas Pasal 31E baru lahir di UU 36/2008 (mulai TP 2009).',
    ];
    if (input.isTbk) {
      notes.push(
        'Penurunan tarif 5% bagi emiten Tbk (PP Nomor 81 Tahun 2007) dalam era ini mulai berlaku khusus untuk Tahun Pajak 2008.'
      );
    }

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
