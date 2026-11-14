import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_23_2020, SRC.PMK_44_2020, SRC.PMK_86_2020, SRC.PMK_110_2020, SRC.PMK_9_2021];

const regime: TaxRegime = {
  id: 'pph25_pmk23_2020',
  taxType: 'pph25',
  name: 'PMK 23/2020, PMK 44/2020 & PMK 110/2020 (Diskon PPh 25 30% -> 50%)',
  shortName: 'Apr 2020–Des 2021 (Diskon 30%–50%)',
  legalBasis: 'PMK 23/PMK.03/2020 (30%), PMK 44/2020 (30%), & PMK 110/2020 (50%)',
  effectivePeriod: 'Masa Pajak April 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Tahap awal pengurangan angsuran PPh Pasal 25 pandemi COVID-19 sebelum rezim PMK 9/2021: dimulai dari pengurangan 30% melalui PMK 23/2020 (102 KLU manufaktur & KITE), diperluas lewat PMK 44/2020 dan PMK 86/2020 (846–1.013 KLU), lalu dinaikkan menjadi pengurangan 50% mulai masa Agustus 2020 lewat PMK 110/2020.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph25-pmk23-2020',
  taxType: 'pph25',
  taxTypeLabel: 'PPh Pasal 25',
  title: 'Evolusi Diskon Angsuran PPh Pasal 25 Pandemi 2020: Dari 30% (PMK 23/2020) ke 50% (PMK 110/2020)',
  legalBasis: 'PMK 23/PMK.03/2020, PMK 44/PMK.03/2020, PMK 86/PMK.03/2020 & PMK 110/PMK.03/2020',
  effectiveDate: 'Masa Pajak April 2020 (Kenaikan Diskon 50% Agustus 2020)',
  readMinutes: 4,
  summary:
    'Menelusuri stimulus pengurangan angsuran PPh Pasal 25 sepanjang tahun pajak 2020: diskon awal 30% pada PMK 23/2020 & PMK 44/2020 sebelum diperbesar menjadi 50% sejak Agustus 2020 lewat PMK 110/PMK.03/2020.',
  sections: [
    {
      heading: 'Kenaikan pengurangan dari 30% menjadi 50% pada Agustus 2020',
      paragraphs: [
        'Untuk menjaga arus kas (cash flow) dunia usaha selama pembatasan sosial 2020, pemerintah merilis PMK 23/PMK.03/2020 yang memangkas angsuran PPh Pasal 25 sebesar 30% untuk 102 KLU industri manufaktur dan perusahaan KITE mulai masa pajak April 2020, yang segera diperluas ke 846 KLU (PMK 44/2020) lalu 1.013 KLU (PMK 86/2020).',
        'Karena tekanan ekonomi berlanjut pada kuartal III 2020, melalui PMK 110/PMK.03/2020 pemerintah memperbesar pengurangan angsuran PPh Pasal 25 dari 30% menjadi 50% terhitung mulai masa pajak Agustus 2020, dan diskon 50% ini kemudian dipertahankan sepanjang tahun 2021 melalui PMK 9/2021 jo. PMK 82/2021.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PMK 23/2020 & PMK 44/2020 (Apr–Jul 2020)',
    newHeader: 'PMK 110/2020 (Ags–Des 2020)',
    rows: [
      {
        aspek: 'Persentase pengurangan angsuran PPh 25',
        aturanLama: '30% dari angsuran PPh Pasal 25 yang seharusnya terutang',
        aturanBaru: '50% dari angsuran PPh Pasal 25 yang seharusnya terutang',
      },
      {
        aspek: 'Persentase angsuran wajib disetor perusahaan',
        aturanLama: '70% dari angsuran normal',
        aturanBaru: '50% dari angsuran normal',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan diskon awal 30% (PMK 23/2020) atas PPh kurang bayar Rp 240 juta',
    scenario:
      'Perusahaan manufaktur dengan PPh terutang Rp 300.000.000 dan kredit pajak Rp 60.000.000 (angsuran normal Rp 20.000.000/bulan) memanfaatkan pengurangan awal 30% berdasarkan PMK 23/2020 sehingga hanya menyetor Rp 14.000.000/bulan.',
    presetRegime: 'pph25_pmk23_2020',
    presetInput: {
      pph25: {
        pphTerutangTahunLalu: 300000000,
        kreditPajakTahunLalu: 60000000,
        bulanBerjalan: 12,
        diskonPandemiPersen: 30,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph25Pmk23_2020Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  article,
  calculate(input) {
    const pphTerutang = Math.max(0, input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);
    const pembagi = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));
    const diskonPersen = input.diskonPandemiPersen === 50 ? 50 : 30;

    const dasarAngsuranTahunan = Math.max(0, pphTerutang - kreditPajak);
    const angsuranNormal = Math.round(dasarAngsuranTahunan / pembagi);
    const potonganInsentif = Math.round((angsuranNormal * diskonPersen) / 100);
    const angsuranDibayar = Math.max(0, angsuranNormal - potonganInsentif);

    const steps: CalculationStep[] = [
      { label: 'PPh terutang menurut SPT Tahunan tahun pajak lalu', value: pphTerutang },
      { label: 'Kredit pajak tahun lalu (PPh 21, 22, 23, 24)', value: -kreditPajak, isNegative: true },
      { label: 'Dasar penghitungan angsuran tahun berjalan', value: dasarAngsuranTahunan },
      { label: `Angsuran PPh 25 normal per bulan (÷ ${pembagi} bln)`, value: angsuranNormal },
      {
        label: `Pengurangan PPh Pasal 25 ${formatPersen(diskonPersen)} (${diskonPersen === 30 ? 'PMK 23/44/86 Tahun 2020' : 'PMK 110/2020'})`,
        value: -potonganInsentif,
        isNegative: true,
      },
      { label: 'Angsuran PPh 25 wajib disetor masa berjalan', value: angsuranDibayar, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: `Angsuran PPh 25 Disetor (Diskon ${diskonPersen}%)`,
      primaryTaxAmount: angsuranDibayar,
      annualTaxLabel: 'Proyeksi Setoran 12 Bulan Masa Insentif',
      annualTaxAmount: angsuranDibayar * 12,
      effectiveRatePercent: angsuranNormal > 0 ? (angsuranDibayar / angsuranNormal) * 100 : 0,
      effectiveRateLabel: 'Porsi angsuran yang disetor',
      takeHomeOrNetLabel: 'Penghematan Arus Kas Bulanan',
      takeHomeOrNetAmount: potonganInsentif,
      steps,
      notes: [
        `Diskon ${diskonPersen}% hanya mengurangi cicilan bulanan (angsuran PPh 25), bukan pengurangan tarif PPh Badan tahunan; pada akhir tahun PPh terutang dihitung normal dan diselisihkan (Pasal 29).`,
      ],
    };
  },
};
