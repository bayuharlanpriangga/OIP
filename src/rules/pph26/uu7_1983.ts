import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph26_uu7_1983',
  taxType: 'pph26',
  name: 'UU Nomor 7 Tahun 1983 (Pasal 26)',
  shortName: '1984–1994 (UU 7/1983 — 20% Bruto)',
  legalBasis: 'Pasal 26 UU Nomor 7 Tahun 1983',
  effectivePeriod: '1 Januari 1984 – 31 Desember 1994',
  isCurrent: false,
  summary:
    'Era awal pemotongan final 20% atas penghasilan bruto Wajib Pajak Luar Negeri (dividen, bunga, royalti, imbalan jasa, dan branch profit tax BUT) sebelum perluasan objek Pasal 26 ayat (2) pada UU 10/1994.',
  sources: [SRC.UU_7_1983, SRC.UU_10_1994],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-uu7-1983',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Pemotongan 20% Bruto WPLN di Era Awal Pasal 26 UU 7/1983 (1984–1994)',
  legalBasis: 'Pasal 26 UU Nomor 7 Tahun 1983',
  effectiveDate: '1 Januari 1984',
  readMinutes: 3,
  summary:
    'Konstruksi perdana PPh Pasal 26 dalam reformasi perpajakan 1983 yang mengenakan tarif final 20% dari jumlah bruto atas arus pembayaran ke Wajib Pajak Luar Negeri, kecuali diatur lebih rendah oleh P3B.',
  sections: [
    {
      heading: 'Tarif tunggal 20% final atas penghasilan pasif, jasa, dan laba BUT',
      paragraphs: [
        'Sejak berlakunya UU Nomor 7 Tahun 1983 pada 1 Januari 1984, Pasal 26 menetapkan pemotongan bersifat final sebesar 20% dari jumlah bruto atas dividen, bunga, royalti, sewa, imbalan jasa/pekerjaan, hadiah, serta Penghasilan Kena Pajak sesudah dikurangi pajak dari Bentuk Usaha Tetap (branch profit tax) apabila tidak ditanamkan kembali di Indonesia.',
        'Apabila penerima penghasilan berkedudukan di negara mitra Persetujuan Penghindaran Pajak Berganda (P3B / Tax Treaty) yang telah berlaku, tarif pemotongan dapat menyesuaikan batas tarif treaty sepanjang persyaratan administratif dipenuhi.',
      ],
    },
    {
      heading: 'Sebelum lahirnya Pasal 26 ayat (2) di UU 10/1994',
      paragraphs: [
        'Pada periode 1984–1994, rumusan Pasal 26 belum memuat ketentuan ayat (2) mengenai pemotongan atas keuntungan penjualan harta di Indonesia maupun premi asuransi yang dibayarkan kepada perusahaan asuransi di luar negeri beserta norma perkiraan penghasilan neto 50% (yang baru diperkenalkan oleh UU Nomor 10 Tahun 1994 jo. KMK 624/KMK.04/1994).',
      ],
    },
  ],
  caseExample: {
    title: 'Pembayaran royalti Rp 150 juta ke WPLN tanpa P3B di bawah UU 7/1983',
    scenario:
      'Perusahaan Indonesia membayar royalti Rp 150.000.000 kepada pemilik lisensi di luar negeri (non-P3B) pada tahun 1990 sehingga dipotong PPh Pasal 26 final sebesar 20% atau Rp 30.000.000.',
    presetRegime: 'pph26_uu7_1983',
    presetInput: {
      pph26: {
        nilaiBruto: 150000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

export const pph26Uu7_1983Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 UU 7/1983 (20% bruto)';

    if (input.objectType === 'premi_asuransi_ln') {
      effectiveRate = 0;
      basisLabel = 'Objek premi asuransi luar negeri Pasal 26 ayat (2) belum ada di era UU 7/1983 (baru berlaku mulai UU 10/1994)';
    } else if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B dengan SKD (${formatPersen(treatyRate)})`;
    } else if (input.objectType === 'bunga_obligasi_wpln') {
      effectiveRate = 20;
      basisLabel = 'Bunga obligasi WPLN era UU 7/1983 (20% bruto)';
    }

    const pph26 = Math.round((bruto * effectiveRate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto penghasilan dibayar ke WPLN', value: bruto },
      { label: 'Dasar tarif pemotongan', formula: basisLabel, value: effectiveRate, format: 'percent' },
      {
        label: 'PPh Pasal 26 final dipotong',
        formula: `${formatRupiah(bruto)} x ${formatPersen(effectiveRate)}`,
        value: pph26,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Pasal 26 Dipotong (Final)',
      primaryTaxAmount: pph26,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Pembayaran Bersih Ditransfer ke WPLN',
      takeHomeOrNetAmount: Math.max(0, bruto - pph26),
      steps,
      notes: [
        input.objectType === 'premi_asuransi_ln'
          ? 'Pada era UU 7/1983 (1984–1994), Pasal 26 ayat (2) atas premi asuransi ke luar negeri beserta norma KMK 624/1994 (efektif 10%) belum diberlakukan.'
          : 'Pasal 26 UU 7/1983 mengenakan tarif final 20% atas jumlah bruto pembayaran dividen, bunga, royalti, dan jasa kepada WPLN kecuali terdapat tarif lebih rendah dalam P3B.',
      ],
    };
  },
};
