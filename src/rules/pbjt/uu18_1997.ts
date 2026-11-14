import {
  CalculationStep,
  PbjtSectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbjt_uu18_1997',
  taxType: 'pbjt',
  name: 'UU Nomor 18 Tahun 1997 jo. PP 19/1997',
  shortName: '1997–2000 (UU 18/1997)',
  legalBasis: 'UU Nomor 18 Tahun 1997 tentang Pajak Daerah & Retribusi Daerah jo. PP 19/1997',
  effectivePeriod: '23 Mei 1997 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Undang-undang pajak daerah pertama yang menyatukan Pajak Hotel dan Restoran (maks 10%), Pajak Hiburan (maks 35%), serta Pajak Penerangan Jalan (maks 10%), sebelum Pajak Parkir ditambah di UU 34/2000.',
  sources: [SRC.UU_18_1997, SRC.PP_19_1997, SRC.UU_34_2000],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbjt-uu18-1997',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT (Pajak Daerah)',
  title: 'UU 18/1997: Fondasi Pajak Hotel, Restoran, Hiburan, dan PPJ sebelum Era PBJT',
  legalBasis: 'UU Nomor 18 Tahun 1997 & PP Nomor 19 Tahun 1997',
  effectiveDate: '23 Mei 1997',
  readMinutes: 3,
  summary:
    'Mengulas struktur pajak konsumsi daerah pertama di bawah UU 18/1997 (sebelum pemekaran Pajak Parkir di UU 34/2000, tarif hiburan 75% di UU PDRD 2009, dan penyatuan PBJT 10% di UU HKPD 2022).',
  sections: [
    {
      heading: 'Penataan jenis pajak daerah di UU 18/1997',
      paragraphs: [
        'UU Nomor 18 Tahun 1997 menyederhanakan pajak daerah di Indonesia menjadi jenis pajak yang terstandar secara nasional. Untuk pajak konsumsi tingkat kabupaten/kota (Dati II), UU 18/1997 mengatur Pajak Hotel dan Restoran dalam satu jenis pajak (batas atas 10%), Pajak Hiburan (batas atas 35%), dan Pajak Penerangan Jalan (batas atas 10%).',
        'Pada masa berlakunya UU 18/1997, Pajak Parkir belum menjadi pajak daerah otonom tersendiri (baru dipisahkan bersama pemecahan Pajak Hotel dan Pajak Restoran pada UU 34/2000).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 18/1997 (1997–2000)',
    newHeader: 'UU 34/2000 & HKPD (2001–Kini)',
    rows: [
      {
        aspek: 'Pajak Hotel & Restoran',
        aturanLama: 'Digabung sebagai Pajak Hotel & Restoran (maks 10%)',
        aturanBaru: 'Dipisah di UU 34/2000, lalu disatukan ke PBJT maks 10% (HKPD)',
      },
      {
        aspek: 'Pajak Parkir',
        aturanLama: 'Belum ada sebagai pajak daerah otonom (berupa retribusi)',
        aturanBaru: 'Maks 20% (UU 34/2000) -> 30% (PDRD) -> maks 10% (HKPD)',
      },
      {
        aspek: 'Pajak Hiburan',
        aturanLama: 'Batas maksimal umum 35%',
        aturanBaru: 'Naik ke 75% hiburan khusus (PDRD), lalu 40%–75% khusus di HKPD',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi tagihan restoran/hotel di era UU 18/1997',
    scenario:
      'Konsumsi restoran sebesar Rp 500.000 dikenai Pajak Hotel dan Restoran batas maksimal 10% menurut UU 18/1997.',
    presetRegime: 'pbjt_uu18_1997',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 500000,
        sectorType: 'makanan_minuman',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getUu18SectorMeta(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
    case 'perhotelan':
      return { rate: 10, label: 'Pajak Hotel & Restoran — UU 18/1997 & PP 19/1997 (maks 10%)' };
    case 'parkir':
      return {
        rate: 0,
        label: 'Pajak Parkir belum ada sebagai pajak daerah di UU 18/1997 (baru lahir di UU 34/2000)',
      };
    case 'hiburan_umum':
    case 'hiburan_khusus':
      return { rate: 35, label: 'Pajak Hiburan — UU 18/1997 & PP 19/1997 (maks 35%)' };
    case 'tenaga_listrik':
      return { rate: 10, label: 'Pajak Penerangan Jalan (PPJ) — UU 18/1997 (maks 10%)' };
  }
}

export const pbjtUu18_1997Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getUu18SectorMeta(input.sectorType);
    const pajakDaerah = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan pajak daerah', value: nilaiTransaksi },
      { label: 'Batas tarif maksimal UU 18/1997', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak konsumsi daerah terutang',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pajakDaerah,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Daerah Terutang (Batas Maks UU 18/1997)',
      primaryTaxAmount: pajakDaerah,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pajakDaerah,
      steps,
      notes: [
        'Dalam UU 18/1997 (1997–2000), Pajak Hotel dan Pajak Restoran masih digabung menjadi satu jenis pajak dengan tarif maksimal 10%, sedangkan Pajak Parkir baru diperkenalkan sebagai pajak daerah tersendiri dalam UU 34/2000.',
      ],
    };
  },
};
