import {
  CalculationStep,
  PbjtSectorType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

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
