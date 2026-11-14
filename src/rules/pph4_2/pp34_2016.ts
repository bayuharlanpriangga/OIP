import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph4_2_pp34_2016',
  taxType: 'pph4_2',
  name: 'PP 34/2016, PP 51/2008 & PP 34/2017',
  shortName: '2016–2022 (PP 34/2016)',
  legalBasis:
    'PP 34/2016 (PHTB 2,5% sejak 7 Sep 2016), PP 51/2008 (Konstruksi), & PP 34/2017 (Sewa T/B)',
  effectivePeriod: '7 September 2016 – 20 Februari 2022',
  isCurrent: false,
  summary:
    'Masa transisi setelah PP 34/2016 menurunkan PHTB umum menjadi 2,5% (dan PP 34/2017 mencabut PP 5/2002 pada 2018), sementara tarif konstruksi masih memakai PP 51/2008 (2%/3%/4%/6%).',
};

function getMidPph4_2Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return {
        rate: 10,
        label: 'Persewaan tanah/bangunan — PP 5/2002 lalu PP 34/2017 (10%)',
      };
    case 'konstruksi_kecil':
      return { rate: 2, label: 'Pekerjaan konstruksi SBU Kecil — PP 51/2008 (2%)' };
    case 'konstruksi_menengah_besar':
      return { rate: 3, label: 'Pekerjaan konstruksi SBU Menengah/Besar — PP 51/2008 (3%)' };
    case 'konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Pekerjaan konstruksi tanpa SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 4, label: 'Jasa konsultansi konstruksi ber-SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_tanpa_sbu':
      return { rate: 6, label: 'Jasa konsultansi konstruksi tanpa SBU — PP 51/2008 (6%)' };
    case 'pengalihan_tanah_bangunan':
      return {
        rate: 2.5,
        label: 'Pengalihan hak tanah/bangunan (umum) — PP 34/2016 (2,5%)',
      };
  }
}

export const pph4_2Pp34_2016Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getMidPph4_2Meta(input.objectType);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2)', formula: meta.label, value: meta.rate, format: 'percent' },
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
        'PP 34 Tahun 2016 diundangkan 8 Agustus 2016 dan berlaku 30 hari kemudian (7 September 2016), menurunkan tarif umum PHTB dari 5% menjadi 2,5%.',
        'Tarif jasa konstruksi pada periode ini belum berubah hingga berlakunya PP 9 Tahun 2022 pada 21 Februari 2022.',
      ],
    };
  },
};
