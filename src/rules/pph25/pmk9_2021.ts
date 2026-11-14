import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph25_pmk9_2021',
  taxType: 'pph25',
  name: 'PMK 110/2020, PMK 9/2021 & PMK 82/2021 (Diskon 50%)',
  shortName: 'Jul 2020–Des 2021 (Diskon 50%)',
  legalBasis:
    'PMK 86/2020 stdd PMK 110/2020 (Jul–Des 2020), PMK 9/2021 (Jan–Jun 2021) & PMK 82/2021 (Jul–Des 2021)',
  effectivePeriod: 'Masa Pajak Juli 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Insentif pengurangan angsuran PPh Pasal 25 sebesar 50% bagi KLU terdampak pandemi: naik dari 30% menjadi 50% mulai Masa Pajak Juli 2020 (PMK 110/2020), berlanjut Jan–Jun 2021 (PMK 9/2021), hingga Jul–Des 2021 (PMK 82/2021).',
};

export const pph25Pmk9_2021Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  calculate(input) {
    const pphTerutang = Math.max(0, input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);
    const pembagi = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));

    const dasarAngsuran = Math.max(0, pphTerutang - kreditPajak);
    const angsuranNormal = Math.round(dasarAngsuran / pembagi);
    const diskonInsentif = Math.round(angsuranNormal * 0.5);
    const angsuranDibayar = angsuranNormal - diskonInsentif;
    const totalSetahun = angsuranDibayar * pembagi;
    const effectiveRate = pphTerutang > 0 ? (totalSetahun / pphTerutang) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'PPh terutang menurut SPT Tahunan tahun lalu', value: pphTerutang },
      { label: 'Kredit pajak (PPh 21/22/23/24)', value: -kreditPajak, isNegative: true },
      {
        label: `Angsuran PPh 25 normal per bulan (÷ ${pembagi} bulan)`,
        formula: `${formatRupiah(dasarAngsuran)} ÷ ${pembagi}`,
        value: angsuranNormal,
      },
      {
        label: 'Pengurangan angsuran PPh 25 (50%) — PMK 110/2020, 9/2021 & 82/2021',
        formula: `50% x ${formatRupiah(angsuranNormal)}`,
        value: -diskonInsentif,
        isNegative: true,
      },
      {
        label: 'Angsuran PPh 25 wajib disetor per bulan',
        formula: `${formatRupiah(angsuranNormal)} - ${formatRupiah(diskonInsentif)}`,
        value: angsuranDibayar,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh 25 Dibayar per Bulan (Setelah Diskon 50%)',
      primaryTaxAmount: angsuranDibayar,
      annualTaxLabel: `Total Cicilan PPh 25 (${pembagi} Bulan)`,
      annualTaxAmount: totalSetahun,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Penghematan Kas Angsuran per Bulan',
      takeHomeOrNetAmount: diskonInsentif,
      steps,
      notes: [
        'Diskon 50% berlaku mulai Masa Pajak Juli 2020 (PMK 110/2020 yang menaikkan diskon 30% dari PMK 86/2020), diperpanjang Jan–Jun 2021 (PMK 9/2021), lalu disambung Jul–Des 2021 (PMK 82/2021) untuk KLU tertentu.',
        'Pengurangan PPh 25 ini bukan merupakan pajak ditanggung pemerintah (DTP), sehingga kekurangan bayar tetap diperhitungkan pada SPT Tahunan.',
      ],
    };
  },
};
