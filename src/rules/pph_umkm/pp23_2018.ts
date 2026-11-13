import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';

const regime: TaxRegime = {
  id: 'umkm_pp23_2018',
  taxType: 'pph_umkm',
  name: 'PP 23 Tahun 2018',
  shortName: '2018–2021 (0,5% Penuh)',
  legalBasis: 'PP Nomor 23 Tahun 2018',
  effectivePeriod: '1 Juli 2018 – 31 Desember 2021',
  isCurrent: false,
  summary:
    'Tarif turun menjadi 0,5%, tetapi seluruh Wajib Pajak Orang Pribadi maupun Badan tetap dikenakan sejak Rupiah pertama tanpa batas bebas Rp 500 juta.',
};

export const umkmPp23_2018Rule: TaxRuleModule<TaxCalculatorInput['pph_umkm']> = {
  regime,
  calculate(input) {
    const omzetBulan = Math.max(0, input.omzetBulanan);
    const akumulasiPrev = Math.max(0, input.akumulasiOmzetSebelumnya);
    const tarif = 0.5;
    const taxAmount = Math.round((omzetBulan * tarif) / 100);
    const totalAkumulasi = akumulasiPrev + omzetBulan;
    const notes: string[] = [];

    if (totalAkumulasi > 4800000000) {
      notes.push(
        'Peringatan: Akumulasi omzet melebihi Rp 4,8 miliar dalam satu tahun pajak. Mulai tahun pajak berikutnya wajib memakai tarif umum.'
      );
    }

    const steps: CalculationStep[] = [
      { label: 'Omzet bruto bulan berjalan', value: omzetBulan },
      { label: 'Akumulasi omzet s.d. bulan sebelumnya', value: akumulasiPrev },
      { label: 'Dasar pengenaan PPh Final UMKM bulan ini', value: omzetBulan },
      { label: `Tarif PPh Final (${regime.shortName})`, value: tarif, format: 'percent' },
      { label: 'PPh Final UMKM terutang bulan ini', value: taxAmount, isHighlight: true },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final UMKM Bulan Ini',
      primaryTaxAmount: taxAmount,
      effectiveRatePercent: omzetBulan > 0 ? tarif : 0,
      takeHomeOrNetLabel: 'Sisa Omzet Setelah PPh Final',
      takeHomeOrNetAmount: Math.max(0, omzetBulan - taxAmount),
      steps,
      notes,
    };
  },
};
