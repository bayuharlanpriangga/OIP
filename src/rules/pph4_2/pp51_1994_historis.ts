import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_51_1994, SRC.PP_42_1994, SRC.PP_131_2000, SRC.PP_132_2000];

const regime: TaxRegime = {
  id: 'pph4_2_pp51_1994_historis',
  taxType: 'pph4_2',
  name: 'PP 51/1994 & PP 42/1994 (Deposito 15% & Undian 20% Era 1994–2000)',
  shortName: '1994–2000 (Deposito 15% & Undian 20%)',
  legalBasis: 'PP Nomor 51 Tahun 1994 (Deposito 15%) & PP Nomor 42 Tahun 1994 (Undian 20%)',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Rantai historis Pasal 4 ayat (2) pasca-UU 10/1994 sebelum dinaikkan di PP 131/2000 & PP 132/2000: pada era 1995–2000, bunga deposito/tabungan/SBI dipotong 15% Final (PP 51/1994 — lalu naik menjadi 20% di PP 131/2000) dan hadiah undian dipotong 20% Final (PP 42/1994 — lalu naik menjadi 25% di PP 132/2000).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp51-1994-historis',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Era 1995–2000 Sebelum PP 131/2000 & PP 132/2000: Deposito 15% (PP 51/1994) & Undian 20% (PP 42/1994)',
  legalBasis: 'PP Nomor 51 Tahun 1994 & PP Nomor 42 Tahun 1994',
  effectiveDate: '1 Januari 1995 – 31 Desember 2000',
  readMinutes: 4,
  summary:
    'Menjelaskan tarif PPh Final bunga deposito/tabungan/SBI dan hadiah undian sebelum tahun 2001 sebelum terjadi kenaikan tarif sebesar 5 poin persen di masing-masing objek pada awal 2001.',
  sections: [
    {
      heading: 'Kenaikan bersejarah awal 2001 (15% -> 20% dan 20% -> 25%)',
      paragraphs: [
        'Melalui PP Nomor 51 Tahun 1994 (berlaku sejak 1 Januari 1995), bunga deposito berjangka, sertifikat deposito, tabungan, serta diskonto Sertifikat Bank Indonesia (SBI) dikenai PPh Final sebesar 15% bagi WPDN (dan 20% bagi WPLN). Tarif WPDN ini kemudian dinaikkan menjadi 20% pada PP 131/2000.',
        'Pada saat yang sama, PP Nomor 42 Tahun 1994 menetapkan PPh Final atas hadiah undian sebesar 20% dari jumlah bruto nilai hadiah (termasuk natura/nilai pasar barang hadiah), sebelum akhirnya dinaikkan menjadi 25% Final melalui PP Nomor 132 Tahun 2000.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Era 1995–2000 (PP 51/1994 & PP 42/1994)',
    newHeader: 'Era 2001–Sekarang (PP 131/2000 & PP 132/2000)',
    rows: [
      {
        aspek: 'Bunga Deposito / Tabungan / SBI (WPDN)',
        aturanLama: '15% Final (PP 51/1994)',
        aturanBaru: '20% Final (PP 131/2000 jo. PP 123/2015)',
      },
      {
        aspek: 'Hadiah Undian (semua nama & bentuk)',
        aturanLama: '20% Final (PP 42/1994)',
        aturanBaru: '25% Final (PP 132/2000)',
      },
    ],
  },
  caseExample: {
    title: 'Perbandingan bunga deposito Rp 20.000.000 pada era PP 51/1994 (15%) vs kini (20%)',
    scenario:
      'Nasabah memperoleh bunga bruto deposito bank di Indonesia sebesar Rp 20.000.000 pada tahun 1999 (di bawah PP 51/1994).',
    presetRegime: 'pph4_2_pp51_1994_historis',
    presetInput: {
      pph4_2: {
        nilaiBruto: 20000000,
        objectType: 'sewa_tanah_bangunan',
        skemaPph42Historis: 'deposito_15_pp51_1994',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph4_2Pp51_1994HistorisRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const mode = input.skemaPph42Historis ?? 'deposito_15_pp51_1994';
    const isDeposito = mode === 'deposito_15_pp51_1994';

    const rateLama = isDeposito ? 15 : 20;
    const rateKini = isDeposito ? 20 : 25;
    const taxLama = Math.round((bruto * rateLama) / 100);
    const taxKini = Math.round((bruto * rateKini) / 100);

    const steps: CalculationStep[] = [
      {
        label: isDeposito ? 'Bunga bruto deposito / tabungan / SBI' : 'Nilai bruto hadiah undian',
        value: bruto,
      },
      {
        label: isDeposito ? 'Tarif historis PP 51/1994 (15%)' : 'Tarif historis PP 42/1994 (20%)',
        value: rateLama,
        format: 'percent',
      },
      {
        label: isDeposito ? 'PPh Final PP 51/1994 terutang (15%)' : 'PPh Final PP 42/1994 terutang (20%)',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rateLama)}`,
        value: taxLama,
        isHighlight: true,
      },
      {
        label: `Pembanding era 2001–kini (${isDeposito ? 'PP 131/2000: 20%' : 'PP 132/2000: 25%'})`,
        value: taxKini,
      },
    ];

    return {
      regime,
      primaryTaxLabel: isDeposito ? 'PPh Final Deposito 15% (PP 51/1994)' : 'PPh Final Undian 20% (PP 42/1994)',
      primaryTaxAmount: taxLama,
      effectiveRatePercent: rateLama,
      takeHomeOrNetLabel: 'Penghasilan Bersih Diterima (Era 1995–2000)',
      takeHomeOrNetAmount: Math.max(0, bruto - taxLama),
      steps,
      notes: [
        isDeposito
          ? `Pada era 1995–2000 (PP 51/1994), potongan bunga deposito hanya 15% (${formatRupiah(taxLama)}) — lebih rendah dari tarif 20% (${formatRupiah(taxKini)}) sejak PP 131/2000.`
          : `Pada era 1995–2000 (PP 42/1994), pajak hadiah undian sebesar 20% (${formatRupiah(taxLama)}) — lebih rendah dari tarif 25% (${formatRupiah(taxKini)}) sejak PP 132/2000.`,
      ],
    };
  },
};
