import {
  CalculationStep,
  PbjtSectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbjt_pdrd_2009',
  taxType: 'pbjt',
  name: 'UU Nomor 28 Tahun 2009 (PDRD)',
  shortName: '2010–2023 (UU PDRD)',
  legalBasis: 'UU Nomor 28 Tahun 2009 tentang Pajak Daerah dan Retribusi Daerah',
  effectivePeriod: '1 Januari 2010 – 4 Januari 2024',
  isCurrent: false,
  summary:
    'Lima jenis pajak konsumsi daerah yang terpisah: Pajak Hotel (maks 10%), Restoran (maks 10%), Parkir (maks 30%), Hiburan umum (maks 35%) & khusus (maks 75%), dan Penerangan Jalan (maks 10%).',
  sources: [SRC.UU_28_2009_PDRD, SRC.UU_1_2022_HKPD],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pbjt-pdrd-2009',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'UU PDRD 28/2009: Tarif Parkir Maksimal 30% dan Hiburan Khusus 75% Sebelum PBJT',
  legalBasis: 'UU Nomor 28 Tahun 2009 tentang Pajak Daerah dan Retribusi Daerah',
  effectiveDate: '1 Januari 2010',
  readMinutes: 4,
  summary:
    'Mengatur lima pajak konsumsi daerah secara terpisah sebelum dilebur ke dalam PBJT UU HKPD, dengan plafon Pajak Parkir hingga 30% dan Pajak Hiburan khusus hingga 75%.',
  sections: [
    {
      heading: 'Pemisahan lima objek pajak konsumsi dan plafon tarif tinggi',
      paragraphs: [
        'Sebelum disatukan ke dalam Pajak Barang dan Jasa Tertentu (PBJT) di bawah UU HKPD pada Januari 2024, UU Nomor 28 Tahun 2009 (PDRD) mengatur Pajak Hotel, Pajak Restoran, Pajak Hiburan, Pajak Penerangan Jalan (PPJ), dan Pajak Parkir sebagai lima jenis pajak terpisah.',
        'Pada masa ini, batas maksimal tarif Pajak Parkir dinaikkan dari 20% (UU 34/2000) menjadi paling tinggi 30%, sedangkan untuk penyelenggaraan hiburan malam seperti diskotek, karaoke, kelab malam, dan spa diperbolehkan tarif hingga 75% (hiburan umum seperti bioskop dan konser tetap maksimal 35%).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (2010–2023)',
    newHeader: 'UU HKPD 1/2022 (2024–Kini)',
    rows: [
      {
        aspek: 'Batas maksimal Pajak / PBJT Parkir',
        aturanLama: 'Maksimal 30%',
        aturanBaru: 'Maksimal 10%',
      },
      {
        aspek: 'Hiburan umum (bioskop, konser, tontonan)',
        aturanLama: 'Maksimal 35%',
        aturanBaru: 'Maksimal 10%',
      },
    ],
  },
  caseExample: {
    title: 'Pendapatan parkir gedung Rp 10 juta dengan batas maksimal PDRD 30%',
    scenario:
      'Dengan dasar pengenaan Rp 10.000.000 di daerah yang menerapkan plafon tertinggi Pajak Parkir UU PDRD (30%), pajak daerah terutang mencapai Rp 3.000.000 (tiga kali batas 10% UU HKPD).',
    presetRegime: 'pbjt_pdrd_2009',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 10000000,
        sectorType: 'parkir',
      },
    },
  },
};

function getPdrdSectorMeta(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
      return { rate: 10, label: 'Pajak Restoran — UU PDRD (batas maks 10%)' };
    case 'perhotelan':
      return { rate: 10, label: 'Pajak Hotel — UU PDRD (batas maks 10%)' };
    case 'parkir':
      return { rate: 30, label: 'Pajak Parkir — UU PDRD (batas maks 30%)' };
    case 'hiburan_umum':
      return { rate: 35, label: 'Pajak Hiburan Umum — UU PDRD (batas maks 35%)' };
    case 'hiburan_khusus':
      return {
        rate: 75,
        label: 'Pajak Hiburan khusus (diskotek/kelab/spa) — batas maks 75%',
      };
    case 'tenaga_listrik':
      return { rate: 10, label: 'Pajak Penerangan Jalan (PPJ) umum — batas maks 10%' };
  }
}

export const pbjtPdrd2009Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getPdrdSectorMeta(input.sectorType);
    const pajakDaerah = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan pajak daerah', value: nilaiTransaksi },
      { label: 'Batas tarif maksimal UU PDRD 28/2009', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak konsumsi daerah terutang',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pajakDaerah,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Daerah Terutang (Batas Maks PDRD)',
      primaryTaxAmount: pajakDaerah,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pajakDaerah,
      steps,
      notes: [
        'Dibandingkan UU HKPD, UU PDRD 28/2009 mengizinkan batas maksimal jauh lebih tinggi untuk Pajak Parkir (30% vs 10%) dan Pajak Hiburan umum (35% vs 10%).',
      ],
    };
  },
};
