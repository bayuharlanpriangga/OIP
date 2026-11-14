import {
  CalculationStep,
  Pph22ObjectType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';

const regime: TaxRegime = {
  id: 'pph22_kmk254_2001',
  taxType: 'pph22',
  name: 'KMK 254/2001 jo. PMK 210/2008 & PMK 253/2008',
  shortName: '2001–2010 (KMK 254/2001)',
  legalBasis:
    'KMK 254/KMK.03/2001 stdd PMK 210/PMK.03/2008; PMK 253/PMK.03/2008 (Barang Sangat Mewah)',
  effectivePeriod: '30 April 2001 – 30 Agustus 2010',
  isCurrent: false,
  summary:
    'Aturan pemungutan PPh 22 era UU 17/2000: impor API 2,5%, non-API 7,5%, kedelai/gandum API 0,5%, bendahara 1,5% dengan batas pengecualian Rp 1 juta, dan tarif 5% barang sangat mewah mulai Desember 2008.',
};

function getKmk254Rate(objectType: Pph22ObjectType): { rate: number; label: string; exemptLimit: number } {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang umum dengan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 0.5,
        label: 'Impor kedelai, gandum, dan tepung terigu dengan API (0,5% — PMK 08/2008)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 2.5,
        label: 'Impor barang konsumsi ber-API (tarif umum 2,5%; belum ada klaster 7,5%/10%)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembayaran oleh Bendaharawan Pemerintah / BUMN tertentu (1,5%)',
        exemptLimit: 1000000,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 5,
        label: 'Barang tergolong sangat mewah — PMK 253/PMK.03/2008 (berlaku mulai Des 2008: 5%)',
        exemptLimit: 0,
      };
  }
}

export const pph22Kmk254_2001Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getKmk254Rate(input.objectType);
    const isExempt = meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar <= meta.exemptLimit;
    const baseRate = isExempt ? 0 : meta.rate;
    const effectiveRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph22 = Math.round((nilaiDasar * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan PPh 22', value: nilaiDasar },
      { label: 'Objek pemungutan KMK 254/2001', formula: meta.label, value: baseRate, format: 'percent' },
      {
        label: 'Tarif setelah faktor NPWP',
        formula: input.hasNpwp
          ? 'Ber-NPWP (100%)'
          : 'Non-NPWP (200% — mulai 1 Jan 2009 via UU 36/2008)',
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
      'Pada era KMK 254/2001 s.d. PMK 210/2008, batas pengecualian belanja bendahara pemerintah hanya Rp 1.000.000 (sebelum naik ke Rp 2.000.000 di PMK 154/2010), serta sanksi tarif +100% non-NPWP baru berlaku efektif 1 Januari 2009.',
    ];
    if (isExempt) {
      notes.unshift(
        'Pembayaran bendaharawan paling banyak Rp 1.000.000 (tidak dipecah-pecah) dikecualikan dari pemungutan PPh 22 di era KMK 254/2001.'
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
