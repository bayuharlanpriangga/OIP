import { CalculationStep, TaxArticle, TaxCalculatorInput, TaxRegime, TaxRuleModule } from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph26_uu10_1994',
  taxType: 'pph26',
  name: 'UU 10/1994 & UU 17/2000 (Pasal 26)',
  shortName: '1995–2008 (UU 10/1994 & 17/2000)',
  legalBasis: 'Pasal 26 UU Nomor 10 Tahun 1994 jo. UU Nomor 17 Tahun 2000 & KMK 624/KMK.04/1994',
  effectivePeriod: '1 Januari 1995 – 31 Desember 2008',
  isCurrent: false,
  summary:
    'Pemotongan final 20% atas WPLN dengan perluasan objek Pasal 26 ayat (2) atas penjualan harta di Indonesia dan norma premi asuransi luar negeri KMK 624/1994 (efektif 10%), kecuali diatur lebih rendah di P3B.',
  sources: [SRC.UU_10_1994, SRC.UU_17_2000, SRC.KMK_624_1994],
};

const article: TaxArticle = {
  id: 'pph26-uu10-1994',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'Perluasan Objek Pasal 26 di UU 10/1994 & Norma Asuransi KMK 624/1994 (1995–2008)',
  legalBasis: 'Pasal 26 UU Nomor 10 Tahun 1994 jo. UU 17/2000 & KMK 624/KMK.04/1994',
  effectiveDate: '1 Januari 1995',
  readMinutes: 4,
  summary:
    'Penambahan objek pemotongan WPLN atas penjualan harta di Indonesia (Pasal 26 ayat 2) serta penetapan perkiraan neto 50% atas premi asuransi ke luar negeri.',
  sections: [
    {
      heading: 'Penambahan Pasal 26 ayat (2) atas penjualan aset di Indonesia',
      paragraphs: [
        'Sebelum reformasi 1994, pemotongan PPh Pasal 26 hanya menyasar penghasilan yang dibayarkan pemotong di Indonesia berupa dividen, bunga, royalti, jasa, serta branch profit tax BUT.',
        'Melalui UU Nomor 10 Tahun 1994 (dipertahankan pada UU 17/2000), pemerintah menambahkan Pasal 26 ayat (2) sehingga keuntungan dari pengalihan harta di Indonesia serta premi asuransi yang dibayarkan ke perusahaan asuransi di luar negeri turut menjadi objek pemotongan final 20% dari perkiraan penghasilan neto.',
      ],
    },
    {
      heading: 'Norma efektif 10% premi asuransi luar negeri lewat KMK 624/1994',
      paragraphs: [
        'Berdasarkan KMK 624/KMK.04/1994, premi yang dibayarkan langsung oleh tertanggung Indonesia ke perusahaan asuransi luar negeri ditetapkan memiliki perkiraan penghasilan neto 50% sehingga tarif pemotongan efektifnya menjadi 10% (20% × 50%).',
      ],
    },
  ],
  caseExample: {
    title: 'Premi asuransi luar negeri Rp 100 juta di era KMK 624/1994',
    scenario:
      'Perusahaan Indonesia membayar premi asuransi langsung ke luar negeri sebesar Rp 100.000.000 (tanpa perlindungan P3B) sehingga dipotong 20% × 50% perkiraan neto atau Rp 10.000.000.',
    presetRegime: 'pph26_uu10_1994',
    presetInput: {
      pph26: {
        nilaiBruto: 100000000,
        objectType: 'premi_asuransi_ln',
        hasSkdP3b: false,
        tarifP3bPersen: 10,
      },
    },
  },
};

export const pph26Uu10_1994Rule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const treatyRate = Math.min(20, Math.max(0, input.tarifP3bPersen));

    let effectiveRate = 20;
    let basisLabel = 'Tarif domestik Pasal 26 UU 10/1994 & UU 17/2000 (20% bruto)';

    if (input.objectType === 'premi_asuransi_ln') {
      const basePremiRate = 10;
      if (input.hasSkdP3b && treatyRate < basePremiRate) {
        effectiveRate = treatyRate;
        basisLabel = `Tarif P3B dengan SKD (${formatPersen(treatyRate)})`;
      } else {
        effectiveRate = basePremiRate;
        basisLabel = 'KMK 624/KMK.04/1994: perkiraan neto 50% x 20% = 10%';
      }
    } else if (input.hasSkdP3b) {
      effectiveRate = treatyRate;
      basisLabel = `Tarif P3B dengan SKD (${formatPersen(treatyRate)})`;
    } else if (input.objectType === 'bunga_obligasi_wpln') {
      effectiveRate = 20;
      basisLabel = 'Bunga obligasi WPLN era UU 10/1994 & UU 17/2000 (20%)';
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
        'UU 10/1994 memperluas Pasal 26 ayat (2) atas penghasilan WPLN dari penjualan harta di Indonesia (20% x perkiraan neto), dan KMK 624/1994 menetapkan perkiraan neto 50% (efektif 10%) bagi premi asuransi yang dibayar langsung ke perusahaan asuransi luar negeri.',
      ],
    };
  },
};
