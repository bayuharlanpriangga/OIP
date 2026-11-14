import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const BATAS_KONSOLIDASI_GMT_EUR = 750000000;
const TARIF_MIN_GLOBAL = 15;

const sources = [SRC.PMK_136_2024, SRC.PMK_69_2024, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'badan_gmt_pmk136_2024',
  taxType: 'pph_badan',
  name: 'PMK 136/2024 (Pajak Minimum Global / Pillar Two GloBE 15%)',
  shortName: '2025–Kini (Global Minimum Tax 15%)',
  legalBasis: 'PMK Nomor 136 Tahun 2024 (IIR & DMTT berlaku 1 Jan 2025; UTPR 2026) & PMK 69/2024',
  effectivePeriod: '1 Januari 2025 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Grup Multinasional omzet global >= EUR 750 juta',
  summary:
    'Implementasi Pilar Dua OECD (Global Anti-Base Erosion / GloBE): entitas konstituen grup usaha multinasional di Indonesia dengan pendapatan konsolidasi global >= EUR 750 juta wajib memenuhi tarif pajak efektif (ETR) minimal 15%; apabila ETR efektif di Indonesia lebih rendah (misalnya akibat Tax Holiday), terutang Pajak Tambahan Minimum Domestik (QDMTT) sebesar selisihnya.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph-badan-pmk136-2024-gmt',
  taxType: 'pph_badan',
  taxTypeLabel: 'PPh Badan',
  title: 'Pajak Minimum Global 15% (Pilar Dua OECD): PMK Nomor 136 Tahun 2024',
  legalBasis: 'PMK Nomor 136 Tahun 2024 jo. PMK Nomor 69 Tahun 2024',
  effectiveDate: '1 Januari 2025 (QDMTT & IIR; UTPR Tahun Pajak 2026)',
  readMinutes: 5,
  summary:
    'Mengubah lanskap insentif Tax Holiday bagi konglomerasi raksasa: mulai 2025, grup multinasional beromzet konsolidasi >= EUR 750 juta tidak lagi dapat menikmati ETR di bawah 15% di Indonesia tanpa membayar Top-Up Tax (QDMTT).',
  sections: [
    {
      heading: 'Mekanisme IIR, QDMTT, dan dampaknya pada Tax Holiday',
      paragraphs: [
        'PMK Nomor 136 Tahun 2024 (berlaku mulai Tahun Pajak 2025) mengadopsi aturan Global Minimum Tax (GMT) Pilar Dua sebesar 15% bagi grup perusahaan multinasional yang memiliki peredaran bruto konsolidasi tahunan minimal EUR 750 juta pada sedikitnya 2 dari 4 tahun pajak sebelumnya.',
        'Melalui Domestic Minimum Top-Up Tax (DMTT/QDMTT), Indonesia memungut langsung Pajak Tambahan sebesar (15% - Tarif Pajak Efektif yurisdiksi) × Laba GloBE apabila ETR perusahaan di Indonesia berada di bawah 15% — misalnya perusahaan penerima Tax Holiday PMK 130/2020 jo. PMK 69/2024 yang sebelumnya membayar 0%. Dengan adanya QDMTT, hak pemajakan 15% tetap dipungut di Indonesia agar tidak ditarik negara asal induk perusahaan melalui Income Inclusion Rule (IIR).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Sebelum PMK 136/2024 (s.d. Des 2024)',
    newHeader: 'PMK Nomor 136 Tahun 2024 (1 Jan 2025–Kini)',
    rows: [
      {
        aspek: 'Tarif efektif minimum perusahaan multinasional >= EUR 750M',
        aturanLama: 'Dapat mencapai 0% jika menerima Tax Holiday 100%',
        aturanBaru: 'Minimal 15% efektif; selisih ditarik via Pajak Tambahan (QDMTT)',
      },
      {
        aspek: 'Jadwal penerapan instrumen GloBE di Indonesia',
        aturanLama: 'Belum diadopsi dalam peraturan domestik',
        aturanBaru: 'IIR & DMTT/QDMTT berlaku 2025; UTPR berlaku mulai 2026',
      },
    ],
  },
  caseExample: {
    title: 'Anak usaha multinasional penerima Tax Holiday dengan laba GloBE Rp 100 M (ETR 0%)',
    scenario:
      'Entitas grup multinasional beromzet global > EUR 750 juta di Indonesia membukukan laba fiskal/GloBE Rp 100 miliar dengan ETR domestik 0% akibat fasilitas pembebasan pajak. Melalui QDMTT PMK 136/2024 terutang Top-Up Tax 15% = Rp 15 miliar.',
    presetRegime: 'badan_gmt_pmk136_2024',
    presetInput: {
      pph_badan: {
        peredaranBrutoTahunan: 15000000000000,
        penghasilanKenaPajak: 100000000000,
        isTbk: false,
        etrSetelahInsentifPersen: 0,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const badanGmtPmk136_2024Rule: TaxRuleModule<TaxCalculatorInput['pph_badan']> = {
  regime,
  article,
  calculate(input) {
    const labaGlobe = Math.max(0, input.penghasilanKenaPajak);
    const currentEtr = Math.min(30, Math.max(0, input.etrSetelahInsentifPersen ?? 0));
    const pphDomestik = Math.round((labaGlobe * currentEtr) / 100);
    const topUpRate = Math.max(0, TARIF_MIN_GLOBAL - currentEtr);
    const topUpTax = Math.round((labaGlobe * topUpRate) / 100);
    const totalBebanPajak = pphDomestik + topUpTax;
    const finalEtr = labaGlobe > 0 ? (totalBebanPajak / labaGlobe) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Laba GloBE / Penghasilan Kena Pajak entitas di Indonesia', value: labaGlobe },
      { label: 'Tarif Pajak Efektif (ETR) setelah insentif domestik', value: currentEtr, format: 'percent' },
      { label: 'PPh Badan domestik sebelum Top-Up Tax', value: pphDomestik },
      {
        label: 'Tarif Pajak Tambahan QDMTT (15% - ETR domestik)',
        formula: topUpRate > 0 ? `15% - ${formatPersen(currentEtr)} = ${formatPersen(topUpRate)}` : '0% (ETR sudah >= 15%)',
        value: topUpRate,
        format: 'percent',
      },
      {
        label: 'Pajak Tambahan Minimum Domestik (QDMTT) PMK 136/2024',
        formula: `${formatRupiah(labaGlobe)} x ${formatPersen(topUpRate)}`,
        value: topUpTax,
        isHighlight: true,
      },
      { label: 'Total beban PPh Badan + QDMTT di Indonesia', value: totalBebanPajak },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Tambahan Minimum Domestik (QDMTT)',
      primaryTaxAmount: topUpTax,
      annualTaxLabel: 'Total Pajak (PPh Domestik + QDMTT)',
      annualTaxAmount: totalBebanPajak,
      effectiveRatePercent: finalEtr,
      takeHomeOrNetLabel: 'Laba Bersih Entitas Setelah GMT 15%',
      takeHomeOrNetAmount: Math.max(0, labaGlobe - totalBebanPajak),
      steps,
      notes: [
        `PMK 136/2024 hanya berlaku bagi entitas konstituen grup multinasional dengan pendapatan konsolidasi global minimal EUR ${BATAS_KONSOLIDASI_GMT_EUR.toLocaleString('id-ID')} (~Rp 12–13 triliun). Perusahaan domestik di bawah ambang tersebut tetap menikmati tarif dan Tax Holiday normal.`,
        'Dalam implementasi penuh, laba GloBE dapat dikurangi Substance-based Income Exclusion (SBIE — persentase gaji dan aset berwujud) sebelum dikali persentase Top-Up Tax.',
      ],
    };
  },
};
