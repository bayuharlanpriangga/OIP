import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.KMK_628_1991, SRC.UU_7_1983, SRC.UU_7_2021_HPP];

const regime: TaxRegime = {
  id: 'pph15_kmk628_1991_migas',
  taxType: 'pph15',
  name: 'KMK 628/KMK.04/1991 (Norma Khusus BUT Pengeboran Migas Asing — 15% Neto)',
  shortName: '1991–Kini (BUT Pengeboran Migas 3,3%)',
  legalBasis: 'Pasal 15 UU PPh jo. KMK Nomor 628/KMK.04/1991',
  effectivePeriod: '26 Juni 1991 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — BUT usaha pengeboran minyak & gas bumi asing',
  summary:
    'Norma Penghitungan Khusus PPh Pasal 15 bagi Bentuk Usaha Tetap (BUT) perusahaan pengeboran migas asing: penghasilan neto ditetapkan 15% dari peredaran bruto kontrak pengeboran, lalu dikenai tarif PPh Badan (kini 22% -> 3,3% atas bruto) ditambah Branch Profit Tax (BPT) Pasal 26 ayat (4).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph15-kmk628-1991-migas',
  taxType: 'pph15',
  taxTypeLabel: 'PPh Pasal 15',
  title: 'KMK 628/KMK.04/1991: Norma Penghasilan Neto 15% untuk BUT Pengeboran Migas Asing',
  legalBasis: 'KMK Nomor 628/KMK.04/1991 Pasal 1–3 & Pasal 26 ayat (4) UU PPh',
  effectiveDate: '26 Juni 1991',
  readMinutes: 4,
  summary:
    'Membahas cara menghitung PPh Badan dari norma neto 15% (efektif 3,3% pada tarif Badan 22%) serta implikasi Branch Profit Tax bagi BUT perusahaan pengeboran minyak dan gas bumi asing.',
  sections: [
    {
      heading: 'Mengapa kontrak rig pengeboran migas asing memakai norma neto 15%?',
      paragraphs: [
        'Perusahaan jasa pengeboran minyak dan gas bumi (drilling contractor) asing yang beroperasi sementara di perairan/wilayah Indonesia umumnya membentuk BUT dengan biaya sewa rig lepas pantai dan alat berteknologi tinggi yang sulit diaudit alokasi kantor pusatnya. Karena itu KMK 628/KMK.04/1991 menetapkan Norma Penghasilan Neto Khusus sebesar 15% dari penghasilan bruto sesuai kontrak (tidak termasuk reimbursable biaya yang terpisah jelas sesuai ketentuan kontrak migas).',
        'Berbeda dengan pelayaran yang memiliki tarif pajak akhir tetap (1,2% / 2,64%), pada KMK 628/1991 yang dibakukan adalah persentase penghasilan netonya (15%), sedangkan tarif pajaknya mengikuti tarif PPh Badan yang berlaku pada tahun pajak bersangkutan (30% pra-2009, 28% di 2009, 25% di 2010–2019, lalu 22% sejak 2020 sehingga PPh Badan efektif menjadi 15% × 22% = 3,3%), ditambah PPh Pasal 26 ayat (4) (BPT 20% atau tarif P3B) atas laba neto setelah PPh Badan.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'KMK 628/1991 Saat Terbit (Tarif Badan 30%–35%)',
    newHeader: 'KMK 628/1991 Saat Ini (Tarif Badan UU HPP 22%)',
    rows: [
      {
        aspek: 'Norma penghasilan neto dari bruto kontrak drilling',
        aturanLama: '15% dari peredaran bruto',
        aturanBaru: 'Tetap 15% dari peredaran bruto',
      },
      {
        aspek: 'PPh Badan efektif atas bruto (15% × tarif Badan)',
        aturanLama: '4,5% – 5,25% (pada tarif Badan 30%–35%)',
        aturanBaru: '3,30% (15% × tarif Badan 22%)',
      },
      {
        aspek: 'Branch Profit Tax (BPT) Pasal 26(4) non-P3B',
        aturanLama: '20% × sisa laba setelah PPh Badan',
        aturanBaru: '20% × (15% - 3,30%) = 2,34% (kecuali tarif P3B lebih rendah)',
      },
    ],
  },
  caseExample: {
    title: 'Kontrak pengeboran lepas pantai BUT asing senilai Rp 50 miliar',
    scenario:
      'BUT perusahaan drilling asing mencatat bruto jasa pengeboran Rp 50.000.000.000. Norma neto 15% = Rp 7.500.000.000; PPh Badan 22% = Rp 1.650.000.000 (3,3%); BPT 20% dari sisa Rp 5.850.000.000 = Rp 1.170.000.000 (2,34%); total beban PPh 5,64% = Rp 2.820.000.000.',
    presetRegime: 'pph15_kmk628_1991_migas',
    presetInput: {
      pph15: {
        peredaranBruto: 50000000000,
        sectorType: 'pelayaran_dn',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph15Kmk628_1991MigasRule: TaxRuleModule<TaxCalculatorInput['pph15']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.peredaranBruto);
    const normaNeto = Math.round(bruto * 0.15);
    const pphBadan = Math.round(normaNeto * 0.22);
    const sisaLabaSetelahPph = Math.max(0, normaNeto - pphBadan);
    const bpt20 = Math.round(sisaLabaSetelahPph * 0.2);
    const totalTax = pphBadan + bpt20;
    const effectiveRate = bruto > 0 ? (totalTax / bruto) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Peredaran bruto kontrak pengeboran migas BUT asing', value: bruto },
      {
        label: 'Norma Penghasilan Neto Khusus (15% — KMK 628/1991)',
        formula: `15% x ${formatRupiah(bruto)}`,
        value: normaNeto,
      },
      {
        label: 'PPh Badan terutang atas norma neto (Tarif UU HPP 22% -> 3,30% bruto)',
        formula: `22% x ${formatRupiah(normaNeto)}`,
        value: pphBadan,
      },
      {
        label: 'Sisa laba setelah PPh Badan (dasar BPT Pasal 26 ayat 4)',
        value: sisaLabaSetelahPph,
      },
      {
        label: 'PPh Pasal 26(4) BPT (20% tarif domestik -> 2,34% bruto)',
        formula: `20% x ${formatRupiah(sisaLabaSetelahPph)}`,
        value: bpt20,
      },
      {
        label: 'Total PPh Pasal 15 & BPT BUT Pengeboran Migas',
        formula: `${formatRupiah(pphBadan)} + ${formatRupiah(bpt20)} (Efektif ${formatPersen(effectiveRate)})`,
        value: totalTax,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Total PPh BUT Migas (PPh Badan 3,3% + BPT 2,34%)',
      primaryTaxAmount: totalTax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'PPh Badan Murni Sebelum BPT (3,30%)',
      takeHomeOrNetAmount: pphBadan,
      steps,
      notes: [
        'Norma Penghasilan Neto 15% bersifat tetap sesuai KMK 628/KMK.04/1991; bagian BPT 20% dapat turun sesuai tarif P3B negara domisili kantor pusat BUT atau 0% jika seluruh sisa laba ditanamkan kembali di Indonesia.',
      ],
    };
  },
};
