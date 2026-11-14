import {
  CalculationStep,
  Pph4_2ObjectType,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxRuleModule,
} from '../../types/tax';
import { formatPersen, formatRupiah } from '../../utils/formatters';
import { REGIME_VERIFIED_AT, SRC } from '../sources';

const regime: TaxRegime = {
  id: 'pph4_2_pp34_2016',
  taxType: 'pph4_2',
  name: 'PP 34/2016, PP 51/2008 & PP 34/2017',
  shortName: '2016–2022 (PP 34/2016)',
  legalBasis:
    'PP 34/2016 (PHTB 2,5% sejak 7 Sep 2016), PP 51/2008 (Konstruksi), & PP 34/2017 (Sewa T/B)',
  effectivePeriod: '7 September 2016 – 20 Februari 2022',
  isCurrent: false,
  summary:
    'Masa transisi setelah PP 34/2016 menurunkan PHTB umum menjadi 2,5% (dan PP 34/2017 mencabut PP 5/2002 pada 2018), sementara tarif konstruksi masih memakai PP 51/2008 (2%/3%/4%/6%).',
  sources: [SRC.PP_34_2016, SRC.PP_34_2017, SRC.PP_51_2008],
  verifiedAt: REGIME_VERIFIED_AT,
};

const article: TaxArticle = {
  id: 'pph4-2-pp34-2016',
  taxType: 'pph4_2',
  taxTypeLabel: 'PPh Pasal 4(2) Final',
  title: 'PP 34/2016 & PP 34/2017: Pemangkasan PPh Final Properti 2,5% dan Sewa 10%',
  legalBasis: 'PP Nomor 34 Tahun 2016 (PHTB), PP 34/2017 (Sewa), & PP 51/2008 (Konstruksi)',
  effectiveDate: '7 September 2016',
  readMinutes: 4,
  summary:
    'Periode transisi 2016–2022 yang memangkas tarif Pengalihan Hak Tanah/Bangunan dari 5% menjadi 2,5% serta memperbarui ketentuan sewa tanah/bangunan termasuk BGS sebelum tarif konstruksi turun di 2022.',
  sections: [
    {
      heading: 'Penurunan tarif pengalihan hak tanah/bangunan dari 5% menjadi 2,5%',
      paragraphs: [
        'PP Nomor 34 Tahun 2016 yang diundangkan pada 8 Agustus 2016 dan berlaku 30 hari kemudian (7 September 2016) menurunkan tarif umum PPh Final atas Pengalihan Hak atas Tanah dan/atau Bangunan (PHTB) maupun Perjanjian Pengikatan Jual Beli (PPJB) dari 5% (era PP 71/2008) menjadi 2,5% dari jumlah bruto nilai pengalihan.',
        'Khusus pengalihan rumah sederhana dan rumah susun sederhana oleh pengembang yang memenuhi syarat fasilitas dibebani tarif lebih rendah sebesar 1%, sedangkan pengalihan kepada pemerintah untuk kepentingan umum dikenai tarif 0%.',
      ],
    },
    {
      heading: 'Pembaruan sewa tanah/bangunan lewat PP 34/2017',
      paragraphs: [
        'Mulai 2 Januari 2018, PP Nomor 34 Tahun 2017 menggantikan PP 29/1996 jo. PP 5/2002 dengan mempertahankan tarif 10% final atas persewaan tanah/bangunan sekaligus menegaskan objek Bangun Guna Serah (Build Operate and Transfer/BOT). Sementara tarif konstruksi pada kurun ini masih mengikuti PP 51/2008 (2%–6%) hingga hadirnya PP 9/2022.',
      ],
    },
  ],
  comparisonTable: {
    oldHeader: 'PP 71/2008 (2008–Sep 2016)',
    newHeader: 'PP 34/2016 & PP 34/2017 (2016–2022)',
    rows: [
      {
        aspek: 'Tarif umum PHTB (jual beli properti)',
        aturanLama: '5% dari nilai bruto pengalihan',
        aturanBaru: '2,5% dari nilai bruto pengalihan',
      },
      {
        aspek: 'Sewa tanah/bangunan & BGS',
        aturanLama: '10% (PP 5/2002)',
        aturanBaru: '10% (PP 34/2017, cakupan BGS diperjelas)',
      },
    ],
  },
  caseExample: {
    title: 'Penjualan rumah komersial Rp 1,2 miliar di bawah PP 34/2016',
    scenario:
      'Transaksi jual beli tanah dan bangunan senilai Rp 1.200.000.000 pada periode 2017 dikenai PPh Final PHTB sebesar 2,5% atau Rp 30.000.000 (separuh dari beban Rp 60 juta di era PP 71/2008).',
    presetRegime: 'pph4_2_pp34_2016',
    presetInput: {
      pph4_2: {
        nilaiBruto: 1200000000,
        objectType: 'pengalihan_tanah_bangunan',
      },
    },
  },
};

function getMidPph4_2Meta(objectType: Pph4_2ObjectType): { rate: number; label: string } {
  switch (objectType) {
    case 'sewa_tanah_bangunan':
      return {
        rate: 10,
        label: 'Persewaan tanah/bangunan — PP 5/2002 lalu PP 34/2017 (10%)',
      };
    case 'konstruksi_kecil':
      return { rate: 2, label: 'Pekerjaan konstruksi SBU Kecil — PP 51/2008 (2%)' };
    case 'konstruksi_menengah_besar':
      return { rate: 3, label: 'Pekerjaan konstruksi SBU Menengah/Besar — PP 51/2008 (3%)' };
    case 'konstruksi_tanpa_sbu':
      return { rate: 4, label: 'Pekerjaan konstruksi tanpa SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_sbu':
      return { rate: 4, label: 'Jasa konsultansi konstruksi ber-SBU — PP 51/2008 (4%)' };
    case 'konsultansi_konstruksi_tanpa_sbu':
      return { rate: 6, label: 'Jasa konsultansi konstruksi tanpa SBU — PP 51/2008 (6%)' };
    case 'pengalihan_tanah_bangunan':
      return {
        rate: 2.5,
        label: 'Pengalihan hak tanah/bangunan (umum) — PP 34/2016 (2,5%)',
      };
  }
}

export const pph4_2Pp34_2016Rule: TaxRuleModule<TaxCalculatorInput['pph4_2']> = {
  regime,
  article,
  calculate(input) {
    const nilaiBruto = Math.max(0, input.nilaiBruto);
    const meta = getMidPph4_2Meta(input.objectType);
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
        'PP 34 Tahun 2016 diundangkan 8 Agustus 2016 dan berlaku 30 hari kemudian (7 September 2016), menurunkan tarif umum PHTB dari 5% menjadi 2,5%.',
        'Tarif jasa konstruksi pada periode ini belum berubah hingga berlakunya PP 9 Tahun 2022 pada 21 Februari 2022.',
      ],
    };
  },
};
