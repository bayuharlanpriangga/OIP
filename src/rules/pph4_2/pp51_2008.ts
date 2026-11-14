import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph4_2_pp51_2008',
  taxType: 'pph4_2',
  name: 'PP 51/2008, PP 5/2002 & PP 71/2008',
  shortName: '2008–2021 (PP 51/2008)',
  legalBasis: 'PP 51/2008 jo. PP 40/2009 (Konstruksi), PP 5/2002 (Sewa), & PP 71/2008 (PHTB)',
  effectivePeriod: '1 Januari 2008 – 20 Februari 2022',
  isCurrent: false,
  summary:
    'Skema historis PPh Final Pasal 4(2): konstruksi ber-SBU 2%/3%/4%, sewa tanah/bangunan 10%, serta pengalihan hak tanah/bangunan 5% sebelum turun ke 2,5% pada 2016.',
};

function getOldPph4_2Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return { rate: 10, label: 'Persewaan tanah/bangunan — PP 5/2002 (10%)' };
    case 'konstruksi_kecil':
      return { rate: 2, label: 'Pekerjaan konstruksi SBU Kecil — PP 51/2008 (2%)' };
    case 'konstruksi_menengah_besar':
      return { rate: 3, label: 'Pekerjaan konstruksi SBU Menengah/Besar — PP 51/2008 (3%)' };
    case 'konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Pekerjaan konstruksi tanpa SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 4, label: 'Jasa konsultansi konstruksi ber-SBU — PP 51/2008 (4%)' };
    case 'pengalihan_tanah_bangunan':
      return { rate: 5, label: 'Pengalihan hak tanah/bangunan — PP 71/2008 (5%)' };
  }
}

export const pph4_2Pp51_2008Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getOldPph4_2Meta(input.objectType);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2) era lama', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) terutang',
        formula: `${formatRupiah(nilaiBruto)} x ${formatPersen(meta.rate)}`,
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Pasal 4(2) Terutang',
      primaryTaxAmount: pphFinal,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilaiBruto - pphFinal),
      steps,
      notes: [
        'Dibanding rezim terkini (PP 9/2022 & PP 34/2016), tarif konstruksi ber-SBU lebih tinggi (2%/3%/4%) dan tarif pengalihan hak tanah/bangunan sebelumnya sebesar 5%.',
      ],
    };
  },
};
