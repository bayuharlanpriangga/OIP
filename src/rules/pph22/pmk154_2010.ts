import {
  CalculationStep,
  Pph22ObjectType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph22_pmk154_2010',
  taxType: 'pph22',
  name: 'PMK Nomor 154/PMK.03/2010',
  shortName: '2010–2017 (PMK 154/2010)',
  legalBasis: 'PMK Nomor 154/PMK.03/2010 jo. PMK Nomor 175/PMK.011/2013',
  effectivePeriod: '31 Agustus 2010 – 28 Februari 2017',
  isCurrent: false,
  summary:
    'Aturan pendahulu PMK 34/2017 untuk pemungutan PPh 22 impor (API 2,5%, non-API 7,5%) dan bendahara pemerintah (1,5%) sebelum penyederhanaan tarif komoditas serta barang sangat mewah.',
};

function getOldPph22Rate(objectType: Pph22ObjectType): { rate: number; label: string; exemptLimit: number } {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang dengan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 0.5,
        label: 'Impor kedelai, gandum, tepung terigu ber-API (0,5%)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 2.5,
        label: 'Impor barang konsumsi ber-API sebelum PMK 110/2018 (2,5% umum / 7,5% barang tertentu)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembelian oleh Bendaharawan Pemerintah / DJPB (1,5%)',
        exemptLimit: 2000000,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 5,
        label: 'Barang sangat mewah mengacu PMK 253/PMK.03/2008 (5%)',
        exemptLimit: 0,
      };
  }
}

export const pph22Pmk154_2010Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getOldPph22Rate(input.objectType);
    const isExempt = meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar <= meta.exemptLimit;
    const baseRate = isExempt ? 0 : meta.rate;
    const effectiveRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph22 = Math.round((nilaiDasar * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan PPh 22', value: nilaiDasar },
      { label: 'Objek pemungutan PMK 154/2010', formula: meta.label, value: baseRate, format: 'percent' },
      {
        label: 'Tarif setelah faktor NPWP',
        formula: input.hasNpwp ? 'Ber-NPWP (100%)' : 'Non-NPWP (200%)',
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 22 terutang',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(effectiveRate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Pada era PMK 154/2010 awal, pemungutan barang sangat mewah masih diatur terpisah di PMK 253/PMK.03/2008 dan BUMN tertentu baru diperluas pemungutannya melalui perubahan PMK 154/2010.',
    ];
    if (isExempt) {
      notes.unshift(
        'Pembayaran oleh bendahara pemerintah yang jumlahnya paling banyak Rp 2.000.000 dikecualikan dari pemungutan PPh Pasal 22.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Terutang',
      primaryTaxAmount: pph22,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Nilai Bersih Setelah Pungutan PPh 22',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - pph22),
      steps,
      notes,
    };
  },
};
