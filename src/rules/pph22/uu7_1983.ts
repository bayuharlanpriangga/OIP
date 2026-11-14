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
  id: 'pph22_uu7_1983',
  taxType: 'pph22',
  name: 'UU 7/1983 & KMK 965/1983 / KMK 382/1989',
  shortName: '1984–1994 (UU 7/1983)',
  legalBasis: 'Pasal 22 UU Nomor 7 Tahun 1983, KMK 965/KMK.04/1983 & KMK 382/KMK.04/1989',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Era awal pemungutan PPh Pasal 22 pasca-reformasi 1983: impor dengan API 2,5%, impor tanpa API 7,5%, dan pembayaran bendaharawan/badan tertentu 1,5% sebelum pembaruan UU 10/1994.',
  sources: [SRC.UU_7_1983, SRC.KMK_965_1983, SRC.KMK_382_1989, SRC.KMK_599_1994],
};

const article: TaxArticle = {
  id: 'pph22-uu7-1983',
  taxType: 'pph22',
  taxTypeLabel: 'PPh Pasal 22',
  title: 'Fondasi PPh Pasal 22 di Awal Reformasi Pajak 1983 (1984–1994)',
  legalBasis: 'Pasal 22 UU Nomor 7 Tahun 1983 & KMK 965/KMK.04/1983 jo. KMK 382/KMK.04/1989',
  effectiveDate: '1 Januari 1984',
  readMinutes: 3,
  summary:
    'Konstruksi awal pemungutan PPh di bidang impor dan penyerahan barang kepada badan tertentu sebagai pengganti sistem MPO pra-1984.',
  sections: [
    {
      heading: 'Dari MPO pra-reformasi ke Pasal 22 UU 7/1983',
      paragraphs: [
        'Sebelum reformasi perpajakan 1983, Indonesia mengenal mekanisme Menghitung Pajak Orang Lain (MPO) yang luas. UU Nomor 7 Tahun 1983 memangkas praktik tersebut dan menyalurkan pemungutan khusus kegiatan impor serta pembayaran dari APBN/APBD melalui Pasal 22.',
        'Melalui KMK 965/KMK.04/1983 hingga KMK 382/KMK.04/1989, Direktorat Jenderal Bea dan Cukai serta Bank Devisa ditunjuk memungut 2,5% atas impor pemegang API dan 7,5% bagi non-API sebagai kredit pajak tahunan.',
      ],
    },
    {
      heading: 'Pungutan bendaharawan 1,5% sebelum reformasi UU 10/1994',
      paragraphs: [
        'Bendaharawan pemerintah mulai memungut 1,5% atas pembayaran pembelian barang yang bersumber dari anggaran negara sebagai bagian pengamanan setoran angsuran pajak rekanan proyek pemerintah.',
      ],
    },
  ],
  caseExample: {
    title: 'Impor mesin ber-API Rp 100 juta pada tahun 1988',
    scenario:
      'Importir pemegang API melakukan impor barang dengan nilai impor Rp 100.000.000 sehingga dipungut PPh Pasal 22 sebesar 2,5% atau Rp 2.500.000.',
    presetRegime: 'pph22_uu7_1983',
    presetInput: {
      pph22: {
        nilaiDasar: 100000000,
        objectType: 'impor_api',
        hasNpwp: true,
      },
    },
  },
};

function getUu7Pph22Rate(objectType: Pph22ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'impor_api':
      return { rate: 2.5, label: 'Impor barang menggunakan API (2,5% nilai impor)' };
    case 'impor_non_api':
      return { rate: 7.5, label: 'Impor barang tanpa API (7,5% nilai impor)' };
    case 'impor_komoditas_tertentu':
      return {
        rate: 2.5,
        label: 'Impor komoditas ber-API (tarif umum 2,5%; belum ada pengecualian khusus 0,5%)',
      };
    case 'impor_konsumsi_10':
      return {
        rate: 2.5,
        label: 'Impor barang konsumsi ber-API (tarif umum 2,5% sebelum klaster 7,5%–10%)',
      };
    case 'bendahara_bumn':
      return {
        rate: 1.5,
        label: 'Pembayaran dari APBN/APBD oleh Bendaharawan (1,5% — KMK 382/KMK.04/1989)',
      };
    case 'bulion_emas':
      return {
        rate: 0,
        label: 'Pemungutan khusus LJK bulion emas 0,25% belum ada pada era UU 7/1983',
      };
    case 'barang_sangat_mewah':
      return {
        rate: 0,
        label: 'Objek PPh 22 barang sangat mewah belum ada pada era UU 7/1983',
      };
  }
}

export const pph22Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph22']> = {
  regime,
  article,
  calculate(input) {
    const nilaiDasar = Math.max(0, input.nilaiDasar);
    const meta = getUu7Pph22Rate(input.objectType);
    const pph22 = Math.round((nilaiDasar * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Dasar pengenaan PPh 22', value: nilaiDasar },
      { label: 'Objek pemungutan era UU 7/1983', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Pasal 22 terutang',
        formula: `${formatRupiah(nilaiDasar)} x ${formatPersen(meta.rate)}`,
        value: pph22,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 22 Terutang',
      primaryTaxAmount: pph22,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Bersih Setelah Pungutan PPh 22',
      takeHomeOrNetAmount: Math.max(0, nilaiDasar - pph22),
      steps,
      notes: [
        'Pada era UU 7/1983 (1984–1994), mekanisme PPh Pasal 22 difokuskan pada pemungutan di pintu impor oleh DJBC/Bank Devisa dan pembayaran APBN/APBD oleh bendaharawan, tanpa sanksi tarif +100% non-NPWP.',
      ],
    };
  },
};
