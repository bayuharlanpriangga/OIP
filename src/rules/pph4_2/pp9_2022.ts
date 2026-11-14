import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph4_2_pp9_2022',
  taxType: 'pph4_2',
  name: 'PP 9/2022, PP 34/2017 & PP 34/2016',
  shortName: '2022–Kini (PP 9/2022)',
  legalBasis: 'PP 9/2022 (Konstruksi), PP 34/2017 (Sewa T/B) & PP 34/2016 (PHTB)',
  effectivePeriod: '21 Februari 2022 – Sekarang',
  isCurrent: true,
  summary:
    'Tarif PPh Final Pasal 4(2) terkini: jasa konstruksi 1,75%–6% (PP 9/2022), persewaan tanah/bangunan 10% (PP 34/2017), dan pengalihan hak tanah/bangunan 2,5% (PP 34/2016).',
  sources: [SRC.PP_9_2022, SRC.PP_34_2017, SRC.PP_34_2016],
  verifiedAt: '14 November 2026',
};

const article: TaxArticle = {
  id: 'pph4-2-pp9-2022',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'Tarif Baru PPh Final Jasa Konstruksi (PP 9/2022), Sewa Tanah/Bangunan, dan Pengalihan Properti',
  legalBasis: 'PP Nomor 9 Tahun 2022, PP Nomor 34 Tahun 2017, & PP Nomor 34 Tahun 2016',
  effectiveDate: '21 Februari 2022',
  readMinutes: 6,
  summary:
    'PP 9/2022 menurunkan tarif PPh Final pelaksana konstruksi berkualifikasi kecil menjadi 1,75% dan konsultan konstruksi menjadi 3,5%, melengkapi tarif 10% sewa tanah/bangunan dan 2,5% pengalihan hak properti.',
  sections: [
    {
      heading: 'Penurunan tarif jasa konstruksi dalam PP 9 Tahun 2022',
      paragraphs: [
        'Melalui perubahan kedua atas PP 51/2008, Pemerintah membagi ulang struktur tarif konstruksi agar pelaku usaha bersertifikat (SBU) mendapat insentif lebih ringan: pelaksanaan konstruksi kualifikasi kecil turun dari 2% menjadi 1,75%, sedangkan kualifikasi menengah/besar maupun pekerjaan terintegrasi turun dari 3% menjadi 2,65%.',
        'Untuk jasa konsultansi konstruksi yang memiliki SBU atau sertifikat kompetensi kerja, tarifnya turun dari 4% menjadi 3,5%. Namun bagi penyedia tanpa sertifikat (non-SBU), tarif pelaksana tetap 4% dan konsultan tetap 6%.',
      ],
    },
    {
      heading: 'Persewaan tanah/bangunan 10% dan Pengalihan Hak (PHTB) 2,5%',
      paragraphs: [
        'Atas penghasilan dari persewaan tanah dan/atau bangunan (rumah, ruko, kantor, gudang, lahan kosong), PP 34/2017 (yang secara resmi mencabut PP 29/1996 jo. PP 5/2002 dan berlaku sejak 2 Januari 2018) tetap menetapkan PPh Final 10% dari jumlah bruto nilai sewa termasuk biaya perawatan/keamanan dan perjanjian Bangun Guna Serah (BGS).',
        'Sementara atas penjualan atau pengalihan hak atas tanah dan/atau bangunan, PP 34/2016 (efektif 7 September 2016) menurunkan tarif umum PHTB dari 5% (era PP 71/2008) menjadi 2,5% dari nilai bruto pengalihan (dan 1% khusus untuk rumah sederhana/rusun sederhana).',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'Aturan Lama (PP 51/2008 & PP 71/2008)',
    newHeader: 'Aturan Terkini (PP 9/2022 & PP 34/2016)',
    rows: [
      {
        aspek: 'Pelaksana konstruksi SBU Kecil',
        aturanLama: '2%',
        aturanBaru: '1,75%',
      },
      {
        aspek: 'Pelaksana konstruksi SBU Menengah/Besar',
        aturanLama: '3%',
        aturanBaru: '2,65%',
      },
      {
        aspek: 'Konsultansi konstruksi ber-SBU / tanpa SBU',
        aturanLama: '4% (ber-SBU) / 6% (tanpa SBU)',
        aturanBaru: '3,5% (ber-SBU) / 6% (tanpa SBU)',
      },
      {
        aspek: 'Pengalihan hak tanah & bangunan umum',
        aturanLama: '5% (PP 71/2008, s.d. 6 Sep 2016)',
        aturanBaru: '2,5% (PP 34/2016, sejak 7 Sep 2016)',
      },
      {
        aspek: 'Persewaan tanah dan/atau bangunan',
        aturanLama: '10% (PP 5/2002)',
        aturanBaru: '10% (PP 34/2017, mencabut PP 5/2002)',
      },
    ],
  },
  caseExample: {
    title: 'Kontrak konstruksi ber-SBU kecil senilai Rp 800 juta',
    scenario:
      'Kontraktor kualifikasi kecil bersertifikat SBU mengerjakan renovasi gedung senilai Rp 800.000.000 (belum termasuk PPN).',
    presetRegime: 'pph4_2_pp9_2022',
    presetInput: {
      pph4_2: {
        nilaiBruto: 800000000,
        objectType: 'konstruksi_kecil',
      },
    },
  },
  sources: regime.sources,
  verifiedAt: '14 November 2026',
};

function getCurrentPph4_2Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return { rate: 10, label: 'Persewaan tanah dan/atau bangunan — PP 34/2017 (10%)' };
    case 'konstruksi_kecil':
      return { rate: 1.75, label: 'Pekerjaan konstruksi SBU Kecil — PP 9/2022 (1,75%)' };
    case 'konstruksi_menengah_besar':
      return {
        rate: 2.65,
        label: 'Pekerjaan konstruksi SBU Menengah/Besar atau Terintegrasi — PP 9/2022 (2,65%)',
      };
    case 'konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Pekerjaan konstruksi tanpa SBU — PP 9/2022 (4%)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 3.5, label: 'Jasa konsultansi konstruksi ber-SBU — PP 9/2022 (3,5%)' };
    case 'konsultansi_konstruksi_tanpa_sbu':
      return { rate: 6, label: 'Jasa konsultansi konstruksi tanpa SBU — PP 9/2022 (6%)' };
    case 'pengalihan_tanah_bangunan':
      return { rate: 2.5, label: 'Pengalihan hak tanah & bangunan (umum) — PP 34/2016 (2,5%)' };
  }
}

export const pph4_2Pp9_2022Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getCurrentPph4_2Meta(input.objectType);
    const pphFinal = Math.round((nilaiBruto * meta.rate) / 100);

    const steps: CalculationStep[] = [
      { label: 'Nilai bruto transaksi / kontrak (non-PPN)', value: nilaiBruto },
      { label: 'Tarif PPh Final Pasal 4(2)', formula: meta.label, value: meta.rate, format: 'percent' },
      {
        label: 'PPh Final Pasal 4(2) terutang',
        formula: `${formatRupiah(nilaiBruto)} x ${formatPersen(meta.rate)}`,
        value: pphFinal,
        isHighlight: true,
      },
    ];

    return {
      regime,
      primaryTaxLabel: 'PPh Final Pasal 4(2) Terutang',
      primaryTaxAmount: pphFinal,
      effectiveRatePercent: meta.rate,
      takeHomeOrNetLabel: 'Nilai Bersih Diterima Setelah Pajak',
      takeHomeOrNetAmount: Math.max(0, nilaiBruto - pphFinal),
      steps,
      notes: [
        'Pemotongan bersifat final (tidak dapat dikreditkan di SPT Tahunan) dan tidak dikenai sanksi tambahan 100% jika tidak ber-NPWP.',
      ],
    };
  },
};
