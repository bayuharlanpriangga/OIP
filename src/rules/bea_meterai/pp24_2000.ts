import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'meterai_pp24_2000',
  taxType: 'bea_meterai',
  name: 'UU 13/1985 & PP Nomor 24 Tahun 2000',
  shortName: '2000–2020 (Rp 3rb / Rp 6rb)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 24 Tahun 2000',
  effectivePeriod: '1 Mei 2000 – 31 Desember 2020',
  isCurrent: false,
  summary:
    'Skema historis Bea Meterai bertingkat: bebas s.d. Rp 250 ribu, tarif Rp 3.000 untuk > Rp 250 ribu s.d. Rp 1 juta, dan tarif Rp 6.000 untuk nominal di atas Rp 1 juta.',
};

export const beaMeteraiPp24_2000Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 250.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 6000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 6.000 / dokumen';
    } else if (nilaiDokumen > 250000) {
      tarifPerDokumen = 3000;
      tierFormula = 'Nominal > Rp 250.000 s.d. Rp 1.000.000 -> Tarif Rp 3.000 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif PP 24/2000', formula: tierFormula, value: tarifPerDokumen },
      {
        label: `Total Bea Meterai (${jumlahDokumen} dokumen)`,
        formula: `${formatRupiah(tarifPerDokumen)} x ${jumlahDokumen} dok`,
        value: totalBeaMeterai,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total Bea Meterai Terutang',
      primaryTaxAmount: totalBeaMeterai,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Tarif Satuan per Dokumen',
      takeHomeOrNetAmount: tarifPerDokumen,
      steps,
      notes: [
        'Pada era PP 24/2000, dokumen dengan nilai di atas Rp 1 juta hingga Rp 5 juta sudah dikenai Bea Meterai Rp 6.000, sedangkan sejak 2021 dibebaskan di UU 10/2020.',
      ],
    };
  },
};
