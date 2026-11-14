import {
  CalculationStep,
  Pph22ObjectType,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph22_pmk81_2024',
  taxType: 'pph22',
  name: 'PMK 81/2024 Bab VI (Pasal 217–225)',
  shortName: 'Jan–Jul 2025 (PMK 81/2024)',
  legalBasis:
    'Pasal 217–225 PMK Nomor 81 Tahun 2024 (Mencabut PMK 34/2017; Dicabut PMK 54/2025 per 1 Ags 2025)',
  effectivePeriod: '1 Januari 2025 – 31 Juli 2025',
  isCurrent: false,
  summary:
    'Periode transisi 7 bulan saat pemungutan PPh Pasal 22 dikodifikasi dalam PMK 81/2024 (Coretax) menggantikan PMK 34/2017, sebelum dipisah kembali menjadi PMK 51/2025 sejak 1 Agustus 2025.',
  sources: [SRC.PMK_81_2024, SRC.PMK_54_2025, SRC.PMK_92_2019],
  verifiedAt: '14 November 2026',
};

function getPmk81Rate(objectType: Pph22ObjectType): {
  rate: number;
  label: string;
  exemptLimit: number;
} {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang umum dengan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 0.5,
        label: 'Impor kedelai, gandum, dan tepung terigu dengan API (0,5%)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 10,
        label: 'Impor barang konsumsi tertentu Lampiran PMK 81/2024 (10%)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Belanja Instansi Pemerintah / Bendahara / BUMN (1,5%)',
        exemptLimit: 2000000,
      };
    case 'bulion_emas':
      return {
        rate: 0.25,
        label: 'Penyerahan/transaksi emas batangan terkait (0,25%; penyesuaian khusus LJK bulion baru diperjelas di PMK 51/2025)',
        exemptLimit: 0,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 5,
        label: 'Barang tergolong sangat mewah — PMK 92/PMK.03/2019 (5%)',
        exemptLimit: 0,
      };
  }
}

export const pph22Pmk81_2024Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getPmk81Rate(input.objectType);
    const isExempt = meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar <= meta.exemptLimit;
    const baseRate = isExempt ? 0 : meta.rate;
    const effectiveRate = input.hasNpwp ? baseRate : baseRate * 2;
    const pph22 = Math.round((nilaiDasar * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan PPh 22', value: nilaiDasar },
      { label: 'Objek pemungutan PMK 81/2024', formula: meta.label, value: baseRate, format: 'percent' },
      {
        label: input.hasNpwp ? 'Status NPWP/NIK' : 'Sanksi non-NPWP (+100%)',
        formula: input.hasNpwp ? 'Tarif normal' : '200% dari tarif normal',
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
      'Selama 1 Januari – 31 Juli 2025, ketentuan pemungutan PPh Pasal 22 diatur dalam Pasal 217–225 PMK 81/2024 setelah mencabut PMK 34/2017, lalu dicabut oleh PMK 54/2025 dan digantikan PMK 51/2025 mulai 1 Agustus 2025.',
    ];
    if (isExempt) {
      notes.unshift(
        'Pembelian oleh instansi pemerintah paling banyak Rp 2.000.000 (tidak dipecah) dikecualikan dari pemungutan PPh 22.'
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
