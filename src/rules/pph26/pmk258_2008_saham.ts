import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PMK_258_2008, SRC.UU_36_2008];

const regime: TaxRegime = {
  id: 'pph26_pmk258_2008_saham',
  taxType: 'pph26',
  name: 'PMK 258/PMK.03/2008 (Penjualan Saham / Conduit SPC Pasal 18 ayat 3c)',
  shortName: '2009–Kini (Jual Saham WPLN & SPC 5%)',
  legalBasis: 'Pasal 26 ayat (2) & Pasal 18 ayat (3c) UU PPh jo. PMK 258/PMK.03/2008',
  effectivePeriod: '1 Januari 2009 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Pengalihan saham oleh WPLN & perusahaan antara (5% efektif)',
  summary:
    'Pemotongan PPh Pasal 26 ayat (2) Final atas penjualan atau pengalihan saham perusahaan dalam negeri (non-bursa) oleh WPLN maupun penjualan saham perusahaan antara (conduit company / Special Purpose Company) di tax haven sebagaimana diatur dalam PMK 258/PMK.03/2008: perkiraan penghasilan neto 25% dari harga jual x tarif 20% = 5% Final dari harga jual.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph26-pmk258-2008-saham',
  taxType: 'pph26',
  taxTypeLabel: 'PPh Pasal 26',
  title: 'PPh 26 atas Penjualan Saham WPLN dan Conduit SPC (PMK 258/2008 — Efektif 5%)',
  legalBasis: 'Pasal 26 ayat (2) & Pasal 18 ayat (3c) UU PPh jo. PMK Nomor 258/PMK.03/2008',
  effectiveDate: '1 Januari 2009',
  readMinutes: 4,
  summary:
    'Memastikan Indonesia tetap mengenakan pajak 5% efektif dari harga jual atas pengalihan kepemilikan perseroan Indonesia meskipun transaksi jual-beli sahamnya dilakukan di luar negeri lewat perusahaan cangkang (SPC).',
  sections: [
    {
      heading: 'Mengapa tarifnya menjadi 5% (20% × Perkiraan Neto 25%)?',
      paragraphs: [
        'Berdasarkan PMK Nomor 258/PMK.03/2008 jo. KMK 434/KMK.04/1999, penjualan saham perseroan tertutup di Indonesia yang dimiliki oleh WPLN maupun penjualan saham perusahaan antara (Special Purpose Company) yang didirikan di negara suaka pajak (tax haven) yang memiliki hubungan istimewa dengan badan usaha di Indonesia ditetapkan memiliki Perkiraan Penghasilan Neto sebesar 25% dari harga jual.',
        'Ketika tarif PPh Pasal 26 sebesar 20% diterapkan atas perkiraan neto 25% tersebut, menghasilkan tarif efektif langsung sebesar 5% Final dari harga jual transaksi — dan apabila pembelinya juga WPLN, badan usaha Indonesia tempat saham berada berkewajiban mencatat perubahan kepemilikan setelah pajak 5% tersebut dipotong/disetor (kecuali dibebaskan P3B dengan SKD sah).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Pengalihan Saham WPLN Tanpa P3B',
    newHeader: 'Terdapat P3B yang Membebaskan Capital Gain Saham',
    rows: [
      {
        aspek: 'Tarif efektif atas harga jual (bukan BEI)',
        aturanLama: '5% Final (20% × perkiraan neto 25%)',
        aturanBaru: '0% (jika hak pemajakan diserahkan ke negara domisili & ada Form DGT)',
      },
      {
        aspek: 'Pengalihan tidak langsung via SPC tax haven',
        aturanLama: 'Tetap terutang 5% berdasarkan Pasal 18 ayat (3c) UU PPh',
        aturanBaru: 'Mengacu ketentuan anti-abuse / PPT P3B (umumnya tetap kena di Indonesia bila >50% aset properti)',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan saham PT non-listed senilai Rp 10 miliar oleh investor Singapura/Cayman',
    scenario:
      'Investor asing tanpa hak pembebasan P3B menjual saham PT di Indonesia kepada pembeli senilai Rp 10.000.000.000. Terutang PPh 26 ayat (2) efektif 5% (20% × 25% perkiraan neto) = Rp 500.000.000.',
    presetRegime: 'pph26_pmk258_2008_saham',
    presetInput: {
      pph26: {
        nilaiBruto: 10000000000,
        objectType: 'dividen_royalti_jasa',
        hasSkdP3b: false,
        tarifP3bPersen: 0,
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph26Pmk258_2008SahamRule: TaxRuleModule<TaxCalculatorInput['pph26']> = {
  regime,
  article,
  calculate(input) {
    const hargaJual = Math.max(0, input.nilaiBruto);
    const perkiraanNeto = Math.round(hargaJual * 0.25);
    const effectiveRate = input.hasSkdP3b ? Math.min(5, Math.max(0, input.tarifP3bPersen)) : 5;
    const tax = Math.round((hargaJual * effectiveRate) / 100);
    const netProceeds = Math.max(0, hargaJual - tax);

    const steps: CalculationStep[] = [
      { label: 'Harga jual / nilai pengalihan saham oleh WPLN / SPC', value: hargaJual },
      {
        label: 'Perkiraan Penghasilan Neto (25% × Harga Jual — PMK 258/2008)',
        formula: `25% x ${formatRupiah(hargaJual)}`,
        value: perkiraanNeto,
      },
      {
        label: input.hasSkdP3b ? 'Tarif efektif sesuai ketentuan P3B (dengan Form DGT)' : 'Tarif efektif Pasal 26 ayat (2) (20% × 25% = 5% Final)',
        value: effectiveRate,
        format: 'percent',
      },
      {
        label: 'PPh Pasal 26 Final atas pengalihan saham terutang',
        value: tax,
        isHighlight: true,
      },
      { label: 'Hasil penjualan bersih diterima penjual WPLN', value: netProceeds },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh 26 Final Pengalihan Saham (Efektif 5%)',
      primaryTaxAmount: tax,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Hasil Penjualan Saham Setelah Pajak',
      takeHomeOrNetAmount: netProceeds,
      steps,
      notes: [
        'Apabila saham dijual melalui Bursa Efek Indonesia (BEI), tidak memakai tarif 5% PMK 258/2008 melainkan terkena PPh Final saham bursa sebesar 0,1% (PP 41/1994).',
      ],
    };
  },
};
