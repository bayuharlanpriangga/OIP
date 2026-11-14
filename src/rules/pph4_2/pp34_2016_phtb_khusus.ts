import {
  CalculationStep,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const sources = [SRC.PP_34_2016, SRC.PP_71_2008, SRC.PP_48_1994];

const regime: TaxRegime = {
  id: 'pph4_2_phtb_khusus',
  taxType: 'pph4_2',
  name: 'PP 34/2016 (PHTB Rumah Sederhana 1%, Kepentingan Umum 0%, & Umum 2,5%)',
  shortName: '2016–Kini (PHTB 0% / 1% / 2,5% PP 34/2016)',
  legalBasis: 'Pasal 2 ayat (1) PP Nomor 34 Tahun 2016 tentang PPh Pengalihan Hak Tanah/Bangunan',
  effectivePeriod: '7 September 2016 – Sekarang',
  isCurrent: true,
  currentScopeLabel: 'Berlaku kini — Developer Rumah Sederhana (1%) & Pembebasan Lahan Pemerintah (0%)',
  summary:
    'Membedakan tiga lapisan tarif PPh Final Pengalihan Hak atas Tanah dan/atau Bangunan (PHTB) di dalam PP 34/2016: 1% khusus pengembang Rumah Sederhana/Rusun Sederhana, 0% pengalihan kepada pemerintah/BUMN/BUMD penugasan umum, dan 2,5% untuk transaksi komersial umum.',
  sources,
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-phtb-khusus',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Tarif Khusus PPh Final PHTB dalam PP 34/2016: 1% Rumah Sederhana & 0% Kepentingan Umum',
  legalBasis: 'Pasal 2 PP Nomor 34 Tahun 2016 jo. PP Nomor 71 Tahun 2008',
  effectiveDate: '7 September 2016',
  readMinutes: 4,
  summary:
    'Tidak semua jual beli tanah/bangunan dikenai PPh Final 2,5%: PP 34/2016 menyediakan tarif khusus 1% bagi pengembang Rumah Sederhana/RSS dan tarif 0% untuk pembebasan lahan proyek kepentingan umum pemerintah.',
  sections: [
    {
      heading: 'Tiga lapisan tarif PHTB PP 34/2016 (turun dari 5% era PP 71/2008)',
      paragraphs: [
        'Sejak 7 September 2016, PP Nomor 34 Tahun 2016 memangkas tarif umum PPh Final penjualan tanah/bangunan dari 5% (era PP 71/2008) menjadi 2,5% dari jumlah bruto nilai pengalihan.',
        'Namun Pasal 2 ayat (1) PP 34/2016 juga menetapkan tarif khusus: 1% atas pengalihan Rumah Sederhana (RS) dan Rumah Susun Sederhana (Rusunami/RSS) yang dilakukan oleh Wajib Pajak yang usaha pokoknya melakukan pengalihan hak atas tanah/bangunan (developer), serta 0% atas pengalihan hak kepada pemerintah, BUMN, atau BUMD yang mendapat penugasan khusus untuk pembangunan bagi kepentingan umum.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 71/2008 (2009–6 Sep 2016)',
    newHeader: 'PP 34/2016 (7 Sep 2016–Kini)',
    rows: [
      {
        aspek: 'Jual beli properti komersial / umum',
        aturanLama: '5% dari nilai bruto pengalihan',
        aturanBaru: '2,5% dari nilai bruto pengalihan',
      },
      {
        aspek: 'Developer Rumah Sederhana / RSS',
        aturanLama: '1% (sudah diberikan sebagai insentif sejak PP 71/2008)',
        aturanBaru: 'Tetap 1% (selaras kriteria rumah bebas PPN)',
      },
      {
        aspek: 'Pengalihan kepada Pemerintah / BUMN-BUMD penugasan khusus',
        aturanLama: 'Dikecualikan/SKB tertentu',
        aturanBaru: 'Tarif eksplisit 0% dalam Pasal 2 ayat (1) huruf c',
      },
    ],
  },
  caseExample: {
    title: 'Penyerahan unit Rumah Sederhana subsidi oleh developer senilai Rp 166 juta',
    scenario:
      'Pengembang menjual 1 unit Rumah Sederhana bersubsidi seharga Rp 166.000.000 sesuai ketentuan PP 34/2016: PPh Final PHTB = 1% × Rp 166.000.000 = Rp 1.660.000 (bukan 2,5%).',
    presetRegime: 'pph4_2_phtb_khusus',
    presetInput: {
      pph4_2: {
        nilaiBruto: 166000000,
        objectType: 'pengalihan_tanah_bangunan',
        skemaPhtbKhusus: 'rumah_sederhana_1',
      },
    },
  },
  sources,
  verifiedAt: '14 November 2026',
};

export const pph42Pp34_2016PhtbKhususRule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const bruto = Math.max(0, input.nilaiBruto);
    const skema = input.skemaPhtbKhusus ?? 'rumah_sederhana_1';

    const rate =
      skema === 'pemerintah_bumn_0' ? 0 : skema === 'rumah_sederhana_1' ? 1 : 2.5;
    const tax = Math.round((bruto * rate) / 100);
    const netReceived = Math.max(0, bruto - tax);

    const labelMap: Record<NonNullable<TaxCalculatorInput['pph4_2']['skemaPhtbKhusus']>, string> = {
      rumah_sederhana_1: 'Rumah Sederhana / Rusun Sederhana oleh Developer (1%)',
      pemerintah_bumn_0: 'Pengalihan kepada Pemerintah / BUMN-BUMD Penugasan Umum (0%)',
      umum_2_5: 'Pengalihan Hak Tanah/Bangunan Komersial Umum (2,5%)',
    };

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto pengalihan hak tanah dan/atau bangunan', value: bruto },
      { label: 'Kategori tarif PHTB PP 34/2016', formula: labelMap[skema], value: rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) terutang',
        formula: `${formatRupiah(bruto)} x ${formatPersen(rate)}`,
        value: tax,
        isHighlight: true,
      },
      { label: 'Hasil bersih penjual setelah PPh PHTB', value: netReceived },
    ];

    return {
      regime,
      primaryTaxLabel: `PPh Final PHTB (${formatPersen(rate)})`,
      primaryTaxAmount: tax,
      effectiveRatePercent: rate,
      takeHomeOrNetLabel: 'Nilai Bersih Penjual',
      takeHomeOrNetAmount: netReceived,
      steps,
      notes: [
        'PP Nomor 34 Tahun 2016 menetapkan 1% untuk pengalihan Rumah Sederhana/Rusun Sederhana oleh WP pengembang (usaha pokok pengalihan properti), 0% untuk pengadaan tanah kepentingan umum pemerintah, dan 2,5% untuk transaksi umum.',
        'PPh Final wajib disetor sendiri sebelum penandatanganan akta PPAT (e-PHTB/validasi DJP).',
      ],
    };
  },
};
