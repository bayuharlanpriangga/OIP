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
  id: 'pph22_pmk154_2010',
  taxType: 'pph22',
  name: 'PMK Nomor 154/PMK.03/2010',
  shortName: '2010–2017 (PMK 154/2010)',
  legalBasis: 'PMK Nomor 154/PMK.03/2010 jo. PMK Nomor 175/PMK.011/2013',
  effectivePeriod: '31 Agustus 2010 – 28 Februari 2017',
  isCurrent: false,
  summary:
    'Aturan pendahulu PMK 34/2017 untuk pemungutan PPh 22 impor (API 2,5%, non-API 7,5%) dan bendahara pemerintah (1,5%) sebelum penyederhanaan tarif komoditas serta barang sangat mewah.',
  sources: [SRC.PMK_154_2010, SRC.PMK_175_2013, SRC.PMK_253_2008],
};

const article: TaxArticle = {
  id: 'pph22-pmk154-2010',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'PMK 154/2010: Pemungutan PPh Pasal 22 Impor, Bendahara & BUMN (2010–2017)',
  legalBasis: 'PMK 154/PMK.03/2010 stdd PMK 175/PMK.011/2013 & PMK 253/PMK.03/2008',
  effectiveDate: '31 Agustus 2010',
  readMinutes: 4,
  summary:
    'Regulasi konsolidasi PPh Pasal 22 periode 2010–2017 yang menaikkan batas pengecualian belanja bendahara menjadi Rp 2 juta, memperkenalkan pemungutan BUMN tertentu, dan meneruskan tarif impor 2,5%/7,5%.',
  sections: [
    {
      heading: 'Kenaikan ambang bebas pungut bendahara ke Rp 2 juta',
      paragraphs: [
        'Salah satu pembaruan penting PMK 154/PMK.03/2010 dibandingkan era KMK 254/2001 adalah naiknya batas pengecualian pembayaran belanja barang oleh bendahara pemerintah dari Rp 1.000.000 menjadi paling banyak Rp 2.000.000 (tidak termasuk PPN dan bukan pembayaran terpecah-pecah).',
        'Selain itu, melalui rangkaian perubahannya hingga PMK 175/PMK.011/2013 dan PMK 107/2015, pemerintah memperluas penunjukan BUMN tertentu serta badan usaha sektor industri strategis (semen, kertas, baja, otomotif, farmasi) sebagai pemungut PPh Pasal 22.',
      ],
    },
    {
      heading: 'Struktur tarif impor sebelum klaster barang konsumsi 7,5%–10%',
      paragraphs: [
        'Pada awal masa berlaku PMK 154/2010, impor barang oleh pemegang Angka Pengenal Impor (API) masih dikenai tarif tunggal 2,5% (dan 0,5% khusus kedelai, gandum, tepung terigu), sedangkan impor non-API dikenai 7,5% dari nilai impor.',
        'Barang konsumsi tertentu ber-API yang kini dikenai tarif protektif 7,5% hingga 10% baru dikonsolidasi secara menyeluruh pada rezim PMK 34/2017 jo. PMK 110/2018.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 254/2001 (2001–2010)',
    newHeader: 'PMK 154/2010 (2010–2017)',
    rows: [
      {
        aspek: 'Batas bebas pungut bendahara',
        aturanLama: 'Paling banyak Rp 1.000.000',
        aturanBaru: 'Paling banyak Rp 2.000.000',
      },
      {
        aspek: 'Pemungutan atas belanja BUMN tertentu',
        aturanLama: 'Terbatas bendaharawan pemerintah & bank devisa',
        aturanBaru: 'Diperluas mencakup BUMN tertentu & sektor usaha khusus',
      },
    ],
  },
  caseExample: {
    title: 'Belanja barang bendahara Rp 15 juta di era PMK 154/2010',
    scenario:
      'Penyerahan alat tulis kantor oleh rekanan ber-NPWP kepada bendahara dinas senilai Rp 15.000.000 (di atas batas Rp 2 juta) dipungut PPh 22 sebesar 1,5% atau Rp 225.000.',
    presetRegime: 'pph22_pmk154_2010',
    presetInput: {
      pph22: {
        nilaiDasar: 15000000,
        objectType: 'bendahara_bumn',
        hasNpwp: true,
      },
    },
  },
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
    case 'bulion_emas':
      return {
        rate: 0.45,
        label: 'Penjualan emas batangan oleh badan usaha produsen (0,45% pada perubahan PMK 154/2010, sebelum tarif bulion 0,25%)',
        exemptLimit: 0,
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
  article,
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
