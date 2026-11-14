import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'bphtb_uu21_1997',
  taxType: 'bphtb',
  name: 'UU Nomor 21 Tahun 1997 jo. Perpu 1/1997',
  shortName: '1998–2000 (UU 21/1997)',
  legalBasis: 'UU Nomor 21 Tahun 1997 jo. Perpu Nomor 1 Tahun 1997 (UU Nomor 1 Tahun 1998)',
  effectivePeriod: '1 Juli 1998 – 31 Desember 2000',
  isCurrent: false,
  summary:
    'Undang-undang BPHTB pertama di Indonesia: tarif tunggal 5% dan NPOPTKP nasional Rp 30 juta (sebelum naik ke Rp 60 juta dan tambahan Rp 300 juta untuk waris di UU 20/2000).',
  sources: [SRC.UU_21_1997, SRC.UU_1_1998, SRC.UU_20_2000],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'bphtb-uu21-1997',
  taxType: 'bphtb',
  taxTypeLabel: 'BPHTB',
  title: 'UU 21/1997: Lahirnya BPHTB dan Penangguhan Krisis 1998 sebelum UU 20/2000',
  legalBasis: 'UU Nomor 21 Tahun 1997 jo. Perpu Nomor 1 Tahun 1997',
  effectiveDate: '1 Juli 1998 (Ditetapkan 29 Mei 1997)',
  readMinutes: 3,
  summary:
    'Mengenal fondasi awal BPHTB dengan NPOPTKP Rp 30 juta yang sempat ditangguhkan akibat krisis moneter sebelum direvisi melalui UU 20/2000.',
  sections: [
    {
      heading: 'Penundaan pemberlakuan melalui Perpu 1/1997 dan NPOPTKP Rp 30 juta',
      paragraphs: [
        'UU Nomor 21 Tahun 1997 ditetapkan pada 29 Mei 1997 sebagai pajak pusat pertama atas perolehan hak atas tanah dan bangunan dengan tarif tunggal 5%, dan semula dijadwalkan berlaku 1 Januari 1998. Menghadapi krisis ekonomi 1997/1998, pemerintah menerbitkan Perpu Nomor 1 Tahun 1997 yang menunda pemberlakuan efektifnya ke 1 Juli 1998.',
        'Pada era UU 21/1997, NPOPTKP ditetapkan seragam secara nasional sebesar Rp 30.000.000 untuk seluruh perolehan hak, termasuk jual beli maupun waris, sebelum akhirnya dinaikkan hingga Rp 60.000.000 (dan Rp 300.000.000 khusus waris/hibah wasiat) melalui UU 20/2000.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU 21/1997 (1998–2000)',
    newHeader: 'UU 20/2000 (2001–2010)',
    rows: [
      {
        aspek: 'Tarif BPHTB',
        aturanLama: '5% dari NPOPKP',
        aturanBaru: 'Tetap 5% dari NPOPKP',
      },
      {
        aspek: 'NPOPTKP Jual Beli',
        aturanLama: 'Rp 30.000.000 (nasional)',
        aturanBaru: 'Maksimal Rp 60.000.000',
      },
      {
        aspek: 'NPOPTKP Waris / Hibah Wasiat',
        aturanLama: 'Sama Rp 30.000.000',
        aturanBaru: 'Maksimal Rp 300.000.000 + diskon pajak 50%',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi pembelian properti Rp 450 juta di era UU 21/1997',
    scenario:
      'Transaksi jual beli properti dengan NPOP Rp 450.000.000 menggunakan NPOPTKP nasional Rp 30 juta.',
    presetRegime: 'bphtb_uu21_1997',
    presetInput: {
      bphtb: {
        hargaTransaksi: 450000000,
        njopObjek: 400000000,
        acquisitionType: 'jual_beli_pertama',
      },
    },
  },
};

export const bphtbUu21_1997Rule: TaxRuleModule<TaxCalculatorInput['bphtb']> = {
  regime,
  article,
  calculate(input) {
    const harga = Math.max(0, input.hargaTransaksi);
    const njop = Math.max(0, input.njopObjek);
    const npop = Math.max(harga, njop);

    const npoptkp = 30000000;
    const npopKenaPajak = Math.max(0, npop - npoptkp);
    const tarif = 5;
    const bphtbTerutang = Math.round((npopKenaPajak * tarif) / 100);
    const effectiveRate = npop > 0 ? (bphtbTerutang / npop) * 100 : 0;

    const steps: CalculationStep[] = [
      { label: 'Harga transaksi / nilai pasar', value: harga },
      { label: 'NJOP PBB objek tanah & bangunan', value: njop },
      { label: 'NPOP (nilai tertinggi antara harga transaksi & NJOP)', value: npop },
      {
        label: 'NPOPTKP Nasional UU 21/1997 (Rp 30 jt)',
        value: -Math.min(npop, npoptkp),
        isNegative: true,
      },
      { label: 'NPOP Kena Pajak (NPOPKP)', value: npopKenaPajak },
      {
        label: 'BPHTB terutang (Tarif 5%)',
        formula: `${formatPersen(tarif)} x ${formatRupiah(npopKenaPajak)}`,
        value: bphtbTerutang,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'BPHTB Terutang',
      primaryTaxAmount: bphtbTerutang,
      effectiveRatePercent: effectiveRate,
      takeHomeOrNetLabel: 'Total Biaya Akuisisi + BPHTB',
      takeHomeOrNetAmount: npop + bphtbTerutang,
      steps,
      notes: [
        'Pada UU 21/1997 (berlaku 1 Juli 1998 setelah ditunda Perpu 1/1997), NPOPTKP seragam Rp 30 juta termasuk untuk waris/hibah wasiat, sebelum dinaikkan dan diberi pengurangan 50% pada UU 20/2000 & PP 111/2000.',
      ],
    };
  },
};
