import { CalculationStep, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph25_pmk215_2018',
  taxType: 'pph25',
  name: 'PMK 215/PMK.03/2018 & KEP-537/PJ./2000',
  shortName: '2018–2024 (PMK 215/2018)',
  legalBasis: 'PMK Nomor 215/PMK.03/2018 & KEP-537/PJ./2000',
  effectivePeriod: '31 Desember 2018 – 31 Desember 2024',
  isCurrent: false,
  summary:
    'Ketentuan penghitungan angsuran PPh Pasal 25 bagi Wajib Pajak reguler serta penetapan angsuran Wajib Pajak baru, bank, BUMN/BUMD, dan emiten sebelum PMK 81/2024.',
};

export const pph25Pmk215_2018Rule: TaxRuleModule<TaxCalculatorInput['pph25']> = {
  regime,
  calculate(input) {
    const pphTerutang = Math.max(0, input.pphTerutangTahunLalu);
    const kreditPajak = Math.max(0, input.kreditPajakTahunLalu);
    const pembagi = Math.min(12, Math.max(1, Math.round(input.bulanBerjalan || 12)));

    const dasarAngsuran = Math.max(0, pphTerutang - kreditPajak);
    const angsuranBulanan = Math.round(dasarAngsuran / pembagi);
    const totalSetahun = angsuranBulanan * pembagi;
    const effectiveRate = pphTerutang > 0 ? (totalSetahun / pphTerutang) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'PPh terutang SPT Tahunan tahun lalu', value: pphTerutang },
      { label: 'Kredit pajak (PPh 21/22/23/24)', value: -kreditPajak, isNegative: true },
      { label: 'Dasar angsuran tahunan', value: dasarAngsuran },
      {
        label: `Angsuran PPh 25 per bulan (÷ ${pembagi} bulan)`,
        formula: `${formatRupiah(dasarAngsuran)} ÷ ${pembagi}`,
        value: angsuranBulanan,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Angsuran PPh Pasal 25 per Bulan',
      primaryTaxAmount: angsuranBulanan,
      annualTaxLabel: `Total Cicilan PPh 25 (${pembagi} Bulan)`,
      annualTaxAmount: totalSetahun,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Porsi PPh Ditutup Kredit Pajak',
      takeHomeOrNetAmount: Math.min(pphTerutang, kreditPajak),
      steps,
      notes: [
        'Pada PMK 215/2018, WP Orang Pribadi Pengusaha Tertentu (OPPT) dikenai angsuran 0,75% dari peredaran bruto per tempat usaha apabila tidak memakai PPh Final UMKM.',
      ],
    };
  },
};
