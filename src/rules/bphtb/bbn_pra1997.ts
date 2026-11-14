import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const TARIF_BBN = 10;

const sources = [SRC.UU_21_1997, SRC.UU_1_1998];

const regime: TaxRegime = {
  id: 'bphtb_bbn_pra1997',
  taxType: 'bphtb',
  name: 'Ordonansi Bea Balik Nama (S.1924 No. 291 — Sebelum UU 21/1997)',
  shortName: '1924–1998 (Bea Balik Nama 10%)',
  legalBasis: 'Ordonansi Bea Balik Nama 1924 (Staatsblad 1924 No. 291, Dicabut UU 21/1997)',
  effectivePeriod: '1924 – 30 Juni 1998',
  isCurrent: false,
  summary:
    'Aturan historis pemungutan bea atas balik nama harta tetap tanah/kapal sebelum hadirnya UU BPHTB 21/1997: dikenakan tarif 10% atas nilai perolehan harta tetap (hanya berlaku terhadap peralihan tanah hak barat/sertifikat tertentu saat akta balik nama di BPN tanpa konsep NPOPTKP).',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'bphtb-bbn-pra1997',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'Ordonansi Bea Balik Nama 1924 (Tarif 10%): Sejarah Cikal Bakal BPHTB Sebelum Tahun 1998',
  legalBasis: 'Staatsblad 1924 No. 291 jo. Pasal 28 UU Nomor 21 Tahun 1997',
  effectiveDate: '1924 (Dicabut terhitung 1 Juli 1998 oleh UU 21/1997 jo. UU 1/1998)',
  readMinutes: 4,
  summary:
    'Mengapa tarif BPHTB ditetapkan 5% dengan NPOPTKP: membandingkan Ordonansi Bea Balik Nama (BBN) 1924 yang membebankan 10% tanpa pengurang bebas pajak terhadap balik nama harta tetap.',
  sections: [
    {
      heading: 'Dari tarif 10% Bea Balik Nama 1924 ke BPHTB 5% pada Juli 1998',
      paragraphs: [
        'Sebelum BPHTB berlaku pada 1 Juli 1998, pajak peralihan hak atas tanah/kapal di Indonesia didasarkan pada Ordonansi Bea Balik Nama Tahun 1924 (Staatsblad 1924 Nomor 291). Tarif dasar Ordonansi BBN tersebut sebesar 10% (tanpa mekanisme NPOPTKP pengurang nilai rakyat kecil) dan hanya menjangkau pencatatan balik nama tertentu di pendaftaran tanah.',
        'UU Nomor 21 Tahun 1997 secara tegas mencabut Ordonansi Bea Balik Nama 1924 (Pasal 28) sekaligus memperluas objek pajak ke seluruh jenis perolehan hak tanah/bangunan (termasuk sertifikat hak milik adat konversi, waris, lelang) dengan kompensasi tarif yang jauh lebih adil yaitu 5% ditambah pengurang NPOPTKP Rp 30 juta.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Ordonansi Bea Balik Nama 1924 (s.d. Jun 1998)',
    newHeader: 'UU 21/1997 BPHTB Awal (Jul 1998–2000)',
    rows: [
      {
        aspek: 'Tarif pajak perolehan / balik nama',
        aturanLama: '10% dari nilai harta tetap (tanpa NPOPTKP)',
        aturanBaru: '5% dari (NPOP - NPOPTKP Rp 30.000.000)',
      },
    ],
  },
  caseExample: {
    title: 'Balik nama properti bernilai Rp 300 juta pada masa berlaku Ordonansi BBN 1924',
    scenario:
      'Sebelum berlakunya UU BPHTB pada Juli 1998, objek properti yang terkena Ordonansi Bea Balik Nama senilai Rp 300.000.000 terbebani tarif 10% tanpa NPOPTKP = Rp 30.000.000.',
    presetRegime: 'bphtb_bbn_pra1997',
    presetInput: {
      bphtb: {
        hargaTransaksi: 300000000,
        njopObjek: 300000000,
        acquisitionType: 'jual_beli_pertama',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const bphtbBbnPra1997Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const nilai = Math.max(Math.max(0, input.hargaTransaksi), Math.max(0, input.njopObjek));
    const bbn = Math.round((nilai * TARIF_BBN) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai transaksi / taksiran harta tetap (tanpa NPOPTKP)', value: nilai },
      { label: 'Tarif Ordonansi Bea Balik Nama 1924 (10%)', value: TARIF_BBN, format: 'percent' },
      {
        label: 'Bea Balik Nama terutang (Pra-1 Juli 1998)',
        formula: `${formatRupiah(nilai)} x ${formatPersen(TARIF_BBN)}`,
        value: bbn,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Bea Balik Nama Era Pra-1998 (10%)',
      primaryTaxAmount: bbn,
      effectiveRatePercent: TARIF_BBN,
      takeHomeOrNetLabel: 'Total Nilai Properti + Bea Balik Nama',
      takeHomeOrNetAmount: nilai + bbn,
      steps,
      notes: [
        'Ordonansi Bea Balik Nama 1924 resmi dicabut saat mulai berlakunya UU Nomor 21 Tahun 1997 tentang BPHTB (yang ditangguhkan ke 1 Juli 1998 melalui UU 1/1998).',
      ],
    };
  },
};
