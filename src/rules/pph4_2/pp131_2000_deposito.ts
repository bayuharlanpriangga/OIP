import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_131_2000, SRC.PP_123_2015, SRC.PP_51_1994];

const regime: TaxRegime = {
  id: 'pph4_2_deposito_pp131_2000',
  taxType: 'pph4_2',
  name: 'PP 131/2000 jo. PP 123/2015 (Bunga Deposito, Tabungan, & DHE)',
  shortName: '2001–Kini (Bunga Deposito & DHE)',
  legalBasis: 'PP Nomor 131 Tahun 2000 stdd PP Nomor 123 Tahun 2015 & PP 51/1994 (Historis 15%)',
  effectivePeriod: '1 Januari 2001 – Sekarang (DHE Berlaku 2015)',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Bunga deposito, tabungan, SBI, & DHE',
  summary:
    'PPh Final atas bunga deposito, tabungan, dan diskonto SBI sebesar 20% bruto (dikecualikan bila total pokok <= Rp 7,5 juta), serta insentif tarif lebih rendah 0%–10% untuk deposito Devisa Hasil Ekspor (DHE) sesuai tenor & mata uang PP 123/2015.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp131-2000-deposito',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PPh Final Bunga Deposito, Tabungan, dan Devisa Hasil Ekspor: PP 131/2000 jo. PP 123/2015',
  legalBasis: 'PP Nomor 131 Tahun 2000, PP Nomor 123 Tahun 2015, & PP Nomor 51 Tahun 1994',
  effectiveDate: '1 Januari 2001 (Insentif DHE 29 Desember 2015)',
  readMinutes: 5,
  summary:
    'Membandingkan tarif historis 15% (PP 51/1994), kenaikan menjadi 20% Final beserta batas bebas pajak saldo <= Rp 7,5 juta (PP 131/2000), hingga diskon tarif khusus deposito DHE berbasis tenor (PP 123/2015).',
  sections: [
    {
      heading: 'Dari 15% (PP 51/1994) menjadi 20% dan ambang bebas Rp 7,5 juta (PP 131/2000)',
      paragraphs: [
        'Pada 1995–2000, bunga deposito dan tabungan dipotong PPh Final 15% berdasarkan PP Nomor 51 Tahun 1994 dengan pengecualian pokok hingga Rp 1 juta (lalu Rp 7,5 juta). Mulai 1 Januari 2001 lewat PP Nomor 131 Tahun 2000, tarif reguler dinaikkan menjadi 20% dari jumlah bruto untuk WPDN/BUT maupun WPLN (atau tarif P3B).',
        'Sesuai Pasal 4 PP 131/2000 jo. PMK 212/PMK.03/2018, bunga dari deposito dan tabungan dengan jumlah pokok tabungan tidak melebihi Rp 7.500.000 pada satu bank tetap dikecualikan (0%) sepanjang bukan merupakan bagian yang dipecah-pecah.',
      ],
    },
    {
      heading: 'Skema insentif Devisa Hasil Ekspor (DHE) PP 123/2015',
      paragraphs: [
        'Untuk menjaga cadangan devisa nasional, PP Nomor 123 Tahun 2015 memberikan penurunan tarif PPh Final khusus untuk bunga deposito yang bersumber dari Devisa Hasil Ekspor (DHE) di perbankan Indonesia: dalam valuta IDR dikenai 7,5% (tenor 1 bulan), 5% (3 bulan), dan 0% (tenor 6 bulan atau lebih); sedangkan dalam valuta USD dikenai 10% (1 bulan), 7,5% (3 bulan), 2,5% (6 bulan), dan 0% (> 6 bulan).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 51/1994 & Deposito Reguler PP 131/2000',
    newHeader: 'Deposito DHE PP 123/2015',
    rows: [
      {
        aspek: 'Tarif bunga deposito & tabungan reguler',
        aturanLama: '15% (PP 51/1994) -> 20% (PP 131/2000)',
        aturanBaru: 'Tetap 20% untuk deposito non-DHE (bebas jika pokok <= Rp 7,5 jt)',
      },
      {
        aspek: 'Deposito DHE mata uang Rupiah (IDR)',
        aturanLama: '20%',
        aturanBaru: '7,5% (1 bln) · 5% (3 bln) · 0% (>= 6 bln)',
      },
      {
        aspek: 'Deposito DHE mata uang Dolar AS (USD)',
        aturanLama: '20%',
        aturanBaru: '10% (1 bln) · 7,5% (3 bln) · 2,5% (6 bln) · 0% (> 6 bln)',
      },
    ],
  },
  caseExample: {
    title: 'Bunga deposito reguler Rp 12 juta dengan saldo pokok Rp 250 juta',
    scenario:
      'Nasabah memperoleh bunga deposito bruto Rp 12.000.000 atas penempatan pokok Rp 250.000.000 (> batas bebas Rp 7,5 juta). Bank memotong PPh Final Pasal 4(2) sebesar 20% = Rp 2.400.000.',
    presetRegime: 'pph4_2_deposito_pp131_2000',
    presetInput: {
      pph4_2: {
        nilaiBruto: 12000000,
        objectType: 'sewa_tanah_bangunan',
        depositoSkema: 'reguler',
        nilaiDepositoPokok: 250000000,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

function getDepositoRate(
  skema: NonNullable<TaxCalculatorInput['pph4_2']['depositoSkema']>,
  pokok: number
): { rate: number; label: string; isExemptPokok: boolean } {
  if (skema === 'historis_pp51_1994') {
    const exempt = pokok > 0 && pokok <= 7500000;
    return {
      rate: exempt ? 0 : 15,
      label: exempt
        ? '0% — Pokok tabungan/deposito <= Rp 7,5 juta (dikecualikan)'
        : '15% Final — Era historis PP Nomor 51 Tahun 1994 (1995–2000)',
      isExemptPokok: exempt,
    };
  }
  if (skema === 'reguler') {
    const exempt = pokok > 0 && pokok <= 7500000;
    return {
      rate: exempt ? 0 : 20,
      label: exempt
        ? '0% — Pokok tabungan/deposito <= Rp 7,5 juta (Pasal 4 PP 131/2000)'
        : '20% Final — Deposito / Tabungan / SBI Reguler (PP 131/2000)',
      isExemptPokok: exempt,
    };
  }
  switch (skema) {
    case 'dhe_idr_1bln':
      return { rate: 7.5, label: '7,5% Final — Deposito DHE IDR tenor 1 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_idr_3bln':
      return { rate: 5, label: '5% Final — Deposito DHE IDR tenor 3 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_idr_6bln_lebih':
      return { rate: 0, label: '0% Final — Deposito DHE IDR tenor >= 6 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_usd_1bln':
      return { rate: 10, label: '10% Final — Deposito DHE USD tenor 1 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_usd_3bln':
      return { rate: 7.5, label: '7,5% Final — Deposito DHE USD tenor 3 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_usd_6bln':
      return { rate: 2.5, label: '2,5% Final — Deposito DHE USD tenor 6 bulan (PP 123/2015)', isExemptPokok: false };
    case 'dhe_usd_lebih_6bln':
      return { rate: 0, label: '0% Final — Deposito DHE USD tenor > 6 bulan (PP 123/2015)', isExemptPokok: false };
  }
}

export const pph4_2DepositoPp131_2000Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bungaBruto = Math.max(0, input.nilaiBruto);
    const pokok = Math.max(0, input.nilaiDepositoPokok ?? 100000000);
    const skema = input.depositoSkema ?? 'reguler';
    const meta = getDepositoRate(skema, pokok);
    const tax = Math.round((bungaBruto * meta.rate) / 100);
    const netReceived = Math.max(0, bungaBruto - tax);

    const steps: CalculationStep[] = [
      { label: 'Bunga deposito / tabungan bruto diterima', value: bungaBruto },
      { label: 'Nilai pokok penempatan dana', value: pokok },
      { label: 'Tarif PPh Final Pasal 4(2)', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final bunga deposito dipotong bank',
        formula: `${formatRupiah(bungaBruto)} x ${formatPersen(meta.rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Bunga bersih diterima nasabah', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Bunga Deposito / Tabungan',
      primaryTaxAmount: tax,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Bunga Bersih Masuk Rekening',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        meta.isExemptPokok
          ? 'Berdasarkan Pasal 4 PP 131/2000, saldo deposito/tabungan pada satu bank hingga Rp 7.500.000 dikecualikan dari pemotongan PPh Final (0%).'
          : 'Pemotongan bersifat Final dan langsung dipotong oleh bank penyelenggara pada saat pembayaran atau jatuh tempo bunga.',
      ],
    };
  },
};
