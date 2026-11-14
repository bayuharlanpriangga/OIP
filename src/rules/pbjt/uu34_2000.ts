import {
  CalculationStep,
  PbjtSectorType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pbjt_uu34_2000',
  taxType: 'pbjt',
  name: 'UU Nomor 34 Tahun 2000 jo. PP 65/2001',
  shortName: '2001–2009 (UU 34/2000)',
  legalBasis: 'UU Nomor 34 Tahun 2000 tentang Pajak Daerah & PP Nomor 65 Tahun 2001',
  effectivePeriod: '1 Januari 2001 – 31 Desember 2009',
  isCurrent: false,
  summary:
    'Aturan otonomi daerah generasi pertama atas pajak konsumsi daerah: Hotel (maks 10%), Restoran (maks 10%), Hiburan (maks 35%), Penerangan Jalan (maks 10%), dan Parkir (maks 20% sesuai PP 65/2001).',
};

function getUu34SectorMeta(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
      return { rate: 10, label: 'Pajak Restoran — UU 34/2000 & PP 65/2001 (maks 10%)' };
    case 'perhotelan':
      return { rate: 10, label: 'Pajak Hotel — UU 34/2000 & PP 65/2001 (maks 10%)' };
    case 'parkir':
      return { rate: 20, label: 'Pajak Parkir — PP 65/2001 (batas maks 20%)' };
    case 'hiburan_umum':
      return { rate: 35, label: 'Pajak Hiburan — UU 34/2000 & PP 65/2001 (batas maks 35%)' };
    case 'hiburan_khusus':
      return {
        rate: 35,
        label: 'Pajak Hiburan era PP 65/2001 (batas umum maks 35%, sebelum tarif khusus 75% di PDRD)',
      };
    case 'tenaga_listrik':
      return { rate: 10, label: 'Pajak Penerangan Jalan (PPJ) — PP 65/2001 (maks 10%)' };
  }
}

export const pbjtUu34_2000Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getUu34SectorMeta(input.sectorType);
    const pajakDaerah = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan pajak daerah', value: nilaiTransaksi },
      { label: 'Batas tarif maksimal PP 65/2001', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'Pajak konsumsi daerah terutang',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pajakDaerah,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Pajak Daerah Terutang (Batas Maks PP 65/2001)',
      primaryTaxAmount: pajakDaerah,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pajakDaerah,
      steps,
      notes: [
        'Pada PP 65/2001 (pelaksana UU 34/2000), batas atas Pajak Parkir adalah 20% dan Pajak Hiburan dibatasi maksimal 35% sebelum dinaikkan di UU PDRD 28/2009 menjadi 30% (parkir) dan 75% (hiburan khusus).',
      ],
    };
  },
};
