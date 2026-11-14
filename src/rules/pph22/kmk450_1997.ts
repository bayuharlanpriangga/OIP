import {
  CalculationStep,
  Pph22ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph22_kmk450_1997',
  taxType: 'pph22',
  name: 'KMK 599/KMK.04/1994 & KMK 450/KMK.04/1997',
  shortName: '1995–Apr 2001 (KMK 450/1997)',
  legalBasis: 'KMK 599/KMK.04/1994 jo. KMK 450/KMK.04/1997 & UU Nomor 10 Tahun 1994',
  effectivePeriod: '1 Januari 1995 – 29 April 2001',
  isCurrent: false,
  summary:
    'Aturan pemungutan PPh 22 era UU 10/1994 sebelum KMK 254/2001: impor API 2,5%, non-API 7,5%, dan bendaharawan pemerintah 1,5% dengan pengecualian transaksi di bawah Rp 500.000 (belum ada sanksi non-NPWP +100%).',
  sources: [SRC.KMK_450_1997, SRC.KMK_599_1994, SRC.UU_10_1994],
};

const article: TaxArticle = {
  id: 'pph22-kmk450-1997',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PPh Pasal 22 Era KMK 599/1994 & KMK 450/1997 (1995–2001)',
  legalBasis: 'KMK 599/KMK.04/1994 jo. KMK 450/KMK.04/1997 & UU 10/1994',
  effectiveDate: '1 Januari 1995',
  readMinutes: 3,
  summary:
    'Pelaksanaan Pasal 22 UU 10/1994 yang memperluas pemungut dari bendaharawan pemerintah hingga industri tertentu, dengan ambang pengecualian belanja Rp 500.000.',
  sections: [
    {
      heading: 'Ambang bebas pungut Rp 500.000 di era pasca-UU 10/1994',
      paragraphs: [
        'Menindaklanjuti perubahan UU 10/1994 yang mulai berlaku 1 Januari 1995, Menteri Keuangan menerbitkan KMK 599/KMK.04/1994 yang kemudian disempurnakan dengan KMK 450/KMK.04/1997.',
        'Aturan ini menetapkan tarif pemungutan 1,5% atas pembayaran oleh bendaharawan pemerintah dan badan tertentu dari dana APBN/APBD, namun mengecualikan transaksi yang jumlahnya di bawah Rp 500.000 dan bukan merupakan pembayaran yang dipecah-pecah.',
      ],
    },
    {
      heading: 'Belum ada diskon komoditas pangan maupun sanksi non-NPWP',
      paragraphs: [
        'Pada periode ini, seluruh impor barang pemegang API dikenai 2,5% dan non-API 7,5% tanpa pengecualian 0,5% untuk kedelai atau gandum. Sanksi pengali tarif 200% bagi rekanan tanpa NPWP juga belum dikenal dalam struktur UU 10/1994.',
      ],
    },
  ],
  caseExample: {
    title: 'Pengadaan instansi Rp 40 juta di bawah rezim KMK 450/1997',
    scenario:
      'Pembayaran proyek pengadaan barang oleh bendahara pemerintah senilai Rp 40.000.000 pada tahun 1998 dikenai PPh Pasal 22 sebesar 1,5% atau Rp 600.000.',
    presetRegime: 'pph22_kmk450_1997',
    presetInput: {
      pph22: {
        nilaiDasar: 40000000,
        objectType: 'bendahara_bumn',
        hasNpwp: true,
      },
    },
  },
};

function getKmk450Rate(objectType: Pph22ObjectType): { rate: number; label: string; exemptLimit: number } {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang dengan API (2,5%)', exemptLimit: 0 };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5%)', exemptLimit: 0 };
    case 'impor_komoditas_tertentu':
      return {
        rate: 2.5,
        label: 'Impor kedelai/gandum/terigu API (tarif umum impor API 2,5%; diskon 0,5% baru terbit di PMK 08/2008)',
        exemptLimit: 0,
      };
    case 'impor_konsumsi_10':
      return {
        rate: 2.5,
        label: 'Impor barang konsumsi API (tarif umum 2,5%; belum ada klaster 7,5%/10%)',
        exemptLimit: 0,
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembelian oleh Bendaharawan Pemerintah / BUMN tertentu (1,5%)',
        exemptLimit: 500000,
      };
    case 'ekspor_tambang_1_5':
      return {
        rate: 0,
        label: 'PPh 22 ekspor komoditas tambang 1,5% belum ada pada era 1995–2001',
        exemptLimit: 0,
      };
    case 'pengumpul_kehutanan_perkebunan_0_25':
      return {
        rate: 0,
        label: 'PPh 22 pedagang pengumpul 0,25% belum ada pada era 1995–2001',
        exemptLimit: 0,
      };
    case 'bulion_emas':
      return {
        rate: 0,
        label: 'Pemungutan khusus LJK bulion emas 0,25% belum diatur pada era 1995–2001',
        exemptLimit: 0,
      };
    case 'barang_sangat_mewah':
      return {
        rate: 0,
        label: 'Pemungutan PPh 22 barang sangat mewah belum ada (baru lahir Des 2008 via PMK 253/2008)',
        exemptLimit: 0,
      };
  }
}

export const pph22Kmk450_1997Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getKmk450Rate(input.objectType);
    const isExempt = meta.exemptLimit > 0 && nilaiDasar > 0 && nilaiDasar < meta.exemptLimit;
    const rate = isExempt ? 0 : meta.rate;
    const pph22 = Math.round((nilaiDasar * rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan PPh 22', value: nilaiDasar },
      { label: 'Objek pemungutan KMK 599/1994 & 450/1997', formula: meta.label, value: rate, format: 'percent' },
      {
        label: 'PPh Pasal 22 terutang',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(rate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    const notes: string[] = [
      'Pada era KMK 599/KMK.04/1994 dan KMK 450/KMK.04/1997, batas pengecualian pembayaran oleh bendaharawan adalah di bawah Rp 500.000 (bukan jumlah yang dipecah-pecah), sebelum naik ke Rp 1 juta pada KMK 254/2001.',
      'Sanksi tarif +100% bagi Wajib Pajak tanpa NPWP belum berlaku (baru mulai 1 Januari 2009 via UU 36/2008).',
    ];
    if (isExempt) {
      notes.unshift(
        'Pembayaran oleh bendaharawan di bawah Rp 500.000 (tidak dipecah) dikecualikan dari pemungutan PPh 22.'
      );
    }

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Terutang',
      primaryTaxAmount: pph22,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Setelah Pungutan PPh 22',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - pph22),
      steps,
      notes,
    };
  },
};
