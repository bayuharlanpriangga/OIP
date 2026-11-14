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
  sources: [SRC.KMK_254_2001, SRC.PMK_210_2008, SRC.PMK_253_2008, SRC.UU_36_2008],
};

const article: TaxArticle = {
  id: 'pph22-kmk254-2001',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Era KMK 254/2001 & Lahirnya PPh 22 Barang Sangat Mewah (2001–2010)',
  legalBasis: 'KMK 254/KMK.03/2001 stdd PMK 210/PMK.03/2008 & PMK 253/PMK.03/2008',
  effectiveDate: '30 April 2001',
  readMinutes: 4,
  summary:
    'Aturan PPh Pasal 22 era UU 17/2000 yang menetapkan ambang bebas pungut bendahara Rp 1 juta, insentif impor komoditas pangan 0,5%, serta lahirnya pungutan 5% atas barang sangat mewah pada akhir 2008.',
  sections: [
    {
      heading: 'Ambang belanja bendahara Rp 1 juta dan pergeseran ke 2009',
      paragraphs: [
        'KMK Nomor 254/KMK.03/2001 menggantikan rezim 1994–1997 dan menyesuaikan batas pengecualian belanja barang oleh bendaharawan pemerintah dari di bawah Rp 500.000 menjadi paling banyak Rp 1.000.000 (dan bukan pembayaran terpecah-pecah).',
        'Selama hampir satu dekade keberlakuannya, ketentuan ini mengalami beberapa perubahan hingga PMK 210/PMK.03/2008, termasuk pengenaan sanksi tarif 100% lebih tinggi bagi WP tanpa NPWP sejak 1 Januari 2009 mengikuti amanat UU 36/2008.',
      ],
    },
    {
      heading: 'Kelahiran PPh 22 barang sangat mewah dan diskon impor pangan',
      paragraphs: [
        'Pada tahun 2008, pemerintah merespons gejolak harga pangan global dengan memangkas tarif impor kedelai, gandum, dan tepung terigu bagi pemegang API dari 2,5% menjadi 0,5%.',
        'Di penghujung tahun yang sama terbit PMK 253/PMK.03/2008 yang untuk pertama kalinya menunjuk badan usaha penjual barang tergolong sangat mewah—seperti pesawat pribadi, kapal pesiar, dan hunian mewah—untuk memungut PPh Pasal 22 sebesar 5%.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 450/1997 (1995–2001)',
    newHeader: 'KMK 254/2001 jo. PMK 253/2008',
    rows: [
      {
        aspek: 'Batas bebas pungut bendahara',
        aturanLama: 'Di bawah Rp 500.000',
        aturanBaru: 'Paling banyak Rp 1.000.000',
      },
      {
        aspek: 'Pungutan barang sangat mewah',
        aturanLama: 'Belum diatur',
        aturanBaru: 'Tarif 5% (PMK 253/2008 mulai Des 2008)',
      },
    ],
  },
  caseExample: {
    title: 'Impor bahan baku tanpa API Rp 200 juta di era KMK 254/2001',
    scenario:
      'Importir ber-NPWP namun tidak memiliki API mengimpor mesin dengan nilai impor Rp 200.000.000 sehingga dipungut PPh 22 sebesar 7,5% atau Rp 15.000.000.',
    presetRegime: 'pph22_kmk254_2001',
    presetInput: {
      pph22: {
        nilaiDasar: 200000000,
        objectType: 'impor_non_api',
        hasNpwp: true,
      },
    },
  },
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
    case 'ekspor_tambang_1_5':
      return {
        rate: 0,
        label: 'PPh 22 ekspor komoditas tambang 1,5% belum berlaku di era KMK 254/2001 (baru mulai PMK 107/2015)',
        exemptLimit: 0,
      };
    case 'pengumpul_kehutanan_perkebunan_0_25':
      return {
        rate: 0,
        label: 'PPh 22 pedagang pengumpul 0,25% belum berlaku di era KMK 254/2001 (baru mulai era PMK 154/2010 jo. PMK 16/2016)',
        exemptLimit: 0,
      };
    case 'bulion_emas':
      return {
        rate: 0,
        label: 'Pemungutan khusus LJK bulion emas 0,25% belum diatur di era KMK 254/2001',
        exemptLimit: 0,
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
  article,
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
          : 'Non-NPWP (200% — khusus 1 Jan 2009–30 Ags 2010 via UU 36/2008)',
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
      'Pada era KMK 254/2001 s.d. PMK 210/2008, batas pengecualian belanja bendahara pemerintah hanya Rp 1.000.000 (sebelum naik ke Rp 2.000.000 di PMK 154/2010), serta sanksi tarif +100% non-NPWP baru berlaku efektif 1 Januari 2009 melalui UU 36/2008.',
    ];
    if (!input.hasNpwp && nilaiDasar > 0) {
      notes.unshift(
        'Simulasi non-NPWP di atas menerapkan sanksi +100% (tarif 200%) yang mulai berlaku 1 Januari 2009 berdasarkan UU 36/2008; untuk transaksi 30 April 2001 – 31 Desember 2008, WP tanpa NPWP masih dikenai tarif normal (100%).'
      );
    }
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
