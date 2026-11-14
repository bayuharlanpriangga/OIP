import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const TARIF_SIMULASI_IPEDA = 0.1; // Simulasi representasi tarif efektif rendah IPEDA/IREDA (~0,1% dari nilai taksiran produktivitas tanah)

const sources = [SRC.PERPU_11_1959_IPEDA, SRC.UU_12_1985];

const regime: TaxRegime = {
  id: 'pbb_ipeda_pra1986',
  taxType: 'pbb',
  name: 'Perpu 11/1959 & Rezim IPEDA / IREDA (Pra-UU 12/1985)',
  shortName: '1959–1985 (Pajak Hasil Bumi / IPEDA)',
  legalBasis: 'Perpu Nomor 11 Tahun 1959 tentang Pajak Hasil Bumi & SK IPEDA (Dicabut UU 12/1985)',
  effectivePeriod: '1959 – 31 Desember 1985',
  isCurrent: false,
  summary:
    'Sistem iuran tanah dan bangunan pra-UU PBB 1985: memungut tujuh jenis pajak terpisah (Pajak Hasil Bumi / Iuran Pembangunan Daerah / IPEDA, Pajak Kekayaan, Pajak Rumah Tangga, Verponding Indonesia) yang disederhanakan menjadi satu Pajak Bumi dan Bangunan (PBB) tunggal pada 1 Januari 1986.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pbb-ipeda-pra1986',
  taxType: 'pbb',
  taxTypeLabel: 'PBB',
  title: 'Era Pajak Hasil Bumi & IPEDA/IREDA (Perpu 11/1959) Sebelum Kelahiran UU PBB 1985',
  legalBasis: 'Perpu Nomor 11 Tahun 1959 & Pasal 24 UU Nomor 12 Tahun 1985',
  effectiveDate: '1959 (Dicabut mulai 1 Januari 1986 oleh UU 12/1985)',
  readMinutes: 4,
  summary:
    'Menelusuri latar belakang lahirnya UU PBB 1985: mengapa Iuran Pembangunan Daerah (IPEDA), Pajak Hasil Bumi, Verponding, dan Pajak Rumah Tangga dilebur agar tidak tumpang tindih.',
  sections: [
    {
      heading: 'Dari tujuh pungutan era kolonial/Orde Lama menjadi satu PBB di 1986',
      paragraphs: [
        'Sebelum tahun 1986, kepemilikan tanah di Indonesia terkena aturan ganda yang rumit warisan kolonial dan era 1950-an: tanah pedesaan dan perkebunan dikenai Pajak Hasil Bumi (Perpu Nomor 11 Tahun 1959) yang dalam pelaksanaannya bernama Iuran Rehabilitasi Daerah (IREDA) lalu Iuran Pembangunan Daerah (IPEDA) dengan dasar penghitungan hasil bersih tahunan/klasifikasi produktivitas tanah (maks. 5% dari hasil bersih).',
        'Selain IPEDA, pemilik properti perkotaan juga dikenai Pajak Rumah Tangga (1908), Verponding Indonesia (1923), Verponding Eropa (1928), hingga Pajak Kekayaan (1932). Keseluruhan pungutan tumpang tindih tersebut resmi dicabut oleh Pasal 24 UU Nomor 12 Tahun 1985 per 1 Januari 1986 dan disatukan dalam satu PBB berbasis NJOP.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Perpu 11/1959 & IPEDA (1959–1985)',
    newHeader: 'UU Nomor 12 Tahun 1985 (PBB Mulai 1986)',
    rows: [
      {
        aspek: 'Dasar pengenaan pajak',
        aturanLama: 'Nilai hasil bersih tahunan tanah (produktivitas hasil bumi / kelas tanah)',
        aturanBaru: 'Nilai Jual Objek Pajak (NJOP) harga pasar wajar bumi & bangunan',
      },
      {
        aspek: 'Jumlah pungutan sejenis atas properti',
        aturanLama: 'Tujuh pungutan terpisah (IPEDA, Verponding, Pajak Rumah Tangga, dll.)',
        aturanBaru: 'Satu pungutan PBB tunggal (tarif 0,5% × NJKP 20%)',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi taksiran IPEDA setara properti bernilai NJOP Rp 200 juta pra-1986',
    scenario:
      'Sebagai perbandingan ilustrasi historis, properti yang setara nilai pasar Rp 200.000.000 tanpa NJOPTKP seragam modern dikenai taksiran ekuivalen IPEDA ~0,1% (Rp 200.000), menggambarkan konsolidasi tujuh pungutan sebelum UU 12/1985.',
    presetRegime: 'pbb_ipeda_pra1986',
    presetInput: {
      pbb: {
        njopBumi: 150000000,
        njopBangunan: 50000000,
        njoptkpPilihan: 0,
        tierRate: 'rendah',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pbbIpedaPra1986Rule: TaxRuleModule<TaxCalculatorInput['pbb']> = {
  regime,
  article,
  calculate(input) {
    const nilaiProperti = Math.max(0, input.njopBumi) + Math.max(0, input.njopBangunan);
    const estYield = Math.round(nilaiProperti * 0.02); // Estimasi sewa/hasil bersih ~2%/thn nilai kapital untuk ilustrasi Perpu 11/1959 (maks 5% hasil bersih = ~0,1% nilai modal)
    const ipeda = Math.round((nilaiProperti * TARIF_SIMULASI_IPEDA) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai taksiran properti (Bumi + Bangunan)', value: nilaiProperti },
      { label: 'Ilustrasi hasil bersih tahunan (~2% nilai tanah — basis Perpu 11/1959)', value: estYield },
      {
        label: 'Estimasi IPEDA / Pajak Hasil Bumi (5% dari hasil bersih ≈ 0,1% nilai modal)',
        formula: `${formatRupiah(nilaiProperti)} x ${formatPersen(TARIF_SIMULASI_IPEDA)}`,
        value: ipeda,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'Simulasi Ekuivalen IPEDA Pra-1986',
      primaryTaxAmount: ipeda,
      effectiveRatePercent: TARIF_SIMULASI_IPEDA,
      takeHomeOrNetLabel: 'Sisa Nilai Setelah Simulasi IPEDA',
      takeHomeOrNetAmount: Math.max(0, nilaiProperti - ipeda),
      steps,
      notes: [
        'Catatan historis: IPEDA / Pajak Hasil Bumi Perpu 11/1959 tidak mengenal konsep NJOPTKP modern maupun NJOP seragam nasional; perhitungan di atas merupakan ekuivalen ilustrasi (5% dari hasil bersih tahunan ~2% nilai properti) untuk perbandingan lintas era.',
      ],
    };
  },
};
