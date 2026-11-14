import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph25_pmk9_2021',
  taxType: 'pph25',
  name: 'PMK 86/2020 jo. PMK 9/2021 (Insentif Diskon 50%)',
  shortName: '2020–2021 (Diskon 50%)',
  legalBasis: 'PMK Nomor 86/PMK.03/2020 stdd PMK 110/2020 & PMK 9/PMK.03/2021',
  effectivePeriod: 'Masa Pajak Agustus 2020 – Desember 2021',
  isCurrent: false,
  summary:
    'Insentif pemulihan ekonomi nasional (PEN) berupa pengurangan besarnya angsuran PPh Pasal 25 sebesar 50% (sebelumnya 30% di PMK 23/2020 & PMK 44/2020) bagi KLU terdampak.',
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
        label: 'Pengurangan angsuran PPh 25 (50%) — PMK 86/2020 jo. PMK 9/2021',
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
        'Insentif pengurangan angsuran PPh Pasal 25 sebesar 50% berlaku bagi Wajib Pajak pada klasifikasi lapangan usaha (KLU) tertentu, WP KITE, atau WP Kawasan Berikat setelah menyampaikan pemberitahuan ke DJP.',
        'Pengurangan PPh 25 ini bukan merupakan pajak ditanggung pemerintah (DTP), sehingga kekurangan bayar tetap diperhitungkan pada SPT Tahunan.',
      ],
    };
  },
};
