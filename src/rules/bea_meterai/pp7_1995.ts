import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'meterai_pp7_1995',
  taxType: 'bea_meterai',
  name: 'UU 13/1985 & PP Nomor 7 Tahun 1995',
  shortName: '1995–2000 (Rp 1rb / Rp 2rb)',
  legalBasis: 'UU Nomor 13 Tahun 1985 & PP Nomor 7 Tahun 1995',
  effectivePeriod: '21 April 1995 – 30 April 2000',
  isCurrent: false,
  summary:
    'Penyesuaian pertama tarif Bea Meterai: bebas s.d. Rp 250 ribu, tarif Rp 1.000 untuk > Rp 250 ribu s.d. Rp 1 juta, dan tarif Rp 2.000 untuk nominal di atas Rp 1 juta.',
};

export const beaMeteraiPp7_1995Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 250.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 2000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 2.000 / dokumen';
    } else if (nilaiDokumen > 250000) {
      tarifPerDokumen = 1000;
      tierFormula = 'Nominal > Rp 250.000 s.d. Rp 1.000.000 -> Tarif Rp 1.000 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif PP 7/1995', formula: tierFormula, value: tarifPerDokumen },
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
        'PP 7/1995 menaikkan batas bebas dokumen nominal uang dari Rp 100 ribu menjadi Rp 250 ribu dan menaikkan tarif menjadi Rp 1.000 / Rp 2.000 sebelum naik lagi ke Rp 3.000 / Rp 6.000 di PP 24/2000.',
      ],
    };
  },
};
