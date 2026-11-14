import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'meterai_uu13_1985',
  taxType: 'bea_meterai',
  name: 'UU Nomor 13 Tahun 1985 (Tarif Awal)',
  shortName: '1986–1995 (Rp 500 / Rp 1rb)',
  legalBasis: 'Pasal 2 ayat (2) & (3) UU Nomor 13 Tahun 1985 tentang Bea Meterai',
  effectivePeriod: '1 Januari 1986 – 20 April 1995',
  isCurrent: false,
  summary:
    'Tarif perdana UU 13/1985: dokumen nominal s.d. Rp 100 ribu bebas meterai, > Rp 100 ribu s.d. Rp 1 juta dikenai Rp 500, dan di atas Rp 1 juta dikenai Rp 1.000.',
};

export const beaMeteraiUu13_1985Rule: TaxRuleModule<TaxCalculatorInput['bea_meterai']> = {
  regime,
  calculate(input) {
    const nilaiDokumen = Math.max(0, input.nilaiDokumen);
    const jumlahDokumen = Math.max(0, Math.round(input.jumlahDokumen));

    let tarifPerDokumen = 0;
    let tierFormula = 'Nominal s.d. Rp 100.000 -> Bebas Bea Meterai';

    if (nilaiDokumen > 1000000) {
      tarifPerDokumen = 1000;
      tierFormula = 'Nominal > Rp 1.000.000 -> Tarif Rp 1.000 / dokumen';
    } else if (nilaiDokumen > 100000) {
      tarifPerDokumen = 500;
      tierFormula = 'Nominal > Rp 100.000 s.d. Rp 1.000.000 -> Tarif Rp 500 / dokumen';
    }

    const totalBeaMeterai = tarifPerDokumen * jumlahDokumen;
    const effectiveRate =
      nilaiDokumen > 0 && jumlahDokumen > 0 ? (totalBeaMeterai / nilaiDokumen) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Nilai nominal uang tercantum pada dokumen', value: nilaiDokumen },
      { label: 'Lapisan tarif awal UU 13/1985', formula: tierFormula, value: tarifPerDokumen },
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
        'UU Nomor 13 Tahun 1985 merupakan reformasi Bea Meterai yang menggantikan Aturan Bea Meterai 1921 (Zegelverordening) dan menyederhanakan tarif hanya menjadi Rp 500 serta Rp 1.000.',
      ],
    };
  },
};
