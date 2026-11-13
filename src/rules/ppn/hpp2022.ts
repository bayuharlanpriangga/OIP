import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'ppn_hpp_2022',
  taxType: 'ppn',
  name: 'UU Nomor 7 Tahun 2021 (HPP)',
  shortName: '2022–2024 (11%)',
  legalBasis: 'Pasal 7 ayat (1) huruf a UU HPP',
  effectivePeriod: '1 April 2022 – 31 Desember 2024',
  isCurrent: false,
  summary:
    'Tarif tunggal 11% langsung atas seluruh Harga Jual atau Penggantian tanpa pembedaan DPP antara barang umum dan barang mewah.',
};

export const ppnHpp2022Rule: TaxRuleModule<TaxCalculatorInput['ppn']> = {
  regime,
  calculate(input) {
    const nominal = Math.max(0, input.hargaJualDpp);
    const rate = 11;

    const hargaJualBersih = input.termasukPpn ? Math.round(nominal / (1 + rate / 100)) : nominal;
    const ppnAmount = input.termasukPpn
      ? nominal - hargaJualBersih
      : Math.round((hargaJualBersih * rate) / 100);
    const totalFaktur = hargaJualBersih + ppnAmount;

    const steps: CalculationStep[] = [
      {
        label: 'Harga jual sebelum PPN',
        formula: input.termasukPpn
          ? `Diekstrak dari total termasuk PPN (${formatRupiah(nominal)})`
          : undefined,
        value: hargaJualBersih,
      },
      { label: 'Dasar Pengenaan Pajak (DPP)', formula: '100% x Harga Jual', value: hargaJualBersih },
      { label: 'Tarif PPN', formula: 'Tarif 11% x DPP', value: rate, format: 'percent' },
      { label: 'PPN terutang yang dipungut', value: ppnAmount, isHighlight: true },
      { label: 'Total nilai tagihan (Harga Jual + PPN)', value: totalFaktur },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPN Terutang',
      primaryTaxAmount: ppnAmount,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Total Nilai Faktur (Termasuk PPN)',
      takeHomeOrNetAmount: totalFaktur,
      steps,
      notes: [],
    };
  },
};
