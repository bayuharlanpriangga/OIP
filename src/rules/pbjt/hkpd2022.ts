import {
  CalculationStep,
  PbjtSectorType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pbjt_hkpd_2022',
  taxType: 'pbjt',
  name: 'UU Nomor 1 Tahun 2022 (HKPD)',
  shortName: '2024–Kini (UU HKPD)',
  legalBasis: 'Pasal 50–58 UU Nomor 1 Tahun 2022 tentang HKPD',
  effectivePeriod: '5 Januari 2024 – Sekarang',
  isCurrent: true,
  summary:
    'Mengonsolidasikan Pajak Restoran, Hotel, Parkir, Hiburan, dan Penerangan Jalan menjadi satu jenis PBJT dengan batas maksimal umum 10% (hiburan khusus 40%–75%).',
  sources: [SRC.UU_1_2022_HKPD, SRC.UU_28_2009_PDRD],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pbjt-hkpd-2022',
  taxType: 'pbjt',
  taxTypeLabel: 'PBJT',
  title: 'Konsolidasi Pajak Konsumsi Daerah Menjadi PBJT dan Penurunan Tarif Parkir di UU HKPD',
  legalBasis: 'Pasal 50–58 UU Nomor 1 Tahun 2022 (HKPD)',
  effectiveDate: '5 Januari 2024',
  readMinutes: 5,
  summary:
    'UU HKPD melebur lima pajak konsumsi kabupaten/kota era UU PDRD menjadi Pajak Barang dan Jasa Tertentu (PBJT) dengan tarif paling tinggi 10% dan tarif khusus 40%–75% untuk hiburan malam.',
  sections: [
    {
      heading: 'Penurunan batas tarif parkir dari 30% menjadi 10%',
      paragraphs: [
        'Salah satu perubahan paling terasa dalam UU HKPD adalah penyeragaman batas maksimal PBJT Jasa Parkir menjadi paling tinggi 10%, turun drastis dibandingkan Pajak Parkir pada UU PDRD 28/2009 yang sebelumnya dapat dipungut hingga 30%.',
        'Selain parkir, sektor Makanan dan/atau Minuman (restoran/katering), Jasa Perhotelan, serta Jasa Kesenian dan Hiburan umum juga ditetapkan tarif maksimal 10%. Khusus tarif dasar daerah (Perda), umumnya pemerintah daerah mematok 10% untuk restoran, hotel, dan parkir.',
      ],
    },
    {
      heading: 'Tarif khusus hiburan tertentu (40%–75%) dan tenaga listrik',
      paragraphs: [
        'Untuk jasa hiburan khusus berupa diskotek, karaoke, kelab malam, bar, dan mandi uap/spa, Pasal 58 ayat (2) UU HKPD menetapkan batas bawah paling rendah 40% dan paling tinggi 75%.',
        'Sementara PBJT Tenaga Listrik memiliki batas paling tinggi 10% untuk konsumsi umum, namun dibatasi maksimal 3% untuk listrik industri/pertambangan/migas dan maksimal 1,5% untuk listrik yang dihasilkan sendiri.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'UU PDRD 28/2009 (2010–2023)',
    newHeader: 'UU HKPD 1/2022 (2024–Kini)',
    rows: [
      {
        aspek: 'Struktur nama pajak daerah',
        aturanLama: '5 pajak terpisah (Hotel, Restoran, Hiburan, Parkir, PPJ)',
        aturanBaru: 'Dikonsolidasi menjadi satu jenis: PBJT',
      },
      {
        aspek: 'Batas maksimal Pajak Parkir',
        aturanLama: 'Maksimal 30%',
        aturanBaru: 'Maksimal 10%',
      },
      {
        aspek: 'Hiburan umum (bioskop, konser)',
        aturanLama: 'Maksimal 35%',
        aturanBaru: 'Maksimal 10%',
      },
      {
        aspek: 'Hiburan khusus (karaoke, kelab, spa)',
        aturanLama: 'Maksimal 75% (tanpa batas bawah)',
        aturanBaru: 'Minimal 40% s.d. maksimal 75%',
      },
    ],
  },
  caseExample: {
    title: 'Simulasi tagihan restoran / katering Rp 1.500.000 dengan PBJT 10%',
    scenario:
      'Transaksi makanan dan minuman di restoran sebesar Rp 1.500.000 sebelum pajak daerah di bawah UU HKPD.',
    presetRegime: 'pbjt_hkpd_2022',
    presetInput: {
      pbjt: {
        nilaiTransaksi: 1500000,
        sectorType: 'makanan_minuman',
      },
    },
  },
};

function getHkpdPbjtRate(sector: PbjtSectorType): { rate: number; label: string } {
  switch (sector) {
    case 'makanan_minuman':
      return { rate: 10, label: 'PBJT Makanan & Minuman (batas maks UU HKPD 10%)' };
    case 'perhotelan':
      return { rate: 10, label: 'PBJT Jasa Perhotelan (batas maks UU HKPD 10%)' };
    case 'parkir':
      return { rate: 10, label: 'PBJT Jasa Parkir (turun ke maks 10% di UU HKPD)' };
    case 'hiburan_umum':
      return { rate: 10, label: 'PBJT Kesenian & Hiburan Umum (maks 10% di UU HKPD)' };
    case 'hiburan_khusus':
      return {
        rate: 40,
        label: 'PBJT Hiburan Khusus: diskotek/karaoke/kelab/spa (batas bawah 40% – maks 75%)',
      };
    case 'tenaga_listrik':
      return {
        rate: 10,
        label: 'PBJT Tenaga Listrik umum (maks 10%; industri 3%; sendiri 1,5%)',
      };
  }
}

export const pbjtHkpd2022Rule: TaxRuleModule<TaxCalculatorInput['pbjt']> = {
  regime,
  article,
  calculate(input) {
    const nilaiTransaksi = Math.max(0, input.nilaiTransaksi);
    const meta = getHkpdPbjtRate(input.sectorType);
    const pbjt = Math.round((nilaiTransaksi * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Jumlah pembayaran konsumen (DPP PBJT)', value: nilaiTransaksi },
      { label: 'Batas tarif acuan UU HKPD', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PBJT terutang (dipungut penyedia jasa/barang)',
        formula: `${formatRupiah(nilaiTransaksi)} x ${formatPersen(meta.rate)}`,
        value: pbjt,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PBJT Terutang',
      primaryTaxAmount: pbjt,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Total Dibayar Konsumen',
      takeHomeOrNetAmount: nilaiTransaksi + pbjt,
      steps,
      notes: [
        'Objek yang sudah dikenakan PBJT tidak dikenai PPN agar tidak terjadi pajak berganda.',
        'Besaran tarif aktual di lapangan mengikuti Perda Kabupaten/Kota masing-masing di dalam batas UU HKPD.',
      ],
    };
  },
};
